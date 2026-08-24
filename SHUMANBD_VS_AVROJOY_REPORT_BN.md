# ShumanBD ও AvroJoy: বিজয় রূপান্তর আচরণের পূর্ণ তুলনামূলক রিপোর্ট

**প্রতিবেদন তারিখ:** ২৪ আগস্ট ২০২৬  
**তুল্য বিষয়:** Unicode/Avro ⇄ Bijoy (SutonnyMJ) text conversion, byte behavior, round-trip, যুক্তবর্ণ, ঋ-কার, যতিচিহ্ন, file workflow এবং ব্যবহারযোগ্যতা।

> **সংক্ষিপ্ত সিদ্ধান্ত:** সাধারণ Unicode→Bijoy রূপান্তরে দুটি সাইটের standard যুক্তবর্ণ byte output একই। AvroJoy-এর শক্তি হলো font-aware DOCX/TXT conversion, Word-compatible run metadata, context-aware ঋ-কার, explicit punctuation policy, reversible direction workflow এবং offline/PWA support। ShumanBD-এর শক্তি হলো খুব সরল, পরিচিত two-textarea workflow এবং দ্রুত word/character/paragraph metric। ShumanBD-এর conversion table হুবহু নকল করা নিরাপদ নয়, কারণ পরীক্ষায় standalone ellipsis, em-dash এবং reverse-flow-তে আচরণগত পার্থক্য পাওয়া গেছে। [1] [2]

## ১. পরীক্ষার সীমা ও পদ্ধতি

এই রিপোর্ট কোনো সাইটের source code নকল বা অনুমান করে লেখা হয়নি। ShumanBD-এর public converter form-এ একই controlled Unicode corpus চালানো হয়েছে, তার raw Bijoy output সংগ্রহ করা হয়েছে, এবং AvroJoy-এর output ও reverse conversion-এর সঙ্গে তুলনা করা হয়েছে। এরপর ২৬টি বহুল ব্যবহৃত যুক্তবর্ণ এবং AvroJoy-এর library table-এ থাকা ১৫২টি complete hasant-conjunct mapping আলাদা audit-এ পরীক্ষা করা হয়েছে। [1] [2] [3]

পরীক্ষায় ব্যবহৃত প্রথম corpus ছিল: `কৃষি কৃষ্টি তৃণ মৃত্যু দৃশ্য স্মৃতি ন্ট ল্ল য় ড় ঢ় প্র শ্র জ্ঞ ক্ষ। “কোট” ‘কোট’ — …`। যুক্তবর্ণ corpus-এ ছিল: `ন্ত ন্থ ন্দ ন্ধ ন্ট ল্ল প্র ক্র গ্র শ্র জ্ঞ ক্ষ ত্র ত্ত দ্ধ ষ্ঠ র্ক র্গ র্দ র্ফ প্রজ্ঞা লক্ষ্মী শ্রদ্ধা কর্ম অর্থ রক্ত`। বিশেষ ambiguity corpus-এ ছিল: `গ্রু র্ ষ্ক্র ্র্য ক্ষ্ন ক্ষ্ণ ণ্ণ ণ্ন ত্রূ`।

| প্রমাণের স্তর | কী পরীক্ষা করা হয়েছে | গ্রহণযোগ্যতার মান |
|---|---|---|
| Public controlled comparison | একই input-এ raw Bijoy byte | একই byte হলে সমতা; ভিন্ন হলে glyph ও reverse পরীক্ষা |
| Round-trip | Unicode → Bijoy → Unicode | মূল Unicode বা Unicode-normalized সমতুল্য পাঠ ফিরে আসা |
| Conjunct audit | ১৫২টি library-defined complete conjunct | byte এবং standalone/contextual round-trip—দুটিই সঠিক |
| Glyph check | SutonnyMJ font-এ candidate byte render | byte-এর visual glyph আলাদা ও পাঠযোগ্য হওয়া |
| DOCX audit | run font, size pair, note, quote behavior | Word-specific metadata এবং output structure অক্ষুণ্ণ রাখা |

## ২. উচ্চ-স্তরের feature comparison

