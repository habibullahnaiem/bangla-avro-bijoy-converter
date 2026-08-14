# TODO — সিস্টেমেটিক বাগ অডিট

## ফেজ ১: কনভার্টার লজিক অডিট
- [ ] ম্যাপিং টেবিল বনাম কাল্পনিক রেফারেন্স ipaedia ক্রস-চেক: ন্ধ, ন্ত, ল্ল, য়, ড়, ঢ়, র-ফলা, শ-ফলা, হ-ফলা, ঁ
- [ ] পাঙ্কচুয়েশন: দারি (।), ডাবল-দারি, ব্র্যাকেট, কোট — SutonnyMJ ক্যানোনিকাল চেক
- [ ] এ-কার-মার্ক (†/‡) শব্দ-শুরুতে ছোট থাকা চেক
- [ ] রাউন্ড-ট্রিপ: Bijoy→Avro করে আবার Avro→Bijoy — সমতুল্যতা
- [ ] এজ-কেস: খালি, পিওর-ইংলিশ, পরপর-দারি, নেস্টেড কোট, ইনস্ট্র-টেক্সট

## ফেজ ২: পাইপলাইন/ইউআই অডিট
- [ ] DOCX: ফন্ট-অ্যাসাইনমেন্ট (TNR −2pt, সুনতন্নী ডিফল্ট) রি-ভ্যালিডেট vumika-তে
- [ ] ফাইল প্রিভিউ: ডুয়াল-সাইজ সেগমেন্টেশন চেক
- [ ] কপি বোটাম: রিচ-HTML ক্লিপবোর্ড + ফলব্যাক
- [ ] টেক্সট প্যানেল: ফন্ট-সাইজ +/− লোকালস্টোরেজ, বিজয়→অভ্র দিক
- [ ] বিপরীত দিক (b2u): ইনভার্টেড ম্যাপ পরীক্ষা

## ফেজ ৩-এর পরে: E-kar পজিশন ফিক্স (রিপোর্ট)  
- [ ] relocatePreKars সরানো/সংশোধন: ে-কার ব্যঞ্জনের ঠিক পরেই থাকতে হবে, শব্দ-শুরুতে নয়  
- [ ] রিপোর্ট-কেস যাচাই: কারণ→Kvi, শব্দ পরীক্ষা  
- [ ] আগের + কেস (শ+র-ফলা ইত্যাদি) অক্ষুণ্ণ থাকা নিশ্চিত  
- [ ] সমগ্র অডিট সুইট পাস  
- [ ] চেকপয়েন্ট + ডেলিভারি  

## ফেজ ৩: ফিক্স + ভ্যালিডেশন  
- [ ] পাওয়া বাগগুলো ফিক্স
- [ ] vumika.docx + সিন্থেটিক কেস রি-ভ্যালিডেশন (LibreOffice)
- [ ] চেকপয়েন্ট + রিপোর্ট


# নতুন: দিক-পরিবর্তন হিজিবিজি ফিক্স (ইউজার রিপোর্ট)

- [ ] হোম.টিএক্সে দিক-পরিবর্তন ও সেগমেন্টেশন লজিক পর্যালোচনা
- [ ] বি→অভ্র-পরে অভ্র→বি রাউন্ড-ট্রিপ রেপ্রো করা
- [ ] রুট কজ চিহ্নিত ও ফিক্স (স্টেট/কনভার্টেড টেক্সট রিসেট)
- [ ] সব অডিট স্যুট ও স্ক্রিনশট যাচাই
- [ ] চেকপয়েন্ট ও রিপোর্ট

# নতুন: ফন্ট-পরিবর্তন পরবর্তী হিজি-বিজি ফিক্স (ইউজার রিপোর্ট)

