# DOCX Indent Normalization Verification

The converter now keeps indentation in `w:pPr/w:ind` and removes only paragraph-level `w:rPr` font and size overrides from indented paragraphs. Direct Bengali runs continue to carry explicit `SutonnyMJ` metadata, while English runs retain `Times New Roman` and the existing two-point size relationship.

The verified checks passed on 2026-08-14: TypeScript compilation, the production build, the 8-case core conversion audit, the 6-case word-initial e-kar audit, the 12-case r-fola audit, and the DOCX edit-stability audit. The DOCX audit also confirms zero paragraph font overrides and zero misplaced indentation in the converted and simulated-indent files, including 10/8, 14/12, 16/14, and 18/16 point size scenarios.

The desktop preview remains visually intact, with the existing dark teal AvroJoy hero, Shahid Minar artwork, converter toolbar, and install prompt rendered correctly. The narrow mobile preview remains responsive; the hero, direction controls, converter tabs, and install prompt fit the viewport without horizontal clipping in the captured view.
