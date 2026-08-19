"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Language, speak, stopSpeaking, canSpeak } from "./audio";

/* ------------------------------------------------------------------ *
 * The guide
 *
 * This runs entirely on the device. It is not a general chatbot: it is a
 * router. It reads a question, works out which of the site's topics it is
 * about, answers in one short paragraph and offers to jump to the right
 * section.
 *
 * That choice is deliberate. A static site cannot hold an API key without
 * publishing it to everyone who views the page, and a campaign site should
 * not be sending a villager's typed question to a third party. Routing
 * offline is faster, free, private, and works on a weak connection.
 *
 * Matching covers three ways people actually write here:
 *   English   — "why is the price so low"
 *   Tamil     — "விலை ஏன் குறைவாக உள்ளது"
 *   Tanglish  — "vilai yen kammu ah iruku"
 * ------------------------------------------------------------------ */

export type Topic = {
  id: string;
  section: string;
  title: Record<Language, string>;
  answer: Record<Language, string>;
  keys: string[];
};

/* Keys are matched against a normalised, lower-cased query. Tanglish is
   spelt several ways by different people, so common variants are listed
   rather than assuming one spelling. */
export const topics: Topic[] = [
  {
    id: "price",
    section: "crisis",
    title: { en: "The price gap", ta: "விலை இடைவெளி" },
    answer: {
      en: "₹15.45 a kilo was notified for Totapuri. Growers in the belt report being paid only ₹4–5 at the ramp — roughly a threefold gap. The ₹4–5 is grower-reported, not an official series, which is exactly why the movement asks for weekly official figures to be published.",
      ta: "தோத்தாபுரிக்கு கிலோ ₹15.45 அறிவிக்கப்பட்டது. ஆனால் விற்பனை இடத்தில் ₹4–5 மட்டுமே கிடைப்பதாக விவசாயிகள் தெரிவிக்கின்றனர் — கிட்டத்தட்ட மூன்று மடங்கு இடைவெளி. ₹4–5 என்பது விவசாயிகள் கூறுவது; அதிகாரப்பூர்வ தொடர் அல்ல. அதனால்தான் வாராந்திர அதிகாரப்பூர்வ தரவை வெளியிடக் கோருகிறோம்.",
    },
    keys: ["price", "rate", "cost", "15.45", "4-5", "4–5", "rupee", "rs", "money", "kilo", "kg", "low price", "gap",
      "விலை", "காசு", "பண", "கிலோ", "ரூபா",
      "vilai", "vilaikku", "velai illa", "kaasu", "panam", "rate enna", "vilai enna", "vilai yen", "kammi", "kammu", "vilai kammi"],
  },
  {
    id: "why",
    section: "season",
    title: { en: "Why the price arrives too late", ta: "விலை ஏன் தாமதமாக வருகிறது" },
    answer: {
      en: "Mango has no standing floor price. Support has to be requested and approved afresh every season, so the intervention price reached the belt after harvest had already begun. By then the fruit was sold. Cost is spent months earlier, at flowering.",
      ta: "மாம்பழத்திற்கு நிலையான அடிப்படை விலை இல்லை. ஒவ்வொரு பருவமும் தனியே கோரி ஒப்புதல் பெற வேண்டும். அதனால் அறுவடை தொடங்கிய பிறகே தலையீட்டு விலை வந்தது; அதற்குள் பழம் விற்கப்பட்டுவிட்டது. செலவோ பூக்கும் காலத்திலேயே ஆகிவிடுகிறது.",
    },
    keys: ["why", "late", "delay", "season", "when", "december", "flowering", "harvest", "timing",
      "ஏன்", "தாமத", "பருவ", "அறுவடை", "பூக்க", "எப்போ",
      "yen", "yaen", "eppo", "eppothu", "thamatham", "aruvadai", "pookum", "late ah"],
  },
  {
    id: "demands",
    section: "demands",
    title: { en: "What is being asked for", ta: "என்ன கோரப்படுகிறது" },
    answer: {
      en: "Six demands, each sent to the office that can act: weekly procurement data, daily price boards with a grievance line, a purchase centre in every mango block, a real cost-of-cultivation study, a price announced in December before flowering, and a permanent buyer with grower ownership in processing.",
      ta: "ஆறு கோரிக்கைகள்; ஒவ்வொன்றும் நடவடிக்கை எடுக்கக்கூடிய அலுவலகத்திற்கு: வாராந்திர கொள்முதல் தரவு, தினசரி விலைப் பலகைகளும் குறைதீர் எண்ணும், ஒவ்வொரு வட்டாரத்திலும் கொள்முதல் மையம், சாகுபடி செலவு ஆய்வு, டிசம்பரில் விலை அறிவிப்பு, நிரந்தர வாங்குபவரும் விவசாயிகள் உரிமைப் பங்கும்.",
    },
    keys: ["demand", "ask", "want", "request", "what do you want", "six", "collector", "government", "solution",
      "கோரிக்", "கேட்ப", "ஆட்சிய", "அரசு", "தீர்வ",
      "korikkai", "kekkurathu", "enna venum", "venum", "aatchiyar", "arasu", "theervu", "demand enna"],
  },
  {
    id: "paddy",
    section: "compare",
    title: { en: "Paddy versus mango", ta: "நெல் – மாம்பழம்" },
    answer: {
      en: "Paddy has a support price known before sowing, a permanent state buyer, purchase centres each season and guaranteed demand. Mango has none of these. This is a crop-to-crop comparison, not region against region — nothing is asked to be taken away from paddy farmers.",
      ta: "நெல்லுக்கு விதைப்பதற்கு முன்பே ஆதரவு விலை, நிரந்தர அரசு வாங்குபவர், ஒவ்வொரு பருவமும் கொள்முதல் மையங்கள், உறுதியான தேவை உண்டு. மாம்பழத்திற்கு இவை இல்லை. இது பயிர்-பயிர் ஒப்பீடு; பகுதி-பகுதி அல்ல. நெல் விவசாயிகளிடமிருந்து எதையும் எடுக்கக் கோரவில்லை.",
    },
    keys: ["paddy", "rice", "msp", "delta", "compare", "comparison", "tncsc", "support price",
      "நெல்", "அரிசி", "ஒப்பீ", "டெல்டா",
      "nel", "nellu", "arisi", "oppidu", "compare panna", "paddy vs", "msp enna"],
  },
  {
    id: "tree",
    section: "crisis",
    title: { en: "Trees being cut", ta: "மரங்கள் வெட்டப்படுவது" },
    answer: {
      en: "When a season does not cover its own cost, orchards get leased out or cleared. A mango tree takes years to bear, so a tree removed this year is not brought back by a better price next year. That is why the movement is urgent rather than patient.",
      ta: "ஒரு பருவம் அதன் செலவைக் கூட ஈடுசெய்யாதபோது தோட்டங்கள் குத்தகைக்கு விடப்படுகின்றன அல்லது அழிக்கப்படுகின்றன. மாமரம் காய்க்க பல ஆண்டுகள் ஆகும். இந்த ஆண்டு வெட்டப்பட்ட மரத்தை அடுத்த ஆண்டின் நல்ல விலை திரும்பக் கொண்டுவராது.",
    },
    keys: ["tree", "cut", "cutting", "axe", "orchard", "lease", "removed",
      "மரம", "மாமர", "வெட்ட", "தோட்ட", "குத்தகை",
      "maram", "mamaram", "vetta", "vettu", "vetturathu", "thottam", "kuthagai", "maram vetta"],
  },
  {
    id: "act",
    section: "act",
    title: { en: "What you can do", ta: "நீங்கள் என்ன செய்யலாம்" },
    answer: {
      en: "If you grow mango: keep weighment slips, receipts, quantities and payment dates, and give consented testimony through an association. If you do not: share one verified figure with the document it came from, and ask your representative to place the factual questions on record.",
      ta: "நீங்கள் மாம்பழம் பயிரிட்டால்: எடை சீட்டு, ரசீது, அளவு, பணத் தேதிகளை வைத்திருங்கள்; சங்கம் மூலம் ஒப்புதலுடன் அனுபவத்தைப் பதிவு செய்யுங்கள். இல்லையென்றால்: ஒரு சரிபார்க்கப்பட்ட எண்ணையும் ஆவணத்தையும் பகிருங்கள்; உண்மைக் கேள்விகளைப் பதிவு செய்ய உங்கள் பிரதிநிதியிடம் கேளுங்கள்.",
    },
    keys: ["what can i do", "help", "join", "action", "support", "volunteer", "participate", "how to help",
      "செய்ய", "உதவ", "இணைய", "செயல", "ஆதரவ",
      "enna panrathu", "enna seiyanum", "help panna", "sera", "inaiya", "othuzhaikka", "seiyalam"],
  },
  {
    id: "vote",
    section: "act",
    title: { en: "Voting and liking", ta: "வாக்கு மற்றும் விருப்பம்" },
    answer: {
      en: "The vote box is in the Take Action section — choose which demand should happen first, and you can change your answer any time. The like button is in the hero card at the top and in the support band. Both are saved on your own device.",
      ta: "வாக்குப் பெட்டி 'செயலில் இணைய' பகுதியில் உள்ளது — எந்தக் கோரிக்கை முதலில் நடக்க வேண்டும் எனத் தேர்ந்தெடுங்கள்; எப்போது வேண்டுமானாலும் மாற்றலாம். விருப்ப பொத்தான் மேலே உள்ள அட்டையிலும் ஆதரவுப் பகுதியிலும் உள்ளது.",
    },
    keys: ["vote", "voting", "like", "poll", "button", "share", "whatsapp",
      "வாக்க", "விருப்ப", "பகிர",
      "vote panna", "vote pannanum", "like panna", "vaakku", "virupam", "pakira", "share panna"],
  },
  {
    id: "documents",
    section: "evidence",
    title: { en: "The source documents", ta: "ஆதார ஆவணங்கள்" },
    answer: {
      en: "All eight original PDFs are in the Evidence Library — around fifty pages, in both languages. You can read them in the browser or download them for a meeting, a village display or a representation. Every figure on this site traces back to one of them.",
      ta: "எட்டு அசல் ஆவணங்களும் 'ஆதாரங்கள்' பகுதியில் உள்ளன — சுமார் ஐம்பது பக்கங்கள், இரு மொழிகளிலும். இணையத்தில் படிக்கலாம் அல்லது கூட்டம், கிராமக் காட்சி, மனுவுக்காகப் பதிவிறக்கலாம்.",
    },
    keys: ["document", "pdf", "proof", "evidence", "source", "download", "read", "report", "paper",
      "ஆவண", "ஆதார", "பதிவிறக்க", "படிக்க",
      "aavanam", "aadharam", "pdf venum", "download panna", "padikka", "proof enna"],
  },
  {
    id: "verify",
    section: "faq",
    title: { en: "Checking the figures yourself", ta: "எண்களைச் சரிபார்ப்பது" },
    answer: {
      en: "Ask in writing for the weekly procurement record: quantity purchased, growers covered, centres operating, price paid and payment settlement time. A Right to Information request to the district Horticulture office or the procuring agency is the standard route. Keep the dated acknowledgement number — the follow-up matters more than the first letter.",
      ta: "வாராந்திர கொள்முதல் பதிவை எழுத்துப்பூர்வமாகக் கோருங்கள்: வாங்கிய அளவு, பயனடைந்த விவசாயிகள், செயல்படும் மையங்கள், விலை, பணம் செலுத்திய காலம். மாவட்ட தோட்டக்கலைத் துறைக்கு தகவல் அறியும் உரிமைச் சட்ட விண்ணப்பம் அளிப்பதே வழக்கமான வழி. தேதியிட்ட ஒப்புகை எண்ணை வைத்திருங்கள்.",
    },
    keys: ["verify", "check", "rti", "true", "real", "proof of", "how do i know", "confirm", "fact check",
      "சரிபார்", "உண்மை", "தகவல் அறிய",
      "unmaiya", "saripaarkka", "rti podanum", "epdi theriyum", "eppadi theriyum", "nijama"],
  },
  {
    id: "political",
    section: "faq",
    title: { en: "Is this political?", ta: "இது அரசியலா?" },
    answer: {
      en: "No. It supports no party and opposes none. Every demand is addressed to an office by its function — a Collector, a department, a corporation — never to an individual or a party. It is a peaceful, evidence-led citizens' movement.",
      ta: "இல்லை. எந்தக் கட்சிக்கும் ஆதரவோ எதிர்ப்போ இல்லை. ஒவ்வொரு கோரிக்கையும் ஒரு பதவிக்கே — ஆட்சியர், துறை, நிறுவனம் — அனுப்பப்படுகிறது; தனிநபருக்கோ கட்சிக்கோ அல்ல. இது அமைதியான, ஆதார அடிப்படையிலான மக்கள் இயக்கம்.",
    },
    keys: ["political", "politics", "party", "election", "dmk", "admk", "bjp", "who is behind", "protest",
      "அரசிய", "கட்சி", "தேர்தல", "போராட்ட",
      "arasiyal", "katchi", "therthal", "yaaru", "yar nadathurathu", "porattam"],
  },
  {
    id: "words",
    section: "words",
    title: { en: "What the terms mean", ta: "சொற்களின் பொருள்" },
    answer: {
      en: "The Words section explains ten terms in plain language — MSP, MIS, intervention price, ramp price, Direct Purchase Centre, TNCSC, buyer of last resort, FPO, cost of cultivation and Totapuri itself. Knowing them is the difference between listening to a meeting and taking part in one.",
      ta: "'சொற்கள்' பகுதி பத்து சொற்களை எளிய மொழியில் விளக்குகிறது — குறைந்தபட்ச ஆதரவு விலை, சந்தைத் தலையீட்டுத் திட்டம், தலையீட்டு விலை, விற்பனை இட விலை, நேரடி கொள்முதல் மையம், விவசாயிகள் உற்பத்தியாளர் அமைப்பு, சாகுபடி செலவு, தோத்தாபுரி ஆகியவை.",
    },
    keys: ["meaning", "what is", "term", "mis", "fpo", "totapuri", "glossary", "explain", "definition",
      "பொருள", "என்றால", "விளக்க", "தோத்தாபுரி",
      "artham", "porul", "enna artham", "ennanu", "vilakkam", "totapuri enna"],
  },
  {
    id: "value",
    section: "solutions",
    title: { en: "Value addition and jobs", ta: "மதிப்புக் கூட்டலும் வேலையும்" },
    answer: {
      en: "A single pulp unit is not an industry. Collection points, cold chain, testing, certification and real grower equity are what create bargaining power — and products beyond pulp, from juice to dried fruit and kernel oil, are what keep the value and the jobs local.",
      ta: "ஒரு கூழ் ஆலை என்பது தொழில் அல்ல. சேகரிப்பு மையங்கள், குளிர்ச் சங்கிலி, சோதனை, சான்றிதழ், விவசாயிகளுக்கு உண்மையான உரிமைப் பங்கு — இவையே பேரம் பேசும் சக்தியை உருவாக்கும். சாறு, உலர் பழம், கொட்டை எண்ணெய் போன்ற பொருட்களே மதிப்பையும் வேலையையும் உள்ளூரில் வைத்திருக்கும்.",
    },
    keys: ["factory", "pulp", "juice", "processing", "jobs", "employment", "industry", "value",
      "தொழிற்சால", "கூழ", "சாறு", "வேலை", "மதிப்ப",
      "thozhirchalai", "koozh", "saaru", "velai", "job venum", "factory enna"],
  },
];

