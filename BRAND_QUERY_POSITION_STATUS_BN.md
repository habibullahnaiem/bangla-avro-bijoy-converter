# অভ্রজয় brand query: position ও entity status

**পর্যবেক্ষণ:** ২৬ আগস্ট ২০২৬, বাংলাদেশ সময়। Google result account/location/time-sensitive; এটি স্থায়ী ranking measurement নয়।

## বর্তমান brand-query snapshot

`অভ্রজয়` query-তে Google-এর AI Overview ও knowledge-style results-এর পরে AvroJoy homepage visible organic result হিসেবে এসেছে; তার আগে `banglaunicodeconverter.com`-এর Avro-to-Bijoy result দেখা গেছে। একই result page-এ AvroJoy-এর `/avro-to-bijoy` guide-ও পরে দেখা গেছে। তাই homepage discoverable হলেও এই snapshot-এ #1 organic result নয় এবং Google display label এখনও `Vercel`।

## AvroJoy homepage source check

Homepage root canonical, crawl-visible Bengali body, `WebSite`, `Organization`, `WebApplication`, `og:site_name`, preferred name `অভ্রজয় (AvroJoy)` এবং alternatives `অভ্রজয়`, `AvroJoy`, `avrojoy.vercel.app` আগে থেকেই দেয়। Browser-visible header ও hero-তেও `অভ্রজয় (AvroJoy)` consistent। URL Inspection-এ root URL indexed ছিল। ফলে foundational site-name markup absent নয়; Google-এর current selection and brand-result ordering এখনও reprocessing/entity-confidence matter।

## Official Google guidance

Google বলে site name automated; homepage `WebSite` structured data সবচেয়ে গুরুত্বপূর্ণ preference signal, এবং system homepage title, `og:site_name`, heading ও অন্য homepage text-ও বিবেচনা করে। One site-এ one preferred name ব্যবহার, consistent homepage naming এবং ordered `alternateName` দেওয়া recommended। Correct markup update-এর পর crawl/process হতে কয়েক দিন থেকে কয়েক সপ্তাহ লাগতে পারে, এবং Google manually site-name or ranking order change করে না. [1]

## Source

[1] [Google Search Central — Provide a site name to Google Search](https://developers.google.com/search/docs/appearance/site-names)
