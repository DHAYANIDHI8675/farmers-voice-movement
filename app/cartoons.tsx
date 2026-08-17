/**
 * Campaign cartoons.
 *
 * Every drawing here is inline SVG rather than an image file, for three reasons:
 * it stays sharp on a projector or a printed poster, it adds nothing to page
 * weight, and the colours come from the same palette as the rest of the site.
 *
 * Each cartoon illustrates one specific claim made in the supplied documents.
 * The name of the cartoon is the claim it illustrates.
 */

const INK = "#142317";
const LEAF = "#2f7b3d";
const FOREST = "#0b4428";
const MANGO = "#ffb51b";
const SUN = "#ffd865";
const RUST = "#a93322";
const CREAM = "#fffaf0";
const BARK = "#b98a4e";
const BARK_LIGHT = "#d8a866";

const line = {
  fill: "none",
  stroke: INK,
  strokeWidth: 3.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const solid = {
  stroke: INK,
  strokeWidth: 3.4,
  strokeLinejoin: "round" as const,
};

const serif = "Georgia, 'Noto Serif Tamil', serif";

/* 01 — The gap between the notified price and the price growers report. */
function PriceGap() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 172H224" {...line} />
      {/* A grower reading two very different numbers */}
      <path d="M20 88Q40 66 60 88" {...solid} fill={RUST} />
      <circle cx="40" cy="100" r="14" {...solid} fill={SUN} />
      <circle cx="35" cy="98" r="1.9" fill={INK} />
      <circle cx="45" cy="98" r="1.9" fill={INK} />
      <path d="M34 108q6-5 12 0" {...line} strokeWidth={2.4} />
      <path d="M40 115q-18 5-20 57h40q-2-52-20-57z" {...solid} fill={FOREST} />
      <path d="M53 126l12-16" {...line} strokeWidth={3.4} />
      <text x="72" y="98" fontFamily={serif} fontSize="24" fontWeight="700" fill={RUST}>?</text>
      {/* What was notified */}
      <rect x="88" y="52" width="44" height="120" {...solid} fill={SUN} />
      <text x="110" y="44" textAnchor="middle" fontFamily={serif} fontSize="15" fontWeight="700" fill={INK}>₹15.45</text>
      {/* What growers report receiving */}
      <rect x="142" y="144" width="44" height="28" {...solid} fill={RUST} />
      <text x="164" y="136" textAnchor="middle" fontFamily={serif} fontSize="15" fontWeight="700" fill={RUST}>₹4–5</text>
      {/* The distance between the two */}
      <path d="M194 52h8v92h-8" {...line} stroke={RUST} strokeWidth={3} />
      <text x="220" y="104" textAnchor="middle" fontFamily={serif} fontSize="16" fontWeight="700" fill={RUST}>3×</text>
    </svg>
  );
}

/* 02 — Procurement that cannot be seen: no published centres, counts or dates. */
function ClosedCentre() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 174H224" {...line} />
      <path d="M68 82L146 44l78 38" {...solid} fill={RUST} />
      <rect x="82" y="82" width="128" height="92" {...solid} fill={CREAM} />
      <rect x="102" y="102" width="88" height="72" {...solid} fill="#e8dcc4" />
      <path d="M102 118h88M102 134h88M102 150h88" {...line} strokeWidth={2.2} />
      <rect x="116" y="52" width="60" height="24" rx="4" {...solid} fill={MANGO} />
      <text x="146" y="69" textAnchor="middle" fontFamily={serif} fontSize="19" fontWeight="700" fill={INK}>?</text>
      {/* Padlock */}
      <path d="M139 128v-7a7 7 0 0 1 14 0v7" {...line} stroke={RUST} strokeWidth={3} />
      <rect x="134" y="128" width="24" height="20" rx="3" {...solid} fill={RUST} />
      {/* Grower still waiting outside, fruit unsold */}
      <circle cx="32" cy="108" r="13" {...solid} fill={SUN} />
      <path d="M32 121q-15 4-17 53h34q-2-49-17-53z" {...solid} fill={FOREST} />
      <ellipse cx="58" cy="158" rx="15" ry="13" {...solid} fill={MANGO} />
      <path d="M58 145v-7" {...line} strokeWidth={2.6} />
    </svg>
  );
}