- [ ] 1. রিপ্রোডিউস: ওয়ার্ডে পেস্ট → কিছু অংশ TNR → কপি → বক্সে পেস্ট → আবার কনভার্ট = হিজি-বিজি
- [ ] 2. রুট কজ শনাক্ত: প্রি-ম্যাপড পাঙকচুয়েশন বনাম দ্বিতীয়বার কনভার্টের দ্বন্দ্ব
- [ ] 3. ফিক্স: বক্সে-পেস্টে প্রি-ম্যাপড/রূপান্তরিত টেক্সট সনাক্ত করে পরিষ্কার করে পুনরায় কনভার্ট
- [ ] 4. রাউন্ড-ট্রিপ টেস্ট + অডিট স্যুট
- [ ] 5. চেকপয়েন্ট + রিপোর্ট

# নতুন: শব্দের মাঝের এ-কার/মাত্রা রিগ্রেশন

- [x] শব্দের মাঝের এ-কার/মাত্রা ভাঙার সঠিক ইনপুট-আউটপুট পুনরুৎপাদন করা
- [x] †/‡ নর্মালাইজেশন ও লাইব্রেরির স্বাভাবিক mid-word e-kar placement তুলনা করা
- [x] শুরুতে মাত্রা গ্রহণযোগ্য রেখে শব্দের মাঝের মাত্রা অক্ষুণ্ণ রাখার conservative mapping প্রয়োগ করা
- [x] রেল, এখন, এখনই, কেন, এটি, শ্রেণি এবং যুক্তবর্ণের round-trip যাচাই করা
- [x] পূর্ণ audit suite চালিয়ে punctuation, ঋ-কার, DOCX/TXT ও formatting আচরণ নিশ্চিত করা
- [x] UI smoke test, screenshot এবং নতুন checkpoint তৈরি করা

# নতুন: শুধু শুরু/standalone এ-কারের অতিরিক্ত মাত্রা

- [ ] standalone “এ” এবং word-initial “রেল/কেন/এখন” এর বর্তমান SutonnyMJ code ও rendering পুনরুৎপাদন করা
- [ ] mid-word “করেছে/বেশি/দেখেছে” এর ‡ code অপরিবর্তিত আছে নিশ্চিত করা
- [ ] কেবল word-initial/standalone e-kar-এর জন্য matra-less correction প্রয়োগ করা
- [ ] শুরু, মাঝ এবং যুক্তবর্ণের focused round-trip audit চালানো
- [ ] UI যাচাই, checkpoint এবং ব্যবহারকারীকে corrected version দেওয়া

# নতুন: কনভার্টার লোগো

- [x] বাংলা অক্ষর ও দ্বিমুখী রূপান্তর বোঝায় এমন স্বতন্ত্র mark direction নির্ধারণ করা
- [x] স্বচ্ছ background-এ header ও favicon-উপযোগী logo asset তৈরি করা
- [x] header, browser metadata এবং favicon-এ logo বসানো
- [x] desktop/mobile preview যাচাই এবং নতুন checkpoint তৈরি করা

# নতুন: মুখোমুখি দুই arrow লোগো

- [x] মুখোমুখি দুইটি arrow-কে প্রধান mark হিসেবে নির্ধারণ করা
- [x] স্বচ্ছ background-এ header ও favicon-উপযোগী revised logo তৈরি করা
- [x] header, favicon এবং apple-touch icon-এ revised logo বসানো
- [x] desktop/mobile preview যাচাই এবং নতুন checkpoint তৈরি করা

# নতুন: A/a/অ এবং B/b/ব পরিচয়সহ লোগো

- [x] দুই পাশে A/a/অ এবং B/b/ব-এর direct বা indirect visual cue নির্ধারণ করা
- [x] অক্ষর-ইঙ্গিত ও মুখোমুখি arrow একত্রে রেখে favicon-উপযোগী mark তৈরি করা
- [x] header, favicon এবং apple-touch icon-এ নতুন mark বসানো
- [x] desktop/mobile preview যাচাই এবং নতুন checkpoint তৈরি করা

# সংশোধন: শুধু লোগোর mark

