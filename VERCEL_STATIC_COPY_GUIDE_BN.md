# AvroJoy-এর Vercel Static Copy: ব্যবহার ও আপডেট গাইড

এই নির্দেশিকাটি AvroJoy-এর দুইটি আলাদা সংস্করণ বুঝতে এবং ভুল জায়গায় পরিবর্তন না করে নিরাপদে update দিতে সাহায্য করবে। এখানে বর্ণিত Vercel সংস্করণটি একটি **public static copy**; এতে account login, database, private file storage বা “আমার নথি” সুবিধা নেই।

> সবচেয়ে গুরুত্বপূর্ণ নিয়ম: **Manus site এবং Vercel site আলাদা।** একটি পরিবর্তন অন্যটিতে নিজে থেকে কপি হয় না, যদি না সেই সংস্করণের source-এ পরিবর্তন করা হয়।

## ১. বর্তমানে কী কোথায় আছে

| বিষয় | বর্তমান অবস্থা |
|---|---|
| Public Vercel site | [https://avrojoy.vercel.app/](https://avrojoy.vercel.app/) |
| Vercel project | `avrojoy` |
| Vercel team | `HN` |
| GitHub repository | `habibullahnaiem/bangla-avro-bijoy-converter` |
| Git production branch | `main` |
| Vercel build root | `vercel-static/` |
| বর্তমান Manus site | `https://avro-bijoy-vyfwtatf.manus.space` |
| Vercel copy-তে login/storage | নেই—ইচ্ছাকৃতভাবে বাদ দেওয়া হয়েছে |

Vercel projectটি GitHub repository-এর `main` branch-এর সঙ্গে যুক্ত। `main`-এ নতুন commit গেলে Vercel নতুন build করে production deployment দেয়। সর্বশেষ checkpoint push হওয়ার পর একটি আলাদা `READY` deployment তৈরি হওয়ায় এই automatic flow যাচাই করা হয়েছে। Git-connected deployment সাধারণত automatic update-এর জন্য Vercel-এর সুপারিশকৃত পদ্ধতি। [1]

## ২. দুই সংস্করণের পার্থক্য

| বিষয় | Manus full-stack সংস্করণ | Vercel static সংস্করণ |
|---|---|---|
| মূল source location | repository-এর root `client/`, `server/`, `drizzle/` ইত্যাদি | `vercel-static/` folder |
| প্রকাশিত URL | `avro-bijoy-vyfwtatf.manus.space` | `avrojoy.vercel.app` |
| Text conversion | আছে | আছে |
| DOCX/TXT local conversion | আছে | আছে |
| PWA ও offline support | আছে | আছে |
| Light/dark mode, share, support, local history | আছে | আছে |
| Login ও private saved documents | আছে | নেই |
| Database ও managed File Storage | আছে | নেই |

Vercel copy-তে file conversion browser-এর মধ্যেই চলে। অর্থাৎ user-এর DOCX/TXT file server database-এ save হয় না। এটি public converter হিসেবে সহজ, দ্রুত এবং credential-free রাখার উদ্দেশ্যে করা হয়েছে।

## ৩. কোন পরিবর্তন কোন source-এ করবেন

| আপনি কী বদলাতে চান | যে source পরিবর্তন করতে হবে | ফলাফল |
|---|---|---|
| শুধু Vercel site-এর লেখা, UI, style বা converter behaviour | `vercel-static/` | Git push-এর পরে Vercel auto-deploy হবে |
| শুধু Manus full-stack site-এর feature | repository root-এর মূল application files | শুধু Manus site update হবে |
| দুই site-এ একই change | root source **এবং** `vercel-static/` | দুই সংস্করণে আলাদাভাবে পরীক্ষা ও deploy হবে |
| login/storage/database feature | শুধু Manus full-stack source | Vercel static copy-তে এটি যোগ করবেন না, যদি না আবার full-stack migration চান |

যদি আমাকে change করতে বলেন, অনুরোধে একটি বাক্য যোগ করলেই যথেষ্ট:

> “এই পরিবর্তনটি Vercel static copy-তেও দিন।”

অথবা:

> “শুধু Manus version-এ পরিবর্তন করুন।”

এতে কোন version-এ কাজ হবে তা পরিষ্কার থাকে এবং accidental mismatch কমে।

## ৪. স্বাভাবিক update workflow

### পদ্ধতি A — আমাকে দিয়ে update করানো

এটি সবচেয়ে নিরাপদ পদ্ধতি। আপনি বাংলা ভাষায় কী পরিবর্তন চান তা লিখবেন এবং জানাবেন সেটি **Vercel**, **Manus**, নাকি **দুই version**-এ লাগবে। আমি source update, type/build test এবং deployment check করে দেব।

উদাহরণ:

> “Hero heading-এর লেখা বদলাও, শুধু Vercel version-এ।”

> “নতুন converter fixটি Manus ও Vercel দুই version-এ দাও।”

### পদ্ধতি B — GitHub থেকে নিজে update দেওয়া

GitHub-এ নিজে code edit করতে চাইলে নিচের flow ব্যবহার করুন।

1. GitHub-এ `habibullahnaiem/bangla-avro-bijoy-converter` repository খুলুন।
2. `vercel-static/` folder-এ যান।
3. প্রয়োজনীয় file edit করুন। সাধারণত UI-এর জন্য `vercel-static/client/src/pages/Home.tsx` ও style-এর জন্য `vercel-static/client/src/index.css` প্রাসঙ্গিক।
4. `main` branch-এ commit করুন।
5. Vercel Dashboard → **avrojoy** → **Deployments**-এ নতুন build দেখুন। build `READY` হলে [avrojoy.vercel.app](https://avrojoy.vercel.app/) refresh করে ফল দেখুন।

> সতর্কতা: Vercel copy-তে converter mapping বা DOCX logic পরিবর্তন করলে মূল স্থিতিশীল converter logic ভাঙার ঝুঁকি থাকে। সেই ধরনের পরিবর্তন আগে test ছাড়া করবেন না।

## ৫. Vercel Dashboard-এ কী দেখবেন

Vercel Dashboard-এ **HN → avrojoy** project খুলুন। সবচেয়ে দরকারি অংশগুলো নিচে দেওয়া হলো।

| জায়গা | ব্যবহার |
|---|---|
| **Deployments** | কোন commit থেকে কোন build হয়েছে, READY/ERROR status, build log ও rollback history দেখা |
| **Settings → Git** | linked GitHub repository, production branch ও root directory যাচাই |
| **Settings → Domains** | `avrojoy.vercel.app` দেখা বা পরে custom domain যোগ করা |
| **Settings → Build and Deployment** | Vite build configuration যাচাই |
| **Logs** | build বা runtime সমস্যা অনুসন্ধান |

বর্তমান linked repository private হলেও Vercel-এর অনুমোদিত GitHub App শুধু এই integration-এর প্রয়োজনীয় access পায়। ভবিষ্যতে access সীমিত বা বাতিল করতে চাইলে GitHub-এর installed applications settings থেকে Vercel-এর repository access পরিবর্তন করা যায়।

## ৬. Update deploy হয়েছে কি না কীভাবে বুঝবেন

প্রতিটি update-এর পরে এই পাঁচটি জিনিস পরীক্ষা করুন।

1. Vercel Dashboard-এর latest deployment-এর status **READY** কি না দেখুন।
2. Deployment-এর commit message ও commit SHA আপনার পরিবর্তনের সঙ্গে মেলে কি না দেখুন।
3. [avrojoy.vercel.app](https://avrojoy.vercel.app/) খুলে সংশ্লিষ্ট UI বা converter flow পরীক্ষা করুন।
4. টেক্সট converter হলে একটি ছোট sample দিন: `শ্রাবণ ন্ট রূঢ়`। বিজয় output আসছে কি না দেখুন।
5. DOCX/TXT flow পরিবর্তন করলে একটি পরীক্ষামূলক local file দিয়ে upload, conversion, preview ও download পরীক্ষা করুন।

Vercel build root হিসেবে একটি নির্দিষ্ট subdirectory ব্যবহার করতে পারে; এ project-এ সেই root হলো `vercel-static/`। [2]

## ৭. PWA ও browser cache-এর কারণে পুরোনো version দেখা গেলে

AvroJoy একটি PWA। তাই deploy হওয়ার পরেও কখনো browser পুরোনো cached asset দেখাতে পারে। এই ক্ষেত্রে:

1. siteটি একবার close করে আবার খুলুন।
2. desktop browser-এ hard refresh দিন: **Ctrl + Shift + R** (Windows/Linux) অথবা **Cmd + Shift + R** (Mac)।
3. মোবাইলে site refresh করুন; প্রয়োজন হলে installed PWA বন্ধ করে পুনরায় খুলুন।
4. একেবারেই পুরোনো UI থাকলে installed PWA remove করে আবার site থেকে install করুন।

এটি code failure বোঝায় না; service worker এবং browser cache নতুন asset নেওয়ার আগ পর্যন্ত পুরোনো version রাখতে পারে।

## ৮. কোনো update খারাপ হলে rollback

কোনো নতুন Vercel deployment-এ সমস্যা হলে আগের `READY` deployment-এ ফিরে যাওয়া যায়। সাধারণ workflow:

1. Vercel Dashboard → **avrojoy** → **Deployments** খুলুন।
2. কাজ করছিল এমন আগের `READY` deployment নির্বাচন করুন।
3. Vercel-এর rollback বা production promotion action ব্যবহার করে আগের deployment-এ traffic ফিরিয়ে দিন।
4. তারপর GitHub-এ ভুল commit ঠিক করুন; নইলে নতুন push আবার ওই ভুল source থেকে deploy হতে পারে।

Vercel-এর rollback command একটি আগের deployment ID বা URL-কে production-এ ফিরিয়ে দিতে পারে। [3]

> Rollback Vercel-এর live version ফিরিয়ে দেয়, কিন্তু GitHub-এর ভুল code নিজে থেকে মুছে দেয় না। সুতরাং rollback-এর পরে source-ও ঠিক করা জরুরি।

## ৯. Custom domain যোগ করতে চাইলে

বর্তমান addressটি [avrojoy.vercel.app](https://avrojoy.vercel.app/)। ভবিষ্যতে নিজের domain—যেমন `avrojoy.com` বা `avrojoy.bd`—নিতে চাইলে Vercel Dashboard-এর **Settings → Domains** থেকে domain যোগ করতে হবে। সেখানে Vercel যে DNS record দেখাবে, সেটি domain provider-এর DNS panel-এ বসাতে হবে।

Custom domain যোগ করলেও GitHub auto-deploy workflow একই থাকবে; শুধু public address বদলাবে।

## ১০. ছোট checklist

| পরিবর্তনের আগে | পরিবর্তনের পরে |
|---|---|
| কোন version বদলাবেন ঠিক করুন | Vercel Deployment `READY` দেখুন |
| converter mapping পরিবর্তন হলে test sample প্রস্তুত রাখুন | live URL-এ conversion test করুন |
| Vercel-specific change হলে `vercel-static/` target করুন | PWA cache থাকলে hard refresh দিন |
| দুই version হলে দুই জায়গার source update পরিকল্পনা করুন | সমস্যা হলে আগের deployment rollback করুন |

## সংক্ষিপ্ত সিদ্ধান্ত

আপনার দৈনন্দিন ব্যবহারের জন্য এখন নিয়মটি খুব সহজ:

> **Vercel-এর জন্য পরিবর্তন → `vercel-static/` → GitHub `main` commit → automatic Vercel deploy.**

> **Manus-এর জন্য পরিবর্তন → মূল project source → Manus checkpoint/publish.**

দুই version-এ একই পরিবর্তন চাইলে আমাকে স্পষ্ট করে “দুই version-এ দিন” বলবেন।

## References

[1]: https://vercel.com/docs/analytics/quickstart "Vercel: Deploy Application to Vercel"
[2]: https://vercel.com/docs/cli/deploy "Vercel: Deploy with custom path"
[3]: https://vercel.com/docs/deployments/promote-preview-to-production "Vercel: Rollback Production Deployment"
