# Run Farmers' Voice in VS Code

## What was added in this version

- **A scrolling counter bar** fixed to the top of the window. It carries the tagline
  "We stand for you", the live like and vote counts, and rotating awareness facts.
  It stays visible at every scroll position and pauses when you hover over it.
- **A like button and share row** under the hero, with WhatsApp, Telegram, X,
  Facebook and a copy button that grabs a ready-written message plus the link.
- **A voting box** inside *Take action*: "What should happen first?" with the four
  demands from the documents, shown as filling bars with percentages.
- **14 cartoon drawings** in `app/cartoons.tsx`, one per idea. These are inline SVG,
  so they stay sharp when printed as a poster and add nothing to page load time.
- **Two new sections**: *Check this before you share* (six myths answered from the
  documents) and *Copy it, send it* (three ready-to-send messages).

Every new piece is bilingual, the same as the rest of the site.

## Motion and the newest sections

- **A motion layer** in `app/motion.tsx`. Sections fade and slide in as you reach
  them, key figures count up the first time they appear, a reading-progress bar
  tracks the page, the header condenses once you scroll, the current section is
  underlined in the menu, and a back-to-top button appears after a while.
- **02 · One season** — the chronology of a single mango season, showing that the
  money goes out first, the fruit cannot wait, and the price arrives after both.
- **09 · The words** — ten terms (MSP, MIS, ramp price, FPO, TNCSC and others)
  explained in plain language, so anyone can follow a meeting on this subject.
- **10 · Questions** — an accordion answering what people actually ask, including
  how to verify the figures yourself through a Right to Information request.

Two rules were followed throughout the motion work. Animation is applied only
after the script runs, so if it ever fails the page stays completely readable.
And anyone whose device asks for reduced motion gets the full site with no
movement at all, rather than a degraded version.

## Three tools added

### WhatsApp image maker (in the Spread section)
Pick one of four facts and it draws a 1080 x 1080 poster on a canvas in the
browser, in whichever language is selected. "Download image" saves a real PNG;
"Share directly" opens the phone's share sheet where supported. No image files
are stored in the project — the poster is drawn fresh each time, so editing the
facts in `app/sharecard.tsx` changes the images immediately.

### Section audio (`app/audio.tsx`)
Each major section has a "Listen to this" button. It works in **both languages on
every device**, using two sources:

1. **A voice installed on the device**, when there is one for that language. This
   sounds best. Most phones have an English voice.
2. **A bundled recording**, when there is not. Tamil voices are rare on Windows
   and on many phones, so all twenty clips (ten sections x two languages) ship
   with the site in `public/audio/`. About 2.4 MB in total, and nothing is
   downloaded until someone presses play.

This was tested on a browser with **zero** voices installed: all ten sections
played in Tamil from the bundled files.

The spoken text lives in `audioScripts` in `app/audio.tsx`. If you change it,
regenerate that clip, or the button will fall back to the old recording. The
clips were made with espeak-ng:

    espeak-ng -v ta -s 135 -p 45 -w out.wav "your Tamil text"
    ffmpeg -y -i out.wav -ac 1 -ar 22050 -b:a 32k public/audio/crisis-ta.mp3

The bundled Tamil voice is synthetic and sounds robotic. It is there so that no
one is left with silence. If you can record a real person reading these scripts,
replace the files in `public/audio/` keeping the same names — that would be a
large improvement and needs no code change.

### The site guide (`app/assistant.tsx`)
A floating "Ask" button, bottom right. Someone can type or speak a question in
English, Tamil or Tanglish; it answers in one paragraph and offers to jump to
the matching section.

It is a router, not a chatbot. It matches against a keyword lexicon covering
thirteen topics, held in `topics` at the top of the file — add a topic there and
it works immediately. This runs entirely on the device, which is deliberate: a
static site cannot hold an API key without publishing it to everyone who opens
the page, and a campaign site should not send a farmer's typed question to a
third party. It is also instant, free, and works on a weak connection.

