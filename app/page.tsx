"use client";

import { useEffect, useMemo, useState } from "react";
import { Cartoon, CartoonName } from "./cartoons";
import { HeroPulse, LikeBar, MythsSection, PulseTicker, ShareKit, VotingBox, useMovementPulse } from "./engage";
import { BackToTop, MotionProvider, ScrollProgress } from "./motion";
import { SectionAudio } from "./audio";
import { Assistant } from "./assistant";
import { SocialBox } from "./social";
import { References } from "./references";
import { Faq, Glossary, SeasonTimeline } from "./sections";

type Language = "en" | "ta";
type Audience = "citizen" | "farmer" | "fpo";
type Bilingual = Record<Language, string>;

const ui = {
  en: {
    movement: "Mango belt movement",
    nav: ["Home", "Crisis", "Season", "Demands", "Paddy vs Mango", "Take action", "Evidence", "Solutions", "Myths", "FAQ", "Spread"],
    heroTag: "Krishnagiri · Dharmapuri · Bargur",
    heroTitle: "A fair system. Before another mango tree falls.",
    heroBody: "A peaceful, non-partisan movement asking one clear question: if ₹15.45 per kg was notified for Totapuri, why do growers report receiving only ₹4–5?",
    join: "Take one useful action",
    read: "Read the source PDFs",
    sourced: "Built directly from 8 supplied bilingual documents · August 2026",
    crisisTag: "01 · THE CRISIS",
    crisisTitle: "The loss begins at the ramp. It does not end there.",
    crisisBody: "Low prices move through the entire household: fruit is left unharvested, labour loses wages, debt grows, education is capped, migration rises and bearing orchards are slowly abandoned.",
    demandsTag: "03 · THE DEMANDS",
    demandsTitle: "Send each ask to the office that can actually act.",
    demandsBody: "The playbook warns against sending every request to the same place. Fast administrative fixes belong with the Collector; structural price protection belongs with the State and Union machinery.",
    compareTag: "04 · PADDY SUPPORT vs MANGO SUPPORT",
    compareTitle: "Same State. Two completely different support systems.",
    compareBody: "This is a crop-versus-crop comparison, not a region-versus-region attack. Delta paddy farmers face real hardship too. The demand is to build comparable machinery for a crop that cannot wait even one day.",
    actionsTag: "05 · TAKE ACTION",
    actionsTitle: "Turn public concern into a file number, evidence and follow-up.",
    actionsBody: "The supplied playbook prioritises verified records, named owners and dated acknowledgements. Peaceful public action becomes harder to ignore when every claim can be checked.",
    evidenceTag: "06 · EVIDENCE LIBRARY",
    evidenceTitle: "Every PDF. In full. In the section where it belongs.",
    evidenceBody: "All eight original PDFs are hosted here. Read them in the browser or download them for a meeting, village display or representation.",
    solutionsTag: "07 · HOW THIS CAN BE SOLVED",
    solutionsTitle: "Relief for this season. Machinery for every season after it.",
    solutionsBody: "The documents do not ask only for compensation. They set out a complete system: transparent procurement, a buyer of last resort, farmer-owned value addition and direct representation.",
    share: "Share the movement",
    copied: "Link copied",
    download: "Download",
    open: "Read PDF",
    footer: "Peaceful · Non-partisan · Evidence-led",
  },
  ta: {
    movement: "மாம்பழப் பகுதி இயக்கம்",
    nav: ["முகப்பு", "நெருக்கடி", "பருவம்", "கோரிக்கைகள்", "நெல் – மாம்பழம்", "செயலில் இணைய", "ஆதாரங்கள்", "தீர்வுகள்", "தவறான புரிதல்", "கேள்விகள்", "பரப்புங்கள்"],
    heroTag: "கிருஷ்ணகிரி · தருமபுரி · பர்கூர்",
    heroTitle: "இன்னொரு மாமரம் விழும் முன் நியாயமான அமைப்பு.",
    heroBody: "அமைதியான, கட்சி சார்பற்ற இயக்கம் கேட்கும் ஒரே கேள்வி: தோத்தாபுரிக்கு கிலோ ₹15.45 அறிவிக்கப்பட்டபோது, விவசாயிகள் ₹4–5 மட்டுமே கிடைப்பதாக ஏன் தெரிவிக்கிறார்கள்?",
    join: "பயனுள்ள செயலில் இணைய",
    read: "ஆதார ஆவணங்களைப் படிக்க",
    sourced: "வழங்கப்பட்ட 8 இருமொழி ஆவணங்களின் அடிப்படையில் · ஆகஸ்ட் 2026",
    crisisTag: "01 · நெருக்கடி",
    crisisTitle: "இழப்பு விற்பனை இடத்தில் தொடங்குகிறது. அங்கே முடிவதில்லை.",
    crisisBody: "குறைந்த விலை முழுக் குடும்பத்தையும் பாதிக்கிறது: பழங்கள் அறுவடை செய்யப்படாமல் விடப்படுகின்றன, தொழிலாளர்கள் ஊதியத்தை இழக்கின்றனர், கடன் உயர்கிறது, கல்வி நிற்கிறது, இடம்பெயர்வு அதிகரிக்கிறது, தோட்டங்கள் கைவிடப்படுகின்றன.",
    demandsTag: "03 · கோரிக்கைகள்",
    demandsTitle: "ஒவ்வொரு கோரிக்கையையும் செயல்படக்கூடிய அலுவலகத்திடம் கொடுங்கள்.",
    demandsBody: "அனைத்து கோரிக்கைகளையும் ஒரே இடத்திற்கு அனுப்ப வேண்டாம் என்று செயல் திட்டம் கூறுகிறது. விரைவான நிர்வாக நடவடிக்கைகள் ஆட்சியரிடம்; நிரந்தர விலை பாதுகாப்பு மாநில மற்றும் மத்திய அமைப்புகளிடம் செல்ல வேண்டும்.",
    compareTag: "04 · நெல் ஆதரவு – மாம்பழ ஆதரவு",
    compareTitle: "ஒரே மாநிலம். முற்றிலும் வேறுபட்ட இரண்டு ஆதரவு அமைப்புகள்.",
    compareBody: "இது பயிர்-பயிர் ஒப்பீடு; பகுதி-பகுதி தாக்குதல் அல்ல. டெல்டா நெல் விவசாயிகளும் சிரமங்களை சந்திக்கிறார்கள். ஒரு நாள் கூட காத்திருக்க முடியாத மாம்பழத்திற்கு ஒத்த அமைப்பு வேண்டும்.",
    actionsTag: "05 · செயலில் இணைய",
    actionsTitle: "பொது அக்கறையை கோப்பு எண், ஆதாரம், பின்தொடர்பாக மாற்றுங்கள்.",
    actionsBody: "சரிபார்க்கப்பட்ட பதிவுகள், பெயரிடப்பட்ட பொறுப்பாளர்கள் மற்றும் தேதியிட்ட ஒப்புகைகளுக்கு செயல் திட்டம் முன்னுரிமை அளிக்கிறது. ஒவ்வொரு தகவலும் சரிபார்க்கக்கூடியதாக இருந்தால் அமைதியான பொதுச் செயலை புறக்கணிக்க முடியாது.",
    evidenceTag: "06 · ஆதார நூலகம்",
    evidenceTitle: "அனைத்து ஆவணங்களும் முழுமையாக, தேவையான பிரிவில்.",
    evidenceBody: "எட்டு அசல் ஆவணங்களும் இங்கு உள்ளன. இணையத்தில் படிக்கவும் அல்லது கூட்டம், கிராமக் காட்சி, மனுவுக்காக பதிவிறக்கவும்.",
    solutionsTag: "07 · இதை எப்படித் தீர்க்கலாம்",
    solutionsTitle: "இந்த பருவத்திற்கு நிவாரணம். அடுத்த எல்லா பருவங்களுக்கும் அமைப்பு.",
    solutionsBody: "ஆவணங்கள் இழப்பீடு மட்டும் கேட்கவில்லை. வெளிப்படையான கொள்முதல், கடைசி வாய்ப்பு வாங்குபவர், விவசாயிகளின் மதிப்புக் கூட்டல் மற்றும் நேரடி பிரதிநிதித்துவம் கொண்ட முழு அமைப்பை முன்வைக்கின்றன.",
    share: "இயக்கத்தைப் பகிரவும்",
    copied: "இணைப்பு நகலெடுக்கப்பட்டது",
    download: "பதிவிறக்க",
    open: "ஆவணத்தைப் படிக்க",
    footer: "அமைதி · கட்சி சார்பற்றது · ஆதார வழி",
  },
};

