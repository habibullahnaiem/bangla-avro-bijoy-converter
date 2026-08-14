# User-reported punctuation-adjacent glyph issue

## Evidence received

The user reported that, in addition to the unresolved DOCX indent behavior, an **ঋ/ৃ-কার-like stray glyph sometimes appears after a Bengali dari (`।`)**. The user attached `pasted_file_9rgDW7_image.png` on 2026-08-15.

The supplied image is a small 107×145 pixel crop. It visibly marks the punctuation-adjacent region with a red arrow, but the complete source word and original Unicode text are not readable reliably from the crop. No source text must be inferred from this image alone.

## Required reproduction evidence

Before a production code change, reproduce the exact sequence using either the original Unicode phrase, the generated Bijoy text, or a DOCX that contains the affected word. Audit punctuation boundaries around `।`, U+09C3 (ৃ-কার), the current `preMapPunctuation` U+09C3 handling, and the word-aware token split.

## Word-DOCX inspection result

The user confirmed that the image comes from **Word DOCX**, not the website preview. The second provided DOCX was scanned for paragraphs whose stored Bijoy text includes a dari (`|`) followed by an ঋ/ৃ-কার marker (`„`) nearby. The recovered Unicode text for those paragraphs round-tripped correctly, including phrases such as `আর্থ-সামাজিক`, `প্রেক্ষাপট`, `পূর্বসূরিদের`, and `সৃষ্টির` after earlier sentences containing `।`.

The relevant Bijoy marker runs were explicitly assigned **SutonnyMJ**, not Times New Roman. Therefore, the converter has not yet reproduced a wrong raw Bijoy sequence or a punctuation-only run classified as English. The remaining hypothesis is a Word layout/font-rendering issue that requires either the exact original Unicode phrase associated with the screenshot or a Word-generated document where that paragraph and cursor/selection state can be matched.

## Exact Word-DOCX finding and correction

The user supplied the affected Bijoy paragraph. The glyph immediately after the Dari was not the word-initial e-kar marker `†`. The stored Word sequence was `| …Iw` — a Dari, a space, a literal U+2026 ellipsis, then the Bijoy code for `ওদিকে`.

The DOCX pipeline previously did not classify a standalone U+2026 source run as Bengali punctuation. It could therefore remain as Unicode while inheriting SutonnyMJ context, which renders it as a glyph resembling a stray ঋ/ৃ-কার. U+2026 is now treated as punctuation and normalized to three literal dots before DOCX font assignment. The permanent DOCX audit includes `টাকার দিকে।` + standalone `…` + `ওদিকে তাকিয়ে` and rejects output XML that still contains U+2026.

## Related user files

## Footnote and endnote investigation

Both user-provided DOCX files contain **30 real endnote references** in `word/document.xml` and 30 matching note bodies in `word/endnotes.xml` (IDs 1–30). They contain no real footnote references or footnote bodies; `word/footnotes.xml` has only Word's mandatory separator entries. This strongly supports the user's new hypothesis that a visible special mark was mistaken for ordinary indentation.

The converter already sends both `word/document.xml` and `word/endnotes.xml` through the text-conversion pipeline. The special reference runs have no `<w:t>` text node and therefore need dedicated regression coverage.

Direct inspection confirmed the causal difference: a user-saved endnote reference run retained a mixed mapping where `ascii`, `hAnsi`, and `eastAsia` were SutonnyMJ but the complex-script `cs` slot remained Times New Roman. The associated note body follows `EndnoteText`, while the reference follows the `EndnoteReference` character style. This is distinct from an ordinary Bengali text run and is a credible source of the reported Word-only font-change failure.

| File | Purpose |
|---|---|
| `/home/ubuntu/upload/CH01PRFD_bijoy(1).docx` | First Word-saved font-switch failure, including indented paragraphs. |
| `/home/ubuntu/upload/CH01PRFD_bijoy(2).docx` | Second Word-saved failure after the global metadata experiment. |
| `/home/ubuntu/upload/pasted_file_9rgDW7_image.png` | Small visual report of the punctuation-adjacent glyph. |
