# AvroJoy → ShumanBD reverse conversion: কোন শব্দ বদলাতে পারে — বিস্তারিত অনুসন্ধান

## সরাসরি সিদ্ধান্ত

AvroJoy-এ Unicode/অভ্র থেকে Bijoy করে সেই raw Bijoy ShumanBD-তে Bijoy → Unicode নিলে, পরীক্ষিত ১৮৩টি সারিতে **দুটি নির্দিষ্ট pattern-এ আসল বানান বদলেছে**। প্রথমটি `ঙ্ক্ষ`-যুক্ত শব্দ; দ্বিতীয়টি `দারিদ্র্য`-র মতো একটি বিশেষ `্র্য` cluster-এর পরে e-kar (`ে`) দিয়ে শুরু হওয়া suffix। অন্য অনেক জটিল যুক্তবর্ণ, ঋ-কার, ক্ষ, শ্রু, স্ফূ, ঙ্খ, ঙ্ঘ এবং অধিকাংশ র্য-যুক্ত শব্দ এই cross-converter পথে ঠিক ফিরেছে। [1] [2]

> এটি AvroJoy-এর নিজের Bijoy → Unicode round-trip error নয়। AvroJoy তার output নিজে ঠিক পড়ে এবং ShumanBD-এর legacy forms-ও গ্রহণ করে। সমস্যা দেখা গেছে শুধু **AvroJoy output → ShumanBD reverse** পথে।

## পরীক্ষার পদ্ধতি ও সীমা

তিনটি controlled corpus চালানো হয়েছে। প্রতিটি শব্দ AvroJoy-এ Unicode → Bijoy করা হয়, raw output কোনো re-encoding বা manual change ছাড়া ShumanBD-র Bijoy → Unicode ঘরে দেওয়া হয়, তারপর প্রতিটি line মূল শব্দের সঙ্গে একই index-এ তুলনা করা হয়। [1] [2]

| Test corpus | সারি | উদ্দেশ্য | ফল |
|---|---:|---|---|
| বিস্তৃত complex-word corpus | 119 | ক্ষ, শ্রু, স্ফূ, ঋ-কার, রেফ/র-ফলা, `ঙ্ক্ষ`, `্র্য`, তত্ত্ব ইত্যাদি | 11টি আসল পরিবর্তন; 8টি harmless Unicode-form difference |
| Targeted pattern corpus | 45 | `ঙ্ক্ষ` এবং `দারিদ্র্য` + suffix context | 17টি আসল পরিবর্তন; 3টি harmless form difference |
| Control corpus | 19 | `•L`/`•N` legacy token: ঙ্খ ও ঙ্ঘ | আসল পরিবর্তন 0; `য়`/`য়` form difference 1 |
| **মোট executed rows** | **183** | overlapping corpus দিয়ে pattern পুনরায় যাচাই | **28 বার আসল পরিবর্তন; 12 বার harmless form difference** |

একই শব্দ/পরিবার একাধিক corpus-এ ইচ্ছাকৃতভাবে রাখা হয়েছে, যাতে একটি ফল একবারের দুর্ঘটনা না হয়ে pattern কি না বোঝা যায়। ২৮টি আসল পরিবর্তন ১৭টি আলাদা example word-এ ঘটেছে। এই report কোনো অভিধানের সব শব্দের পূর্ণ গণনা নয়; বরং কোন **legacy byte pattern** ঝুঁকির কারণ, সেটির reproducible সীমিত অনুসন্ধান।

## কোন ধরনের পার্থক্যকে “আসল পরিবর্তন” ধরা হয়েছে

ShumanBD কখনো একই দৃশ্যমান বানানকে ভিন্ন Unicode form-এ ফেরত দেয়। যেমন `য়`-এর বদলে `য়`, অথবা `ো`-এর বদলে `ে` + `া`। এগুলো code point আলাদা হলেও সাধারণত চোখে ও অর্থে একই; এই রিপোর্টে সেগুলোকে **harmless Unicode-form difference** বলা হয়েছে, বানান বদল বলা হয়নি।

অন্যদিকে, `আকাঙ্ক্ষা → আকাক্সক্ষা` বা `দারিদ্র্যের → দারিদ্র্েযর`-এ অক্ষরের গঠন/ক্রম বদলে যায়। এগুলোকে **আসল পরিবর্তন** হিসেবে গণনা করা হয়েছে।

## Pattern 1 — `ঙ্ক্ষ` থাকলে: পরীক্ষিত সব ক্ষেত্রে পরিবর্তন

AvroJoy-এর installed converter table-এ `ঙ্ক্ষ`-র canonical legacy output হল `•¶`। AvroJoy-এর inverse mapping এই দুই-byte composite একসঙ্গে বুঝে আবার `ঙ্ক্ষ` করে। ShumanBD-এর reverse path এই composite pair-টিকে একইভাবে পড়েনি; ফল হিসেবে `ঙ্ + ক্ষ`-এর বদলে `ক্ + স + ক্ষ`-ধরনের গঠন দেখা গেছে। [3] [4]

