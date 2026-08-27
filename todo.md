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

# নতুন: রেফারেন্সের smart single-quote visual normalization

- [x] user screenshot, pure ‘ … ’ byte mapping এবং live SutonnyMJ glyph rendering পরিদর্শন করা
- [x] Ô/Õ reference pair অপরিবর্তিত রেখে rich preview-তে কেবল matched closing Õ-এর optical scale নির্ধারণ করা
- [x] full regression suite, desktop/mobile visual check এবং checkpoint সম্পন্ন করা

# নতুন: Footnote/Endnote smart single-quote size mismatch

- [x] সাধারণ লেখার rich preview ঠিক থাকলেও Footnote/Endnote content-এ অসম opening/closing quote থাকার user regression নথিভুক্ত করা
- [x] Footnote/Endnote XML conversion, run segmentation এবং quote-font/size metadata আলাদা করে পরিদর্শন করা
- [x] কেবল note-body-এর matched Ô … Õ pair-এ non-destructive visual-size correction প্রয়োগ করা
- [x] normal body text, note body, raw bytes, apostrophe এবং native note-reference marker অক্ষুণ্ণ রেখে full regression চালানো
- [ ] Word-compatible DOCX fixture যাচাই, checkpoint এবং ব্যবহারকারীকে জানানো

# নতুন: exact Ô … Õ note-pair still uneven in Word

- [x] ব্যবহারকারীর exact Bijoy pair `ÔPuv‡`i eywS †PvL Av‡QÕ`-এ আগের note font-size metadata fix কার্যকর হয়নি—regression নথিভুক্ত করা
- [ ] exact pair-সহ Endnote/Footnote fixture তৈরি করে Word-compatible XML ও rendering strategy পুনরায় যাচাই করা
- [ ] আগের ineffective size-only approach-এর বদলে কেবল matched note quote pair-এর জন্য নির্ভরযোগ্য correction প্রয়োগ করা
- [ ] exact pair, mixed/apostrophe guard, native note marker এবং সম্পূর্ণ conversion suite পুনরায় যাচাই করা
- [ ] checkpoint করে corrected version দেওয়া

# নতুন: enlarged note closing quote renders as a Bengali glyph

- [x] ব্যবহারকারীর রিপোর্ট নথিভুক্ত করা: enlarged closing `Õ` quote-এর বদলে ‘ষ্ঠ’-জাতীয় Bengali glyph দেখা যাচ্ছে
- [x] 1.5× size escalation এবং তার associated exact-pair expectation নিরাপদ অবস্থায় ফিরিয়ে নেওয়া
- [x] Word-এ `Õ` byte-কে quote glyph হিসেবেই বাধ্য করে এমন safe note-run strategy পরীক্ষা করা
- [x] Footnote/Endnote exact pair, conjunct integrity ও complete conversion regression চালানো
- [ ] checkpoint এবং corrected version দেওয়া

# নতুন: width-only exact Ô … Õ correction also ineffective

- [x] ব্যবহারকারীর পুনঃপরীক্ষার ফল নথিভুক্ত করা: `ÔPuv‡`i eywS †PvL Av‡QÕ`-এ width-only correction কার্যকর হয়নি; ‘ষ্ঠ’/যুক্তবর্ণ অংশ ঠিক আছে
- [ ] ineffective `w:w=135` note-run correction নিরাপদ baseline-এ ফিরিয়ে নেওয়া
- [ ] exact legacy quote pair-এর জন্য Word glyph selection, complex-script metadata ও rendering compatibility পুনঃবিশ্লেষণ করা
- [ ] byte-preserving alternatives যাচাই করে কেবল কার্যকর পদ্ধতি বাস্তবায়ন করা
- [ ] full regression, checkpoint এবং ব্যবহারকারীকে ফল জানানো

# নতুন: supplied `testevsjv.docx` reference-note verification

- [x] ব্যবহারকারীর DOCX পাওয়া এবং focus সীমিত করা: References/Footnote/Endnote-এর quote rendering
- [x] supplied file-এর note XML, note styles, quote-pair run segmentation এবং font metadata পরিদর্শন করা
- [x] main-text পরিবর্তন না করে actual reference-note structure অনুযায়ী scoped correction তৈরি করা
- [x] supplied file conversion, exact note output এবং full regression যাচাই করা
- [ ] checkpoint করে corrected DOCX behavior ব্যবহারকারীকে জানানো

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
# নতুন: editable DOCX formatting stability
- [x] DOCX paragraph, run, style inheritance ও font metadata audit করা
- [x] indentation, font-size ও paragraph editing-এর পর layout stable রাখার output structure তৈরি করা
- [x] Bengali/English dual-size, SutonnyMJ/Times New Roman এবং conversion behavior regression যাচাই করা
- [x] DOCX round-trip test, build, responsive UI check এবং safe checkpoint সম্পন্ন করা
# নতুন: portable DOCX font handling
- [ ] SutonnyMJ font metadata, embedding support ও distribution constraints audit করা
- [ ] নিরাপদ portable-font বা fallback strategy নির্ধারণ ও প্রয়োগ করা
- [ ] font ছাড়া/অন্য computer-এ DOCX খুললে readability ও edit stability যাচাই করা
- [ ] full regression, build এবং safe checkpoint বা clear limitation report সম্পন্ন করা
# নতুন: editable DOCX font sizes
- [x] ১৪pt বাংলা/১২pt English defaults-এর বাইরে ১০, ১৬ ও ১৮pt size edit reproduce করা
- [x] direct `w:sz`/`w:szCs`, paragraph style ও font metadata-এর size interaction audit করা
- [x] alternate sizes-এ Bijoy text readable, editable ও layout-stable রাখার safe fix পরীক্ষা করা
- [x] ১৪/১২ defaults, alternate sizes, indent edit, portability, full regression ও checkpoint যাচাই করা
# নতুন: DOCX font-change corruption after indent
- [x] indent-এর পর selected Bengali run/paragraph-এর font change corruption reproduce করা
- [x] font-table, `rFonts`, theme/fallback ও Bijoy text encoding interaction trace করা
- [x] safe font-change resilience বা clear compatibility guard পরীক্ষা করা
- [x] indent + font change + size edit, full regression ও safe checkpoint যাচাই করা
# নতুন: persistent DOCX font-change failure
- [x] user-reported indent → font-change failure পুনরায় reproduce করা
- [x] warning-এর বাইরে automatic protection, embedded-font বা package-level strategy পরীক্ষা করা
- [x] Word-style mutation, alternate size, package integrity ও full converter regression যাচাই করা
- [x] genuine fix checkpoint করা অথবা last stable DOCX behavior restore করে limitation স্পষ্ট করা

