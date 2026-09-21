# Nolan Wayne Dance

Marketing website for **Nolan Wayne Dance**, beginner-friendly dance instruction in
Austin, TX by Nolan Wayne (of *Dancing with the Stars Austin*). The site serves two
audiences: wedding couples planning a first dance, and beginners or dance-curious folks
who want private lessons in Ballroom, Country, Swing, and more.

Formerly *Dance by Nolan* (and originally *First Dance by Nolan*).

Static HTML/CSS/JS, hosted on GitHub Pages. No build step.

## Structure

This is a multi-page site sharing one stylesheet and one script for a consistent look.

| File                    | Purpose |
|-------------------------|---------|
| `index.html`            | **Home / landing.** Full-bleed country shoot portrait hero (scrolls down the photo into black), then a two-path band sending visitors to Weddings or Lessons. Leads with approachability + DWTS Austin credibility. |
| `wedding-services.html` | **Weddings.** The wedding first-dance page (how-it-works, testimonials, gallery, wedding FAQ, pricing, contact). |
| `lessons.html`          | **Lessons.** General, beginner-focused lessons across genres. Country also serves experienced/social dancers (Nolan competed at top levels in country-western). |
| `styles.css`            | Shared styles for all pages (palette, typography, components). |
| `main.js`               | Shared interactions (mobile menu, scroll progress, fade-ins, FAQ accordion, smooth scroll, contact + testimonial form handler). |
| `assets/`               | Images and video (hero + headshot from `assets/Country Shoot/`, wedding/lesson photos, competition photos, country-western clips). |
| `og-image.jpg`          | Link-preview image for every page. Rebuild with `python3 make_og_image.py`. |
| `CNAME`                 | GitHub Pages custom domain (`nolanwaynedance.com`). |

The repo root also holds off-site **promo graphics** for Instagram/Facebook + the website (`promo-{country,wedding,lessons,social}.jpg` plus `-9x16` story versions), captions in `social-captions.md`. For Facebook Marketplace, use the plain listing `marketplace-listing-wedding.md` with a real photo (and the de-flagged `marketplace-wedding-safe.jpg` as a second image), not the branded cards. None of these are part of the website.

### Shared design system
- **Palette:** Country Noir. Mostly black (`#0b0b0b`) and white, with brass
  (`#b8955e`) as the only accent, all pulled from the country shoot photo. Noir is
  the default theme; light is opt-in via the nav toggle. Tokens live at the top of
  `styles.css`.
- **Type:** Fraunces (headings) + Montserrat (body).
- **Components:** hero, cards, testimonials, pricing, lesson formats, inclusive
  (LGBTQ+ friendly) badge, "As Featured In", FAQ accordion, contact form.
- **Nav (every page):** Home · Weddings · Lessons · About · Contact.

## Domains & redirect

- **Primary brand domain:** `nolanwaynedance.com`. This is the live GitHub Pages
  domain; see `CNAME`.
- **Forwarding domains:** `dancebynolan.com` and `firstdancebynolan.com` both
  URL-forward to `nolanwaynedance.com` (configured at the registrar). ✅ Live.

> ⚠️ **The legacy forwards are configured at the domain registrar (URL forwarding),
> NOT in this repo.** GitHub Pages can't do a true cross-domain redirect, so there is
> intentionally no redirect code here.

## Local preview

Open any page directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Pending tasks
- [x] Point the brand domain DNS at GitHub Pages and update `CNAME` (now `nolanwaynedance.com`).
- [x] Configure `dancebynolan.com` and `firstdancebynolan.com` forwards at the registrar.
- [x] Wire up the contact form (Web3Forms; form-only, no public email).
- [x] Regenerate `og-image.jpg` to reflect the Nolan Wayne Dance brand (`make_og_image.py`).
- [ ] Add a phone number to the contact sections (currently form-only).
- [ ] Replace seeded/illustrative testimonials with real reviews as the form collects them.
- [ ] Swap the stock hero background video for original footage.
