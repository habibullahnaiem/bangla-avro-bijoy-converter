from fontTools.ttLib import TTFont

font = TTFont("/home/ubuntu/webdev-static-assets/SutonnyMJ_danDi_v2.ttf")
cmap = {}
for table in font["cmap"].tables:
    cmap.update(table.cmap)
for cp in range(0x80, 0x100):
    name = cmap.get(cp)
    if name:
        print(f"U+{cp:04X} {chr(cp)!r} {name}")