# সক্রিয়: stable baseline-এ indented DOCX ও দাঁড়ির-পাশের glyph
- [ ] normal paragraph না বদলে Word-এর indented paragraph-এর exact font/style inheritance trace করা
- [x] `।`-এর পর দেখা যাওয়া ঋ/ৃ-কার-সদৃশ glyph-এর source text ও Bijoy sequence পুনরুৎপাদন করা
- [x] standalone U+2026 ellipsis run-কে `...`-এ normalize করা এবং DOCX regression যোগ করা

# Exact Word fixture: দাঁড়ির পরে stray U+2026 ellipsis
- [x] ব্যবহারকারীর দেওয়া `...w`‡K| …Iw`‡K...` sequence-কে direct conversion ও DOCX run-splitting fixture হিসেবে যোগ করা
- [x] `|`-এর পরে glyph-টি `†` নয়, Word XML-এ থেকে যাওয়া standalone Unicode ellipsis U+2026 বলে শনাক্ত করা
- [x] exact fixture-এ U+2026 অপসারণ নিশ্চিত করা; অন্য initial e-kar behavior অপরিবর্তিত রাখা

# নতুন hypothesis: footnote/endnote reference-কে indent মনে হওয়া
- [x] ব্যবহারকারীর DOCX-এ `footnotes.xml`, `endnotes.xml`, reference run ও note styles আছে কি না যাচাই করা
- [x] normal Bengali run-এর সঙ্গে footnote/endnote reference ও note-body font metadata তুলনা করা
- [x] endnote reference ও endnote body-র direct SutonnyMJ mapping, superscript style এবং body conversion-এর permanent regression যোগ করা
- [x] রিপোর্ট করা paragraph-এ endnote reference ID 8 আছে নিশ্চিত করা; তাই এটিকে সাধারণ indent paragraph হিসেবে ধরা সঠিক ছিল না

# সক্রিয়: endnote reference isolation
- [x] endnote-reference run ও EndnoteReference style-এ Word override কমানোর নিরাপদ isolation point নির্ণয় করা
- [x] শুধু note reference/body-তে direct SutonnyMJ mapping ও style containment শক্ত করা
- [x] normal paragraph, endnote body, superscript reference এবং font-change fixture-এ regression চালানো

# সক্রিয়: word-adjacent endnote reference scope
- [x] reference anchor-কে paragraph-wide formatting থেকে আলাদা করার বিদ্যমান run structure যাচাই করা
- [x] reference-এ শুধু নিজস্ব superscript run metadata রাখা; adjacent Bengali word-এর run অপরিবর্তিত রাখা
- [x] word + reference + trailing text fixture-এ formatting-scope regression চালানো

# সক্রিয়: marker-preservation regression recovery
- [x] শেষ reference-marker preservation পরিবর্তনটি আগের স্থিতিশীল checkpoint-এ ফিরিয়ে নেওয়া
- [x] সরবরাহকৃত Word-saved DOCX-এ ক্ষতিগ্রস্ত reference ও পার্শ্ববর্তী run পুনরায় যাচাই করা
- [ ] শুধু source-verified আচরণের ভিত্তিতে পরবর্তী scoped fix সিদ্ধান্ত নেওয়া

# সক্রিয়: Word full-run font regression
- [x] ক্ষতিগ্রস্ত Bijoy paragraph-এর direct run ও paragraph-level font metadata সংগ্রহ করা
- [x] একই document-এর স্বাভাবিক paragraph-এর সঙ্গে metadata পার্থক্য তুলনা করা
- [x] text বা endnote structure না বদলে কোনো নিরাপদ metadata correction আছে কি না সিদ্ধান্ত নেওয়া

# সক্রিয়: rollback-এ ফিরে আসা reference split অপসারণ
- [x] restored converter-এর adjacent-word split সরিয়ে কেবল native superscript marker রাখা
- [x] marker, আগের শব্দ ও paragraph text অপরিবর্তিত থাকে এমন DOCX regression চালানো

# সক্রিয়: Word-saved Bijoy font repair
- [x] স্ক্রিনশটে দেখা Word-saved ক্ষতিগ্রস্ত paragraph-এর font slots ও paragraph properties আলাদা করে শনাক্ত করা
- [x] legacy Bijoy byte-run চিনে শুধু তার font mapping SutonnyMJ-তে ফিরিয়ে আনার নিরাপদ rule নির্ধারণ করা
- [x] মূল conversion output না বদলে repair workflow ও regression তৈরি করা
- [x] সরবরাহকৃত Word-saved DOCX-এ repair চালিয়ে text অপরিবর্তিত রেখে SutonnyMJ mapping পুনরুদ্ধার যাচাই করা

# সক্রিয়: inverted quote glyph sizing
- [x] Unicode/Bijoy inverted quote mapping এবং SutonnyMJ glyph sequence যাচাই করা
- [x] preview ও DOCX-এ দুই quotation mark-এর সামঞ্জস্যপূর্ণ glyph/size rule প্রয়োগ করা
- [x] punctuation round-trip ও visual regression চালানো

# সক্রিয়: reference smart single-quote normalization
- [ ] reference-entry `‘ … ’` pair-এর বর্তমান Bijoy glyph mapping নিশ্চিত করা
- [ ] শুধু pair-এর opening/closing mark একই visual-size glyph-এ normalise করা
- [ ] apostrophe, double quote ও সাধারণ punctuation অপরিবর্তিত আছে নিশ্চিত করা

# নতুন: English opening quote appears reversed in DOCX
- [x] user screenshot regression নথিভুক্ত করা: English title-এর opening single quote direction ভুল দেখাচ্ছে
- [x] screenshot crop ও generated DOCX English quote-run bytes/font metadata পরিদর্শন করা
- [x] Bengali Bijoy punctuation না বদলে English quote-only direction correction নির্ধারণ করা
- [x] English quote, Bengali quote, Footnote/Endnote ও full DOCX regression যাচাই করা
- [ ] checkpoint করে সংশোধিত version ব্যবহারকারীকে জানানো

# সক্রিয়: প্রমাণভিত্তিক ঋ-কার mapping
- [x] SutonnyMJ font cmap/advance, বাস্তব contextual byte specimen এবং converter-library data-table তুলনা করা হয়েছে
- [x] একক ব্যঞ্জন, ফলা ও যুক্তবর্ণে library-এর native context-sensitive R-kar byte selection-ই সঠিক baseline; একক global byte form ভুল
- [x] app-level R-kar override ও preview spacing workaround অপসারণ; CSS workaround বা global byte replacement ছাড়া library-native output রাখা হয়েছে
- [x] TXT/DOCX/copy, quote, e-kar, r-fola, Footnote/Endnote এবং R-kar contextual audit পূর্ণ যাচাই; desktop/mobile previewও যাচাই
- [ ] checkpoint ও ব্যবহারকারীকে ফল জানানো

