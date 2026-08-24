# ShumanBD reverse-compatibility: নিরাপদ patch strategy

## সুপারিশ এক বাক্যে

AvroJoy-এর বর্তমান byte output **default হিসেবে অপরিবর্তিত** রাখা উচিত। ShumanBD-তে পরে Bijoy → Unicode করার বিশেষ প্রয়োজন থাকলে একটি আলাদা, স্পষ্টভাবে নির্বাচিত **“ShumanBD-compatible output”** profile যোগ করা উচিত। এই profile কেবল দুইটি প্রমাণিত semantic pattern বদলাবে: `ঙ্ক্ষ` এবং পরীক্ষিত `দারিদ্র্য` + e-kar suffix context।

> **সঠিক patch হলো source-aware ও opt-in compatibility profile; global character replacement নয়।**

## কেন default behavior বদলানো উচিত নয়

AvroJoy-এর native output নিজের round-trip-এ ঠিক কাজ করে, ShumanBD থেকে আসা alternate legacy byte-ও পড়ে, এবং যুক্তবর্ণ, R-kar, e-kar, quotation, DOCX/TXT ও font-aware output নিয়ে দীর্ঘ regression coverage ইতোমধ্যে আছে। সব output হঠাৎ ShumanBD-style করে দিলে বর্তমান সঠিক byte form এবং Word output-এর আচরণ অকারণে বদলে যেতে পারে। [1] [2]

এ কারণে দুইটি লক্ষ্যকে আলাদা রাখা ভালো:

| Profile | উদ্দেশ্য | Byte policy |
|---|---|---|
| **AvroJoy native** — default | বর্তমান সব feature ও byte behavior অক্ষুণ্ণ রাখা | বর্তমান canonical mapping অপরিবর্তিত |
| **ShumanBD-compatible** — opt-in | AvroJoy output পরে ShumanBD-তে reverse করার সুবিধা | কেবল যাচাইকৃত দুই pattern-এ alternate byte form |

## Patch 1 — `ঙ্ক্ষ`-এর জন্য semantic output override

### বর্তমান সমস্যা

বর্তমান library-native rule `ঙ্ক্ষ → •¶` দেয়। AvroJoy এটি নিজে ঠিক পড়ে, কিন্তু ShumanBD এই `•¶` pair-কে `ঙ্ক্ষ` হিসেবে ফিরিয়ে না দিয়ে `আকাক্স…` ধরনের ভুল ফল দেয়। পূর্বের controlled test-এ `আকাঙ্ক্ষা`, `আকাঙ্ক্ষিত`, `আকাঙ্ক্ষাপূরণ`, `অনাকাঙ্ক্ষিত`সহ পরীক্ষিত ১৫/১৫টি `ঙ্ক্ষ` word family বদলেছে। [1]

### নিরাপদ rule

ShumanBD-compatible profile-এ **Unicode semantic fragment** `ঙ্ক্ষ` শনাক্ত করে library call-এর আগে একটি private placeholder বসাতে হবে। library conversion শেষ হলে সেই placeholder কেবল `O&¶`-তে ফিরবে।

| Unicode semantic input | Native output | Compatible output |
|---|---|---|
| `ঙ্ক্ষ` | `•¶` | `O&¶` |
| `আকাঙ্ক্ষা` | `AvKv•¶v` | `AvKvO&¶v` |
| `অনাকাঙ্ক্ষিত` | `AbvKvw•¶Z` | ShumanBD-readable decomposed `O&¶` form |

এখানে placeholder দরকার, কারণ output-এ সব `•` বা সব `¶` বদলানো যাবে না। `•L` (ঙ্খ) এবং `•N` (ঙ্ঘ) আলাদা control test-এ ShumanBD ঠিক পড়েছে; global `•` replacement করলে বরং কাজের byte নষ্ট হওয়ার ঝুঁকি তৈরি হবে। [1] [3]

## Patch 2 — `দারিদ্র্য`-র পরে e-kar context-এর জন্য semantic override

### বর্তমান সমস্যা

AvroJoy-এর native output-এ `দারিদ্র্যের`-র e-kar এবং `্র্য` অংশের legacy order ShumanBD ঠিক logical Unicode order-এ ফেরায় না। ফল হয় `দারিদ্র্েযর`। একইভাবে `দারিদ্র্যেও → দারিদ্র্েযও` হয়েছে। কিন্তু `দারিদ্র্য`, `দারিদ্র্যজনিত`, `দারিদ্র্যসীমা`, এবং `দারিদ্র্যবিমোচন` ঠিক ফিরেছে; সব `র্য` বা সব e-kar শব্দে patch দেওয়া তাই ভুল হবে। [1]

### যাচাইকৃত alternate byte

ShumanBD নিজে `দারিদ্র্যের`-কে `` `vwi‡`ª¨i `` দেয়। AvroJoy সেই ShumanBD form আবার ঠিক `দারিদ্র্যের` করে পড়তে পারে। অর্থাৎ alternate output form দুদিকেই গ্রহণযোগ্য—কিন্তু এই প্রমাণ এখনও `দারিদ্র্যের`-এর জন্য direct। [4]

### নিরাপদ rule

এই অংশে global e-kar/র-ফলা swap নিষিদ্ধ। Compatibility profile-এ কেবল সম্পূর্ণ semantic prefix `দারিদ্র্যে` (এবং আলাদা verified test দিয়ে `দারিদ্র্যেও`) placeholder দিয়ে protect করতে হবে। তারপর ShumanBD-verified byte prefix বসিয়ে বাকি suffix স্বাভাবিক converter path-এ যাবে।

