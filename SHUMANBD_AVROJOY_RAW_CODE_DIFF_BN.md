# ShumanBD বনাম AvroJoy — শুধু Bijoy Code/Byte পার্থক্য

**পরীক্ষার ধরন:** একই Unicode input-এ দুই সাইটের raw Bijoy output token-by-token ও character-by-character তুলনা। UI, DOCX, ফিচার বা design এই রিপোর্টে নেই। [1] [2]

> **মূল ফল:** পরীক্ষা করা ২৬টি standard যুক্তবর্ণে কোনো byte পার্থক্য নেই। পার্থক্য পাওয়া গেছে শুধু `ঢ়`, quote-পরবর্তী word-initial এ-কার, em-dash, standalone ellipsis এবং দুটি isolated formatting fragment-এ।

## ১. যেখানে byte হুবহু একই

নিচের ২৬টি standard যুক্তবর্ণ/শব্দে ShumanBD এবং AvroJoy-এর output একদম একই byte sequence: `ন্ত`, `ন্থ`, `ন্দ`, `ন্ধ`, `ন্ট`, `ল্ল`, `প্র`, `ক্র`, `গ্র`, `শ্র`, `জ্ঞ`, `ক্ষ`, `ত্র`, `ত্ত`, `দ্ধ`, `ষ্ঠ`, `র্ক`, `র্গ`, `র্দ`, `র্ফ`, `প্রজ্ঞা`, `লক্ষ্মী`, `শ্রদ্ধা`, `কর্ম`, `অর্থ`, `রক্ত`।

| Input | ShumanBD code | AvroJoy code | ফল |
|---|---|---|---|
| `ন্ত` | `šÍ` | `šÍ` | একই |
| `ক্র` | `µ` | `µ` | একই |
| `গ্র` | `MÖ` | `MÖ` | একই |
| `শ্র` | `kÖ` | `kÖ` | একই |
| `জ্ঞ` | `Á` | `Á` | একই |
| `ক্ষ` | `¶` | `¶` | একই |
| `প্রজ্ঞা` | `cÖÁv` | `cÖÁv` | একই |
| `লক্ষ্মী` | `j²x` | `j²x` | একই |
| `শ্রদ্ধা` | `kÖ×v` | `kÖ×v` | একই |

পূর্ণ controlled row count: **২৬/২৬ একই**। [2]

## ২. measured raw-code পার্থক্য

| Input/context | ShumanBD raw output | AvroJoy raw output | code-point পার্থক্য | Reverse test |
|---|---|---|---|---|
| `ঢ়` | `X়` | `p` | `X` = U+0058 + `়` = U+09BC; `p` = U+0070 | ShumanBD output → `X়`; AvroJoy output → `ঢ়` |
| `“কোট”` | `Ò‡KvUÓ` | `Ò†KvUÓ` | `‡` = U+2021; `†` = U+2020 | দুটোই → `“কোট”` |
| `‘কোট’` | `Ô‡KvUÕ` | `Ô†KvUÕ` | `‡` = U+2021; `†` = U+2020 | দুটোই → `‘কোট’` |
| `—` | `—` | `Ñ` | em-dash U+2014; `Ñ` = U+00D1 | দুটোই → `—` |
| `…` | `„` | `...` | `„` = U+201E; AvroJoy-এর `.` তিনটি U+002E | ShumanBD → `ৃ`; AvroJoy → `...` |
| isolated `র্` | `©` | `i&` | `©` = U+00A9; `i` = U+0069 + `&` = U+0026 | দুটোই → `র্` |
| isolated `্র্য` | `ª¨` | `ª‍¨` | `ª` = U+00AA + `¨` = U+00A8; AvroJoy মাঝখানে ZWJ U+200D রাখে | ShumanBD → `্র্য`; AvroJoy → `্র‍্য` |

## ৩. শুধুই যুক্তবর্ণের special forms

নিচের form-গুলোতে এখন দুই সাইটের code একই। এগুলো আগে legacy library-তে ambiguous ছিল, তাই AvroJoy-এ আলাদা reversible byte রাখা হয়েছে।

| Input | ShumanBD code | AvroJoy code | ফল |
|---|---|---|---|
| `গ্রু` | `MÖæ` | `MÖæ` | একই |
| `ষ্ক্র` | `l&µ` | `l&µ` | একই |
| `ক্ষ্ন` | `¶&b` | `¶&b` | একই |
| `ক্ষ্ণ` | `¶&Y` | `¶&Y` | একই |
| `ণ্ণ` | `Y&Y` | `Y&Y` | একই |
| `ণ্ন` | `Y&b` | `Y&b` | একই |
| `ত্রূ` | `Î~` | `Î~` | একই |

## ৪. code-only সিদ্ধান্ত

**যুক্তবর্ণে:** measured standard corpus-এ কোনো code difference নেই; special ambiguous form-গুলিও এখন একই।

**বাস্তব পার্থক্য:** `ঢ়`, word-initial e-kar marker, em-dash এবং standalone ellipsis। এর মধ্যে `ঢ়` ও standalone ellipsis-এ reverse result আলাদা; `e-kar` ও em-dash-এ reverse result একই হলেও raw byte আলাদা।

**isolated `র্` এবং `্র্য`:** এগুলো পূর্ণ শব্দের স্বাভাবিক যুক্তবর্ণ নয়; formatting fragment হিসেবে test করা হয়েছে। স্বাভাবিক শব্দে রেফ/র-ফলার standard forms (`র্ক`, `র্গ`, `র্দ`, `র্ফ`, `প্র`, `ক্র`, `গ্র`, `শ্র`) byte-এ একই।

## References

[1]: https://www.shumanbd.com/ "ShumanBD public converter; controlled raw-output source"
[2]: ./audit_raw_code_diff.ts "Project-local reproducible token and character-level raw Bijoy comparison"
