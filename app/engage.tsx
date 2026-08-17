"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Cartoon } from "./cartoons";
import { SectionAudio } from "./audio";
import { ShareCardMaker } from "./sharecard";

export type Language = "en" | "ta";
type Bilingual = Record<Language, string>;

/* ------------------------------------------------------------------ *
 * Where the counts live
 *
 * Likes and votes are kept in this browser only. Nothing is sent
 * anywhere, so the numbers are honest about what they are: this
 * device's own tally. To make them a shared, district-wide count,
 * replace readStore/writeStore with calls to a real endpoint — every
 * other part of this file stays the same.
 * ------------------------------------------------------------------ */

const STORE_KEY = "farmers-voice-pulse-v1";

/* ------------------------------------------------------------------ *
 * Starting counts
 *
 * The counters open at these figures and a visitor's own like or vote is
 * added on top. They are a presentational baseline, not a measured tally
 * of real supporters. Set both to 0 to show only genuine counts.
 * ------------------------------------------------------------------ */
export const BASE_LIKES = 4587;

export const pollOptions: { id: string; base: number; label: Bilingual }[] = [
  { id: "data", base: 495, label: { en: "Publish procurement data every week", ta: "வாரந்தோறும் கொள்முதல் விவரம் வெளியிட வேண்டும்" } },
  { id: "centres", base: 372, label: { en: "A purchase centre in every mango block", ta: "ஒவ்வொரு மாம்பழ வட்டாரத்திலும் கொள்முதல் மையம்" } },
  { id: "december", base: 268, label: { en: "Announce the price in December, before flowering", ta: "பூக்கும் முன், டிசம்பரில் விலை அறிவிக்க வேண்டும்" } },
  { id: "buyer", base: 163, label: { en: "A permanent buyer and grower ownership", ta: "நிரந்தர வாங்குபவரும் விவசாயிகள் உரிமைப் பங்கும்" } },
];

export const BASE_VOTES = pollOptions.reduce((sum, option) => sum + option.base, 0);

type Store = { likes: number; liked: boolean; votes: Record<string, number>; myVote: string | null };

const emptyStore: Store = { likes: 0, liked: false, votes: {}, myVote: null };

function readStore(): Store {
  if (typeof window === "undefined") return emptyStore;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return emptyStore;
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      likes: Number(parsed.likes) || 0,
      liked: Boolean(parsed.liked),
      votes: parsed.votes && typeof parsed.votes === "object" ? parsed.votes : {},
      myVote: typeof parsed.myVote === "string" ? parsed.myVote : null,
    };
  } catch {
    return emptyStore;
  }
}

function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* Storage can be full or blocked. The page still works without it. */
  }
}

/* A tiny subscribable store. The server always renders the empty state,
   then the browser swaps in the saved counts on hydration. */
let cache: Store | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Store {
  if (!cache) cache = readStore();
  return cache;
}

const getServerSnapshot = (): Store => emptyStore;

function commit(next: Store) {
  cache = next;
  writeStore(next);
  listeners.forEach((listener) => listener());
}

export function useMovementPulse() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleLike = useCallback(() => {
    const current = getSnapshot();
    commit(
      current.liked
        ? { ...current, liked: false, likes: Math.max(0, current.likes - 1) }
        : { ...current, liked: true, likes: current.likes + 1 }
    );
  }, []);

  const castVote = useCallback((id: string) => {
    const current = getSnapshot();
    if (current.myVote === id) return;
    const votes = { ...current.votes };
    if (current.myVote) votes[current.myVote] = Math.max(0, (votes[current.myVote] ?? 1) - 1);
    votes[id] = (votes[id] ?? 0) + 1;
    commit({ ...current, votes, myVote: id });
  }, []);

  const reset = useCallback(() => commit(emptyStore), []);

  // The baseline is added here, at the point of display, so the stored
  // numbers stay a clean record of what this visitor actually did.
  const votes: Record<string, number> = {};
  pollOptions.forEach((option) => {
    votes[option.id] = option.base + (store.votes[option.id] ?? 0);
  });
  const totalVotes = Object.values(votes).reduce((sum, n) => sum + n, 0);

  return { ...store, votes, likes: BASE_LIKES + store.likes, totalVotes, toggleLike, castVote, reset };
}

