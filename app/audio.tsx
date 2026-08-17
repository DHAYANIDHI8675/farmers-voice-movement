"use client";

import { useCallback, useEffect, useState } from "react";

export type Language = "en" | "ta";

/* ------------------------------------------------------------------ *
 * Speech
 *
 * Everything here uses the browser's built-in speech engine, so nothing
 * is uploaded and no service is called. The catch is that the available
 * voices belong to the device: most phones and browsers carry English,
 * but a Tamil voice is not guaranteed. We detect that and say so rather
 * than playing English words at someone who asked for Tamil.
 * ------------------------------------------------------------------ */

export function listVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export function pickVoice(lang: Language): SpeechSynthesisVoice | null {
  const wanted = lang === "ta" ? "ta" : "en";
  const voices = listVoices();
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(`${wanted}-in`)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(wanted)) ??
    null
  );
}

/** True when the device can actually speak the requested language. */
export function canSpeak(lang: Language) {
  return pickVoice(lang) !== null;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
}

export function speak(text: string, lang: Language, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();

  const voice = pickVoice(lang);
  // Long passages are split into sentences: some engines silently truncate
  // a single long utterance, and short ones also let stop feel immediate.
  const parts = text.match(/[^.!?।]+[.!?।]*/g) ?? [text];
  let index = 0;

  const next = () => {
    if (index >= parts.length) {
      onEnd?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(parts[index].trim());
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? (lang === "ta" ? "ta-IN" : "en-IN");
    utterance.rate = lang === "ta" ? 0.92 : 0.98;
    utterance.pitch = 1;
    utterance.onend = () => {
      index += 1;
      next();
    };
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  };

  next();
  return true;
}

/** Re-renders once the browser has finished loading its voice list. */
export function useVoicesReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const update = () => setReady(true);
    if (window.speechSynthesis.getVoices().length) {
      // Voices already present; announce on the next tick, not during the effect.
      const id = window.setTimeout(update, 0);
      return () => window.clearTimeout(id);
    }
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
  }, []);

  return ready;
}

/* ------------------------------------------------------------------ *
 * Spoken scripts
 *
 * These are written to be heard, not read: shorter sentences, the key
 * figures spoken in full, and no reliance on anything on screen.
 * ------------------------------------------------------------------ */

