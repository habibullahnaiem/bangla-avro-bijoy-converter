# AvroJoy Search Console: live discovery status

**পরীক্ষার তারিখ:** ২৬ আগস্ট ২০২৬  
**Property:** `https://avrojoy.vercel.app/`

## Access

`avrojoyconverter@gmail.com` account-এর account-specific Search Console route (`/u/9/`) দিয়ে verified property access নিশ্চিত হয়েছে। অন্য signed-in account (`habibullahnaiem@gmail.com`) একই property-এর access পায় না; সেটি indexability failure নয়, কেবল account-permission mismatch।

## বর্তমান baseline

Search Console Overview এখনো Performance, Indexing, Experience এবং Enhancements—সব ক্ষেত্রেই **“Processing data, please check again in a day or so”** দেখাচ্ছে। তাই এ মুহূর্তে query, impression, CTR, page coverage বা Core Web Vitals দিয়ে ranking diagnosis করার মতো property-wide data পাওয়া যাচ্ছে না।

কোনো নতুন indexing request পাঠানো হয়নি। পূর্বে accepted request-এর পর বারবার request পাঠালে visibility বাড়ে না; বর্তমান লক্ষ্য হলো existing indexed URL এবং নতুন crawl-visible guide output নিরাপদে যাচাই করা।

## URL Inspection ফল

২৬ আগস্ট ২০২৬-এ Search Console URL Inspection-এ `https://avrojoy.vercel.app/avro-to-bijoy`-এর জন্য **“URL is on Google”**, **“Page is indexed”** এবং **“Page is served over HTTPS”** দেখা গেছে। অর্থাৎ Google-এ না-আসার কারণ এই guide-এর indexability বা HTTPS failure নয়। Property-wide query/performance report এখনো processing হওয়ায় generic query-তে impression/position না-পাওয়ার কারণটি Search Console-এর data দিয়ে এখনও নির্দিষ্ট করা যাচ্ছে না।

একই inspection-এ homepage `https://avrojoy.vercel.app/`-এর জন্যও **“URL is on Google”**, **“Page is indexed”** এবং **“Page is served over HTTPS”** পাওয়া গেছে। ফলে root homepage বা priority guide—কোনোটিই Google index থেকে বাদ পড়েনি। বর্তমান সমস্যা generic conversion query-তে ranking/discovery competitiveness, indexing blockage নয়।

## Live query spot check

একই browser/session-এ `ইউনিকোড টু বিজয়` query-র প্রথম visible Google results-এ AvroJoy দেখা যায়নি; সেখানে Bangla.plus, Bangla Converter, ShumanBD এবং অন্য পুরোনো/পরিচিত converter resource দেখা গেছে। এটি একটি **location, time ও account-নির্ভর spot check**, স্থায়ী rank measurement নয়। তবে এটি Search Console inspection-এর সঙ্গে মিলিয়ে নিশ্চিত করে যে AvroJoy index-এ আছে, কিন্তু ওই generic intent-এ এখনও যথেষ্ট ranking signal অর্জন করেনি।

তুলনায় exact brand query `অভ্রজয়`-এ AvroJoy homepage এবং `/avro-to-bijoy` guide দুটিই প্রথম visible results-এর মধ্যে দেখা গেছে। Homepage-এর displayed site name তখনও `Vercel` ছিল, যদিও source-level AvroJoy WebSite/Organization signal আগেই প্রকাশিত আছে; Google নিজে display label নির্বাচন করে এবং সেটি recrawl/reprocess-এর পরে বদলাতে পারে। এই spot check-এ brand discovery কার্যকর, কিন্তু generic conversion intent-এ authority ও query-level history এখনও দুর্বল।

## Sitemap ও crawl freshness

Search Console-এ `/sitemap.xml` **Success** অবস্থায় submitted আছে; সেখানে ২৫ আগস্ট ২০২৬-এর submission/last-read এবং ১টি discovered page দেখাচ্ছে। নতুন crawl-visible guide release ২৬ আগস্টে প্রকাশিত হওয়ার পরে sitemap এখনও নতুন করে read হয়েছে—এমন কোনো signal এই report-এ নেই।

Live production sitemap নিজে যাচাই করে **৯টি URL entry** পাওয়া গেছে—homepage, তিনটি priority conversion guide, origin story, privacy, terms, contact এবং thesis checklist। তাই Search Console-এর ১টি discovered-page সংখ্যা live sitemap-এর সীমাবদ্ধতা নয়; এটি আগের read-এর processing/freshness lag।

