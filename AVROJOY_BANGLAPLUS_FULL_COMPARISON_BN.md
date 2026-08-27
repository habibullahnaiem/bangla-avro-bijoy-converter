# AvroJoy বনাম Bangla.plus: Unicode ↔ Bijoy পূর্ণাঙ্গ পর্যবেক্ষণভিত্তিক প্রযুক্তিগত তুলনা

**প্রতিবেদনের ধরন:** read-only, evidence-based technical comparison  
**পরীক্ষাকাল:** ২৭ আগস্ট ২০২৬  
**পরীক্ষাধীন সাইট:** [AvroJoy][3] এবং [Bangla.plus Bijoy–Unicode Converter][1]  
**পরিবর্তনের অবস্থা:** এই অনুসন্ধানে AvroJoy-এর converter mapping, UI, DOCX/TXT workflow, SEO, CSS অথবা deployment-এ **কোনো পরিবর্তন করা হয়নি**। কেবল এই প্রতিবেদন এবং non-production পরীক্ষার সহায়ক harness হালনাগাদ করা হয়েছে।

## সারসংক্ষেপ

প্রধান সিদ্ধান্তটি দ্বিমুখী। সাধারণ বাংলা বর্ণ, সবচেয়ে ব্যবহৃত কারচিহ্ন, শব্দের শুরু/মাঝের এ-কার, ঋ-কার, রেফ, র-ফলা, বহুল ব্যবহৃত যুক্তবর্ণ এবং ব্যবহারকারীর দেওয়া আটটি সংবেদনশীল শব্দে দুই সাইটের **raw Bijoy sequence হুবহু একই** পাওয়া গেছে। তাই এই বড় অংশে Bangla.plus-এর সঙ্গে মিলিয়ে AvroJoy-এর mapping বদলানোর কোনো প্রযুক্তিগত কারণ নেই।

তবে চারটি বাস্তব আচরণগত পার্থক্য পাওয়া গেছে। সবচেয়ে গুরুত্বপূর্ণ তিনটি হলো `ক্ষ্ন/ক্ষ্ণ`, `ণ্ণ/ণ্ন`, এবং `ত্রূ`-এর Unicode semantic round-trip। Bangla.plus তার নিজের forward output-এ প্রতিটি ক্ষেত্রে এমন legacy representation তৈরি করে যার inverse সব ক্ষেত্রে মূল Unicode বানানে ফেরে না; AvroJoy সংশ্লিষ্ট তিন form-এর জন্য পৃথক, round-trip-preserving representation ব্যবহার করে। আর `॥`-এর জন্য দুই সাইটের legacy convention আলাদা; ফলে এক সাইটের output অন্য সাইটে নেওয়া হলে double-dari বদলে যেতে পারে।

> **সতর্কতা:** Bijoy output একটি font-dependent legacy character sequence। `†i‡L`-এর মতো raw text সাধারণ font-এ Latin/symbol-এর মতো দেখানো স্বাভাবিক; SutonnyMJ-তে সেটি বাংলা glyph হিসেবে রেন্ডার হয়। অতএব byte/character-sequence পার্থক্য মানেই দৃশ্যগত ত্রুটি নয়। এই প্রতিবেদনে raw sequence, Unicode return এবং cross-converter import—তিনটিকে আলাদা করে দেখা হয়েছে।

| সিদ্ধান্তের ক্ষেত্র | ফলাফল |
|---|---|
| Core forward mapping ও positioning | পরীক্ষিত প্রায় সব সাধারণ case-এ হুবহু মিল |
| ঋ-কার, র-ফলা, শুরু/মাঝের এ-কার | পরীক্ষিত corpus-এ হুবহু মিল |
| বৃহৎ যুক্তবর্ণ corpus | অধিকাংশে হুবহু মিল; তিনটি family-তে semantic-preservation পার্থক্য |
| Bangla.plus output AvroJoy-এ নেওয়া | সাধারণ corpus-এ সামঞ্জস্যপূর্ণ; `॥` এবং Bangla.plus-এর নিজস্ব lossy forms-এ সতর্কতা দরকার |
| AvroJoy output Bangla.plus-এ নেওয়া | protected conjunct এবং paired quote forms পড়তে পারে; `॥`-এ দ্বিগুণ হওয়ার ঝুঁকি |
| Product workflow | Bangla.plus-এর keyboard selector আছে; AvroJoy-এর file, font-aware preview, local/offline workflow আছে |