/* --- Matching -------------------------------------------------------- */

function normalise(input: string) {
  // \p{M} matters: Tamil vowel signs are combining Marks, not Letters, so
  // omitting it strips them and turns "விலை" into "வல", matching nothing.
  return ` ${input.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s.–-]/gu, " ").replace(/\s+/g, " ").trim()} `;
}

export function findTopics(query: string): Topic[] {
  const text = normalise(query);
  if (text.trim().length < 2) return [];

  const scored = topics.map((topic) => {
    let score = 0;
    topic.keys.forEach((key) => {
      const k = key.toLowerCase();
      if (!text.includes(k)) return;
      // Longer, more specific phrases count for more than single words,
      // and a whole-word hit beats a fragment sitting inside another word.
      score += k.length > 6 ? 3 : 2;
      if (text.includes(` ${k} `)) score += 2;
    });
    return { topic, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.topic);
}

/* --- Voice input ----------------------------------------------------- */

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: { 0: { transcript: string } }[] }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function createRecognition(lang: Language): Recognition | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const recognition = new Ctor();
  // Tamil speech recognition also returns Tanglish reasonably well, and the
  // matcher accepts either, so the language here only sets the preference.
  recognition.lang = lang === "ta" ? "ta-IN" : "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  return recognition;
}

/* --- The widget ------------------------------------------------------- */