| Context | Native output policy | Compatible policy |
|---|---|---|
| `দারিদ্র্যের` | বর্তমান native byte বজায় | ShumanBD form `` `vwi‡`ª¨i `` |
| `দারিদ্র্যেও` | বর্তমান native byte বজায় | ShumanBD reference form capture করে only that exact semantic context-এ ব্যবহার |
| `কার্যের`, `সূর্যের`, `সৌন্দর্যের` | অপরিবর্তিত | অপরিবর্তিত |
| `দারিদ্র্যজনিত` | অপরিবর্তিত | অপরিবর্তিত |

এখানে `দারিদ্র্যেও`-র ShumanBD reference byte implementation-এর আগে আলাদাভাবে record ও reverse-test করতে হবে। অনুমানভিত্তিক byte বসানো উচিত নয়।

## কোন patch করা যাবে না

| প্রস্তাব | কেন ঝুঁকিপূর্ণ |
|---|---|
| সব `•¶` → `O&¶` replace | semantic origin না জেনে raw output বদলালে অন্য legacy text বা future mapping ক্ষতিগ্রস্ত হতে পারে |
| সব `•` বদলানো | ঙ্খ/ঙ্ঘ control case অকারণে নষ্ট হবে |
| সব `‡`/`¨` swap | word-initial/mid-word e-kar, র-ফলা ও established format ভেঙে দিতে পারে |
| সব output ShumanBD-style করা | বর্তমান default byte contract ও DOCX/TXT output অপ্রয়োজনীয়ভাবে বদলে যাবে |
| শুধু UI preview-তে patch | Copy, TXT, DOCX এবং print/PDF-তে আলাদা byte হয়ে যাবে |

## বাস্তবায়নের কাঠামো

`convertToBijoy`-কে সরাসরি global replace দিয়ে বদলানোর বদলে একটি ঐচ্ছিক profile parameter নেওয়া উচিত:

```ts
type BijoyOutputProfile = "native" | "shumanbd-compatible";
```

`native` default থাকবে। `shumanbd-compatible` হলে কেবল profile-aware protection/restore stage চলবে। এই parameter একইভাবে editor, copy action, TXT, DOCX main runs, table cells, footnotes/endnotes এবং print/PDF generation-এ pass করতে হবে। অন্যথায় screen-এ এক byte আর downloaded DOCX-এ আরেক byte হওয়ার ঝুঁকি থাকবে। [5]

## বাধ্যতামূলক regression gate

কোনো patch প্রয়োগের আগে ও পরে নিচের test contract পূরণ করতে হবে।

| Test class | কী নিশ্চিত করবে |
|---|---|
| Native non-regression | বর্তমান output byte একটিও বদলায়নি |
| Compatibility positive cases | `আকাঙ্ক্ষা`, `অনাকাঙ্ক্ষিত`, `দারিদ্র্যের`, `দারিদ্র্যেও` ShumanBD reverse-এ ঠিক |
| Compatibility negative cases | `ঙ্খ`, `ঙ্ঘ`, `কার্যের`, `সূর্যের`, `সৌন্দর্যের`, `দারিদ্র্যজনিত` বদলায়নি |
| Bidirectional acceptance | AvroJoy native ও compatible—দুই form-ই Unicode-এ ঠিক ফেরায় |
| All-surface check | editor, copy, TXT, DOCX, table, footnote/endnote, print/PDF একই profile মেনে চলে |
| Existing full suite | TypeScript, build, core, quote, e-kar, r-fola, R-kar, conjunct ও DOCX stability audit সব pass |

SutonnyMJ glyph specimen-এ `O&¶` form-এর rendering এবং compatibility DOCX-এ Bengali/English dual-font metadataও visually/structurally যাচাই করতে হবে।

## সুপারিশের অগ্রাধিকার

প্রথমে **কোনো default mapping পরিবর্তন নয়**। যদি user সত্যিই AvroJoy-generated Bijoy ShumanBD-তে reverse করে নিয়মিত ব্যবহার করেন, তবে আলাদা ShumanBD-compatible profile-এ আগে শুধু `ঙ্ক্ষ` patch করা সবচেয়ে কম-ঝুঁকির প্রথম ধাপ। এটি ১৫/১৫ targeted failure এবং alternate decomposed form—দুই দিক থেকেই সবচেয়ে ভালো প্রমাণিত। তারপর `দারিদ্র্য` e-kar patch কেবল সম্পূর্ণ reference-form capture এবং corpus regression পাস করলে যোগ করা উচিত।

এই নথি strategy ও test plan মাত্র। কোনো production conversion logic পরিবর্তন করা হয়নি।

## References

[1]: ./AVROJOY_TO_SHUMANBD_REVERSE_CHANGE_AUDIT_BN.md "Controlled AvroJoy → ShumanBD reverse change investigation"
[2]: ./SHUMANBD_AVROJOY_SIX_BYTE_DIFFERENCES_TECHNICAL_BN.md "Legacy byte alias and inverse-mapping analysis"
[3]: ./node_modules/.pnpm/@abdalgolabs+ansi-unicode-converter@1.0.5/node_modules/@abdalgolabs/ansi-unicode-converter/dist/data.js "Installed conversion mapping tables"
[4]: ./../tmp/shumanbd_e_kar_reference_probe.md "Controlled ShumanBD byte capture and reciprocal AvroJoy acceptance check"
[5]: ./client/src/lib/converter.ts "AvroJoy conversion and file-processing pipeline"
