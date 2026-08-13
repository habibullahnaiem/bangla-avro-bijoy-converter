from PIL import Image, ImageDraw, ImageFont

font_path = "/home/ubuntu/webdev-static-assets/SutonnyMJ_danDi_v2.ttf"
font = ImageFont.truetype(font_path, 72)
label_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
img = Image.new("RGB", (1000, 360), "white")
draw = ImageDraw.Draw(img)
rows = [
    ("standalone G", "G"),
    ("standalone †", "†"),
    ("standalone ‡", "‡"),
    ("word-start †ij", "†ij"),
    ("word-start ‡ij", "‡ij"),
    ("mid-word K‡i‡Q", "K‡i‡Q"),
    ("mid-word K†i†Q", "K†i†Q"),
]
for i, (label, sample) in enumerate(rows):
    y = 18 + i * 82
    draw.text((25, y + 14), label, font=label_font, fill="black")
    draw.text((360, y), sample, font=font, fill="black")
img.save("/home/ubuntu/bangla-avro-bijoy-converter/ekar_render_probe.png")
print("saved ekar_render_probe.png")