## ১. পরিধি, পদ্ধতি ও সীমা

বাংলা Unicode থেকে Bijoy-এ সম্ভাব্য string অসীম; তাই আক্ষরিক অর্থে প্রতিটি বাক্য exhaustively পরীক্ষা করা সম্ভব নয়। এখানে public UI-তে দেখা যায় এমন সব গুরুত্বপূর্ণ conversion class—স্বতন্ত্র স্বরবর্ণ, ব্যঞ্জনবর্ণ, কার, pre-kar, রেফ/র-ফলা, hasanta-যুক্ত form, ZWJ/ZWNJ, punctuation, সংখ্যা, mixed ASCII, reverse input এবং cross-converter return—ছোট ছোট non-truncated batch-এ পরীক্ষা করা হয়েছে। Bangla.plus-এর প্রকাশ্য client-side mapping script-ও কেবল বিশ্লেষণাত্মক data হিসেবে পড়া হয়েছে; তার বাইরে কোনো private implementation বা server assumption করা হয়নি। [1] [2]

AvroJoy-এর ফল তার বিদ্যমান production converter-এর non-production harness থেকে নেওয়া হয়েছে এবং প্রয়োজনীয় case public UI context-এর সঙ্গে মিলিয়ে দেখা হয়েছে। Bangla.plus-এর সব ফল তার live public text area-তে input দিয়ে সংশ্লিষ্ট convert button চাপার পরে output field থেকে সংগ্রহ করা হয়েছে। দীর্ঘ output clipping এড়াতে batch ছোট রাখা হয়েছে।

| সিদ্ধান্তের ধরন | এই প্রতিবেদনে অর্থ |
|---|---|
| **Same mapping** | একই input-এ একই raw legacy sequence এবং একই relevant Unicode return |
| **Encoding variant** | raw sequence আলাদা, কিন্তু intended glyph/Unicode return ক্ষতিগ্রস্ত নয় |
| **Material divergence** | raw sequence আলাদা এবং Unicode semantic distinction বা cross-converter result বদলায় |
| **Capability difference** | কোনো UI/workflow এক পণ্যে আছে, অন্যটির observed UI-তে নেই; mapping superiority নয় |

এই পরীক্ষা সব OS, Microsoft Word version, SutonnyMJ release, keyboard mode, copy-paste encoding boundary বা future Bangla.plus release-এর নিশ্চয়তা নয়। ফলাফল পরীক্ষার সময়কার public behaviour-এর জন্য প্রযোজ্য।

## ২. যেসব ক্ষেত্রে raw output হুবহু মিলেছে

### ২.১ স্বতন্ত্র বর্ণ ও বিরল স্বরবর্ণ

দুই converter-ই পরীক্ষিত standard vowel series-এ একই conventional Bijoy code দিয়েছে। `ঌ`, `ৠ`, `ৡ`-এর জন্য কোনো ANSI mapping প্রয়োগ না করে উভয়েই original Unicode character রেখে দিয়েছে।

| Unicode input | উভয়ের raw Bijoy output |
|---|---|
| `অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ` | `A Av B C D E F G H I J` |
| `ক খ গ ঘ ঙ ... হ ড় ঢ় য় ৎ` | `K L M N O ... p q r` |
| `ঌ ৠ ৡ` | `ঌ ৠ ৡ` অপরিবর্তিত |

### ২.২ কার, ঋ-কার এবং শুরু/মাঝের pre-kar

