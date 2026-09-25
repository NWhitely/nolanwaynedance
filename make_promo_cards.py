#!/usr/bin/env python3
"""
Branded promo cards for Instagram / Facebook feed + the website.

Rebuilds all eight: four 1080x1080 squares and four 1080x1920 stories.
NOT for Facebook Marketplace (the URL, @handle and "FREE" button trip the
off-platform-ad classifier). For Marketplace use marketplace-listing-wedding.md
with a real photo, plus marketplace-wedding-safe.jpg as a second image.

House rules baked in here:
  - the price and any dated promo stay OFF the art, so the cards never expire
  - no "As seen on Dancing with the Stars Austin" (with no room to explain it,
    a stranger reads it as the TV show); proof is the credential line instead

Run:  python3 make_promo_cards.py
Out:  promo-{lessons,wedding,country,social}.jpg and -9x16.jpg
"""
from PIL import Image, ImageDraw, ImageFont, ImageOps

W = 1080
SQ, TALL = 1080, 1920

BRASS = (184, 149, 94)
BRASS_LIGHT = (214, 187, 140)
WHITE = (245, 242, 236)
DARK = (26, 21, 18)

DOMAIN = "nolanwaynedance.com"
HANDLE = "@n.wayne_"
CRED = "16+ YEARS TEACHING & COMPETING"
EYEBROW = "NOLAN WAYNE   ·   AUSTIN, TX"
CTA = "Book a FREE Introductory Lesson"

FRAUNCES = "fonts/Fraunces.ttf"
MONTSERRAT = "fonts/Montserrat.ttf"


def fraunces(size, wght=470, opsz=144):
    f = ImageFont.truetype(FRAUNCES, size)
    f.set_variation_by_axes([opsz, wght, 0, 0])
    return f


def mont(size, wght=500):
    f = ImageFont.truetype(MONTSERRAT, size)
    f.set_variation_by_axes([wght])
    return f


def cover(im, w, h, bias=0.5):
    """Scale to cover, cropping to the given vertical bias (0 top, 1 bottom)."""
    iw, ih = im.size
    scale = max(w / iw, h / ih)
    nw, nh = round(iw * scale), round(ih * scale)
    im = im.resize((nw, nh), Image.LANCZOS)
    left = (nw - w) // 2
    top = round((nh - h) * bias)
    return im.crop((left, top, left + w, top + h))


def tracked(d, y, text, fnt, fill, tracking, cx, bottom=False):
    """Letterspaced, centred on cx. y is the top edge, or the bottom if asked."""
    widths = [d.textlength(c, font=fnt) for c in text]
    x = cx - (sum(widths) + tracking * (len(text) - 1)) / 2
    if bottom:
        y -= fnt.getbbox(text)[3]
    for c, cw in zip(text, widths):
        d.text((x, y), c, font=fnt, fill=fill)
        x += cw + tracking


def fit(text, maxw, start, minimum=60):
    """Largest Fraunces size that keeps the headline on one line."""
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    size = start
    while size > minimum and probe.textlength(text, font=fraunces(size)) > maxw:
        size -= 2
    return fraunces(size)


def diamond(d, y, cx, half=70):
    d.line([cx - half, y, cx - 14, y], fill=BRASS, width=2)
    d.line([cx + 14, y, cx + half, y], fill=BRASS, width=2)
    d.polygon([(cx, y - 7), (cx + 7, y), (cx, y + 7), (cx - 7, y)], fill=BRASS)


def pill(d, cy, cx, text):
    f = mont(31, 700)
    tw = d.textlength(text, font=f)
    w, h = tw + 96, 78
    d.rounded_rectangle([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2],
                        radius=h / 2, fill=BRASS_LIGHT)
    d.text((cx, cy), text, font=f, fill=DARK, anchor="mm")


def backdrop(src, w, h, bias):
    base = cover(ImageOps.exif_transpose(Image.open(src)).convert("RGB"), w, h, bias)
    # darken top and bottom for type, then a gentle global dim
    col = Image.new("L", (1, h), 0)
    for y in range(h):
        top_edge = max(0.0, 1 - y / (h * 0.34)) ** 1.5
        bot_edge = max(0.0, (y - h * 0.70) / (h * 0.30)) ** 1.5
        col.putpixel((0, y), int(155 * min(1.0, 0.42 + 0.58 * (top_edge + bot_edge))))
    base = Image.composite(Image.new("RGB", (w, h), (8, 7, 6)),
                           base, col.resize((w, h)))
    return Image.blend(base, Image.new("RGB", (w, h), (10, 9, 8)), 0.18)