# সক্রিয়: shumanbd.com তুলনামূলক পর্যালোচনা
- [ ] রেফারেন্স সাইটের text conversion flow, supported directions, UX, punctuation ও complex Bangla behavior পর্যবেক্ষণ
- [ ] AvroJoy-এর বর্তমান আচরণের সঙ্গে একই test corpus-এ তুলনা; রূপান্তর ও DOCX behavior আলাদা রাখা
- [ ] সম্ভাব্য উন্নতিকে low-risk / medium-risk / গ্রহণযোগ্য নয়—এই তিন শ্রেণিতে নথিভুক্ত করা
- [ ] কেবল low-risk ও প্রমাণিত উন্নতি regression test-সহ প্রয়োগ; কোনো আচরণ বদলালে পূর্ববর্তী checkpoint রাখা
- [ ] checkpoint ও তুলনামূলক ফল ব্যবহারকারীকে জানানো

## অপরিবর্তনীয় সুরক্ষা-শর্ত

- [ ] তুলনার সময় AvroJoy-এর conversion byte behavior, context-aware ঋ-কার, e-kar, র-ফলা, quotation, DOCX/TXT conversion, SutonnyMJ/Times New Roman font policy, print/PDF, PWA, recent history ও দুই-প্যান workflow অপরিবর্তিত রাখা
- [ ] রেফারেন্স সাইট থেকে conversion table, legacy ellipsis handling, append-on-reverse UX অথবা ফন্ট-অসচেতন আচরণ গ্রহণ না করা
- [ ] কেবল প্রমাণিত low-risk UX signal—যেমন word/paragraph metrics—নিলে UI regression check চালানো

# অনুমোদিত: editor word/paragraph metrics
- [x] input ও output text-এর শব্দ ও অনুচ্ছেদ গণনার সংজ্ঞা ঠিক করা; whitespace-only text-এ শূন্য রাখা
- [x] বিদ্যমান অক্ষর-গণনার পাশে compact metric যোগ করা; mobile-এ শুধু অক্ষর দেখিয়ে header overflow প্রতিরোধ করা
- [x] কোনো conversion handler, byte transform, file pipeline, localStorage history বা font-render function স্পর্শ করা হয়নি
- [x] TypeScript/build/core/DOCX regression এবং desktop/mobile editor screenshot যাচাই সম্পন্ন
- [ ] checkpoint ও ব্যবহারকারীকে ফল জানানো

# সক্রিয়: shumanbd-তুলনায় যুক্তবর্ণ-শুধু উন্নয়ন
- [x] standard corpus এবং word-example-এ byte output সংগ্রহ; ২৬টি representative form reference-এর সঙ্গে হুবহু মিলে গেছে
- [x] AvroJoy/reference byte output, Unicode round-trip এবং SutonnyMJ glyph specimen তুলনা করা হয়েছে
- [x] শুধু পাঁচটি verified ambiguous conjunct byte fix: ক্ষ্ন, ক্ষ্ণ, ণ্ণ, ণ্ন, ত্রূ; কোনো ঋ-কার, e-kar, quote, punctuation বা non-conjunct rule বদলানো হয়নি
- [x] TXT/DOCX, font slots, PWA, history, print/PDF, metrics এবং UI file অপরিবর্তিত রাখা হয়েছে
- [x] যুক্তবর্ণ-focused ও সম্পূর্ণ regression এবং unchanged UI screenshot যাচাই সম্পন্ন

## বিস্তৃত যুক্তবর্ণ-ভেরিয়েশন coverage

- [x] ৩৫ ব্যঞ্জনবর্ণের all-pair/all-triple exploratory matrix এবং library-table-ভিত্তিক ১৫২টি supported conjunct mapping audit তৈরি
- [x] রেফ, র-ফলা, য-ফলা, ব-ফলা, ম-ফলা, ল-ফলা, ক্ষ/জ্ঞ/শ্র/হ্ম, vowel/punctuation/word-context পরীক্ষা করা হয়েছে; isolated formatting fragment আলাদা রাখা হয়েছে
- [x] library-defined complete conjuncts-এর word context ও standalone round-trip শূন্য deviation-এ পাস
- [x] reference raw output কেবল comparison signal; SutonnyMJ glyph specimen এবং AvroJoy round-trip-কে final acceptance standard রাখা হয়েছে
- [x] deterministic candidate, reference এবং ১৫২-ম্যাপ audit artifact যোগ; শুধুই পাঁচটি font-verified mapping পরিবর্তন করা হয়েছে

# সক্রিয়: ShumanBD বনাম AvroJoy পূর্ণ তুলনামূলক রিপোর্ট
- [x] controlled corpus, raw byte comparison, round-trip observation এবং feature inspection একত্র করা হয়েছে
- [x] text conversion, complex conjuncts, R-kar, e-kar, punctuation, mixed text, reverse direction, DOCX/TXT, font policy, printing/PWA ও UX পৃথকভাবে তুলনা করা হয়েছে
- [x] পরীক্ষার সীমা, একই-ফল, AvroJoy-এর সুবিধা, reference-এর সুবিধা এবং গ্রহণযোগ্য নয় এমন আচরণ স্পষ্ট করা হয়েছে
- [x] Markdown report-এ method, table, controlled result, recommendation ও reference links লেখা হয়েছে
- [x] রিপোর্ট যাচাই করে ব্যবহারকারীকে attachment হিসেবে দেওয়ার জন্য প্রস্তুত

# সক্রিয়: ShumanBD বনাম AvroJoy raw code-diff report
- [x] একই input corpus-এর দু-সাইটের raw Bijoy output পুনরুদ্ধার ও token অনুযায়ী align করা
- [x] শুধু ভিন্ন byte/code point, তার context এবং Bijoy→Unicode round-trip ফল আলাদা করা
- [x] identical byte form-কে report থেকে বাদ দিয়ে বাস্তব পার্থক্য মাত্র দেখানো
- [x] সংক্ষিপ্ত Markdown attachment-এ byte table, code points ও সীমা নথিভুক্ত করা

# সক্রিয়: “দারিদ্যের সত্ত্বা” দুই-সাইট পরীক্ষা
- [x] ShumanBD-এ exact Unicode input দিয়ে Bijoy output সংগ্রহ
- [x] AvroJoy-এর raw Bijoy output ও code points সংগ্রহ
- [x] উভয় Bijoy output reverse করে ফল, byte difference এবং রূপান্তর-সমতা জানানো

# সক্রিয়: জটিল শব্দের ShumanBD–AvroJoy byte audit
- [x] যুক্তবর্ণ, রেফ/র-ফলা, ঋ-কার, এ-কার, ড়/ঢ় ও য-ফলাসহ নিয়ন্ত্রিত শব্দ corpus প্রস্তুত
- [x] ShumanBD-এ একই corpus চালিয়ে token-ভিত্তিক raw Bijoy output সংগ্রহ
- [x] AvroJoy output-এর সঙ্গে byte/code-point diff ও reverse ফল মিলানো
- [x] কেবল বাস্তব byte পার্থক্য থাকলে শব্দ, output এবং round-trip ফল জানানো

