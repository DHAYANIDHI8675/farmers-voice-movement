"use client";

import { useState } from "react";
import { Cartoon } from "./cartoons";
import { SectionAudio } from "./audio";

export type Language = "en" | "ta";
type Bilingual = Record<Language, string>;

/* ------------------------------------------------------------------ *
 * How one season actually runs
 *
 * Stages are named by what happens in the orchard rather than by exact
 * calendar dates, because the dates shift year to year and the documents
 * do not fix them. The sequence is the argument: cost is spent early, the
 * fruit cannot wait, and the price arrives after both.
 * ------------------------------------------------------------------ */

const season: { stage: Bilingual; note: Bilingual; body: Bilingual; alert?: boolean }[] = [
  {
    stage: { en: "Before flowering", ta: "பூக்கும் முன்" },
    note: { en: "The price should already be known", ta: "விலை ஏற்கனவே தெரிந்திருக்க வேண்டும்" },
    body: {
      en: "A paddy grower knows the support price before sowing. A mango grower has no standing floor at all, and must wait for a scheme to be requested and cleared afresh.",
      ta: "நெல் விவசாயிக்கு விதைப்பதற்கு முன்பே ஆதரவு விலை தெரியும். மாம்பழ விவசாயிக்கு நிலையான அடிப்படை விலை இல்லை; ஒவ்வொரு ஆண்டும் திட்டம் கோரப்பட்டு ஒப்புதல் பெற வேண்டும்.",
    },
  },
  {
    stage: { en: "Flowering", ta: "பூக்கும் காலம்" },
    note: { en: "The money goes out now", ta: "செலவு இப்போது தொடங்குகிறது" },
    body: {
      en: "Spraying, irrigation and labour are paid for months before any fruit is sold. The grower is committing cost against a price nobody has named.",
      ta: "மருந்து தெளித்தல், நீர்ப்பாசனம், கூலி — பழம் விற்பதற்கு பல மாதங்கள் முன்பே செலவு. விலை தெரியாத நிலையில் விவசாயி பணத்தை முதலீடு செய்கிறார்.",
    },
  },
  {
    stage: { en: "Fruit set", ta: "காய் பிடிக்கும் காலம்" },
    note: { en: "Centres should be announced", ta: "மையங்கள் அறிவிக்கப்பட வேண்டும்" },
    body: {
      en: "This is when locations and eligibility need to be public, so a grower can plan where to take the load. The documents ask for this by February.",
      ta: "இந்த நேரத்தில் மையங்களின் இடங்களும் தகுதியும் வெளியிடப்பட வேண்டும்; அப்போதுதான் எங்கே கொண்டு செல்வது என்று திட்டமிட முடியும். பிப்ரவரிக்குள் இதை ஆவணங்கள் கோருகின்றன.",
    },
  },
  {
    stage: { en: "Harvest begins", ta: "அறுவடை தொடக்கம்" },
    note: { en: "The clock starts", ta: "நேரம் ஓடத் தொடங்குகிறது" },
    body: {
      en: "Totapuri has to move within days. Growers in the belt report being paid ₹4–5 a kilo at the ramp, and everyone at the gate knows the fruit cannot go home again.",
      ta: "தோத்தாபுரி சில நாட்களுக்குள் நகர வேண்டும். விற்பனை இடத்தில் கிலோ ₹4–5 மட்டுமே கிடைப்பதாக விவசாயிகள் தெரிவிக்கின்றனர்; பழத்தை திரும்ப எடுத்துச் செல்ல முடியாது என்பது அனைவருக்கும் தெரியும்.",
    },
  },
  {
    stage: { en: "The price is notified", ta: "விலை அறிவிக்கப்படுகிறது" },
    note: { en: "₹15.45 — after harvest had begun", ta: "₹15.45 — அறுவடை தொடங்கிய பின்" },
    body: {
      en: "The intervention price reaches the belt once the season is already running. A price announced after the fruit is sold cannot change what the grower was paid for it.",
      ta: "பருவம் ஏற்கனவே தொடங்கிய பிறகே தலையீட்டு விலை இப்பகுதியை எட்டுகிறது. பழம் விற்ற பிறகு வரும் விலை, விவசாயிக்குக் கிடைத்ததை மாற்றாது.",
    },
    alert: true,
  },
  {
    stage: { en: "After the season", ta: "பருவத்திற்குப் பின்" },
    note: { en: "What does not grow back", ta: "மீண்டும் வளராதவை" },
    body: {
      en: "Unharvested fruit, unpaid harvest wages, and orchards leased out or cleared. A tree removed this year is not replaced by a better price next year.",
      ta: "அறுவடை செய்யப்படாத பழம், வழங்கப்படாத கூலி, குத்தகைக்கு விடப்பட்ட அல்லது அழிக்கப்பட்ட தோட்டங்கள். இந்த ஆண்டு வெட்டப்பட்ட மரத்தை அடுத்த ஆண்டின் நல்ல விலை திரும்பக் கொண்டுவராது.",
    },
  },
];