Voice input needs Chrome or Edge; the typed input works everywhere.

## The bold theme

The site uses a vivid, gradient-led look built from the fruit's own colours:
sun yellow through mango orange into flame red, against deep grove green.

- **Fonts** are Baloo Thambi 2 (headlines) and Anek Tamil (body). Both carry
  Latin *and* Tamil, so the voice is identical in either language. They are
  installed from npm and bundled into the build, so they work offline and do
  not depend on Google Fonts being reachable.
- **Colours** all come from CSS variables at the top of the bold theme block in
  `app/globals.css`. Change `--mango`, `--flesh`, `--sun` or the `--g-warm`
  gradient there and the whole site follows.
- **Motion** was turned up: sections travel further, rotate slightly as they
  arrive, and settle with a spring. The hero artwork drifts against the scroll.

## If you see no animation

Scroll to the very bottom of the page. Above the footer, on the right, there is
a small grey line. It reads one of four things:

- `Build 2026-08-16-motion-3 · motion ON · 125 animated blocks`
  Everything is working. Animations play as sections scroll into view, so a
  screenshot of the top of the page will not show them.
- `Build ... · motion OFF (your device asks for reduced motion)`
  Turn off reduced motion in your operating system's accessibility settings.
- `Build check: JavaScript has not run.`
  The script did not load. Restart the dev server and hard-reload the page.
- **No line at all** — you are running an older copy of the project. Extract the
  newest ZIP to a fresh folder and open that one.

Tell me exactly what that line says and I can tell you what is wrong.

The whole readout is one `<small className="build-stamp">` in `app/page.tsx`
plus a short block in `app/motion.tsx`. Delete both before the site goes public.

## Video links

`app/references.tsx` holds the video coverage. Two entries are filled — the only
videos that could be verified by search — and four empty slots sit below them.

To add a video, paste the address into an empty slot's `url` and fill the
`source`, `title` and `note`:

    url: "https://www.youtube.com/shorts/XXXXXXXX",
    source: "Polimer News",

Rules the section follows on its own:
- A slot with an empty `url` is **not shown**, so the site never displays a
  dead link. The whole section hides itself if every slot is empty.
- `platform` sets the badge: "youtube", "shorts", "instagram" or "facebook".
- `art` chooses the poster from the campaign's own cartoons. The available
  names are listed in a comment beside the slots.

Thumbnails use this campaign's own cartoons. Do not swap in stills taken from
someone else's video — republishing those without permission would expose the
movement to a copyright complaint.

## Adding your social media links

Open `app/social.tsx`. At the top there is a list with YouTube, Instagram,
Facebook, WhatsApp, X and a "news coverage" slot. Paste each link between the
quote marks:

    url: "https://www.youtube.com/watch?v=...",

Rules the box follows on its own:
- A slot with an empty `url` is **not shown**, so the site never displays a
  dead link to the public.
- While every slot is empty, the box shows a short reminder to add them. That
  note disappears by itself as soon as the first link is filled in.
- Each platform lights up in its own brand colour on hover.

To add a platform that is not listed, copy one of the blocks and give it a new
`id`. If there is no icon for that id it falls back to the news icon.

## The hero image

`public/assets/price-update-live.webp` (1024px) is what visitors see; it is
downsampled into a roughly 520px slot, which is where a photograph looks
sharpest. Clicking it opens `price-update-live@2x.webp` full screen for
reading the price panels. The 2x file is only loaded when someone zooms, so
it does not slow the first paint on a weak connection.

To swap the picture, replace those two files, keeping the same names and the
same 1.43:1 shape.

## Language

Tamil is the default. English is the second language, reachable from the button
in the header. To swap them back, change the `useState<Language>("ta")` in
`app/page.tsx` and the `<html lang="ta">` in `app/layout.tsx`.

## Changing the starting counts

