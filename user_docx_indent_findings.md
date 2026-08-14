# Evidence from `CH01PRFD_bijoy(1).docx`

The user-provided DOCX contains 144 paragraphs, including 34 indented/list-style candidates. This file is the source of truth for the current issue.

## First affected indented paragraph

The first affected paragraph is document paragraph index 3. Its paragraph properties include a direct indentation (`w:ind w:left="600" w:right="600"`) and a paragraph-level run property containing only `w:rFonts w:cs="Times New Roman"`.

Its affected Bijoy text runs show that Word has written mixed font properties: `w:ascii="Times New Roman"`, `w:hAnsi="Times New Roman"`, and `w:cs="Times New Roman"`, while `w:eastAsia="SutonnyMJ"` remains. Later runs that were apparently re-selected as SutonnyMJ only retain `eastAsia`/`cs` SutonnyMJ hints, without an explicit `ascii` or `hAnsi` SutonnyMJ mapping.

## Confirmed resolution strategy

Legacy Bijoy bytes are ASCII code points. The uploaded file confirms that Word is treating the affected run as ASCII/Latin when it applies a font change; reselecting SutonnyMJ is not restoring the `ascii`/`hAnsi` mapping. The generated run metadata currently sets `w:lang w:bidi="bn-BD"` but not `w:lang w:val="bn-BD"` or `w:eastAsia="bn-BD"`. The next targeted experiment is to mark each Bijoy run as Bengali across all language fields and force complex-script formatting, then inspect the generated XML and regression results.

The converter now does the following for **newly converted DOCX files**:

1. Removes all existing `w:ind` and `w:numPr` from source paragraphs, deliberately flattening them to true normal paragraph layout.
2. Removes paragraph-level `rFonts`, `rStyle`, `lang`, `sz`, and `szCs` overrides in every paragraph, preventing a residual Times New Roman paragraph rule from competing with direct Bijoy runs.
3. Marks each SutonnyMJ run with all four font mappings, `w:hint="cs"`, `w:cs`, and Bengali language values in `val`, `eastAsia`, and `bidi`.

The targeted DOCX regression now asserts zero residual indent/list metadata, zero paragraph-level font overrides, complete Bengali language metadata, and the existing 14/12, 10/8, 16/14, and 18/16 size-pair cases. TypeScript, production build, core conversion (8/8), e-kar (6/6), r-fola (12/12), and DOCX audits passed after this change.

## Constraint

No automatic change can reinterpret Bijoy bytes as Unicode after the user has saved them under another font. The objective is to make Word select and restore SutonnyMJ correctly from the beginning, especially for indented text, without altering the stored Bijoy sequence.
