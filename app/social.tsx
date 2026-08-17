"use client";

import { useCallback, useEffect, useState } from "react";
import { Cartoon } from "./cartoons";
import { Language } from "./audio";
import { liveReferences } from "./references";

/* ------------------------------------------------------------------ *
 * Watch and follow
 *
 * ⇩⇩⇩  YOUR OWN CHANNELS GO HERE  ⇩⇩⇩
 *
 * Paste your links between the quote marks. Anything left empty is not
 * shown, so the box never displays a dead link. These appear above the
 * verified press coverage, which is loaded from app/references.tsx.
 * ------------------------------------------------------------------ */

type Social = {
  id: string;
  url: string;
  label: Record<Language, string>;
  note: Record<Language, string>;
};

export const socialLinks: Social[] = [
  { id: "youtube", url: "", label: { en: "YouTube", ta: "யூடியூப்" }, note: { en: "Our channel", ta: "எங்கள் சேனல்" } },
  { id: "instagram", url: "", label: { en: "Instagram", ta: "இன்ஸ்டாகிராம்" }, note: { en: "Photos from the belt", ta: "களப் புகைப்படங்கள்" } },
  { id: "facebook", url: "", label: { en: "Facebook", ta: "பேஸ்புக்" }, note: { en: "Follow updates", ta: "புதுப்பிப்புகள்" } },
  { id: "whatsapp", url: "", label: { en: "WhatsApp", ta: "வாட்ஸ்அப்" }, note: { en: "Join the group", ta: "குழுவில் இணையுங்கள்" } },
];

const icons: Record<string, React.ReactNode> = {
  youtube: <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15V9l5 3z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.3" />
    </>
  ),
  facebook: <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6A22 22 0 0 0 14.3 4.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V14h2.7v8z" />,
  whatsapp: <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.1 14.1c-.2.6-1.2 1.2-1.7 1.2-.5 0-1 .2-3.3-.7s-3.7-3.2-3.8-3.4c-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.9c.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3s0 .8-.2 1.4z" />,
};

/* ------------------------------------------------------------------ *
 * Full coverage view
 *
 * A static site has no server to route to, so this opens as its own
 * full screen view rather than a second HTML page. For the reader it
 * behaves the same, it works offline, and Escape or the close button
 * returns them to exactly where they were.
 * ------------------------------------------------------------------ */

function CoverageView({ lang, focus, onClose }: { lang: Language; focus: string | null; onClose: () => void }) {
  const ta = lang === "ta";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  useEffect(() => {
    if (!focus) return;
    document.getElementById(`cov-${focus}`)?.scrollIntoView({ block: "center" });
  }, [focus]);

  const videos = liveReferences();

  const card = (item: (typeof videos)[number]) => (
    <a
      key={item.id}
      id={`cov-${item.id}`}
      className={focus === item.id ? "cov-card is-focus" : "cov-card"}
      href={item.url}
      target="_blank"
      rel="noreferrer"
    >
      <span className="cov-poster">
        <Cartoon name={item.art} />
        <em className="cov-kind is-video">▶ {ta ? "காணொளி" : "VIDEO"}</em>
      </span>
      <span className="cov-body">
        <span className="cov-meta">
          <strong>{item.source}</strong>
          <i>{item.date[lang]}</i>
          {item.key && <b>{ta ? "நமது எண்ணை உறுதிப்படுத்துகிறது" : "CORROBORATES OUR FIGURE"}</b>}
        </span>
        <span className="cov-title">{item.title[lang]}</span>
        <span className="cov-note">{item.note[lang]}</span>
        <span className="cov-url">{item.url.replace(/^https?:\/\//, "").slice(0, 74)}…</span>
      </span>
    </a>
  );

  return (
    <div className="cov" role="dialog" aria-modal="true" aria-label={ta ? "ஊடகச் செய்திகள்" : "Coverage"}>
      <header>
        <div>
          <p>{ta ? "காணொளிச் செய்திகள்" : "ON VIDEO"}</p>
          <h2>{ta ? "நேரடியாகப் பாருங்கள்." : "See it for yourself."}</h2>
        </div>
        <button onClick={onClose} aria-label={ta ? "மூடு" : "Close"}>✕</button>
      </header>

      <div className="cov-scroll">
        <p className="cov-lead">
          {ta
            ? "இந்த நெருக்கடி குறித்த காணொளி அறிக்கைகள். பகிரும் முன் ஒவ்வொன்றையும் பார்த்துச் சரிபார்க்கவும்."
            : "Video reports on this crisis. Watch each one and check it before sharing."}
        </p>

        <h3 className="cov-group">{ta ? `காணொளிகள் (${videos.length})` : `Videos (${videos.length})`}</h3>
        <div className="cov-grid">{videos.map(card)}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The hero box
 * ------------------------------------------------------------------ */

export function SocialBox({ lang }: { lang: Language }) {
  const ta = lang === "ta";
  const [focus, setFocus] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const mine = socialLinks.filter((link) => link.url.trim().length > 0);
  const live = liveReferences();
  const preview = live.slice(0, 4);

  const openCoverage = useCallback((id: string | null) => {
    setFocus(id);
    setShowAll(true);
  }, []);

  return (
    <>
      <aside className="social-box">
        <p className="social-box-tag">
          <span aria-hidden="true">◆</span>
          {ta ? "பார்க்கவும் பின்தொடரவும்" : "Watch and follow"}
        </p>

        {mine.length > 0 && (
          <div className="social-grid">
            {mine.map((link) => (
              <a key={link.id} className={`social-tile social-${link.id}`} href={link.url} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  {icons[link.id]}
                </svg>
                <span>
                  <strong>{link.label[lang]}</strong>
                  <em>{link.note[lang]}</em>
                </span>
              </a>
            ))}
          </div>
        )}

        {preview.length > 0 && (
        <div className="ref-strip">
          {preview.map((item) => (
            <button
              key={item.id}
              className="ref-chip"
              onClick={() => openCoverage(item.id)}
              aria-label={`${item.source}: ${item.title[lang]}`}
            >
              <span className="ref-chip-poster">
                <Cartoon name={item.art} />
                <i aria-hidden="true">▶</i>
              </span>
              <span className="ref-chip-name">{item.source}</span>

              {/* Preview shown on hover and on keyboard focus */}
              <span className="ref-tip" role="tooltip">
                <span className="ref-tip-poster">
                  <Cartoon name={item.art} />
                </span>
                <span className="ref-tip-copy">
                  <b>
                    {item.source} · {item.date[lang]}
                  </b>
                  <strong>{item.title[lang]}</strong>
                  <em>{item.note[lang]}</em>
                  <u>{ta ? "விரிவாகப் பார்க்க கிளிக் செய்யவும்" : "Click to open the full coverage"}</u>
                </span>
              </span>
            </button>
          ))}
        </div>
        )}

        {live.length > 0 && (
          <button className="ref-all" onClick={() => openCoverage(null)}>
            {ta ? `அனைத்து ${live.length} காணொளிகளையும் பார்க்க` : `See all ${live.length} videos`} →
          </button>
        )}
      </aside>

      {showAll && (
        <CoverageView
          lang={lang}
          focus={focus}
          onClose={() => {
            setShowAll(false);
            setFocus(null);
          }}
        />
      )}
    </>
  );
}
