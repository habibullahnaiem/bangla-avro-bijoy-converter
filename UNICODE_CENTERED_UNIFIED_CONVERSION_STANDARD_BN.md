# Unicode-কেন্দ্রিক unified Bangla conversion standard: স্থায়ী সমাধানের প্রস্তাব

## সংক্ষিপ্ত উত্তর

**হ্যাঁ, সম্ভব।** তবে স্থায়ী সমাধান মানে আরেকটি `replace()` rule যোগ করা নয়। সমাধান হবে এমন একটি **Unicode-কেন্দ্রিক, versioned mapping standard**, যেখানে Unicode বাংলা text-ই একমাত্র canonical content; Bijoy/SutonnyMJ byte হবে কেবল নামযুক্ত ও versioned legacy profile-এর export/import format।

> **মূল নীতি:** বাংলা ভাষার সত্য source হবে logical Unicode cluster; font-dependent Bijoy byte হবে নির্দিষ্ট profile-এ render বা export করার উপায়।

এই নকশা AvroJoy-এর বর্তমান আচরণ ধরে রাখতে পারে, একই সঙ্গে ShumanBD বা ভবিষ্যতের অন্য converter-এর আলাদা byte choice-কে স্পষ্ট profile হিসেবে নথিভুক্ত করতে পারে। কিন্তু অন্য কোনো website বা converter একই standard গ্রহণ না করলে AvroJoy একা তাদের reverse mapping বদলাতে পারবে না।

## কেন বর্তমান সমস্যা হয়

Unicode Bengali text logical character sequence হিসেবে `virama`/hasant, vowel sign এবং joiner দিয়ে যুক্তাক্ষর প্রকাশ করে; font ও shaping engine সেই logical sequence-কে দৃশ্যমান যুক্তাক্ষর, রেফ, র-ফলা, য-ফলা বা pre-base vowel হিসেবে দেখায়। [1] [2] [3] অন্যদিকে SutonnyMJ/Bijoy legacy stream একই semantic cluster-কে বিভিন্ন glyph byte form-এ প্রকাশ করতে পারে। ফলে `ঙ্ক্ষ`-র জন্য `•¶` এবং `O&¶`-এর মতো একাধিক legacy spelling থাকতে পারে।

এই বহুত্ব নিজে ভুল নয়। ভুল হয় যখন এক converter একটি byte form encode করে, কিন্তু অন্য converter reverse করার সময় সেই form-কে একই semantic cluster হিসেবে নথিভুক্ত রাখে না। AvroJoy → ShumanBD পরীক্ষা সেই কারণেই `আকাঙ্ক্ষা → আকাক্সক্ষা` এবং নির্দিষ্ট `দারিদ্র্য` + e-kar context-এ text-order change দেখিয়েছে। [7]

Unicode normalization একা এর সমাধান নয়। NFC canonically equivalent Unicode sequence স্থির করতে সাহায্য করে, কিন্তু legacy font byte alias কোনটি কোন semantic cluster বোঝায়, সেই profile-specific প্রশ্নের উত্তর দেয় না। UAX #15-ও compatibility normalization blindভাবে প্রয়োগ না করতে বলে, কারণ সেটি প্রয়োজনীয় distinction মুছে দিতে পারে। [4]

## প্রস্তাবিত standard: UBCS

এই report-এ প্রস্তাবিত নাম **UBCS — Unicode-centered Bangla Conversion Standard**। এটি নতুন Unicode character set নয় এবং Unicode-কে প্রতিস্থাপনও করবে না। এটি Unicode Bengali text ও নানা legacy Bijoy profile-এর মধ্যে transparent contract তৈরি করবে।

| স্তর | কী থাকবে | কেন দরকার |
|---|---|---|
| **1. Canonical Unicode** | NFC Unicode Bengali text; semantic ZWJ/ZWNJ সংরক্ষণ | সব tool-এ একই ভাষাগত content রাখে |
| **2. Cluster parser** | syllable/যুক্তাক্ষর token: reph, র-ফলা, য-ফলা, kar, punctuation | visible glyph নয়, semantic unit অনুযায়ী রূপান্তর করে |
| **3. Profile registry** | named/versioned legacy mapping tables | “Bijoy” নামের আড়ালে ভিন্ন mapping লুকিয়ে থাকতে দেয় না |
| **4. Diagnostics & provenance** | exact/alias/fallback/unknown status; optional source-byte metadata | lossless দাবি ও ambiguous input আলাদা করে |
| **5. Conformance suite** | open corpus, bytes, Unicode result, visual/font tests | সব implementer একই নিয়মে pass/fail যাচাই করতে পারে |

### 1. Canonical Unicode layer

সব text storage, search, copy, API এবং modern document content Unicode logical form-এ থাকবে। বাংলা virama, vowel signs ও meaningful joiner (`ZWJ`/`ZWNJ`) বাদ দিয়ে visual glyph order text-এ সংরক্ষণ করা যাবে না। Unicode Bengali guidance-এ য-ফলা ও বিশেষ র/য context-এর জন্য underlying logical sequence ও প্রয়োজনীয় joiner ব্যবহারের কথা বলা হয়েছে। [1]

