# অভ্রজয় — initial published SEO audit

## Live check

- প্রকাশিত domain: `https://avro-bijoy-vyfwtatf.manus.space/`
- Live page title: `অভ্রজয় (AvroJoy) — অভ্র ⇄ বিজয় কনভার্টার`
- Visible first-party content, Bengali document language, accessible H1 এবং functional PWA manifest উপস্থিত।

## Source audit snapshot

- `client/index.html`-এ Bengali `lang`, favicon, Apple touch icon, manifest, viewport, theme color, title এবং বাংলা meta description আছে।
- এই পর্যায়ে canonical URL, Open Graph/Twitter cards, explicit robots directive, sitemap ও JSON-LD structured data পাওয়া যায়নি; live head/response audit শেষ করে এগুলো নিশ্চিত ও সংশোধন করা হবে।

## Live head verification

প্রকাশিত site runtime-এ একটি absolute canonical (`https://avro-bijoy-vyfwtatf.manus.space/`), complete Open Graph fields এবং X/Twitter large-image card উপস্থিত। এই metadata hosting platform inject করছে; source-এ canonical/social data নেই। Live page-এ `robots` meta এবং JSON-LD structured data নেই। `robots.txt` ও sitemap endpoint পরবর্তী ধাপে পরীক্ষা ও প্রয়োজনীয় static asset তৈরি করা হবে।

## Crawl-discovery verification

Published `robots.txt` সব crawler-কে `/` crawl করতে দেয় এবং canonical sitemap URL ঘোষণা করে। Published `sitemap.xml` reachable এবং homepage-এর absolute URL ও update timestamp প্রদান করছে। অর্থাৎ crawl permission ও sitemap discovery ইতোমধ্যে সঠিক; source-level explicit robots/noindex guard এবং machine-readable JSON-LD যোগ করলে signal আরও সম্পূর্ণ হবে।

## Implemented source-level improvements

`client/index.html`-এ explicit robots এবং Googlebot index/follow directives, Bengali author metadata, Open Graph site name ও locale এবং valid `WebApplication` JSON-LD যোগ করা হয়েছে। Browser DOM audit-এ প্রতিটি directive ও JSON-LD object parse হয়েছে। Existing platform-generated canonical, Open Graph title/description/image এবং X/Twitter cards অপরিবর্তিত রাখা হয়েছে।