/* Reading window.location during render would break server rendering,
   so it is read the same way: empty on the server, real in the browser. */
const noopSubscribe = () => () => {};

function useCurrentUrl() {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.location.href,
    () => ""
  );
}

export const formatCount = (value: number) => new Intl.NumberFormat("en-IN").format(value);

/* ------------------------------------------------------------------ *
 * The pulse ticker
 *
 * Fixed to the very top of the window, above the sticky header, so the
 * live counts and the tagline stay in view at every scroll position.
 * ------------------------------------------------------------------ */

export function PulseTicker({ lang, likes, votes }: { lang: Language; likes: number; votes: number }) {
  const ta = lang === "ta";

  const items: { text: string; strong?: boolean }[] = [
    { text: ta ? "நாங்கள் உங்களுக்காக நிற்கிறோம்" : "WE STAND FOR YOU", strong: true },
    { text: ta ? `${formatCount(likes)} விருப்பங்கள்` : `${formatCount(likes)} ${likes === 1 ? "LIKE" : "LIKES"}`, strong: true },
    { text: ta ? `${formatCount(votes)} வாக்குகள்` : `${formatCount(votes)} ${votes === 1 ? "VOTE" : "VOTES"}`, strong: true },
    { text: ta ? "அறிவிக்கப்பட்ட விலை ₹15.45 · கூறப்படும் விலை ₹4–5" : "NOTIFIED ₹15.45 · REPORTED ₹4–5" },
    { text: ta ? "கிருஷ்ணகிரி + தருமபுரி: 51,000 ஹெக்டேர் மாம்பழம்" : "KRISHNAGIRI + DHARMAPURI: 51,000 HECTARES OF MANGO" },
    { text: ta ? "2,13,023 சிறு மற்றும் குறு விவசாயிகள்" : "2,13,023 SMALL AND MARGINAL FARMERS" },
    { text: ta ? "மாம்பழம் ஒரு நாள் கூட காத்திருக்காது" : "MANGO CANNOT WAIT EVEN ONE DAY" },
    { text: ta ? "அமைதியான · கட்சி சார்பற்ற · ஆதார வழி" : "PEACEFUL · NON-PARTISAN · EVIDENCE-LED" },
  ];

  const set = (key: string) => (
    <div className="pulse-set" key={key}>
      {items.map((item, index) => (
        <span className={item.strong ? "pulse-item pulse-strong" : "pulse-item"} key={`${key}-${index}`}>
          {item.text}
          <i>✦</i>
        </span>
      ))}
    </div>
  );

  return (
    <div className="pulse-ticker">
      <p className="pulse-reader-summary">
        {ta
          ? `இயக்கத்தின் தற்போதைய எண்ணிக்கை: ${formatCount(likes)} விருப்பங்கள், ${formatCount(votes)} வாக்குகள்.`
          : `Movement count so far: ${formatCount(likes)} likes and ${formatCount(votes)} votes.`}
      </p>
      <div className="pulse-track" aria-hidden="true">
        {set("a")}
        {set("b")}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Like and share
 * ------------------------------------------------------------------ */

function shareText(lang: Language) {
  return lang === "ta"
    ? "மாம்பழ விவசாயிகளுக்கு நியாயமான விலை அமைப்பு வேண்டும். அறிவிக்கப்பட்ட விலை ₹15.45; விவசாயிகளுக்கு கிடைப்பது ₹4–5. ஆதாரங்களைப் படியுங்கள், குரல் கொடுங்கள்:"
    : "Mango growers were notified ₹15.45/kg. They report receiving ₹4–5. Read the evidence and add your voice:";
}

export function LikeBar({
  lang,
  likes,
  liked,
  votes,
  onLike,
}: {
  lang: Language;
  likes: number;
  liked: boolean;
  votes: number;
  onLike: () => void;
}) {
  const ta = lang === "ta";
  const [copied, setCopied] = useState(false);
  const url = useCurrentUrl();

  const message = `${shareText(lang)} ${url}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard permission refused; the share links below still work. */
    }
  }

  const channels = [
    { key: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(message)}` },
    { key: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText(lang))}` },
    { key: "x", label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText(lang))}&url=${encodeURIComponent(url)}` },
    { key: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="like-bar" id="support">
      <div className="like-bar-art">
        <Cartoon name="standTogether" />
      </div>
      <div className="like-bar-copy">
        <p className="eyebrow light">{ta ? "உங்கள் ஆதரவைப் பதிவு செய்யுங்கள்" : "ADD YOUR SUPPORT"}</p>
        <h3>{ta ? "நாங்கள் உங்களுக்காக நிற்கிறோம்." : "We stand for you."}</h3>
        <p>
          {ta
            ? "ஒரு விருப்பம் ஒரு எண். ஆனால் பல ஆயிரம் விருப்பங்கள் ஒரு பொது ஆதரவின் அளவைக் காட்டுகின்றன. விருப்பம் அளித்து, ஒரு நண்பருக்கு அனுப்புங்கள்."
            : "One like is a number. Thousands of them are a measurable public record. Add yours, then send it to one person who has not seen it."}
        </p>
        <div className="like-actions">
          <button className={liked ? "like-button is-liked" : "like-button"} onClick={onLike} aria-pressed={liked}>
            <span className="like-heart" aria-hidden="true">♥</span>
            <span className="like-count">{formatCount(likes)}</span>
            <span className="like-word">{liked ? (ta ? "விருப்பம் அளித்தீர்கள்" : "Liked") : ta ? "விருப்பம்" : "Like"}</span>
          </button>
          <div className="like-tally">
            <strong>{formatCount(votes)}</strong>
            <span>{ta ? "வாக்குகள் பதிவாகின" : "votes cast"}</span>
          </div>
        </div>
        <div className="share-channels">
          {channels.map((channel) => (
            <a key={channel.key} className={`chip chip-${channel.key}`} href={channel.href} target="_blank" rel="noreferrer">
              {channel.label}
            </a>
          ))}
          <button className="chip chip-copy" onClick={copyLink}>
            {copied ? (ta ? "நகலெடுக்கப்பட்டது ✓" : "Copied ✓") : ta ? "செய்தியை நகலெடு" : "Copy message"}
          </button>
        </div>
        <small className="like-note">
          {ta
            ? "எண்ணிக்கை ஒரு தொடக்க அளவிலிருந்து காட்டப்படுகிறது; உங்கள் விருப்பமும் வாக்கும் அதனுடன் சேர்த்து இந்த சாதனத்தில் சேமிக்கப்படுகின்றன. அனைவருக்கும் பொதுவான உண்மையான எண்ணிக்கைக்கு சேவையக இணைப்பு தேவை."
            : "The counters open at a starting figure, and your own like or vote is added on top and saved on this device. A shared, fully measured count needs a server connection."}
        </small>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Hero engagement card
 *
 * Sits in the open space above the hero artwork, so the three things a
 * visitor can do — vote, like, share — are visible before any scrolling.
 * ------------------------------------------------------------------ */

/** Counts a figure up to its target, and re-counts whenever it changes. */
function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const start = from.current;
    from.current = target;
    if (start === target) return;
    let frame = 0;
    const began = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - began) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export function HeroPulse({
  lang,
  likes,
  liked,
  votes,
  voteCounts,
  myVote,
  onLike,
}: {
  lang: Language;
  likes: number;
  liked: boolean;
  votes: number;
  voteCounts: Record<string, number>;
  myVote: string | null;
  onLike: () => void;
}) {
  const ta = lang === "ta";
  const [copied, setCopied] = useState(false);
  const url = useCurrentUrl();
  const shownLikes = useCountUp(likes);
  const shownVotes = useCountUp(votes);

  // Which demand is currently ahead, straight from the live vote counts.
  const leading = pollOptions.reduce((best, option) =>
    (voteCounts[option.id] ?? 0) > (voteCounts[best.id] ?? 0) ? option : best
  );
  const leadingShare = votes > 0 ? Math.round(((voteCounts[leading.id] ?? 0) / votes) * 100) : 0;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${shareText(lang)} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard blocked; the WhatsApp link beside this still works. */
    }
  }

  return (
    <aside className="hero-pulse">
      <p className="hero-pulse-tag">
        <span aria-hidden="true">✦</span>
        {ta ? "எங்களுக்காக வாக்களியுங்கள்" : "Vote for us"}
      </p>

      <div className="hero-pulse-figures">
        <div>
          <strong>{formatCount(shownLikes)}</strong>
          <span>{ta ? "விருப்பங்கள்" : likes === 1 ? "like" : "likes"}</span>
        </div>
        <div>
          <strong>{formatCount(shownVotes)}</strong>
          <span>{ta ? "வாக்குகள்" : votes === 1 ? "vote" : "votes"}</span>
        </div>
      </div>

      <div className="hero-pulse-leading">
        <p>
          <span className="hero-pulse-dot" aria-hidden="true" />
          {ta ? "தற்போது முன்னிலையில்" : "Leading right now"}
        </p>
        <strong>{leading.label[lang]}</strong>
        <div className="hero-pulse-bar" role="img" aria-label={`${leadingShare}%`}>
          <span style={{ width: `${leadingShare}%` }} />
        </div>
        <em>{leadingShare}%</em>
      </div>

      <div className="hero-pulse-actions">
        <button className={liked ? "hero-like is-liked" : "hero-like"} onClick={onLike} aria-pressed={liked}>
          <span className="like-heart" aria-hidden="true">♥</span>
          {liked ? (ta ? "விருப்பம் அளித்தீர்கள்" : "Liked") : ta ? "விருப்பம்" : "Like"}
        </button>
        <a className={myVote ? "hero-vote is-done" : "hero-vote"} href="#act">
          {myVote ? (ta ? "வாக்கு பதிவானது ✓" : "Voted ✓") : ta ? "வாக்களிக்க" : "Vote"}
          {!myVote && <span aria-hidden="true">↗</span>}
        </a>
      </div>

      <div className="hero-pulse-share">
        <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText(lang)} ${url}`)}`} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <button onClick={copyLink}>{copied ? (ta ? "நகலெடுக்கப்பட்டது ✓" : "Copied ✓") : ta ? "இணைப்பை நகலெடு" : "Copy link"}</button>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ *
 * The voting box
 * ------------------------------------------------------------------ */