/* 03 — A bearing tree is removed. Years of growth cannot be re-announced. */
function TreeLost() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 174H224" {...line} />
      {/* What is already gone */}
      <rect x="38" y="146" width="36" height="28" {...solid} fill={BARK} />
      <ellipse cx="56" cy="146" rx="18" ry="7" {...solid} fill={BARK_LIGHT} />
      <path d="M48 146l16-6M46 140l18 4" {...line} strokeWidth={2} />
      {/* What is still standing */}
      <rect x="146" y="110" width="20" height="64" {...solid} fill={BARK} />
      <circle cx="126" cy="98" r="27" {...solid} fill={LEAF} />
      <circle cx="186" cy="98" r="27" {...solid} fill={LEAF} />
      <circle cx="156" cy="76" r="36" {...solid} fill={LEAF} />
      <circle cx="138" cy="82" r="8" {...solid} fill={MANGO} strokeWidth={2.6} />
      <circle cx="172" cy="66" r="8" {...solid} fill={MANGO} strokeWidth={2.6} />
      <circle cx="186" cy="100" r="8" {...solid} fill={MANGO} strokeWidth={2.6} />
      {/* The axe */}
      <path d="M96 168l40-30" {...line} stroke={BARK} strokeWidth={7} />
      <path d="M132 128l16 4-4 18-18-10z" {...solid} fill="#9aa3a8" />
      {/* Fruit that never reached a buyer */}
      <circle cx="88" cy="168" r="7" {...solid} fill={MANGO} strokeWidth={2.4} />
      <circle cx="106" cy="172" r="6" {...solid} fill={MANGO} strokeWidth={2.4} />
      <circle cx="206" cy="170" r="7" {...solid} fill={MANGO} strokeWidth={2.4} />
    </svg>
  );
}

/* 04 — One ramp price travels through the whole household. */
function HouseholdShock() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 176H224" {...line} />
      <path d="M34 88L120 40l86 48" {...solid} fill={RUST} />
      <rect x="50" y="88" width="140" height="88" {...solid} fill={CREAM} />
      <path d="M120 88l-9 22 15 16-11 22 8 16" {...line} stroke={RUST} strokeWidth={3} />
      {/* Family inside */}
      <circle cx="74" cy="126" r="12" {...solid} fill={SUN} />
      <path d="M74 138q-14 4-16 38h32q-2-34-16-38z" {...solid} fill={FOREST} />
      <circle cx="99" cy="136" r="9" {...solid} fill={SUN} />
      <path d="M99 145q-11 3-12 31h24q-1-28-12-31z" {...solid} fill={LEAF} />
      {/* Income leaving */}
      <text x="152" y="132" fontFamily={serif} fontSize="30" fontWeight="700" fill={RUST}>₹</text>
      <path d="M176 106v34m0 0l-8-10m8 10l8-10" {...line} stroke={RUST} strokeWidth={3} />
      {/* Work found somewhere else */}
      <rect x="146" y="146" width="34" height="26" rx="3" {...solid} fill={RUST} />
      <path d="M156 146v-6h14v6" {...line} strokeWidth={3} />
    </svg>
  );
}

/* 05 — Paddy has cover before the season. Mango is exposed. */
function PaddyMangoCover() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 174H224" {...line} />
      <path d="M120 24v150" {...line} strokeWidth={2.4} strokeDasharray="7 9" stroke="#9aa39a" />
      {/* Paddy: the cover is already there before the season starts */}
      <path d="M28 62a34 30 0 0 1 68 0z" {...solid} fill={LEAF} />
      <text x="62" y="56" textAnchor="middle" fontFamily={serif} fontSize="15" fontWeight="700" fill={CREAM}>MSP</text>
      <path d="M62 62v18" {...line} />
      <path d="M62 174v-68" {...line} />
      <path d="M62 106q20-2 22-22" {...line} strokeWidth={3} />
      {[[68, 103], [76, 99], [81, 93], [84, 86]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.2" {...solid} fill={MANGO} strokeWidth={2.2} />
      ))}
      <path d="M62 136q20-4 24-20M62 150q-20-4-24-20" {...line} stroke={LEAF} strokeWidth={3.4} />
      {/* Mango: the same cover, only it is not there */}
      <path d="M150 62a34 30 0 0 1 68 0" {...line} stroke={RUST} strokeWidth={3.4} strokeDasharray="9 10" />
      <path d="M184 62v18" {...line} stroke={RUST} strokeWidth={3} strokeDasharray="7 8" />
      <path d="M158 24l-7 14M182 18l-6 14M208 26l-7 14M198 72l-6 14M164 76l-6 14M184 92l-6 14" {...line} stroke="#5b7fa6" strokeWidth={3} />
      <rect x="176" y="146" width="16" height="28" {...solid} fill={BARK} />
      <circle cx="184" cy="132" r="24" {...solid} fill={LEAF} />
      <circle cx="176" cy="128" r="7" {...solid} fill={MANGO} strokeWidth={2.4} />
      <circle cx="193" cy="138" r="7" {...solid} fill={MANGO} strokeWidth={2.4} />
    </svg>
  );
}

