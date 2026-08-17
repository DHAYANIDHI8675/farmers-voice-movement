"use client";

import { Cartoon, CartoonName } from "./cartoons";
import { Language } from "./audio";

/* ------------------------------------------------------------------ *
 * Video coverage
 *
 * ⇩⇩⇩  PASTE YOUR VIDEO LINKS HERE  ⇩⇩⇩
 *
 * Only entries with a `url` are shown, so an empty slot never appears as
 * a dead link. Add as many as you like — YouTube videos, YouTube Shorts,
 * Instagram Reels, Facebook videos all work.
 *
 * Only two entries below are filled, because those are the only videos I
 * could verify by search. Everything else is an empty slot waiting for a
 * link you have watched yourself.
 * ------------------------------------------------------------------ */

export type VideoRef = {
  id: string;
  url: string;
  art: CartoonName;
  platform: "youtube" | "shorts" | "instagram" | "facebook";
  source: string;
  date: Record<Language, string>;
  title: Record<Language, string>;
  note: Record<Language, string>;
  key?: boolean;
};

export const references: VideoRef[] = [
  {
    id: "sunnews",
    url: "https://www.youtube.com/shorts/C2uGd1hfOeY",
    art: "priceGap",
    platform: "shorts",
    source: "Sun News",
    date: { en: "Tamil · Short", ta: "தமிழ் · குறும்பதிவு" },
    title: {
      en: "Krishnagiri mango: TN farmers hit by low prices",
      ta: "கிருஷ்ணகிரி மாம்பழம்: குறைந்த விலையால் பாதிக்கப்பட்ட விவசாயிகள்",
    },
    note: {
      en: "A short Tamil television report filmed in the Krishnagiri belt.",
      ta: "கிருஷ்ணகிரி பகுதியில் படமாக்கப்பட்ட குறும் தமிழ்த் தொலைக்காட்சி அறிக்கை.",
    },
    key: true,
  },
  {
    id: "kolar-protest",
    url: "https://www.facebook.com/VVCNEWSHASSAN/videos/1205473750894296/",
    art: "standTogether",
    platform: "facebook",
    source: "VVC News",
    date: { en: "Kolar, Karnataka", ta: "கோலார், கர்நாடகா" },
    title: {
      en: "Mango growers protest demanding a support price",
      ta: "ஆதரவு விலை கோரி மாம்பழ விவசாயிகள் போராட்டம்",
    },
    note: {
      en: "Across the border, in Kannada. Same crop, same collapse — useful for showing this is not one district's complaint.",
      ta: "எல்லைக்கு அப்பால், கன்னடத்தில். அதே பயிர், அதே வீழ்ச்சி — இது ஒரு மாவட்டத்தின் குறை மட்டும் அல்ல என்பதைக் காட்ட உதவும்.",
    },
  },

  {
    id: "csb-explainer",
    url: "https://www.youtube.com/shorts/E1YddkeRNmM",
    art: "cannotWait",
    platform: "shorts",
    source: "CSB IAS Academy",
    date: { en: "Explainer · Short", ta: "விளக்கம் · குறும்பதிவு" },
    title: {
      en: "Totapuri prices fall, fruit dumped by the roadside",
      ta: "தோத்தாபுரி விலை வீழ்ச்சி, சாலையோரம் கொட்டப்பட்ட பழங்கள்",
    },
    note: {
      en: "A current-affairs explainer from a coaching channel, not news footage. Useful as a quick summary of the Andhra–Karnataka dispute, but it is not reporting from the field.",
      ta: "பயிற்சி மைய சேனலின் நடப்பு நிகழ்வு விளக்கம்; செய்திக் காட்சிகள் அல்ல. ஆந்திரா–கர்நாடகா தகராறின் சுருக்கமாகப் பயன்படும்; ஆனால் களத்திலிருந்து வந்த அறிக்கை அல்ல.",
    },
  },

  /* ---- Empty slots. Paste a URL and the card appears by itself. ----
     Change `art` to any cartoon name if you want a different poster:
     priceGap, closedCentre, treeLost, householdShock, paddyMangoCover,
     cannotWait, priceBoard, buyerAtTheGate, priceBeforeFlowering,
     valueChain, directConsultation, spreadTheWord, standTogether. */
  {
    id: "slot-1",
    url: "",
    art: "treeLost",
    platform: "youtube",
    source: "",
    date: { en: "", ta: "" },
    title: { en: "", ta: "" },
    note: { en: "", ta: "" },
  },
  {
    id: "slot-2",
    url: "",
    art: "closedCentre",
    platform: "shorts",
    source: "",
    date: { en: "", ta: "" },
    title: { en: "", ta: "" },
    note: { en: "", ta: "" },
  },
  {
    id: "slot-3",
    url: "",
    art: "householdShock",
    platform: "instagram",
    source: "",
    date: { en: "", ta: "" },
    title: { en: "", ta: "" },
    note: { en: "", ta: "" },
  },
  {
    id: "slot-4",
    url: "",
    art: "cannotWait",
    platform: "youtube",
    source: "",
    date: { en: "", ta: "" },
    title: { en: "", ta: "" },
    note: { en: "", ta: "" },
  },
];

/** Only the slots that actually have a link. */
export const liveReferences = () => references.filter((item) => item.url.trim().length > 0);

const platformLabel: Record<VideoRef["platform"], string> = {
  youtube: "YouTube",
  shorts: "Short",
  instagram: "Reel",
  facebook: "Facebook",
};

export function References({ lang }: { lang: Language }) {
  const ta = lang === "ta";
  const live = liveReferences();
  if (live.length === 0) return null;

  return (
    <div className="refs" id="coverage">
      <div className="refs-head">
        <div>
          <p className="eyebrow light">{ta ? "காணொளிச் செய்திகள்" : "ON VIDEO"}</p>
          <h3>{ta ? "நேரடியாகப் பாருங்கள்." : "See it for yourself."}</h3>
        </div>
        <p>
          {ta
            ? "இந்த நெருக்கடி குறித்த காணொளி அறிக்கைகள். ஒரு விவசாயி பேசுவதைக் கேட்பது, எந்தப் புள்ளிவிவரத்தையும் விட வேகமாகச் சென்றடையும்."
            : "Video reports on this crisis. Hearing a grower say it reaches people faster than any statistic on this page."}
        </p>
      </div>

      <div className="refs-grid">
        {live.map((item) => (
          <a
            key={item.id}
            className={item.key ? "ref-card is-key" : "ref-card"}
            href={item.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className="ref-poster">
              <Cartoon name={item.art} />
              <em className="ref-kind is-video">▶ {platformLabel[item.platform]}</em>
            </span>
            <span className="ref-body">
              <span className="ref-meta">
                <strong>{item.source}</strong>
                <i>{item.date[lang]}</i>
              </span>
              <span className="ref-title">{item.title[lang]}</span>
              <span className="ref-note">{item.note[lang]}</span>
              <span className="ref-go">{ta ? "காணொளியைப் பார்க்க ↗" : "Watch the video ↗"}</span>
            </span>
          </a>
        ))}
      </div>

      <p className="refs-caution">
        {ta
          ? "இவை வெளி ஊடகங்களின் காணொளிகள்; இந்த இயக்கத்தின் சொந்தப் பதிவுகள் அல்ல. பொதுவெளியில் பகிரும் முன் ஒவ்வொன்றையும் பார்த்துச் சரிபார்க்கவும்."
          : "These are other people's videos, not this movement's own recordings. Watch each one and check it before sharing publicly."}
      </p>
    </div>
  );
}
