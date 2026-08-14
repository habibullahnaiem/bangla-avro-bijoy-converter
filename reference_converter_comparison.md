# রেফারেন্স কনভার্টার: দৃশ্যমান আচরণ নোট

পরিদর্শনের তারিখ: ১৪ আগস্ট ২০২৬

## রেফারেন্স সাইট

URL: https://iconverter.ipaedia.org/

দৃশ্যমান UI-তে সাইটটি Word, Excel এবং PowerPoint ফাইল রূপান্তরের কথা বলে। DOCX-সম্পর্কিত দাবির মধ্যে আছে formatting preservation এবং “ফুটনোট, এন্ডনোট ও হেডার-ফুটার সহ” সম্পূর্ণ processing। UI-তে endnote-specific কোনো নিয়ন্ত্রণ বা আলাদা setting দেখা যায়নি।

## এই কাজের জন্য প্রাসঙ্গিক সিদ্ধান্ত

সাইটের দৃশ্যমান promise-এর সঙ্গে সামঞ্জস্য রাখতে AvroJoy-এ endnote marker-কে তার নিজস্ব `<w:r>` run-এ সীমাবদ্ধ রাখা হবে। শুধু ওই run-এ `EndnoteReference` style ও `superscript` থাকবে; আগের শব্দ, পরের text এবং paragraph properties পরিবর্তন করা হবে না।

রেফারেন্স সাইটের public JavaScript bundle-এ DOCX part list-এ `word/endnotes.xml` এবং `word/footnotes.xml` আছে। তার run-conversion routine কেবল `<w:t>` text-node-যুক্ত run-এ conversion/font-normalization চালায় এবং `w:instrText`, `w:fldChar`, `w:delText` বা text-node-বিহীন run বাদ দেয়। Endnote marker-এর run সাধারণত text-node-বিহীন হওয়ায় ওই রুটিন সেটিকে নিজস্ব `EndnoteReference` style ও `superscript` সহ অক্ষুণ্ণ রাখে।

এই পর্যবেক্ষণ থেকে AvroJoy-এ marker run-কে ordinary text-run font assignment থেকে বাদ রাখা এবং marker-এর নিজস্ব style/vertical alignment অক্ষুণ্ণ রাখা reference-সঙ্গত ন্যূনতম rule হিসেবে বিবেচ্য।

## সীমাবদ্ধতা

ব্যবহারকারীর DOCX বা ব্যক্তিগত document কোনো তৃতীয় পক্ষের সাইটে আপলোড করা হয়নি। ফলে রেফারেন্স সাইটের output XML সরাসরি তুলনা করা হয়নি; তার প্রকাশ্য UI ও feature claim-ই কেবল যাচাই করা হয়েছে।
