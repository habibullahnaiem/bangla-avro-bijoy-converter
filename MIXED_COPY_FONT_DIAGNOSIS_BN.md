# Mixed Bangla–English rich-copy diagnosis

**Status:** তদন্ত চলছে; production behaviour এখনও বদলানো হয়নি।

## User-supplied screenshot evidence

The first 763×174 screenshot was inspected in two overlapping left-to-right crops. The red-boxed English run does not appear as `Bangla`; it appears as Bengali-shaped legacy glyphs. That is consistent with the underlying Latin letters being pasted into a SutonnyMJ/legacy Bengali font context, not with the English text being removed by Unicode conversion.

The proposed correction must therefore change only the emitted clipboard HTML font boundaries: Bengali Bijoy bytes must retain `SutonnyMJ`, while English/number runs must carry an explicit Times New Roman family that Word preserves after paste. Plain-text clipboard data and all converter mapping logic must remain unchanged.

The second screenshot was likewise inspected in two overlapping crops. Its split converter preview shows the English word `Bangla` correctly as Latin on both the Unicode side and the SutonnyMJ output side. This distinguishes the defect: **preview segmentation is already correct; rich clipboard HTML is not carrying a sufficiently Word-compatible English font boundary into the paste destination.**

## Second implementation diagnosis

The first fix placed `text/html` directly into an async `ClipboardItem`. The user confirmed that their Word/Office paste destination still did not honour the nested English font run. The adopted second approach therefore prefers the browser's user-initiated native `copy` event over a selected DOM fragment, while explicitly setting `text/html` and `text/plain` in that event. Microsoft documents that its HTML clipboard format carries an HTML fragment and its surrounding context, while browser-native copy is the normal route to produce that host clipboard format. [1] The existing async `ClipboardItem` path remains only as fallback.

Each Bengali and English run continues to carry explicit CSS and Office font aliases. The revised HTML also adds a legacy `<font face>` boundary because Word destinations can retain presentational font elements where nested CSS is selectively ignored. This remains confined to the text-converter rich-copy path; no converter mapping, plain-text payload, preview or DOCX/TXT output changed.

## Reference

[1]: https://learn.microsoft.com/en-us/windows/win32/dataxchg/html-clipboard-format "Microsoft: HTML Clipboard Format"
