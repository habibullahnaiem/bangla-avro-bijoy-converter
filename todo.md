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
