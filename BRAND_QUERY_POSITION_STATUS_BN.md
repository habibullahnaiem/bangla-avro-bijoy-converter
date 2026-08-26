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

---

## Targeted follow-up diagnosis

**পর্যবেক্ষণ:** ২৬ আগস্ট ২০২৬, বাংলাদেশ সময়। এটি একটি public-search snapshot ও live production source check; ব্যক্তিভেদে Google-এর location, language, account, search history এবং reprocessing stage অনুযায়ী ফল আলাদা হতে পারে।

| যাচাই | বর্তমান ফল | অর্থ |
|---|---|---|
| Exact Bengali brand association | স্বাধীন search snapshot-এ `অভ্রজয়`-এর জন্য AvroJoy homepage-এর title ও snippet পাওয়া গেছে; একই domain-এর তিনটি guide-ও indexed ফল হিসেবে দেখা গেছে। | Google/অন্যান্য search system-এর index-এ brand-to-domain association অনুপস্থিত নয়। |
| Live homepage identity | Production homepage `200 OK` দেয়; root canonical, title, `og:site_name`, একটিমাত্র root `WebSite` entity এবং crawl-visible H1-এ একই primary spelling `অভ্রজয়`, সঙ্গে `AvroJoy` আছে। | কোনো duplicate-homepage redirect বা on-page source conflict ধরা পড়েনি। |
| Roman-name ambiguity | `AvroJoy`-এর English-space form (`Avro Joy`) দিয়ে শিশুদের chair/furniture-সম্পর্কিত unrelated ফলও পাওয়া যায়। | Roman spellingটি স্বতন্ত্রভাবে সব বাজারে unique entity নয়; Bengali spelling এবং converter context একসঙ্গে রাখা সঠিক। |
| Search Console measurement | বর্তমান browser session-এ verified Search Console account available ছিল না; আগের property-wide Performance report-ও processing অবস্থায় ছিল। | বর্তমান average position বা query-wise click number বলা যাবে না। |

### Decision

বর্তমান source-এ নতুন schema, দ্বিতীয় `WebSite` block, keyword-heavy brand text, artificial citation বা repeated indexing request যোগ করার যৌক্তিকতা নেই। Google-এর official guidance অনুযায়ী homepage-এর একটিমাত্র concise preferred site name, ordered alternatives, same home-page title/heading/`og:site_name`, crawlability এবং সময়—এগুলোই প্রাসঙ্গিক; AvroJoy ইতিমধ্যে সেই অবস্থায় আছে। [1]

ব্যবহারকারীর দেখা পুরোনো second-place snapshot এবং বর্তমান public-search snapshot ভিন্ন হওয়া ranking measurement-এর স্বাভাবিক location/account/time variance ও ongoing reprocessing-এর সঙ্গে সামঞ্জস্যপূর্ণ। এটি #1-এর নিশ্চয়তা নয়। যথাযথ next check হবে Search Console-এ query data দেখা গেলে একটি evidence-based recheck; তার আগে একই source বারবার পাল্টানো নয়। Google automated ranking systems বহু page-level ও site-level signal ব্যবহার করে, তাই site-name markup একা position force করতে পারে না। [2]

## Additional source

[2] [Google Search Central — A guide to Google Search ranking systems](https://developers.google.com/search/docs/appearance/ranking-systems-guide)