- [x] UI বা header layout না বদলে standalone logo mark পুনর্নকশা করা
- [x] দুই মুখোমুখি arrow-এর মধ্যে A/a/অ ও B/b/ব-এর পরিষ্কার indirect cue রাখা
- [x] কেবল logo asset ও তার references প্রতিস্থাপন করা
- [x] mark-এর desktop/favicon readability যাচাই করে checkpoint তৈরি করা

# সংশোধন: অক্ষর-ধারণা আরও স্পষ্ট

- [x] বাম পাশে A/a এবং অ-এর পরিষ্কার paired visual form রাখা
- [x] ডান পাশে B/b এবং ব-এর পরিষ্কার paired visual form রাখা
- [x] দুই arrow-কে অক্ষর-জোড়ার মাঝের conversion relationship হিসেবে রাখা
- [x] শুধু logo asset প্রতিস্থাপন করে favicon ও header readability যাচাই করা

# নতুন: লোগো hover animation

- [x] logo hover-এর জন্য subtle scale, lift এবং arrow-direction motion নির্ধারণ করা
- [x] desktop hover animation implement করা, কিন্তু logo identity অপরিবর্তিত রাখা
- [x] prefers-reduced-motion ও touch/mobile behavior নিশ্চিত করা
- [x] desktop/mobile preview যাচাই করে নতুন checkpoint তৈরি করা

# নতুন: Professional UI redesign

- [x] current layout, spacing, hierarchy এবং responsive pain points audit করা
- [x] professional design system: surface, border, typography, accent এবং state নির্ধারণ করা
- [x] converter workspace, controls, file converter ও help content-এর visual hierarchy উন্নত করা
- [x] mobile, keyboard focus, hover এবং reduced-motion আচরণ refine করা
- [x] production build, representative screenshots ও নতুন checkpoint তৈরি করা

# নতুন: Recent Conversion History

- [x] current conversion state ও successful conversion insertion points audit করা
- [x] localStorage-ভিত্তিক সীমিত recent-history persistence তৈরি করা
- [x] history card-এ direction, time, preview ও দ্রুত পুনঃব্যবহারের action যোগ করা
- [x] clear-all, empty state, responsive layout ও keyboard accessibility যোগ করা
- [x] reload persistence, reuse, deletion, build ও UI verification চালানো

# নতুন: Fixed editor viewport

- [x] input/output editor ও action bar-এর বর্তমান height/overflow আচরণ audit করা
- [x] editor panes-এ নির্দিষ্ট usable height ও internal scrolling যোগ করা
- [x] “রূপান্তর করুন” action bar-কে editor content থেকে স্থির রাখা
- [x] দীর্ঘ টেক্সট, mobile width, keyboard focus এবং copy behavior যাচাই করা
- [x] production build, screenshot ও নতুন checkpoint তৈরি করা

# নতুন: Selected Bijoy output copy

- [x] visible output-এর বর্তমান selection, hidden textarea এবং pointer mapping audit করা
- [x] মাউস drag করে selected অংশ nativeভাবে নির্বাচনযোগ্য করা
- [x] Ctrl/Cmd+C-তে selected অংশ কপি এবং full-copy control অক্ষুণ্ণ রাখা
- [x] mixed-size output, long text, keyboard selection ও mobile behavior যাচাই করা
- [x] production build, screenshot ও নতুন checkpoint তৈরি করা

# নতুন: File disappearance during selection/copy

- [ ] selection/copy event, file input, reset handler ও drag/drop state trace করা
- [ ] selection/copy interaction থেকে file state ও converted result state বিচ্ছিন্ন করা
- [ ] uploaded DOCX/TXT নির্বাচন ও preview copy করার পর file state অক্ষুণ্ণ রাখা
- [ ] reset control ছাড়া কোনো accidental clear না হওয়া নিশ্চিত করা
- [ ] mouse drag, Ctrl/Cmd+C, full copy, mobile behavior, build ও checkpoint যাচাই করা

# নতুন: বিজয় আউটপুটের ফ্যাকাসে overlay/contrast সমস্যা

