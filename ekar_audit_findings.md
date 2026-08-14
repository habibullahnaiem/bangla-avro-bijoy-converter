# Word-initial e-kar audit findings

The reported subtle word-initial e-kar appearance was reproduced with the focused SutonnyMJ probe. The expected code sequence remains `রেল → †ij`, and the rendered probe shows the matra-less `†` glyph positioned before the first consonant as intended by the current SutonnyMJ encoding.

The focused round-trip cases (`এখনই`, `এটি`, `এবং`, `একা`, `রেল এখনই আসবে`, and `এখনই রেল`) pass. The main regression suite also passes 8/8, including the explicit `রেল → †ij` and repeated word-initial e-kar expectations. No safe display-only offset was identified that would improve the subtle visual appearance without risking the already-correct mid-word `‡` e-kar, conjunct, ঋ/ৃ-কার, or punctuation rendering. Therefore no converter or CSS change was applied.

Desktop and mobile smoke screenshots confirm the current stable layout remains unchanged.

## 2026-08-14 glyph-level optical comparison

The supplied reference was measured at 351×257 px. Its red annotation box spans
approximately x=55–98 and y=66–139; the dark ink inside that box spans the full
annotated height, confirming that the comparison target is the word-initial
matra-less e-kar marker’s relationship to the first consonant rather than a
conversion-code error.

The controlled SutonnyMJ probe showed that a very small display-only adjustment
is safe when scoped to U+2020 (`†`) alone. The live rich renderer now wraps only
that marker in `bijoy-ekar-initial` and applies `left: 0.02em` and `top: 0.018em`
with relative positioning. The Bijoy string remains `†ij`; mid-word U+2021 (`‡`),
U+201E ঋ/ৃ-কার, conjuncts, copy text, and print output code sequences are not
changed.

Focused e-kar cases, the 8/8 main audit, ঋ/ৃ-কার round-trip diagnostics,
TypeScript, and production build pass after the optical adjustment.
