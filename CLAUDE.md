# Nolan Wayne Dance

Dance instruction and wedding first-dance choreography in Austin, TX. Owner and instructor:
Nolan Wayne. The site is also the portfolio piece for Nolan's dev business, **Wayne Studios**
(https://waynestudios.dev), so it has to be flawless and feel premium.

## Brand facts

- **Nolan Wayne Dance**, nolanwaynedance.com, Instagram **@n.wayne_** (since 2026-09-25).
  Rebranded June 2026 from Dance by Nolan / dancebynolan.com, which 301-forwards here.
- One public persona, "Nolan Wayne," across dance and founder work. Legal name Nolan Whitely
  stays off anything public.
- No public email anywhere. The Web3Forms contact form is the only contact path (receiving
  address is set in Web3Forms via `access_key`).
- Bio facts (Nolan's wording, Home page "Meet Nolan"): 16+ years dancing; Ballroom
  (International and American), Country, West Coast Swing; musical theatre as a kid;
  Ballroom in college; Master-qualified on the UCWDC circuit; currently competing in WCS;
  DWTS Austin raises close to $3 million each year.
- Results: 1st place Advanced Two-Step Jack & Jill (with Em Andrews, @emyandrews) and
  Strictly (with Kristina "Zaza" Casazza, @littlekzaza), Ask Me To Dance Wild West
  Competition, Cedar Park TX, 2026-06-12. Country Swing Finals at Forever Country (Dallas).
  UCWDC Worlds.

## Positioning and offer

- **Target the empty pond:** people who don't dance yet but have a reason to start
  (wedding, partner, nights out, bucket list). Who pays: older adults, wedding couples, casual
  social dancers. Not the competitive WCS crowd; their opinion pays nothing. Jargon like
  "UCWDC" is quiet proof, never the hook.
- **Rate:** $120 / hr (changed 2026-11-02 from $90 / 45 min).
- **The hook is free:** a free 15-min consult call, booked on Cal.com (since 2026-11-02; Nolan has
  no fixed lesson location right now). Every Book button opens the scheduler
  (`nolanwaynedance/consult`, account `nolanwaynedance`, weekdays noon to 4pm Central, Google
  Calendar connected). The contact form stays as "send a message" for people who'd rather write.
- **Promo cards** (`promo-*.jpg`, built by `make_promo_cards.py`; regenerate, never hand-edit):
  show "Book a FREE Introductory Lesson"; keep the price and any dated promo off the art.
  Fine for Instagram, Facebook feed and the website, with captions in `social-captions.md`.
- **Facebook Marketplace is different:** no branded card, no URL or @handle, no "Free"/$0.
  Those trip the off-platform-ad filter and the listing gets pulled in 24-48h (2026-06-30).
  Use a real undesigned photo, the real rate in the price field, plain text, contact kept
  on-platform. See `marketplace-listing-wedding.md`.
- **Audience priority** for the site: dance clients, then businesses (potential Wayne Studios
  clients), then developer peers. Taste: many small premium touches, not gimmicks (a
  count-along beat widget was rejected as cheap). Booking conversion comes first.

## Site and hosting

- Static site, plain HTML/CSS/JS, no build step. Pages: `index.html` (Home), `weddings.html`,
  `lessons.html`, `404.html`; shared `styles.css` and `main.js`.
- Clean URLs: `/`, `/weddings`, `/lessons` (Vercel `cleanUrls`; old `.html` and
  `/wedding-services` addresses redirect permanently). Internal links use the clean form.
- **Workflow: test before live.** Work on the `testing` branch and push. Vercel (team
  waynestudios, project `nolanwaynedance`) deploys it to **test.nolanwaynedance.com**
  (behind Vercel login, noindex). Merge to `main` only when Nolan approves.
- **Live** is still GitHub Pages from `main` (repo `NWhitely/nolanwaynedance`, public;
  `_config.yml` keeps notes and scripts off the site). Planned: move the live domain to
  Vercel, then make the repo private. DNS is at GoDaddy; Nolan adds records.
- `.gitignore` ignores raw `*.MP4`; web videos in `assets/*.mp4` are explicitly un-ignored.
- `CHANGELOG.md` records every notable change.

---

# Design system (2026-11-02: new structure, original noir and gold)

- **Concept: the line of dance.** A single gold SVG line (`.lod`, built in `main.js` from every
  `[data-count]` section) runs down the margin on the section's `data-side` and crosses between
  sections, drawing with scroll. New sections need `data-count` and alternating `data-side`.
- Section headers are counts: `.count` numeral plus `h2`; right-side sections use `.sec-head.is-right`.
  "How it works" steps are numbered 1-4 (a 5-8 count-in was tried; too obscure for beginners).
- Kept from the original site: noir default with brass/gold accents (`--accent`), Nolan's portrait as
  the home hero (photo drifts, headline fades on scroll), grayscale photos that turn to color on hover,
  fade-in reveals. Light mode is opt-in via the toggle.
- Type: Big Shoulders Display, Familjen Grotesk, Newsreader italic (reviews). Self-hosted in `fonts/`.
- Components: `.sheet` program lists with dotted leaders, `.countin`, `.quote` pull quotes, `.qa`,
  `.rate`, `.footage` (no device frames), `.album`.
- Don't reintroduce: card grids, star ratings, icon trios, ✦ dividers, sheen or magnetic buttons,
  word-split headline reveals, cursor spotlights.
- The full-red redesign and the original build are both in git history (branch
  `redesign-line-of-dance`, commit `eb5ad16`).

# Site copy

Nolan's voice and the banned-words list are in the global CLAUDE.md. For this site:

- Applies to all copy: headlines, FAQs, pricing, forms, buttons, captions. A grammar fix is
  also fixed into the voice.
- Section headings and labels are plain: "Reviews", "Pricing", "Questions", "Results".
  No idioms or wordplay ("On the record", "The rate", "From the studio to the spotlight" were
  rejected 2026-11-02 as AI tells).
- Sound like an expert stating how it works: "Yes." "Common." "Almost any." Then the method or
  reason ("The tempo and structure of the song decide the style, and I match the dance to it.").
- Concrete dance terms over abstractions: "classic country", "a two-step to your song".
- The beginner angle is the core pitch, stated with confidence ("Most of my couples start with
  zero experience"), never coddled.
- Rejected on 2026-11-02, don't repeat: "a few extra flourishes", "plays to both of your
  strengths", "fits your vibe", "'80s power ballads", "comfortable dancing together"; and the
  soft versions "Happens a lot.", "You'll both look good.", "that's fine". Also avoid "actually",
  "perfect" as filler, "mission", "passion for", "tailored", "whatever your X".
- Approved example:
  > Common. I build the routine around both of you. The stronger dancer gets more to do, the
  > other gets moves they can execute with confidence. On the floor, the gap won't show.

## Credibility lines

- "As seen on Dancing with the Stars Austin" is fine **on the website**, where there's room
  to explain it (a Center for Child Protection charity fundraiser that raises close to
  $3M each year, not the TV show). Keep it OFF standalone marketplace cards/graphics: with
  no context a stranger reads it as the TV show and feels misled. On cards, use proof tied
  to the piece instead (e.g. a competition result + event, "16+ years teaching").
- The "As Featured In" strip (DWTS Austin, The Knot, WeddingWire, Brides of Austin) is
  confirmed real. Leave it.

## Leave alone

- **Testimonial quotes.** They're meant to sound like different real people
  ("anxiety dreams terrified", "ran through the dip 50 times"). Casual words are fine
  *inside a quote*; the voice rules apply only to Nolan's own copy.

---

# Local preview and screenshots

Claude can't watch a live browser window. It "sees" the site by rendering it in
**headless Chromium (Playwright)** and capturing screenshots, then reading the PNGs.
"Take a screenshot" = "look at the page via the Chromium we set up." There is no live feed.

**1. Serve the static site (background):**
```
python3 -m http.server 8765 --directory /Users/nolan/Documents/NolanWayneDance
```

**2. Playwright + Chromium** live under `/tmp/nwdshot` (browser binary cached in
`~/Library/Caches/ms-playwright`, which survives reboots; `/tmp/nwdshot` may not).
If `/tmp/nwdshot/node_modules/playwright` is missing, reinstall:
```
mkdir -p /tmp/nwdshot && npm i --prefix /tmp/nwdshot playwright && \
  /tmp/nwdshot/node_modules/.bin/playwright install chromium
```

**3. Screenshot script** (run with `node` from `/tmp/nwdshot`):
```js
const { chromium } = require('/tmp/nwdshot/node_modules/playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:820}, colorScheme:'dark', isMobile:false });
const p = await ctx.newPage();
await p.goto('http://localhost:8765/weddings.html', { waitUntil:'load' });
await p.waitForTimeout(900);
await p.screenshot({ path:'shots/out.png', fullPage:true });
await b.close();
```
Locally, use the `.html` file names (the Python server has no clean URLs).
Then **Read** the PNG to view it. Useful flags:
- Light/dark: `colorScheme:'light'|'dark'`. Mobile: `viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true`.
- Full-page LAYOUT check: inject `addStyleTag({content:'.reveal,.fade-in,.fade-in-stagger>*{opacity:1!important;transform:none!important}'})` so below-fold reveal content shows.
- To test the REAL scroll-reveal behavior (catch blank/stuck sections), do NOT force visibility; use `page.mouse.wheel(0, N)` then screenshot.
