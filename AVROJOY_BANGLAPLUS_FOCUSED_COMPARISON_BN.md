# AvroJoy বনাম Bangla.plus: ঋ-কার, র-ফলা ও এ-কার focused survey

**Test date:** ২৭ আগস্ট ২০২৬  
**Compared pages:** [AvroJoy](https://avrojoy.vercel.app/) এবং [Bangla.plus Bijoy–Unicode Converter](https://bangla.plus/bijoy-unicode-converter/)

## Test set

`দৃষ্টি রেখে অশ্রু ঝুম স্মৃতি প্রথম দ্রব্য র‍্যাব`

এই set-এ ব্যবহারকারীর চিহ্নিত sensitive case রাখা হয়েছে: **ঋ-কার** (`দৃষ্টি`, `স্মৃতি`), **র-ফলা/র-যুক্ত ধ্বনি** (`অশ্রু`, `প্রথম`, `দ্রব্য`, `র‍্যাব`), এবং **শুরুর/মাঝের এ-কার** (`রেখে`)।

## Collected external evidence: Bangla.plus forward conversion

My Browser-এ Bangla.plus-এর Unicode input-এ ঠিক ওপরের test set দেওয়া হয়েছে এবং তার **বিজয়** control চালানো হয়েছে। Output textarea থেকে পাওয়া raw legacy text:

```text
`„wó †i‡L AkÖæ Szg ¯§„wZ cÖ_g `ªe¨ i‍¨ve
```

এটি browser-এর সঠিক Bijoy font-এ visually Bengali হিসেবে দেখানো হয়; raw Latin-like characters দেখা legacy ANSI/Bijoy byte sequence-এর স্বাভাবিক representation, Unicode output নয়।

## Collected AvroJoy evidence

AvroJoy-এর existing converter function দিয়ে একই words একেকটি করে forward এবং reverse চালানো হয়েছে। প্রতিটি word-এর output নিচের Bangla.plus split output-এর সঙ্গে মেলে এবং প্রতিটি AvroJoy reverse conversion original Unicode-এ **exactly** ফিরে এসেছে।

| Input | AvroJoy Bijoy raw output | Sensitive case | AvroJoy round-trip |
|---|---|---|---|
| দৃষ্টি | `` `„wó `` | ঋ-কার | Exact |
| রেখে | `†i‡L` | শুরুর ও মাঝের এ-কার | Exact |
| অশ্রু | `AkÖæ` | র-ফলা + ঋ-কার | Exact |
| ঝুম | `Szg` | সাধারণ control | Exact |
| স্মৃতি | `¯§„wZ` | যুক্তবর্ণ + ঋ-কার | Exact |
| প্রথম | `cÖ_g` | র-ফলা | Exact |
| দ্রব্য | `` `ªe¨ `` | র-ফলা/দ্র-যুক্ত | Exact |
| র‍্যাব | `i‍¨ve` | ZWJ-সহ র-যুক্ত/য-ফলা | Exact |

Bangla.plus textarea থেকে পাওয়া single-line forward output space দিয়ে ভাগ করলে একই eight values পাওয়া যায়: `` `„wó †i‡L AkÖæ Szg ¯§„wZ cÖ_g `ªe¨ i‍¨ve ``। Bangla.plus-এর just-produced output-এ তার Unicode control চালানোর পরে Unicode textarea-তে মূল test sentence-ই দৃশ্যমান ছিল; তাই এই specific forward sequence-এর UI round-trip mismatch দেখা যায়নি।

Production AvroJoy UI-তে একই live browser interaction নিতে গিয়ে My Browser extension timeout (`HTTP 504`) দিয়েছে। এটি AvroJoy conversion failure-এর evidence নয়; একই production logic সরাসরি local harness-এ executed হয়েছে এবং original test words-এ exact round-trip দিয়েছে।

## Byte and round-trip comparison

| পরীক্ষার প্রশ্ন | Bangla.plus | AvroJoy | ফল |
|---|---|---|---|
| আটটি শব্দ একসঙ্গে Unicode → Bijoy | `` `„wó †i‡L AkÖæ Szg ¯§„wZ cÖ_g `ªe¨ i‍¨ve `` | একই sequence | Byte sequence একই |
| ঋ-কার: `দৃষ্টি`, `স্মৃতি` | `` `„wó ``, `¯§„wZ` | একই | Tie |
| এ-কার: `রেখে` | `†i‡L` — শুরুতে `†`, মাঝখানে `‡` | একই | Tie |
| র-ফলা/র-যুক্ত: `অশ্রু`, `প্রথম`, `দ্রব্য`, `র‍্যাব` | `AkÖæ`, `cÖ_g`, `` `ªe¨ ``, `i‍¨ve` | একই | Tie |
| Bangla.plus output → Unicode, Bangla.plus UI | মূল test sentence দৃশ্যমান | — | Exact UI return observed |
| Bangla.plus output → Unicode, AvroJoy | — | মূল test sentence exactly ফিরে এসেছে | Exact cross-readback |

## Rendering interpretation

Bijoy text Unicode Bengali নয়। তাই `†i‡L`, `AkÖæ` বা `` `„wó `` raw textarea/clipboard-এ Latin-like code হিসাবে দেখা স্বাভাবিক; **SutonnyMJ**-তে সেগুলোই যথাক্রমে `রেখে`, `অশ্রু`, `দৃষ্টি`-র glyph হবে। এই test set-এ দুই site-এর raw sequence হুবহু একই হওয়ায় একই SutonnyMJ font ও size-এ তাদের Bengali glyph placement-ও একই হওয়ার কথা। Bangla.plus browser preview-তে সেই rendered Bengali output দেখা গেছে।

AvroJoy production interface-এর live browser verification ওই নির্দিষ্ট attempt-এ browser-extension timeout হওয়ায় নেওয়া যায়নি; তবে AvroJoy-এর font loading এবং mobile raw-byte regression পৃথকভাবে আগে fixed/validated হয়েছে। এই report তাই **conversion-byte correctness**-এ সিদ্ধান্ত দেয়; ভিন্ন device-এর font installation বা Word-version rendering-এর universal guarantee দেয় না।

## Verdict

> আপনার চিহ্নিত ঋ-কার, র-ফলা, শুরুর এ-কার এবং মাঝের এ-কারের এই আটটি নির্দিষ্ট test word-এ **AvroJoy ও Bangla.plus সমান**। কোনোটির byte output বা tested round-trip অন্যটির চেয়ে ভালো পাওয়া যায়নি।

তাই শুধু এই test set-এর ভিত্তিতে AvroJoy converter mapping বদলানো যুক্তিযুক্ত নয়; এতে আগে ঠিক থাকা document/mixed-font behaviour ঝুঁকিতে পড়বে। নতুন patch কেবল তখনই justified হবে, যখন কোনো নির্দিষ্ট input-এ দুইটির raw output আলাদা এবং সেই difference SutonnyMJ/Word-এ বাস্তবে ভুল glyph বা wrong Unicode return তৈরি করে।

## Reference

[1] [Bangla.plus — বিজয় ও ইউনিকোড কনভার্টার](https://bangla.plus/bijoy-unicode-converter/)