- [ ] output pane-এর সাদা overlay-এর উৎস: background, textarea layering ও opacity trace করা
- [ ] বিজয় preview-কে অভ্র input pane-এর মতো পরিষ্কার, opaque surface ও readable contrast দেওয়া
- [ ] native text selection, selected copy এবং uploaded-file persistence অক্ষুণ্ণ রাখা
- [ ] desktop/mobile screenshot, build, audit ও checkpoint যাচাই করা

# নতুন: ফাইল আপলোড ও প্রিন্ট প্রিভিউ উন্নতি

- [x] .docx/.txt ফাইলের drag-and-drop upload ও visual drag state যোগ করা
- [x] নির্বাচিত ফাইল, preview এবং download result পরিষ্কার করার explicit remove control যোগ করা
- [x] SutonnyMJ বাংলা ও Times New Roman ইংরেজি সাইজসহ print/PDF preview তৈরি করা
- [x] print media, desktop/mobile layout, file-state persistence, audit, build ও checkpoint যাচাই করা

# নতুন: রেফারেন্স-অনুপ্রাণিত conversion logo

- [x] supplied reference-এর arrows, bilingual conversion panels ও gesture ধারণা বিশ্লেষণ করে original mark direction নির্ধারণ করা
- [x] transparent background-এ scalable blue/green conversion logo তৈরি করা
- [x] header, favicon ও apple-touch icon-এ নতুন logo asset integrate করা
- [x] desktop/mobile readability, hover behavior, build ও checkpoint যাচাই করা

# সংশোধন: ব্যবহারকারীর দেওয়া ছবিটিই সরাসরি লোগো

- [x] exact supplied image asset-টি webdev static storage-এ সংরক্ষণ করা
- [x] header, favicon ও apple-touch icon-এ একই exact image reference বসানো
- [x] original aspect ratio বজায় রেখে header ও mobile scale যাচাই করা
- [x] build, screenshot ও নতুন checkpoint তৈরি করা

# নতুন: reference-inspired banner ও background

- [x] supplied reference-এর light blue/green palette, keyboard pattern ও conversion motifs থেকে original visual system নির্ধারণ করা
- [x] readable Bengali-first hero banner asset তৈরি করা
- [x] subtle keyboard-pattern background asset তৈরি করা
- [x] banner/background webdev storage-এ তুলে website-এ integrate করা
- [x] contrast, desktop/mobile layout, build ও checkpoint যাচাই করা

# নতুন: অভ্রজয় (AvroJoy) ব্র্যান্ডিং ও homepage copy

- [x] header, document title ও visible brand copy-তে অভ্রজয় (AvroJoy) যুক্ত করা
- [x] বাস্তব feature অনুযায়ী Bengali-first hero headline, tagline ও CTA framing আপডেট করা
- [x] relevant feature highlights এবং footer identity যোগ/পরিমার্জন করা
- [x] unsupported absolute claims বাদ দিয়ে typography, responsive layout, build ও checkpoint যাচাই করা

# নতুন: feature card icon ও ব্যবহারিক উদাহরণ

- [x] প্রতিটি feature card-এর বিষয় অনুযায়ী অর্থবহ icon নির্বাচন করা
- [x] card-গুলোতে ছোট, বাস্তবসম্মত practical example যোগ করা
- [x] icon-এর accessible label, spacing, contrast ও Bengali typography যাচাই করা
- [x] desktop/mobile layout, build, screenshot ও checkpoint যাচাই করা

# সংশোধন: আগের keyboard-themed visual ফিরিয়ে আনা

- [x] earlier keyboard-key background, glyph strip ও blue/green accent layer চিহ্নিত করা
- [x] feature-card icon ও practical example রেখে keyboard-themed styling restore করা
- [x] hero/converter hierarchy, contrast ও Bengali-first visual treatment যাচাই করা
- [x] desktop/mobile screenshot, build, regression audit ও checkpoint যাচাই করা

# সংশোধন: শহিদ মিনার, বর্ণমালা ও keyboard-themed banner

