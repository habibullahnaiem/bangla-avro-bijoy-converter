# ছয়টি raw Bijoy byte পার্থক্য: প্রযুক্তিগত কারণ ও কনভার্টার-লজিকের প্রভাব

## পরিধি ও মূল সিদ্ধান্ত

এই বিশ্লেষণে একই ৩৭টি জটিল Unicode বাংলা শব্দ ShumanBD এবং AvroJoy-এ Unicode → Bijoy চালিয়ে byte-by-byte মিলিয়ে দেখা হয়েছে। ৩১টি শব্দে byte এক, ছয়টি শব্দে আলাদা। ছয়টির মধ্যে পাঁচটি **একই Unicode ফলের জন্য বৈধ বিকল্প legacy form**; কেবল `আকাঙ্ক্ষা`-র AvroJoy form ShumanBD-তে reverse করলে অর্থবহ বানান বদলে যায়। [1] [2]

> **মূল ধারণা:** Bijoy/SutonnyMJ কোনো একক আধুনিক character encoding নয়। এটি মূলত font-dependent legacy glyph-code system। তাই একই Unicode গঠনকে একাধিক byte sequence প্রতিনিধিত্ব করতে পারে। Unicode → Bijoy mapping অনেক ক্ষেত্রে একটিকে canonical form হিসেবে বেছে নেয়; Bijoy → Unicode mapping-কে আবার একাধিক alias বুঝতে হয়। এই দুই দিকের mapping সব সময় গাণিতিকভাবে এক-এক (bijective) নয়।

## AvroJoy-এর প্রাসঙ্গিক রূপান্তর-পাইপলাইন

AvroJoy প্রথমে নিজস্ব punctuation-safe pre-processing করে, তারপর text-কে word-aware token-এ ভাগ করে `@abdalgolabs/ansi-unicode-converter` লাইব্রেরিতে পাঠায়। লাইব্রেরি Unicode-র pre-kar, রেফ/র-ফলা ও যুক্তাক্ষরের অবস্থান সাজিয়ে তার ordered mapping table প্রয়োগ করে; শেষ ধাপে kar ও র-ফলা normalization চলে। [3] [4] AvroJoy এই pipeline-এর বাইরে কেবল পাঁচটি পূর্বে যাচাইকৃত ambiguous conjunct (`ক্ষ্ন`, `ক্ষ্ণ`, `ণ্ণ`, `ণ্ন`, `ত্রূ`) আলাদা করে protect করে; বর্তমান ছয়টি শব্দে এমন কোনো custom override নেই। [5]

এ কারণে এখানে দেখা পার্থক্যগুলোর উৎস **মূলত library-এর canonical legacy-form নির্বাচন** এবং ShumanBD-এর ভিন্ন forward/inverse mapping policy। এটি UI, preview CSS, DOCX font policy বা punctuation fix-এর ফল নয়।

| স্তর | কাজ | এই audit-এ প্রাসঙ্গিক প্রভাব |
|---|---|---|
| Unicode rearrangement | pre-kar, রেফ, র-ফলার logical ক্রমকে legacy glyph-order-এ নেয় | যুক্তাক্ষরসহ শব্দে byte-order তৈরি করে |
| Forward string map | পূর্ণ যুক্তাক্ষর/কারকে Bijoy token-এ বদলায় | `ক্ষ → ¶`, `শ্রু → kÖæ`, `ঙ্ক্ষ → •¶`-র মতো canonical form নির্ধারণ করে |
| Kar normalization | কিছু base+কার combination-এর legacy spellings normalizes | `ù~ → ù‚`, `¶y → ¶z` ইত্যাদি তৈরি করে |
| Inverse string map | এক বা একাধিক legacy token থেকে Unicode ফেরায় | `¶` ও `ÿ`—দুটোকেই `ক্ষ`; `…` ও `„`—দুটোকেই `ৃ` বোঝে |
| Unicode rearrangement (reverse) | legacy glyph-order থেকে Unicode logical-order ফিরিয়ে আনে | round-trip-এ কার ও রেফের অবস্থান ঠিক রাখে |

## পার্থক্যগুলোর সারসংক্ষেপ