const problems: { art: CartoonName; title: Bilingual; body: Bilingual }[] = [
  { art: "priceGap", title: { en: "Price collapse", ta: "விலை வீழ்ச்சி" }, body: { en: "Growers report ₹4–5/kg against a notified intervention price of ₹15.45/kg.", ta: "அறிவிக்கப்பட்ட ₹15.45/கிலோ விலைக்கு எதிராக ₹4–5 மட்டுமே கிடைப்பதாக விவசாயிகள் தெரிவிக்கின்றனர்." } },
  { art: "closedCentre", title: { en: "Invisible procurement", ta: "தெளிவில்லாத கொள்முதல்" }, body: { en: "Quantity bought, growers covered, centres opened and payment delays are not publicly established for the belt.", ta: "வாங்கிய அளவு, பயனடைந்த விவசாயிகள், திறந்த மையங்கள் மற்றும் பணத் தாமதம் தெளிவாக வெளியிடப்படவில்லை." } },
  { art: "treeLost", title: { en: "Trees and knowledge lost", ta: "மரங்களும் அறிவும் இழப்பு" }, body: { en: "Orchards built over decades are leased out or cleared. A mature tree cannot be replaced by a later announcement.", ta: "பல ஆண்டுகளாக வளர்ந்த தோட்டங்கள் குத்தகைக்கு விடப்படுகின்றன அல்லது அழிக்கப்படுகின்றன. பின்னர் வரும் அறிவிப்பு வளர்ந்த மரத்தை மீட்டெடுக்காது." } },
  { art: "householdShock", title: { en: "Households absorb the shock", ta: "குடும்பங்கள் சுமையை ஏற்கின்றன" }, body: { en: "Harvest workers lose wages; women managers remain unrecognised; debt, outside work and education limits follow.", ta: "அறுவடை தொழிலாளர்கள் ஊதியத்தை இழக்கின்றனர்; பெண்களுக்கு அங்கீகாரம் இல்லை; கடன், வெளியூர் வேலை, கல்வித் தடைகள் தொடர்கின்றன." } },
];

const demands: { number: string; owner: Bilingual; title: Bilingual; body: Bilingual; time: Bilingual }[] = [
  { number: "01", owner: { en: "District Collector", ta: "மாவட்ட ஆட்சியர்" }, title: { en: "Publish procurement every week", ta: "வாரந்தோறும் கொள்முதல் விவரம்" }, body: { en: "Quantity, growers, centres, price and payment time — in public, not inside a file.", ta: "அளவு, விவசாயிகள், மையங்கள், விலை, பணம் வழங்கிய காலம் — கோப்பில் மட்டும் அல்லாமல் பொதுவாக." }, time: { en: "2–4 weeks", ta: "2–4 வாரங்கள்" } },
  { number: "02", owner: { en: "District Collector", ta: "மாவட்ட ஆட்சியர்" }, title: { en: "Daily price boards + grievance cell", ta: "தினசரி விலை பலகை + குறைதீர் மையம்" }, body: { en: "Display prices at every market yard and pulp-unit ramp; publish one district helpline.", ta: "ஒவ்வொரு சந்தை மற்றும் தொழிற்சாலை நுழைவிலும் விலை; ஒரு மாவட்ட உதவி எண்." }, time: { en: "30 days", ta: "30 நாட்கள்" } },
  { number: "03", owner: { en: "Horticulture + procuring agency", ta: "தோட்டக்கலை + கொள்முதல் நிறுவனம்" }, title: { en: "A centre in every mango block", ta: "ஒவ்வொரு மாம்பழ வட்டாரத்திலும் மையம்" }, body: { en: "Choose locations by February, announce eligibility and open before the May harvest.", ta: "பிப்ரவரிக்குள் இடங்களைத் தேர்ந்து, தகுதியை அறிவித்து, மே அறுவடைக்கு முன் திறக்க வேண்டும்." }, time: { en: "Before harvest", ta: "அறுவடைக்கு முன்" } },
  { number: "04", owner: { en: "Agricultural Economics + TNAU", ta: "வேளாண் பொருளியல் + தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம்" }, title: { en: "Measure the real cost", ta: "உண்மையான செலவை கணக்கிடுக" }, body: { en: "Commission a district Totapuri cost-of-cultivation study so price arguments have a common reference.", ta: "விலை விவாதத்திற்கு பொதுவான அடிப்படை கிடைக்க மாவட்ட தோத்தாபுரி சாகுபடி செலவு ஆய்வு நடத்த வேண்டும்." }, time: { en: "6–9 months", ta: "6–9 மாதங்கள்" } },
  { number: "05", owner: { en: "State + Union MIS", ta: "மாநிலம் + மத்திய சந்தைத் தலையீட்டுத் திட்டம்" }, title: { en: "Announce price before flowering", ta: "பூக்கும் முன் விலை அறிவிக்க" }, body: { en: "Submit the proposal early enough for a December price — before growers commit the season's cost.", ta: "விவசாயிகள் செலவு செய்யும் முன் டிசம்பரில் விலை வரும்படி முன்கூட்டியே திட்டம் சமர்ப்பிக்க வேண்டும்." }, time: { en: "Every December", ta: "ஒவ்வொரு டிசம்பர்" } },
  { number: "06", owner: { en: "State Cabinet + grower federation", ta: "அமைச்சரவை + விவசாயிகள் கூட்டமைப்பு" }, title: { en: "Permanent buyer + farmer equity", ta: "நிரந்தர வாங்குபவர் + விவசாயிகள் பங்கு" }, body: { en: "A buyer of last resort and meaningful grower ownership in every state-supported processing park.", ta: "கடைசி வாய்ப்பு வாங்குபவர் மற்றும் அரசு ஆதரவு பதப்படுத்தும் பூங்காக்களில் விவசாயிகளுக்கு உரிமைப் பங்கு." }, time: { en: "Structural", ta: "நிரந்தர அமைப்பு" } },
];