# সক্রিয়: ছয়টি byte পার্থক্যের প্রযুক্তিগত ব্যাখ্যা
- [x] প্রতিটি difference-এর legacy glyph/form, Unicode→Bijoy mapping এবং inverse mapping evidence সাজানো
- [x] byte alias, context-sensitive mapping ও non-bijective inverse mapping-এর প্রভাব বিশ্লেষণ
- [x] inter-converter copy/paste, SutonnyMJ rendering এবং round-trip ঝুঁকি আলাদা করে ব্যাখ্যা
- [x] বিস্তারিত বাংলা প্রযুক্তিগত রিপোর্ট লিখে ব্যবহারকারীকে দেওয়া

# সক্রিয়: AvroJoy → ShumanBD reverse word-change investigation
- [x] alias-prone যুক্তাক্ষর, কার, রেফ/র-ফলা ও orthographic complex-word corpus বিস্তৃত করা
- [x] AvroJoy Unicode→Bijoy output-কে ShumanBD Bijoy→Unicode পথে চালানো
- [x] বদলে যাওয়া শব্দ, raw bytes, returned Unicode ও কোন mapping-family জড়িত তা যাচাই
- [x] অনুসন্ধানের coverage, নিশ্চিত পরিবর্তন ও সীমাসহ বিস্তারিত রিপোর্ট তৈরি ও দেওয়া

# সক্রিয়: ShumanBD compatibility patch strategy
- [x] `ঙ্ক্ষ` ও `দারিদ্র্য`+e-kar failure-এর সবচেয়ে সীমিত patch boundary নির্ধারণ
- [x] default canonical output, targeted override ও optional compatibility-mode তুলনা
- [x] SutonnyMJ rendering, AvroJoy round-trip ও DOCX/TXT regression safeguards ঠিক করা
- [x] patch recommendation, ঝুঁকি ও অনুমোদন-পূর্ব test plan রিপোর্টে নথিভুক্ত করা

# সক্রিয়: Unicode-কেন্দ্রিক unified conversion standard strategy
- [x] legacy Bijoy alias, font-dependent glyph ও non-bijective reverse mapping-এর স্থায়ী সীমা নথিভুক্ত
- [x] Unicode canonical form, lossless provenance ও multi-profile encoder design মূল্যায়ন
- [x] compatibility migration, shared conformance corpus ও regression governance ঠিক করা
- [x] বাস্তবায়ন-পর্যায়, সীমা ও সুপারিশসহ বাংলা strategy report তৈরি

# সক্রিয়: publish-পূর্ব readiness checklist
- [x] বর্তমান conversion, DOCX/TXT, PWA, UI ও known-compatibility scope inventory
- [x] regression, real-Word, mobile/PWA, offline, accessibility ও privacy smoke-test plan
- [x] must-do, should-do, পরে করা যাবে—এই priority-তে go/no-go checklist
- [x] publish-এর আগে ব্যবহারকারীর জন্য সংক্ষিপ্ত করণীয় রিপোর্ট

# সক্রিয়: executable publish-verification pass
- [x] desktop ও mobile preview-এ UI layout, runtime asset এবং interaction smoke test
- [x] manifest, service worker, cache entry ও offline fallback readiness পরীক্ষা
- [x] copy/selection, keyboard focus ও generated DOCX/TXT artifact smoke test
- [x] যাচাইকৃত ফল, environment limitation ও publish go/no-go recommendation রিপোর্ট

## প্রকাশ blocker: production build PWA registration
- [x] production build-এ `NODE_ENV=development` থেকে বাদ পড়া service-worker registration সংশোধন
- [x] নতুন production bundle-এ active service worker, shell cache ও manifest পুনরায় যাচাই

# সক্রিয়: mobile banner line/text overlap repair
- [x] narrow mobile screenshot ও banner CSS/markup থেকে overlap source শনাক্ত
- [x] শুধু small-screenে decorative line-এর position/stacking এবং heading clearance সংশোধন
- [x] mobile ও desktop screenshotে banner line, title ও CTA overlap regression যাচাই

# সক্রিয়: permanent mobile banner accent-line removal
- [x] নতুন screenshot-এর অবশিষ্ট eyebrow overlap নিশ্চিত করা
- [x] শুধুমাত্র mobile breakpoint-এ `hero-panel::before` accent line লুকানো
- [x] 382px mobile ও desktopে line removal এবং banner layout যাচাই

# সক্রিয়: PWA stale-cache refresh correction
- [x] user screenshot ও current service-worker cache-version থেকে পুরোনো CSS cache উৎস নিশ্চিত
- [x] service-worker cache version bump করে previous shell/runtime cache invalidation
- [x] rebuilt production PWA-তে নতুন cache name, current CSS asset ও mobile banner যাচাই

# সক্রিয়: global hero accent-line removal
- [x] hero `::before` accent rule-ই decorative line-এর একমাত্র source নিশ্চিত
- [x] সব breakpointে hero accent line বন্ধ করা
- [x] 382px mobile ও 1280px desktopে line removal যাচাই

# সক্রিয়: unified mobile dark-surface contrast correction
- [x] instruction, copy/action bar, legend, metadata এবং recent-history surface style source শনাক্ত
- [x] light-mode override-এ dark workbench surface ও readable text/border hierarchy একীভূত করা
- [x] mobile ও desktopে actionable copy, legend এবং recent-history contrast যাচাই

