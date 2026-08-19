/**
 * Shared like and vote counter — MySQL.
 *
 * Storage is chosen at runtime, so the site works whether or not a
 * database is attached:
 *
 *   1. DATABASE_URL set  → MySQL. Counts survive restarts and redeploys.
 *                          Works with any MySQL 5.7+ or MariaDB, including
 *                          PlanetScale, Aiven, Railway and a plain server.
 *   2. nothing set       → in-memory. Counts ARE shared between every
 *                          visitor, but reset whenever the server restarts,
 *                          which on a free hosting tier happens after
 *                          inactivity. Fine for a first test, not for a
 *                          live campaign.
 *
 * The numbers held here are the real, earned counts only. The
 * presentational starting figures (4,587 / 1,298) are added on the
 * client, so this table always reflects what people actually did.
 */

export const runtime = "nodejs";

type Counts = { likes: number; votes: Record<string, number> };

const VOTE_OPTIONS = ["data", "centres", "december", "buyer"];

const emptyCounts = (): Counts => ({ likes: 0, votes: {} });

/* ---------------- in-memory fallback ---------------- */

const memory: Counts = emptyCounts();

/* ---------------- MySQL ---------------- */

type Pool = {
  query: (sql: string, values?: unknown[]) => Promise<[unknown, unknown]>;
};

let pool: Pool | null = null;
let attempted = false;
let backend: "mysql" | "memory" = "memory";

/** The connection string, on whichever runtime we happen to be on. */
function connectionString(): string | null {
  if (typeof process !== "undefined" && process.env?.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  return null;
}

async function getPool(): Promise<Pool | null> {
  if (pool) return pool;
  if (attempted) return null;
  attempted = true;

  const url = connectionString();
  if (!url) return null;

  try {
    // Imported lazily so the app still builds and runs with no database.
    const mysql = (await import("mysql2/promise")) as unknown as {
      default?: { createPool: (config: unknown) => Pool };
      createPool?: (config: unknown) => Pool;
    };
    const createPool = mysql.createPool ?? mysql.default?.createPool;
    if (!createPool) return null;

    // Hosted MySQL usually requires TLS; a local server usually does not.
    // Turning it on only for remote hosts keeps both cases working.
    const host = (() => {
      try {
        return new URL(url).hostname;
      } catch {
        return "";
      }
    })();
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";

    pool = createPool({
      uri: url,
      connectionLimit: 4,
      ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
    });

    await pool.query(
      `CREATE TABLE IF NOT EXISTS pulse_counts (
         \`key\`  VARCHAR(64) NOT NULL PRIMARY KEY,
         value INT NOT NULL DEFAULT 0
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    );

    backend = "mysql";
    return pool;
  } catch (error) {
    console.error("[pulse] MySQL unavailable, falling back to memory:", error);
    pool = null;
    backend = "memory";
    return null;
  }
}

async function readCounts(): Promise<Counts> {
  const db = await getPool();
  if (!db) return { likes: memory.likes, votes: { ...memory.votes } };

  const [rows] = await db.query("SELECT `key`, value FROM pulse_counts");
  const counts = emptyCounts();
  (rows as { key: string; value: number }[]).forEach((row) => {
    const key = String(row.key);
    const value = Number(row.value) || 0;
    if (key === "likes") counts.likes = value;
    else if (key.startsWith("vote:")) counts.votes[key.slice(5)] = value;
  });
  return counts;
}

async function bump(key: string, delta: number) {
  const db = await getPool();
  if (!db) {
    if (key === "likes") memory.likes = Math.max(0, memory.likes + delta);
    else if (key.startsWith("vote:")) {
      const id = key.slice(5);
      memory.votes[id] = Math.max(0, (memory.votes[id] ?? 0) + delta);
    }
    return;
  }
  // GREATEST keeps a count from ever going negative if a client
  // sends an unlike or a vote change twice.
  await db.query(
    "INSERT INTO pulse_counts (`key`, value) VALUES (?, GREATEST(?, 0)) " +
      "ON DUPLICATE KEY UPDATE value = GREATEST(value + ?, 0)",
    [key, delta, delta]
  );
}

/* ---------------- routes ---------------- */

export async function GET() {
  try {
    const counts = await readCounts();
    return Response.json({ ...counts, storage: backend, stored: backend !== "memory" });
  } catch (error) {
    console.error("[pulse] read failed:", error);
    return Response.json({ ...emptyCounts(), storage: "memory", stored: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: string;
      option?: string;
      previous?: string | null;
    };

    if (body.action === "like") await bump("likes", 1);
    else if (body.action === "unlike") await bump("likes", -1);
    else if (body.action === "vote") {
      const option = String(body.option ?? "");
      if (!VOTE_OPTIONS.includes(option)) {
        return Response.json({ error: "Unknown option" }, { status: 400 });
      }
      // Changing a vote moves it rather than adding a second one.
      if (body.previous && VOTE_OPTIONS.includes(body.previous) && body.previous !== option) {
        await bump(`vote:${body.previous}`, -1);
      }
      if (body.previous !== option) await bump(`vote:${option}`, 1);
    } else {
      return Response.json({ error: "Unknown action" }, { status: 400 });
    }

    const counts = await readCounts();
    return Response.json({ ...counts, storage: backend, stored: backend !== "memory" });
  } catch (error) {
    console.error("[pulse] write failed:", error);
    return Response.json({ error: "Could not record that" }, { status: 500 });
  }
}