export function VotingBox({
  lang,
  votes,
  myVote,
  total,
  onVote,
}: {
  lang: Language;
  votes: Record<string, number>;
  myVote: string | null;
  total: number;
  onVote: (id: string) => void;
}) {
  const ta = lang === "ta";

  return (
    <div className="vote-box">
      <div className="vote-head">
        <Cartoon name="ballotBox" className="vote-art" />
        <div>
          <p className="eyebrow">{ta ? "பொது வாக்கெடுப்பு" : "PUBLIC VOTE"}</p>
          <h3>{ta ? "எது முதலில் நடக்க வேண்டும்?" : "What should happen first?"}</h3>
          <p className="vote-intro">
            {ta
              ? "நான்கு கோரிக்கைகளும் ஆவணங்களில் உள்ளன. எதற்கு முதல் இடம் தர வேண்டும் என்பதைத் தேர்ந்தெடுங்கள். எப்போது வேண்டுமானாலும் மாற்றலாம்."
              : "All four demands appear in the supplied documents. Choose the one you would put first. You can change your answer at any time."}
          </p>
        </div>
      </div>

      <div className="vote-options" role="group" aria-label={ta ? "வாக்கு விருப்பங்கள்" : "Vote options"}>
        {pollOptions.map((option) => {
          const count = votes[option.id] ?? 0;
          const share = total > 0 ? Math.round((count / total) * 100) : 0;
          const chosen = myVote === option.id;
          return (
            <button
              key={option.id}
              className={chosen ? "vote-option is-chosen" : "vote-option"}
              onClick={() => onVote(option.id)}
              aria-pressed={chosen}
            >
              <span className="vote-fill" style={{ width: `${share}%` }} aria-hidden="true" />
              <span className="vote-mark" aria-hidden="true">{chosen ? "✓" : ""}</span>
              <span className="vote-label">{option.label[lang]}</span>
              <span className="vote-share">{total > 0 ? `${share}%` : "—"}</span>
            </button>
          );
        })}
      </div>

      <div className="vote-foot">
        <strong>{formatCount(total)}</strong>
        <span>{ta ? "மொத்த வாக்குகள்" : total === 1 ? "vote so far" : "votes so far"}</span>
        {myVote && <em>{ta ? "உங்கள் வாக்கு பதிவாகிவிட்டது" : "Your vote is recorded"}</em>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Myths and facts
 * ------------------------------------------------------------------ */

const myths: { myth: Bilingual; fact: Bilingual }[] = [
  {
    myth: { en: "A price was announced, so the problem is solved.", ta: "விலை அறிவிக்கப்பட்டுவிட்டது, எனவே பிரச்சினை தீர்ந்தது." },
    fact: {
      en: "The intervention price reached the belt after harvest had already begun. A price that arrives after the fruit is sold cannot change what the grower received.",
      ta: "அறுவடை தொடங்கிய பிறகே தலையீட்டு விலை இப்பகுதியை எட்டியது. பழம் விற்ற பிறகு வரும் விலை, விவசாயிக்கு கிடைத்ததை மாற்றாது.",
    },
  },
  {
    myth: { en: "Prices are low because the fruit is poor quality.", ta: "பழத்தின் தரம் குறைவு என்பதால்தான் விலை குறைவு." },
    fact: {
      en: "Growers report the same low ramp price across grades. That is exactly why the demand is for grade-wise quantity and price data to be published every week.",
      ta: "அனைத்து தரங்களுக்கும் ஒரே குறைந்த விலையே கிடைப்பதாக விவசாயிகள் தெரிவிக்கின்றனர். அதனால்தான் தரவாரியான அளவு மற்றும் விலை விவரங்களை வாரந்தோறும் வெளியிட வேண்டும் என்பது கோரிக்கை.",
    },
  },
  {
    myth: { en: "This movement is against paddy farmers.", ta: "இந்த இயக்கம் நெல் விவசாயிகளுக்கு எதிரானது." },
    fact: {
      en: "The comparison is crop to crop, not region to region. Nothing is asked to be taken from paddy. The ask is to build the same kind of machinery for mango.",
      ta: "இது பயிர்-பயிர் ஒப்பீடு; பகுதி-பகுதி ஒப்பீடு அல்ல. நெல்லிலிருந்து எதையும் எடுக்கக் கோரவில்லை. மாம்பழத்திற்கும் அதே போன்ற அமைப்பை உருவாக்க வேண்டும் என்பதே கோரிக்கை.",
    },
  },
  {
    myth: { en: "Farmers can simply hold stock and wait for a better price.", ta: "விவசாயிகள் சரக்கை வைத்திருந்து நல்ல விலைக்குக் காத்திருக்கலாம்." },
    fact: {
      en: "Paddy can be stored for months. Totapuri cannot. Once the fruit is down, the grower is negotiating against a clock, and everyone at the ramp knows it.",
      ta: "நெல்லை மாதக்கணக்கில் சேமிக்கலாம்; தோத்தாபுரியை முடியாது. பழம் அறுவடையானதும் விவசாயி நேரத்திற்கு எதிராகவே பேரம் பேச வேண்டியுள்ளது; அது விற்பனை இடத்தில் அனைவருக்கும் தெரியும்.",
    },
  },
  {
    myth: { en: "Cutting a tree is a private decision, not a public issue.", ta: "மரம் வெட்டுவது தனிப்பட்ட முடிவு; பொதுப் பிரச்சினை அல்ல." },
    fact: {
      en: "A bearing tree represents years of investment and a decade of future district income, harvest wages and processing supply. It is removed in an afternoon.",
      ta: "காய்க்கும் ஒரு மரம் பல ஆண்டு முதலீடும், மாவட்டத்திற்கு பத்தாண்டு வருமானமும், அறுவடை ஊதியமும், தொழிற்சாலைக்கான மூலப்பொருளும் ஆகும். அது ஒரே மதியத்தில் அழிக்கப்படுகிறது.",
    },
  },
  {
    myth: { en: "One pulp factory would fix everything.", ta: "ஒரு கூழ் ஆலை இருந்தால் அனைத்தும் சரியாகிவிடும்." },
    fact: {
      en: "Without collection points, cold chain, testing, certification and real grower equity, a single unit is one more buyer setting one more price. Bargaining power is the point.",
      ta: "சேகரிப்பு மையம், குளிர்ச் சங்கிலி, சோதனை, சான்றிதழ், விவசாயிகளுக்கு உண்மையான உரிமைப் பங்கு இல்லாமல், ஒரு ஆலை என்பது விலையை நிர்ணயிக்கும் இன்னொரு வாங்குபவர் மட்டுமே. பேரம் பேசும் சக்தியே முக்கியம்.",
    },
  },
];

export function MythsSection({ lang }: { lang: Language }) {
  const ta = lang === "ta";
  return (
    <section className="section myths-section" id="myths">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">{ta ? "08 · தவறான புரிதல்கள்" : "08 · WHAT PEOPLE GET WRONG"}</p>
          <SectionAudio topic="myths" lang={lang} />
          <h2>{ta ? "பகிரும் முன் இதைச் சரிபாருங்கள்." : "Check this before you share."}</h2>
        </div>
        <p>
          {ta
            ? "இயக்கத்திற்கு எதிராக அடிக்கடி சொல்லப்படும் ஆறு கருத்துகள். ஒவ்வொன்றுக்கும் ஆவணங்களில் உள்ள பதில் இங்கே."
            : "Six things said most often about this issue, and what the supplied documents actually say in reply. Answer these and a conversation moves forward."}
        </p>
      </div>
      <div className="myth-grid">
        {myths.map((item, index) => (
          <article key={item.myth.en}>
            <div className="myth-row myth-claim">
              <span aria-hidden="true">✕</span>
              <div>
                <small>{ta ? "தவறான கருத்து" : "MYTH"}</small>
                <p>{item.myth[lang]}</p>
              </div>
            </div>
            <div className="myth-row myth-answer">
              <span aria-hidden="true">✓</span>
              <div>
                <small>{ta ? "ஆவணம் சொல்வது" : "WHAT THE RECORD SAYS"}</small>
                <p>{item.fact[lang]}</p>
              </div>
            </div>
            <em className="myth-index">{`0${index + 1}`}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Ready-to-send messages
 * ------------------------------------------------------------------ */

const kitMessages: { title: Bilingual; body: Bilingual }[] = [
  {
    title: { en: "For a family or village group", ta: "குடும்பம் அல்லது கிராமக் குழுவிற்கு" },
    body: {
      en: "Totapuri mango was notified at ₹15.45 a kilo this season. Growers in Krishnagiri and Dharmapuri report being paid ₹4–5 at the ramp. Nobody has published how much was actually bought, from how many growers, at which centres. That is the whole question. The documents are here:",
      ta: "இந்தப் பருவத்தில் தோத்தாபுரிக்கு கிலோ ₹15.45 அறிவிக்கப்பட்டது. கிருஷ்ணகிரி, தருமபுரி விவசாயிகளுக்கு ₹4–5 மட்டுமே கிடைத்ததாகத் தெரிவிக்கிறார்கள். எவ்வளவு வாங்கப்பட்டது, எத்தனை விவசாயிகளிடம், எந்த மையங்களில் என்பது வெளியிடப்படவில்லை. அதுவே கேள்வி. ஆவணங்கள் இங்கே:",
    },
  },
  {
    title: { en: "For a representative or official", ta: "பிரதிநிதி அல்லது அதிகாரிக்கு" },
    body: {
      en: "Requesting that the weekly Totapuri procurement figures for this district be placed in the public domain: quantity purchased, number of growers covered, centres operating, price paid and payment settlement time. This is an administrative disclosure, not a policy change, and it can be done this month.",
      ta: "இந்த மாவட்டத்தின் வாராந்திர தோத்தாபுரி கொள்முதல் விவரங்களை பொதுவெளியில் வைக்கக் கோருகிறோம்: வாங்கிய அளவு, பயனடைந்த விவசாயிகள், செயல்படும் மையங்கள், வழங்கப்பட்ட விலை, பணம் செலுத்திய காலம். இது கொள்கை மாற்றம் அல்ல; ஒரு நிர்வாக வெளிப்பாடு. இந்த மாதத்திலேயே செய்யலாம்.",
    },
  },
  {
    title: { en: "For a journalist", ta: "ஊடகவியலாளருக்கு" },
    body: {
      en: "A checkable story: a notified intervention price of ₹15.45/kg against grower-reported ramp prices of ₹4–5 across the Krishnagiri–Dharmapuri belt, with 51,000 hectares under mango and no published centre count for this season. Weighment slips and dated acknowledgements are available for verification.",
      ta: "சரிபார்க்கக்கூடிய செய்தி: கிருஷ்ணகிரி–தருமபுரி பகுதியில் அறிவிக்கப்பட்ட தலையீட்டு விலை கிலோ ₹15.45; விவசாயிகள் தெரிவிக்கும் விலை ₹4–5. 51,000 ஹெக்டேரில் மாம்பழம்; இப்பருவத்திற்கான மைய எண்ணிக்கை வெளியிடப்படவில்லை. எடை சீட்டுகளும் தேதியிட்ட ஒப்புகைகளும் சரிபார்ப்புக்குக் கிடைக்கும்.",
    },
  },
];

export function ShareKit({ lang }: { lang: Language }) {
  const ta = lang === "ta";
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const url = useCurrentUrl();

  async function copyMessage(index: number, body: string) {
    try {
      await navigator.clipboard.writeText(`${body} ${url}`);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 2200);
    } catch {
      /* Clipboard blocked. The text is on screen and can be selected by hand. */
    }
  }

  return (
    <section className="kit-section" id="spread">
      <div className="section">
        <div className="kit-heading">
          <Cartoon name="spreadTheWord" className="kit-art" />
          <div>
            <p className="eyebrow light">{ta ? "11 · செய்தியைப் பரப்புங்கள்" : "11 · SPREAD THE WORD"}</p>
            <h2>{ta ? "நகலெடுத்து அனுப்புங்கள். எழுத வேண்டியதில்லை." : "Copy it, send it. Nothing to write."}</h2>
            <p>
              {ta
                ? "மூன்று செய்திகள், இரு மொழிகளிலும். ஒவ்வொன்றும் ஆவணங்களில் உள்ள தகவலை மட்டும் கொண்டது. நகலெடுத்தால் இணையதள முகவரியும் சேர்ந்து வரும்."
                : "Three messages, written for three different readers. Every figure in them comes from the supplied documents. Copying also attaches the link."}
            </p>
          </div>
        </div>
        <ShareCardMaker lang={lang} />

        <div className="kit-grid">
          {kitMessages.map((message, index) => (
            <article key={message.title.en}>
              <h3>{message.title[lang]}</h3>
              <p>{message.body[lang]}</p>
              <button className="button button-light" onClick={() => copyMessage(index, message.body[lang])}>
                {copiedIndex === index ? (ta ? "நகலெடுக்கப்பட்டது ✓" : "Copied ✓") : ta ? "செய்தியை நகலெடு" : "Copy message"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