# সক্রিয়: অবশিষ্ট mobile pale surface correction
- [x] recent-history header-এর গণনা badge ও metadata contrast source শনাক্ত
- [x] output input-pane-এর “পেস্ট” control row-কে opaque high-contrast surface দেওয়া
- [x] mobile screenshot, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: recent-history empty-state contrast correction
- [x] empty-state card-এর pale background ও muted-text source শনাক্ত
- [x] mobile-এ empty-state card-কে opaque dark-workbench surface দেওয়া
- [x] mobile screenshot, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: desktop/web pale surface correction
- [x] input/output editor footer, legend badge এবং history empty-state-এর desktop source শনাক্ত
- [x] desktop-এ same dark-workbench surface, button and text contrast প্রয়োগ
- [x] desktop/mobile screenshot, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: desktop history count-badge contrast correction
- [x] recent-history count badge-এর desktop pale surface source শনাক্ত
- [x] count badge-এ opaque dark-teal fill, border ও readable text প্রয়োগ
- [x] desktop/mobile screenshot, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: desktop editor-footer helper-text alignment
- [x] input ও output footer-এর button/helper markup এবং current wrapping audit
- [x] দুই footer-এ helper text-কে button-এর নিচে একই line-এ স্থাপন
- [x] desktop/mobile screenshot, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: About ও support section
- [x] existing footer/main-content hierarchy দেখে About এবং public support section-এর নিরাপদ placement নির্ধারণ
- [x] বিকাশ/নগদ/রকেট ও WhatsApp 01601599355 দিয়ে responsive contact and support cards তৈরি
- [x] desktop/mobile screenshot, phone-link behavior, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: support section light-mode contrast ও payment guidance
- [x] light-mode-এ About/support card ও nested control-এর contrast source শনাক্ত
- [x] light-mode surface tokens-এর সঙ্গে সামঞ্জস্য রেখে theme-aware style প্রয়োগ
- [x] voluntary support-এর জন্য “Send Money” নির্দেশনা স্পষ্ট করা; Payment ব্যবহার না করতে বলা
- [x] light/dark desktop/mobile screenshot, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: support copy cleanup ও number click-to-copy
- [x] চিহ্নিত দুইটি redundant Send Money/Payment instruction অপসারণ
- [x] payment number-এ click-to-copy, fallback এবং success toast যোগ
- [x] desktop/mobile interaction, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: file-converter light-mode contrast correction
- [x] file-converter direction control, upload dropzone, action buttons ও explanatory text-এর light-mode source শনাক্ত
- [x] light-mode surface ও foreground hierarchy বাকি file UI-এর সঙ্গে সামঞ্জস্য করা
- [x] light/dark desktop/mobile screenshot, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: mobile usage-card contrast correction
- [x] “কীভাবে ব্যবহার করবেন” card-এর mobile pale text/surface source শনাক্ত
- [x] mobile-এ readable foreground ও matching light surface প্রয়োগ
- [x] mobile/desktop screenshot, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: automatic footer copyright year
- [x] footer-এর fixed copyright year source শনাক্ত
- [x] current calendar year থেকে automatic year rendering যোগ
- [x] footer screenshot, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: public share-link option
- [x] existing header/footer action pattern দেখে share button-এর placement নির্ধারণ
- [x] native Web Share API এবং link copy fallback with toast যোগ
- [x] mobile/desktop interaction, TypeScript/build ও PWA stylesheet cache refresh যাচাই

# সক্রিয়: published-site SEO ও metadata audit
- [x] title, meta description, canonical, robots, sitemap, Open Graph/Twitter এবং structured-data source audit
- [x] public domain অনুযায়ী indexability, metadata ও crawl-discovery assets উন্নত করা
- [x] metadata, robots/sitemap, TypeScript/build ও production output যাচাই

# সক্রিয়: full-stack database ও File Storage
- [x] conversion history ও uploaded DOCX/TXT-এর persistence/privacy scope নির্ধারণ
- [x] full-stack database, authentication ও managed File Storage capability enable
- [x] private document save/list/delete/re-download flow এবং metadata model implement
- [x] access control, retention messaging, upload/download UX এবং production build যাচাই

# সক্রিয়: full-stack upgrade conflict recovery
- [x] Home page-এর missing `useAuth` import/runtime crash ঠিক করে existing converter interface পুনরুদ্ধার
- [x] upgraded backend entry point, PWA build command এবং existing SEO metadata compatibility যাচাই
- [x] TypeScript 5.9-এর BlobPart typing regression ঠিক করে DOCX download behavior অক্ষুণ্ণ রাখা

# নতুন: ব্র্যান্ড-সামঞ্জস্যপূর্ণ পাবলিক সাবডোমেইন
- [ ] পাবলিক URL-কে `avrojoy.manus.space` করার অনুরোধ যাচাই ও কনফিগার
- [ ] নতুন URL খোলে কি না যাচাই করে ব্যবহারকারীকে জানানো
- [ ] সংশোধিত পছন্দ `avro-joy.manus.space`-এর প্রাপ্যতা যাচাই ও কনফিগার
- [ ] user-এর domain setting edit-blocker-এর কারণ নির্ণয় ও কার্যকর বিকল্প প্রয়োগ
- [ ] AvroJoy-ভিত্তিক সম্ভাব্য `manus.space` সাবডোমেইনের প্রতিনিধিত্বমূলক প্রাপ্যতা যাচাই

# নতুন: public static converter simplification
- [ ] login, private document list ও managed File Storage feature live site থেকে সরানোর scope নিশ্চিত
- [ ] auth/storage-free public converter build ও Vercel deployment compatibility প্রস্তুত

# নতুন: আলাদা Vercel static copy
- [x] বর্তমান full-stack Manus app অক্ষুণ্ণ রেখে পৃথক Vercel-ready static copy তৈরি
- [x] copy থেকে login, tRPC, database ও private storage UI/backend বাদ দেওয়া
- [x] Vercel build/deployment config, static asset references এবং PWA যাচাই
- [x] user-এর অনুমতিতে HN Vercel team-এ `avrojoy-static` public production deployment তৈরি ও live conversion যাচাই

# নতুন: Vercel auto-deploy sync
- [x] static copy-এর জন্য Git-based automatic Vercel deployment path নির্ণয় ও সেটআপ
- [x] target Vercel project/alias যাচাই করে ভবিষ্যৎ update flow নিশ্চিত

# নতুন: Vercel static copy maintenance guide
- [x] Vercel, GitHub, `vercel-static/` source এবং auto-deploy workflow-এর বিস্তারিত বাংলা নির্দেশিকা প্রস্তুত
- [x] safe update, verification, rollback, PWA cache এবং দুই version-এর পার্থক্য ব্যাখ্যা

# নতুন: এক source থেকে Manus ও Vercel update
- [x] root `client/`-কে Manus ও Vercel-এর একমাত্র shared frontend source করা
- [x] Vercel build root থেকে duplicate static client source বাদ দিয়ে root client build config নির্ধারণ
- [x] Manus public UI থেকে login ও private-document storage flow সরিয়ে Vercel-এর সঙ্গে মিলানো
- [x] দুই deployment-এ একই UI, local DOCX/TXT conversion ও PWA verify করা

# নতুন: Google search visibility
- [x] AvroJoy-এর বর্তমান SEO foundation ও indexability পুনর্মূল্যায়ন
- [x] on-page content, technical SEO, Search Console এবং legitimate authority-building-এর অগ্রাধিকার পরিকল্পনা দেওয়া

# সক্রিয়: sustainable Google SEO implementation
- [x] `avrojoy.vercel.app`-কে primary public search domain হিসেবে canonicalize করা এবং shared crawl directives সাজানো
- [x] Vercel-compatible robots.txt, sitemap.xml, canonical metadata ও structured data যোগ করা
- [x] মানুষের কাজে লাগে এমন Bengali Avro/Bijoy, DOCX ও SutonnyMJ guidance/FAQ content যোগ করা
- [x] Manus ও Vercel-এ indexability, metadata, build, mobile UI ও shared auto-deploy যাচাই
- [x] Git-সিঙ্কড Vercel `avrojoy` প্রজেক্টে `avrojoy.vercel.app` primary production domain স্থানান্তর ও live metadata যাচাই
- [x] Google Search Console-এ HTML meta-tag ownership verification এবং `sitemap.xml` submission সফলভাবে সম্পন্ন
- [x] নিয়মিত Search Console review ও people-first authority-building-এর বাস্তবসম্মত checklist নথিভুক্ত

