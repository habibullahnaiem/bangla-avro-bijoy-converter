# Word-initial e-kar audit findings

The reported subtle word-initial e-kar appearance was reproduced with the focused SutonnyMJ probe. The expected code sequence remains `রেল → †ij`, and the rendered probe shows the matra-less `†` glyph positioned before the first consonant as intended by the current SutonnyMJ encoding.

The focused round-trip cases (`এখনই`, `এটি`, `এবং`, `একা`, `রেল এখনই আসবে`, and `এখনই রেল`) pass. The main regression suite also passes 8/8, including the explicit `রেল → †ij` and repeated word-initial e-kar expectations. No safe display-only offset was identified that would improve the subtle visual appearance without risking the already-correct mid-word `‡` e-kar, conjunct, ঋ/ৃ-কার, or punctuation rendering. Therefore no converter or CSS change was applied.

Desktop and mobile smoke screenshots confirm the current stable layout remains unchanged.