export const audioScripts: Record<string, Record<Language, string>> = {
  home: {
    en: "Farmers' Voice is a peaceful, non-partisan movement in the mango belt of Krishnagiri, Dharmapuri and Bargur. It asks one clear question. If fifteen rupees forty five paise per kilo was notified for Totapuri mango, why do growers report receiving only four to five rupees? Everything on this site comes from eight supplied documents, and every claim can be checked against them.",
    ta: "விவசாயிகளின் குரல் என்பது கிருஷ்ணகிரி, தருமபுரி மற்றும் பர்கூர் மாம்பழப் பகுதியின் அமைதியான, கட்சி சார்பற்ற இயக்கம். இது ஒரே ஒரு கேள்வியைக் கேட்கிறது. தோத்தாபுரி மாம்பழத்திற்கு கிலோ பதினைந்து ரூபாய் நாற்பத்தைந்து காசு அறிவிக்கப்பட்டபோது, விவசாயிகளுக்கு நான்கு முதல் ஐந்து ரூபாய் மட்டுமே கிடைப்பதாக ஏன் தெரிவிக்கிறார்கள்? இந்தத் தளத்தில் உள்ள அனைத்தும் வழங்கப்பட்ட எட்டு ஆவணங்களிலிருந்து வந்தவை.",
  },
  crisis: {
    en: "The loss begins at the ramp, but it does not end there. When the price falls, fruit is left unharvested. Harvest workers lose their wages. Debt grows, education is cut short, and families migrate for work. Orchards built over decades are leased out or cleared. A mature mango tree takes years to bear, and it is not replaced by a price announced later.",
    ta: "இழப்பு விற்பனை இடத்தில் தொடங்குகிறது; ஆனால் அங்கே முடிவதில்லை. விலை வீழ்ச்சியடையும்போது பழங்கள் அறுவடை செய்யப்படாமல் விடப்படுகின்றன. அறுவடைத் தொழிலாளர்கள் ஊதியத்தை இழக்கின்றனர். கடன் உயர்கிறது, கல்வி பாதிக்கப்படுகிறது, குடும்பங்கள் வேலைக்காக இடம்பெயர்கின்றன. பல ஆண்டுகளாக வளர்ந்த தோட்டங்கள் குத்தகைக்கு விடப்படுகின்றன அல்லது அழிக்கப்படுகின்றன.",
  },
  season: {
    en: "Look at the order of events in one mango season. Before flowering, the price should already be known, but mango has no standing floor price. During flowering, the grower spends on spraying, irrigation and labour, months before any income. At harvest, the fruit must move within days, and growers report four to five rupees a kilo. Only then does the intervention price arrive. A price announced after the fruit is sold cannot change what the grower was paid.",
    ta: "ஒரு மாம்பழப் பருவத்தின் வரிசையைப் பாருங்கள். பூக்கும் முன்பே விலை தெரிந்திருக்க வேண்டும்; ஆனால் மாம்பழத்திற்கு நிலையான அடிப்படை விலை இல்லை. பூக்கும் காலத்தில் மருந்து, நீர்ப்பாசனம், கூலி என்று செலவு நடக்கிறது. அறுவடையின்போது பழம் சில நாட்களுக்குள் நகர வேண்டும்; கிலோ நான்கு முதல் ஐந்து ரூபாய் மட்டுமே கிடைக்கிறது. அதன் பிறகுதான் தலையீட்டு விலை வருகிறது. பழம் விற்ற பிறகு வரும் விலை, விவசாயிக்குக் கிடைத்ததை மாற்றாது.",
  },
  demands: {
    en: "There are six demands, and each one goes to the office that can actually act on it. Publish procurement figures every week. Put up daily price boards with a working grievance line. Open a purchase centre in every mango block before harvest. Commission a real cost of cultivation study. Announce the price in December, before flowering. And create a permanent buyer, with genuine farmer ownership in processing.",
    ta: "ஆறு கோரிக்கைகள் உள்ளன; ஒவ்வொன்றும் நடவடிக்கை எடுக்கக்கூடிய அலுவலகத்திற்குச் செல்கிறது. வாரந்தோறும் கொள்முதல் விவரங்களை வெளியிட வேண்டும். தினசரி விலைப் பலகைகளும் செயல்படும் குறைதீர் எண்ணும் வேண்டும். அறுவடைக்கு முன் ஒவ்வொரு மாம்பழ வட்டாரத்திலும் கொள்முதல் மையம் திறக்க வேண்டும். உண்மையான சாகுபடி செலவு ஆய்வு நடத்த வேண்டும். டிசம்பரில், பூக்கும் முன் விலை அறிவிக்க வேண்டும். நிரந்தர வாங்குபவரும், பதப்படுத்தலில் விவசாயிகளுக்கு உரிமைப் பங்கும் வேண்டும்.",
  },
  compare: {
    en: "This is a comparison between two crops, not between two regions. Paddy farmers face real hardship of their own, and nothing is asked to be taken from them. But paddy has a support price known before sowing, a permanent state buyer, purchase centres opened each season, and guaranteed demand. Mango has none of these. It has a scheme that must be approved afresh every year. The ask is simply to build for mango what paddy already has.",
    ta: "இது இரு பயிர்களுக்கு இடையேயான ஒப்பீடு; இரு பகுதிகளுக்கு இடையே அல்ல. நெல் விவசாயிகளும் உண்மையான சிரமங்களைச் சந்திக்கிறார்கள்; அவர்களிடமிருந்து எதையும் எடுக்கக் கோரவில்லை. ஆனால் நெல்லுக்கு விதைப்பதற்கு முன்பே ஆதரவு விலை உண்டு, நிரந்தர அரசு வாங்குபவர் உண்டு, ஒவ்வொரு பருவமும் கொள்முதல் மையங்கள் உண்டு. மாம்பழத்திற்கு இவை எதுவும் இல்லை. நெல்லுக்கு ஏற்கனவே உள்ளதை மாம்பழத்திற்கும் உருவாக்க வேண்டும் என்பதே கோரிக்கை.",
  },
  act: {
    en: "Here is what turns concern into a file number. Keep your weighment slips, receipts, quantities and payment dates. Get a dated acknowledgement for every representation you submit, and follow it up every fortnight. If you are not a farmer, share one verified figure together with the document it came from, and ask your representative to place the factual questions on record.",
    ta: "அக்கறையை ஒரு கோப்பு எண்ணாக மாற்றுவது இதுதான். எடை சீட்டு, ரசீது, அளவு, பணம் கிடைத்த தேதி ஆகியவற்றை வைத்திருங்கள். நீங்கள் அளிக்கும் ஒவ்வொரு மனுவிற்கும் தேதியிட்ட ஒப்புகை பெறுங்கள்; இரு வாரத்திற்கு ஒருமுறை பின்தொடருங்கள். நீங்கள் விவசாயி இல்லையென்றால், ஒரு சரிபார்க்கப்பட்ட எண்ணையும் அது வந்த ஆவணத்தையும் சேர்த்துப் பகிருங்கள்.",
  },
  solutions: {
    en: "The documents do not ask only for compensation. They set out a full system. Make the market visible with published data and daily price boards. Put a buyer within reach of every orchard. Fix the price before the risk begins, in December. Give growers bargaining power through their own producer organisations. Build the whole value chain, from collection and cold storage to juice, dried fruit and kernel oil. And keep growers in the room when decisions are made.",
    ta: "ஆவணங்கள் இழப்பீடு மட்டும் கேட்கவில்லை; ஒரு முழு அமைப்பை முன்வைக்கின்றன. வெளியிடப்பட்ட தரவு மற்றும் தினசரி விலைப் பலகைகள் மூலம் சந்தையை வெளிப்படையாக்குங்கள். ஒவ்வொரு தோட்டத்திற்கும் அருகில் வாங்குபவரை உருவாக்குங்கள். ஆபத்து தொடங்கும் முன், டிசம்பரில் விலையை நிர்ணயியுங்கள். விவசாயிகள் உற்பத்தியாளர் அமைப்புகள் மூலம் பேரம் பேசும் சக்தியை வழங்குங்கள். சேகரிப்பு முதல் சாறு, உலர் பழம், கொட்டை எண்ணெய் வரை முழு மதிப்புச் சங்கிலியை உருவாக்குங்கள்.",
  },
  myths: {
    en: "Some things are said often about this issue. That a price was announced, so the problem is solved. But it arrived after harvest had begun. That prices are low because the fruit is poor quality. But growers report the same low price across grades. That farmers could simply wait for a better price. But paddy stores for months and Totapuri does not. And that this movement is against paddy farmers. It is not. The comparison is crop to crop.",
    ta: "இந்தப் பிரச்சினை குறித்து சில கருத்துகள் அடிக்கடி சொல்லப்படுகின்றன. விலை அறிவிக்கப்பட்டுவிட்டது, எனவே பிரச்சினை தீர்ந்தது என்பது ஒன்று; ஆனால் அது அறுவடை தொடங்கிய பிறகே வந்தது. பழத்தின் தரம் குறைவு என்பதால் விலை குறைவு என்பது இன்னொன்று; ஆனால் அனைத்து தரங்களுக்கும் ஒரே குறைந்த விலையே கிடைக்கிறது. விவசாயிகள் காத்திருக்கலாம் என்பது மற்றொன்று; ஆனால் நெல்லை மாதங்கள் சேமிக்கலாம், தோத்தாபுரியை முடியாது.",
  },
  faq: {
    en: "Two questions come up most. Is this political? No. It supports no party and opposes none, and every demand is addressed to an office by its function. And is the four to five rupee figure official? No. That is what growers report. Fifteen rupees forty five paise is the notified figure. The whole demand is that official weekly data be published, so the two can finally be compared.",
    ta: "இரண்டு கேள்விகள் அதிகம் கேட்கப்படுகின்றன. இது அரசியலா? இல்லை. எந்தக் கட்சிக்கும் ஆதரவோ எதிர்ப்போ இல்லை; ஒவ்வொரு கோரிக்கையும் ஒரு பதவிக்கே அனுப்பப்படுகிறது. நான்கு முதல் ஐந்து ரூபாய் என்பது அதிகாரப்பூர்வமா? இல்லை. அது விவசாயிகள் தெரிவிப்பது. பதினைந்து ரூபாய் நாற்பத்தைந்து காசு என்பது அறிவிக்கப்பட்டது. இவ்விரண்டையும் ஒப்பிட அதிகாரப்பூர்வ வாராந்திரத் தரவு வெளியிடப்பட வேண்டும் என்பதே கோரிக்கை.",
  },
};

