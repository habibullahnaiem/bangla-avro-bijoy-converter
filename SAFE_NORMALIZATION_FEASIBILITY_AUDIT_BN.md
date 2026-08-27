# AvroJoy normalization ও legacy compatibility: zero-regression feasibility audit

**Status:** পরীক্ষা চলছে; production converter, UI, DOCX/TXT workflow বা deployment পরিবর্তন করা হয়নি।

## Frozen baseline

বর্তমান converter-এর verified critical sentence:

```text
দৃষ্টি রেখে অশ্রু ঝুম স্মৃতি প্রথম দ্রব্য র‍্যাব ক্ষ্ন ক্ষ্ণ ণ্ণ ণ্ন ত্রূ
```

বর্তমান Bijoy output:

```text
`„wó †i‡L AkÖæ Szg ¯§„wZ cÖ_g `ªe¨ i‍¨ve ¶&b ¶&Y Y&Y Y&b Î~
```

এটি বর্তমান converter-এ সম্পূর্ণ Unicode round-trip করে। একইভাবে বর্তমান `॥ → \\ → ॥` native convention সংরক্ষিত। এই দুটি অপরিবর্তনীয় baseline invariant।

## Isolated probe: ফল

| Input family | Forward result | Return result | সিদ্ধান্ত |
|---|---|---|---|
| `…` এবং `...` | দুটিই `...` | `...` | উৎস আলাদা ছিল কি না আর বোঝা যায় না |
| `য়` এবং `য়` | দুটিই `q` | `য়` | পুরোনো single-code-point form-এর provenance হারায় |
| `"সোজা"` এবং `“সোজা”` | দুটিই `Ò†mvRvÓ` | `“সোজা”` | style canonicalization, অর্থগত ভাঙন নয় |
| `'সোজা'` এবং `‘সোজা’` | দুটিই `Ô†mvRvÕ` | `‘সোজা’` | style canonicalization, অর্থগত ভাঙন নয় |
| AvroJoy `॥` | `\\` | `॥` | বর্তমান native profile exact |
| Bangla.plus/Shuman-style `॥` | `\` | literal `\` | অন্য profile পড়তে explicit rule দরকার |

## প্রযুক্তিগত সিদ্ধান্ত

`…` বনাম `...` এবং `য়` বনাম `য়`—দুটি pair একই raw legacy output-এ collapse করে। একবার collapse হলে শুধু ওই raw Bijoy string দেখে original Unicode form নিশ্চিতভাবে পুনরুদ্ধার করা সম্ভব নয়। এটিকে marker ছাড়া বদলানো মানে হয় output convention ভাঙা, নয় user-visible/hidden provenance data যোগ করা। উভয়টিই existing compatibility risk তৈরি করে।

Straight quote-এর ক্ষেত্রটি data-loss bug নয়; AvroJoy একটি typography policy প্রয়োগ করে curly quote-এ ফেরায়। Default আচরণ বদলালে existing document/text expectation বদলাতে পারে।

`॥`-এর ক্ষেত্রে সম্ভাব্য নিরাপদ নকশা হলো **default না বদলে explicit import/export profile**: `AvroJoy native` (বর্তমান `\\`) এবং `Bangla.plus/Shuman import` (single `\`)। কিন্তু plain input দেখে auto-detect নির্ভুল নয়; তাই default profile বদলানো বা silent auto-detection zero-risk নয়।

## বর্তমান নিরাপত্তা সিদ্ধান্ত

শুধু সব existing conversion output, document workflow এবং cross-tool expectation byte-for-byte অপরিবর্তিত রেখে `…`, `য়/য়` provenance ফেরানোর কোনো transparent patch পাওয়া যায়নি। অতএব এই পর্যায়ে production change করা নিরাপদ নয়। পরের ধাপে শুধু optional, default-off profile/format নকশা আদৌ বিদ্যমান API ও DOCX workflow-এ isolate করা যায় কি না পরীক্ষা করা হবে; slightest regression বা ambiguity থাকলে সেটিও প্রকাশ করা হবে না।

## Isolated optional-design assessment

| সম্ভাব্য নকশা | Default output বদলাবে? | সমস্যার কতখানি সমাধান করে | Zero-risk verdict |
|---|---|---|---|
| Ellipsis/yya-র hidden marker বা PUA marker | না, শুধু নতুন mode-এ | নতুন AvroJoy-only output-এর source provenance রাখতে পারে | **না** — copied Bijoy/DOCX-এ marker দৃশ্যমান বা হারিয়ে যেতে পারে; অন্য converter সেটি বুঝবে না |
| `…` বনাম `...`-এর auto-inference | না | কোনোটি নয়, কেবল অনুমান | **না** — একই `...` raw string থেকে source নিশ্চিত জানা যায় না |
| `য়/য়`-এর auto-inference | না | কোনোটি নয়, কেবল canonical form নির্বাচন | **না** — `q` থেকে original code point জানা যায় না |
| Straight-quote “literal” option | Default না বদলালে সম্ভব | নতুন conversion-এ straight quote literal রাখতে পারে | **আংশিকভাবে সম্ভব** — existing default বদলানো যাবে না; option চালু করলে curl-quote expectation বদলাবে |
| Explicit Bangla.plus/Shuman `॥` import profile | Default না বদলালে সম্ভব | deliberate import-এ single `\` কে `॥` পড়তে পারে | **আংশিকভাবে সম্ভব** — UI-তে user-কে profile বেছে নিতে হবে; automatic detection নিরাপদ নয় |

এ থেকে একটি সুনির্দিষ্ট সিদ্ধান্ত পাওয়া যায়: optional feature হিসেবে literal quote বা explicit single-backslash import profile বানানো সম্ভব, কিন্তু এগুলো **নতুন user-selected behaviour**—বর্তমান conversion-কে স্বয়ংক্রিয়ভাবে উন্নত করা নয়। আর ellipsis ও `য়/য়`-এর জন্য external marker ছাড়া lossless reversal গাণিতিকভাবে সম্ভব নয়।

ব্যবহারকারী যে শর্ত দিয়েছেন—“নষ্ট করাই যাবে না”—তার অধীনে বর্তমান default path, DOCX/TXT export এবং preview-এ কোনো patch দেওয়া যাবে না। Optional UI/profile-ও এখন প্রকাশ করা হবে না, কারণ ব্যবহারকারী এখনো আলাদা opt-in behaviour চান কি না নির্দিষ্ট করেননি এবং সেটি নতুন UI/state/document-test surface তৈরি করবে।

## No-change regression validation

বর্তমান অপরিবর্তিত source-এ পুরো validation চালানো হয়েছে:

| Validation surface | ফল |
|---|---|
| Root TypeScript check | Passed |
| Root Vitest suite | 3 test file, 9 test passed |
| Root production build ও service-worker generation | Passed |
| Vercel-static TypeScript check | Passed |
| Vercel-static Vitest suite | 4 test file, 19 test passed |
| Vercel-static production build, prerender ও service-worker generation | Passed |
| Isolated critical conversion probe | `ক্ষ্ন/ক্ষ্ণ`, `ণ্ণ/ণ্ন`, `ত্রূ`-সহ critical sentence exact return; current `॥` native return exact |

Build-এ আগে থেকে থাকা managed `/manus-storage` asset-resolution warnings এবং large-chunk advisory পুনরায় দেখা গেছে; এগুলো failure নয় এবং এই audit-এ কোনো নতুন warning তৈরি হয়নি।

## Final decision

**Production-এ কোনো mapping, normalization, DOCX/TXT, preview বা UI পরিবর্তন করা হবে না।** বর্তমান stable path সম্পূর্ণ regression pass করেছে। Ellipsis ও `য়/য়`-এর lossless recovery marker ছাড়া সম্ভব নয়; marker compatibility risk তৈরি করে। Double-dari profile এবং literal-quote mode কেবল future opt-in feature হিসেবে সম্ভব, কিন্তু default behaviour বদলানো ছাড়া এগুলো বর্তমান সমস্যাকে স্বয়ংক্রিয়ভাবে সমাধান করবে না।

এই সিদ্ধান্তটি “কাজ করা যায় না” নয়; এটি ব্যবহারকারীর বাধ্যতামূলক no-break শর্ত মেনে **ঝুঁকিপূর্ণ কাজ প্রকাশ না করার** সিদ্ধান্ত।

## User-supplied preview screenshot check

The supplied 763×174 screenshot was inspected in two overlapping horizontal crops. The Unicode source reads `ক্ষ্ন/ক্ষ্ণ, ণ্ণ/ণ্ন, ত্রূ,` and the SutonnyMJ preview visibly retains the same three distinctions: the first two are not collapsed into one spelling and `ত্রূ` appears with its `ূ` vowel sign. No isolated misplaced e-kar, r-fola or visible broken conjunct is evident in this crop. This is a visual check of the displayed preview only; it does not replace raw-byte and DOCX validation.