# সক্রিয়: SEO completion audit
- [ ] live homepage-এর crawlability, canonical, robots, sitemap, title/description, social metadata ও structured data পুনরায় audit করা
- [x] live homepage-এর crawlability, canonical, robots, sitemap, title/description, social metadata ও structured data পুনরায় audit করা
- [ ] Google Search Console-এ primary homepage inspect করে indexing request পাঠানো এবং initial baseline নথিভুক্ত করা — inspection সম্পন্ন; Google-side indexing-request submission error দেখিয়েছে, তাই ২৪–৭২ ঘণ্টা পরে retry প্রয়োজন
- [ ] Google-এর সাময়িক indexing-request submission error পুনরায় পরীক্ষা করে homepage request সফলভাবে পাঠানোর চেষ্টা করা — পুনরায় চেষ্টা করে Google Search Console-এর daily quota exceeded নিশ্চিত হয়েছে; Google-এর নির্দেশনা অনুযায়ী আগামীকাল retry প্রয়োজন
- [x] আগামীকাল Google quota reset হওয়ার পর homepage indexing request-এর একবারের নিরাপদ স্বয়ংক্রিয় retry পদ্ধতি নির্ধারণ ও প্রয়োজনে সেটআপ করা — ২৬ আগস্ট ২০২৬, ১০:০০ Asia/Dhaka-তে one-time schedule active

# সক্রিয়: নতুন ব্র্যান্ড ট্যাগলাইন
- [x] Hero brand copy-তে “অভ্রজয় — অভ্র হোক বা বিজয়, ফন্ট বদলে ভয় নয়” tagline প্রয়োগ করা
- [x] চূড়ান্ত wording “অভ্রজয় — অভ্র হোক বা বিজয়, ফন্ট বদলে নেই ভয়” অনুযায়ী hero tagline সংশোধন করা
- [x] Desktop ও mobile-এ tagline-এর wrap, contrast ও hierarchy যাচাই করা
- [x] Build, Vercel auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: support অংশের অবস্থান
- [x] “অভ্রজয় সম্পর্কে” ও “সমর্থন করুন” অংশ footer-এর ঠিক আগে স্থানান্তর করা
- [x] Desktop ও mobile-এ শেষ অংশের spacing, contrast ও responsive flow যাচাই করা
- [x] Build, Vercel auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: অভ্রজয়ের জন্মকথা
- [x] ব্যবহারকারীর দেওয়া জন্মকথা দিয়ে `/avrojoy-er-jonmokotha` public story page তৈরি করা
- [x] “অভ্রজয় সম্পর্কে” অংশে ২–৩ লাইনের teaser ও “অভ্রজয়ের জন্মকথা পড়ুন” CTA যোগ করা
- [x] Footer-এ “আমাদের গল্প” text link যোগ করা
- [x] Story page-এর title, description, canonical, Article structured data ও sitemap entry যোগ করা
- [x] Desktop/mobile validation, tests, Vercel auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: source protection ও ownership
- [x] GitHub repository visibility এবং public source exposure যাচাই করা
- [x] Browser-delivered frontend-এর copy সীমাবদ্ধতা ও বাস্তবসম্মত protection plan নথিভুক্ত করা
- [x] অনুমোদিত হলে repository privacy, ownership notice ও basic anti-copy measures প্রয়োগ করা
- [x] অনুমোদিত footer notice “© মো. হাবিবুল্লাহ নাঈম। সর্বস্বত্ব সংরক্ষিত। অনুমতি ছাড়া এই সাইটের code, design বা content কপি/পুনঃপ্রকাশ নিষিদ্ধ।” প্রকাশ করা
- [x] Verification, checkpoint ও user handoff সম্পন্ন করা

# সক্রিয়: light mode history surface
- [x] “সাম্প্রতিক রূপান্তর” empty/history panel-এর ভুল dark light-mode surface শনাক্ত করা
- [x] Light mode-এ history panel-এর background, icon ও text contrast ঠিক করা
- [x] Dark mode অপরিবর্তিত রেখে responsive validation, tests ও checkpoint সম্পন্ন করা

# সক্রিয়: AdSense application readiness
- [x] বর্তমান public pages, contact তথ্য ও policy gap audit করা
- [x] Bengali Privacy Policy, Terms/Disclaimer ও Contact/Support page যোগ করা
- [x] Footer-এ policy/contact navigation এবং একটি original Bengali help resource যোগ করা
- [x] প্রতিটি নতুন route-এর title, description, canonical, structured data ও sitemap entry যোগ করা
- [x] Compliance routing/metadata test, light/dark responsive validation, production build ও checkpoint সম্পন্ন করা

# সক্রিয়: footer navigation contrast
- [x] Footer navigation link-গুলোর ভুল dark text inheritance শনাক্ত করা
- [x] Teal footer-এ link ও separator-এর readable light contrast ঠিক করা
- [x] Desktop/mobile validation, test, Vercel auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: footer story-link contrast follow-up
- [x] “আমাদের গল্প” link-এর অবশিষ্ট dark utility override শনাক্ত করা
- [x] Story link-সহ footer navigation-এর সব anchor-এ explicit readable light color প্রয়োগ করা
- [x] Live-style validation, test, Vercel auto-deploy ও checkpoint সম্পন্ন করা
- [x] performance/page-experience-এর field এবং lab baseline পরিমাপ করে কেবল প্রমাণভিত্তিক safe improvement নির্ধারণ করা
- [x] user-visible converter behavior না বদলে প্রয়োজনীয় SEO polish ও owner documentation হালনাগাদ করা
- [x] live verification, tests, Vercel auto-deploy এবং checkpoint সম্পন্ন করা

# সক্রিয়: footer visual regression restoration
- [x] শেষ footer contrast পরিবর্তনে হওয়া visual regression-এর কারণ শনাক্ত করা
- [x] Footer-কে পূর্বের স্থিতিশীল design hierarchy-তে ফিরিয়ে কেবল প্রয়োজনীয় readable fix রাখা
- [x] Footer visual, tests, shared auto-deploy ও checkpoint যাচাই করা

# সক্রিয়: dark-theme footer regression
- [ ] Dark theme-এ footer-এর নতুন regression ও responsible cascade শনাক্ত করা
- [ ] Light theme অপরিবর্তিত রেখে dark-theme footer style সীমিতভাবে ঠিক করা
- [ ] Light/dark footer validation, tests, shared auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: root homepage route regression
- [x] Live root URL ও shared route behavior যাচাই করে `/avro-to-bijoy`-এ যাওয়ার কারণ শনাক্ত করা: `/` সরাসরি homepage-এই থাকে; redirect নেই
- [x] Root homepage route/discovery configuration পর্যালোচনা করা: `/avro-to-bijoy` হলো আলাদা SEO guide route, source change প্রয়োজন হয়নি
- [x] Live root route validation সম্পন্ন করা; source change না থাকায় test, auto-deploy বা checkpoint প্রয়োজন হয়নি