type Entry = { role: "user" | "guide"; text: string; matches?: Topic[] };

export function Assistant({ lang }: { lang: Language }) {
  const ta = lang === "ta";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [log, setLog] = useState<Entry[]>([]);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef<Recognition | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const greeting = ta
    ? "கேளுங்கள் — தமிழ், English அல்லது Tanglish எதிலும் தட்டச்சு செய்யலாம். சரியான பகுதிக்கு அழைத்துச் செல்கிறேன்."
    : "Ask me anything. Type in English, Tamil or Tanglish and I'll answer and take you to the right section.";

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const ask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const matches = findTopics(trimmed);
      const answer = matches.length
        ? matches[0].answer[lang]
        : ta
          ? "இது எனக்குப் புரியவில்லை. கீழே உள்ள பொருள்களில் ஒன்றைத் தேர்ந்தெடுங்கள், அல்லது 'விலை', 'நெல்', 'ஆவணம்' போன்ற ஒரு சொல்லைத் தட்டச்சு செய்யுங்கள்."
          : "I didn't follow that one. Try one of the topics below, or a single word like price, paddy, tree, vote or documents.";

      setLog((current) => [...current, { role: "user", text: trimmed }, { role: "guide", text: answer, matches }]);
      setQuery("");
    },
    [lang, ta]
  );

  const listen = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = createRecognition(lang);
    if (!recognition) {
      setMicError(ta ? "இந்த உலாவியில் குரல் உள்ளீடு இல்லை. Chrome முயற்சிக்கவும்." : "This browser has no voice input. Try Chrome.");
      window.setTimeout(() => setMicError(""), 6000);
      return;
    }
    recognitionRef.current = recognition;
    recognition.onresult = (event) => {
      const said = event.results?.[0]?.[0]?.transcript ?? "";
      if (said) ask(said);
    };
    recognition.onerror = () => {
      setListening(false);
      setMicError(ta ? "குரல் கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்." : "Didn't catch that. Try again.");
      window.setTimeout(() => setMicError(""), 5000);
    };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }, [listening, lang, ask, ta]);

  const goTo = useCallback((section: string) => {
    const target = document.getElementById(section);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  }, []);

  const readAloud = useCallback(
    (text: string) => {
      if (!canSpeak(lang)) return;
      stopSpeaking();
      speak(text, lang);
    },
    [lang]
  );

  const starters = topics.slice(0, 4);

  return (
    <>
      <button
        className={open ? "guide-fab is-open" : "guide-fab"}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={ta ? "உதவியாளரைத் திற" : "Open the guide"}
      >
        <span aria-hidden="true">{open ? "✕" : "💬"}</span>
        {!open && <em>{ta ? "கேளுங்கள்" : "Ask"}</em>}
      </button>

      {open && (
        <section className="guide-panel" aria-label={ta ? "தள உதவியாளர்" : "Site guide"}>
          <header>
            <div>
              <strong>{ta ? "தள வழிகாட்டி" : "Site guide"}</strong>
              <small>{ta ? "தமிழ் · English · Tanglish" : "English · Tamil · Tanglish"}</small>
            </div>
            <button onClick={() => setOpen(false)} aria-label={ta ? "மூடு" : "Close"}>✕</button>
          </header>

          <div className="guide-log" ref={logRef}>
            {log.length === 0 && (
              <>
                <p className="guide-greeting">{greeting}</p>
                <div className="guide-starters">
                  {starters.map((topic) => (
                    <button key={topic.id} onClick={() => ask(topic.title.en)}>
                      {topic.title[lang]}
                    </button>
                  ))}
                </div>
              </>
            )}

            {log.map((entry, index) => (
              <div className={entry.role === "user" ? "guide-msg is-user" : "guide-msg"} key={index}>
                <p>{entry.text}</p>
                {entry.role === "guide" && entry.matches && entry.matches.length > 0 && (
                  <div className="guide-actions">
                    <button className="guide-go" onClick={() => goTo(entry.matches![0].section)}>
                      {ta ? "அந்தப் பகுதிக்குச் செல்" : "Take me there"} ↓
                    </button>
                    <button className="guide-speak" onClick={() => readAloud(entry.text)}>
                      {ta ? "🔊 படித்துக் காட்டு" : "🔊 Read aloud"}
                    </button>
                    {entry.matches.slice(1).map((topic) => (
                      <button key={topic.id} className="guide-alt" onClick={() => ask(topic.title.en)}>
                        {topic.title[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {micError && <p className="guide-error">{micError}</p>}

          <form
            className="guide-input"
            onSubmit={(event) => {
              event.preventDefault();
              ask(query);
            }}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ta ? "உங்கள் கேள்வியை எழுதுங்கள்…" : "Type your question…"}
              aria-label={ta ? "கேள்வி" : "Question"}
            />
            <button type="button" className={listening ? "guide-mic is-live" : "guide-mic"} onClick={listen} aria-label={ta ? "பேசுங்கள்" : "Speak"}>
              🎤
            </button>
            <button type="submit" className="guide-send" aria-label={ta ? "அனுப்பு" : "Send"}>
              ↑
            </button>
          </form>
        </section>
      )}
    </>
  );
}