| শব্দ | ShumanBD raw form | AvroJoy raw form | পার্থক্যের ধরন | ব্যবহারিক অবস্থা |
|---|---|---|---|---|
| `শ্রুতিমধুর` | `kÖywZgayi` | `kÖæwZgayi` | হ্রস্ব-উ কারের দুই legacy form | উভয় decoder সঠিক পড়ে |
| `ক্ষুদ্রাতিক্ষুদ্র` | `ÿz`…`ÿz` | `¶z`…`¶z` | `ক্ষ`-এর দুই alias glyph-code | উভয় decoder সঠিক পড়ে |
| `উদ্বৃত্ত` | `DØ„Ë` | `DØ…Ë` | ঋ-কারের context form/alias | উভয় decoder সঠিক পড়ে |
| `স্ফূর্তি` | `ù~wZ©` | `ù‚wZ©` | দীর্ঘ-উ কারের দুই form | উভয় decoder সঠিক পড়ে |
| `আকাঙ্ক্ষা` | `AvKvO&¶v` | `AvKv•¶v` | decomposed বনাম composite conjunct form | ShumanBD AvroJoy form ভুল পড়ে |
| `ক্ষুধার্ত` | `ÿzavZ©` | `¶zavZ©` | `ক্ষ`-এর দুই alias glyph-code | উভয় decoder সঠিক পড়ে |

## ১. `শ্রুতিমধুর`: `y` বনাম `æ`

**Observed byte difference:** ShumanBD দেয় `kÖywZgayi`; AvroJoy দেয় `kÖæwZgayi`। আলাদা token হল `y` (U+0079) এবং `æ` (U+00E6)।

AvroJoy ব্যবহৃত library-তে `শ্রু`-র জন্য স্পষ্ট compound forward mapping আছে: `শ্রু → kÖæ`। তাই এখানে `æ` এসেছে সাধারণ `ু → y` map থেকে নয়, বরং পুরো `শ্রু` conjunct+kar pattern-এর canonical legacy spelling হিসেবে। অপরদিকে inverse table-এ `y` এবং `æ`—দুটিই `ু` হিসেবে গ্রহণ করা হয়। [3]

**লজিকের প্রভাব:** এই পার্থক্য semantic loss তৈরি করে না। এটি দেখায় যে decoder-কে single-byte map-এর পাশাপাশি compound context বুঝতে হয়। AvroJoy ShumanBD-এর `y` form গ্রহণ করে, এবং ShumanBD-ও AvroJoy-এর `æ` form থেকে `শ্রুতিমধুর` ফেরত দেয়।

## ২. `ক্ষুদ্রাতিক্ষুদ্র` এবং ৬. `ক্ষুধার্ত`: `ÿ` বনাম `¶`

**Observed byte difference:** `ক্ষুদ্রাতিক্ষুদ্র`-এ দুইবার এবং `ক্ষুধার্ত`-এ একবার ShumanBD `ÿ` (U+00FF) ব্যবহার করেছে; AvroJoy `¶` (U+00B6) ব্যবহার করেছে।

AvroJoy-এর forward table-তে `ক্ষ → ¶` canonical mapping আছে। তবে inverse table-তে `¶ → ক্ষ` এবং `ÿ → ক্ষ`—দুটি alias-ই আছে। অর্থাৎ forward encoder একটি form বেছে নিলেও decoder পুরোনো/বিকল্প দুই form-ই বুঝতে পারে। [3]

**লজিকের প্রভাব:** এটি legacy compatibility-এর স্বাভাবিক উদাহরণ। একই Unicode cluster `ক্ষ` বিভিন্ন legacy source-এ আলাদা code-এ থাকতে পারে। AvroJoy-এর Bijoy → Unicode decoder দুটোকেই গ্রহণ করে; ShumanBD-ও এই পরীক্ষায় দুটোকেই সঠিক Unicode-এ ফিরিয়েছে। শুধু raw string compare করলে আলাদা, কিন্তু Unicode text recovery-তে কোনো ক্ষতি হয়নি।

## ৩. `উদ্বৃত্ত`: `„` বনাম `…`

**Observed byte difference:** ShumanBD দিয়েছে `DØ„Ë`, AvroJoy দিয়েছে `DØ…Ë`। আলাদা code হল `„` (U+201E) এবং `…` (U+2026)। এই code point দুটির দৃশ্যমান Unicode নাম quotation mark/ellipsis-এর সঙ্গে সম্পর্কিত হলেও SutonnyMJ legacy context-এ এগুলো অন্য glyph-role বহন করতে পারে; সাধারণ Unicode নাম দেখে legacy glyph নির্ধারণ করা নিরাপদ নয়।