CARDS = {
    "lessons": dict(
        photo="assets/photo5.jpg", bias=0.35,
        headline="Dance Lessons",
        sub="Beginner-friendly lessons & wedding first dances",
        styles="WEDDING  ·  BALLROOM  ·  COUNTRY  ·  SWING",
        who="for individuals & couples, no experience needed",
    ),
    "wedding": dict(
        photo="assets/photo1.jpg", bias=0.3,
        headline="Wedding Dance Lessons",
        sub="Custom choreography, built around your song",
        styles="WALTZ  ·  COUNTRY  ·  SWING  ·  SLOW DANCE",
        who=None,
    ),
    "country": dict(
        photo="assets/CountryBarJnJ.JPG", bias=0.5,
        headline="Country Dance Lessons",
        sub="Learn to two-step before your next night out",
        styles="TWO-STEP  &  COUNTRY SWING",
        sub_styles=["Two-Step · Triple Two-Step · Nightclub Two-Step · Polka",
                    "Waltz · Cha Cha · East Coast Swing · West Coast Swing"],
        who="for singles & couples, no experience needed",
        credit=["Photo: Ask Me To Dance Wild West Comp · Cedar Park, TX",
                "1ST PLACE · ADVANCED TWO-STEP (JACK & JILL)"],
    ),
    "social": dict(
        photo="assets/photo4.jpg", bias=0.4,
        headline="Social Dance Lessons",
        sub="Never too late to start, and a good way to get out",
        styles="BALLROOM  ·  TWO-STEP  ·  SWING  ·  SLOW DANCE",
        who="for couples & singles, no experience needed",
    ),
}


def render(cfg, tall):
    h = TALL if tall else SQ
    base = backdrop(cfg["photo"], W, h, cfg["bias"])
    d = ImageDraw.Draw(base)
    cx = W // 2
    m = 30
    d.rectangle([m, m, W - m - 1, h - m - 1], outline=BRASS, width=2)

    # --- top block
    top = 170 if tall else 96
    tracked(d, top, EYEBROW, mont(27, 600), BRASS_LIGHT, 6, cx)
    head = fit(cfg["headline"], W - 150, 118)
    d.text((cx, top + 72), cfg["headline"], font=head, fill=WHITE, anchor="ma")
    diamond(d, top + 220, cx)
    d.text((cx, top + 256), cfg["sub"], font=mont(30, 450), fill=WHITE, anchor="ma")

    # --- bottom block, laid out upward from the footer
    # footer stack: domain, handle, then either the years line or, on the
    # country card, the photo credit and competition result (two lines, so the
    # whole stack moves up to stay clear of the frame)
    cred_y = h - (245 if tall else 85) - (30 if cfg.get("credit") else 0)
    handle_y = cred_y - 45
    domain_y = handle_y - 55
    d.text((cx, handle_y), HANDLE, font=mont(30, 450), fill=BRASS_LIGHT, anchor="ma")
    d.text((cx, domain_y), DOMAIN, font=fraunces(58, 520), fill=WHITE, anchor="ma")
    if cfg.get("credit"):
        d.text((cx, cred_y), cfg["credit"][0], font=mont(21, 450), fill=(198, 192, 184), anchor="ma")
        tracked(d, cred_y + 32, cfg["credit"][1], mont(21, 600), WHITE, 1, cx)
    else:
        tracked(d, cred_y, CRED, mont(20, 500), (176, 170, 162), 2, cx)

    y = domain_y - 30
    diamond(d, y, cx, half=64)
    if tall:
        y -= 45
    else:
        y -= 62
        pill(d, y, cx, CTA)
        y -= 55
    d.text((cx, y), "in-home, in-studio, or online", font=mont(28, 450), fill=WHITE, anchor="md")
    if cfg.get("who"):
        y -= 46
        d.text((cx, y), cfg["who"], font=mont(28, 450), fill=WHITE, anchor="md")
    for line in reversed(cfg.get("sub_styles") or []):
        y -= 42
        d.text((cx, y), line, font=mont(27, 450), fill=WHITE, anchor="md")
    y -= 56
    # shrink the styles line until it clears the frame on both sides
    size = 38
    while size > 24:
        styles = mont(size, 700)
        if d.textlength(cfg["styles"], font=styles) + 2 * (len(cfg["styles"]) - 1) <= W - 150:
            break
        size -= 1
    tracked(d, y, cfg["styles"], styles, BRASS_LIGHT, 2, cx, bottom=True)
    return base


def main():
    for name, cfg in CARDS.items():
        for tall in (False, True):
            out = f"promo-{name}{'-9x16' if tall else ''}.jpg"
            render(cfg, tall).save(out, quality=92, optimize=True, progressive=True)
            print("wrote", out)


if __name__ == "__main__":
    main()