const comparison: { label: Bilingual; paddy: Bilingual; mango: Bilingual }[] = [
  { label: { en: "Price framework", ta: "விலை அமைப்பு" }, paddy: { en: "Standing annual MSP framework", ta: "ஆண்டுதோறும் நிலையான குறைந்தபட்ச ஆதரவு விலை அமைப்பு" }, mango: { en: "No MSP; season-by-season MIS approval", ta: "குறைந்தபட்ச ஆதரவு விலை இல்லை; ஒவ்வொரு பருவத்திற்கும் சந்தைத் தலையீட்டுத் திட்ட ஒப்புதல் தேவை" } },
  { label: { en: "When price is known", ta: "விலை தெரியும் நேரம்" }, paddy: { en: "Before sowing", ta: "விதைப்பதற்கு முன்" }, mango: { en: "2026 intervention price came after the belt's harvest had begun", ta: "2026 தலையீட்டு விலை அறுவடை தொடங்கிய பிறகு வந்தது" } },
  { label: { en: "Permanent buyer", ta: "நிரந்தர வாங்குபவர்" }, paddy: { en: "TNCSC — a permanent State corporation", ta: "தமிழ்நாடு நுகர்பொருள் வாணிபக் கழகம் — நிரந்தர மாநில நிறுவனம்" }, mango: { en: "No equivalent public buyer in the belt", ta: "மாம்பழப் பகுதியில் ஒத்த அரசு வாங்குபவர் இல்லை" } },
  { label: { en: "Purchase centres", ta: "கொள்முதல் மையங்கள்" }, paddy: { en: "Direct Purchase Centres opened each season", ta: "ஒவ்வொரு பருவமும் நேரடி கொள்முதல் மையங்கள்" }, mango: { en: "2026 centre count and locations not publicly reported", ta: "2026 மைய எண்ணிக்கை மற்றும் இடங்கள் வெளிப்படையாக இல்லை" } },
  { label: { en: "Scale published", ta: "வெளியிடப்பட்ட அளவு" }, paddy: { en: "42 lakh MT procurement target cited", ta: "42 லட்சம் மெட்ரிக் டன் கொள்முதல் இலக்கு" }, mango: { en: "96,879 MT approved State-wide; delivery in this belt not established", ta: "மாநிலம் முழுவதும் 96,879 மெட்ரிக் டன் ஒப்புதல்; இப்பகுதி கொள்முதல் தெரியவில்லை" } },
  { label: { en: "Crop package", ta: "பயிர் தொகுப்பு" }, paddy: { en: "₹134.83 crore Kuruvai package, including non-delta growers", ta: "டெல்டா அல்லாதவர்களுக்கும் ₹134.83 கோடி குறுவை தொகுப்பு" }, mango: { en: "No equivalent crop-specific cultivation package", ta: "ஒத்த பயிர் சார்ந்த தொகுப்பு இல்லை" } },
  { label: { en: "Guaranteed demand", ta: "உத்தரவாத தேவை" }, paddy: { en: "Central Pool and Public Distribution System", ta: "மத்திய தொகுப்பு மற்றும் பொது விநியோக அமைப்பு" }, mango: { en: "No policy-backed demand when processors do not buy", ta: "தொழிற்சாலைகள் வாங்காதபோது கொள்கை ஆதரவு தேவை இல்லை" } },
];

const actionPlans: Record<Audience, { label: Bilingual; steps: Bilingual[] }> = {
  citizen: { label: { en: "Citizen / student", ta: "பொதுமக்கள் / மாணவர்" }, steps: [
    { en: "Read the two-page Assembly appeal before sharing a claim.", ta: "ஒரு தகவலைப் பகிரும் முன் இரண்டு பக்க பேரவை கோரிக்கையைப் படிக்கவும்." },
    { en: "Share one verified number and the PDF it came from.", ta: "ஒரு சரிபார்க்கப்பட்ட எண்ணையும் அது இடம்பெற்ற ஆவணத்தையும் பகிரவும்." },
    { en: "Ask your MLA to place the eight factual questions on record.", ta: "எட்டு உண்மைக் கேள்விகளையும் பேரவையில் பதிவு செய்ய உங்கள் சட்டமன்ற உறுப்பினரிடம் கேட்கவும்." },
  ] },
  farmer: { label: { en: "Farmer / worker", ta: "விவசாயி / தொழிலாளர்" }, steps: [
    { en: "Preserve weighment slips, sale receipts, quantity and payment dates.", ta: "எடை சீட்டு, ரசீது, அளவு, பணம் கிடைத்த தேதியை வைத்திருக்கவும்." },
    { en: "Check farmer-registry details before procurement opens.", ta: "கொள்முதல் தொடங்கும் முன் விவசாயி பதிவு விவரங்களைச் சரிபார்க்கவும்." },
    { en: "Give consented testimony through a trusted association or FPO.", ta: "நம்பகமான சங்கம் அல்லது விவசாயிகள் உற்பத்தியாளர் அமைப்பு மூலம் ஒப்புதலுடன் அனுபவத்தைப் பதிவு செய்யவும்." },
  ] },
  fpo: { label: { en: "FPO / association", ta: "உற்பத்தியாளர் அமைப்பு / விவசாயிகள் சங்கம்" }, steps: [
    { en: "Name one owner for every task and keep a correspondence register.", ta: "ஒவ்வொரு பணிக்கும் பொறுப்பாளரை நியமித்து கடிதப் பதிவேடு வைத்திருக்கவும்." },
    { en: "Obtain a dated acknowledgement number for every representation.", ta: "ஒவ்வொரு மனுவிற்கும் தேதியிட்ட ஒப்புகை எண்ணைப் பெறவும்." },
    { en: "Follow up every fortnight and publish every reply to members.", ta: "இரு வாரத்திற்கு ஒருமுறை பின்தொடர்ந்து எல்லா பதில்களையும் வெளியிடவும்." },
  ] },
};

const totalPages = () => documents.reduce((sum, doc) => sum + doc.pages, 0);