AvroJoy-এর library forward map-এ `ৃ → …` আছে। আবার inverse table-এ `… → ৃ` এবং `„ → ৃ`—দুই alias রাখা আছে। পাশাপাশি kar-replacement table নির্দিষ্ট base-code-র পাশে `…`-কে `„`-তে বদলাতে পারে। ফলে কোন byte থাকবে সেটি **base consonant/conjunct context এবং encoder policy**-র ওপর নির্ভর করতে পারে। [3]

AvroJoy ইচ্ছাকৃতভাবে `… ↔ „` global replace করে না। কারণ সেটি র-কার/ঋ-কারের বিভিন্ন legacy context মুছে দিতে পারে এবং আগের পরীক্ষায় এমন global canonicalization spacing ও glyph সমস্যা তৈরি করেছিল। বর্তমান নীতি হলো library-native, context-sensitive form রাখা। [5]

**লজিকের প্রভাব:** `DØ…Ë` এবং `DØ„Ë`—দুই form-ই দুই decoder-এ `উদ্বৃত্ত` হয়েছে। তাই এটি byte-level difference, text-level error নয়। তবে raw Bijoy text অন্য system-এ পাঠালে Unicode ellipsis আর SutonnyMJ-র এই context byte এক জিনিস ধরে global normalize করা যাবে না।

## ৪. `স্ফূর্তি`: `~` বনাম `‚`

**Observed byte difference:** ShumanBD দিয়েছে `ù~wZ©`; AvroJoy দিয়েছে `ù‚wZ©`। আলাদা token `~` (U+007E) বনাম `‚` (U+201A)।

এখানে `স্ফ → ù` একটি explicit conjunct map। প্রাথমিক `ূ → ~` mapping-এর পরে AvroJoy library-এর kar-normalization table-তে `ù~ → ù‚` rule আছে। ফলে AvroJoy-এর formটি normalization stage-এর ফল; ShumanBD সম্ভবত initial/decomposed `~` spelling রেখে দেয়। Inverse table দুই token-কেই `ূ` বলে। [3] [4]

**লজিকের প্রভাব:** এটি encoder-normalization difference। AvroJoy ShumanBD-এর `ù~` এবং নিজের `ù‚`—দুটোকেই `স্ফূর্তি`তে ফেরায়; ShumanBD-ও দুই form সঠিক পড়েছে। ফলে এটি interoperability-safe alias, কিন্তু canonical byte এক নয়।

## ৫. `আকাঙ্ক্ষা`: `O&¶` বনাম `•¶` — একমাত্র বাস্তব compatibility risk

**Observed byte difference:** ShumanBD দেয় `AvKvO&¶v`; AvroJoy দেয় `AvKv•¶v`।

`আকাঙ্ক্ষা`-র relevant Unicode অংশ `ঙ্ক্ষ`। AvroJoy library-তে এই পুরো cluster-এর explicit forward map আছে: `ঙ্ক্ষ → •¶`। Inverse table-তেও composite form `•¶ → ঙ্ক্ষ` আগে রাখা আছে। অর্থাৎ AvroJoy-এর decoder pair-টিকে একসঙ্গে দেখে `ঙ্ক্ষ` ফিরিয়ে দেয়। [3] [4]

ShumanBD-এর form `O&¶` decomposed: `O → ঙ`, `& → ্`, `¶ → ক্ষ`; ফলে `ঙ্ + ক্ষ = ঙ্ক্ষ`। এই formটি কোনো special composite rule ছাড়াই পড়া যায়।

সমস্যা দেখা দেয় যখন AvroJoy-এর `•¶` ShumanBD-তে Bijoy → Unicode করা হয়। পর্যবেক্ষিত ফল `আকাক্সক্ষা`। এটি প্রমাণ করে যে ShumanBD তার inverse path-এ `•¶`-কে AvroJoy-এর মতো একটি single composite `ঙ্ক্ষ` rule হিসেবে অগ্রাধিকার দিচ্ছে না; `•`-র ভিন্ন standalone interpretation এবং পরের `¶` আলাদা করে পড়ছে। ShumanBD-এর source code এই audit-এর অন্তর্ভুক্ত নয়, তাই এর ভেতরের table/order দাবি করা হচ্ছে না; ফলটি black-box controlled test থেকে নিশ্চিত। [1] [2]