এই অংশটি ব্যবহারকারীর বিশেষ উদ্বেগের বিষয় ছিল। `ৃ`-কার, `ে`/`ৈ`-কারের অবস্থান এবং composite `ো`/`ৌ`—সবকটিতে একই sequence পাওয়া গেছে।

```text
Input : কা কি কী কু কূ কৃ কে কৈ কো কৌ
উভয় : Kv wK Kx Kz K‚ K… †K ˆK †Kv †KŠ

Input : এ কে রেখে শ্রেণি প্রেক্ষিত গৌরব কৌতুক
উভয় : G †K †i‡L †kÖwY †cÖw¶Z †MŠie †KŠZzK
```

এটি শুধু isolated কার নয়; word-initial `এ/কে/রেখে`, word-middle `শ্রেণি/প্রেক্ষিত`, ঋ-কার এবং conjunct-neighbour context-ও cover করে। পূর্বের focused test-এ `দৃষ্টি, রেখে, অশ্রু, ঝুম, স্মৃতি, প্রথম, দ্রব্য, র‍্যাব`-এর সম্মিলিত output-ও দুই সাইটে একই ছিল:

```text
„wó †i‡L AkÖæ Szg ¯§„wZ cÖ_g `ªe¨ i‍¨ve
```

### ২.৩ রেফ, র-ফলা এবং joiner-sensitive রূপ

রেফ, ক্র/প্র/গ্র/শ্র/ত্র/দ্র/ব্র/ম্র/হ্র এবং পরীক্ষিত ZWJ/ZWNJ-সম্পর্কিত রূপে raw output একই।

```text
Input : র্ ক্র প্র গ্র শ্র ত্র দ্র ব্র ম্র হ্র র‍্য র্য র‌্য র‍্যাব
উভয় : i& µ cÖ MÖ kÖ Î `ª eª gª nª i‍¨ h© i¨ i‍¨ve
```

### ২.৪ বিস্তৃত যুক্তবর্ণ corpus

ক/ঙ/চ/জ/ট/ণ/ত/ন/প/ফ/ব/ভ/ম/ল/শ/ষ/স/হ family মিলিয়ে বিস্তৃত corpus চালানো হয়েছে। এর মধ্যে `ক্ক, ক্ট, ক্ত, ক্ব, ক্ল, ক্ষ, ক্ষ্ম, ঙ্ক, ঙ্খ, ঙ্গ, ঙ্ঘ, চ্চ, চ্ছ, জ্জ, জ্ঞ`; `ট্ট, ট্ব, ট্ম, ড্ড, ণ্ট, ণ্ঠ, ণ্ড, ত্ত, ত্থ, ত্ন, ত্ম, ত্ব, ন্তু, ন্ত, ন্ত্ব, ন্থ, ন্দ, ন্ধ, ন্দ্ব, ন্ন, ন্ব, ন্ম`; এবং `প্ট, প্ত, প্ন, প্প, প্ল, প্স, ফ্ল, ব্জ, ব্দ, ব্ধ, ব্ব, ব্ল, ভ্র, ম্ন, ম্প, ম্ফ, ম্ব, ম্ভ, ম্ম, ম্ল`-এ মিল পাওয়া গেছে।

শেষ group-এও `ল্ল→jø`, `শ্র→l&µ`, `ষ্ক্র→l&µ`, `স্কু→¯‹z`, `স্তু→¯‘`, `স্ত্র→¯¿`, `হ্ব→nŸ`, `হ্ণ→nè`, `হ্ন→ý`, `হ্ল→n¬`, `হৃ→ü` একই ছিল। অর্থাৎ এই পরীক্ষা **সাধারণ বা complex conjunct placement-এ কোনো বিস্তৃত mismatch দেখায়নি**।

### ২.৫ সংখ্যা, Latin text ও অধিকাংশ punctuation

