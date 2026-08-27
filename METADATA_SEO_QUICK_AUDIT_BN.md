# AvroJoy: Metadata ও SEO Tag দ্রুত audit

**Audit date:** ২৭ আগস্ট ২০২৬  
**Scope:** Homepage `/` এবং high-intent routes `/avro-to-bijoy`, `/bijoy-to-unicode`, `/docx-txt-bijoy-converter`।

## সারসংক্ষেপ

Priority conversion routes-এর জন্য বর্তমান implementation-এ দরকারি SEO fundamentals উপস্থিত এবং production raw HTML-এ served হচ্ছে। Homepage ও তিনটি guide-এর title, page-specific description, canonical URL, index/follow directives, Open Graph/Twitter metadata এবং relevant JSON-LD আছে। তিনটি guide build-time pre-rendered হওয়ায় JavaScript ছাড়া crawler-ও route-specific title, canonical, Article, FAQPage ও Breadcrumb data পায়।

| অংশ | বর্তমান অবস্থা | Audit verdict |
|---|---|---|
| Unique title | Homepage এবং তিন guide-এ আলাদা, intent-matched Bengali title | ঠিক আছে |
| Meta description | Homepage/site-level এবং guides/page-level description আলাদা | ঠিক আছে |
| Canonical | প্রতিটি priority route-এ self-canonical URL | ঠিক আছে |
| Robots | `index, follow` এবং snippet/image controls উপস্থিত | ঠিক আছে |
| Open Graph / Twitter | `og:title`, `og:description`, `og:url`, image এবং Twitter equivalents আছে | ঠিক আছে |
| Site identity | Root `WebSite`, `Organization`, `WebApplication` entities একই `অভ্রজয়` primary name ব্যবহার করে | ঠিক আছে |
| Guide markup | `Article`, `BreadcrumbList`, FAQ content matching the visible guide | ঠিক আছে |
| Sitemap / robots | Root sitemap has all 9 canonical public URLs; `robots.txt` references it | ঠিক আছে |

Google page content থেকে query-specific snippet তৈরি করে; accurate page-specific meta description ব্যবহার করতে পারে, কিন্তু সেটি বা title tag সরাসরি exact search-result text force করে না। [1]

## Safe future opportunities

| সুযোগ | কখন করবেন | বাস্তব উপকার | SEO rank-এর উপর দাবি |
|---|---|---|---|
| `og:image:alt` ও `twitter:image:alt` | বর্তমান hero image-এর সত্য বর্ণনা নিশ্চিত হলে | Social sharing accessibility ও image context | Direct ranking guarantee নয় |
| Article `datePublished`, `image`, `author.url` | প্রতিটি guide-এর আসল publication date, article-representative image এবং বাস্তব author/about URL থাকলে | Article entity আরও complete হবে | Rich result বা rank guaranteed নয় |
| Supporting five public pages-এর raw prerender | তাদের social preview/raw crawler metadata গুরুত্বপূর্ণ হলে | Story/checklist/privacy/contact/terms direct-load metadata আরও consistent হবে | Priority conversion query-র তাৎক্ষণিক rank boost নয় |

Google Article structured data-তে যতগুলো **প্রযোজ্য ও সত্য** recommended property আছে তা যোগ করতে বলে; বাস্তব author URL, publish/modified date এবং representative image না থাকলে তৈরি করে দেওয়া ঠিক নয়। [2]

## যেগুলো যোগ করা উচিত নয়

| Tag বা schema | কেন নয় |
|---|---|
| আরও `meta keywords` | Google Search-এর জন্য modern ranking signal নয়; existing legacy tag বাড়িয়ে লাভ নেই |
| একই page-এ duplicate WebSite/Organization/FAQ schema | Entity ambiguity ও maintenance risk বাড়ায় |
| FAQ count বাড়িয়ে search appearance পাওয়ার চেষ্টা | Google FAQ rich-result feature ২০২৬ সালে সরিয়ে দিয়েছে; FAQ রাখুন পাঠকের উপকারে, rich-result promise-এর জন্য নয় [3] |
| `AggregateRating`, review, download/user count | বাস্তব, verifiable data ছাড়া policy ও trust risk তৈরি করবে |
| `LocalBusiness`, `Product`, `SoftwareApplication`-এর invented price/rating fields | বর্তমান browser-based free converter-এর visible facts-এর সঙ্গে মেলে না |
| `hreflang` | একই content-এর আলাদা language/region version নেই |
| Sitemap `priority`/`changefreq` tune করা | Google এই দুটি value ignore করে; শুধু accurate canonical URL ও actual `lastmod` দরকার [4] |

## সিদ্ধান্ত

এই audit-এ **priority homepage ও তিন guide-এর জন্য কোনো blocking metadata gap পাওয়া যায়নি**। সবচেয়ে ছোট, truthful optional enhancement হলো social-image alt tags; এটি usability/social context উন্নত করবে, কিন্তু rank force করবে না। Better next measurement হবে Search Console Performance report-এ data আসার পর query-level impressions, clicks ও position দেখা। তার আগে metadata বারবার বদলানো সঠিক নয়।

## References

[1]: https://developers.google.com/search/docs/appearance/snippet "Google Search Central — Control your snippets in search results"
[2]: https://developers.google.com/search/docs/appearance/structured-data/article "Google Search Central — Article structured data"
[3]: https://developers.google.com/search/updates "Google Search Central — Search documentation updates"
[4]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap "Google Search Central — Build and submit a sitemap"