/* 06 — Totapuri cannot wait. Paddy can be stored; this fruit cannot. */
function CannotWait() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M120 46V28" {...line} strokeWidth={4} stroke={BARK} />
      <path d="M120 34q18-14 30-4-6 14-30 8z" {...solid} fill={LEAF} strokeWidth={3} />
      <path d="M120 46c34 0 54 30 54 62 0 34-24 58-54 58s-54-24-54-58c0-32 20-62 54-62z" {...solid} fill={MANGO} />
      <circle cx="120" cy="112" r="34" {...solid} fill={CREAM} />
      <path d="M120 84v5M120 135v5M92 112h5M143 112h5" {...line} strokeWidth={2.6} />
      <path d="M120 112V92M120 112l17 10" {...line} stroke={RUST} strokeWidth={4} />
      <circle cx="120" cy="112" r="4" fill={INK} />
      <path d="M40 84q-8 26 0 52M28 74q-12 36 0 72" {...line} stroke={RUST} strokeWidth={3} />
      <path d="M200 84q8 26 0 52M212 74q12 36 0 72" {...line} stroke={RUST} strokeWidth={3} />
    </svg>
  );
}

/* 07 — Solution: the market made visible. Daily boards, published data. */
function PriceBoard() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 176H224" {...line} />
      <rect x="58" y="116" width="9" height="60" {...solid} fill={BARK} />
      <rect x="173" y="116" width="9" height="60" {...solid} fill={BARK} />
      <rect x="34" y="38" width="172" height="82" rx="5" {...solid} fill={FOREST} />
      <rect x="48" y="54" width="82" height="9" rx="4" fill={CREAM} />
      <rect x="48" y="74" width="98" height="9" rx="4" fill={CREAM} />
      <rect x="48" y="94" width="70" height="9" rx="4" fill={CREAM} />
      <rect x="150" y="52" width="42" height="13" rx="3" fill={MANGO} />
      <rect x="158" y="72" width="34" height="13" rx="3" fill={MANGO} />
      <rect x="132" y="92" width="60" height="13" rx="3" fill={MANGO} />
      {/* People who can now read the price before selling */}
      <circle cx="88" cy="142" r="12" {...solid} fill={SUN} />
      <path d="M88 154v22M88 176h-10M88 176h10" {...line} />
      <circle cx="118" cy="148" r="10" {...solid} fill={SUN} />
      <path d="M118 158v18" {...line} />
    </svg>
  );
}

/* 08 — Solution: a buyer within reach of the orchard, paying on a written date. */
function BuyerAtTheGate() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 176H224" {...line} />
      <rect x="76" y="70" width="106" height="76" rx="5" {...solid} fill={MANGO} />
      <path d="M76 100h106M112 70v76M148 70v76" {...line} strokeWidth={2.4} />
      <path d="M30 104h46v42H30z" {...solid} fill={RUST} />
      <rect x="38" y="112" width="26" height="18" rx="2" {...solid} fill={CREAM} strokeWidth={2.6} />
      <circle cx="58" cy="156" r="14" {...solid} fill={INK} />
      <circle cx="58" cy="156" r="5" fill={CREAM} />
      <circle cx="158" cy="156" r="14" {...solid} fill={INK} />
      <circle cx="158" cy="156" r="5" fill={CREAM} />
      <circle cx="94" cy="86" r="9" {...solid} fill={SUN} strokeWidth={2.6} />
      <circle cx="130" cy="86" r="9" {...solid} fill={SUN} strokeWidth={2.6} />
      <circle cx="166" cy="86" r="9" {...solid} fill={SUN} strokeWidth={2.6} />
      {/* Payment, on a date that is written down */}
      <rect x="190" y="106" width="38" height="24" rx="3" {...solid} fill={LEAF} />
      <text x="209" y="124" textAnchor="middle" fontFamily={serif} fontSize="16" fontWeight="700" fill={CREAM}>₹</text>
    </svg>
  );
}