- [x] hero banner-এ শহিদ মিনারের সরল silhouette, বাংলা বর্ণমালা ও keyboard-key motif-এর composition নির্ধারণ করা
- [x] নীল–সবুজ conversion arrows ও AvroJoy visual language-এর সঙ্গে culturally grounded replacement banner তৈরি করা
- [x] headline-এর জন্য পরিষ্কার negative space ও Bengali text contrast নিশ্চিত করা
- [x] desktop/mobile banner rendering, build ও checkpoint যাচাই করা

# সংশোধন: শুধু অভ্র ⇄ বিজয় branding রাখা

- [x] visible অ ⇄ ব/অ ⇄ বি letter cue-এর সব UI occurrence চিহ্নিত করা
- [x] অতিরিক্ত cue সরিয়ে শুধু অভ্র ⇄ বিজয় text branding রাখা
- [x] exact logo image, header/hero hierarchy ও converter controls অক্ষুণ্ণ রাখা
- [x] desktop/mobile screenshot, build, regression audit ও checkpoint যাচাই করা

# নতুন: shared Bengali visual language ও logo synchronization

- [x] header ও footer-এ banner-এর মতো low-opacity keyboard texture এবং ছড়ানো বাংলা অক্ষরের motif নির্ধারণ করা
- [x] header/footer-এ ডানদিকে তুলনামূলক ঘন decorative glyph cluster রেখে readable brand/content space অক্ষুণ্ণ রাখা
- [x] footer logo-কে header-এর exact supplied logo asset/reference-এর সঙ্গে synchronize করা
- [x] mobile hero overlap fix-এর সঙ্গে header/footer decorative layers-এর responsive behavior যাচাই করা
- [x] desktop/mobile screenshot, build, converter audit ও checkpoint যাচাই করা

# নতুন: professional “উদাহরণ দেখুন” content

- [x] বর্তমান উদাহরণ অংশের copy, hierarchy ও practical relevance পর্যালোচনা করা
- [x] নাম, প্রকাশনা-ধাঁচের অনুচ্ছেদ, যুক্তবর্ণ, যতিচিহ্ন ও বাংলা–ইংরেজি mixed sample সাজানো
- [x] section-টিকে professional Bengali-first presentation-এ update করা
- [x] desktop/mobile rendering, build, converter audit ও checkpoint যাচাই করা

# নতুন: print/PDF preview action visibility

- [x] preview dialog-এর content overflow ও action-footer positioning audit করা
- [x] preview content-এ internal scroll এবং স্থির/দৃশ্যমান action bar নিশ্চিত করা
- [x] desktop ও mobile viewport-এ Print/PDF এবং Close buttons দেখা যাচ্ছে যাচাই করা
- [x] build, converter audit, screenshot ও checkpoint যাচাই করা

# নতুন: Tiro Bangla display typography

- [x] Tiro Bangla font resource লোড করা
- [x] hero heading ও “উদাহরণ দেখুন” professional sample-এ Tiro Bangla প্রয়োগ করা
- [x] editor/input Hind Siliguri এবং বিজয় output SutonnyMJ অপরিবর্তিত রাখা
- [x] desktop/mobile typography, build ও checkpoint যাচাই করা

# নতুন: Tiro Bangla rollback

- [x] Tiro Bangla font import ও display class সরিয়ে আগের typography ফিরিয়ে আনা
- [x] hero heading এবং “উদাহরণ দেখুন” button-এর আগের styling পুনরুদ্ধার করা
- [x] input/output font ও converter behavior অক্ষুণ্ণ রাখা
- [x] desktop/mobile screenshot, build ও checkpoint যাচাই করা

# নতুন: ঋ/ৃ-কার placement fix

- [x] Unicode ঋ/ৃ-কার থেকে Bijoy mapping এবং visible rendering path trace করা
- [x] glyph placement correction প্রয়োগ করা, মূল conversion behavior না ভেঙে
- [x] ঋ-কার, e-kar, যুক্তবর্ণ ও punctuation regression audit চালানো
- [x] desktop/mobile preview, build ও checkpoint যাচাই করা

# নতুন: subtle word-initial e-kar placement audit