Forward direction-এ Bengali digit ASCII digit code-এ যায়, ASCII digit একই থাকে এবং Latin `ABC`/`abc` অপরিবর্তিত থাকে—উভয়ের ক্ষেত্রেই একই ফল। বাংলা দাঁড়ি `।→|`, curly double quote `“…”→Ò…Ó`, curly single quote `‘…’→Ô…Õ`, bracket, parenthesis, dash এবং ellipsis `…→...`-ও একই পাওয়া গেছে।

```text
Input : ।  “উদ্ধৃতি”  ‘কথা’  (বন্ধনী) [বর্গ]  —  …
উভয় : |  ÒD×…wZÓ  ÔK_vÕ  (eÜbx) [eM©]  Ñ  ...
```

## ৩. প্রমাণিত mapping ও round-trip পার্থক্য

### ৩.১ `ক্ষ্ন` বনাম `ক্ষ্ণ`: Bangla.plus forward alias, AvroJoy distinct preservation

| Unicode input | Bangla.plus forward | AvroJoy forward | Bangla.plus reverse return | AvroJoy reverse return |
|---|---|---|---|---|
| `ক্ষ্ন` | `¶è` | `¶&b` | `¶è → ক্ষ্ণ` | `¶&b → ক্ষ্ন` |
| `ক্ষ্ণ` | `¶è` | `¶&Y` | `¶è → ক্ষ্ণ` | `¶&Y → ক্ষ্ণ` |

Bangla.plus দুই ভিন্ন Unicode input-কে একই `¶è` sequence-এ নামিয়ে আনে। ফলে `ক্ষ্ন` Bangla.plus→Bangla.plus round-trip-এ `ক্ষ্ণ` হয়ে যায়। অন্যদিকে AvroJoy পৃথক legacy form রাখে। Bangla.plus `¶&b` এবং `¶&Y` দুটোই import করতে পারে এবং যথাক্রমে `ক্ষ্ন`, `ক্ষ্ণ` ফেরত দেয়; অর্থাৎ সমস্যা Bangla.plus-এর import নয়, নিজের forward alias। [2]

### ৩.২ `ণ্ণ` বনাম `ণ্ন`: একই ধরনের semantic collapse

| Unicode input | Bangla.plus forward | AvroJoy forward | Bangla.plus reverse return | AvroJoy reverse return |
|---|---|---|---|---|
| `ণ্ণ` | `Yœ` | `Y&Y` | `Yœ → ণ্ন` | `Y&Y → ণ্ণ` |
| `ণ্ন` | `Yœ` | `Y&b` | `Yœ → ণ্ন` | `Y&b → ণ্ন` |

এখানেও Bangla.plus forward-এ দুই input alias করে এবং নিজের `ণ্ণ` semantic distinction হারায়। কিন্তু `Y&Y` ও `Y&b` form সে reverse-এ পড়তে পারে। এই পার্থক্যটি `ক্ষ্ন/ক্ষ্ণ`-এর মতোই Unicode semantic preservation-এর প্রশ্ন, কেবল style preference নয়।

### ৩.৩ `ত্রূ`: Bangla.plus-এর নিজের forward/reverse semantic mismatch

| Workflow | ফল |
|---|---|
| Bangla.plus `ত্রূ` → Bijoy | `Îƒ` |
| Bangla.plus `Îƒ` → Unicode | `ত্রƒ` |
| AvroJoy `ত্রূ` → Bijoy | `Î~` |
| AvroJoy `Î~` → Unicode | `ত্রূ` |
| Bangla.plus `Î~` → Unicode | `ত্রূ` |
| AvroJoy `Îƒ` → Unicode | `ত্রƒ` |

`ƒ` এখানে raw legacy character, Unicode vowel sign নয়। অতএব Bangla.plus-এর own forward result সে reverse করলে semantic Unicode `ত্রূ` না ফিরে `ত্রƒ` হয়। AvroJoy `Î~` ব্যবহার করে `ত্রূ` round-trip রাখে; Bangla.plus ওই AvroJoy representation-টিও ঠিকমতো পড়েছে। তবে AvroJoy Bangla.plus-এর `Îƒ`-কে নিজে থেকে অনুমান করে `ূ` বানায় না—কারণ সেটি করলে literal/ambiguous input নষ্ট হওয়ার ঝুঁকি থাকে।

