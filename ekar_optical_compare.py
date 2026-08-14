"""Deterministic pixel measurements for the supplied word-initial e-kar reference.

This diagnostic does not alter converter output. It reports the red annotation box,
the dark ink bounds inside it, and the existing SutonnyMJ probe dimensions so a
display-only correction can be evaluated without changing Bijoy code sequences.
"""

from pathlib import Path

from PIL import Image


REFERENCE = Path("/home/ubuntu/upload/pasted_file_oBKqER_image.png")
PROBE = Path("/home/ubuntu/bangla-avro-bijoy-converter/ekar_render_probe.png")


def bounds_for(image: Image.Image, predicate):
    pixels = image.convert("RGB")
    points = []
    for y in range(pixels.height):
        for x in range(pixels.width):
            if predicate(pixels.getpixel((x, y))):
                points.append((x, y))
    if not points:
        return None
    xs = [point[0] for point in points]
    ys = [point[1] for point in points]
    return min(xs), min(ys), max(xs), max(ys), len(points)


def main() -> None:
    reference = Image.open(REFERENCE)
    probe = Image.open(PROBE)

    red = bounds_for(
        reference,
        lambda rgb: rgb[0] > 180 and rgb[1] < 110 and rgb[2] < 110,
    )
    dark_inside_red = None
    if red:
        left, top, right, bottom, _ = red
        crop = reference.crop((left, top, right + 1, bottom + 1))
        dark_inside_red = bounds_for(
            crop,
            lambda rgb: max(rgb) < 120,
        )

    dark_reference = bounds_for(
        reference,
        lambda rgb: max(rgb) < 120,
    )
    dark_probe = bounds_for(
        probe,
        lambda rgb: max(rgb) < 120,
    )

    print(f"reference_size={reference.size}")
    print(f"reference_red_box={red}")
    print(f"reference_dark_bounds={dark_reference}")
    print(f"dark_ink_inside_red_box={dark_inside_red}")
    print(f"probe_size={probe.size}")
    print(f"probe_dark_bounds={dark_probe}")


if __name__ == "__main__":
    main()