**লজিকের প্রভাব:**

| পথ | ফল |
|---|---|
| AvroJoy `AvKv•¶v` → AvroJoy Bijoy→Unicode | `আকাঙ্ক্ষা` |
| ShumanBD `AvKvO&¶v` → AvroJoy Bijoy→Unicode | `আকাঙ্ক্ষা` |
| ShumanBD `AvKvO&¶v` → ShumanBD Bijoy→Unicode | `আকাঙ্ক্ষা` |
| AvroJoy `AvKv•¶v` → ShumanBD Bijoy→Unicode | `আকাক্সক্ষা` — **বানান বদলে যায়** |

এটি ছয়টির মধ্যে একমাত্র পার্থক্য যেখানে raw byte choice অন্য converter-এ সত্যিকারের round-trip risk তৈরি করেছে। এটি AvroJoy-এর নিজের round-trip bug নয়; AvroJoy তার own form এবং ShumanBD-এর decomposed form—দুটিই গ্রহণ করে।

## কোন আচরণ পরিবর্তন করা উচিত নয়

শুধু byte এক করার জন্য `ÿ → ¶`, `„ → …`, `~ → ‚` বা `y → æ` global replacement করা উচিত নয়। কারণ এগুলো context/compound-sensitive alias। Global swap করলে সঠিক legacy document-এর established form নষ্ট হতে পারে, বিশেষত `…/„`-র মতো kar/R-kar-সম্পর্কিত context-এ। AvroJoy-এর existing policy—**নিজের canonical output রাখা, কিন্তু inverse conversion-এ একাধিক verified legacy alias গ্রহণ করা**—এ ধরনের document interoperability-র জন্য তুলনামূলকভাবে নিরাপদ। [3] [5]

`আকাঙ্ক্ষা`-র জন্য ShumanBD-compatibility অগ্রাধিকার দিতে চাইলে ভবিষ্যতে একটি **খুব সীমিত, opt-in compatibility rule** বিবেচনা করা যেতে পারে: targeted `ঙ্ক্ষ` context-এ `•¶`-র পরিবর্তে `O&¶` emit করা। কিন্তু এটি এখন প্রয়োগ করা হয়নি, কারণ একটি broad byte replacement অনিরাপদ এবং পুরো `ঙ্ক্ষ`/কার/রেফ context corpus ও DOCX regression দিয়ে আলাদা যাচাই ছাড়া বিদ্যমান স্থিতিশীল behavior বদলানো ঠিক হবে না।

## ব্যবহারিক অর্থ

AvroJoy থেকে SutonnyMJ-তে ব্যবহার, নিজের AvroJoy round-trip, এবং ShumanBD-produced legacy Bijoy input পড়ার ক্ষেত্রে এই ছয়টি difference কোনো সাধারণ breakage তৈরি করেনি। ঝুঁকিটি নির্দিষ্ট: **AvroJoy থেকে বের হওয়া `আকাঙ্ক্ষা`-র legacy raw text ShumanBD-তে পুনরায় Unicode-এ convert করা হলে** ShumanBD ভুল বানান দিতে পারে। ShumanBD থেকে AvroJoy-এ আসা একই শব্দে সমস্যা নেই।

এই ব্যাখ্যার জন্য কোনো production conversion logic পরিবর্তন করা হয়নি।

## References

[1]: https://www.shumanbd.com/ "ShumanBD public converter; controlled forward and reverse test source"
[2]: ./SHUMANBD_AVROJOY_COMPLEX_WORD_BYTE_AUDIT_BN.md "Controlled 37-word raw-byte audit and observed round-trip results"
[3]: ./node_modules/.pnpm/@abdalgolabs+ansi-unicode-converter@1.0.5/node_modules/@abdalgolabs/ansi-unicode-converter/dist/data.js "Installed converter library mapping tables and kar replacements"
[4]: ./node_modules/.pnpm/@abdalgolabs+ansi-unicode-converter@1.0.5/node_modules/@abdalgolabs/ansi-unicode-converter/dist/core.js "Installed converter library conversion and reordering pipeline"
[5]: ./client/src/lib/converter.ts "AvroJoy word-aware conversion, verified-conjunct protection, and context-preserving policies"
