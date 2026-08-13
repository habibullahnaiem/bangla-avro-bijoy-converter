from fontTools.ttLib import TTFont

path = "/home/ubuntu/webdev-static-assets/SutonnyMJ_danDi_v2.ttf"
font = TTFont(path)
cmap = {}
for table in font["cmap"].tables:
    cmap.update(table.cmap)

for cp in [0x2020, 0x2021, 0x2022, 0x2023, 0x2024, 0x2025, 0x2026, 0x2027, 0x2028, 0x2029, 0x202A, 0x202B, 0x202C, 0x202D, 0x202E, 0x202F, 0x2030, 0x2031, 0x00A0, 0x008D, 0x008E, 0x0090]:
    print(f"U+{cp:04X}", repr(chr(cp)), cmap.get(cp))

target_names = {cmap.get(0x2020), cmap.get(0x2021)}
for cp, name in sorted(cmap.items()):
    if name in target_names:
        print("same-glyph", f"U+{cp:04X}", repr(chr(cp)), name)