- [x] word-initial মাত্রাহীন e-kar ও প্রথম বর্ণের visual/codepoint অবস্থান আলাদা করে reproduce করা
- [x] mid-word ‡ e-kar, যুক্তবর্ণ, ঋ/ৃ-কার ও punctuation-এর baseline/reference সংরক্ষণ করা
- [x] `†ij` code sequence এবং SutonnyMJ probe সঠিক প্রমাণিত হওয়ায় unsafe visual বা mapping correction প্রয়োগ না করা
- [x] correction নিরাপদ না হলে বর্তমান stable version অপরিবর্তিত রাখা এবং তা report করা
- [x] focused audit ও full conversion regression যাচাই করা; responsive code অপরিবর্তিত রাখা

# নতুন: glyph-level e-kar optical comparison

- [x] supplied reference image-এর red-box geometry ও target relationship নথিভুক্ত করা
- [x] একই e-kar specimen SutonnyMJ-তে render করে pixel-level position তুলনা করা
- [x] শুধুমাত্র word-initial marker-এ scoped optical correction পরীক্ষা করা
- [x] mid-word e-kar, ঋ/ৃ-কার, যুক্তবর্ণ, copy ও print preview regression যাচাই করা
- [x] safe result হলে checkpoint করা; safe না হলে বর্তমান stable rendering রাখা

# নতুন: upper toolbar font-size control

- [x] বর্তমান font-size control ও upper converter toolbar-এর markup/spacing audit করা
- [x] − size + control-কে direction toggles-এর মাঝের upper row-এ নেওয়া
- [x] pane header-এ input/output labels ও counts অপরিবর্তিত রাখা
- [x] desktop/mobile toolbar wrapping, build ও checkpoint যাচাই করা

# নতুন: র-ফলা placement audit

- [x] ক্র, গ্র, প্র, ব্র, শ্র ও র-ফলা-সহ যুক্তবর্ণের Unicode/Bijoy codepoint order পরীক্ষা করা
- [x] live rich preview, file preview, print/PDF preview ও copied text-এ র-ফলা placement মিলিয়ে দেখা
- [x] font rendering issue ও conversion-sequence issue আলাদা করে নির্ণয় করা
- [x] confirmed issue না থাকায় কোনো unnecessary converter change না করা
- [x] focused r-fola audit, full regression, responsive preview ও checkpoint যাচাই করা

# নতুন: conjunct preview sample corrections

- [x] “ন্ত” sample-কে “ন্ট”, “শ্রীরাম” sample-কে “শ্রাবণ”, এবং “বড়াই” sample-কে “রূঢ়” করা
- [x] বাকি যুক্তবর্ণ preview examples অপরিবর্তিত রাখা
- [x] copy change, build ও checkpoint যাচাই করা

# নতুন: AvroJoy dark mode

- [x] বর্তমান light theme-এর tokens, ThemeProvider এবং header control audit করা
- [x] persistent dark-mode toggle যোগ করা, যাতে reload-এর পর পছন্দটি থাকে
- [x] hero, keyboard background, converter panes, file preview, history এবং footer-এর contrast-safe dark surfaces তৈরি করা
- [x] SutonnyMJ/Bijoy output, Bengali glyph decoration, focus, hover, print/PDF preview এবং mobile layout dark mode-এ যাচাই করা
- [x] TypeScript, production build, desktop/mobile screenshot এবং checkpoint সম্পন্ন করা

# নতুন: কনভার্টেড টেক্সট এক-ক্লিক কপি

- [x] বিজয় আউটপুট প্যানেলে Copy to Clipboard বাটন যোগ করা
- [x] Clipboard API ও fallback copy path, empty-output guard এবং সফল/ব্যর্থ toast যোগ করা
- [x] mouse selection, Ctrl/Cmd+C, dark mode এবং mobile layout অক্ষুণ্ণ রেখে copy flow যাচাই করা
- [x] TypeScript, production build, responsive screenshot এবং checkpoint সম্পন্ন করা

# নতুন: light/dark mode contrast fix