/* ------------------------------------------------------------------ *
 * Per-section listen button
 * ------------------------------------------------------------------ */

let activeSetter: ((playing: boolean) => void) | null = null;

export function SectionAudio({ topic, lang }: { topic: string; lang: Language }) {
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const voicesReady = useVoicesReady();
  const ta = lang === "ta";

  useEffect(() => () => {
    if (playing) stopSpeaking();
  }, [playing]);

  const toggle = useCallback(() => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      activeSetter = null;
      return;
    }
    if (!canSpeak(lang)) {
      setUnavailable(true);
      window.setTimeout(() => setUnavailable(false), 6000);
      return;
    }
    // Only one section should be speaking at a time.
    activeSetter?.(false);
    activeSetter = setPlaying;
    setPlaying(true);
    speak(audioScripts[topic]?.[lang] ?? "", lang, () => {
      setPlaying(false);
      activeSetter = null;
    });
  }, [playing, lang, topic]);

  if (!voicesReady && typeof window !== "undefined" && !window.speechSynthesis) return null;

  return (
    <span className="listen-wrap">
      <button className={playing ? "listen-btn is-playing" : "listen-btn"} onClick={toggle} aria-live="polite">
        <span className="listen-icon" aria-hidden="true">
          {playing ? "■" : "▶"}
        </span>
        {playing ? (ta ? "நிறுத்து" : "Stop") : ta ? "இதைக் கேளுங்கள்" : "Listen to this"}
      </button>
      {unavailable && (
        <em className="listen-note">
          {ta
            ? "இந்தச் சாதனத்தில் தமிழ் குரல் இல்லை. சாதன அமைப்புகளில் தமிழ் குரலைச் சேர்க்கவும்."
            : "This device has no English voice installed. Add one in your device's speech settings."}
        </em>
      )}
    </span>
  );
}
