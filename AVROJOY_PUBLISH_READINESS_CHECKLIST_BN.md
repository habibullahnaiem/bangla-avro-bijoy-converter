# AvroJoy প্রকাশের আগে করণীয় ও go/no-go checklist

## বর্তমান অবস্থা

Code-level release gate ভালো অবস্থায় আছে: TypeScript check ও production build pass করেছে; core conversion, quotation, e-kar, r-fola, contextual R-kar, 152টি supported conjunct এবং DOCX edit-stability audit pass করেছে। DOCX audit-এ SutonnyMJ বাংলা, Times New Roman English, 2pt size difference, Endnote/Footnote behavior, font repair ও simulated edit case-ও pass করেছে। [1] [2]

তবে public launch-এর আগে শুধু automated test যথেষ্ট নয়। Word, PWA offline, real mobile এবং deployed asset—এই চারটি পরিবেশে শেষ manual smoke test দরকার।

> **Go decision:** নিচের “অবশ্যই” তালিকার প্রতিটি item pass হলে publish করা যুক্তিসঙ্গত। কোনো conversion, DOCX, PWA offline বা missing-asset failure থাকলে আগে সেটি ঠিক করতে হবে।

## ১. অবশ্যই প্রকাশের আগে

| অগ্রাধিকার | করণীয় | কেন জরুরি | Pass criterion |
|---|---|---|---|
| Must | **Real Word smoke test** | DOCX feature-এর আসল মূল্য Word-এ দেখা যায় | একটি বাস্তব `.docx`-এ Bangla/English, table, bold/italic, indent, Footnote/Endnote নিয়ে convert করে desktop Word-এ edit/save/reopen করা যায় |
| Must | **PWA install ও offline check** | Site offline ব্যবহারের প্রতিশ্রুতি দেয় | fresh browser-এ install, app থেকে reopen, পরে network বন্ধ করে converter খোলে ও text conversion চলে |
| Must | **Phone UI check** | Mobile ব্যবহারকারীর জন্য text box, direction switch ও button গুরুত্বপূর্ণ | 375px phone view বা আসল ফোনে কোনো clipped button, overlap, unreadable text বা textarea-scroll সমস্যা নেই |
| Must | **Published asset smoke test** | build-এর `/manus-storage/` fonts/images runtime-এ resolve হয় | publish-ready preview-এ logo, banner, SutonnyMJ, Hind Siliguri, manifest ও service worker-এ 404 নেই |
| Must | **Copy/selection check** | output copy site-এর প্রধান কাজ | mouse/touch selection, Ctrl/Cmd+C, copy button এবং Word paste—সব ঠিক কাজ করে |
| Must | **Known limitation wording** | user trust রক্ষা করে | Help/FAQ-এ সংক্ষেপে বলা: legacy SutonnyMJ text অন্য converter-এ reverse করলে profile-byte difference হতে পারে; Unicode original সংরক্ষণ করুন |

## ২. প্রকাশের আগে করলে ভালো

| অগ্রাধিকার | কাজ | প্রত্যাশিত লাভ |
|---|---|---|
| Should | **Short “কীভাবে ব্যবহার করবেন” card** | নতুন user জানবে Unicode লিখে Bijoy নেবে, Word-এ SutonnyMJ লাগবে, এবং file flow কী |
| Should | **Privacy/local-history note** | user বুঝবে recent history device-local; document processing browser-based; serverে file রাখার দাবি নেই |
| Should | **Version/changelog entry** | user bug report দিলে কোন release-এ সমস্যা বোঝা সহজ হবে |
| Should | **Feedback route** | “সমস্যা হলে sample text/DOCX দিন” ধরনের একটি contact/instruction future bug triage সহজ করবে |
| Should | **Keyboard accessibility pass** | Tab focus, visible focus ring, Enter/Space এবং labels যাচাই করলে toolটি সবার জন্য ব্যবহারযোগ্য হয় |
| Should | **First-launch cache update test** | service-worker update পেলে পুরোনো cache থেকে নতুন release-এ যাওয়া ঠিক আছে কি না দেখা যায় |

## ৩. প্রথম release-এর পরে করা যাবে

| অগ্রাধিকার | কাজ | কেন এখন blocker নয় |
|---|---|---|
| Later | JavaScript code-splitting/performance tuning | বর্তমান 768.54 kB minified JS build advisory threshold-এর ওপরে, কিন্তু build failure নয়; core conversion ঠিক আছে |
| Later | ShumanBD-compatible optional export profile | default behavior না বদিয়ে আলাদা fully-tested profile হিসেবে দিতে হবে |
| Later | Unicode-centered unified conversion standard | বড় ecosystem initiative; current public release-এর জন্য বাধ্যতামূলক নয় |
| Later | Expanded public compatibility corpus | user-contributed DOCX/legacy sample নিয়ে versioned regression suite বাড়ানো যাবে |
| Later | Custom domain, search metadata ও analytics refinement | product discovery উন্নত করবে, কিন্তু converter correctness-এর আগে নয় |

## ৪. Release checklist: একবারে চালানোর ক্রম

| ধাপ | কাজ | ফল লিখবেন |
|---:|---|---|
| 1 | বর্তমান automated regression command চালান | pass/fail এবং কোনো warning |
| 2 | Desktop browser-এ mixed stress sample convert, select/copy, direction switch করুন | pass/fail |
| 3 | একটি বাস্তব Word file convert, edit, save ও reopen করুন | pass/fail, screenshot/short note |
| 4 | Phone viewport/real phone-এ converter ও file card পরীক্ষা করুন | pass/fail |
| 5 | PWA install, reload এবং offline conversion পরীক্ষা করুন | pass/fail |
| 6 | Final checkpoint-এর preview-এ fonts/images/manifest/service worker 404 check করুন | pass/fail |
| 7 | FAQ/privacy/known limitation wording একবার পড়ে নিন | approved/revise |

## ৫. Go / no-go সিদ্ধান্ত

| Decision | কখন |
|---|---|
| **Go** | সব Must item pass, output/Word/PWA-তে কোনো data-loss symptom নেই, এবং limitation wording পরিষ্কার |
| **Conditional go** | শুধু non-blocking performance advisory বা cosmetic micro-polish বাকি; core conversion ও all manual gates pass |
| **No-go** | বাংলা byte/glyph ভাঙা, copy/selection mismatch, DOCX edit করলে text corruption, offline converter না খোলা, বা required asset 404 |

## আমার সুপারিশ

এখন বড় নতুন feature না যোগ করে তিনটি বাস্তব পরীক্ষা আগে করুন: **একটি আপনার নিজের জটিল Word file**, **আপনার ফোনে install/offline**, এবং **final preview-এ font/banner asset**। এই তিনটি ঠিক থাকলে current application প্রথম public release-এর জন্য শক্ত অবস্থায় আছে। এরপর checkpoint নিয়ে Management UI-এর **Publish** button ব্যবহার করে প্রকাশ করা যাবে; এখানে কোনো production logic পরিবর্তন করা হয়নি।

## References

[1]: ./SHUMANBD_AVROJOY_SIX_BYTE_DIFFERENCES_TECHNICAL_BN.md "Established converter behavior and compatibility constraints"
[2]: ./AVROJOY_TO_SHUMANBD_REVERSE_CHANGE_AUDIT_BN.md "Known cross-converter scope to document without altering native output"