- [x] light ও dark theme token, text-muted এবং component surface contrast audit করা
- [x] header, hero, toolbar, editor, output paper, buttons, cards, history, footer ও toast-এর theme-specific colors ঠিক করা
- [x] theme toggle persistence, focus/hover states এবং mobile readability যাচাই করা
- [x] TypeScript, production build, দুই মোডের desktop/mobile screenshot এবং checkpoint সম্পন্ন করা

# নতুন: reported theme surface corrections
- [x] dark mode-এর বিজয় output surface, direction controls এবং footer logo treatment audit করা
- [x] light mode-এর hero banner, যুক্তবর্ণ preview এবং semidark sections light করা
- [x] দুই থিমে text contrast, borders, active/inactive controls এবং logo edges যাচাই করা
- [x] TypeScript, production build, desktop/mobile theme screenshots এবং checkpoint সম্পন্ন করা
# নতুন: selected direction-button contrast
- [x] active “অভ্র → বিজয়” ও “বিজয় → অভ্র” button-এর text/background contrast audit করা
- [x] light ও dark mode-এ selected, inactive, hover এবং focus state-এর রঙ explicit করা
- [x] desktop/mobile selection readability, build ও checkpoint যাচাই করা

# নতুন: hero control hover interaction
- [x] “লাইভ কনভার্সন সক্রিয়” ও “উদাহরণ দেখুন” control-এর বর্তমান markup ও interaction audit করা
- [x] দুই theme-এ hover, focus-visible, motion এবং reduced-motion state যোগ করা
- [x] desktop/mobile behavior, production build ও checkpoint যাচাই করা

# নতুন: offline-capable PWA
- [x] existing asset loading, fonts, metadata এবং build output-এর offline dependency audit করা
- [x] PWA manifest, install metadata, service worker এবং cache strategy যোগ করা
- [x] SutonnyMJ font ও critical visual assets offline cache-এর জন্য প্রস্তুত করা
- [x] offline/install UX, production build, manifest/service-worker এবং responsive behavior যাচাই করা
- [x] stable PWA checkpoint তৈরি করা এবং offline ব্যবহারের নির্দেশনা লেখা

# নতুন: first-visit install prompt
- [x] first-visit prompt-এর display, dismissal এবং persistence behavior audit করা
- [x] browser install prompt, bookmark fallback এবং Add to Home Screen guidance যোগ করা
- [x] desktop/mobile layout, theme contrast, reduced motion এবং repeat-visit behavior যাচাই করা
- [x] TypeScript, production build, screenshot এবং checkpoint সম্পন্ন করা

# সংশোধন: install prompt bookmark reminder
- [x] banner copy-তে “ভবিষ্যতে ব্যবহারের জন্য বুকমার্ক করে রাখুন।” reminder যোগ করা
- [x] install action, fallback guidance, responsive layout ও build যাচাই করা

# সংশোধন: main banner bookmark reminder
- [x] main hero banner-এ একই bookmark reminder স্পষ্টভাবে যোগ করা
- [x] prompt ও hero banner-এর contrast, wrapping, screenshot এবং build যাচাই করা

# সংশোধন: approved bookmark wording
- [x] main banner ও install prompt-এ “ভবিষ্যতে ব্যবহারের জন্য বুকমার্ক করে রাখুন।” ব্যবহার করা

# নতুন: e-kar optical positioning
- [x] existing e-kar helper ও optical selectors audit করা
- [x] শুধুমাত্র rich preview glyph-এর vertical position সামান্য সংশোধন করা
- [x] word-initial e-kar, mid-word e-kar, ঋ/ৃ-কার, যুক্তবর্ণ ও raw copy sequence regression যাচাই করা
- [x] TypeScript, production build, responsive screenshot এবং checkpoint সম্পন্ন করা

