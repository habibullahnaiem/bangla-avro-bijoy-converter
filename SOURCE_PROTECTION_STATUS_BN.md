# অভ্রজয়: Source Protection ও Ownership Status

**সর্বশেষ যাচাই: ২৫ আগস্ট ২০২৬**

## বর্তমান সুরক্ষা অবস্থা

AvroJoy-এর GitHub repository `habibullahnaiem/bangla-avro-bijoy-converter` বর্তমানে **PRIVATE**। ফলে সাধারণ GitHub visitor repository browse, clone বা source download করতে পারবে না। Production site-এ `.git/config` path প্রকৃত Git configuration দেয় না; SPA fallback HTML দেয়। Production JavaScript source map-ও public নয়।

| স্তর | বর্তমান অবস্থা | কার্যকর সীমা |
| --- | --- | --- |
| GitHub source | Private | অনুমোদিত repository collaborator ছাড়া source দেখা যায় না |
| Vercel deployment | Minified browser bundle প্রকাশিত | সাইট চালাতে browser-এ bundle পাঠাতেই হয় |
| Source maps | Public নয় | original source file সহজে পুনর্গঠন করা যায় না |
| Ownership notice | Footer-এ প্রকাশিত | ownership ও অনুমতি ছাড়া copy/republication নিষেধ স্পষ্ট করে |

## গুরুত্বপূর্ণ সীমাবদ্ধতা

Browser-ভিত্তিক এবং offline-capable tool-এর পুরো frontend শতভাগ copy-proof করা প্রযুক্তিগতভাবে সম্ভব নয়। কেউ site-এর দৃশ্যমান design অনুকরণ করতে বা minified bundle বিশ্লেষণের চেষ্টা করতে পারে। Right-click বন্ধ করা বা text selection আটকে দেওয়া প্রকৃত সুরক্ষা দেয় না এবং ব্যবহারযোগ্যতা কমায়; তাই তা প্রয়োগ করা হয়নি।

Core conversion logic browser থেকে সরিয়ে server-side API-তে নিলে reverse engineering আরও কঠিন হতে পারে, কিন্তু তাতে AvroJoy-এর বর্তমান offline/PWA সুবিধা, local privacy model এবং server-independent ব্যবহার বদলে যাবে। বর্তমান নকশায় private repository, no-public-source-map, ownership notice এবং নিয়মিত dependency/secrets hygiene-ই বাস্তবসম্মত ভারসাম্য।

## মালিকের করণীয়

Repository-তে নতুন collaborator কেবল বিশ্বাসযোগ্য ব্যক্তিকে দিন এবং GitHub visibility **Private** রাখুন। কোনো API key, password বা secret client code বা Git history-তে commit করবেন না। Design বা content অননুমোদিতভাবে পুনঃপ্রকাশিত হলে screenshot, URL এবং প্রকাশের তারিখ সংরক্ষণ করুন; প্রয়োজন হলে আইনগত পরামর্শ নিন।