| মূল শব্দ | AvroJoy raw Bijoy | ShumanBD থেকে ফেরত | ফল |
|---|---|---|---|
| আকাঙ্ক্ষা | `AvKv•¶v` | আকাক্সক্ষা | বদলেছে |
| আকাঙ্ক্ষিত | `AvKvw•¶Z` | আকাক্সিক্ষত | বদলেছে |
| আকাঙ্ক্ষীদের | `AvKv•¶x‡`i` | আকাক্সক্ষীদের | বদলেছে |
| আকাঙ্ক্ষার | `AvKv•¶vi` | আকাক্সক্ষার | বদলেছে |
| আকাঙ্ক্ষাময় | `AvKv•¶vgq` | আকাক্সক্ষাময় | বদলেছে |
| আকাঙ্ক্ষাপূরণ | `AvKv•¶vc~iY` | আকাক্সক্ষাপূরণ | বদলেছে |
| আকাঙ্ক্ষাবিরোধী | `AvKv•¶vwe‡ivax` | আকাক্সক্ষাবিরোধী | বদলেছে |
| আকাঙ্ক্ষাহীন | `AvKv•¶vnxb` | আকাক্সক্ষাহীন | বদলেছে |
| আকাঙ্ক্ষাজনিত | `AvKv•¶vRwbZ` | আকাক্সক্ষাজনিত | বদলেছে |
| অনাকাঙ্ক্ষা | `AbvKv•¶v` | অনাকাক্সক্ষা | বদলেছে |
| অনাকাঙ্ক্ষিত | `AbvKvw•¶Z` | অনাকাক্সিক্ষত | বদলেছে |
| অনাকাঙ্ক্ষিতভাবে | `AbvKvw•¶Zfv‡e` | অনাকাক্সিক্ষতভাবে | বদলেছে |
| অনাকাঙ্ক্ষার | `AbvKv•¶vi` | অনাকাক্সক্ষার | বদলেছে |
| অনাকাঙ্ক্ষীদের | `AbvKv•¶x‡`i` | অনাকাক্সক্ষীদের | বদলেছে |
| অনাকাঙ্ক্ষাজনিত | `AbvKv•¶vRwbZ` | অনাকাক্সক্ষাজনিত | বদলেছে |

এখানে ফল খুব পরিষ্কার: **পরীক্ষিত `ঙ্ক্ষ`-যুক্ত ১৫/১৫ শব্দই বদলেছে।** তাই AvroJoy output পরে ShumanBD-তে Unicode-এ ফেরত দেওয়া লাগলে `আকাঙ্ক্ষা`, `অনাকাঙ্ক্ষিত`-ধরনের শব্দকে ঝুঁকিপূর্ণ ধরতে হবে। একই raw `•¶` token যেখানে থাকবে, সেখানে ShumanBD-এর একই inverse behavior হওয়ার শক্ত প্রমাণ আছে; তবে এই audit-কে সব সম্ভাব্য অভিধান-শব্দের আনুষ্ঠানিক শতভাগ তালিকা বলা হচ্ছে না।

## Pattern 2 — `দারিদ্র্য`-এর পরে e-kar-শুরু suffix

AvroJoy-এর raw form-এ `দারিদ্র্য` অংশে joiner-preserving `্র্য` structure থাকে। যখন পরের suffix e-kar দিয়ে শুরু হয়, legacy output-এ e-kar token-কে y-fola token-এর আগে রাখা লাগে। ShumanBD এই নির্দিষ্ট order দুইটি পরীক্ষিত শব্দে Unicode logical order-এ ফিরিয়ে আনতে পারেনি। [2] [4] [5]

| মূল শব্দ | AvroJoy raw Bijoy | ShumanBD থেকে ফেরত | ফল |
|---|---|---|---|
| দারিদ্র্যের | `` `vwi`ª‡‍¨i `` | দারিদ্র্েযর | বদলেছে |
| দারিদ্র্যেও | `` `vwi`ª‡‍¨I `` | দারিদ্র্েযও | বদলেছে |

এই pattern-টির সীমা গুরুত্বপূর্ণ। নিচেরগুলো একই targeted test-এ **ঠিক ফিরেছে**: `দারিদ্র্য`, `দারিদ্র্যজনিত`, `দারিদ্র্যসীমা`, `দারিদ্র্যবিমোচন`। এছাড়া `কার্যের`, `সূর্যের`, `সৌর্যের`, `বীর্যের`, `ধৈর্যের`, `ঐশ্বর্যের` এবং `সৌন্দর্যের`-এর মতো অন্য `র্য`/কার-যুক্ত শব্দে এমন ভুল পাওয়া যায়নি। কাজেই এটি সব `র্য`-যুক্ত শব্দের সমস্যা নয়; বর্তমানে প্রমাণিত scope হলো **`দারিদ্র্য` family-তে পরীক্ষিত e-kar-শুরু suffix**।

## যেগুলো দেখে চিন্তার দরকার নেই

নিচের ফলগুলো raw Unicode string পুরোপুরি এক না হলেও শব্দের দৃশ্যমান বানান ও অর্থ বদলায়নি। এগুলো ShumanBD-এর Unicode normalization style:

