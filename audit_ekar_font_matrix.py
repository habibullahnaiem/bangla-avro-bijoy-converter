from PIL import Image, ImageDraw, ImageFont

fonts = [
    "/home/ubuntu/webdev-static-assets/SutonniMJ.ttf",
    "/home/ubuntu/webdev-static-assets/SutonnyMJ_original.ttf",
    "/home/ubuntu/webdev-static-assets/SutonnyMJ_genuine.ttf",
    "/home/ubuntu/webdev-static-assets/SutonnyMJ_danDi_v2.ttf",
    "/home/ubuntu/webdev-static-assets/SutonnyMJ_mark_v3.ttf",
]
label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 19)
img = Image.new("RGB", (1200, 5 * 120), "white")
draw = ImageDraw.Draw(img)
for row, path in enumerate(fonts):
    font = ImageFont.truetype(path, 64)
    name = path.rsplit("/", 1)[-1]
    y = row * 120
    draw.text((18, y + 15), name, font=label, fill="black")
    draw.text((420, y + 5), "†ij   ‡ij   G", font=font, fill="black")
img.save("/home/ubuntu/bangla-avro-bijoy-converter/ekar_font_matrix.png")
print("saved ekar_font_matrix.png")