/* 09 — Solution: a price fixed in December, before the grower spends. */
function PriceBeforeFlowering() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 178H224" {...line} />
      <path d="M22 172q10-58 66-72" {...line} stroke={BARK} strokeWidth={7} />
      <path d="M44 138q-14-6-14-18M62 122q-16-4-18-16M84 110q-14-8-12-20" {...line} stroke={LEAF} strokeWidth={3} />
      {[
        [30, 116],
        [44, 100],
        [66, 96],
        [88, 88],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="8" {...solid} fill={CREAM} strokeWidth={2.6} />
          <circle cx={cx} cy={cy} r="3" fill={MANGO} />
        </g>
      ))}
      <rect x="128" y="56" width="88" height="92" rx="7" {...solid} fill={CREAM} />
      <path d="M128 82h88" {...line} strokeWidth={3} />
      <path d="M128 63a7 7 0 0 1 7-7h74a7 7 0 0 1 7 7v19h-88z" fill={RUST} />
      <text x="172" y="77" textAnchor="middle" fontFamily={serif} fontSize="16" fontWeight="700" fill={CREAM}>DEC</text>
      <text x="172" y="126" textAnchor="middle" fontFamily={serif} fontSize="38" fontWeight="700" fill={INK}>₹</text>
      <circle cx="172" cy="114" r="26" {...line} stroke={RUST} strokeWidth={3} />
    </svg>
  );
}

/* 10 — Solution: fruit becomes many products, and the value stays local. */
function ValueChain() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 168H224" {...line} />
      <path d="M40 68V54" {...line} strokeWidth={3.4} stroke={BARK} />
      <path d="M40 58q16-12 26-3-5 12-26 7z" {...solid} fill={LEAF} strokeWidth={2.8} />
      <path d="M40 68c19 0 29 19 29 41 0 21-12 33-29 33s-29-12-29-33c0-22 10-41 29-41z" {...solid} fill={MANGO} />
      <path d="M84 110h26m0 0l-9-8m9 8l-9 8" {...line} stroke={RUST} strokeWidth={3} />
      {/* Juice */}
      <rect x="122" y="88" width="30" height="56" rx="7" {...solid} fill={SUN} />
      <rect x="131" y="72" width="12" height="16" {...solid} fill={SUN} strokeWidth={2.6} />
      <rect x="128" y="62" width="18" height="12" rx="2" {...solid} fill={RUST} strokeWidth={2.6} />
      {/* Dried fruit */}
      <path d="M164 128a14 14 0 0 1 28 0z" {...solid} fill={MANGO} strokeWidth={2.8} />
      <path d="M164 110a14 14 0 0 1 28 0z" {...solid} fill={MANGO} strokeWidth={2.8} />
      <path d="M164 92a14 14 0 0 1 28 0z" {...solid} fill={MANGO} strokeWidth={2.8} />
      {/* Kernel oil */}
      <rect x="200" y="96" width="30" height="48" rx="7" {...solid} fill={LEAF} />
      <rect x="207" y="84" width="16" height="12" rx="2" {...solid} fill={RUST} strokeWidth={2.6} />
    </svg>
  );
}

/* 11 — Solution: the people who grow it are in the room when it is decided. */
function DirectConsultation() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <rect x="40" y="122" width="160" height="15" rx="4" {...solid} fill={BARK} />
      <path d="M62 137v38M178 137v38" {...line} stroke={BARK} strokeWidth={6} />
      <circle cx="72" cy="82" r="15" {...solid} fill={SUN} />
      <path d="M72 97q-16 4-18 25h36q-2-21-18-25z" {...solid} fill={LEAF} />
      <circle cx="106" cy="92" r="12" {...solid} fill={SUN} />
      <path d="M106 104q-13 3-15 18h30q-2-15-15-18z" {...solid} fill={RUST} />
      <circle cx="134" cy="92" r="12" {...solid} fill={SUN} />
      <path d="M134 104q-13 3-15 18h30q-2-15-15-18z" {...solid} fill={FOREST} />
      <circle cx="168" cy="82" r="15" {...solid} fill={SUN} />
      <path d="M168 97q-16 4-18 25h36q-2-21-18-25z" {...solid} fill={MANGO} />
      <rect x="98" y="112" width="44" height="11" rx="2" {...solid} fill={CREAM} strokeWidth={2.4} />
      <path d="M28 30h56a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6H50l-12 12V64h-10a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6z" {...solid} fill={CREAM} />
      <path d="M40 42h32M40 52h20" {...line} strokeWidth={2.6} />
      <path d="M212 30h-56a6 6 0 0 0-6 6v22a6 6 0 0 0 6 6h34l12 12V64h10a6 6 0 0 0 6-6V36a6 6 0 0 0-6-6z" {...solid} fill={MANGO} />
      <path d="M200 42h-32M200 52h-20" {...line} strokeWidth={2.6} />
    </svg>
  );
}