| ক্ষেত্র | ShumanBD | AvroJoy | মূল্যায়ন |
|---|---|---|---|
| Text conversion direction | দুটি textarea ও দুইটি direction button | একই দুই-direction flow, direction swap এবং live conversion | দুটোই ব্যবহারযোগ্য; AvroJoy-এ state flow বেশি নিয়ন্ত্রিত |
| Copy, clear ও fullscreen | Public UI-তে আছে [1] | Copy feedback, clear, selection-copy এবং print preview আছে | AvroJoy-এ feedback ও output handling বিস্তৃত |
| Word/character/paragraph count | Public UI-তে দৃশ্যমান [1] | Input/output header-এ character, word ও paragraph metric | একই সুবিধা; AvroJoy-এ responsive compact mode আছে |
| Recent history | Browser storage persistence-এর কথা উল্লেখ আছে [1] | localStorage-ভিত্তিক recent conversion history | উভয়ের persistence আছে; AvroJoy-এ history item পুনর্ব্যবহারযোগ্য |
| Unicode→Bijoy text | Standard corpus-এ কার্যকর | Standard corpus-এ কার্যকর | মূল standard output-এ সমতা [2] |
| Bijoy→Unicode text | UI flow আছে; existing Unicode field পরিষ্কার না করলে result append হয়েছে | Direction-specific output overwrite ও history | AvroJoy flow কম বিভ্রান্তিকর |
| SutonnyMJ visual policy | Public textarea raw byte প্রদর্শন করে | SutonnyMJ Bengali + Times New Roman English, English 2pt ছোট | Mixed Bangla-English document preparation-এ AvroJoy এগিয়ে |
| DOCX/TXT upload | পরীক্ষাকালে public UI-তে দৃশ্যমান ছিল না | Drag/drop, TXT/DOCX conversion, download, repair flow | AvroJoy-এর স্বতন্ত্র সুবিধা |
| Word formatting safety | পরীক্ষাকালে public UI-তে যাচাইযোগ্য নয় | font slots, size pairs, footnote/endnote, quote metadata audit | AvroJoy-এর স্বতন্ত্র সুবিধা [4] |
| Print/PDF preview | পরীক্ষাকালে public UI-তে যাচাইযোগ্য নয় | Dedicated print/PDF preview | AvroJoy-এর স্বতন্ত্র সুবিধা |
| Offline/PWA | পরীক্ষাকালে যাচাই করা হয়নি | Service worker, install prompt, offline-ready workflow | AvroJoy-এর স্বতন্ত্র সুবিধা |

## ৩. Unicode → Bijoy: byte-level ফলাফল

### ৩.১ সাধারণ কঠিন corpus

ঋ-কার, র-ফলা, যুক্তবর্ণ, ড়/ঢ়/য়, দাড়ি, smart quote, em-dash ও ellipsis-সহ corpus চালিয়ে দেখা গেছে, দুই converter-ই ঋ-কারে একটি মাত্র byte ব্যবহার করে না। base-character context অনুযায়ী `…` এবং `„`—দুই legacy form-ই ব্যবহার করে। এটি গুরুত্বপূর্ণ, কারণ global `„ → …` বা `… → „` rule দিলে কিছু শব্দ ভেঙে যায়। AvroJoy এখন এই context-sensitive native behavior ধরে রেখেছে। [1] [2] [5]

তবে standalone Unicode ellipsis (`…`) ক্ষেত্রে ShumanBD পরীক্ষায় সেটিকে র-কারের মতো legacy byte-তে নামিয়ে দিয়েছে। AvroJoy input ellipsis-কে literal three-dot form-এ আলাদা করে, যাতে DOCX ও সাধারণ punctuation র-কার byte-এর সঙ্গে গুলিয়ে না যায়। একইভাবে controlled corpus-এ ShumanBD em-dash raw Unicode রেখেছে, আর AvroJoy SutonnyMJ-উপযুক্ত dash byte ব্যবহার করে। ফলে document output-এর জন্য AvroJoy-এর punctuation policy বেশি নির্দিষ্ট। [1] [2] [5]

### ৩.২ যুক্তবর্ণ

২৬টি representative form—যেমন `ন্ত`, `ন্থ`, `ন্দ`, `ন্ধ`, `ন্ট`, `ল্ল`, `প্র`, `ক্র`, `গ্র`, `শ্র`, `জ্ঞ`, `ক্ষ`, `ত্র`, `ত্ত`, `দ্ধ`, `ষ্ঠ`, `র্ক`, `র্গ`, `র্দ`, `র্ফ`, `প্রজ্ঞা`, `লক্ষ্মী`, `শ্রদ্ধা`, `কর্ম`, `অর্থ`, `রক্ত`—এ ShumanBD এবং AvroJoy-এর raw Bijoy output হুবহু একই ছিল। অর্থাৎ standard common-conjunct রূপান্তরে ShumanBD থেকে আলাদা কোনো mapping নেওয়ার দরকার ছিল না। [2]

পরবর্তী full table audit-এ ১৫২টি complete supported conjunct পরীক্ষা করা হয়েছে। এই audit-এ রেফ, র-ফলা, য-ফলা, ব-ফলা, ম-ফলা, ল-ফলা, ক্ষ/জ্ঞ/শ্র/হ্ম, vowel-adjacent এবং punctuation-adjacent context অন্তর্ভুক্ত। final audit-এ byte mismatch, standalone round-trip deviation এবং contextual round-trip deviation—তিনটিই শূন্য। [3]

