# Changelog

All notable changes to the Nolan Wayne Dance website (formerly Dance by Nolan, originally First Dance by Nolan).

## 2026-09-25

### Copy audit + West Coast Swing
- **Swing is now West Coast Swing** on the lessons page (card, description, about paragraph, what's-included list, and the two FAQs that named it). The old card described East Coast Swing.
- **"Meet Nolan" heading is now "Nolan"** on all three pages.
- **Pass over every description for overselling.** Cut the banned-list words (`actually`, `perfect`, `tailored`, `next level`, `show-stopping`, `shine`), the adjective triads ("Elegant, classic, and a wonderful place to start"; "Bouncy, playful, and a blast"), and claims that were doing too much ("you'll look like you've been dancing together for years", "A stress-free, fun experience (I promise!)", "Reach out and let's make it happen", "That's the perfect time to start"). Shorter and plainer throughout: genre cards, how-it-works steps, both FAQ sets, what's-included lists, pricing and contact intros, and the home path card.
- **Mobile testimonials:** the swipe container had no room above the cards, so the decorative quote mark on top of each box was sliced off. Added top padding (and pulled the container up to keep the spacing).


- **Home hero headline** was the stacked brand name ("Nolan / Wayne / Dance"), which read like a logo rather than a message (the nav wordmark already says it). Now "Book Private Lessons". The keyword line for search engines stays in the h1, hidden.
- **Instagram handle** is now **@n.wayne_** (was @nolanwaynedance). Updated every link, the footer, and the `sameAs` schema on all three pages, plus `social-captions.md` and CLAUDE.md. Still carrying the old handle: the `promo-*.jpg` cards have it burned into the artwork, and the Behold feed embed should be checked.

## 2026-09-21

### Country Noir redesign
- **New home hero:** the split wedding/lessons photo hero is gone. The home page now opens on the country shoot portrait (`assets/Country Shoot/BA081E9B…jpeg`, exported as `assets/nolan-hero.jpg` + `.webp`), full-bleed. Desktop opens on the top half (hat and face) and scrolling runs down the photo into a black band; phones show the whole photo with the type at the bottom over the dark bench. Headline is "Nolan Wayne Dance" with two CTAs (Weddings / Lessons).
- **Two-path band:** the old split panels' copy now lives in a black two-column band under the hero, so the Weddings/Lessons choice is still one scroll away.
- **Palette:** swapped gold-on-ivory for Country Noir, pulled from the photo: black, bone white, brass (the only accent), concrete. Noir is now the default for every visitor; light is opt-in via the toggle (previously followed the system setting). Buttons are black/white instead of gold; the ✦ flourish is now a short brass rule.
- **Headshot:** all three pages use a 4:5 crop of the same portrait (`assets/nolan-headshot-country.jpg`), still grayscale.
- **Home DWTS photo** is grayscale until hovered, so the home page reads black and white.
- **Fixes:** theme toggle no longer squishes into an oval on phones; Instagram handle link no longer shows browser-default purple; wedding hero's italic accent is readable in light mode.
- Removed the split-hero CSS/JS (including its mobile auto-alternating panels).

### Rename to match nolanwaynedance.com
- GitHub repo renamed `firstdancebynolan` → `nolanwaynedance` (GitHub redirects the old URL; Pages custom domain unchanged). Local folder renamed `FirstDanceByNolan` → `NolanWayneDance`.
- `robots.txt` sitemap pointed at `dancebynolan.com`; now `nolanwaynedance.com`.
- **Link preview:** `og-image.jpg` was still the old wedding stock photo. Rebuilt from the country shoot portrait with the Nolan Wayne Dance name (`make_og_image.py`). Removed the stale `og-image.svg` ("Dance by Nolan" template, unused).

## 2026-06-30

### Facebook Marketplace takedown fix (wedding listing)
Wedding listings were passing Marketplace's initial scan but getting pulled 24-48hrs later by the second-pass review. Diagnosed the cause as the listing photo: we were posting the branded card (now `promo-wedding.jpg`, renamed below), which is a designed flyer with a website URL, an `@handle`, and a "Book a FREE Introductory Lesson" button on it. The heavier second-pass classifier reads that as an off-platform ad and removes it. Two more flags compounded it: a "Free"/$0 price on a service (lead-gen signature) and "message me for details" with no real description (vague off-platform redirect pattern).

- **`marketplace-listing-wedding.md` (new):** a Marketplace-specific, low-flag listing kit, separate from the promo-card system. Plain literal title ("Wedding First Dance Lessons in Austin TX"), the real $90 in the price field instead of "Free," and a written-out first-person description (beginner/low-pressure angle, what it is, where, how it works) that ends by asking them to message their song + date — kept inside FB messaging, no URL/handle/phone in the listing.
- **Photo guidance:** use a real, un-designed photo, not the branded card. Recommended `assets/hollingsworth-2.jpg` (a real couple's first dance at a venue, phone-shot; `hollingsworth-1.jpg` as a second), and flagged the polished b&w editorial shots (`photo1`, `photo5`, `photo7`) to avoid since they read as stock.
- **Posting habits:** don't repost identical listings (trains the spam classifier), renew/edit instead, keep contact on-platform until they message. Noted the branded cards still belong on Instagram/the website, just not on Marketplace.
- **Honest framing:** the photo is the biggest single fix but not a guarantee on its own — the real photo, real price, and real description work as a set; services are only loosely allowed on Marketplace and a competitor report can still trigger a takedown.
- **`make_marketplace_safe_card.py` + `marketplace-wedding-safe.jpg` (new):** a de-flagged branded card to use as the *second* photo (never the lead), so the listing still carries Nolan's identity without leading with the trigger. Same dark/gold house style, but the three off-platform-ad triggers are removed (no URL, no @handle, no "Book a FREE" button); keeps the name, "Wedding Dance Lessons," Austin, the Waltz/Country/Swing/Slow Dance styles, and the "10+ years" credential. The `marketplace-` prefix is correct under the new naming (it genuinely is a Marketplace asset, unlike the `promo-*` cards). Listing order: real photo first (`assets/hollingsworth-2.jpg`), safe card second.
- **Restored Fraunces + Montserrat:** the original Pillow compositor lived in `/tmp` and was lost when tmp cleared (only Didot/Avenir remained on the system). Re-downloaded the variable fonts from Google Fonts into `fonts/` so the card matches the site's type system (Fraunces opsz=144 / wght~470 display headline, Montserrat letterspaced labels). The new compositor lives in the repo so it won't vanish with tmp again.

### Renamed the branded cards to `promo-*` (these are not Marketplace assets)
Following the takedown diagnosis: the eight branded card images were named `marketplace-*`, which actively invited the exact mistake (posting the branded card to Marketplace) that gets listings pulled. Renamed to reflect their real role as Instagram / Facebook feed + website graphics.

- The four squares and four `-9x16` stories (`marketplace-{country,wedding,social}.jpg`, `marketplace-image-nolanwayne.jpg`, `marketplace-*-9x16.jpg`) became **`promo-{country,wedding,lessons,social}.jpg`** and `promo-*-9x16.jpg`. No site HTML/CSS references them, so nothing broke.
- `marketplace-listings.md` became **`social-captions.md`** and was reframed from "Marketplace listings" to Instagram/Facebook captions for the promo cards, with a banner up top: these branded cards and the free-intro/CTA copy are for IG/FB feed + the website, NOT Marketplace (for Marketplace, use the plain low-flag listing in `marketplace-listing-wedding.md`). The old name was also confusingly close to that file.
- The promo cards carry the final copy: the `[X] Dance Lessons` headlines (see 2026-06-24), Fraunces type, and the "10+ years teaching & competing" footer.

### Testimonials: realistic voice + curated "see more" expander
- Rewrote all ~30 placeholder testimonials from polished/copywritten to plain, real-person voice, with deliberate **variance**: scrappy one-liners ("10/10. so fun.", "best decision… besides the open bar"), plain mediums, and a few longer heartfelt/grateful/formal ones (the grandmother-waltz, "thank you, Nolan, truly," the in-her-60s beginner). An all-casual wall read fake; the spread reads real. First pass over-flattened everything to casual, then re-introduced the long/thankful range.
- **Curated display:** wedding and lessons now show **6 by default**, with a "See N more reviews" button that expands inline to the full set and toggles to "Show fewer" (glides back to the section top on collapse). The visible 6 are chosen for *range* (one-liner + mediums + a heartfelt-long) and to cover beginner / experienced / virtual, not just the first 6. Mobile keeps the swipe carousel; the button feeds extras into it. Home stays a 2–3 teaser. `.testimonial.is-extra` hides the rest; the button auto-hides if a page ever has ≤6.

### Cinematic heroes + scroll reliability
- **Lessons hero** rebuilt as a cinematic ambient stage (vertical country-swing reel centered + a blurred/dimmed copy filling the width), matching the wedding hero. Dropped "Austin, TX" from both hero eyebrows (it's established everywhere else).
- **Blank-page bug fix (important):** the GSAP ScrollTrigger reveals were setting whole sections to opacity 0 and not firing reliably under Lenis, so large stretches rendered blank after scrolling. Reverted all reveals to the dependable **IntersectionObserver** layer (which can't get stuck); GSAP is now limited to non-destructive parallax. Caught only by testing with motion on (earlier screenshots had force-shown the content, masking it).
- **More glide:** Lenis `lerp` 0.09 → **0.05** (longer, glassier). Nav anchor links now glide via `lenis.scrollTo` instead of jumping.

### Home hero
- Taller, more immersive panels (near-full-screen on mobile).
- **Animated mobile split:** instead of a vertical stack, the two panels stay **side by side and auto-alternate** which one is expanded (active panel shows full content; the other slims to a title-only teaser strip, swapping every ~4s). The touch equivalent of the desktop hover-to-expand. Respects reduced-motion (one expanded, no cycling) and pauses when scrolled out of view.
- **Transparent overlay nav:** transparent over the hero with light, shadowed text; solidifies to a glass bar on scroll (still hides on scroll-down). Applies across all three heroes.
- **Light-mode eyebrow fix:** the panel eyebrow used the theme gold, which went near-invisible in light mode; switched to the bright non-flipping `--gold-light` with a shadow so it pops in both themes.

### Copy
- **Lessons "How It Works"** rewritten to a service voice (dropped "I / we / my students" for "you" and the process).
- Cut the fluff sentence ("the same patient, step-by-step coaching… brightest lights") from the home Dancing with the Stars feature; it states the fact now.

### Polish audit (template-tell cleanup)
- Genre-level **pill chips** → flat letterspaced labels; genre cards de-boxed (single gold top rule, no hover-lift). Pricing "$90 / What's Included" **de-carded** to hairline-separated blocks. "As Featured In" unified to a muted press row. Buttons made flat-editorial (no glow / lift / pulse). The "All Couples/Dancers Welcome" badge de-carded to a hairline mark.

### Housekeeping
- Moved ~145MB of unused raw masters (original `.MP4`/`.MOV`/`.HEIC` plus `photoN.png` duplicates the site doesn't load) into an ignored **`_masters/`** folder; `assets/` dropped to ~27MB and is push-ready. `.gitignore` updated.
- Documented the **local preview + headless-Chromium screenshot workflow** in `CLAUDE.md` (server command, Chromium reinstall, screenshot-script pattern) so it's reusable next session.

## 2026-06-24

### Marketplace card system (off-site marketing, major expansion)
Grew the two early Marketplace graphics (see 2026-06-22) into a four-angle system, each card aimed at a distinct market, plus a 9:16 story/reel version of each (8 images total). Built with a Python/Pillow compositor (gold-framed, dark cinematic house style); listing assets live in the repo root and are not embedded in the website.

- **Per-market strategy ("empty pond"):** the cards target people who do not dance yet but have a reason to start (a wedding, a night out, social/later-in-life), not the saturated existing-dancer community. Each card gets its own photo, headline, and recognizable styles; insider jargon is kept as quiet proof, never the hook.
- **Parallel headline format:** all four headlines are the service name and end in "Lessons" (Dance Lessons / Wedding Dance Lessons / Country Dance Lessons / Social Dance Lessons), so the set looks deliberate and each is searchable; the engaging hook lives in the subheading below, not the headline.
  - `marketplace-country.jpg`: "Country Dance Lessons" (sub: "Learn to two-step before your next night out"), over the two-step dip photo. Big line "TWO-STEP & COUNTRY SWING" (the recognizable bar styles); the 8 partner dances listed small underneath (no "UCWDC" label, which means nothing to a beginner).
  - `marketplace-wedding.jpg`: "Wedding Dance Lessons" (searchable; was "Your First Dance"), over the formal-couple photo (`photo1`). Sub: "Custom choreography, built around your song." Styles: Waltz / Country / Swing / Slow Dance (concrete first-dance picks, not the abstract "Ballroom").
  - `marketplace-image-nolanwayne.jpg`: general "Dance Lessons" catch-all, moved off the wedding photo onto a practice-couple shot (`photo5`) so it does not twin the wedding card.
  - `marketplace-social.jpg`: "Social Dance Lessons" (sub: "Never too late to start, and a good way to get out"), over an older couple at sunset (`photo4`). Aims at the older / casual-social market Nolan says actually books, which none of the other cards pictured.
  - `*-9x16.jpg` for all four: same art and copy, taller crop for IG/FB stories and reels. Stories are kept clean (no button); the CTA goes in the caption there.
- **Dropped the "As seen on Dancing with the Stars Austin" line from the cards.** With no room for context a stranger reads it as the TV show and feels misled (it is the Center for Child Protection charity event). Replaced with proof that fits each market: country uses the real competition credential (1st Place, Advanced Two-Step Jack & Jill, captioned to the photo: Ask Me To Dance Wild West Comp, Cedar Park, TX); the rest use "10+ years teaching & competing." The DWTSA line stays on the website, where it can be explained. `CLAUDE.md` voice guide updated to reflect this split.
- **"Book a FREE Introductory Lesson" button** added to the four square cards (gold pill, FREE emphasized). The price ($90) and any dated promo stay OFF the art so the images never expire; the deadline lives in the listing text.
- **Typography unified with the site:** switched the cards from Cormorant Garamond to **Fraunces** (variable, ~500 weight) + Montserrat, matching the website's type system so the card-to-site handoff reads as one brand. The earlier Cormorant was an accidental default, not a choice.
- **Layout discipline:** location appears once (top `NOLAN WAYNE · AUSTIN, TX` eyebrow), audience once (logistics line), credential once (footnote); deduped repeats as copy got layered in.
- **`marketplace-listings.md` (new):** four paste-ready Marketplace listings (search-tuned titles + first-person descriptions in Nolan's voice), each opening with the dated "new student special: first lesson free, through [date]" line and closing with "Book a free introductory lesson now." Includes pricing guidance (set the $90 in the Marketplace price field, keep it off the art) and posting notes (separate listings, re-list weekly, square for Marketplace / 9:16 for stories).

## 2026-06-22

### NW monogram sharpness fix + header logo "frame-break" treatment
- **Root cause of the blurry monogram:** the "NW" in `favicon.svg` was set as live `<text>` in Fraunces. But the mark is loaded through an `<img>` tag (nav) and a `<link rel="icon">` (tab), and `<img>`-loaded SVGs render in an isolated context that can't see the page's Google-Fonts Fraunces. So the letters silently fell back to Times New Roman, and the fine serif detail mushed when scaled down. It was never a resolution problem (SVG is vector); it was the wrong font plus too-fine detail at small size.
- **Fix:** outlined the real Fraunces "NW" into vector paths (via `fonttools`, instancing the variable font and extracting the N/W glyph outlines), so the mark no longer depends on any font being available. Renders identically in nav, tab, and anywhere embedded.
- **Legibility:** first outline used the display optical size (opsz 144), which has dramatic thick/thin contrast: the hairlines vanished small ("too skinny"). Max weight at the small-text optical size (wght 900, opsz 9) fixed legibility but read "too blocky." Settled the header mark on a mid cut (wght 650, opsz 22) for elegant-but-readable strokes.
- **Split the two marks** so each is tuned to its size:
  - `favicon.svg` (browser tab): the bold, **contained** mark, since it has to survive ~16px where overflow would just clip.
  - `logo-mark.svg` (new, nav header): a "frame-break" treatment per Nolan's sketch. The NW pushes out past the left/right of the gold hairline frame, and the frame **breaks cleanly** where the letters cross it (a dark knockout stroke behind the gold letters leaves a gap, so the border never slices through the glyphs). Letters stay on the dark tile so they keep contrast against the near-white nav. Letter-spacing pulled slightly tighter.
  - Pointed the nav `<img class="logo-mark">` to `logo-mark.svg` on all three pages; the tab `<link rel="icon">` still uses `favicon.svg`.

### "Meet Nolan" bio rewrite (weddings + lessons)
- Rewrote the About bio on both pages to read a notch less casual while still sounding like a real person (no AI-flag words, no em dashes).
- Both pages now share the **same opening paragraph**: professional dancer/instructor in Austin, **10+ years competing and teaching** (Ballroom, Country, Swing, and more), and the **Dancing with the Stars Austin / Center for Child Protection** charity context ($2M+ raised annually for Austin-area kids). Pure credibility, identical on both since the audience for that line is the same. Note: it's duplicated copy across `wedding-services.html` and `lessons.html` — edit both if it changes.
- Second paragraph stays tuned to each audience: **weddings** leads with couples / first dance / their song; **lessons** keeps the beginner hook ("convinced they have no rhythm at all," no experience needed).
- Dropped the 1st-place Advanced Two-Step (Jack & Jill) competition line from the lessons bio — competition cred doesn't sell the beginner/social market that actually books.

### Full visual redesign ("Atelier" — editorial, cinematic, themed)
- **Type system:** moved from Cormorant Garamond to **Fraunces** (optical-sizing display serif) for headlines, with italic-gold accents; Montserrat retained for labels/body. Editorial type scale and generous negative space throughout.
- **Brand identity:** nav now shows the one-word **NolanWayneDance** wordmark; redrew the favicon **NW monogram** with a gold gradient and a couture hairline frame.
- **Light + dark theming:** ivory "Noir Atelier" light theme and a **true-black** dark theme. Follows the visitor's system preference automatically and offers a **manual toggle** (choice persists in localStorage, applied before paint to avoid flash). All surfaces driven by theme tokens.
- **De-carded:** removed WordPress-style drop-shadows and rounded boxes in favor of editorial hairline layouts and sharp corners.
- **Cinematic motion:** added **GSAP ScrollTrigger + Lenis** (smooth scroll, scroll-zoom on imagery, parallax on the split-hero panels, staggered reveals, nav hide-on-scroll). Progressive enhancement: degrades to simple fades if the libraries are blocked or the visitor prefers reduced motion. Loaded via CDN; no build step.
- **Real client media (Hollingsworth wedding):** converted the HEIC photos and MOV video to web formats, **cropped out the Instagram chrome and @-tags**, and pulled additional clean stills from the clip.
  - Wedding **hero** rebuilt as a cinematic ambient stage: the sharp vertical client reel centered, with a blurred/dimmed copy of the footage filling the width behind it (handles the off-ratio vertical source without stretching). Full-impact on mobile.
  - Wedding **gallery** rebuilt around the real footage (1 featured twirl + 4 supporting moments), replacing the stock placeholders; honest heading ("A Recent First Dance").
- **Mobile:** testimonials converted to a **swipeable carousel** on phones — the wedding page dropped from ~35,000px tall to ~12,000px. Verified all pages in headless Chromium (desktop + mobile, light + dark).

### Hero copy trim
- Removed the subtitle paragraph under the hero headline on the lessons and weddings pages; both read as AI. Shrinks the hero banner, which reads cleaner. The "Dancing with the Stars Austin" credibility line that lived in the lessons subtitle is already carried by the "As Featured In" section and the About copy below, so nothing was lost.

### Testimonials: submission form + seeded reviews
- Added a "leave a testimonial" form below the testimonials on the lessons and weddings pages, reusing the existing **Web3Forms** setup (no new service or database). Submissions email to the owner's inbox with their own subject lines (`New testimonial (Lessons / Weddings)`) so they filter apart from inquiries; the owner hand-picks which to publish.
- Form fields: name, location, a 1–5 **star rating** (CSS star widget, `styles.css`), the review text, and a consent checkbox so there's permission to post before anything goes live. The shared handler in `main.js` already drives any `form.web3-form`; added a `data-success` attribute so the testimonial form shows its own confirmation message.
- Seeded 10 new reviews per page (alongside the original 4) so the section doesn't look empty, all 5-star, with a visible gold star row added to every card (existing ones included).
- Wrote them to read as real people, not AI: varied length (one-liners through paragraphs), modeled on phrasing from real wedding-dance review pages, audited to remove cross-review repetition (duplicate "two left feet", a near-clone technique review, repeated "never made me feel" / "look forward to" / "would recommend"), kept "actually" to the original quotes only, no em dashes, no AI-flag words.
- A few reviews call out the **from-home** options as social proof: one in-home ("Nolan comes right to my house"), one virtual-by-choice (lessons over video from the living room), and one long-distance couple (Nashville, TN) who did the whole first dance over video.
- Note: seeded reviews are illustrative placeholders, to be replaced by real ones as the form collects them.

### Rebrand to Nolan Wayne Dance
- Rebranded from **Dance by Nolan** to **Nolan Wayne Dance** (`nolanwaynedance.com`). `dancebynolan.com` now forwards here at the registrar level, as `firstdancebynolan.com` already did.
- Consolidated to a single public persona, **Nolan Wayne**; legal name kept off the public site.
- Updated the logo mark from "DN" to "NW" in `favicon.svg` (used as both the nav mark and the browser tab icon site-wide).
- Updated the brand name in nav, page titles, meta tags, JSON-LD, and code comments across all pages.

### Marketing collateral (off-site)
- Built square (1080x1080) Facebook Marketplace product graphics in the gold-framed, black-and-white house style: a `NOLAN WAYNE · AUSTIN, TX` eyebrow, a large serif headline, the service/feature lines (`for individuals & couples, no experience needed`, `in-home, in-studio, or online`), and `nolanwaynedance.com` / `@nolanwaynedance` with the Dancing with the Stars Austin line. No email; Marketplace messaging and the website are the contact paths.
  - `marketplace-image-nolanwayne.jpg`: general "Dance Lessons" listing over the wedding first-dance photo, with the WEDDING / BALLROOM / COUNTRY / SWING row.
  - `marketplace-country.jpg`: "Country Dancing" variant over the two-step competition photo ("Learn to two-step before your next night out", "ALL 8 UCWDC DANCES", "for singles & couples").
- These are listing assets in the repo root; they are not embedded in the website.

### Contact form (now live)
- Replaced the Formspree placeholder with **Web3Forms** on all three pages; submissions deliver to the owner's inbox (address configured via the access key, not shown on the site).
- Added an AJAX submit handler with an inline success/error message (no off-site redirect), a honeypot spam field, and page-specific email subject lines (general / lessons / wedding).
- Removed the public email address; the contact form is now the only contact path.

### Real media
- Replaced the Unsplash gallery placeholders with real photos.
- Added a country-western video showcase on the lessons page (social-floor clip plus a UCWDC competition clip).
- Added two competition photos to the lessons showcase: 1st Place, Advanced Two-Step (Jack & Jill and Strictly), Ask Me To Dance Wild West Competition, Cedar Park, TX.
- Added the Dancing with the Stars Austin lift photo to the home About section.

### Copy & voice
- Audited and rewrote AI-sounding marketing copy site-wide (removed "perfectly crafted", "unforgettable", "magical", "made it my mission", "create something beautiful", filler "actually", rule-of-three triads, and similar) in favor of a plainer, first-person voice.
- Added a project voice guide (`CLAUDE.md`) with a banned-words list to keep future copy human.
- Removed all em dashes and en dashes everywhere (visible copy, code comments, and the price metadata).

### Pricing
- Simplified the pricing block on the lessons and weddings pages to a single "starting at $90 / 45 min" anchor; dropped the second "$120 / hour" figure so rates can flex by location without committing to a hard number on the page.

### SEO & technical
- Added canonical URLs, Open Graph and Twitter Card meta, a favicon, and JSON-LD `DanceSchool` structured data across pages.
- Added a gallery lightbox and lazy-loading / async decoding on images.
- Removed a stray nested git repo from the project root.

## 2026-06-09

### Rebrand & restructure
- Rebranded from **First Dance by Nolan** to **Dance by Nolan** (dancebynolan.com), broadening focus beyond weddings to dance lessons for beginners and the dance-curious.
- Restructured the single-page site into a **multi-page site** with shared nav, footer, and styles:
  - `index.html`: new split-path landing page (Wedding First Dance vs. Dance Lessons), leading with approachability and DWTS Austin credibility.
  - `wedding-services.html`: wedding first-dance page (reuses the prior single-page wedding content: how-it-works, testimonials, gallery, FAQ, pricing, contact). `firstdancebynolan.com` forwards here.
  - `lessons.html`: new general lessons page for beginners across genres; country-western framed for both beginners and experienced/social dancers (Nolan competed at top levels in country).
- Extracted shared CSS into `styles.css` and shared JS into `main.js`, reused across all pages for consistency.
- Added consistent top nav across all pages: Home · Weddings · Lessons · About · Contact, plus a footer nav.

### Added
- **Dancing with the Stars Austin** credential surfaced across all pages (About, hero, "As Featured In").
- Split-path cards component on the home page.
- Genre cards component (Ballroom / Country / Swing) on the lessons page, with skill-level tags.
- Beginner-focused lessons copy, FAQ, and testimonials; lesson-style and interest selectors in contact forms.
- `README.md` documenting structure, design system, and the registrar-level redirect.

### Changed
- Logo and copy updated from "First Dance by Nolan" to "Dance by Nolan" on the home and lessons pages; the wedding page keeps wedding-first-dance language.
- Pricing ($90/45min, $120/hr), lesson formats (In-Home / Studio / Virtual), inclusive LGBTQ+ language, and the contact form carried across all relevant pages.

### Domain
- Switched the live GitHub Pages domain to `dancebynolan.com` (`CNAME` updated).
- `firstdancebynolan.com` now URL-forwards to `dancebynolan.com`, configured at the **domain registrar** (not in code; GitHub Pages can't do a true cross-domain redirect).

---

## 2026-02-28

### Added
- Initial website launch with single-page design
- Custom domain setup (firstdancebynolan.com)
- Hero section with background video (Pexels stock footage)
- About section with Nolan's headshot (black & white filter)
- "How It Works" section with 3-step process
- Testimonials section with 4 placeholder reviews
- Photo gallery with Unsplash placeholder images
- FAQ accordion section with 6 common questions
- Pricing section ($90/45min or $120/hr)
- Contact form (Formspree integration pending)
- "As Featured In" section (The Knot, WeddingWire, Brides of Austin)
- LGBTQ+ friendly badge in pricing section
- Inclusive language throughout site

### Features
- Mobile-responsive design
- Smooth scroll navigation
- Scroll progress bar
- Fade-in animations on scroll
- Active nav link highlighting
- Mobile hamburger menu

### Lesson Formats
- In-Home lessons
- Studio lessons (partner studios across Austin)
- Virtual lessons (worldwide)

### Design
- Wedding-elegant color palette (gold accent #c9a87c)
- Cormorant Garamond + Montserrat typography
- Lucide SVG icons (no emojis)
- Grayscale headshot styling

### Content Updates
- Removed em dashes for more natural tone
- Softened inclusive language in About section
- Added "safe and comfortable" language to Jen & Alyssa testimonial

---

## Pending Tasks
- [x] ~~Set up contact form~~ (done: Web3Forms, all pages)
- [x] ~~Replace gallery images with real photos~~ (done)
- [ ] Add a phone number to the contact section (currently form-only, no public email)
- [x] ~~Add a testimonial submission form~~ (done: Web3Forms, lessons + weddings pages)
- [ ] Replace seeded/illustrative testimonials with real client reviews as the form collects them
- [ ] Swap the hero background video for original footage (currently Pexels stock)
- [x] ~~Confirm `og-image.jpg` reflects the Nolan Wayne Dance brand~~ (done 2026-09-21: `make_og_image.py`)