# সক্রিয়: brand search-এ homepage priority
- [x] Homepage ও guide route-এর brand title, canonical, structured data এবং internal link signals audit করা
- [x] “অভ্রজয় / AvroJoy” query-তে homepage-কে primary entity হিসেবে শক্তিশালী করা
- [x] SEO regression validation, tests, shared auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: hero feature-copy refinement
- [x] Banner-এর প্রথম পাঠেই Word/DOCX, mixed-text ও formatting-সংক্রান্ত বাস্তব প্রয়োজন ও AvroJoy-এর পার্থক্য স্পষ্ট করা
- [x] Hero description-এ প্রমাণভিত্তিক mixed-text, bold/italic, DOCX/TXT ও font-aware সুবিধা গুছিয়ে লেখা
- [x] Desktop/mobile wrap ও accessible reading flow যাচাই করা
- [x] Shared auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: banner two-way conversion clarity
- [x] Banner-এ অভ্র/ইউনিকোড → বিজয় এবং বিজয় → অভ্র/ইউনিকোড—দুই দিক স্পষ্ট করে যোগ করা
- [x] Desktop/mobile readability ও existing hero hierarchy যাচাই করা
- [x] Shared auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: Unicode-to-Bijoy search visibility
- [x] “ইউনিকোড টু বিজয়” search result, current landing page ও indexability audit করা
- [x] People-first content, title/description ও internal-link signals দিয়ে প্রাসঙ্গিক landing page শক্তিশালী করা
- [x] Unicode-to-Bijoy guide-এর light/dark theme text contrast ও reading experience ঠিক করা
- [x] SEO regression, shared auto-deploy ও crawl-readiness validation সম্পন্ন করা

# সক্রিয়: Bangla.plus ranking comparison
- [x] “ইউনিকোড টু বিজয়” query-তে Bangla.plus ও AvroJoy-এর live search appearance এবং landing-page signals তুলনা করা
- [x] Publicly observable content, technical relevance ও authority/discovery gap প্রমাণভিত্তিকভাবে ব্যাখ্যা করা
- [x] Copying বা keyword stuffing ছাড়া people-first low-risk improvement plan নির্ধারণ করা

# সক্রিয়: organic search discovery growth
- [x] Search Console performance/query এবং index coverage baseline সংগ্রহ করা
- [x] Highest-intent conversion searches, sitemap discovery ও landing-page gap নির্ধারণ করা
- [x] People-first content ও internal discovery improvements প্রয়োগ করা
- [x] Coverage validation, shared auto-deploy ও safe monitoring plan সম্পন্ন করা

# সক্রিয়: multi-competitor conversion SEO study
- [x] “ইউনিকোড টু বিজয়” search result-এর একাধিক visible competitor-এর task relevance, page structure ও public technical signals তুলনা করা
- [x] Competitor থেকে নকল ছাড়া AvroJoy-এর people-first conversion-intent content ও discovery gap নির্ধারণ করা
- [x] Original landing-page/discovery improvement, SEO regression, shared auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: detailed Unicode-to-Bijoy FAQ
- [x] বাস্তব conversion, Word/DOCX, font ও mixed-text প্রশ্ন দিয়ে FAQ coverage audit করা
- [x] Detailed people-first Unicode-to-Bijoy FAQ ও matching FAQ structured data যোগ করা
- [x] FAQ validation-এ দৃশ্যমান guide-page light/dark text-contrast regression ঠিক করা
- [x] FAQ readability, SEO regression, shared auto-deploy ও checkpoint সম্পন্ন করা

# সক্রিয়: Google site-name ও homepage preference
- [x] Google result-এর “Vercel” site-name এবং guide-first appearance-এর source-level signal audit করা
- [x] AvroJoy WebSite/Organization site-name ও root-homepage preference metadata শক্তিশালী করা
- [x] Structured data, canonical, FAQ, regression, shared auto-deploy ও checkpoint যাচাই করা

# সক্রিয়: live Google visibility check
- [x] “ইউনিকোড টু বিজয়” ও “অভ্রজয়” query-তে AvroJoy result, displayed site name এবং target URL যাচাই করা

# সক্রিয়: conversion SEO growth roadmap
- [x] Conversion-intent on-page SEO, site-name selection ও authority-growth-এর current Google guidance audit করা
- [x] AvroJoy-এর priority on-page improvements, site-name wait/validation steps এবং ethical backlink channels নির্ধারণ করা
- [x] বাস্তবসম্মত roadmap, cadence ও spam-risk boundary নথিভুক্ত করা

# সক্রিয়: live Google rank check
- [x] “অভ্রজয়”, “ইউনিকোড টু বিজয়” এবং “অভ্র টু বিজয়” query-তে AvroJoy-এর visible organic position যাচাই করা

# সক্রিয়: sustainable generic-query visibility pass
- [x] Public routes-এর crawler-visible content, canonical/source consistency এবং generic-query relevance audit করা
- [x] Concise primary site identity ও high-intent conversion pathways আরও পরিষ্কার করা
- [x] Original authority asset ও ethical outreach package প্রস্তুত করা
- [x] Regression validation, shared auto-deploy ও Search Console monitoring baseline সম্পন্ন করা
- [x] থিসিস, Word/DOCX ও প্রকাশনা-সংক্রান্ত প্রাসঙ্গিক public resource candidate যাচাই করা; কোনো outreach পাঠানো নয়

# সক্রিয়: live generic-query discovery follow-up
- [x] Search Console ও live Google result-এ current indexed/coverage/discovery signal পুনরায় যাচাই করা
- [x] Verified owner account `avrojoyconverter@gmail.com` দিয়ে Search Console property access পুনরুদ্ধার করা
- [x] কোনো বাস্তব technical discovery blocker পাওয়া যায়নি; current live URL Google fetch ও index করতে পারে নিশ্চিত করা
- [x] Correction প্রয়োজন হয়নি; existing shared production release-এর live verification সম্পন্ন করা
- [x] বাস্তব next-step, recrawl dependency ও authority approval boundary জানানো

# সক্রিয়: generic-query first-page comparator study
- [x] `ইউনিকোড টু বিজয়` ও `অভ্র টু বিজয়` query-র current first-page comparator set নথিভুক্ত করা
- [x] Comparator সাইটগুলোর publicly visible title/content, raw crawlability, structured data, sitemap/internal discovery ও editorial signals তুলনা করা
- [x] AvroJoy-এর public gap ও শুধুই safe, original improvement priority নির্ধারণ করা
- [x] কোনো implementation বা external outreach-এর আগে owner approval boundaryসহ comparative result জানানো

# সক্রিয়: original DOCX/থিসিস review-method guide enhancement
- [x] `/avro-to-bijoy` guide-এ concise, original conversion-review method section যোগ করা
- [x] Prerendered route body ও static regression coverage-এ নতুন section প্রতিফলিত করা
- [x] Root ও Vercel-static type check, test এবং production build চালানো
- [x] Shared publish-এর পরে live guide route verify করা

