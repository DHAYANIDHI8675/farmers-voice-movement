"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Language } from "./audio";

/* ------------------------------------------------------------------ *
 * WhatsApp card generator
 *
 * Links travel badly in village WhatsApp groups; images travel fast. This
 * draws a square poster on a canvas and hands back a real PNG the person
 * can send, print or set as a status. Everything is drawn in the browser,
 * so it works offline and needs no image files.
 * ------------------------------------------------------------------ */

type Card = {
  id: string;
  figure: Record<Language, string>;
  caption: Record<Language, string>;
  line: Record<Language, string>;
};

const cards: Card[] = [
  {
    id: "gap",
    figure: { en: "₹15.45 → ₹4–5", ta: "₹15.45 → ₹4–5" },
    caption: { en: "NOTIFIED VS REPORTED", ta: "அறிவிக்கப்பட்டது – கிடைப்பது" },
    line: {
      en: "Totapuri mango was notified at ₹15.45 a kilo. Growers report being paid ₹4–5 at the ramp.",
      ta: "தோத்தாபுரிக்கு கிலோ ₹15.45 அறிவிக்கப்பட்டது. விவசாயிகளுக்கு ₹4–5 மட்டுமே கிடைக்கிறது.",
    },
  },
  {
    id: "late",
    figure: { en: "TOO LATE", ta: "மிகவும் தாமதம்" },
    caption: { en: "THE PRICE ARRIVED AFTER THE HARVEST", ta: "அறுவடைக்குப் பின் வந்த விலை" },
    line: {
      en: "A price announced after the fruit is sold cannot change what the grower was paid for it.",
      ta: "பழம் விற்ற பிறகு வரும் விலை, விவசாயிக்குக் கிடைத்ததை மாற்றாது.",
    },
  },
  {
    id: "trees",
    figure: { en: "51,000 ha", ta: "51,000 ஹெக்டேர்" },
    caption: { en: "MANGO IN TWO DISTRICTS", ta: "இரு மாவட்ட மாம்பழப் பரப்பு" },
    line: {
      en: "A mango tree takes years to bear. A tree cut this year is not brought back by a better price next year.",
      ta: "மாமரம் காய்க்க பல ஆண்டுகள் ஆகும். இந்த ஆண்டு வெட்டப்பட்ட மரம் அடுத்த ஆண்டு திரும்பாது.",
    },
  },
  {
    id: "farmers",
    figure: { en: "2,13,023", ta: "2,13,023" },
    caption: { en: "SMALL AND MARGINAL FARMERS", ta: "சிறு மற்றும் குறு விவசாயிகள்" },
    line: {
      en: "Krishnagiri and Dharmapuri. One question: where did the notified price go?",
      ta: "கிருஷ்ணகிரி, தருமபுரி. ஒரே கேள்வி: அறிவிக்கப்பட்ட விலை எங்கே போனது?",
    },
  },
];

const SIZE = 1080;

const noopSubscribe = () => () => {};

