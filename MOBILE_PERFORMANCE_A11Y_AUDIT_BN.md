# AvroJoy mobile performance, accessibility এবং image-alt audit

**Audit date:** ২৭ আগস্ট ২০২৬, বাংলাদেশ সময়।

## Initial baseline

| বিষয় | পর্যবেক্ষণ | সিদ্ধান্ত |
|---|---|---|
| Real-user field data | PageSpeed Insights mobile report-এ **No Data** দেখা গেছে। | CrUX/Core Web Vitals-এর বাস্তব-user score এখন বলা যাবে না। |
| Lab report availability | Public PageSpeed API একই সময়ে rate-limited (`429`) হয়েছে এবং browser report-এর diagnostic stage সম্পূর্ণ হয়নি। | পুরোনো 72 mobile lab score-কে current score বলা হবে না; production re-test পরে করা হবে। |
| Active visual transfers | Main WebP hero প্রায় 172 KiB; keyboard texture প্রায় 33 KiB। Header glyph ribbon প্রায় 185 KiB এবং decorative। | New hero/keyboard compression ইতিমধ্যে কার্যকর; remaining decorative imagery ও render work conservativeভাবে review হবে। |
| Semantic images | Public page sources-এ logo `<img>`-গুলোর meaningful Bengali alt text আছে। CSS background images decorative; এগুলোর alt text থাকে না। | Missing/weak logo alt wording, social-image metadata এবং decorative image treatment review করা হবে। |

## Scope boundary

কোনো conversion mapping, DOCX/TXT output, font rendering, theme composition বা external service পরিবর্তন করা হবে না। শুধু measured loading path, meaningful image descriptions, mobile input/interactive accessibility ও existing crawl-visible SEO signal-এর low-risk improvement বিবেচিত হবে।

## Completed improvements

| পরিবর্তন | যাচাইকৃত ফল | ব্যবহারকারী-প্রভাব |
|---|---|---|
| DOCX-only JSZip lazy loading | Shared production initial JavaScript bundle প্রায় **626,130 B → 528,205 B**; JSZip প্রায় **97,535 B** আলাদা chunk-এ শুধু DOCX workflow-এ load হবে। Vercel static initial bundle প্রায় **881,720 B → 783,426 B**। | Text Converter দিয়ে প্রথম mobile load-এ অপ্রয়োজনীয় DOCX processing code নামবে না। |
| Mobile zoom | Viewport থেকে `maximum-scale=1` সরানো হয়েছে। | Low-vision বা ছোট-screen ব্যবহারকারী browser-এর pinch zoom ব্যবহার করতে পারবেন। |
| Social image description | Root Open Graph এবং Twitter image-এর জন্য একই truthful Bengali image description যোগ হয়েছে। | Link preview ব্যবহারকারীকে image context দেয়; social accessibility উন্নত হয়। |
| Inline image-alt audit | Public logo image-গুলোর Bengali alt text আছে। Optional dialog logo-তে generic `Dialog graphic` বাদ দিয়ে decorative `alt=""` ব্যবহার হয়েছে। CSS background images decorative হওয়ায় alt text প্রযোজ্য নয়। | Screen reader-এ meaningful logo description থাকে, আর decorative dialog image অপ্রয়োজনীয়ভাবে announce হয় না। |

## Validation

Root TypeScript check, ৯টি root tests এবং production build পাস করেছে। Vercel static type check, ১৭টি tests এবং crawl-visible build পাস করেছে। Mobile (375×812) ও desktop (1280×720) visual checks-এ layout/theme change দেখা যায়নি। PageSpeed-এর live field data এখনও নেই এবং নতুন lab request rate-limited হওয়ায় এই pass-এর জন্য নতুন Lighthouse score দাবি করা হচ্ছে না।

## DOCX loader release: PageSpeed recheck status

২৭ আগস্ট ২০২৬-এ production URL দিয়ে PageSpeed Insights-এর mobile analysis দুবার শুরু করা হয়েছে। উভয় run-এ report UI **No Data** field-data status দেখিয়েছে, কিন্তু diagnostic scorecard শেষ হওয়ার আগেই `Enter a valid URL`/loading state-এ আটকে গেছে। একই সময়ে public PageSpeed API rate-limited (`429`) ছিল। ফলে PageSpeed থেকে unverified score বা opportunity লেখা হবে না। Alternate Lighthouse measurement দিয়ে mobile ও desktop lab audit সম্পন্ন করা হবে; এটি field data নয়—controlled synthetic test হবে।
