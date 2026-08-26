# AvroJoy Google visibility survey

**জরিপের তারিখ:** ২৬ আগস্ট ২০২৬, বাংলাদেশ সময়। Google results account, location, language, device ও সময়ভেদে বদলাতে পারে; visible-result observation স্থায়ী rank measurement নয়।

## ১. Search Console-এর বর্তমান অবস্থা

Verified property: `https://avrojoy.vercel.app/` — owner session: `avrojoyconverter@gmail.com`।

| Report | বর্তমান অবস্থা | কী বোঝায় |
|---|---|---|
| Performance | “Processing data, please check again in a day or so”; query/click/impression/position নেই | Query-level rank, CTR বা impression দিয়ে এখনও ফল মাপা যাচ্ছে না। |
| Page indexing | “Processing data, please check again in a day or so” | Property-wide indexed/excluded page count এখনও report করেনি। |

এটি indexing failure প্রমাণ করে না। URL Inspection-এ আগের যাচাই অনুযায়ী homepage এবং priority guides indexed/crawlable ছিল; এই survey-তে current property-wide reports এখনও processing অবস্থায় পাওয়া গেছে।

## ২. Survey method

পরের ধাপে brand query ও তিনটি high-intent generic query-তে logged-in browser-এর visible Google result snapshot, এবং public competitor signal দেখা হবে। কোনো indexing request, ranking manipulation, paid link বা content copy করা হবে না।

## ৩. Live Google snapshot

| Query | এই browser snapshot-এ AvroJoy | দেখা গেছে |
|---|---|---|
| `অভ্রজয়` | **হ্যাঁ** — AI Overview ও top unrelated knowledge results-এর পরে visible organic result-এ homepage, এবং পরে `/avro-to-bijoy` guide | Homepage snippet-এ conversion ও Word use case আছে, তবে Google এখনও site label হিসেবে `Vercel` দেখাচ্ছে। এটি index/brand discovery আছে—কিন্তু automated site-name reprocessing বাকি—তার প্রমাণ। |
| `ইউনিকোড টু বিজয়` | প্রথম visible organic results-এ **না** | Bangla.plus, BanglaConverter, ConverterAZ, ShumanBD, UnicodeBijoy, JUST ও বড় media-domain converter দেখা গেছে। |
| `অভ্র টু বিজয়` | প্রথম visible organic results-এ **না** | Bangla.plus, ShumanBD, BanglaConverter, ConverterAZ, Bangla Converter xyz, Jashore University of Science & Technology ও video/tutorial result দেখা গেছে। |
| `বিজয় টু ইউনিকোড` | প্রথম visible organic results-এ **না** | Bangla.plus, BanglaConverter, JUST, UnicodeBijoy, ConverterAZ ও ShumanBD দেখা গেছে; AI Overview-এও Bangla.plus-এর how-to information উদ্ধৃত হয়েছে। |

এখানে “প্রথম visible organic result” বলতে AI Overview, ad, video block বা result-page scroll-এর বাইরে থাকা initial organic listings বোঝানো হয়েছে। Exact numeric position বলা উচিত নয়, কারণ Google account/location/time অনুযায়ী order পাল্টাতে পারে এবং Search Console-এর position data এখনও processing অবস্থায়।

## ৪. AvroJoy আসছে কি না: verified answer

> **হ্যাঁ, AvroJoy Google-এ আছে এবং key URL-গুলো indexable। কিন্তু mature generic converter query-তে প্রথম visible organic set-এ এখনো নেই।**

Search Console URL Inspection-এ homepage ও `/avro-to-bijoy`—দুটির জন্যই “URL is on Google”, “Page is indexed” এবং HTTPS-serving status নিশ্চিত হয়েছিল। Google Live Test-এ priority guide-এর জন্য “URL is available to Google”, “Page can be indexed” এবং ২টি valid breadcrumb item পাওয়া গেছে। Submitted sitemap Success অবস্থায় আছে এবং live sitemap-এ ৯টি public URL আছে। ফলে সমস্যা `noindex`, HTTPS, sitemap absence বা current live fetch failure নয়।

তবে stored crawled-page viewer-এ সর্বশেষ prerendered guide marker আগে পাওয়া যায়নি; নতুন static route content, fresh exact-intent titles এবং expanded guides এখনও Google-এর stored index-এ পুরোপুরি reflect নাও হতে পারে। এটি সাম্প্রতিক release-পরবর্তী **crawl freshness gap**, technical block নয়।

## ৫. সাম্প্রতিক কাজের বাস্তব উপকার