/* 12 — Sharing one verified fact is itself an action. */
function SpreadTheWord() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M56 84l84-34v104L56 120z" {...solid} fill={RUST} />
      <rect x="34" y="82" width="24" height="40" rx="6" {...solid} fill={RUST} />
      <path d="M40 122h14v20a7 7 0 0 1-14 0z" {...solid} fill={FOREST} />
      <circle cx="96" cy="100" r="16" {...solid} fill={MANGO} strokeWidth={3} />
      <path d="M96 84v-8" {...line} strokeWidth={2.6} stroke={LEAF} />
      <path d="M158 76q14 24 0 48M180 62q24 38 0 76M202 48q34 52 0 104" {...line} stroke={FOREST} strokeWidth={3.4} />
    </svg>
  );
}

/* 13 — The movement's promise: we stand for you. */
function StandTogether() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 176H224" {...line} />
      <rect x="112" y="92" width="17" height="48" {...solid} fill={BARK} />
      <circle cx="120" cy="70" r="38" {...solid} fill={LEAF} />
      <circle cx="102" cy="60" r="8" {...solid} fill={MANGO} strokeWidth={2.6} />
      <circle cx="136" cy="76" r="8" {...solid} fill={MANGO} strokeWidth={2.6} />
      <circle cx="120" cy="46" r="8" {...solid} fill={MANGO} strokeWidth={2.6} />
      <circle cx="52" cy="118" r="15" {...solid} fill={SUN} />
      <path d="M52 133q-17 5-19 43h38q-2-38-19-43z" {...solid} fill={RUST} />
      <circle cx="120" cy="112" r="15" {...solid} fill={SUN} />
      <path d="M120 127q-17 5-19 49h38q-2-44-19-49z" {...solid} fill={FOREST} />
      <circle cx="188" cy="118" r="15" {...solid} fill={SUN} />
      <path d="M188 133q-17 5-19 43h38q-2-38-19-43z" {...solid} fill={MANGO} />
      <path d="M70 144l32-6M138 138l32 6" {...line} strokeWidth={4} />
    </svg>
  );
}

/* 14 — The poll: one household, one clear first priority. */
function BallotBox() {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-hidden="true">
      <path d="M16 178H224" {...line} />
      <rect x="56" y="104" width="128" height="74" rx="6" {...solid} fill={FOREST} />
      <path d="M56 130h128" {...line} stroke={CREAM} strokeWidth={2.6} />
      <path d="M92 156l12 12 26-28" {...line} stroke={MANGO} strokeWidth={5} />
      <rect x="92" y="94" width="56" height="12" rx="6" {...solid} fill={INK} />
      <rect x="102" y="34" width="40" height="56" rx="3" {...solid} fill={CREAM} transform="rotate(-9 122 62)" />
      <path d="M104 56l8 9 18-20" {...line} stroke={LEAF} strokeWidth={4} />
      <path d="M170 60q22 6 22 30" {...line} stroke={RUST} strokeWidth={3} />
      <path d="M186 84l6 10 8-8" {...line} stroke={RUST} strokeWidth={3} />
    </svg>
  );
}

const artwork = {
  priceGap: PriceGap,
  closedCentre: ClosedCentre,
  treeLost: TreeLost,
  householdShock: HouseholdShock,
  paddyMangoCover: PaddyMangoCover,
  cannotWait: CannotWait,
  priceBoard: PriceBoard,
  buyerAtTheGate: BuyerAtTheGate,
  priceBeforeFlowering: PriceBeforeFlowering,
  valueChain: ValueChain,
  directConsultation: DirectConsultation,
  spreadTheWord: SpreadTheWord,
  standTogether: StandTogether,
  ballotBox: BallotBox,
};

export type CartoonName = keyof typeof artwork;

export function Cartoon({ name, className = "" }: { name: CartoonName; className?: string }) {
  const Art = artwork[name];
  // Decorative: the adjacent heading and body text already carry the meaning.
  return (
    <span className={`cartoon ${className}`.trim()} aria-hidden="true">
      <Art />
    </span>
  );
}