/** Word-wraps text to a pixel width and returns the lines. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function drawCard(canvas: HTMLCanvasElement, card: Card, lang: Language, siteUrl: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const display = '"Baloo Thambi 2", Georgia, serif';
  const body = '"Anek Tamil", Inter, sans-serif';

  ctx.clearRect(0, 0, SIZE, SIZE);

  // Warm gradient ground
  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0, "#FFD23F");
  bg.addColorStop(0.5, "#FF9E1B");
  bg.addColorStop(1, "#E8420F");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Soft light behind the headline
  const glow = ctx.createRadialGradient(SIZE * 0.3, SIZE * 0.3, 40, SIZE * 0.3, SIZE * 0.3, SIZE * 0.7);
  glow.addColorStop(0, "rgba(255,255,255,.34)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const pad = 70;
  const panelY = 250;
  const inner = SIZE - pad * 2 - 92;

  // Measure first, then size the panel to its contents so short cards do
  // not leave a large empty block underneath the text.
  const display0 = `800 118px ${display}`;
  ctx.font = display0;
  let figureSize = 118;
  while (ctx.measureText(card.figure[lang]).width > inner && figureSize > 54) {
    figureSize -= 4;
    ctx.font = `800 ${figureSize}px ${display}`;
  }
  ctx.font = `500 34px ${body}`;
  const lines = wrap(ctx, card.line[lang], inner).slice(0, 5);
  const panelH = 52 + 40 + figureSize + 44 + lines.length * 50 + 44;

  ctx.fillStyle = "rgba(6,21,13,.88)";
  ctx.beginPath();
  ctx.roundRect(pad, panelY, SIZE - pad * 2, panelH, 44);
  ctx.fill();

  // Masthead
  ctx.fillStyle = "#06150D";
  ctx.font = `800 40px ${display}`;
  ctx.textBaseline = "top";
  ctx.fillText(lang === "ta" ? "விவசாயிகளின் குரல்" : "FARMERS' VOICE", pad, 92);
  ctx.font = `700 25px ${body}`;
  ctx.fillStyle = "rgba(6,21,13,.72)";
  ctx.fillText(lang === "ta" ? "மாம்பழப் பகுதி இயக்கம்" : "MANGO BELT MOVEMENT", pad, 150);

  // Caption above the figure
  ctx.fillStyle = "#FFD23F";
  ctx.font = `700 26px ${body}`;
  const caption = card.caption[lang];
  ctx.fillText(caption.length > 46 ? caption.slice(0, 46) : caption, pad + 46, panelY + 52);

  // The figure
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 ${figureSize}px ${display}`;
  ctx.fillText(card.figure[lang], pad + 46, panelY + 92);

  // Supporting line
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.font = `500 34px ${body}`;
  lines.forEach((line, index) => {
    ctx.fillText(line, pad + 46, panelY + 92 + figureSize + 40 + index * 50);
  });

  // Footer: where to go next
  ctx.fillStyle = "#06150D";
  ctx.font = `800 34px ${display}`;
  ctx.fillText(lang === "ta" ? "நாங்கள் உங்களுக்காக நிற்கிறோம்" : "WE STAND FOR YOU", pad, SIZE - 190);
  ctx.font = `600 27px ${body}`;
  ctx.fillStyle = "rgba(6,21,13,.78)";
  ctx.fillText(siteUrl, pad, SIZE - 132);

  // Peaceful / non-partisan mark, kept on every card
  ctx.font = `600 22px ${body}`;
  ctx.fillStyle = "rgba(6,21,13,.6)";
  ctx.fillText(
    lang === "ta" ? "அமைதியான · கட்சி சார்பற்ற · ஆதார வழி" : "PEACEFUL · NON-PARTISAN · EVIDENCE-LED",
    pad,
    SIZE - 84
  );
}

export function ShareCardMaker({ lang }: { lang: Language }) {
  const ta = lang === "ta";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState("");
  // Read from the browser rather than syncing it into state: the server
  // renders a placeholder and the real host appears on hydration.
  const siteUrl = useSyncExternalStore(
    noopSubscribe,
    () => window.location.host + window.location.pathname.replace(/\/$/, ""),
    () => ""
  );

  // Redraw whenever the choice, language or fonts change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const paint = () => {
      if (!cancelled) drawCard(canvas, cards[selected], lang, siteUrl || "farmers-voice");
    };
    paint();
    // Fonts may still be loading on first paint; redraw once they are ready.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(paint).catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [selected, lang, siteUrl]);

  const toBlob = useCallback(
    () =>
      new Promise<Blob | null>((resolve) => {
        const canvas = canvasRef.current;
        if (!canvas) return resolve(null);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      }),
    []
  );

  const download = useCallback(async () => {
    const blob = await toBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `farmers-voice-${cards[selected].id}-${lang}.png`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus(ta ? "படம் பதிவிறக்கப்பட்டது ✓" : "Image downloaded ✓");
    window.setTimeout(() => setStatus(""), 2600);
  }, [toBlob, selected, lang, ta]);

  const shareImage = useCallback(async () => {
    const blob = await toBlob();
    if (!blob) return;
    const file = new File([blob], `farmers-voice-${cards[selected].id}.png`, { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], text: cards[selected].line[lang] });
        return;
      } catch {
        /* Share sheet dismissed. */
      }
    }
    setStatus(ta ? "நேரடிப் பகிர்வு இல்லை — பதிவிறக்கி அனுப்பவும்." : "Direct sharing isn't available here — download it and send.");
    window.setTimeout(() => setStatus(""), 4200);
  }, [toBlob, selected, lang, ta]);

  return (
    <div className="cardmaker">
      <div className="cardmaker-copy">
        <p className="eyebrow light">{ta ? "வாட்ஸ்அப் படம்" : "WHATSAPP IMAGE"}</p>
        <h3>{ta ? "அனுப்பக்கூடிய படம் உருவாக்குங்கள்." : "Make an image people will actually open."}</h3>
        <p>
          {ta
            ? "இணைப்புகளைவிட படங்கள் வேகமாகப் பரவும். ஒரு தகவலைத் தேர்ந்தெடுத்து, படத்தைப் பதிவிறக்கி வாட்ஸ்அப் குழுவில் அனுப்புங்கள் அல்லது ஸ்டேட்டஸாக வைக்கவும்."
            : "Images travel through WhatsApp groups far better than links do. Pick a fact, then download the square image and send it, or set it as your status."}
        </p>

        <div className="cardmaker-picks" role="group" aria-label={ta ? "தகவலைத் தேர்ந்தெடுக்கவும்" : "Choose a fact"}>
          {cards.map((card, index) => (
            <button
              key={card.id}
              className={index === selected ? "is-picked" : ""}
              onClick={() => setSelected(index)}
              aria-pressed={index === selected}
            >
              {card.caption[lang]}
            </button>
          ))}
        </div>

        <div className="cardmaker-actions">
          <button className="button button-primary" onClick={download}>
            {ta ? "படத்தைப் பதிவிறக்க" : "Download image"} ↓
          </button>
          <button className="button button-light" onClick={shareImage}>
            {ta ? "நேரடியாகப் பகிர" : "Share directly"} ↗
          </button>
        </div>
        {status && <p className="cardmaker-status">{status}</p>}
      </div>

      <figure className="cardmaker-preview">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} aria-label={ta ? "பகிரக்கூடிய படத்தின் முன்னோட்டம்" : "Preview of the shareable image"} />
        <figcaption>{ta ? "1080 × 1080 · வாட்ஸ்அப் மற்றும் ஸ்டேட்டஸுக்கு ஏற்றது" : "1080 × 1080 · sized for WhatsApp and status"}</figcaption>
      </figure>
    </div>
  );
}
