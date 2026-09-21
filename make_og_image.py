"""Builds og-image.jpg (1200x630), the link-preview image for every page.

Same look as the home hero: the country shoot portrait, black type on the
bright window light, "Dance" in brass. Run from the repo root:

    python3 make_og_image.py
"""
from PIL import Image, ImageDraw, ImageFont, ImageOps

SRC = "assets/nolan-hero.jpg"
OUT = "og-image.jpg"
W, H = 1200, 630

NOIR = (11, 11, 11)
BONE = (241, 233, 219)
BRASS_DEEP = (138, 106, 60)


def fraunces(size, wght=400, opsz=144):
    f = ImageFont.truetype("fonts/Fraunces.ttf", size)
    f.set_variation_by_axes([opsz, wght, 0, 0])
    return f


def mont(size, wght=500):
    f = ImageFont.truetype("fonts/Montserrat.ttf", size)
    f.set_variation_by_axes([wght])
    return f


def tracked(draw, x, y, text, fnt, fill, tracking):
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking


# Photo at full width, cropped to hat, face and shoulders
photo = ImageOps.exif_transpose(Image.open(SRC)).convert("RGB")
photo = photo.resize((W, round(photo.height * W / photo.width)), Image.LANCZOS)
card = photo.crop((0, 150, W, 150 + H)).convert("RGBA")

# Bone wash on the left so the type sits clean over the window bars
wash = Image.new("RGBA", (W, H))
wd = ImageDraw.Draw(wash)
for x in range(W):
    t = x / W
    if t < 0.19:
        a = 0.93 - (0.93 - 0.72) * (t / 0.19)
    elif t < 0.36:
        a = 0.72 * (1 - (t - 0.19) / 0.17)
    else:
        a = 0
    wd.line([(x, 0), (x, H)], fill=BONE + (round(a * 255),))
card = Image.alpha_composite(card, wash).convert("RGB")

d = ImageDraw.Draw(card)
x = 72
tracked(d, x, 92, "AUSTIN, TEXAS", mont(17), NOIR, 5)
head = fraunces(86)
d.text((x - 4, 128), "Nolan", font=head, fill=NOIR)
d.text((x - 4, 210), "Wayne", font=head, fill=NOIR)
d.text((x - 4, 292), "Dance", font=head, fill=BRASS_DEEP)
d.line([(x, 452), (x + 44, 452)], fill=BRASS_DEEP, width=2)
tracked(d, x, 474, "NOLANWAYNEDANCE.COM", mont(15), NOIR, 3)

card.save(OUT, quality=86, optimize=True, progressive=True)
print("wrote", OUT, card.size)