নিচের পাঁচটি case-এ legacy library একটি byte-তে দুই আলাদা Unicode form collapse করছিল। ShumanBD-এর raw form এবং SutonnyMJ glyph check অনুসরণ করে AvroJoy কেবল এই পাঁচটির আলাদা, reversible byte সংরক্ষণ করেছে। এটি কোনো global replacement নয়।

| Unicode form | আগে সম্ভাব্য ambiguity | এখন AvroJoy byte | Bijoy→Unicode ফল |
|---|---|---|---|
| `ক্ষ্ন` | `ক্ষ্ণ`-এর সঙ্গে একই ligature byte হতে পারত | `¶&b` | `ক্ষ্ন` |
| `ক্ষ্ণ` | `ক্ষ্ন`-এর সঙ্গে একই ligature byte হতে পারত | `¶&Y` | `ক্ষ্ণ` |
| `ণ্ণ` | `ণ্ন`-এর সঙ্গে একই ligature byte হতে পারত | `Y&Y` | `ণ্ণ` |
| `ণ্ন` | `ণ্ণ`-এর সঙ্গে একই ligature byte হতে পারত | `Y&b` | `ণ্ন` |
| `ত্রূ` | long-u inverse mapping হারাতে পারত | `Î~` | `ত্রূ` |

**সীমা:** সব syntactically possible hasant chain অর্থপূর্ণ বাংলা শব্দ বা SutonnyMJ-defined ligature নয়। তাই ৩৫ ব্যঞ্জনের pair/triple exploratory matrix তথ্য হিসেবে চালানো হয়েছে, কিন্তু final acceptance standard রাখা হয়েছে library-defined complete conjunct table এবং real glyph output। এই পদ্ধতি বিরল কিন্তু বৈধ যুক্তবর্ণ ঠিক রাখে, আবার অপ্রচলিত random chain-এর জন্য অযথা production mapping বদলায় না।

## ৪. Bijoy → Unicode ও round-trip

AvroJoy-এর লক্ষ্য হলো direction change-এ original Unicode পাঠ ফেরত আনা। Controlled corpus-এ নিজের Bijoy output reverse করলে AvroJoy মূল পাঠ ফেরত দিয়েছে। ShumanBD-তে একই পরীক্ষা করার সময় lower Bijoy field-এর output reverse করার পর existing upper Unicode field পরিষ্কার না করে result append হয়েছে; ফলে UI state না পরিষ্কার করলে round-trip result পড়া কঠিন হয়। এটি mapping ব্যর্থতার চূড়ান্ত প্রমাণ নয়, তবে workflow-ঝুঁকি। [1] [2]

Bijoy encoding font-dependent হওয়ায় একই byte non-SutonnyMJ font-এ Bengali glyph হিসেবে দেখাবে না—এটি legacy Bijoy-এর মৌলিক সীমা, কোনো একক converter-এর bug নয়। AvroJoy এ কারণে Bengali run-এ SutonnyMJ এবং English run-এ Times New Roman metadata দেয়। Word-এ অন্য ফন্টে জোর করে বদলালে legacy byte ভিজ্যুয়ালি বিকৃত হতে পারে; source formatting রাখা নিরাপদ। [4] [5]

## ৫. DOCX, font এবং publishing workflow

ShumanBD-এর public page-এ text conversion, copy/clear/fullscreen এবং metric দেখা গেছে; পরীক্ষার সময় DOCX/TXT upload, Word run-font policy বা footnote/endnote-aware output দৃশ্যমান ছিল না। তাই সেগুলোর অনুপস্থিতিকে চূড়ান্ত product claim না ধরে **“publicly tested flow-এ যাচাই করা যায়নি”** বলা সঠিক। [1]

AvroJoy-এ file conversion আলাদা workflow। এটি DOCX/TXT input, drag-and-drop, file removal, download এবং print/PDF preview দেয়। Word output-এর জন্য Bengali/English dual-size metadata, note marker protection, Endnote/Footnote quote pair lock, smart quote direction এবং size-pair regression আছে। DOCX integrity audit-এ 14/12, 10/8, 16/14 এবং 18/16 point alternate size profile-এ size-pair ও font slot mismatch শূন্য পাওয়া গেছে। [4] [5]

## ৬. UX ও ব্যবহারিক পার্থক্য

ShumanBD-এর প্রধান সুবিধা হলো কম নিয়ন্ত্রণে দ্রুত কাজ: উপরে Unicode, নিচে Bijoy, দুইটি conversion button, copy/clear/fullscreen এবং count। নতুন ব্যবহারকারীর জন্য এই সরলতা ভালো। [1]