`/avro-to-bijoy` URL Inspection-এর stored crawled-page viewer-এ নতুন static route marker `data-route="avro-to-bijoy"` পাওয়া যায়নি, যদিও production raw HTML-এ marker, route-specific canonical এবং `FAQPage` আগে live-verify করা হয়েছে। এটি ইঙ্গিত দেয় Google-এর stored crawl সম্ভবত latest pre-rendered guide release-এর আগের। এই কারণেই নতুন guide content-এর ranking signal এখনও ফলাফলে প্রতিফলিত হয়নি বলে মনে হয়। এটি একটি freshness observation; নতুন indexing request পাঠানো হয়নি।

আগের একবারের Search Console follow-up schedule ২৬ আগস্ট ২০২৬, ১০:০৬ Asia/Dhaka-তে চলেছে এবং এখন paused/expired। তাই duplicate schedule বা repeated request তৈরি করা হয়নি।

## Current live-fetch test

Search Console-এর **Live Test** ২৬ আগস্ট ২০২৬-এ `/avro-to-bijoy`-কে **“URL is available to Google”** এবং **“Page can be indexed”** হিসেবে দেখিয়েছে। একই test-এ **Breadcrumbs: 2 valid items detected** পাওয়া গেছে। অর্থাৎ Google বর্তমানে live production document fetch করতে ও structured breadcrumb signal বুঝতে পারছে। এখন প্রয়োজন Google-এর স্বাভাবিক recrawl, index refresh এবং সময়ের সঙ্গে query/authority signal জমা হওয়া—আর কোনো crawl-blocking code fix নয়।

## Latest query-alignment check

Verified owner account-এ Search Console Overview পুনরায় খোলা হলে Performance, Indexing, Experience এবং Enhancements report এখনও **“Processing data, please check again in a day or so”** দেখিয়েছে। তাই query-level CTR, average position বা impression দিয়ে এখনো content decision নেওয়া যাচ্ছে না।

Source review-এ দেখা গেছে root homepage-এর title ও description `অভ্রজয় (AvroJoy)` দিয়ে শুরু হলেও visible converter control ও hero-তে `অভ্র/ইউনিকোড → বিজয়` এবং `বিজয় → অভ্র/ইউনিকোড` স্পষ্ট। প্রথম-page comparator-দের মতো root page-এ exact generic query phrase শুরুতেই না থাকা একটি safe on-page alignment opportunity—কিন্তু এটি ranking guarantee নয় এবং keyword stuffing ছাড়া শুধু title/description ও প্রথম visible explanatory copy-তে natural wording হিসেবে বিবেচ্য।

Links report-ও এখনও **“Processing data, please check again in a day or so”** দেখাচ্ছে। ফলে Search Console থেকে external-link count, referring domain বা anchor-text evidence এখনও পাওয়া যায়নি; এই মুহূর্তে external-link-based diagnosis বা action করা যুক্তিসঙ্গত নয়।

Core Web Vitals report-এ mobile ও desktop—দুই ক্ষেত্রেই গত ৯০ দিনে **“Not enough usage data”** দেখিয়েছে। তাই field CWV failure-কে generic ranking gap-এর কারণ বলা যায় না; site-টির query-level Performance, links এবং field-experience data এখনও যথেষ্ট পরিমাণে জমেনি।

PageSpeed Insights-এর mobile lab run-এ Performance **60**, Accessibility **95**, Best Practices **100** এবং SEO **100** এসেছে; একই report-এ real-user data **No Data**। এটি একটি synthetic lab result—Google Search Console-এর field CWV বা direct ranking measurement নয়—তবে mobile loading experience উন্নত করার সম্ভাব্য সুযোগ আছে। কোনো performance change করার আগে specific diagnostic opportunity আলাদা করে যাচাই করা দরকার।

পরবর্তী lab diagnostic-এ FCP **6.2 s**, LCP **10.8 s**, TBT **0 ms** এবং CLS **0.008** দেখা গেছে; render-blocking request-এর estimate **4,840 ms** এবং image delivery savings **353 KiB**। Homepage-এর mobile hero-তে ব্যবহৃত public image দুটির বর্তমান payload মেপে পাওয়া গেছে: `avrojoy-hero-v2-banner` প্রায় **275 KiB** এবং `bangla-converter-keyboard-background` প্রায় **77 KiB**—মোট প্রায় **352 KiB**। তাই একই artwork-এর efficient modern-image delivery যাচাই করা একটি concrete, low-risk performance candidate; এটি field ranking guarantee নয়।