# সক্রিয়: ethical personalized outreach draft
- [x] একটিমাত্র thesis/Word-audience resource candidate-এর relevance ও public contact path পুনরায় যাচাই করা
- [x] Candidate-specific, non-paid Bengali resource-suggestion draft প্রস্তুত করা
- [ ] User-কে খসড়া দেখিয়ে message পাঠানোর জন্য পৃথক final consent চাওয়া — user-এর নির্দেশে স্থগিত

# সক্রিয়: query-specific search visibility only
- [x] `ইউনিকোড টু বিজয়` ও `অভ্র টু বিজয়` query-তে AvroJoy guide/homepage alignment এবং current Google/Performance evidence পুনরায় যাচাই করা
- [x] First-page intent অনুযায়ী কেবল safe, original on-page enhancement নির্ধারণ করা
- [x] অনুমোদনযোগ্য enhancement বাস্তবায়ন, test, publish ও crawl-visible output যাচাই করা

# সক্রিয়: mobile PageSpeed image-delivery follow-up
- [x] Mobile lab-এর image-delivery ও render-blocking diagnostic থেকে safe concrete change নির্দিষ্ট করা
- [x] Visual identity অপরিবর্তিত রেখে image-delivery improvement বাস্তবায়ন করা
- [x] Root/Vercel-static validation, mobile visual check এবং production PageSpeed re-test সম্পন্ন করা
- [x] Shared publish ও live WebP output verification করা

# সক্রিয়: Bijoy-to-Unicode page-specific gap check
- [x] `বিজয় থেকে ইউনিকোড` ও related query-তে current Google visibility এবং route-level intent alignment যাচাই করা
- [x] Route-এর raw HTML, metadata, structured data ও internal discovery gap নির্ধারণ করা
- [x] Safe, original page-specific improvement publish ও live crawl-visible output যাচাই করা

# সক্রিয়: DOCX/TXT file-conversion page-specific gap check
- [x] DOCX/TXT বিজয় conversion query-তে current Google visibility এবং route-level intent alignment যাচাই করা
- [x] Route-এর raw HTML, metadata, structured data ও file-workflow content gap নির্ধারণ করা
- [x] Safe, original page-specific improvement publish ও live crawl-visible output যাচাই করা

# সক্রিয়: Google visibility and competitor survey
- [x] Search Console-এর current index, sitemap, Performance, Links ও Core Web Vitals evidence সংগ্রহ করা
- [x] Brand এবং priority generic conversion query-তে live Google visible-result snapshot নেওয়া
- [x] Competitor advantage, AvroJoy-এর verified benefit ও first-page gap বিশ্লেষণ করা
- [x] Findings, ranking limitation এবং sustainable next steps-এর Bengali survey report দেওয়া

# সক্রিয়: brand-query homepage position investigation
- [x] `অভ্রজয়` query-তে top result, AvroJoy homepage position ও entity ambiguity যাচাই করা
- [x] Current homepage brand metadata, visible disambiguation copy ও raw HTML entity signal gap নির্ধারণ করা
- [x] Safe brand-signal improvement publish ও live verification করা

# সক্রিয়: targeted brand-ambiguity diagnosis
- [x] `অভ্রজয়` query-র AI/knowledge interpretation, top organic result ও snippet wording তুলনা করা
- [x] AvroJoy homepage entity/title/snippet এবং available public references-এ remaining ambiguity gap নির্ণয় করা
- [x] কেবল justified correction থাকলে validate করা; না থাকলে recrawl-dependent boundary report করা

# সক্রিয়: Search Console brand-query performance check
- [x] Verified property-তে Performance report-এর current availability যাচাই করা
- [x] `অভ্রজয়` query-এর impression, click ও average-position evidence সংগ্রহ করা
- [x] Available data অথবা processing limitation owner-কে জানানো

# সক্রিয়: mobile বিজয় preview-তে English segment rendering
- [x] Screenshot অনুযায়ী mobile preview-তে Bangla-English mixed output পুনরুৎপাদন করা
- [x] বিজয় preview-এর segment markup, mobile CSS ও Latin fallback rendering path নির্ণয় করা
- [x] Converter mapping/DOCX/copy/desktop অক্ষুণ্ণ রেখে scoped preview fix করা
- [x] Mixed output, mobile/desktop, light/dark, copy এবং regression পরীক্ষা করা

# সক্রিয়: mobile SutonnyMJ font-load failure (`আ` → raw `Av`)
- [x] User screenshot অনুযায়ী mobile-এ SutonnyMJ না লোড হয়ে raw Bijoy bytes দেখা যাওয়ার কারণ নির্ণয় করা
- [x] Same-origin ও mobile-safe font delivery নিশ্চিত করা, converter/DOCX/TXT না বদলে
- [x] Mobile output preview-তে SutonnyMJ applied হওয়ার guard যোগ করা
- [x] `আ`, mixed text, desktop/mobile ও copy regression যাচাই করা

# সক্রিয়: metadata ও SEO tag quick audit
- [x] Homepage ও priority guide route-এর current metadata/directive inventory করা
- [x] Canonical, robots, sitemap এবং structured-data consistency যাচাই করা
- [x] Justified missing metadata ও unsafe/redundant tag আলাদা করা
- [x] Evidence-based audit result এবং safe next step জানানো

# সক্রিয়: generic-query discovery-gap recheck
- [x] Priority generic conversion query-তে current organic visibility ও intent map করা
- [x] Indexed URL, technical/content coverage এবং competitor discovery context তুলনা করা
- [x] Ethical highest-impact discovery action এবং measurement timing নির্ধারণ করা
- [x] Owner-কে বাস্তব অবস্থান, কারণ ও next step জানানো

# সক্রিয়: self-contained organic discovery pass
- [x] Crawl-visible public route, internal pathway ও mobile-discovery signals audit করা
- [x] Duplicate-page ছাড়া সবচেয়ে high-impact on-site opportunity নির্ধারণ করা
- [x] Only justified self-contained improvement shared source-এ বাস্তবায়ন করা
- [x] Build, static prerender, mobile/desktop এবং SEO regression যাচাই করা

# সক্রিয়: remaining self-contained discovery audit
- [x] Public route navigation, raw crawl-visible internal links এবং sitemap coverage audit করা
- [x] Only justified remaining internal-discovery improvement নির্ধারণ করা
- [x] Safe improvement build/static output/regression validation-সহ বাস্তবায়ন করা

# সক্রিয়: mobile performance, accessibility/SEO এবং image-alt optimisation
- [x] Production mobile performance, accessibility ও SEO baseline audit করা
- [x] Client source-এ meaningful image alt text, decorative-image treatment ও mobile semantic signal audit করা
- [x] Measured, low-risk loading/accessibility/SEO improvements বাস্তবায়ন করা
- [x] Root/Vercel static build, tests, mobile/desktop visual check ও production recheck করা