AvroJoy-এর interface তুলনামূলকভাবে বড়, কারণ এটি document preparation-এর জন্য ডিজাইন করা। এর two-pane editor, font-size control, selection-copy, live conversion, recent history, dark mode, file tab, print/PDF preview এবং PWA install path আছে। এই অতিরিক্ত ক্ষমতা সাধারণ এক-লাইন conversion-এর জন্য অপ্রয়োজনীয় মনে হতে পারে, কিন্তু গবেষণাপত্র, reference list, Word document এবং mixed Bangla-English layout-এর জন্য কার্যকর। [5]

## ৭. কোন আচরণ গ্রহণ করা উচিত নয়

নিচের আচরণ ShumanBD-তে দেখা গেছে বা তার public UI-flow থেকে বোঝা গেছে; AvroJoy-এ এগুলো কপি করা উচিত নয়।

| আচরণ | কেন গ্রহণযোগ্য নয় |
|---|---|
| Standalone ellipsis-কে র-কার legacy byte বানানো | punctuation ও র-কারের glyph অর্থ মিশে যায়; DOCX-এ ভুল glyph হতে পারে |
| Raw Unicode em-dash Bijoy output-এ রেখে দেওয়া | SutonnyMJ-only output policy ভঙ্গ করে; font-based visual consistency কমায় |
| Reverse conversion existing field-এ append হওয়া | round-trip যাচাই ও copy flow বিভ্রান্তিকর হয় |
| Font-agnostic legacy byte display | SutonnyMJ ছাড়া glyph বিকৃত হবে; Bengali/English run আলাদা করা ভালো |
| Random conjunct chain-এর জন্য global byte replacement | ঋ-কারের আগের সমস্যার মতো অন্য context ভেঙে যেতে পারে |

## ৮. চূড়ান্ত মূল্যায়ন

সাধারণ text conversion-এর standard অংশে ShumanBD শক্তিশালী এবং AvroJoy তার সঙ্গে সমতুল্য byte output দেয়। যুক্তবর্ণের ২৬টি standard comparison case-এ কোনো byte difference পাওয়া যায়নি। তাই ShumanBD থেকে “সব mapping বদলে দেওয়া” দরকার ছিল না এবং করা হয়নি। বরং controlled comparison ব্যবহার করে শুধু পাঁচটি ambiguous conjunct form আলাদা করা হয়েছে, যা AvroJoy-এ reversible এবং SutonnyMJ glyph-verified। [2] [3]

অন্যদিকে AvroJoy-এর লক্ষ্য শুধু string conversion নয়, বরং Word-ready publishing workflow। DOCX/TXT, font-aware dual-size output, note-aware metadata, print/PDF, history এবং PWA-এর কারণে এর ব্যবহারক্ষেত্র বড়। সবচেয়ে নিরাপদ ভবিষ্যৎ নীতি হলো: ShumanBD-কে byte reference ও UX inspiration হিসেবে ব্যবহার করা, কিন্তু AvroJoy-এর verified round-trip, document safety এবং font policyকে final acceptance standard রাখা।

## ৯. ব্যবহারকারীর জন্য বাস্তব সুপারিশ

| ব্যবহার | কোনটি সুবিধাজনক | কারণ |
|---|---|---|
| দ্রুত এক-দুই লাইনের Unicode ⇄ Bijoy পরীক্ষা | যেকোনোটি | Standard output-এ মূলত সমতা |
| জটিল যুক্তবর্ণ/বিরল form যাচাই | AvroJoy | ১৫২ mapping audit এবং targeted reversible byte coverage |
| DOCX/TXT batch conversion | AvroJoy | File conversion ও Word metadata workflow |
| বাংলা + English reference list | AvroJoy | SutonnyMJ Bengali এবং 2pt ছোট Times New Roman English policy |
| Word note, endnote বা footnote | AvroJoy | note/reference regression coverage |
| খুব সরল on-page conversion | ShumanBD বা AvroJoy text tab | ShumanBD-এর UI সংক্ষিপ্ত; AvroJoy-এ অতিরিক্ত tools আছে |

## References

[1]: https://www.shumanbd.com/ "ShumanBD Unicode to Bijoy Converter — public converter UI and controlled test source"
[2]: ./audit_conjunct_reference_compare.ts "AvroJoy project-local controlled standard-conjunct byte comparison"
[3]: ./audit_conjunct_library_table.ts "AvroJoy project-local 152 supported-conjunct byte and round-trip audit"
[4]: ./audit_docx_edit_stability.ts "AvroJoy project-local DOCX edit-stability regression suite"
[5]: ./client/src/lib/converter.ts "AvroJoy conversion engine and font-aware conversion policy"