const documents: { id: string; title: Bilingual; pages: number; section: Bilingual; summary: Bilingual; href: string; thumb: string }[] = [
  { id: "appeal", title: { en: "Appeal to Raise in Assembly", ta: "சட்டமன்றத்தில் எழுப்ப வேண்டிய கோரிக்கை" }, pages: 2, section: { en: "Home + Demands", ta: "முகப்பு + கோரிக்கைகள்" }, summary: { en: "The public appeal and eight factual questions for representatives.", ta: "பொது கோரிக்கை மற்றும் பிரதிநிதிகளுக்கான எட்டு உண்மைக் கேள்விகள்." }, href: "/documents/Appeal_to_Raise_in_Assembly.pdf", thumb: "/assets/docs/Appeal_to_Raise_in_Assembly.webp" },
  { id: "playbook", title: { en: "Mango Action Playbook", ta: "மாம்பழ செயல் வழிகாட்டி" }, pages: 8, section: { en: "Take action", ta: "செயலில் இணைய" }, summary: { en: "Verification log, accountable offices, first 90 days and follow-up system.", ta: "சரிபார்ப்புப் பதிவு, பொறுப்பு அலுவலகங்கள், முதல் 90 நாட்கள் மற்றும் பின்தொடர்பு அமைப்பு." }, href: "/documents/Mango_Action_Playbook.pdf", thumb: "/assets/docs/Mango_Action_Playbook.webp" },
  { id: "consultation", title: { en: "Request for Direct Consultation", ta: "நேரடி கலந்தாலோசனைக்கான கோரிக்கை" }, pages: 6, section: { en: "Demands", ta: "கோரிக்கைகள்" }, summary: { en: "A working-meeting request, field-visit plan, delegation design and ten questions.", ta: "நேரடி கூட்டம், களப் பயணம், பிரதிநிதிக் குழு மற்றும் பத்து கேள்விகள்." }, href: "/documents/Request_for_Direct_Consultation_Mango_Farmers.pdf", thumb: "/assets/docs/Request_for_Direct_Consultation_Mango_Farmers.webp" },
  { id: "compare", title: { en: "Paddy vs Mango Comparison", ta: "நெல் – மாம்பழ ஆதரவு ஒப்பீடு" }, pages: 2, section: { en: "Paddy vs Mango", ta: "நெல் – மாம்பழம்" }, summary: { en: "A non-partisan comparison of price, procurement, packages and guaranteed demand.", ta: "விலை, கொள்முதல், தொகுப்பு மற்றும் உறுதியான தேவையின் கட்சி சார்பற்ற ஒப்பீடு." }, href: "/documents/Paddy_vs_Mango_Comparison_Poster.pdf", thumb: "/assets/docs/Paddy_vs_Mango_Comparison_Poster.webp" },
  { id: "inputs", title: { en: "Agri-Input Dealers and the Mango Farmer", ta: "இடுபொருள் வியாபாரிகளும் மாம்பழ விவசாயியும்" }, pages: 11, section: { en: "Crisis + Solutions", ta: "நெருக்கடி + தீர்வுகள்" }, summary: { en: "How input costs get inflated and wrong advice damages orchards — with the legal remedies and a plan to cut input spend by 20-40%.", ta: "இடுபொருள் செலவு எப்படி உயர்கிறது, தவறான ஆலோசனை தோட்டங்களை எப்படிப் பாதிக்கிறது — சட்ட வழிகளும், செலவை 20–40% குறைக்கும் திட்டமும்." }, href: "/documents/Agri_Input_Dealers_and_the_Mango_Farmer.pdf", thumb: "/assets/docs/Agri_Input_Dealers_and_the_Mango_Farmer.webp" },
  { id: "household", title: { en: "Mango Household Chapter Posters", ta: "மாம்பழ விவசாயக் குடும்ப அத்தியாயச் சுவரொட்டிகள்" }, pages: 12, section: { en: "Crisis", ta: "நெருக்கடி" }, summary: { en: "Twelve household-level chapters on income, debt, education, migration and women.", ta: "வருமானம், கடன், கல்வி, இடம்பெயர்வு, பெண்கள் பற்றிய 12 குடும்ப அத்தியாயங்கள்." }, href: "/documents/Mango_Household_Chapter_Posters.pdf", thumb: "/assets/docs/Mango_Household_Chapter_Posters.webp" },
  { id: "value", title: { en: "Mango Value Addition Posters", ta: "மாம்பழ மதிப்புக் கூட்டல் சுவரொட்டிகள்" }, pages: 6, section: { en: "Solutions", ta: "தீர்வுகள்" }, summary: { en: "Products, infrastructure, local jobs and grower ownership beyond pulp alone.", ta: "கூழைத் தாண்டிய பொருட்கள், கட்டமைப்பு, உள்ளூர் வேலை, விவசாயிகள் உரிமை." }, href: "/documents/Mango_Value_Addition_Posters.pdf", thumb: "/assets/docs/Mango_Value_Addition_Posters.webp" },
  { id: "cartoon", title: { en: "Mango Tree Cartoon Poster", ta: "மாமரம் விளக்கப்படச் சுவரொட்டி" }, pages: 2, section: { en: "Home + Crisis", ta: "முகப்பு + நெருக்கடி" }, summary: { en: "A simple visual explanation of how a full tree can still leave a family without income.", ta: "மரம் நிறைய பழம் இருந்தும் குடும்பத்திற்கு வருமானம் இல்லாததை விளக்கும் சுவரொட்டி." }, href: "/documents/Mango_Tree_Cartoon_Poster.pdf", thumb: "/assets/docs/Mango_Tree_Cartoon_Poster.webp" },
];

/** Look a document up by name, so reordering the list never breaks a link. */
const doc = (id: string) => documents.find((entry) => entry.id === id)!;

