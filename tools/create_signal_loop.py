#!/usr/bin/env python3
"""Build a seamless Nocturne Flow promo GIF from open, flowing contour lines."""
from math import pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parents[1] / "assets" / "art" / "signal-loop.gif"
WIDTH, HEIGHT = 720, 270
FRAMES = 36
PALETTE = [(42, 173, 174), (91, 218, 207), (117, 131, 193), (197, 112, 171), (70, 163, 190)]


def mix(a, b, t):
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))


def color_at(t):
    t *= len(PALETTE) - 1
    i = min(len(PALETTE) - 2, int(t))
    return mix(PALETTE[i], PALETTE[i + 1], t - i)


def render_rgb(frame_index):
    phase = 2 * pi * frame_index / FRAMES
    base = Image.new("RGB", (WIDTH, HEIGHT), (7, 10, 14))
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    fine = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gd, fd = ImageDraw.Draw(glow), ImageDraw.Draw(fine)
    x_values = range(-20, WIDTH + 21, 6)
    strands = 36
    for i in range(strands):
        band = (i + 0.5) / strands
        points = []
        for x in x_values:
            nx = x / WIDTH
            y = (band * HEIGHT
                 + 21 * sin(nx * 4.2 + phase + i * 0.19)
                 + 8 * sin(nx * 10.3 - phase + i * 0.12)
                 + (band - 0.5) * 35 * nx)
            points.append((x, round(y)))
        rgb = color_at((i / strands * 0.79 + 0.09 + 0.08 * sin(phase)) % 1)
        alpha = int(112 + 118 * (0.5 + 0.5 * sin(pi * band)))
        gd.line(points, fill=(*rgb, max(28, alpha // 2)), width=12)
        fd.line(points, fill=(*rgb, alpha), width=2 if i % 4 else 3)

    glow = glow.filter(ImageFilter.GaussianBlur(9))
    frame = Image.alpha_composite(base.convert("RGBA"), glow)
    frame = Image.alpha_composite(frame, fine)
    # A fine scan texture, never stars, dots, or orbital particles.
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(0, HEIGHT, 5):
        od.line((0, y, WIDTH, y), fill=(215, 245, 239, 5), width=1)
    return Image.alpha_composite(frame, overlay).convert("RGB")


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    rgb_frames = [render_rgb(i) for i in range(FRAMES)]

    # Build one representative color table from every frame, then apply it
    # to all frames. Per-frame adaptive palettes cause visible color flicker.
    columns = 6
    thumb_w, thumb_h = WIDTH // columns, HEIGHT // columns
    palette_sample = Image.new("RGB", (WIDTH, HEIGHT), (7, 10, 14))
    for i, frame in enumerate(rgb_frames):
        thumb = frame.resize((thumb_w, thumb_h), Image.Resampling.BOX)
        palette_sample.paste(thumb, ((i % columns) * thumb_w, (i // columns) * thumb_h))
    shared_palette = palette_sample.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    indexed_frames = [frame.quantize(palette=shared_palette, dither=Image.Dither.NONE) for frame in rgb_frames]
    indexed_frames[0].save(OUT, save_all=True, append_images=indexed_frames[1:], duration=80, loop=0, optimize=True, disposal=2)
    print(f"Created {OUT} ({OUT.stat().st_size} bytes; {FRAMES} frames; shared palette)")


if __name__ == "__main__":
    main()
