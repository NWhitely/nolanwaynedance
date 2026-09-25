# Nolan Wayne Dance — project notes

Brand: **Nolan Wayne Dance** (nolanwaynedance.com, @n.wayne_). Formerly
"Dance by Nolan" / dancebynolan.com, which now 301-forwards here. The instructor goes
by **Nolan Wayne** across both dance and founder work (one public persona); legal name
Nolan Whitely is kept off the public site. No public email is shown on the site or in
graphics: the contact form (Web3Forms) is the only contact path.

Single-page-per-section marketing site for **Nolan Wayne Dance**, a dance instruction
and wedding first-dance choreography business in Austin, TX. Owner/instructor: Nolan
Wayne (legal name Nolan Whitely).

- Static site, plain HTML/CSS/JS. No build step. Hosted on a custom domain (see `CNAME`).
- Pages: `index.html` (home, split hero), `wedding-services.html` (weddings),
  `lessons.html` (dance lessons). Shared `styles.css` and `main.js`.
- Contact forms use **Web3Forms** (delivered to the owner's inbox; the receiving
  address is configured in Web3Forms via `access_key`, not shown on the site).

---

# Writing voice — READ THIS BEFORE WRITING ANY COPY

The site copy must sound like a real person wrote it, not a marketing bot. Nolan can
spot AI phrasing instantly and dislikes it. When writing or editing any user-facing
text, run it against this list first.

## Banned words and phrases (do not use in copy)

These read as AI. Avoid them entirely:

- **actually** (e.g. "you'll actually enjoy it") — overused, dead giveaway
- **perfectly / perfect** as filler ("perfectly crafted", "the perfect moment")
- **crafted / craft**
- **unforgettable**, **magical**, **magic**
- **seamless / seamlessly**, **elevate**, **curate / curated**
- **journey** ("your dance journey")
- **mission** ("made it my mission"), **passion for** ("a passion for helping…")
- **tailored** (overused; "built around" / "based on" is fine)
- **nestled**, **dive in**, **unleash**, **transform** (as marketing puffery)
- **whatever your X**, "whether you're X or Y" as a formula
- "It's not just X, it's Y" constructions
- **rule-of-three triads**: "fun, stress-free, and completely tailored" /
  "your timeline, budget, and goals". One or two items, not a polished list of three.

## Do this instead

- Short, plain sentences. First person ("I teach…", "I'll build…"), warm but not gushy.
- Concrete over abstract: "a country two-step to your song" beats "a magical moment".
- A little looseness is good: contractions, the occasional fragment, a real aside in
  parentheses. It should sound spoken, not brochure-polished.
- Lead with the beginner / low-pressure / no-judgment angle — that's the core pitch.
- "As seen on Dancing with the Stars Austin" is a fine credibility line **on the website**,
  where there's room to explain it (it's a Center for Child Protection charity fundraiser
  that's raised $2M+/yr, not the TV show). Keep it OFF standalone marketplace cards/graphics:
  with no context a stranger reads it as the TV show and feels misled. On cards, use proof
  tied to the piece instead (e.g. a competition result + event, "10+ years teaching").

## Leave alone

- **Testimonial quotes** — they're meant to sound like different real people
  ("anxiety dreams terrified", "ran through the dip 50 times"). Casual words like
  "actually fun" are fine *inside a quote*; only avoid them in Nolan's own copy.

## Nolan's own voice (mirror this)

From how Nolan writes: short, direct, casual, often lowercase, uses "idk", "i feel
like", "yeah okay". Not formal. When in doubt, plainer and more spoken is better.

> **Writing samples go here.** Nolan to paste a few real samples (texts, captions,
> emails). Until then, mirror the tone above. Once samples exist, update this section
> with the specific patterns (sentence length, punctuation, recurring words).

---

# Local preview & screenshots (how to "view" the rendered site)

Claude can't watch a live browser window — it "sees" the site by rendering it in
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
await p.goto('http://localhost:8765/wedding-services.html', { waitUntil:'load' });
await p.waitForTimeout(900);
await p.screenshot({ path:'shots/out.png', fullPage:true });
await b.close();
```
Then **Read** the PNG to view it. Useful flags:
- Light/dark: `colorScheme:'light'|'dark'`. Mobile: `viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true`.
- Full-page LAYOUT check: inject `addStyleTag({content:'.reveal,.fade-in,.fade-in-stagger>*{opacity:1!important;transform:none!important}'})` so below-fold reveal content shows.
- To test the REAL scroll-reveal behavior (catch blank/stuck sections), do NOT force visibility; use `page.mouse.wheel(0, N)` then screenshot.