const solutions: { step: string; art: CartoonName; horizon: Bilingual; title: Bilingual; body: Bilingual }[] = [
  { step: "01", art: "priceBoard", horizon: { en: "NOW · DISTRICT", ta: "இப்போது · மாவட்டம்" }, title: { en: "Make the market visible", ta: "சந்தையை வெளிப்படையாக்குக" }, body: { en: "Weekly procurement data, daily price boards and one working grievance line.", ta: "வாராந்திர கொள்முதல் தரவு, தினசரி விலை பலகைகள் மற்றும் செயல்படும் குறைதீர் எண்." } },
  { step: "02", art: "buyerAtTheGate", horizon: { en: "BEFORE HARVEST", ta: "அறுவடைக்கு முன்" }, title: { en: "Put a buyer within reach", ta: "அருகில் வாங்குபவரை உருவாக்குக" }, body: { en: "Centres in every mango block, locations announced early and payment timelines in writing.", ta: "ஒவ்வொரு மாம்பழ வட்டாரத்திலும் மையம், முன்கூட்டியே இட அறிவிப்பு, எழுத்துப்பூர்வ பணக் காலம்." } },
  { step: "03", art: "priceBeforeFlowering", horizon: { en: "BEFORE FLOWERING", ta: "பூக்கும் முன்" }, title: { en: "Price the season before risk begins", ta: "ஆபத்து தொடங்கும் முன் விலை" }, body: { en: "A real cost survey and a December intervention price, not a rescue after harvest.", ta: "உண்மையான செலவு ஆய்வு மற்றும் டிசம்பர் தலையீட்டு விலை; அறுவடைக்கு பின் மீட்பு அல்ல." } },
  { step: "04", art: "standTogether", horizon: { en: "STRUCTURAL", ta: "நிரந்தர அமைப்பு" }, title: { en: "Give growers bargaining power", ta: "விவசாயிகளுக்கு பேரம் பேசும் சக்தி" }, body: { en: "FPO working capital, advance payment capacity and meaningful equity in processing parks.", ta: "விவசாயிகள் உற்பத்தியாளர் அமைப்புகளுக்குச் செயல்பாட்டு மூலதனம், முன்பணம் செலுத்தும் திறன், பதப்படுத்தும் பூங்காவில் உரிமைப் பங்கு." } },
  { step: "05", art: "valueChain", horizon: { en: "LOCAL ECONOMY", ta: "உள்ளூர் பொருளாதாரம்" }, title: { en: "Build the whole value chain", ta: "முழு மதிப்புச் சங்கிலி" }, body: { en: "Collection, cold chain, testing, traceability and products from juice to dried fruit and kernel oil.", ta: "சேகரிப்பு, குளிர்ச் சங்கிலி, சோதனை, கண்காணிப்பு, சாறு முதல் உலர் பழம் மற்றும் கொட்டை எண்ணெய் வரை." } },
  { step: "06", art: "directConsultation", horizon: { en: "REPRESENTATION", ta: "பிரதிநிதித்துவம்" }, title: { en: "Keep lived experience in the room", ta: "உண்மையான அனுபவத்தை கூட்டத்தில் வைத்திருங்கள்" }, body: { en: "Annual direct consultation including women managers, harvest labour, young growers, FPOs and processors.", ta: "பெண் நிர்வாகிகள், அறுவடைத் தொழிலாளர்கள், இளம் விவசாயிகள், உற்பத்தியாளர் அமைப்புகள் மற்றும் பதப்படுத்துநர்களுடன் ஆண்டு நேரடி ஆலோசனை." } },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function DownloadIcon() {
  return (
    <svg className="dl-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none"
         stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v11" /><path d="M7.5 10.5 12 15l4.5-4.5" /><path d="M4.5 19.5h15" />
    </svg>
  );
}

function PdfLinks({ doc, lang, compact = false }: { doc: (typeof documents)[number]; lang: Language; compact?: boolean }) {
  const t = ui[lang];
  return (
    <article className={`context-doc ${compact ? "compact-doc" : ""}`}>
      <img src={doc.thumb} alt={lang === "ta" ? `${doc.title.ta} ஆவணத்தின் முதல் பக்கம்` : `First page of ${doc.title.en}`} />
      <div><span className="pdf-label">{lang === "ta" ? "மின்னணு ஆவணம்" : "PDF"} · {doc.pages} {lang === "ta" ? "பக்கங்கள்" : "pages"}</span><h3>{doc.title[lang]}</h3><p>{doc.summary[lang]}</p><div className="pdf-actions"><a className="doc-btn doc-btn-read" href={doc.href} target="_blank" rel="noreferrer">{t.open} <Arrow /></a><a className="doc-btn doc-btn-save" href={doc.href} download><DownloadIcon />{t.download}</a></div></div>
    </article>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Language>("ta");
  const [audience, setAudience] = useState<Audience>("citizen");
  const [menuOpen, setMenuOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const pulse = useMovementPulse();
  const t = ui[lang];
  const plan = useMemo(() => actionPlans[audience], [audience]);

  useEffect(() => {
    document.documentElement.lang = lang === "ta" ? "ta" : "en";
    document.title = lang === "ta" ? "விவசாயிகளின் குரல் | மாம்பழப் பகுதி மக்கள் இயக்கம்" : "Farmers' Voice | Mango Belt Citizens' Movement";
  }, [lang]);

  async function shareMovement() {
    const data = { title: lang === "ta" ? "விவசாயிகளின் குரல்" : "Farmers' Voice", text: lang === "ta" ? "மாம்பழ விவசாயிகளின் நியாயமான அமைப்புக்கான அமைதியான இயக்கம்." : "A peaceful movement for a fair system for mango farmers.", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data); else await navigator.clipboard.writeText(window.location.href);
      setShared(true); window.setTimeout(() => setShared(false), 2200);
    } catch { /* share cancelled */ }
  }

  function closeMenu() { setMenuOpen(false); }

  const homeDocs = [doc("appeal"), doc("cartoon")];
  const crisisDocs = [doc("household"), doc("cartoon")];
  const demandDocs = [doc("appeal"), doc("consultation")];

  return (
    <main>
      <MotionProvider />
      <PulseTicker lang={lang} likes={pulse.likes} votes={pulse.totalVotes} />
      <ScrollProgress />

      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label={lang === "ta" ? "விவசாயிகளின் குரல் முகப்பு" : "Farmers' Voice home"}>
          <img src="/assets/farmers-voice-logo.png" alt={lang === "ta" ? "விவசாயிகளின் குரல் இயக்கப் படம்" : "Farmers' Voice campaign image"} />
          <span><strong>{lang === "ta" ? "விவசாயிகளின் குரல்" : "Farmers' Voice"}</strong><small>{t.movement}</small></span>
        </a>
        <nav className={menuOpen ? "open" : ""} aria-label={lang === "ta" ? "முதன்மை வழிசெலுத்தல்" : "Main navigation"}>
          {["home", "crisis", "season", "demands", "compare", "act", "evidence", "solutions", "myths", "faq", "spread"].map((id, index) => <a key={id} href={`#${id}`} onClick={closeMenu}>{t.nav[index]}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language" onClick={() => setLang(lang === "en" ? "ta" : "en")} aria-label={lang === "en" ? "தமிழுக்கு மாற்றுக" : "ஆங்கிலத்திற்கு மாற்றுக"}>{lang === "en" ? "தமிழ்" : "ஆங்கிலம்"}</button>
          <button className="share-small" onClick={shareMovement}>{shared ? t.copied : t.share} <Arrow /></button>
          <button className="menu-button" aria-label={lang === "ta" ? "பட்டியலைத் திறக்க" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span></button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker"><span></span>{t.heroTag}</p>
            <h1>{t.heroTitle}</h1>
            <p className="hero-body">{t.heroBody}</p>
            <div className="hero-actions"><a className="button button-primary" href="#act">{t.join} <Arrow /></a><a className="button button-outline" href="#evidence">{t.read}</a></div>
            <p className="hero-tagline"><span aria-hidden="true">✦</span>{lang === "ta" ? "நாங்கள் உங்களுக்காக நிற்கிறோம்" : "We stand for you"}</p>
            <SectionAudio topic="home" lang={lang} />
            <p className="source-note">● {t.sourced}</p>
          </div>
          <div className="hero-side">
            <div className="hero-emblem">
            <span className="hero-ring ring-one"></span><span className="hero-ring ring-two"></span>
            <button
              className="hero-zoom"
              onClick={() => setZoomed(true)}
              aria-label={lang === "ta" ? "படத்தைப் பெரிதாக்கிப் பார்க்க" : "Open the image full screen"}
            >
              <picture>
                {/* The source photograph is natively 1024px wide, so the hero
                    serves that and lets the browser downsample into a ~520px
                    slot — roughly 2x, which is where it looks sharpest. The
                    upscaled 2x file is kept for the full-screen view only,
                    rather than making every visitor download it. */}
                <source srcSet="/assets/price-update-live.webp" type="image/webp" />
                <img
                  className="hero-logo"
                  src="/assets/price-update-live.jpg"
                  width={1024}
                  height={717}
                  alt={lang === "ta" ? "மாம்பழ விலை நேரடி புதுப்பிப்பு காட்டும் படம்" : "Real-time mango price update image"}
                />
              </picture>
              <span className="hero-zoom-hint" aria-hidden="true">⤢</span>
            </button>
            <div className="hero-seal"><strong>15.45</strong><span>{lang === "ta" ? "அறிவிக்கப்பட்ட ₹/கிலோ" : "notified ₹/kg"}</span></div>
            <div className="hero-seal seal-low"><strong>4–5</strong><span>{lang === "ta" ? "கூறப்படும் ₹/கிலோ" : "reported ₹/kg"}</span></div>
            </div>
            <SocialBox lang={lang} />
            <HeroPulse lang={lang} likes={pulse.likes} liked={pulse.liked} votes={pulse.totalVotes} voteCounts={pulse.votes} myVote={pulse.myVote} onLike={pulse.toggleLike} />
          </div>
        </div>
        <div className="hero-ledger">
          <div><span>01</span><strong>2,81,733</strong><small>{lang === "ta" ? "கிருஷ்ணகிரி விவசாயிகள்" : "Krishnagiri farmers"}</small></div>
          <div><span>02</span><strong>2,13,023</strong><small>{lang === "ta" ? "சிறு / குறு விவசாயிகள்" : "marginal farmers"}</small></div>
          <div><span>03</span><strong>{lang === "ta" ? "51,000 ஹெக்டேர்" : "51,000 ha"}</strong><small>{lang === "ta" ? "இரு மாவட்ட மாம்பழ பரப்பு" : "mango area in two districts"}</small></div>
          <div className="ledger-alert"><span>04</span><strong>{lang === "ta" ? "3 மடங்கு இடைவெளி" : "3× gap"}</strong><small>{lang === "ta" ? "அறிவிக்கப்பட்ட விலை – கூறப்படும் விலை" : "notified vs reported price"}</small></div>
        </div>
        <div className="home-docs">{homeDocs.map((doc) => <PdfLinks key={doc.title.en} doc={doc} lang={lang} compact />)}</div>
      </section>

      <section className="support-section">
        <div className="section support-inner">
          <LikeBar lang={lang} likes={pulse.likes} liked={pulse.liked} votes={pulse.totalVotes} onLike={pulse.toggleLike} />
        </div>
      </section>

      <div className="movement-ribbon" aria-hidden="true">{(lang === "ta" ? ["நியாயமான விலை", "வெளிப்படையான தரவு", "விவசாயிகளின் குரல்", "உள்ளூர் மதிப்புக் கூட்டல்", "அமைதியான செயல்"] : ["FAIR PRICE", "OPEN DATA", "FARMER VOICE", "LOCAL VALUE", "PEACEFUL ACTION"]).map((item) => <span key={item}>{item}<i>✦</i></span>)}</div>

      <section className="section crisis" id="crisis">
        <div className="section-heading split"><div><p className="eyebrow">{t.crisisTag}</p><SectionAudio topic="crisis" lang={lang} /><h2>{t.crisisTitle}</h2></div><p>{t.crisisBody}</p></div>
        <div className="impact-chain" aria-label={lang === "ta" ? "குடும்பப் பாதிப்பு தொடர்" : "Household impact chain"}>
          {[{ en: "Price falls", ta: "விலை வீழ்ச்சி" }, { en: "Fruit stays", ta: "பழம் அறுவடை இல்லை" }, { en: "Wages vanish", ta: "ஊதியம் இழப்பு" }, { en: "Debt grows", ta: "கடன் உயர்வு" }, { en: "Families migrate", ta: "இடம்பெயர்வு" }, { en: "Trees are lost", ta: "மரங்கள் இழப்பு" }].map((item, index) => <div key={item.en}><span>0{index + 1}</span><strong>{item[lang]}</strong>{index < 5 && <i>→</i>}</div>)}
        </div>
        <div className="problem-grid">{problems.map((problem) => <article key={problem.title.en}><Cartoon name={problem.art} className="problem-art" /><h3>{problem.title[lang]}</h3><p>{problem.body[lang]}</p></article>)}</div>
        <div className="poster-story"><div className="poster-frame"><img src="/assets/source-poster.png" alt={lang === "ta" ? "உதவி வராத நிலையில் மாமரம் வெட்டப்படுவதைக் காட்டும் இயக்கப் படம்" : "Campaign artwork showing a mango tree being cut while help has not arrived"} /><span>{lang === "ta" ? "நீங்கள் வழங்கிய இயக்கப் படம்" : "Your supplied campaign artwork"}</span></div><blockquote><span>“</span>{lang === "ta" ? "ஒரு மாமரம் காய்க்கத் தொடங்க பல ஆண்டுகள் ஆகும். இப்போது இழந்தது ஐந்து ஆண்டுகள் கழித்து வரும் விலை அறிவிப்பால் திரும்பாது." : "A mango tree takes years to bear. What is lost now is not recovered by a price announcement five years later."}<cite>{lang === "ta" ? "சட்டமன்றத்தில் எழுப்ப வேண்டிய கோரிக்கை" : "Appeal to Raise in Assembly"}</cite></blockquote></div>
        <div className="context-doc-grid">{crisisDocs.map((doc) => <PdfLinks key={doc.title.en} doc={doc} lang={lang} />)}</div>
      </section>

      <SeasonTimeline lang={lang} />

      <section className="demands-section" id="demands">
        <div className="section section-in-dark">
          <div className="section-heading split"><div><p className="eyebrow light">{t.demandsTag}</p><SectionAudio topic="demands" lang={lang} /><h2>{t.demandsTitle}</h2></div><p>{t.demandsBody}</p></div>
          <div className="demand-grid">{demands.map((demand) => <article key={demand.number}><div className="demand-top"><span>{demand.number}</span><small>{demand.time[lang]}</small></div><p className="owner">{demand.owner[lang]}</p><h3>{demand.title[lang]}</h3><p>{demand.body[lang]}</p></article>)}</div>
          <div className="context-doc-grid dark-docs">{demandDocs.map((doc) => <PdfLinks key={doc.title.en} doc={doc} lang={lang} />)}</div>
        </div>
      </section>

      <section className="section compare-section" id="compare">
        <div className="section-heading split"><div><p className="eyebrow">{t.compareTag}</p><SectionAudio topic="compare" lang={lang} /><h2>{t.compareTitle}</h2></div><p>{t.compareBody}</p></div>
        <div className="compare-cartoons">
          <figure><Cartoon name="paddyMangoCover" /><figcaption><strong>{lang === "ta" ? "ஒரு பயிருக்கு மட்டும் மேற்கூரை" : "One crop has cover"}</strong><span>{lang === "ta" ? "நெல்லுக்கு விதைப்பதற்கு முன்பே விலை தெரியும். மாம்பழத்திற்கு ஒவ்வொரு பருவமும் தனி ஒப்புதல் தேவை." : "Paddy knows its price before sowing. Mango waits for a fresh approval every single season."}</span></figcaption></figure>
          <figure><Cartoon name="cannotWait" /><figcaption><strong>{lang === "ta" ? "மற்றொன்றுக்கு நேரமே இல்லை" : "The other has no time"}</strong><span>{lang === "ta" ? "நெல்லை மாதங்கள் சேமிக்கலாம். அறுவடையான தோத்தாபுரி சில நாட்களில் கெட்டுவிடும்." : "Paddy can be stored for months. Once picked, Totapuri is spoiling within days."}</span></figcaption></figure>
        </div>
        <div className="comparison-wrap">
          <div className="comparison-head"><span>{lang === "ta" ? "ஆதரவு அமைப்பு" : "SUPPORT MECHANISM"}</span><strong className="paddy-head">{lang === "ta" ? "நெல்" : "PADDY"}</strong><strong className="mango-head">{lang === "ta" ? "மாம்பழம்" : "MANGO"}</strong></div>
          {comparison.map((row) => <div className="comparison-row" key={row.label.en}><strong>{row.label[lang]}</strong><p className="paddy-cell"><span>✓</span>{row.paddy[lang]}</p><p className="mango-cell"><span>!</span>{row.mango[lang]}</p></div>)}
        </div>
        <div className="compare-note"><strong>{lang === "ta" ? "முக்கிய விளக்கம்" : "THE IMPORTANT DISTINCTION"}</strong><p>{lang === "ta" ? "நெல்லிலிருந்து எதையும் எடுத்துக்கொள்ள வேண்டும் என்பது கோரிக்கை அல்ல. நெல் விவசாயிக்கு ஏற்கனவே உள்ள விலை, வாங்குபவர், மையம், உறுதியான தேவை போன்ற அமைப்பை மாம்பழத்திற்கும் உருவாக்க வேண்டும் என்பதே கோரிக்கை." : "The demand is not to take anything from paddy. It is to build for mango the same kinds of machinery paddy already has: an early price, a permanent buyer, reachable centres and policy-backed demand."}</p></div>
        <PdfLinks doc={doc("compare")} lang={lang} />
      </section>

      <section className="action-section" id="act">
        <div className="section">
          <div className="section-heading split"><div><p className="eyebrow">{t.actionsTag}</p><SectionAudio topic="act" lang={lang} /><h2>{t.actionsTitle}</h2></div><p>{t.actionsBody}</p></div>
          <div className="ninety-days"><div className="timeline-title"><span>90</span><div><strong>{lang === "ta" ? "முதல் நாட்கள்" : "FIRST DAYS"}</strong><small>{lang === "ta" ? "ஆவணம் → ஒப்புகை → பின்தொடர்பு" : "DOCUMENT → ACKNOWLEDGE → FOLLOW UP"}</small></div></div><div className="timeline-steps">{[
            { time: { en: "WEEK 1", ta: "வாரம் 1" }, en: "Form a 7-person core group and correspondence register.", ta: "7 பேர் குழு மற்றும் கடிதப் பதிவேடு அமைக்கவும்." },
            { time: { en: "WEEK 2–3", ta: "வாரம் 2–3" }, en: "Submit the consultation request; obtain stamped acknowledgements.", ta: "ஆலோசனை கோரிக்கையை அளித்து முத்திரையிட்ட ஒப்புகை பெறவும்." },
            { time: { en: "WEEK 4", ta: "வாரம் 4" }, en: "Start a 300-household survey with trained local volunteers.", ta: "உள்ளூர் தன்னார்வலர்களுடன் 300 குடும்ப ஆய்வைத் தொடங்கவும்." },
            { time: { en: "WEEK 6–8", ta: "வாரம் 6–8" }, en: "Brief every MLA and the district press with verified evidence.", ta: "அனைத்து சட்டமன்ற உறுப்பினர்களுக்கும் மாவட்ட ஊடகங்களுக்கும் சரிபார்க்கப்பட்ட ஆதாரம் அளிக்கவும்." },
            { time: { en: "WEEK 12", ta: "வாரம் 12" }, en: "Publish findings and file written reminders against every acknowledgement.", ta: "முடிவுகளை வெளியிட்டு ஒவ்வொரு ஒப்புகைக்கும் எழுத்து நினைவூட்டல் அனுப்பவும்." },
          ].map((step) => <article key={step.time.en}><span>{step.time[lang]}</span><p>{step[lang]}</p></article>)}</div></div>

          <div className="audience-tabs" role="tablist" aria-label={lang === "ta" ? "செயல் பங்கைத் தேர்ந்தெடுக்கவும்" : "Choose an action role"}>{(Object.keys(actionPlans) as Audience[]).map((key) => <button role="tab" aria-selected={audience === key} className={audience === key ? "active" : ""} onClick={() => setAudience(key)} key={key}>{actionPlans[key].label[lang]}</button>)}</div>
          <div className="role-panel" role="tabpanel"><div className="role-steps">{plan.steps.map((step, index) => <article key={step.en}><span>0{index + 1}</span><p>{step[lang]}</p></article>)}</div><div className="role-share"><img src="/assets/farmers-voice-logo.png" alt={lang === "ta" ? "விவசாயிகளின் குரல் இயக்கப் படம்" : "Farmers' Voice campaign image"} /><h3>{lang === "ta" ? "ஒரு உண்மை. ஒரு ஆதாரம். இன்னொரு குரல்." : "One fact. One source. One more voice."}</h3><button className="button button-primary" onClick={shareMovement}>{shared ? t.copied : t.share} <Arrow /></button></div></div>
          <PdfLinks doc={doc("playbook")} lang={lang} />

          <VotingBox lang={lang} votes={pulse.votes} myVote={pulse.myVote} total={pulse.totalVotes} onVote={pulse.castVote} />


        </div>
      </section>

      <section className="evidence-section" id="evidence">
        <div className="section">
          <div className="evidence-heading"><div><p className="eyebrow light">{t.evidenceTag}</p><SectionAudio topic="evidence" lang={lang} /><h2>{t.evidenceTitle}</h2><p>{t.evidenceBody}</p></div><div className="evidence-counts"><div><strong>{documents.length}</strong><span>{lang === "ta" ? "அசல் ஆவணங்கள்" : "original PDFs"}</span></div><div><strong>{totalPages()}</strong><span>{lang === "ta" ? "மொத்த பக்கங்கள்" : "total pages"}</span></div><div><strong>2</strong><span>{lang === "ta" ? "மொழிகள்" : "languages"}</span></div></div></div>
          <div className="library-grid">{documents.map((doc, index) => <article className="library-card" key={doc.title.en}><div className="library-cover"><img src={doc.thumb} alt={lang === "ta" ? `${doc.title.ta} ஆவணத்தின் முன்னோட்டம்` : `Preview of ${doc.title.en}`} /><span>0{index + 1}</span></div><div className="library-copy"><p className="library-section">{doc.section[lang]}</p><h3>{doc.title[lang]}</h3><p>{doc.summary[lang]}</p><div className="library-foot"><span>{lang === "ta" ? "மின்னணு ஆவணம்" : "PDF"} · {doc.pages} {lang === "ta" ? "பக்கங்கள்" : "pages"}</span><div className="doc-actions"><a className="doc-btn doc-btn-read" href={doc.href} target="_blank" rel="noreferrer" aria-label={lang === "ta" ? `${doc.title.ta} ஆவணத்தைப் படிக்க` : `Read ${doc.title.en}`}>{t.open} <Arrow /></a><a className="doc-btn doc-btn-save" href={doc.href} download aria-label={lang === "ta" ? `${doc.title.ta} ஆவணத்தைப் பதிவிறக்க` : `Download ${doc.title.en}`}><DownloadIcon />{t.download}</a></div></div></div></article>)}</div>
          <p className="fact-check-note"><span>i</span>{lang === "ta" ? "பொதுவெளியில் வெளியிடும் முன் பருவ விலை, தற்போதைய அதிகாரிகள் மற்றும் அறிவிக்கப்பட்ட திட்டங்களை புதிய அரசு பதிவுகளுடன் மீண்டும் சரிபார்க்கவும். ஆவணங்களில் ₹4–5 என்பது விவசாயிகள் தெரிவித்த விலை; அதிகாரப்பூர்வ தொடர் அல்ல." : "Before a public launch, re-check seasonal prices, current officeholders and announced proposals against fresh official records. In the documents, ₹4–5 is a grower-reported price, not an official series."}</p>

          <References lang={lang} />
        </div>
      </section>

      <section className="solutions-section" id="solutions">
        <div className="solution-hero section"><div><p className="eyebrow light">{t.solutionsTag}</p><SectionAudio topic="solutions" lang={lang} /><h2>{t.solutionsTitle}</h2><p>{t.solutionsBody}</p></div><img src="/assets/farmers-voice-logo.png" alt={lang === "ta" ? "விவசாயிகளின் குரல் இயக்கப் படம்" : "Farmers' Voice campaign image"} /></div>
        <div className="solution-grid section">{solutions.map((solution) => <article key={solution.step}><div><span>{solution.step}</span><small>{solution.horizon[lang]}</small></div><Cartoon name={solution.art} className="solution-art" /><h3>{solution.title[lang]}</h3><p>{solution.body[lang]}</p></article>)}</div>
        <div className="value-slice"><img src="/assets/docs/Mango_Value_Addition_Posters.webp" alt={lang === "ta" ? "மாம்பழ மதிப்புக் கூட்டல் சுவரொட்டியின் முன்னோட்டம்" : "Mango value addition poster preview"} /><div><p className="eyebrow light">{lang === "ta" ? "மரத்திலிருந்து உள்ளூர் மதிப்புக்கு" : "FROM TREE TO LOCAL VALUE"}</p><h3>{lang === "ta" ? "பழக்கூழ் மட்டும் ஒரு தொழில் அல்ல. முழு மதிப்புச் சங்கிலி தேவை." : "A pulp unit alone is not an industry. The whole value chain is needed."}</h3><p>{lang === "ta" ? "தோட்டம், சேகரிப்பு, குளிர்ச் சங்கிலி, பதப்படுத்தல், சோதனை, சான்றிதழ், போக்குவரத்து, சந்தை — இவை அனைத்தும் இணைந்தால் மட்டுமே விவசாயிக்கு விலை மற்றும் இளைஞருக்கு உள்ளூர் வேலை கிடைக்கும்." : "Orchard, collection, cold chain, processing, testing, certification, cargo and market must work together. That is how fruit becomes bargaining power for growers and skilled local work for young people."}</p><div className="pdf-actions solution-actions"><a className="doc-btn doc-btn-read" href={doc("value").href} target="_blank" rel="noreferrer">{t.open} <Arrow /></a><a className="doc-btn doc-btn-save" href={doc("value").href} download><DownloadIcon />{t.download}</a></div></div></div>
        <div className="closing-call section"><img src="/assets/farmers-voice-logo.png" alt={lang === "ta" ? "விவசாயிகளின் குரல் இயக்கப் படம்" : "Farmers' Voice campaign image"} /><p>{lang === "ta" ? "நெல்லுக்கு செய்ததை மாம்பழத்திற்கும் செய்யுங்கள்." : "Do for mango what has already been done for paddy."}</p><div><a className="button button-primary" href="#act">{t.join} <Arrow /></a><button className="button button-light" onClick={shareMovement}>{shared ? t.copied : t.share}</button></div></div>
      </section>

      <MythsSection lang={lang} />

      <Glossary lang={lang} />

      <Faq lang={lang} />

      <ShareKit lang={lang} />

      <footer><div className="footer-brand"><img src="/assets/farmers-voice-logo.png" alt={lang === "ta" ? "விவசாயிகளின் குரல் இயக்கப் படம்" : "Farmers' Voice campaign image"} /><div><strong>{lang === "ta" ? "விவசாயிகளின் குரல்" : "Farmers' Voice"}</strong><em className="footer-tagline">{lang === "ta" ? "நாங்கள் உங்களுக்காக நிற்கிறோம்" : "We stand for you"}</em><p>{t.footer}</p></div></div><p>{lang === "ta" ? "மாம்பழ விவசாயிகளின் விழிப்புணர்வு மற்றும் சட்டபூர்வ ஜனநாயக பங்கேற்புக்கான மேம்பட்ட மாதிரி. எந்தக் கட்சிக்கும் ஆதரவோ எதிர்ப்போ அல்ல." : "An enhanced demo for awareness and lawful democratic participation by mango farmers. It supports no political party and opposes none."}</p><div className="footer-end"><a href="#home">{lang === "ta" ? "மேலே செல்ல" : "Back to top"} ↑</a><small className="build-stamp">Build check: JavaScript has not run.</small></div></footer>
      {zoomed && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lang === "ta" ? "படம்" : "Image"}
          onClick={() => setZoomed(false)}
        >
          <button className="lightbox-close" onClick={() => setZoomed(false)} aria-label={lang === "ta" ? "மூடு" : "Close"}>✕</button>
          <img
            src="/assets/price-update-live@2x.webp"
            alt={lang === "ta" ? "மாம்பழ விலை நேரடி புதுப்பிப்பு காட்டும் படம்" : "Real-time mango price update image"}
            onClick={(event) => event.stopPropagation()}
          />
          <p>{lang === "ta" ? "பெரிதாக்க இருமுறை தட்டவும் · மூட வெளியே தட்டவும்" : "Pinch or double-tap to magnify · tap outside to close"}</p>
        </div>
      )}

      <Assistant lang={lang} />
      <BackToTop label={lang === "ta" ? "மேலே செல்ல" : "Back to top"} />
    </main>
  );
}