### ৩.৪ Double-dari `॥`: দুই legacy convention cross-compatible নয়

Bangla.plus `॥`-কে একটি backslash (`\`) দেয় এবং reverse-এ প্রতিটি backslash-কে `॥` করে। AvroJoy `॥`-কে দুই backslash (`\\`) দেয় এবং কেবল সেই pair-কে এক double-dari হিসেবে reverse করে; lone backslash অপরিবর্তিত রাখে। ফলে দুটির নিজস্ব round-trip চললেও একে অন্যের convention সরাসরি compatible নয়।

| Workflow | Unicode result |
|---|---|
| Bangla.plus `॥` → `\` → Bangla.plus | `॥` |
| AvroJoy `॥` → `\\` → AvroJoy | `॥` |
| AvroJoy `॥` → `\\` → Bangla.plus | `॥॥` |
| Bangla.plus `॥` → `\` → AvroJoy | literal `\` |

এটি বাস্তব cross-converter difference, তবে দৈনন্দিন লেখায় `।`-এর চেয়ে `॥` অনেক কম ব্যবহৃত। সাধারণ দাঁড়ি `।→|→।` দুই সাইটে একই। কোন sequence নির্দিষ্ট SutonnyMJ release-এ visually preferable—সে বিষয়ে এই text-level পরীক্ষা চূড়ান্ত font-glyph certification দেয় না; কেবল sequence ও return behaviour প্রতিষ্ঠা করে।

### ৩.৫ `য়` বনাম `য়`: canonical Unicode spelling-এ পার্থক্য

দুই সাইটই forward-এ `য়` এবং `য়`-কে `q` করে। কিন্তু `q` reverse করলে Bangla.plus `য়` ফেরত দেয়, আর AvroJoy `য়` ফেরত দেয়। Glyph/উচ্চারণ একই হলেও Unicode code-point sequence আলাদা। AvroJoy-এর ফল আধুনিক decomposed `য + ়` spelling; Bangla.plus legacy single-code-point form রাখে। র-ফলা ও পরীক্ষিত joiner forms (`র‍্য`, `র্য`, `র‌্য`) উভয়েই পৃথকভাবে ফিরে এসেছে।

### ৩.৬ Straight quote: semantic loss নয়, forward normalization policy আলাদা

| Unicode input | Bangla.plus forward | AvroJoy forward | সংশ্লিষ্ট self-return |
|---|---|---|---|
| `"সোজা"` | `"†mvRv"` | `Ò†mvRvÓ` | Bangla.plus → `"সোজা"`; AvroJoy → `“সোজা”` |
| `'সোজা'` | `'†mvRv'` | `Ô†mvRvÕ` | Bangla.plus → `'সোজা'`; AvroJoy → `‘সোজা’` |

Bangla.plus ASCII delimiter literalভাবে রাখে। AvroJoy forward-এ Bangla text-ঘেরা straight quote pair-কে opening/closing Bijoy quote code-এ normalise করে এবং reverse-এ curly Unicode quote ফেরায়। এটি Unicode semantic text ভাঙা নয়; quotation-style canonicalization। Interoperability পরীক্ষায় Bangla.plus `Ò†mvRvÓ Ô†mvRvÕ`-কে ঠিক `“সোজা” ‘সোজা’` করেছে, আর AvroJoy Bangla.plus-এর straight-code form-কে straight quote সহই পড়েছে।

### ৩.৭ Ellipsis ও mixed ASCII: shared non-bijective boundary

একটি Unicode ellipsis `…` দুই সাইটেই forward-এ `...` হয় এবং reverse-এ তিন period-ই থাকে; visually কাছাকাছি হলেও exact Unicode round-trip নয়।

আর `0123456789 0123456789 evsjv ABC 123abc` raw sequence দুই converter-ই একইভাবে `০১২৩৪৫৬৭৮৯ ০১২৩৪৫৬৭৮৯ বাংলা অইঈ ১২৩ধনপ` হিসেবে পড়ে এবং পুনরায় export-এ original raw sequence ফেরত দেয়। কারণ ASCII `ABC` আসল English textও হতে পারে, আবার Bijoy code-এ `অইঈ`-ও হতে পারে। font/style provenance ছাড়া textarea-only reverse converter লেখকের উদ্দেশ্য নির্ভুলভাবে জানতে পারে না। এটি দুই সাইটেরই intrinsic legacy-code ambiguity; AvroJoy-এর mixed Bengali–English **document/preview font handling** এই raw-text ambiguity সম্পূর্ণ দূর করে না।

## ৪. Rendering, UI এবং ব্যবহারিক সক্ষমতা

দুই সাইটের text conversion control এবং clipboard action আছে। Bangla.plus-এর inspected public UI-তে English, Avro ও Unijoy typing-keyboard selectorও আছে। [1] AvroJoy-এ live dual-pane conversion, direction switch, raw-code validation, SutonnyMJ preview এবং English/number run-এর Times New Roman presentation দেখা যায়। [3]

| ক্ষেত্র | Bangla.plus-এর পর্যবেক্ষিত public UI | AvroJoy-এর পর্যবেক্ষিত public UI | মূল্যায়ন |
|---|---|---|---|
| Plain text | দুই text area, দুই দিকের button, copy | live two-pane conversion, direction, copy | উভয়েই basic text workflow দেয় |
| Typing help | English/Avro/Unijoy keyboard choice | সমতুল্য on-page keyboard selector দেখা যায়নি | Bangla.plus-এর interaction advantage |
| Preview guidance | Bijoy output area ও Bijoy-font class | SutonnyMJ Bengali preview; Times New Roman English/number run | AvroJoy-এর explicit mixed-font guidance বেশি |
| File workflow | observed converter page-এ DOCX/TXT upload/download দেখা যায়নি | `.docx`/`.txt` conversion, preview, copy ও print/PDF-preview | AvroJoy-এর product capability difference; Bangla.plus-এর unobserved feature সম্পর্কে সিদ্ধান্ত নয় |
| Local/offline | inspected UI-তে এমন claim/control দেখা যায়নি | install/offline control ও on-device recent-history statement | AvroJoy-এর product capability difference |

AvroJoy-এর public page নিজেই বলে যে compatible SutonnyMJ font ছাড়া Bijoy output raw/hijibiji দেখানো স্বাভাবিক এবং English runs আলাদা font treatment পায়। [3] এই rendering explanationটি বিশেষভাবে জরুরি: site UI-তে raw code Latin দেখালে সেটি converter byte error প্রমাণ করে না। একইভাবে, visible font/rendering comparison করতে হলে একই font file, font size, browser/application এবং script shaping context ব্যবহার করতে হয়—এই study-তে প্রতিটি possible Word environment আলাদা করে যাচাই করা হয়নি।

## ৫. ব্যবহারিক compatibility নির্দেশনা

দৈনন্দিন সাধারণ Bangla text—বিশেষত ঋ-কার, র-ফলা, এ-কার এবং বহুল ব্যবহৃত conjunct—দুই tool-এর মধ্যে নেওয়া-দেওয়ায় পরীক্ষিত corpus-এ কোনো mapping বাধা পাওয়া যায়নি। `দৃষ্টি রেখে অশ্রু ঝুম স্মৃতি প্রথম দ্রব্য র‍্যাব`-এর মতো সংবেদনশীল test sentence উভয় দিকেই অভিন্ন ছিল।

কিন্তু Unicode fidelity অগ্রাধিকার হলে `ক্ষ্ন/ক্ষ্ণ`, `ণ্ণ/ণ্ন`, `ত্রূ` এবং `॥` আলাদা করে যাচাই করা উচিত। একইভাবে, Bangla.plus থেকে পাওয়া `q` return-এর legacy `য়` AvroJoy-এ `য়` হয়ে স্বাভাবিকীকৃত হতে পারে; এবং straight quote AvroJoy forward/reverse-এ curly-pair style-এ যেতে পারে। এগুলো word meaning বদলানোর মতো নয়, কিন্তু exact code-point comparison বা scholarly text diff-এ দেখা যাবে।

| ব্যবহার-পরিস্থিতি | প্রমাণভিত্তিক পরামর্শ |
|---|---|
| সাধারণ বিজয় copy/paste | দুইটিই পরীক্ষিত core corpus-এ compatible |
| `ক্ষ্ন`, `ক্ষ্ণ`, `ণ্ণ`, `ণ্ন`, `ত্রূ` থাকে | Unicode return পরীক্ষা করুন; AvroJoy-এর protected output semantic distinction রাখে |
| এক tool থেকে অন্য tool-এ `॥` আছে | cross-convert না করে final Unicode/Bijoy output আলাদা করে যাচাই করুন |
| ASCII English/Bijoy code মেশানো raw input | শুধু plain text দেখে reverse করবেন না; font/style provenanceসহ source document দেখুন |
| Word/DOCX mixed Bangla–English | AvroJoy-এর font-aware document workflow ব্যবহারিকভাবে প্রাসঙ্গিক; final Word rendering নিজ পরিবেশে যাচাই করুন |

## ৬. চূড়ান্ত নিরপেক্ষ রায়

Bangla.plus-এর তুলনায় AvroJoy-এর সাধারণ mapping, ঋ-কার, রেফ/র-ফলা, শুরু ও মাঝের এ-কার, এবং বহুল ব্যবহৃত যুক্তবর্ণে **কোনো বিস্তৃত দুর্বলতা এই পরীক্ষা দেখায়নি**। বরং পরীক্ষিত প্রধান corpus-এ raw sequence এক। তাই একটি compatible mapping পেতে AvroJoy-এর স্থিতিশীল core conversion logic বদলানো অযৌক্তিক ও regression-prone হতো।

তিনটি specific conjunct-vowel/alias family-তে AvroJoy Unicode semantic round-trip সংরক্ষণ করে যেখানে Bangla.plus-এর forward/reverse route তথ্য হারাতে পারে। Double-dari-তে উল্টো করে দুই সাইটের convention আলাদা—তাই একটিকে অন্যটির সার্বজনীন বিকল্প বলা যাবে না। Straight quote ও `য়/য়`-এ পার্থক্য মূলত normalization policy, আর ellipsis ও mixed ASCII-তে সীমাবদ্ধতা উভয়েরই।

সুতরাং ন্যায়সঙ্গত উপসংহার হলো: **সাধারণ conversion quality-তে পরীক্ষিত ক্ষেত্রগুলোতে tie; Unicode semantic preservation-এর কয়েকটি স্পষ্ট edge case-এ AvroJoy এগিয়ে; Bangla.plus-এর on-page typing keyboard একটি আলাদা UI সুবিধা; এবং DOCX/TXT, mixed-font preview, local/offline workflow-এ AvroJoy-এর পর্যবেক্ষিত product scope বিস্তৃত।** এই সিদ্ধান্ত কোনো অযাচাইকৃত universal superiority claim নয়; এটি পরীক্ষিত public behaviour-এর সীমার মধ্যে রাখা হয়েছে।

## References

[1]: https://bangla.plus/bijoy-unicode-converter/ "Bangla.plus — বিজয় ও ইউনিকোড কনভার্টার"
[2]: https://bangla.plus/js/fc/fontconverter.min.js "Bangla.plus public font converter script"
[3]: https://avrojoy.vercel.app/ "AvroJoy — অভ্র/ইউনিকোড ⇄ বিজয় কনভার্টার"
