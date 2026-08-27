# বিকল্প Bijoy conversion mechanism: প্রাথমিক public evidence

## পর্যবেক্ষিত উৎস

| উৎস | প্রকাশ্যভাবে বলা scope | বর্তমান প্রশ্নে প্রাসঙ্গিকতা |
|---|---|---|
| `almehady/Bijoy-to-Unicode-File-Converter` | Bijoy/SutonnyMJ/ANSI text file থেকে Unicode; codepoint mapping ও pre-kar, ra-halant, nukta, conjunct reordering; English line pass-through | Reverse conversion ও file workflow-এর একটি বিকল্প, কিন্তু documented evidence-এ ambiguous Unicode conjunct origin পুনরুদ্ধারের দাবি নেই |
| `JehadurRE/Bijoy2Unicode` | Browser/Node-এ Bijoy/SutonnyMJ text এবং DOCX/ODT/RTF/HTML/TXT থেকে Unicode; font-aware run detection, inherited font resolution, English Latin-font preservation, leftover scan | Mixed-font legacy-document recovery-তে সম্ভাব্য শক্তিশালী বিকল্প; README নিজেই pure-ASCII Bijoy ambiguity স্বীকার করে; inspected documentation-এ `ক্ষ্ন/ক্ষ্ণ`, `ণ্ণ/ণ্ন`, `ত্রূ` origin-provenance-lossের universal solution দাবি নেই |
| `OpenBangla/poriborton` | Rust library; Unicode ↔ Bengali ANSI interconversion, specifically Unicode → Bijoy 2000 profile; test suite and versioned mapping data present | Bidirectional programmatic conversion-এর বাস্তব বিকল্প profile, কিন্তু README-তে ambiguous-conjunct provenance retention বা universal lossless round-trip claim নেই |

## গুরুত্বপূর্ণ সীমা

Legacy Bijoy string একাই source Unicode বানানের provenance বহন করে না। Forward converter যদি দুই আলাদা Unicode form-কে একই legacy sequence-এ নামিয়ে দেয়, পরে কোনো reverse mapping-table কেবল সেই raw string দেখে নিশ্চিতভাবে original form উদ্ধার করতে পারে না। সমাধানের জন্য হয় encoder-কে আলাদা lossless representation রাখতে হবে, নয়তো original Unicode/provenance sidecar বা document-level context রাখতে হবে।

## Live tool cross-check

`bijoy2unicode.jehadurre.me` নিজেকে শুধু **Bijoy → Unicode** browser-local file converter হিসেবে উপস্থাপন করে। `.docx`, `.doc`, `.odt`, `.rtf`, `.html`, `.txt` support, known-Bijoy-font detection, inherited Word-font resolution এবং force-convert option দেখানো হয়েছে। এটি mixed-font legacy Word file উদ্ধার করার বাস্তব mechanism হতে পারে। কিন্তু এটি Unicode → Bijoy encoder নয়; তাই আগে হারিয়ে যাওয়া `ক্ষ্ন/ক্ষ্ণ`, `ণ্ণ/ণ্ন` বা `ত্রূ` source distinction পুনর্গঠনের উপায় হিসেবে বিবেচ্য নয়।

## উৎস

- https://github.com/almehady/Bijoy-to-Unicode-File-Converter
- https://github.com/JehadurRE/Bijoy2Unicode
- https://github.com/JehadurRE/Bijoy2Unicode/tree/main/packages/bijoy2unicode
- https://bijoy2unicode.jehadurre.me/
- https://github.com/openbangla/poriborton
