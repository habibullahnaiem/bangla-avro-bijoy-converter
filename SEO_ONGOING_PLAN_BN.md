# অভ্রজয়: চলমান Google SEO পরিকল্পনা

**সর্বশেষ হালনাগাদ: ২৫ আগস্ট ২০২৬**

## সম্পন্ন ভিত্তি

AvroJoy-এর একমাত্র অনুসন্ধানযোগ্য প্রাথমিক URL হলো **https://avrojoy.vercel.app/**। এই ঠিকানাটি এখন Git-সিঙ্কড Vercel `avrojoy` প্রজেক্টের Production domain; তাই shared root `client/`-এ করা অনুমোদিত পরিবর্তন Git checkpoint-এর মাধ্যমে Vercel-এ প্রকাশিত হবে। homepage-এ canonical URL, Google ownership meta tag, Open Graph data এবং FAQ structured data live আছে। `robots.txt` crawl অনুমোদন করে এবং `sitemap.xml` প্রকাশ করে।

Google Search Console-এ URL-prefix property-এর ownership **HTML tag**-এ verified হয়েছে এবং **/sitemap.xml** সফলভাবে submit হয়েছে। Search Console প্রথম পাঠেই একটি discoverable page দেখিয়েছে। Sitemap গ্রহণ করা crawl discovery-তে সহায়তা করে, তবে এটি কোনো নির্দিষ্ট ranking বা তৎক্ষণাৎ index হওয়ার নিশ্চয়তা নয়। [1] [2]

| বিষয় | বর্তমান অবস্থা | কেন বজায় রাখা জরুরি |
| --- | --- | --- |
| প্রাথমিক URL | `https://avrojoy.vercel.app/` | canonical, sitemap ও Search Console property একই URL-তে থাকে |
| মালিকানা যাচাই | HTML meta tag | head থেকে tag সরালে verification হারানোর ঝুঁকি থাকে |
| Sitemap | `/sitemap.xml` submitted; status: Success | নতুন বা পরিবর্তিত public page Google-কে আবিষ্কার করতে সাহায্য করে |
| Public content | Bengali converter guide ও FAQ | বাস্তব ব্যবহারকারীর প্রশ্নের উত্তর দেয়; কেবল keyword পুনরাবৃত্তি করে না |

## পরবর্তী ৩০ দিনের মালিক-রুটিন

প্রথম কয়েক দিন Search Console-এ **Processing data** দেখানো স্বাভাবিক। প্রতি সপ্তাহে একবার Search Console-এর **Pages**, **Sitemaps** এবং **Performance** রিপোর্ট দেখুন। Pages রিপোর্টে কোনো crawl/indexing error এলে তার নির্দিষ্ট URL, কারণ ও fix validation পর্যালোচনা করুন। Performance-এ data আসতে শুরু করলে ব্যবহারকারীরা কোন Bangla query দিয়ে AvroJoy খুঁজছেন সেটি দেখুন; query-টি প্রাসঙ্গিক হলে বিদ্যমান guide বা FAQ-তে স্পষ্ট, তথ্যবহুল উত্তর যোগ করা যায়। [2]

| সময় | করণীয় | গ্রহণযোগ্য ফল |
| --- | --- | --- |
| এখন | HTML verification tag, canonical, robots ও sitemap অপরিবর্তিত রাখা | ownership ও crawl signals স্থিতিশীল থাকে |
| ৭ দিন পরে | Search Console Pages ও Sitemaps রিপোর্ট পর্যালোচনা | sitemap read status এবং indexing diagnostics দেখা যায় |
| ২–৪ সপ্তাহ পরে | Performance report-এর query ও page data দেখা | বাস্তব ব্যবহারকারীর প্রয়োজন চিহ্নিত হয় |
| Data আসার পরে | Core Web Vitals report দেখা ও কেবল প্রয়োজনীয় performance fix করা | বাস্তব field data-ভিত্তিক UX উন্নয়ন হয় |

## টেকসই content ও authority নীতি

নতুন পেজ কেবল তখনই যোগ করা হবে যখন সেটি নির্দিষ্ট, সত্যিকারের ব্যবহারকারী সমস্যার সমাধান করে—যেমন SutonnyMJ-তে Word document paste করার নিরাপদ ধাপ, Bijoy text Unicode-এ ফিরিয়ে আনার সাধারণ সমস্যা, অথবা DOCX formatting troubleshooting। প্রতিটি লেখা নিজস্ব উদাহরণ, সীমাবদ্ধতা এবং বাস্তব করণীয়সহ বাংলা ভাষায় লেখা উচিত। Google-এর people-first content নীতির সঙ্গে এটি সামঞ্জস্যপূর্ণ। [3]

অপ্রাসঙ্গিক backlink কেনা, keyword stuffing, স্বয়ংক্রিয় low-value page তৈরি, বা ranking-এর নিশ্চয়তা দাবি করা হবে না। পরিবর্তে বাংলা টাইপিং, প্রকাশনা, শিক্ষা বা document-workflow-সংশ্লিষ্ট বিশ্বাসযোগ্য website/কমিউনিটি AvroJoy-কে সত্যিকারভাবে উপকারী মনে করলে স্বাভাবিক উল্লেখ বা link পেতে পারে। Google link spam এবং helpful-content নীতিতে কৃত্রিম ranking manipulation নিরুৎসাহিত করে। [3] [4]

> **বাস্তবসম্মত প্রত্যাশা:** Search Console verification ও sitemap submission সাইটকে Google-এর কাছে discoverable করে, কিন্তু “প্রথম র‍্যাংক” নিশ্চিত করে না। অবস্থান নির্ভর করে query, প্রতিযোগিতা, content quality, ব্যবহারযোগ্যতা এবং Google-এর crawl/indexing সিদ্ধান্তের ওপর।

## রক্ষণাবেক্ষণ সতর্কতা

Converter mapping, context-sensitive কার/ফলা, DOCX font repair, special conjunct handling, অথবা shared `client/` source পরিবর্তন করার আগে existing conversion regression test চালাতে হবে। SEO-এর জন্য অপ্রয়োজনীয় code/design পরিবর্তন করা যাবে না। Vercel-এর `avrojoy-chi.vercel.app` একটি অতিরিক্ত auto-generated alias; public SEO identity হিসেবে কেবল `avrojoy.vercel.app` ব্যবহার করতে হবে।

## References

[1]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview "Build and submit a sitemap | Google Search Central"

[2]: https://support.google.com/webmasters/answer/7451184 "Sitemaps report | Google Search Console Help"

[3]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content "Creating helpful, reliable, people-first content | Google Search Central"

[4]: https://developers.google.com/search/docs/essentials/spam-policies "Google web search spam policies | Google Search Central"

