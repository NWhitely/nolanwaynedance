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
- Pages: `index.html` (home, split hero), `weddings.html` (weddings),
  `lessons.html` (dance lessons). Shared `styles.css` and `main.js`.
- Contact forms use **Web3Forms** (delivered to the owner's inbox; the receiving
  address is configured in Web3Forms via `access_key`, not shown on the site).

---

# Writing voice: READ THIS BEFORE WRITING ANY COPY

**Nolan's voice is confident, masculine, analytical, succinct.** How it's said is part of
the sell. Every line should sound like an expert stating how it works, not a friendly
brand reassuring you. Applies to all site copy: headlines, FAQs, pricing, forms, buttons,
captions. Also applies when only "fixing grammar": fix it into this voice.

## The voice

- **Short declarative sentences.** Lead with the answer. "Yes." "Common." "Almost any."
- **Authority, not reassurance.** State the fact and the method. "I break every move into
  small steps and build from there." Not "and that's fine", "no worries", "don't stress".
- **Analytical.** Give the reason or mechanism: "The tempo and structure of the song decide
  the style, and I match the dance to it."
- **Succinct.** Cut every word that doesn't add information. No filler, no padding.
- **First person, direct.** "I build", "I've never had a couple who couldn't do it."
- **Concrete over abstract.** "Classic country", "a two-step to your song", not "a moment".
- The beginner angle stays the core pitch, but it's stated with confidence ("Most of my
  couples start with zero experience"), never softened or coddled.

## Rejected (do not write like this)

These were tried and rejected on 2026-11-02:

- Flowery / polished: "a few extra flourishes", "plays to both of your strengths",
  "fits your vibe", "'80s power ballads", "comfortable dancing together".
- Casual / soft: "Happens a lot.", "You'll both look good.", "that's fine",
  "Some songs are easier to dance to than others".

Approved example:
> Common. I build the routine around both of you. The stronger dancer gets more to do, the
> other gets moves they can execute with confidence. On the floor, the gap won't show.

## Banned words and phrases

These read as AI. Avoid them entirely:

- **actually** (e.g. "you'll actually enjoy it"), a dead giveaway
- **perfectly / perfect** as filler ("perfectly crafted", "the perfect moment")
- **crafted / craft**
- **unforgettable**, **magical**, **magic**
- **seamless / seamlessly**, **elevate**, **curate / curated**
- **journey** ("your dance journey")
- **mission** ("made it my mission"), **passion for** ("a passion for helping...")
- **tailored** (overused; "built around" / "based on" is fine)
- **nestled**, **dive in**, **unleash**, **transform** (as marketing puffery)
- **vibe**, **flourish**
- **whatever your X**, "whether you're X or Y" as a formula
- "It's not just X, it's Y" constructions
- **rule-of-three triads**: "fun, stress-free, and completely tailored" /
  "your timeline, budget, and goals". One or two items, not a polished list of three.
- **Em dashes and en dashes.** Use a period, comma, colon or parentheses.

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

(Nolan texts casually and in lowercase. That is not the site voice.)

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
await p.goto('http://localhost:8765/weddings.html', { waitUntil:'load' });
await p.waitForTimeout(900);
await p.screenshot({ path:'shots/out.png', fullPage:true });
await b.close();
```
Then **Read** the PNG to view it. Useful flags:
- Light/dark: `colorScheme:'light'|'dark'`. Mobile: `viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true`.
- Full-page LAYOUT check: inject `addStyleTag({content:'.reveal,.fade-in,.fade-in-stagger>*{opacity:1!important;transform:none!important}'})` so below-fold reveal content shows.
- To test the REAL scroll-reveal behavior (catch blank/stuck sections), do NOT force visibility; use `page.mouse.wheel(0, N)` then screenshot.
