# অবশিষ্ট মোবাইল ফ্যাকাসে সারফেস — যাচাইকৃত নোট

ব্যবহারকারীর ২০২৬-০৮-২৪-এর দুটি cropped screenshot দেখে দুটি নির্দিষ্ট UI surface নিশ্চিত করা হয়েছে।

1. **সাম্প্রতিক রূপান্তর** শিরোনামের পাশে থাকা `6 / 6` capacity/count badge হালকা ধূসর; একই dark-workbench অংশের সাদা শিরোনাম ও muted subtitle-এর তুলনায় এটি ফ্যাকাসে দেখাচ্ছে।
2. ইনপুট editor-এর নিচে থাকা **পেস্ট** control row `bg-muted/50` ধরনের হালকা/স্বচ্ছ background-এ রেন্ডার হচ্ছে। ফলে surrounding opaque dark editor surface-এর সঙ্গে মিলছে না।

পরবর্তী সংশোধন কেবল এই দুই element-এর mobile contrast, border ও readable text state-এ সীমাবদ্ধ থাকবে। কনভার্সন, native selection, copy, DOCX/TXT এবং PWA logic অপরিবর্তিত থাকবে।