| মূল | ShumanBD ফেরত | কেন harmless |
|---|---|---|
| ক্ষয় | ক্ষয় | `য়` বনাম `য়` representation |
| হৃদয় | হৃদয় | `য়` বনাম `য়` representation |
| প্রত্যয় | প্রত্যয় | `য়` বনাম `য়` representation |
| প্রত্যয়ী | প্রত্যয়ী | `য়` বনাম `য়` representation |
| প্রক্রিয়া | প্রক্রিয়া | `য়` বনাম `য়` representation |
| গৌরবময় | গৌরবময় | `য়` বনাম `য়` representation |
| লঙ্ঘনীয় | লঙ্ঘনীয় | `য়` বনাম `য়` representation |
| দুর্বোধ্য | দুর্বোধ্য | `ো` বনাম `ে` + `া` representation |
| সূর্যোদয় | সূর্যোদয় | `ো`/`ো` এবং `য়`/`য়` representation |

এই ধরনের output text compare বা database hash-এ আলাদা দেখা যেতে পারে, কিন্তু সাধারণ পড়া/দেখায় শব্দের ভুল বানান তৈরি করছে না।

## বিশেষ control: `•` দেখলেই সমস্যা নয়

`ঙ্ক্ষ → •¶` token-টি সমস্যার কারণ হলেও `•` character-এর সব legacy use সমস্যা করে না। ১৯টি control word-এ AvroJoy-এর `•L` (`ঙ্খ`) এবং `•N` (`ঙ্ঘ`) form ShumanBD ঠিক ফিরিয়েছে: `শঙ্খ`, `শঙ্খচিল`, `শঙ্খধ্বনি`, `লঙ্ঘন`, `লঙ্ঘিত`, `সংঘ`, `সংঘর্ষ`, `সংঘবদ্ধ`, `সঙ্ঘ` ইত্যাদি। [2] [3]

অর্থাৎ globalভাবে `•` পাল্টে দেওয়া উচিত নয়। সমস্যাটি কেবল ShumanBD-এর `•¶` composite inverse interpretation-এ।

## ব্যবহারিক নির্দেশনা

| আপনার কাজের ধরন | নিরাপদ পথ |
|---|---|
| AvroJoy-এ Bijoy বানিয়ে পরে AvroJoy-এই Unicode-এ ফেরানো | নিরাপদ; AvroJoy নিজের output ঠিক পড়ে |
| ShumanBD থেকে পাওয়া Bijoy AvroJoy-তে খোলা | নিরাপদভাবে বেশি সহনশীল; আগের audit-এ AvroJoy ShumanBD-এর alternative forms পড়েছে |
| AvroJoy Bijoy পরে ShumanBD-তে Unicode-এ ফেরানো | `ঙ্ক্ষ`-যুক্ত শব্দ ও পরীক্ষিত `দারিদ্র্য` + e-kar suffix পরীক্ষা করে নিন |
| অন্য system-এ কাজের জন্য standard Unicode file দরকার | Unicode মূল ফাইল সংরক্ষণ করুন; legacy Bijoy copy-কে একমাত্র source of truth বানাবেন না |

AvroJoy-এর বিদ্যমান conversion logic এই অনুসন্ধানে বদলানো হয়নি। ShumanBD compatibility অগ্রাধিকার দিয়ে `•¶`-র বদলে decomposed `O&¶` emit করার সম্ভাবনা আছে, কিন্তু সেটি একটি targeted behavior change; আগে সম্পূর্ণ `ঙ্ক্ষ` context, font rendering, DOCX/TXT এবং current regression suites দিয়ে আলাদা পরীক্ষা ছাড়া তা প্রয়োগ করা উচিত নয়।

## সংক্ষিপ্ত সীমা

এই report-এর তালিকাটি পরীক্ষায় পাওয়া নিশ্চিত শব্দ ও pattern দেখায়। এটি বাংলা অভিধানের সব শব্দ exhaustively scan করেনি। নতুন শব্দে ঝুঁকি নির্ধারণের সহজ নিয়ম হলো: AvroJoy output-এ `•¶` থাকলে ShumanBD reverse-এ সাবধান; আর `দারিদ্র্য`-র মতো joiner-preserving `্র্য` cluster-এর পরে e-kar-শুরু suffix থাকলে পরীক্ষা করে নিন।

## References

[1]: https://www.shumanbd.com/ "ShumanBD public Bijoy ↔ Unicode converter used for controlled reverse tests"
[2]: ./../tmp/avrojoy_to_shumanbd_confirmed_change_matrix.md "Controlled corpus matrix, raw output, and same-index comparison results"
[3]: ./node_modules/.pnpm/@abdalgolabs+ansi-unicode-converter@1.0.5/node_modules/@abdalgolabs/ansi-unicode-converter/dist/data.js "Installed Unicode/Bijoy forward and inverse mapping tables"
[4]: ./node_modules/.pnpm/@abdalgolabs+ansi-unicode-converter@1.0.5/node_modules/@abdalgolabs/ansi-unicode-converter/dist/core.js "Installed converter reordering and mapping pipeline"
[5]: ./client/src/lib/converter.ts "AvroJoy word-aware conversion and preservation policy"