The counters open at 4,587 likes and 1,298 votes, and a visitor's own like or
vote is added on top. These are presentational starting figures, not a measured
count of real supporters.

Both live at the top of `app/engage.tsx`: `BASE_LIKES` for likes, and the `base`
value on each entry in `pollOptions` for votes. Set them to 0 to show only
genuine counts.

## Shared likes and votes (deployed sites)

`app/api/pulse/route.ts` is a real counter backed by **MySQL**. Likes and votes
go to your server, so every visitor sees the same totals — one person's like
shows up for everybody else.

This has been tested end to end against a live MySQL server: the table creating
itself, a vote moving rather than double-counting, an unlike refusing to go
below zero, and the counts surviving a full server restart.

### Turning on permanent storage

1. Create a MySQL database. Any MySQL 5.7+ or MariaDB works — PlanetScale,
   Aiven, Railway, Clever Cloud, or a MySQL server you already run.
2. In your Render dashboard: open the service, go to **Environment**, and add:

       DATABASE_URL = mysql://user:password@host:3306/dbname

3. Redeploy, then open `https://your-site/api/pulse`. It reports which store it
   is using:

       {"likes":0,"votes":{},"storage":"mysql","stored":true}

   `"storage":"mysql"` means connected. `"storage":"memory"` means it is not —
   check the variable name, that you redeployed after adding it, and that your
   database allows connections from Render's IP addresses.

The `pulse_counts` table is created automatically on first use. There is no
migration to run and nothing to set up by hand.

TLS is switched on automatically for remote hosts and skipped for localhost, so
the same connection string format works in both places.

### Without a database

Counts are held in the server's memory: still shared between visitors, but they
reset whenever the server restarts, which on a free hosting tier happens after
inactivity. Fine for testing, not for a live campaign.

### What is actually stored

Only the real, earned counts. The presentational starting figures (4,587 and
1,298) are added on the client, so the table always reflects what people
actually did. The day you set those baselines to zero, the genuine numbers are
still there.

If the server cannot be reached at all, the page falls back to this device's own
counts so nothing breaks.

## Making the counts shared across everyone

Right now likes and votes are saved in each visitor's own browser, so two people
on two phones each see their own tally rather than a district-wide total. This is
stated in small print under the like button, so nothing on the page claims a
supporter count that does not exist.

To make the counts real and shared, open `app/engage.tsx`. Two functions,
`readStore` and `writeStore`, are the only places that touch storage. Point those
at a server endpoint and every counter on the page becomes a shared tally, with
no other changes needed. This project already includes Cloudflare D1 scaffolding
(`db/`, `examples/d1/`) for exactly that.


## 1. Install the required software

- Install Visual Studio Code.
- Install Node.js 22.13 or newer from the official Node.js website.
- Restart VS Code after installing Node.js.

## 2. Open the correct folder

Extract the ZIP file. In VS Code, select **File → Open Folder**, then select the `farmers-voice-movement` folder containing these files:

- `package.json`
- `app`
- `public`
- `vite.config.ts`

Do not open only the parent folder.

## 3. Install packages

Open **Terminal → New Terminal** and run:

```powershell
npm install
```

Deprecation messages beginning with `npm warn deprecated` are warnings and do not normally stop the installation.

## 4. Start the website

```powershell
npm run dev
```

Open the address shown after `Local:`, normally:

```text
http://localhost:5173/
```

## 5. Stop and restart

Press `Ctrl + C` to stop the server. Start it again with:

```powershell
npm run dev
```

## Optional checks

Create a production build:

```powershell
npm run build
```

Check the source code:

```powershell
npm run lint
```

## Common fixes

If `node` or `npm` is not recognized, reinstall Node.js, enable the option that adds Node.js to PATH, and restart VS Code.

If installation scripts were blocked:

```powershell
npm approve-scripts --allow-scripts-pending
npm rebuild
npm run dev
```

If port 5173 is already being used:

```powershell
npm run dev -- --port 5174
```