export function SeasonTimeline({ lang }: { lang: Language }) {
  const ta = lang === "ta";
  return (
    <section className="season-section" id="season">
      <div className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow light">{ta ? "02 · ஒரு பருவம்" : "02 · ONE SEASON"}</p>
            <SectionAudio topic="season" lang={lang} />
            <h2>{ta ? "செலவு முதலில். விலை கடைசியில்." : "The cost comes first. The price comes last."}</h2>
          </div>
          <p>
            {ta
              ? "ஒரு மாம்பழப் பருவம் எப்படி நடக்கிறது என்பதை வரிசையாகப் பாருங்கள். இந்த வரிசையே கோரிக்கையின் அடிப்படை: பணம் முன்பே செலவாகிறது, பழம் காத்திருக்காது, விலை மட்டும் தாமதமாக வருகிறது."
              : "Read the order of events rather than the arguments about them. The order is the case: money is spent early, the fruit cannot wait, and the price arrives after both."}
          </p>
        </div>

        <ol className="season-rail">
          {season.map((step, index) => (
            <li className={step.alert ? "season-step is-alert" : "season-step"} key={step.stage.en}>
              <span className="season-dot" aria-hidden="true">{`0${index + 1}`}</span>
              <article>
                <p className="season-note">{step.note[lang]}</p>
                <h3>{step.stage[lang]}</h3>
                <p>{step.body[lang]}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Plain-language glossary
 * ------------------------------------------------------------------ */

const glossary: { term: Bilingual; meaning: Bilingual }[] = [
  {
    term: { en: "Totapuri", ta: "தோத்தாபுரி" },
    meaning: {
      en: "The main mango variety of this belt. It is grown mostly for pulp and processing, not for sale as table fruit, so growers depend on factories buying.",
      ta: "இப்பகுதியின் முக்கிய மாம்பழ ரகம். பெரும்பாலும் கூழ் மற்றும் பதப்படுத்தலுக்காக விளைவிக்கப்படுகிறது; எனவே தொழிற்சாலைகள் வாங்குவதையே விவசாயிகள் நம்பியுள்ளனர்.",
    },
  },
  {
    term: { en: "MSP — Minimum Support Price", ta: "குறைந்தபட்ச ஆதரவு விலை" },
    meaning: {
      en: "A standing floor price announced every year before sowing. Paddy has one. Mango does not.",
      ta: "ஒவ்வொரு ஆண்டும் விதைப்பதற்கு முன் அறிவிக்கப்படும் நிலையான அடிப்படை விலை. நெல்லுக்கு உண்டு; மாம்பழத்திற்கு இல்லை.",
    },
  },
  {
    term: { en: "MIS — Market Intervention Scheme", ta: "சந்தைத் தலையீட்டுத் திட்டம்" },
    meaning: {
      en: "The route used for perishable crops instead of MSP. It has to be requested and approved separately each season, which is why the price can arrive late.",
      ta: "அழுகக்கூடிய பயிர்களுக்கு ஆதரவு விலைக்குப் பதிலாகப் பயன்படும் வழி. ஒவ்வொரு பருவமும் தனியே கோரி ஒப்புதல் பெற வேண்டும்; அதனால்தான் விலை தாமதமாகிறது.",
    },
  },
  {
    term: { en: "Intervention price", ta: "தலையீட்டு விலை" },
    meaning: {
      en: "The rate notified under the scheme for one season. For Totapuri this season it is ₹15.45 a kilo.",
      ta: "ஒரு பருவத்திற்காக அத்திட்டத்தின் கீழ் அறிவிக்கப்படும் விலை. இப்பருவம் தோத்தாபுரிக்கு கிலோ ₹15.45.",
    },
  },
  {
    term: { en: "Ramp price", ta: "விற்பனை இட விலை" },
    meaning: {
      en: "What a grower is actually paid at the factory gate or market yard. Growers in this belt report ₹4–5. This is a reported figure, not an official series.",
      ta: "தொழிற்சாலை நுழைவிலோ சந்தையிலோ விவசாயிக்கு உண்மையில் கிடைக்கும் விலை. இப்பகுதியில் ₹4–5 எனத் தெரிவிக்கப்படுகிறது. இது விவசாயிகள் கூறும் தகவல்; அதிகாரப்பூர்வ தொடர் அல்ல.",
    },
  },
  {
    term: { en: "Direct Purchase Centre", ta: "நேரடி கொள்முதல் மையம்" },
    meaning: {
      en: "A government buying point opened each season so a farmer can sell without going through a trader. Paddy has these. The documents ask for the mango equivalent.",
      ta: "வியாபாரி இல்லாமல் விவசாயி நேரடியாக விற்க ஒவ்வொரு பருவமும் திறக்கப்படும் அரசு கொள்முதல் மையம். நெல்லுக்கு உள்ளது; மாம்பழத்திற்கும் வேண்டும் என்பதே கோரிக்கை.",
    },
  },
  {
    term: { en: "TNCSC", ta: "தமிழ்நாடு நுகர்பொருள் வாணிபக் கழகம்" },
    meaning: {
      en: "The permanent State corporation that buys paddy. No equivalent standing public buyer exists for mango in this belt.",
      ta: "நெல்லை வாங்கும் நிரந்தர மாநில நிறுவனம். மாம்பழத்திற்கு இப்பகுதியில் இதுபோன்ற நிரந்தர அரசு வாங்குபவர் இல்லை.",
    },
  },
  {
    term: { en: "Buyer of last resort", ta: "கடைசி வாய்ப்பு வாங்குபவர்" },
    meaning: {
      en: "A public body that will buy the crop when private processors will not. It sets a floor under the market without having to buy everything.",
      ta: "தனியார் தொழிற்சாலைகள் வாங்காதபோது பயிரை வாங்கும் அரசு அமைப்பு. அனைத்தையும் வாங்காமலேயே சந்தைக்கு ஓர் அடிப்படை விலையை உருவாக்கும்.",
    },
  },
  {
    term: { en: "FPO — Farmer Producer Organisation", ta: "விவசாயிகள் உற்பத்தியாளர் அமைப்பு" },
    meaning: {
      en: "A company owned by its farmer members. It lets growers pool volume, hold stock briefly and negotiate as one instead of one at a time.",
      ta: "விவசாயிகளே உரிமையாளர்களாக உள்ள நிறுவனம். அளவைத் திரட்டி, சிறிது காலம் சரக்கை வைத்திருந்து, தனித்தனியாக அல்லாமல் ஒன்றாகப் பேரம் பேச உதவும்.",
    },
  },
  {
    term: { en: "Cost of cultivation", ta: "சாகுபடி செலவு" },
    meaning: {
      en: "The measured cost of growing one kilo. Without a district study for Totapuri, arguments about a fair price have no shared reference point.",
      ta: "ஒரு கிலோ விளைவிக்கும் அளவிடப்பட்ட செலவு. தோத்தாபுரிக்கு மாவட்ட ஆய்வு இல்லாமல், நியாயமான விலை குறித்த விவாதத்திற்குப் பொதுவான அடிப்படை இல்லை.",
    },
  },
];

export function Glossary({ lang }: { lang: Language }) {
  const ta = lang === "ta";
  return (
    <section className="section glossary-section" id="words">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">{ta ? "09 · சொற்கள்" : "09 · THE WORDS"}</p>
          <h2>{ta ? "கூட்டங்களில் கேட்கும் சொற்கள்." : "The words that decide this."}</h2>
        </div>
        <p>
          {ta
            ? "இந்தப் பிரச்சினை பற்றிய கூட்டங்களிலும் செய்திகளிலும் திரும்பத் திரும்ப வரும் பத்து சொற்கள். இவற்றைத் தெரிந்துகொண்டால் எந்தக் கூட்டத்திலும் தன்னம்பிக்கையுடன் பேச முடியும்."
            : "Ten terms that come up in every meeting and every news report on this issue. Knowing them is the difference between listening to a discussion and taking part in one."}
        </p>
      </div>
      <div className="glossary-grid">
        {glossary.map((entry) => (
          <article key={entry.term.en}>
            <h3>{entry.term[lang]}</h3>
            <p>{entry.meaning[lang]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Questions people actually ask
 * ------------------------------------------------------------------ */

const faqs: { q: Bilingual; a: Bilingual }[] = [
  {
    q: { en: "Is this a political campaign?", ta: "இது ஒரு அரசியல் பிரச்சாரமா?" },
    a: {
      en: "No. It supports no party and opposes none. Every demand on this site is addressed to an office by its function — a Collector, a department, a corporation — not to any individual or party.",
      ta: "இல்லை. எந்தக் கட்சிக்கும் ஆதரவோ எதிர்ப்போ இல்லை. இங்குள்ள ஒவ்வொரு கோரிக்கையும் ஒரு பதவிக்கு — ஆட்சியர், துறை, நிறுவனம் — அனுப்பப்படுகிறதே தவிர, தனிநபருக்கோ கட்சிக்கோ அல்ல.",
    },
  },
  {
    q: { en: "Is the ₹4–5 figure official?", ta: "₹4–5 என்பது அதிகாரப்பூர்வ விலையா?" },
    a: {
      en: "No, and the site says so wherever it appears. ₹4–5 is what growers report being paid. ₹15.45 is the notified figure. The entire demand is that official weekly data be published so the two can finally be compared against each other.",
      ta: "இல்லை; அது தோன்றும் ஒவ்வோர் இடத்திலும் இதைத் தெளிவாகக் குறிப்பிட்டுள்ளோம். ₹4–5 என்பது விவசாயிகள் தெரிவிப்பது; ₹15.45 என்பது அறிவிக்கப்பட்டது. இவ்விரண்டையும் ஒப்பிட்டுப் பார்க்க அதிகாரப்பூர்வ வாராந்திரத் தரவை வெளியிட வேண்டும் என்பதே கோரிக்கை.",
    },
  },
  {
    q: { en: "What exactly is being asked for?", ta: "சரியாக என்ன கோரப்படுகிறது?" },
    a: {
      en: "Six things, each sent to the office that can actually act on it: weekly procurement data, daily price boards with a grievance line, a purchase centre in every mango block, a real cost-of-cultivation study, a price announced before flowering, and a permanent buyer with grower ownership in processing.",
      ta: "ஆறு விஷயங்கள்; ஒவ்வொன்றும் நடவடிக்கை எடுக்கக்கூடிய அலுவலகத்திற்கு: வாராந்திர கொள்முதல் தரவு, தினசரி விலைப் பலகைகளும் குறைதீர் எண்ணும், ஒவ்வொரு வட்டாரத்திலும் கொள்முதல் மையம், உண்மையான சாகுபடி செலவு ஆய்வு, பூக்கும் முன் விலை அறிவிப்பு, நிரந்தர வாங்குபவரும் பதப்படுத்தலில் விவசாயிகள் உரிமையும்.",
    },
  },
  {
    q: { en: "Does this take anything away from paddy farmers?", ta: "இது நெல் விவசாயிகளிடமிருந்து எதையாவது பறிக்குமா?" },
    a: {
      en: "Nothing at all. Delta paddy growers face real hardship of their own. The comparison here is between two support systems, not two regions, and the ask is to build for mango what paddy already has.",
      ta: "இல்லவே இல்லை. டெல்டா நெல் விவசாயிகளும் உண்மையான சிரமங்களைச் சந்திக்கிறார்கள். இங்குள்ள ஒப்பீடு இரு ஆதரவு அமைப்புகளுக்கு இடையேயானது; இரு பகுதிகளுக்கு இடையே அல்ல. நெல்லுக்கு ஏற்கனவே உள்ளதை மாம்பழத்திற்கும் உருவாக்க வேண்டும் என்பதே கோரிக்கை.",
    },
  },
  {
    q: { en: "I am not a farmer. Is there anything useful I can do?", ta: "நான் விவசாயி இல்லை. நான் ஏதாவது செய்ய முடியுமா?" },
    a: {
      en: "Yes, and it is the most useful thing available: share one verified figure together with the document it came from, and ask your representative to place the factual questions on record. Claims that carry their source are much harder to wave away.",
      ta: "ஆம்; அதுவே மிகவும் பயனுள்ளது. ஒரு சரிபார்க்கப்பட்ட எண்ணையும் அது வந்த ஆவணத்தையும் சேர்த்துப் பகிருங்கள்; உண்மைக் கேள்விகளைப் பதிவு செய்யுமாறு உங்கள் பிரதிநிதியிடம் கேளுங்கள். ஆதாரத்துடன் வரும் தகவலைப் புறக்கணிப்பது கடினம்.",
    },
  },
  {
    q: { en: "How do I check these numbers for myself?", ta: "இந்த எண்களை நானே எப்படிச் சரிபார்ப்பது?" },
    a: {
      en: "Ask in writing for the weekly procurement record: quantity purchased, growers covered, centres operating, price paid and payment settlement time. A Right to Information request to the district Horticulture office or the procuring agency is the standard route. Keep the dated acknowledgement number — the follow-up matters more than the first letter.",
      ta: "வாராந்திர கொள்முதல் பதிவை எழுத்துப்பூர்வமாகக் கோருங்கள்: வாங்கிய அளவு, பயனடைந்த விவசாயிகள், செயல்படும் மையங்கள், வழங்கப்பட்ட விலை, பணம் செலுத்திய காலம். மாவட்ட தோட்டக்கலைத் துறை அல்லது கொள்முதல் நிறுவனத்திற்கு தகவல் அறியும் உரிமைச் சட்ட விண்ணப்பம் அளிப்பதே வழக்கமான வழி. தேதியிட்ட ஒப்புகை எண்ணை வைத்திருங்கள்; முதல் கடிதத்தைவிட பின்தொடர்பே முக்கியம்.",
    },
  },
  {
    q: { en: "Are the counts on this site real?", ta: "இந்தத் தளத்தில் உள்ள எண்ணிக்கை உண்மையானதா?" },
    a: {
      en: "The counters open at a starting figure rather than at zero, and your own like or vote is added on top of it and saved in your browser. So the movement above the starting figure is real; the starting figure itself is presentational. A fully measured count across everyone needs a server connection.",
      ta: "எண்ணிக்கை பூஜ்ஜியத்திலிருந்து அல்லாமல் ஒரு தொடக்க அளவிலிருந்து காட்டப்படுகிறது; உங்கள் விருப்பமும் வாக்கும் அதனுடன் சேர்க்கப்பட்டு உங்கள் உலாவியில் சேமிக்கப்படுகின்றன. எனவே தொடக்க அளவுக்கு மேல் உள்ள மாற்றம் உண்மையானது; தொடக்க அளவு காட்சிக்கானது. அனைவருக்கும் பொதுவான முழு எண்ணிக்கைக்கு சேவையக இணைப்பு தேவை.",
    },
  },
];

export function Faq({ lang }: { lang: Language }) {
  const ta = lang === "ta";
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq-section" id="faq">
      <div className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow light">{ta ? "10 · கேள்விகள்" : "10 · QUESTIONS"}</p>
            <SectionAudio topic="faq" lang={lang} />
            <h2>{ta ? "மக்கள் கேட்கும் கேள்விகள்." : "The questions people actually ask."}</h2>
          </div>
          <p>
            {ta
              ? "இவற்றுக்குப் பதில் தெரிந்திருந்தால், இந்தப் பிரச்சினை குறித்த எந்த உரையாடலையும் நீங்கள் நம்பிக்கையுடன் நடத்த முடியும்."
              : "Answer these and you can hold any conversation about this issue with confidence, including a sceptical one."}
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <div className={isOpen ? "faq-item is-open" : "faq-item"} key={item.q.en}>
                <h3>
                  <button onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={`faq-panel-${index}`}>
                    <span>{item.q[lang]}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div className="faq-panel" id={`faq-panel-${index}`} role="region" aria-hidden={!isOpen}>
                  <div>
                    <p>{item.a[lang]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq-aside">
          <Cartoon name="directConsultation" className="faq-art" />
          <p>
            {ta
              ? "பொதுவெளியில் பயன்படுத்தும் முன், பருவ விலை, தற்போதைய அதிகாரிகள், அறிவிக்கப்பட்ட திட்டங்களை புதிய அரசு பதிவுகளுடன் சரிபார்க்கவும்."
              : "Before using any of this publicly, re-check seasonal prices, current officeholders and announced schemes against fresh official records."}
          </p>
        </div>
      </div>
    </section>
  );
}
