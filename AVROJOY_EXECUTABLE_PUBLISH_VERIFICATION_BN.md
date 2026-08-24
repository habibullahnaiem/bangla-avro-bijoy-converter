# AvroJoy executable publish-verification report

## সিদ্ধান্ত

**বর্তমান যাচাই অনুযায়ী প্রকাশের জন্য প্রস্তুত।** একটি বাস্তব publish blocker পাওয়া গিয়েছিল: sandbox-wide `NODE_ENV=development`-এর কারণে আগের build থেকে service-worker registration বাদ পড়ছিল। Build script-এ explicit production mode দেওয়া হয়েছে, তারপর নতুন production bundle-এ active service worker, shell cache এবং PWA manifest যাচাই করা হয়েছে।

## যাচাইকৃত ফল

| ক্ষেত্র | ফল | প্রমাণ |
|---|---|---|
| TypeScript ও production build | Pass | `pnpm exec tsc --noEmit` এবং `pnpm run build` সফল |
| Core conversion regressions | Pass | core, quote, e-kar, r-fola, contextual R-kar, candidate conjunct, 152-form supported conjunct এবং DOCX stability audit pass |
| PWA manifest | Pass | Bangla app name, standalone display, icon, start URL, colors ও scope returned |
| Production service worker | **Fixed and pass** | active controller, activated registration এবং `avrojoy-offline-v1-shell` cache confirmed |
| Offline shell cache | Pass | app shell, index, manifest, generated JS/CSS, logo/banner ও SutonnyMJ/Bengali font assets cached |
| Desktop UI | Pass | full-page layoutে missing asset বা layout-breaking overlap দেখা যায়নি |
| Mobile UI | Pass | 375px full-page layoutে core controls, converter panel, card ও footer visible; one-column flow বজায় |
| Managed runtime assets | Pass | managed previewে SutonnyMJ ও Hind Siliguri loaded; logo image 702×526 natural dimensions সহ loaded |
| Live conversion | Pass | mixed Bangla/English stress sample native raw Bijoy outputে convert হয়েছে |
| Copy interaction | Pass | Copy to Clipboard actionে success toast দেখা গেছে |
| Keyboard smoke test | Pass | Tab focus দৃশ্যমান outlineসহ `রূপান্তর করুন` controlে পৌঁছেছে |
| File converter entry | Pass | DOCX/TXT upload screen, directions এবং repair path visible; accepted MIME/extensions confirmed |

## যে সংশোধন করা হয়েছে

`package.json`-এর build command এখন `NODE_ENV=production vite build` দিয়ে শুরু হয়। ফলে build environment sandbox-এর inherited development mode দ্বারা প্রভাবিত হয় না এবং `import.meta.env.PROD` branch-এ থাকা PWA registration production bundle-এ থাকে। এই পরিবর্তন conversion logic, byte mapping, DOCX logic, UI behavior বা design-এ কোনো পরিবর্তন করে না।

## প্রকাশের আগে আর বাধ্যতামূলক কাজ নেই

এই পরিবেশে যা যাচাই করা সম্ভব ছিল, তা সম্পন্ন হয়েছে। Browser automation label-wrapped file input-এ test DOCX submit করতে পারেনি; এটি automation-target limitation। তবে existing DOCX audit একই ধরনের generated fixture-এ pass করেছে এবং production UI-তে file input, accepted types ও file-converter path দেখা গেছে। Desktop Microsoft Word-এ human edit/reopen এবং সত্যিকারের device airplane-mode test sandbox থেকে চালানো সম্ভব নয়; এগুলো প্রকাশ ঠেকানোর কারণ নয়, কারণ core document and PWA mechanisms ইতোমধ্যে যথাক্রমে audit ও production cache/controller দিয়ে যাচাই হয়েছে।

## Non-blocking observations

Production JS bundle minification-এর পরে 523.26 kB (158.42 kB gzip); Vite code-splitting advisory দেখায়, তবে এটি build error নয়। ভবিষ্যৎ performance pass-এ lazy loading বিবেচনা করা যায়, কিন্তু বর্তমান release correctness বা PWA readiness-এ বাধা নয়।

## প্রকাশের পদক্ষেপ

এখন একটি checkpoint নেওয়া উচিত। তারপর Management UI-র **Publish** button ব্যবহার করে প্রকাশ করা যাবে। প্রকাশ নিজে এখানে চালানো হয়নি।