NFC baseline হবে, কারণ canonical equivalents-এর binary form এক করা যায়। কিন্তু NFKC/NFKD default হবে না; এগুলো formatting/compatibility distinction মুছে দিতে পারে। [4]

### 2. Bengali cluster layer

Converter character-by-character raw replace করবে না। আগে text-কে orthographic syllable cluster-এ parse করবে; যেমন `ঙ্ক্ষ`, `দ্র্য`, `দারিদ্র্যে`, `শ্রু` এবং `কৃষি` আলাদা semantic unit হিসেবে চিহ্নিত হবে। তারপর profile অনুযায়ী ঐ cluster encode হবে। Bengali shaping guidance-এও syllable cluster আলাদা করে analyse, reorder, substitute ও position করার stage বর্ণিত আছে। [3]

এর ফল হলো `•` দেখলেই replace করার মতো বিপজ্জনক নিয়ম বাদ যায়। `•¶` যদি এক profile-এ `ঙ্ক্ষ` হয় এবং `•L` অন্য profile-এ `ঙ্খ` হয়, parser তাদের source cluster আলাদা করে জানবে।

### 3. Versioned profile registry

একটি universal raw Bijoy byte table বাস্তবে যথেষ্ট নয়। বরং profile registry-তে প্রতিটি ecosystem-এর table স্পষ্টভাবে নাম ও version পাবে। উদাহরণ:

| Profile id | Forward output policy | Reverse input policy |
|---|---|---|
| `bijoy-sutonnymj-avrojoy-native@1` | AvroJoy-এর বর্তমান canonical form | native + documented legacy aliases গ্রহণ |
| `bijoy-sutonnymj-shumanbd-observed@2026-08` | controlled observation-এ ধরা ShumanBD form | ShumanBD-এর observed reverse behavior |
| `bangla-legacy-sutonnymj-ubcs@1` | community-ratified canonical form | specified aliases ও strict error policy |

Unicode mapping specifications-এর জন্য versioned identifier, complete assignment, reverse behavior, aliases এবং error condition আলাদা করে রাখার পদ্ধতি established best practice। UTS #22 এমন mapping data-কে versioned, complete এবং platform-independent হওয়ার গুরুত্ব দেয়। [5]

### 4. Exact, alias, fallback ও unknown-এর আলাদা status

প্রতিটি conversion result text ছাড়াও status ফেরাবে:

| Status | অর্থ | UI/API আচরণ |
|---|---|---|
| `exact` | named profile-এর normative mapping | কোনো warning নয় |
| `alias-accepted` | alternate but documented legacy byte পড়া হয়েছে | info-level diagnostic, চাইলে source form দেখা যাবে |
| `best-fit` | কাছাকাছি substitute ব্যবহার হয়েছে | warning; lossless দাবি করা যাবে না |
| `unknown` / `illegal` | profile-এ byte বা sequence জানা নেই | highlight/diagnostic; silent corruption নয় |

এই distinction জরুরি। UTS #22-ও illegal, unassigned এবং unmappable sequence আলাদা করে handle করার কথা বলে এবং fallback mapping-কে regular round-trip mapping থেকে পৃথক রাখার নির্দেশ দেয়। [5]

### 5. Lossless provenance — কিন্তু visible Unicode-তে নয়

কখনো দুই legacy byte sequence একই Unicode text-এ decode হয়। সাধারণ Unicode output-এ সেটি সমস্যা নয়। কিন্তু exact original byte পরে পুনরুদ্ধার করতে হলে Unicode text-এর ভিতরে private-use character ঢোকানো উচিত নয়। তার বদলে optional sidecar metadata রাখা যাবে:

```json
{
  "unicode": "আকাঙ্ক্ষা",
  "sourceProfile": "bijoy-sutonnymj-shumanbd-observed@2026-08",
  "sourceBytes": "AvKvO&¶v",
  "decodeStatus": "alias-accepted"
}
```

Plain-text workflow-এ এটি `.json` sidecar হতে পারে; DOCX-এ custom document metadata বা separate audit record হতে পারে। User-এর visible text থাকবে পরিষ্কার Unicode; দরকার হলে archival workflow raw source-ও হারাবে না।

## কীভাবে AvroJoy-এ ধাপে ধাপে করা যায়

প্রথম release-এ বর্তমান AvroJoy native output একটুও বদলাতে হবে না। এতে “নষ্ট কইরো না” শর্ত মেনে progressive migration সম্ভব।