# নতুন: mid-word e-kar spacing
- [x] mid-word e-kar-এর আগে অতিরিক্ত spacing-এর কারণ audit করা
- [x] শুধুমাত্র rich preview-এর mid-word e-kar spacing সামান্য সংশোধন করা
- [x] word-initial e-kar, ঋ/ৃ-কার, যুক্তবর্ণ, raw sequence ও copy behavior regression যাচাই করা
- [x] TypeScript, production build, responsive screenshot এবং checkpoint সম্পন্ন করা
# নতুন: e-kar পরবর্তী gap audit
- [x] এ-কারের পরে দেখা দেওয়া নতুন gap-এর rich preview geometry audit করা
- [x] আগের mid-word e-kar correction নষ্ট না করে সবচেয়ে ছোট safe adjustment পরীক্ষা করা
- [x] word-initial e-kar, ঋ/ৃ-কার, যুক্তবর্ণ, raw sequence ও copy behavior regression যাচাই করা
- [x] TypeScript, production build, responsive screenshot এবং checkpoint বা safe rollback সম্পন্ন করা
# নতুন: আ-কার vertical audit
- [x] আ-কারের rich preview vertical position ও surrounding glyph geometry audit করা
- [x] শুধুমাত্র প্রয়োজন হলে safe scoped আ-কার optical correction পরীক্ষা করা
- [x] word-initial/mid-word e-kar, ঋ/ৃ-কার, যুক্তবর্ণ, raw sequence ও copy behavior regression যাচাই করা
- [x] TypeScript, production build, responsive screenshot এবং checkpoint বা safe rollback সম্পন্ন করা
# নতুন: আ-কার overcorrection rollback
- [x] অতিরিক্ত নিচে নামানো আ-কার correction শনাক্ত করা
- [x] শুধুমাত্র আ-কারের নতুন vertical rule সরিয়ে আগের baseline ফিরিয়ে আনা
- [x] e-kar spacing, ঋ/ৃ-কার, যুক্তবর্ণ, raw sequence ও copy behavior regression যাচাই করা
- [x] TypeScript, production build, responsive screenshot এবং safe restoration checkpoint সম্পন্ন করা
# নতুন: conjunct alignment audit
- [x] প্র, ল্ল, ত্ব-এর conversion code sequence ও rich preview geometry audit করা
- [x] প্রয়োজন হলে শুধুমাত্র সংশ্লিষ্ট conjunct-এর scoped visual correction পরীক্ষা করা
- [x] e-kar, ঋ/ৃ-কার, র-ফলা, অন্যান্য যুক্তবর্ণ, raw sequence ও copy behavior regression যাচাই করা
- [x] TypeScript, production build, responsive screenshot এবং safe checkpoint বা no-change সিদ্ধান্ত সম্পন্ন করা
# নতুন: conjunct CSS ও typography variant audit
- [x] প্র, ল্ল, ত্ব-এর জন্য scoped CSS, letter-spacing, font-size ও line-height variant তৈরি করা
- [x] ক্ষ, জ্ঞ, শ্র এবং অন্যান্য যুক্তবর্ণের rendering-এর সঙ্গে variant তুলনা করা
- [x] কোনো variant যুক্তবর্ণ না ভেঙে এবং e-kar/আ-কার correction অক্ষুণ্ণ রেখে উন্নতি করে কি না যাচাই করা
- [x] full regression, desktop/mobile preview এবং safe checkpoint বা no-change সিদ্ধান্ত সম্পন্ন করা
# নতুন: light hero banner balance
- [x] light-mode hero banner-এর অতিরিক্ত সাদা অংশ ও overlay balance audit করা
- [x] dark mode ও text contrast অক্ষুণ্ণ রেখে restrained light-mode adjustment করা
- [x] desktop/mobile light-dark screenshots ও production build যাচাই করা
- [x] safe checkpoint সম্পন্ন করা
# নতুন: light theme brightness balance
- [x] light-theme canvas ও প্রধান surfaces-এর অতিরিক্ত brightness audit করা
- [x] readable contrast বজায় রেখে main workspace-এর tonal balance কমানো
- [x] light/dark responsive screenshots, build ও conversion regressions যাচাই করা
- [x] safe checkpoint বা আগের stable version preservation সম্পন্ন করা