| কাজ | Verified outcome | Search-ranking relevance | সীমা |
|---|---|---|---|
| তিনটি priority guide-এর build-time static HTML | Route-specific title, canonical, body, Article/FAQPage/Breadcrumb data JavaScript ছাড়াই production HTML-এ আছে | Google live fetch-এ meaningful route content পায়; SPA shell-only সমস্যা কমে | Crawl/index refresh না হলে result-এ তাৎক্ষণিক প্রতিফলন হবে না |
| Exact-intent page alignment | Homepage ও তিন guide-এ natural Bengali query phrase, use case, review method ও FAQ আছে | Query intent এবং user outcome বোঝা সহজ হয় | Exact keyword একা ranking factor বা guarantee নয় |
| Sitemap ও canonical consistency | Live sitemap-এ ৯ URL; canonical ও route hierarchy verify করা | Discovery ও duplicate-control-এর ভিত্তি তৈরি | Search Console-এর discovered-page count এখনও stale/processing |
| Mobile image delivery | একই artwork WebP delivery-এর পরে mobile lab Performance 60 → 72; Accessibility 95, Best Practices 100, SEO 100 | Faster mobile loading user experience-এ সহায়ক হতে পারে | এটি synthetic lab run; real-user field data এখনও নেই |
| Brand/site identity signal | Brand query-তে AvroJoy homepage এবং guide visible | Siteটি discoverable ও indexed হওয়ার direct evidence | Google result-এ label এখনও `Vercel`; display name Google নিজে reprocess করে |

## ৬. অন্যগুলো কেন আগে আসছে: public evidence

প্রথম-page sites-এর ক্ষেত্রে একটিমাত্র কারণ প্রমাণ করা যায় না। তবে public observation-এ একই pattern দেখা যায়: Bangla.plus, BanglaConverter, UnicodeBijoy, ConverterAZ এবং ShumanBD বহুদিনের/conversion-focused বড় site context, exact intent title, related tools বা directory-like internal navigation এবং ওই query family-তে existing public footprint নিয়ে আছে। JUST, Jugantor, Dhaka Post, Ittefaq, Samakal ও Bangla Tribune-এর মতো institution/media-domain result-এ বড় established publisher context-ও দেখা যায়।

AvroJoy এখন title, canonical, schema ও crawlable content-এ তাদের সঙ্গে competitive baseline-এ এসেছে। কিন্তু AvroJoy-এর focused site cluster ছোট, public query history নতুন এবং Search Console-এ এখনও impression/position/links/field CWV data জমেনি। তাই comparator-এর আগে আসার সবচেয়ে সম্ভাব্য ব্যাখ্যা হলো **স্থাপিত site context, দীর্ঘদিনের query association এবং wider discovery footprint**—schema ঘাটতি নয়। Raw metadata comparator study-তেও দেখা গেছে Bangla.plus কম structured data নিয়েও আগে আসে; তাই FAQ/schema যোগ করলেই rank হবে, এমন ধারণা সঠিক নয়।

## ৭. কেন AvroJoy প্রথমে আসে না বা “আসেই না” মনে হয়

Brand query-তে AvroJoy আসছে, তাই “Google site খুঁজে পায় না” কথাটি সঠিক নয়। Generic query-তে user search করার সময় AvroJoy প্রথম visible set-এর পরে থাকলে বাস্তবে সেটি “আসে না” বলেই মনে হয়। প্রথম-page result-এ না থাকার মানে URL unindexed নয়; একই query-তে Google অন্য প্রতিষ্ঠিত page-কে বেশি relevant/established মনে করছে। Search Console Performance report না আসা পর্যন্ত impression বা average position দিয়ে এই difference সংখ্যায় বলা সম্ভব নয়।

## ৮. শুরুতে আসার জন্য কী করা যায়

প্রথমে আসা নিশ্চিত করার কোনো বৈধ technical trick নেই। সবচেয়ে শক্তিশালী sustainable path হলো Google-কে বর্তমান updated pages crawl/re-evaluate করার সময় দেওয়া, এরপর Performance report থেকে যে query-তে impression আসে সেটিতে existing page refine করা। একই সঙ্গে AvroJoy-এর real differentiation—থিসিস/DOCX formatting review, mixed Bangla–English, SutonnyMJ/Times New Roman handling, punctuation ও conjunct review—এগুলোকে শুধু tested, transparent workflow হিসেবে ধরে রাখা উচিত।

Paid/do-follow link কেনা, PBN/link farm, bulk directory/automated link, copied competitor text, doorway/thin pages, hidden text, keyword stuffing, fake rating/testimonial বা repeated indexing request এই লক্ষ্যকে sustainableভাবে এগোয় না এবং করা হবে না। প্রাসঙ্গিক third-party editorial reference ভবিষ্যতে সহায়ক হতে পারে, কিন্তু সেটি ranking guarantee নয় এবং external contact-এর আগে owner approval প্রয়োজন।

## ৯. Measurable next decision

Search Console Performance, Pages ও Links report processing শেষ হলে প্রথমে query, impressions, clicks, CTR এবং average position দেখা উচিত। সেই data ছাড়া আর নতুন overlapping conversion page যোগ না করে existing three guide ও homepage-এর interaction quality ধরে রাখা ভালো। Google-এর public guidance অনুযায়ী ranking systems বহু page-level ও site-level signal ব্যবহার করে; helpful, people-first content এবং satisfying outcome গুরুত্বপূর্ণ, কিন্তু কোনো single tag বা shortcut ranking promise দেয় না.[1] [2]

## References

[1] [Google Search Central — A guide to Google Search ranking systems](https://developers.google.com/search/docs/appearance/ranking-systems-guide)

[2] [Google Search Central — Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