| ধাপ | কাজ | Default user-এর প্রভাব |
|---|---|---|
| **0. Baseline freeze** | বর্তমান mapping, audit ও DOCX behavior version `native@1` হিসেবে freeze | কোনো পরিবর্তন নেই |
| **1. Data-driven registry** | hard-coded special case ধীরে ধীরে named profile data-তে নেওয়া | native bytes অপরিবর্তিত |
| **2. Cluster-aware engine** | semantic cluster parser ও validator; প্রথমে diagnostic-only | কোনো output বদল নয় |
| **3. Open conformance corpus** | raw bytes, aliases, reverse cases, render fixtures publish | অন্যান্য tool test করতে পারবে |
| **4. Opt-in export profiles** | AvroJoy-native ও ShumanBD-compatible-এর মতো explicit target | user নিজে বেছে নিলে তবেই byte বদলাবে |
| **5. Provenance mode** | optional lossless import metadata | সাধারণ user-এর visible text অপরিবর্তিত |

এই architecture legacy-to-Unicode converter-এ compiled/human-readable mapping-table ভিত্তিক design-এর সঙ্গেও সামঞ্জস্যপূর্ণ। TECkit এমন engine/table separation-এর একটি পরিচিত উদাহরণ। [6]

## Conformance corpus কেমন হবে

স্থায়ী standard code table দিয়ে নয়, test suite দিয়ে টিকে। নিম্নের corpus public ও machine-readable হওয়া উচিত:

| Corpus group | উদাহরণ |
|---|---|
| Canonical Unicode | NFC, `য়/য়`, `ো/ো`, semantic ZWJ context |
| Cluster families | ক্ষ, ঙ্ক্ষ, ঙ্খ, ঙ্ঘ, শ্রু, স্ফূ, রেফ, র-ফলা, য-ফলা |
| Kar & punctuation | এ-কার, ঋ-কার, র-কার, দাঁড়ি, quote, dash, ellipsis |
| Legacy aliases | `•¶` ও `O&¶`-এর মতো same-semantic byte forms |
| Cross-profile paths | AvroJoy → Unicode → Shuman-style, এবং reverse |
| File workflows | TXT, DOCX paragraphs, tables, footnotes/endnotes, rich formatting |
| Rendering | SutonnyMJ glyph specimen; byte pass হলেও visual gap/ligature check |

প্রতিটি mapping change version bump ছাড়া গ্রহণ করা যাবে না। Mapping record-এ evidence, forward canonical form, reverse accepted aliases, fallback policy এবং regression fixture থাকতে হবে।

## বাস্তব সীমা

এই standard তৈরি করা **সম্ভব**, কিন্তু তিনটি বিষয় আলাদা করতে হবে।

প্রথমত, AvroJoy-এর ভিতরে unified engine ও profile system তৈরি করা সম্পূর্ণ সম্ভব। দ্বিতীয়ত, open spec ও conformance corpus publish করাও সম্ভব। তৃতীয়ত, ShumanBD, অন্য converter, font vendor এবং Word workflow owner-কে একই profile গ্রহণ করানো প্রযুক্তিগত নয়, ecosystem governance-এর কাজ; AvroJoy একা তা বাধ্য করতে পারবে না।

তাই short-term লক্ষ্য হবে “এক tool সব অন্য tool ঠিক করে দেবে” নয়; লক্ষ্য হবে **প্রত্যেক conversion-এ কোন profile, কোন byte, কোন alias এবং কতটা lossless—এটি যাচাইযোগ্য করা**। দীর্ঘমেয়াদে একাধিক implementer একই corpus pass করলে প্রকৃত interoperability তৈরি হবে।

## সুপারিশ

এখনই current default mapping পাল্টাবেন না। আগে AvroJoy-এর ভেতরে profile registry ও conformance corpus-এর groundwork করুন। তারপর `ঙ্ক্ষ`-এর মতো fully proven mismatch-এর জন্য optional export profile দিন। Mapping data ও conformance fixtures public/portable হলে অন্য tool maintainers-এর সঙ্গে evidence-based আলোচনা সম্ভব হবে।

এই report strategy; কোনো production conversion logic পরিবর্তন করা হয়নি।

## References

[1]: https://www.unicode.org/faq/bengali.html "Unicode Bengali FAQ: virama, ya-phala, ZWJ and Bengali logical sequences"
[2]: https://w3c.github.io/iip/beng/ "W3C Bengali Script Resources: clusters, vowels, layout and encoding resources"
[3]: https://learn.microsoft.com/en-us/typography/script-development/bengali "Microsoft OpenType Bengali shaping model"
[4]: https://unicode.org/reports/tr15/ "Unicode Standard Annex #15: Unicode Normalization Forms"
[5]: https://www.unicode.org/reports/tr22/tr22-8.html "Unicode Technical Standard #22: Character Mapping Markup Language and conversion mapping guidance"
[6]: https://software.sil.org/teckit/ "SIL TECkit: mapping-table-driven legacy-to-Unicode conversion architecture"
[7]: ./AVROJOY_TO_SHUMANBD_REVERSE_CHANGE_AUDIT_BN.md "Controlled AvroJoy → ShumanBD reverse-conversion evidence"
