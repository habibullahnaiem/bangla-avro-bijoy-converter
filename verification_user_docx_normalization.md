# User DOCX Indent-Font Fix Verification

## Evidence used

The user-provided file `CH01PRFD_bijoy(1).docx` was inspected directly. Its first affected paragraph had both `w:ind` and a paragraph-level `w:pPr/w:rPr/w:rFonts w:cs="Times New Roman"` rule. Word had also left mixed direct-run metadata after font changes: `ascii`, `hAnsi`, and `cs` were Times New Roman while `eastAsia` was SutonnyMJ. This explains why the indented text no longer returned through the same font path as an ordinary paragraph.

## Implemented behavior for newly converted DOCX

Converted DOCX files now deliberately flatten all source indented/list paragraphs into **true normal paragraphs**. They have no `w:ind`, `w:numPr`, list-style paragraph identity, or paragraph-level font/language/size override. The intentional trade-off is that original visual indentation is removed; this follows the user's request that indented content behave like normal paragraphs.

Every SutonnyMJ Bijoy run now receives direct four-slot font mapping, a complex-script flag, complex-script hint, and Bengali language metadata in all Word language slots. English runs remain Times New Roman and two points smaller.

## Automated checks passed

| Check | Result |
|---|---|
| TypeScript | Passed |
| Production build | Passed |
| Core conversion audit | 8/8 passed |
| E-kar audit | 6/6 passed |
| R-fola audit | 12/12 passed |
| DOCX 14/12 default and 10/8, 16/14, 18/16 variants | Passed |
| Residual `w:ind`, `w:numPr`, list style, or paragraph font override in fixture | None |
| Desktop and mobile converter smoke test | Passed |

## Scope

The original uploaded document is already saved with a mixed Times New Roman/SutonnyMJ mapping and cannot be repaired reliably from the web converter. The correction applies to **new DOCX files converted after this version**. A final live Microsoft Word check of a newly converted document remains advisable because Word's font-picker behavior cannot be executed in the sandbox.
