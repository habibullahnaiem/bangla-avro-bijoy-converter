from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

# Render the exact reference output string with our webfont
s = "GUv ‡K`vi ‡g‡b ‡b‡e| ïiæi G Kvi|"
font = ImageFont.truetype("/home/ubuntu/webdev-static-assets/SutonnyMJ_danDi_0e300e15.ttf", 48)
W, H = 1200, 140
img = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(img)
d.text((20, 20), s, font=font, fill="black")
img.save("/home/ubuntu/ref_render.png")

# Compare with the original (unpatched) SutonnyMJ.ttf if available
import glob
for p in glob.glob("/home/ubuntu/**/SutonnyMJ*.ttf", recursive=True):
    print("found:", p)
