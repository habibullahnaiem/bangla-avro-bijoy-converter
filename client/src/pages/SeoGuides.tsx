import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const BRAND_LOGO_SRC = "/images/avrojoy-logo-192w_cf2f754c.webp";
const BASE_URL = "https://avrojoy.vercel.app";

type Guide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  steps: string[];
  notes: string[];
  useCasesHeading?: string;
  useCases?: Array<{ title: string; description: string }>;
  reviewMethod?: {
    title: string;
    intro: string;
    checks: string[];
  };
  faqs: Array<{ question: string; answer: string }>;
};

const GUIDES: Record<string, Guide> = {
  "avro-to-bijoy": {
    slug: "avro-to-bijoy",
    eyebrow: "ইউনিকোড টু বিজয় গাইড",
    title: "ইউনিকোড টু বিজয় কনভার্টার: অভ্র লেখা SutonnyMJ-তে রূপান্তর",
    description:
      "ইউনিকোড টু বিজয় কনভার্টার দিয়ে অভ্র/Unicode বাংলা লেখা SutonnyMJ বিজয় ফরম্যাটে রূপান্তরের ব্যবহারিক গাইড—Word-এ বাংলা ও English font ব্যবহারের নির্দেশনাসহ।",
    lead:
      "ইউনিকোড টু বিজয় বলতে আধুনিক অভ্র/Unicode বাংলা লেখাকে SutonnyMJ-ভিত্তিক বিজয় ফরম্যাটে নেওয়া বোঝায়। থিসিস, বই বা Word document-এ ব্যবহার করার আগে সঠিক direction, output preview এবং বাংলা–English font নির্বাচন জরুরি; অভ্রজয় এই রূপান্তরটি browser-এর ভেতরেই করতে সাহায্য করে।",
    steps: [
      "হোমপেজের Text Converter-এ “অভ্র → বিজয়” নির্বাচন করুন।",
      "আপনার Unicode বাংলা লেখা টাইপ করুন বা পেস্ট করুন; লাইভ রূপান্তর চালু থাকলে ফল সঙ্গে সঙ্গে দেখা যাবে।",
      "আউটপুট একবার দেখে Copy to Clipboard দিয়ে Word-এ পেস্ট করুন।",
      "Word-এ বাংলা বিজয় অংশের font SutonnyMJ এবং ইংরেজি অংশের font Times New Roman রাখুন।",
    ],
    notes: [
      "যুক্তবর্ণ, কারচিহ্ন বা যতিচিহ্ন দেখার জন্য রূপান্তরের পর output preview-তে একবার চোখ বুলিয়ে নিন।",
      "একই document-এ বাংলা ও English থাকলে font family আলাদা রাখা স্বাভাবিক এবং পাঠযোগ্যতায় সহায়ক।",
      "সংবেদনশীল লেখা server-এ পাঠানো হয় না; public version-এ text conversion আপনার browser-এই চলে।",
    ],
    useCases: [
      {
        title: "থিসিস ও গবেষণাপত্র",
        description:
          "Google Docs বা অন্য Unicode editor-এর বাংলা লেখা Word-এ বিজয় policy মেনে প্রস্তুত করার আগে preview দেখে নিন। বাংলা বিজয় অংশে SutonnyMJ এবং English অংশে Times New Roman ব্যবহার করুন।",
      },
      {
        title: "বই, জার্নাল ও DTP handoff",
        description:
          "সম্পাদনা বা প্রকাশনার কাজের জন্য Unicode manuscript বিজয় format-এ দিতে হলে আগে যুক্তবর্ণ, যতিচিহ্ন ও font rendering পরীক্ষা করে তারপর output কপি বা file download করুন।",
      },
      {
        title: "বাংলা–English mixed document",
        description:
          "একই document-এ English নাম, title বা citation থাকলে বাংলা অংশের বিজয় font এবং English অংশের Times New Roman font আলাদা রাখলে Word-এ পড়া ও সম্পাদনা সহজ হয়।",
      },
    ],
    useCasesHeading: "কোন কাজে Unicode টু বিজয় দরকার হয়?",
    reviewMethod: {
      title: "থিসিস বা Word file দেওয়ার আগে অভ্রজয়ের review method",
      intro:
        "এটি কোনো স্বয়ংক্রিয় নিখুঁততার guarantee নয়। গুরুত্বপূর্ণ thesis, বই বা Word document-এ রূপান্তরের পরে নিচের ছোট review-টি করলে font ও rendering-সংক্রান্ত ভুল আগে ধরা সহজ হয়।",
      checks: [
        "উৎস যাচাই করুন: লেখা Unicode/অভ্র হলে “অভ্র → বিজয়” direction-ই নির্বাচন করেছেন কি না দেখুন।",
        "প্রতিনিধি বাংলা অংশ দেখুন: যুক্তবর্ণ, ি/ী/ে/ৈ/ৃ-কার, দাড়ি, quotation mark এবং নাম বা শিরোনামের মতো চোখে পড়ার অংশ preview-তে পরীক্ষা করুন।",
        "মিশ্র ভাষার run দেখুন: English নাম, title, citation বা URL আলাদা করে পড়ুন; Word-এ বাংলা বিজয় অংশে SutonnyMJ এবং English অংশে Times New Roman রাখুন।",
        "Formatting-sensitive অংশ দেখুন: heading, bold/italic emphasis, quotation ও reference-ঘেঁষা অংশগুলো DOCX download করার পর Word-এ দ্রুত proofread করুন।",
        "শেষে output খোলা অবস্থায় একবার দ্রুত পড়ুন: publishing, submission বা print-এর আগে নিজের document requirement অনুযায়ী final proofread করুন।",
      ],
    },
    faqs: [
      {
        question: "ইউনিকোড টু বিজয় বলতে কী বোঝায়?",
        answer:
          "ইউনিকোড টু বিজয় বলতে অভ্র বা অন্য Unicode বাংলা লেখাকে SutonnyMJ-ভিত্তিক বিজয় ফরম্যাটে নেওয়া বোঝায়। এটি সাধারণত Word, প্রকাশনা বা এমন প্রতিষ্ঠানের কাজে লাগে যেখানে বিজয় ফরম্যাট চাওয়া হয়।",
      },
      {
        question: "অভ্র ও Unicode কি একই জিনিস?",
        answer:
          "অভ্র হলো বাংলা লেখার একটি জনপ্রিয় input method; অভ্র দিয়ে লেখা বাংলা সাধারণত Unicode text হিসেবেই থাকে। তাই অভ্র থেকে বিজয় রূপান্তরের কাজটি Unicode থেকে বিজয় রূপান্তরের একই workflow-এ করা যায়।",
      },
      {
        question: "ইউনিকোড টু বিজয় করতে কী লাগবে?",
        answer:
          "আপনার Unicode বাংলা লেখা paste করুন, “অভ্র → বিজয়” direction নির্বাচন করুন এবং output preview দেখে কপি করুন। Word-এ বাংলা বিজয় অংশের জন্য SutonnyMJ ও English অংশের জন্য Times New Roman ব্যবহার করুন।",
      },
      {
        question: "যুক্তাক্ষর, কারচিহ্ন বা যতিচিহ্ন রূপান্তরের পর কীভাবে যাচাই করব?",
        answer:
          "Output preview-তে কয়েকটি representative শব্দ, যেমন যুক্তাক্ষর, ি/ী/ে/ৈ/ৃ-কার, দাড়ি ও quotation mark দেখে নিন। গুরুত্বপূর্ণ document হলে Word-এ পেস্ট করার পরও একটি দ্রুত proofread করা ভালো অভ্যাস।",
      },
      {
        question: "বাংলা–English mixed লেখা কি রূপান্তর করা যায়?",
        answer:
          "হ্যাঁ। বাংলা অংশ বিজয় output হিসেবে নেওয়ার পর Word-এ বাংলা run-এ SutonnyMJ এবং English name, title বা citation-এ Times New Roman রাখুন। এতে দুই ভাষার font ভূমিকা পরিষ্কার থাকে।",
      },
      {
        question: "Bold বা italic করা লেখা নিয়ে কী খেয়াল রাখব?",
        answer:
          "Text conversion-এর পর Word-এ bold বা italic emphasis একবার দেখে নিন, বিশেষ করে বাংলা ও English একই লাইনে থাকলে। ফাইল রূপান্তরের ক্ষেত্রে download করা DOCX খুলে গুরুত্বপূর্ণ heading, quotation ও emphasis proofread করা ভালো।",
      },
      {
        question: "DOCX বা TXT file কীভাবে Unicode থেকে বিজয়ে রূপান্তর করব?",
        answer:
          "হোমপেজের File Converter tab খুলে “অভ্র → বিজয়” direction নির্বাচন করুন, তারপর DOCX বা TXT file দিন। Preview দেখে ফল download করুন এবং Word-এ বাংলা বিজয় run-এর font SutonnyMJ আছে কি না যাচাই করুন।",
      },
      {
        question: "থিসিস বা Word file দেওয়ার আগে অভ্রজয়ের review method কী?",
        answer:
          "প্রথমে direction ঠিক আছে কি না নিশ্চিত করুন। তারপর representative যুক্তবর্ণ, কারচিহ্ন, যতিচিহ্ন, English name/citation ও heading-এর মতো formatting-sensitive অংশ preview-তে দেখুন। DOCX download করলে Word-এ বাংলা অংশ SutonnyMJ এবং English অংশ Times New Roman রেখে একটি final proofread করুন।",
      },
      {
        question: "Word-এ বাংলা অক্ষর হিজিবিজি দেখালে কী করব?",
        answer:
          "সাধারণত বিজয় byte-কে Unicode font-এ দেখানোর কারণে এটি হয়। বাংলা অংশ SutonnyMJ font-এ দিন এবং English অংশে Times New Roman রাখুন।",
      },
      {
        question: "রূপান্তরের পর পুরো লেখা একবারে কপি করা যায়?",
        answer:
          "হ্যাঁ। output-এর Copy to Clipboard control ব্যবহার করুন, অথবা প্রয়োজনীয় অংশ mouse দিয়ে নির্বাচন করে কপি করুন।",
      },
      {
        question: "আমার লেখা কি server-এ পাঠানো বা সংরক্ষণ করা হয়?",
        answer:
          "Public converter-এ text conversion আপনার browser-এই চলে; login বা public cloud document list প্রয়োজন হয় না। তবু যেকোনো সংবেদনশীল document নিয়ে কাজের আগে নিজের প্রতিষ্ঠানের privacy policy-ও বিবেচনা করুন।",
      },
      {
        question: "ভুল direction বেছে নিলে কী হবে?",
        answer:
          "Unicode লেখা বিজয় → অভ্র direction-এ বা বিজয় লেখা অভ্র → বিজয় direction-এ দিলে অর্থবহ ফল নাও আসতে পারে। Input-এর উৎস অনুযায়ী direction বদলান, তারপর preview দেখে আবার রূপান্তর করুন।",
      },
    ],
  },
  "bijoy-to-unicode": {
    slug: "bijoy-to-unicode",
    eyebrow: "বিজয় থেকে ইউনিকোড কনভার্টার গাইড",
    title: "বিজয় থেকে ইউনিকোড কনভার্টার: পুরোনো SutonnyMJ লেখা Unicode বাংলায় রূপান্তর",
    description:
      "বিজয় থেকে ইউনিকোড কনভার্টার দিয়ে পুরোনো SutonnyMJ বিজয় লেখা Unicode বাংলায় নিন—বিজয় টু ইউনিকোড direction, copy/paste, Word ও web ব্যবহারের ব্যবহারিক গাইড।",
    lead:
      "বিজয় থেকে ইউনিকোড বা বিজয় টু ইউনিকোড বলতে পুরোনো SutonnyMJ-ভিত্তিক বাংলা লেখাকে আধুনিক Unicode বাংলায় নেওয়া বোঝায়। অভ্রজয়-এর বিজয় → অভ্র mode-এ সেই text রূপান্তর করে copy করা যায়, যাতে তা আধুনিক editor, website ও app-এ ব্যবহার করা সহজ হয়।",
    steps: [
      "Text Converter-এ “বিজয় → অভ্র” নির্বাচন করুন।",
      "SutonnyMJ-ভিত্তিক বিজয় লেখা input box-এ paste করুন।",
      "Unicode output দেখে প্রয়োজন হলে বানান, spacing বা context যাচাই করুন।",
      "ফলাফল কপি করে আধুনিক Unicode-compatible editor, website বা document-এ ব্যবহার করুন।",
    ],
    notes: [
      "উৎস লেখাটি সত্যিই বিজয়/SutonnyMJ-ভিত্তিক কি না নিশ্চিত করুন; অন্য encoding বা Unicode text-এ এই direction ব্যবহার করবেন না।",
      "পুরোনো document-এর layout আলাদা হতে পারে, তাই প্রকাশের আগে transformed text একবার proofread করা ভালো।",
      "রূপান্তরটি browser-ভিত্তিক; login বা ব্যক্তিগত cloud storage প্রয়োজন হয় না।",
    ],
    useCasesHeading: "কোন কাজে বিজয় থেকে ইউনিকোড দরকার হয়?",
    useCases: [
      {
        title: "পুরোনো SutonnyMJ লেখা উদ্ধার",
        description:
          "আগের বিজয় font-এ লেখা article, note বা manuscript আধুনিক Unicode editor-এ নিতে হলে আগে একটি ছোট অংশে direction ও output যাচাই করুন।",
      },
      {
        title: "ওয়েবসাইট ও সামাজিক মাধ্যমে পুনঃব্যবহার",
        description:
          "Unicode output copy করে website, CMS, Facebook বা অন্য Unicode-compatible platform-এ ব্যবহার করা যায়; প্রকাশের আগে নাম, যতিচিহ্ন ও spacing দ্রুত দেখে নিন।",
      },
      {
        title: "সম্পাদনা ও সংরক্ষণ",
        description:
          "পুরোনো বিজয় লেখা Unicode হলে খোঁজা, সম্পাদনা ও নতুন document-এ ব্যবহার সহজ হয়। রূপান্তরের আগে original copy রেখে final output proofread করুন।",
      },
    ],
    reviewMethod: {
      title: "বিজয় টু ইউনিকোড করার আগে সংক্ষিপ্ত review method",
      intro:
        "এটি কোনো স্বয়ংক্রিয় নিখুঁততার guarantee নয়। পুরোনো বিজয় লেখা নতুন editor বা web-এ নেওয়ার আগে নিচের ছোট review-টি করলে ভুল direction বা context-জনিত সমস্যা আগে ধরা সহজ হয়।",
      checks: [
        "উৎস যাচাই করুন: লেখাটি সত্যিই SutonnyMJ বা অন্য বিজয়-ভিত্তিক text কি না দেখুন; Unicode লেখা হলে এই direction ব্যবহার করবেন না।",
        "সঠিক direction নিন: Text Converter-এ “বিজয় → অভ্র” নির্বাচন করে ছোট একটি representative অংশ আগে paste করুন।",
        "চোখে পড়ার অংশ পরীক্ষা করুন: নাম, যুক্তবর্ণ, কারচিহ্ন, যতিচিহ্ন, quotation mark ও English name/URL দেখে নিন।",
        "Unicode output একটি নতুন Unicode-compatible editor-এ paste করে কয়েকটি line পড়ুন; অর্থহীন অক্ষর বা ভুল spacing থাকলে source ও direction আবার যাচাই করুন।",
        "মূল বিজয় লেখা আলাদা রেখে দিন এবং publish, edit বা archive করার আগে transformed output একবার final proofread করুন।",
      ],
    },
    faqs: [
      {
        question: "বিজয় থেকে ইউনিকোড কনভার্টার কী করে?",
        answer:
          "এটি SutonnyMJ-ভিত্তিক পুরোনো বিজয় text-কে আধুনিক Unicode বাংলায় রূপান্তর করতে সাহায্য করে। Unicode output পরে সাধারণ browser, editor ও social platform-এ ব্যবহার করা যায়।",
      },
      {
        question: "বিজয় টু ইউনিকোড করতে কোন লেখা input দেব?",
        answer:
          "যে লেখা বিজয়/SutonnyMJ font-এ তৈরি হয়েছিল সেটি input box-এ paste করুন এবং “বিজয় → অভ্র” নির্বাচন করুন। Unicode লেখা ভুল করে এই direction-এ দিলে অর্থবহ ফল নাও আসতে পারে।",
      },
      {
        question: "Unicode লেখা ভুল করে বিজয় → অভ্র-তে দিলে কী হবে?",
        answer:
          "সঠিক উৎস-encoding না হলে অর্থবহ ফল নাও আসতে পারে। তখন direction বদলে অভ্র → বিজয় নির্বাচন করুন বা মূল Unicode text ব্যবহার করুন।",
      },
      {
        question: "রূপান্তরিত লেখা কি সরাসরি Facebook বা website-এ ব্যবহার করা যাবে?",
        answer:
          "হ্যাঁ। Unicode output সাধারণত আধুনিক browser, social platform ও Unicode-compatible editor-এ ব্যবহার করা যায়; প্রকাশের আগে text দেখে নেওয়া ভালো।",
      },
      {
        question: "পুরোনো বিজয় DOCX file কীভাবে Unicode করব?",
        answer:
          "হোমপেজের File Converter-এ “বিজয় → অভ্র” direction নির্বাচন করে DOCX file দিন। Preview ও download-এর পরে Word-এ গুরুত্বপূর্ণ paragraph, heading এবং reference অংশ একবার proofread করুন।",
      },
      {
        question: "রূপান্তরের ফল অর্থহীন বা ভাঙা দেখালে কী করব?",
        answer:
          "আগে source লেখাটি সত্যিই বিজয়/SutonnyMJ কি না এবং direction ঠিক আছে কি না যাচাই করুন। একটি ছোট অংশে আবার পরীক্ষা করুন; তারপর Unicode-compatible editor-এ paste করে নাম, যতিচিহ্ন ও spacing দেখুন।",
      },
    ],
  },
  "docx-txt-bijoy-converter": {
    slug: "docx-txt-bijoy-converter",
    eyebrow: "DOCX বিজয় কনভার্টার গাইড",
    title: "DOCX বিজয় কনভার্টার: Word ফাইল Unicode ও বিজয় রূপান্তরের ব্যবহারিক গাইড",
    description:
      "DOCX বিজয় কনভার্টার দিয়ে Word ফাইল ও TXT-কে Unicode/অভ্র এবং বিজয় (SutonnyMJ)-এর মধ্যে রূপান্তর করুন—direction, preview, download ও Word proofread-এর ব্যবহারিক গাইড।",
    lead:
      "DOCX বিজয় কনভার্টার বা Word ফাইল বিজয় কনভার্টার প্রয়োজন হলে অভ্রজয়ের File Converter ব্যবহার করুন। Unicode/অভ্র ও বিজয়/SutonnyMJ—দুই direction-এই DOCX বা TXT file নির্বাচন, preview ও download browser-এর ভেতরেই করা যায়; গুরুত্বপূর্ণ document হলে Word-এ final proofread জরুরি।",
    steps: [
      "হোমপেজে File Converter tab খুলুন এবং প্রয়োজনীয় direction নির্বাচন করুন।",
      ".docx বা .txt file নির্বাচন করুন অথবা dropzone-এ টেনে আনুন।",
      "“ফাইল রূপান্তর করুন” চাপুন; প্রয়োজনে preview দেখে নিন।",
      "ফলাফল download করে Word-এ বাংলা বিজয় অংশ SutonnyMJ font-এ ঠিক আছে কি না যাচাই করুন।",
    ],
    notes: [
      "ফাইল রূপান্তর ও download প্রস্তুতি আপনার বর্তমান browser session-এ সম্পন্ন হয়; public UI-তে কোনো login বা cloud document list নেই।",
      "জটিল Word document-এ মূল formatting ও output আলাদা করে পরীক্ষা করা ভালো অভ্যাস।",
      "পুরোনো বিজয় DOCX Times New Roman হয়ে unreadable হলে হোমপেজের font-repair action কেবল সেই ধরনের file-এর জন্য ব্যবহার করুন।",
    ],
    useCasesHeading: "কোন DOCX/TXT কাজে file conversion দরকার হয়?",
    useCases: [
      {
        title: "থিসিস, রিপোর্ট ও জমা দেওয়ার আগে প্রস্তুতি",
        description:
          "Unicode Word file বিজয় policy অনুযায়ী প্রস্তুত করতে হলে original file আলাদা রেখে সঠিক direction, preview ও download-এর পর Word proofread করুন।",
      },
      {
        title: "Formatting-sensitive Word document",
        description:
          "Heading, bold/italic, quotation, table cell বা reference-ঘেঁষা অংশ থাকলে representative অংশ preview-তে দেখুন এবং downloaded DOCX খুলে গুরুত্বপূর্ণ জায়গা যাচাই করুন।",
      },
      {
        title: "Plain TXT ও ছোট manuscript",
        description:
          "TXT file-এ direction ঠিক করে দ্রুত Unicode বা বিজয় output নিন। প্রকাশ বা সম্পাদনার আগে নাম, যুক্তবর্ণ, যতিচিহ্ন ও spacing দেখে রাখুন।",
      },
    ],
    reviewMethod: {
      title: "DOCX বিজয় কনভার্ট করার আগে file review method",
      intro:
        "এটি কোনো স্বয়ংক্রিয় নিখুঁততার guarantee নয়। থিসিস, রিপোর্ট বা formatting-sensitive Word file রূপান্তরের আগে ও পরে নিচের ছোট review-টি করলে ভুল direction এবং চোখে পড়ার formatting সমস্যা আগে ধরা সহজ হয়।",
      checks: [
        "মূল file-এর একটি আলাদা copy রেখে দিন এবং fileটি Unicode/অভ্র না পুরোনো বিজয়/SutonnyMJ source—তা আগে নিশ্চিত করুন।",
        "File Converter-এ সঠিক direction নির্বাচন করে DOCX বা TXT file দিন; ভুল direction-এ অর্থবহ ফল নাও আসতে পারে।",
        "Preview-তে heading, নাম, যুক্তবর্ণ, কারচিহ্ন, দাড়ি, quotation এবং বাংলা–English mixed অংশের কয়েকটি representative line দেখুন।",
        "Downloaded DOCX Word-এ খুলে bold/italic, table cell, reference ও indentation-ঘেঁষা অংশ দ্রুত proofread করুন; জটিল document-এ সব formatting একবার পরীক্ষা করা ভালো।",
        "প্রয়োজনে বাংলা বিজয় run-এ SutonnyMJ এবং English run-এ Times New Roman আছে কি না যাচাই করে তারপর final file ব্যবহার করুন।",
      ],
    },
    faqs: [
      {
        question: "কোন file format ব্যবহার করা যায়?",
        answer:
          "বর্তমান File Converter-এ DOCX (Word) এবং TXT file নির্বাচন করা যায়। অন্য format আগে উপযুক্তভাবে DOCX বা TXT-তে প্রস্তুত করুন।",
      },
      {
        question: "DOCX বিজয় কনভার্টার কি দুই direction-এ কাজ করে?",
        answer:
          "হ্যাঁ। File Converter-এ প্রয়োজন অনুযায়ী “অভ্র → বিজয়” বা “বিজয় → অভ্র” direction নির্বাচন করুন। File-এর উৎস encoding অনুযায়ী direction ঠিক করা সবচেয়ে গুরুত্বপূর্ণ ধাপ।",
      },
      {
        question: "Bold, italic, table বা reference থাকা DOCX কীভাবে যাচাই করব?",
        answer:
          "রূপান্তরের আগে preview-তে কয়েকটি representative অংশ দেখুন। Download করার পরে Word-এ heading, bold/italic emphasis, quotation, table cell ও reference-ঘেঁষা অংশ দ্রুত proofread করুন; জটিল file-এ original copy রেখে কাজ করা ভালো।",
      },
      {
        question: "Download করা file খোলার পর font আলাদা দেখালে কী করব?",
        answer:
          "বাংলা বিজয় run-এ SutonnyMJ এবং English run-এ Times New Roman আছে কি না দেখুন। প্রয়োজনে output download করার আগে preview-ও দেখে নিতে পারেন।",
      },
      {
        question: "পুরোনো বিজয় DOCX পড়া না গেলে কী করব?",
        answer:
          "পুরোনো বিজয় byte Times New Roman-এর মতো Unicode font-এ দেখালে লেখা unreadable হতে পারে। আগে source ও direction যাচাই করুন; প্রয়োজন হলে হোমপেজের font-repair action কেবল পুরোনো বিজয় DOCX-এর জন্য ব্যবহার করুন, তারপর output proofread করুন।",
      },
    ],
  },
  "sutonnymj-to-nikosh": {
    slug: "sutonnymj-to-nikosh",
    eyebrow: "SutonnyMJ টু Nikosh গাইড",
    title: "SutonnyMJ থেকে Nikosh কনভার্টার: বিজয় লেখা Nikosh Unicode ফন্টে রূপান্তর",
    description:
      "SutonnyMJ to Nikosh converter গাইড—পুরোনো বিজয় (SutonnyMJ) লেখা Unicode-এ রূপান্তর করে সরকারি-মানের Nikosh ফন্টে ব্যবহার করার ব্যবহারিক ধাপ।",
    lead:
      "SutonnyMJ হলো বিজয়-ভিত্তিক (ANSI/legacy) একটি ফন্ট, আর Nikosh হলো Bangladesh Computer Council-এর তৈরি একটি Unicode বাংলা ফন্ট, যা সরকারি চিঠিপত্র ও ফর্মে ব্যাপকভাবে ব্যবহৃত হয়। তাই “SutonnyMJ to Nikosh” রূপান্তর আসলে দুই ধাপের কাজ—প্রথমে SutonnyMJ/বিজয় লেখাকে Unicode-এ আনা, তারপর সেই Unicode লেখায় Nikosh ফন্ট প্রয়োগ করা। অভ্রজয়ের “বিজয় → অভ্র” mode প্রথম ধাপটি ব্রাউজারেই সম্পন্ন করে।",
    steps: [
      "Text Converter বা File Converter-এ “বিজয় → অভ্র” direction নির্বাচন করুন।",
      "আপনার SutonnyMJ-ভিত্তিক বিজয় লেখা (বা .docx/.txt ফাইল) input-এ দিন।",
      "Unicode আউটপুট পেতে রূপান্তর সম্পন্ন করে কপি করুন বা ফাইল download করুন।",
      "Word/Google Docs-এ পেস্ট করার পর বাংলা অংশের font হিসেবে Nikosh নির্বাচন করুন—Nikosh ইনস্টল করা না থাকলে আগে সেটি ডাউনলোড করে নিন।",
    ],
    notes: [
      "Nikosh একটি Unicode ফন্ট বলে আলাদা কোনো byte-level রূপান্তরের দরকার নেই; শুধু সঠিক Unicode টেক্সট পেলেই Nikosh font প্রয়োগ করা যায়।",
      "সরকারি ফর্ম, চিঠিপত্র বা official document-এর জন্য Nikosh নির্দিষ্ট করা থাকলে রূপান্তরের পর heading ও body টেক্সট আলাদাভাবে যাচাই করুন।",
      "কম্পিউটারে Nikosh ফন্ট আগে থেকে ইনস্টল করা না থাকলে Word-এ ফন্ট প্রয়োগ করলেও সঠিকভাবে না-ও দেখাতে পারে।",
    ],
    useCasesHeading: "কোন কাজে SutonnyMJ to Nikosh দরকার হয়?",
    useCases: [
      {
        title: "সরকারি চিঠিপত্র ও ফর্ম",
        description:
          "পুরোনো SutonnyMJ-তে তৈরি draft বা টেমপ্লেট সরকারি নির্দেশনা অনুযায়ী Nikosh ফন্টে দিতে হলে আগে Unicode-এ রূপান্তর করে তারপর Nikosh প্রয়োগ করুন।",
      },
      {
        title: "অফিস ডকুমেন্ট মানোন্নয়ন",
        description:
          "প্রতিষ্ঠানের পুরোনো বিজয়-ভিত্তিক archive আধুনিক ও সরকারি-সঙ্গতিপূর্ণ Nikosh স্টাইলে আনতে batch আকারে DOCX/TXT ফাইল রূপান্তর করা যায়।",
      },
      {
        title: "প্রিন্ট ও ফর্ম্যাল প্রকাশনা",
        description:
          "Nikosh-নির্দিষ্ট ফর্ম্যাটিং প্রয়োজন হলে রূপান্তরের পর heading, নাম ও তারিখের মতো অংশ Word-এ আলাদা করে proofread করে নিন।",
      },
    ],
    reviewMethod: {
      title: "SutonnyMJ থেকে Nikosh-এ নেওয়ার আগে review method",
      intro:
        "এটি কোনো স্বয়ংক্রিয় নিখুঁততার guarantee নয়। সরকারি বা official document-এ ব্যবহারের আগে নিচের ছোট review-টি করলে font ও রূপান্তর-সংক্রান্ত ভুল আগে ধরা সহজ হয়।",
      checks: [
        "উৎস যাচাই করুন: লেখাটি সত্যিই SutonnyMJ/বিজয়-ভিত্তিক কি না নিশ্চিত করুন এবং “বিজয় → অভ্র” direction নির্বাচন করুন।",
        "Unicode আউটপুট দেখুন: যুক্তবর্ণ, কারচিহ্ন ও যতিচিহ্ন ঠিকভাবে এসেছে কি না preview-তে যাচাই করুন।",
        "Nikosh ফন্ট ইনস্টল আছে কি না নিশ্চিত করুন, তারপর Word-এ বাংলা অংশে Nikosh প্রয়োগ করুন।",
        "Heading, নাম, তারিখ ও সংখ্যার মতো চোখে পড়ার অংশ Nikosh-এ ঠিকভাবে রেন্ডার হচ্ছে কি না দেখে নিন।",
        "চূড়ান্ত জমা বা প্রিন্টের আগে সম্পূর্ণ document একবার দ্রুত proofread করুন।",
      ],
    },
    faqs: [
      {
        question: "SutonnyMJ to Nikosh converter বলতে কী বোঝায়?",
        answer:
          "এটি বোঝায় SutonnyMJ/বিজয়-ভিত্তিক পুরোনো লেখাকে প্রথমে Unicode বাংলায় রূপান্তর করা, তারপর সেই Unicode লেখায় Nikosh ফন্ট প্রয়োগ করা। যেহেতু Nikosh একটি Unicode ফন্ট, তাই মূল কাজটি আসলে বিজয় থেকে ইউনিকোড রূপান্তর।",
      },
      {
        question: "SutonnyMJ ও Nikosh-এর মধ্যে পার্থক্য কী?",
        answer:
          "SutonnyMJ হলো বিজয়/ANSI-ভিত্তিক পুরোনো ফন্ট এনকোডিং, যেখানে প্রতিটি key-press নির্দিষ্ট glyph দেখায়। Nikosh হলো আধুনিক Unicode বাংলা ফন্ট, যা সাধারণ Unicode টেক্সটের ওপর কাজ করে এবং সরকারি নথিতে ব্যাপকভাবে ব্যবহৃত হয়।",
      },
      {
        question: "Convert sutonnymj to nikosh করতে অভ্রজয়ে কোন direction ব্যবহার করব?",
        answer:
          "“বিজয় → অভ্র” direction ব্যবহার করুন। এতে SutonnyMJ-ভিত্তিক বিজয় লেখা Unicode-এ রূপান্তরিত হবে, যা পরে Word/Google Docs-এ Nikosh ফন্টে দেখানো যাবে।",
      },
      {
        question: "রূপান্তরের পর Nikosh ফন্ট প্রয়োগ করলেও লেখা ঠিক দেখাচ্ছে না কেন?",
        answer:
          "সাধারণত Nikosh ফন্ট কম্পিউটারে ইনস্টল করা না থাকলে অথবা মূল লেখা সঠিকভাবে Unicode-এ রূপান্তরিত না হলে এমন হতে পারে। আগে output preview-তে Unicode টেক্সট ঠিক আছে কি না যাচাই করুন, তারপর Nikosh ফন্ট ইনস্টল করে আবার চেষ্টা করুন।",
      },
      {
        question: "DOCX ফাইল সরাসরি SutonnyMJ থেকে Nikosh-উপযোগী করা যায়?",
        answer:
          "হ্যাঁ। হোমপেজের File Converter-এ “বিজয় → অভ্র” direction নির্বাচন করে DOCX/TXT ফাইল দিন, ফলাফল download করুন, তারপর Word-এ বাংলা অংশে Nikosh font প্রয়োগ করে গুরুত্বপূর্ণ অংশ proofread করুন।",
      },
    ],
  },
  "bijoy-font-somosha": {
    slug: "bijoy-font-somosha",
    eyebrow: "বিজয় ফন্ট সমস্যার সমাধান",
    title: "বিজয় ফন্ট সমস্যার সমাধান: Word-এ হিজিবিজি বাংলা লেখা ঠিক করার গাইড",
    description:
      "Word-এ বিজয় বাংলা হিজিবিজি দেখালে করণীয়—SutonnyMJ ফন্ট ইনস্টল, সঠিক direction নির্বাচন ও ফন্ট-এনকোডিং মিলিয়ে দেখার ব্যবহারিক সমাধান।",
    lead:
      "Word document খুলে বাংলা লেখা হিজিবিজি বা অদ্ভুত চিহ্ন দেখালে আতঙ্কিত হওয়ার কিছু নেই—প্রায় সব ক্ষেত্রেই কারণ ফন্ট আর এনকোডিং-এর অমিল। বিজয় (SutonnyMJ) লেখা Unicode ফন্টে বা Unicode লেখা SutonnyMJ ফন্টে দেখালেই এমন হয়। নিচের ধাপগুলো অনুসরণ করলে বেশিরভাগ সমস্যা কয়েক মিনিটে সমাধান হয়।",
    steps: [
      "প্রথমে লেখাটা কোন এনকোডিং-এর তা চিহ্নিত করুন: SutonnyMJ ফন্টে লেখা দেখতে চাইলে সেটি বিজয়, আর Vrinda/Nikosh/Hind Siliguri-তে ঠিক দেখালে সেটি Unicode।",
      "বিজয় লেখা হলে Word-এ সেই অংশ সিলেক্ট করে font SutonnyMJ দিন; Unicode লেখা হলে Nikosh বা অন্য Unicode বাংলা ফন্ট দিন।",
      "SutonnyMJ ইনস্টল করা না থাকলে নির্ভরযোগ্য উৎস থেকে ফন্টটি ডাউনলোড করে ইনস্টল করুন, তারপর Word রিস্টার্ট করুন।",
      "ভুল direction-এ রূপান্তর করা লেখা হলে অভ্রজয়ে সঠিক direction বেছে আবার রূপান্তর করুন—বিজয় লেখার জন্য “অভ্র → বিজয়”, Unicode চাইলে “বিজয় → অভ্র”।",
      "ঠিক করার পর যুক্তবর্ণ, কারচিহ্ন ও দাঁড়ি একবার চোখ বুলিয়ে নিন।",
    ],
    notes: [
      "একই document-এ বাংলা ও English মিশ্র থাকলে দুই অংশের font আলাদা রাখুন—বাংলা অংশে SutonnyMJ (বিজয়) বা Nikosh (Unicode), English অংশে Times New Roman।",
      "অন্যের কম্পিউটারে ফাইল পাঠালে SutonnyMJ-ভিত্তিক Word ফাইল PDF-এ রপ্তানি করে পাঠানো নিরাপদ, নইলে প্রাপকের PC-তে ফন্ট না থাকলে আবার হিজিবিজি দেখাবে।",
      "Google Docs-এ SutonnyMJ সরাসরি ব্যবহার করা যায় না; সেখানে Unicode + Nikosh/Hind Siliguri ব্যবহার করুন।",
      "রূপান্তরের আগে মূল লেখার একটি কপি সংরক্ষণ করুন, যাতে কিছু ভুল হলে ফিরে যাওয়া যায়।",
    ],
    useCases: [
      {
        title: "থিসিস ও অ্যাসাইনমেন্ট",
        description:
          "বিশ্ববিদ্যালয়ের বিজয়-ফরম্যাটের থিসিস টেমপ্লেটে Unicode লেখা পেস্ট করলে হিজিবিজি দেখায়। সঠিক direction-এ রূপান্তর করে SutonnyMJ ফন্টে নিন।",
      },
      {
        title: "অফিসের পুরোনো ফাইল",
        description:
          "পুরোনো SutonnyMJ-এর Word ফাইল নতুন PC-তে খুলে হিজিবিজি দেখালে ফন্ট ইনস্টল করুন অথবা Unicode-এ রূপান্তর করে Nikosh-এ নিন।",
      },
      {
        title: "প্রেস ও DTP",
        description:
          "ছাপাখানায় বিজয় ফরম্যাট চাইলে Unicode manuscript আগে “অভ্র → বিজয়” direction-এ রূপান্তর করে SutonnyMJ-এ প্রুফ দেখে পাঠান।",
      },
    ],
    useCasesHeading: "কোন পরিস্থিতিতে এই সমস্যা হয়?",
    faqs: [
      {
        question: "Word-এ বাংলা হিজিবিজি দেখানোর মূল কারণ কী?",
        answer:
          "সবচেয়ে সাধারণ কারণ ফন্ট-এনকোডিং অমিল: বিজয় (SutonnyMJ) byte-কে Unicode ফন্টে দেখানো, অথবা উল্টোটা। লেখার এনকোডিং অনুযায়ী সঠিক ফন্ট (বিজয়ের জন্য SutonnyMJ, Unicode-এর জন্য Nikosh) প্রয়োগ করলেই ঠিক হয়ে যায়।",
      },
      {
        question: "SutonnyMJ ফন্ট কোথায় পাব?",
        answer:
          "SutonnyMJ একটি বহুল ব্যবহৃত বিজয় ফন্ট; নির্ভরযোগ্য বাংলা ফন্ট আর্কাইভ বা পরিচিত উৎস থেকে ডাউনলোড করে ইনস্টল করুন। ইনস্টলের পর Word বা সংশ্লিষ্ট অ্যাপ রিস্টার্ট করতে হতে পারে।",
      },
      {
        question: "একই ডকুমেন্টে কিছু লেখা ঠিক, কিছু হিজিবিজি—কেন?",
        answer:
          "ডকুমেন্টের বিভিন্ন অংশে ভিন্ন এনকোডিং বা ভিন্ন ফন্ট প্রয়োগ করা থাকলে এমন হয়। হিজিবিজি অংশ সিলেক্ট করে সঠিক ফন্ট দিন; প্রয়োজনে অংশভেদে আলাদা direction-এ রূপান্তর করুন।",
      },
      {
        question: "PDF-এ রপ্তানি করলে কি সমস্যা মিটবে?",
        answer:
          "হ্যাঁ, অনেক ক্ষেত্রে। Word থেকে PDF বানালে ফন্ট ডকুমেন্টের ভেতরে এমবেড হয়ে যায়, ফলে প্রাপকের PC-তে ফন্ট না থাকলেও লেখা ঠিক দেখায়। জমা বা পাঠানোর আগে PDF যাচাই করে নিন।",
      },
      {
        question: "মোবাইলে বিজয় লেখা ঠিকভাবে দেখা যায় না কেন?",
        answer:
          "বেশিরভাগ মোবাইল অ্যাপে SutonnyMJ ফন্ট ইনস্টল করা থাকে না। মোবাইলে পড়ার জন্য লেখা Unicode-এ রূপান্তর করে Nikosh বা সিস্টেমের বাংলা ফন্টে দেখুন।",
      },
      {
        question: "ভুল direction-এ রূপান্তর করে ফেললে কী করব?",
        answer:
          "মূল লেখা থেকে আবার সঠিক direction-এ রূপান্তর করুন। ভুল direction-এর আউটপুটকে আবার রূপান্তর করলে অর্থবহ ফল নাও আসতে পারে, তাই সবসময় মূল input থেকে শুরু করুন।",
      },
      {
        question: "SutonnyMJ-এর বদলে Nikosh ব্যবহার করা কি ভালো?",
        answer:
          "নির্ভর করে প্রয়োজনের ওপর। যেখানে বিজয় ফরম্যাট বাধ্যতামূলক (অনেক থিসিস টেমপ্লেট, প্রেস), সেখানে SutonnyMJ; আর Google Docs, ওয়েব বা সরকারি ফরম্যাটে Unicode + Nikosh আধুনিক ও সুবিধাজনক।",
      },
      {
        question: "অভ্রজয় কি এই সমস্যা সমাধানে সাহায্য করে?",
        answer:
          "হ্যাঁ। এনকোডিং চিহ্নিত করে সঠিক direction-এ (“অভ্র → বিজয়” বা “বিজয় → অভ্র”) রূপান্তর করলে ফন্ট-এনকোডিং অমিলের বড় অংশ মিটে যায়। রূপান্তরের পর Word-এ সঠিক ফন্ট প্রয়োগ করতে ভুলবেন না।",
      },
    ],
  },
  "unicode-vs-bijoy": {
    slug: "unicode-vs-bijoy",
    eyebrow: "ইউনিকোড বনাম বিজয়",
    title: "ইউনিকোড বনাম বিজয়: পার্থক্য ও কখন কোনটা ব্যবহার করবেন",
    description:
      "বাংলা লেখায় Unicode ও Bijoy (SutonnyMJ) এনকোডিং-এর পার্থক্য, সুবিধা-অসুবিধা এবং থিসিস, অফিস, ওয়েব ও প্রেসের কাজে কখন কোনটা বেছে নেবেন তার স্পষ্ট গাইড।",
    lead:
      "বাংলা লেখার জগতে দুটি প্রধান এনকোডিং ব্যবস্থা—Unicode (অভ্রসহ আধুনিক সব input-এর ভিত্তি) ও Bijoy (SutonnyMJ-ভিত্তিক legacy ব্যবস্থা)। দুটো দেখতে একই বাংলা হলেও ভেতরে ভিন্নভাবে সংরক্ষিত হয়, তাই ভুল জায়গায় ভুলটা ব্যবহার করলেই হিজিবিজি সমস্যা। এই গাইডে পার্থক্যটা সহজ করে বোঝানো হলো।",
    steps: [
      "আপনার কাজের ধরন চিহ্নিত করুন: ওয়েব, Google Docs, মোবাইল বা সরকারি ফরম্যাট হলে Unicode; থিসিস টেমপ্লেট, প্রেস বা প্রতিষ্ঠানের বিজয়-নীতি থাকলে Bijoy।",
      "Unicode লেখার জন্য অভ্র বা অন্য Unicode input ব্যবহার করুন এবং Nikosh/Hind Siliguri-এর মতো Unicode ফন্ট দিন।",
      "Bijoy লেখার জন্য SutonnyMJ ফন্ট ব্যবহার করুন এবং প্রয়োজনে Unicode লেখা “অভ্র → বিজয়” direction-এ রূপান্তর করুন।",
      "এক ফরম্যাট থেকে অন্য ফরম্যাটে নিতে হলে অভ্রজয়ের সঠিক direction বেছে রূপান্তর করুন ও output preview যাচাই করুন।",
      "চূড়ান্ত ফাইলে বাংলা অংশের ফন্ট ও English অংশের ফন্ট (Times New Roman) আলাদা রেখে একবার প্রুফ পড়ুন।",
    ],
    notes: [
      "Unicode ভবিষ্যত-নিরাপদ: সব আধুনিক ডিভাইস, ব্রাউজার ও সার্চ ইঞ্জিনে সরাসরি কাজ করে।",
      "Bijoy এখনো বহু থিসিস টেমপ্লেট, পত্রিকা ও DTP workflow-তে বাধ্যতামূলক—সেখানে নিয়ম মেনে চলুন।",
      "দুই এনকোডিং মেশানো ডকুমেন্টে প্রতিটি অংশে সঠিক ফন্ট না দিলে হিজিবিজি দেখায়।",
      "দীর্ঘমেয়াদি সংরক্ষণের জন্য (আর্কাইভ, প্রকাশনা) Unicode-ই নিরাপদ পছন্দ।",
    ],
    useCases: [
      {
        title: "থিসিস ও গবেষণা",
        description:
          "বিশ্ববিদ্যালয়ের টেমপ্লেট বিজয় চাইলে SutonnyMJ-তে জমা দিন; Google Docs-এ লেখা Unicode খসড়া “অভ্র → বিজয়”-এ রূপান্তর করে নিন।",
      },
      {
        title: "ওয়েবসাইট ও সোশ্যাল মিডিয়া",
        description:
          "ওয়েব, Facebook, YouTube-এ সবসময় Unicode ব্যবহার করুন—Bijoy byte ওয়েবে অর্থহীন চিহ্ন হিসেবে দেখায়।",
      },
      {
        title: "সরকারি ও অফিসিয়াল কাজ",
        description:
          "সরকারি চিঠিপত্রে Unicode + Nikosh ফন্টের ব্যবহার বাড়ছে; পুরোনো বিজয় ফাইল থাকলে “বিজয় → অভ্র”-এ রূপান্তর করে নিন।",
      },
    ],
    useCasesHeading: "বাস্তবে কখন কোনটা লাগে?",
    faqs: [
      {
        question: "Unicode আর Bijoy-এর মূল পার্থক্য কী?",
        answer:
          "Unicode একটি আন্তর্জাতিক মানের এনকোডিং যেখানে প্রতিটি বাংলা অক্ষরের নির্দিষ্ট কোড আছে—সব ডিভাইসে একইভাবে দেখায়। Bijoy (SutonnyMJ) একটি legacy ব্যবস্থা যেখানে key-press সরাসরি glyph-এর সাথে বাঁধা; শুধু SutonnyMJ-জাতীয় ফন্ট থাকলেই ঠিক দেখায়।",
      },
      {
        question: "অভ্র দিয়ে লেখা কি Unicode?",
        answer:
          "হ্যাঁ। অভ্র একটি input method; অভ্র দিয়ে টাইপ করা বাংলা সাধারণত Unicode text হিসেবেই সংরক্ষিত হয়। তাই অভ্র-লেখা “অভ্র → বিজয়” direction-এ Bijoy-তে নেওয়া যায়।",
      },
      {
        question: "Bijoy কি এখনো ব্যবহার করা উচিত?",
        answer:
          "যেখানে বাধ্যতামূলক (থিসিস টেমপ্লেট, প্রেস, প্রতিষ্ঠানের নীতি), সেখানে হ্যাঁ। নতুন কাজ, ওয়েব ও দীর্ঘমেয়াদি সংরক্ষণে Unicode-ই ভালো।",
      },
      {
        question: "Unicode লেখা Bijoy-তে নিলে কি তথ্য হারায়?",
        answer:
          "সঠিক direction-এ রূপান্তর করলে সাধারণত না। তবে যুক্তবর্ণ, কারচিহ্ন ও formatting-সংবেদনশীল অংশ output preview-তে যাচাই করা ভালো অভ্যাস।",
      },
      {
        question: "Google Docs-এ Bijoy লেখা যায়?",
        answer:
          "সরাসরি নয়—Google Docs SutonnyMJ সমর্থন করে না। Docs-এ Unicode + Nikosh/Hind Siliguri-তে লিখুন; Word-এ নেওয়ার সময় প্রয়োজনে Bijoy-তে রূপান্তর করুন।",
      },
      {
        question: "মোবাইলে কোনটা ভালো?",
        answer:
          "Unicode। সব স্মার্টফোনের সিস্টেমে বাংলা Unicode সমর্থন built-in; Bijoy দেখতে আলাদা ফন্ট/অ্যাপ লাগে।",
      },
      {
        question: "পুরোনো Bijoy ফাইল Unicode-এ নেওয়া যায়?",
        answer:
          "হ্যাঁ। অভ্রজয়ে “বিজয় → অভ্র” direction-এ text বা DOCX/TXT ফাইল রূপান্তর করুন, তারপর Word-এ Nikosh ফন্ট দিন।",
      },
      {
        question: "সার্চ ইঞ্জিন কোনটা বোঝে?",
        answer:
          "Unicode। Google-সহ সব সার্চ ইঞ্জিন Unicode বাংলা index করে; Bijoy byte সার্চে অর্থবহ ফল দেয় না। ওয়েব কনটেন্টে তাই Unicode বাধ্যতামূলক।",
      },
    ],
  },
  "avro-bangla-typing": {
    slug: "avro-bangla-typing",
    eyebrow: "অভ্র বাংলা টাইপিং গাইড",
    title: "অভ্র দিয়ে বাংলা টাইপিং শেখা: নতুনদের সম্পূর্ণ গাইড",
    description:
      "অভ্র কিবোর্ড দিয়ে বাংলা টাইপিং শেখার ধাপে ধাপে গাইড—ইনস্টল, ফনেটিক নিয়ম, যুক্তবর্ণ ও কারচিহ্ন টাইপিং এবং দ্রুত হওয়ার অনুশীলন পদ্ধতি।",
    lead:
      "অভ্র বাংলাদেশের সবচেয়ে জনপ্রিয় বাংলা input method—ইংরেজি অক্ষরে বাংলা উচ্চারণ লিখলেই বাংলা হয়ে যায় (ফনেটিক পদ্ধতি)। নতুনদের জন্য শুরুটা সহজ, তবে যুক্তবর্ণ ও কারচিহ্নে একটু অনুশীলন লাগে। এই গাইডে ইনস্টল থেকে দ্রুত টাইপিং পর্যন্ত পুরো পথ দেখানো হলো।",
    steps: [
      "অভ্র কিবোর্ড ডাউনলোড করে ইনস্টল করুন এবং বাংলা (Avro Phonetic) লেআউট সক্রিয় করুন।",
      "ফনেটিক নিয়মে টাইপ শুরু করুন: “ami” লিখলে আমি, “bangla” লিখলে বাংলা হয়।",
      "যুক্তবর্ণ শিখুন: “kkh” = ক্ষ-জাতীয় যুক্ত রূপ, “ntr” = ন্ত্র—অভ্রর built-in নিয়মে স্বয়ংক্রিয়ভাবে যুক্ত হয়।",
      "কারচিহ্ন অনুশীলন করুন: “ি” এর জন্য “i”, “ো” এর জন্য “O”—ছোট-বড় হাতের পার্থক্য খেয়াল রাখুন।",
      "প্রতিদিন ১৫ মিনিট অনুশীলন করুন; প্রথমে নির্ভুলতা, তারপর গতি বাড়ান।",
    ],
    notes: [
      "ফনেটিক টাইপিং-এ বানান ভুল হলে বাংলা বানানও ভুল হবে—শুদ্ধ উচ্চারণে লিখুন।",
      "যুক্তবর্ণ না মিললে অভ্রর ক্যারেক্টার ম্যাপ বা হেল্প থেকে সঠিক key-combination দেখে নিন।",
      "মোবাইলে Ridmik/Gboard-এর বাংলা ফনেটিক লেআউটেও একই নিয়ম কাজ করে।",
      "টাইপ করা লেখা Unicode হয়—ফলে Word, Google Docs, Facebook সবখানে ব্যবহারযোগ্য।",
    ],
    useCases: [
      {
        title: "শিক্ষার্থী",
        description:
          "অ্যাসাইনমেন্ট, থিসিসের খসড়া বা নোট দ্রুত বাংলায় টাইপ করতে ফনেটিক পদ্ধতি সবচেয়ে সহজ শুরু।",
      },
      {
        title: "অফিস ও ফ্রিল্যান্সিং",
        description:
          "বাংলা ডকুমেন্ট, ডেটা এন্ট্রি বা কনটেন্ট লেখার কাজে দ্রুত ফনেটিক টাইপিং সরাসরি উৎপাদনশীলতা বাড়ায়।",
      },
      {
        title: "সোশ্যাল মিডিয়া",
        description:
          "Facebook, YouTube কমেন্ট বা WhatsApp-এ বাংলা লিখতে মোবাইলের ফনেটিক কিবোর্ডই যথেষ্ট।",
      },
    ],
    useCasesHeading: "কারা এভাবে টাইপ শিখলে লাভবান হবে?",
    faqs: [
      {
        question: "অভ্র কি ফ্রি?",
        answer:
          "হ্যাঁ, অভ্র কিবোর্ড ব্যক্তিগত ও সাধারণ ব্যবহারের জন্য ফ্রি। অফিসিয়াল উৎস থেকে ডাউনলোড করে ইনস্টল করুন।",
      },
      {
        question: "ফনেটিক আর বিজয় লেআউটের পার্থক্য কী?",
        answer:
          "ফনেটিকে ইংরেজি উচ্চারণ লিখে বাংলা পাওয়া যায় (যেমন “kotha” → কথা); বিজয় লেআউটে প্রতিটি key নির্দিষ্ট বাংলা অক্ষরের সাথে বাঁধা, যা মুখস্থ করতে হয়। নতুনদের জন্য ফনেটিক সহজ।",
      },
      {
        question: "যুক্তবর্ণ কীভাবে টাইপ করব?",
        answer:
          "অভ্র ফনেটিকে সংশ্লিষ্ট ব্যঞ্জনগুলো পরপর লিখলেই যুক্তবর্ণ তৈরি হয় (যেমন “sTr” → স্ট্র)। নির্দিষ্ট যুক্তরূপ না মিললে অভ্রর হেল্প/ক্যারেক্টার ম্যাপ দেখুন।",
      },
      {
        question: "টাইপিং স্পিড কীভাবে বাড়াব?",
        answer:
          "প্রতিদিন নিয়মিত ১৫–২০ মিনিট অনুশীলন, প্রথমে নির্ভুলতায় জোর, তারপর গতি। অনলাইন বাংলা টাইপিং টেস্ট দিয়ে অগ্রগতি মাপুন।",
      },
      {
        question: "মোবাইলে অভ্রর মতো টাইপ করা যায়?",
        answer:
          "হ্যাঁ। Ridmik Keyboard বা Gboard-এর বাংলা ফনেটিক (অভ্র-স্টাইল) লেআউটে একই নিয়মে টাইপ করা যায়।",
      },
      {
        question: "অভ্র দিয়ে লেখা কি Word-এ সরাসরি ব্যবহার করা যায়?",
        answer:
          "হ্যাঁ, কারণ এটি Unicode text। Word/Google Docs-এ পেস্ট করে Nikosh/Hind Siliguri-এর মতো Unicode ফন্ট দিন। বিজয় ফরম্যাট দরকার হলে অভ্রজয়ে “অভ্র → বিজয়”-এ রূপান্তর করুন।",
      },
      {
        question: "কারচিহ্নে বারবার ভুল হয়—সমাধান কী?",
        answer:
          "ছোট-বড় হাতের পার্থক্য মনে রাখুন (যেমন “i” বনাম “I”, “o” বনাম “O”)। ভুল হলে সঙ্গে সঙ্গে শুধরে নেওয়ার অভ্যাস গড়ুন; কয়েক দিনের অনুশীলনে আঙুলে বসে যায়।",
      },
      {
        question: "বাংলা টাইপিং শিখতে কতদিন লাগে?",
        answer:
          "নিয়মিত অনুশীলনে ২–৪ সপ্তাহে মোটামুটি সাবলীল হওয়া যায়। যুক্তবর্ণ ও দ্রুততায় দক্ষতা আসতে আরও কিছুদিন লাগতে পারে।",
      },
    ],
  },
};

function setMeta(selector: string, attribute: "name" | "property", value: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = value;
  else {
    const meta = document.createElement("meta");
    meta.setAttribute(attribute, selector.match(/\[.*?=['"](.*?)['"]/)?.[1] ?? "");
    meta.content = value;
    document.head.appendChild(meta);
  }
}

function GuideMetadata({ guide }: { guide: Guide }) {
  useEffect(() => {
    const url = `${BASE_URL}/${guide.slug}`;
    document.title = `${guide.title} | অভ্রজয়`;
    setMeta('meta[name="description"]', "name", guide.description);
    setMeta('meta[property="og:title"]', "property", guide.title);
    setMeta('meta[property="og:description"]', "property", guide.description);
    setMeta('meta[property="og:url"]', "property", url);
    setMeta('meta[name="twitter:title"]', "name", guide.title);
    setMeta('meta[name="twitter:description"]', "name", guide.description);

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;

    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.id = "avrojoy-guide-structured-data";
    structuredData.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": `${url}#article`,
          headline: guide.title,
          description: guide.description,
          inLanguage: "bn-BD",
          mainEntityOfPage: url,
          isPartOf: { "@id": `${BASE_URL}/#website` },
          author: { "@type": "Person", name: "মো. হাবিবুল্লাহ নাঈম" },
          publisher: { "@id": `${BASE_URL}/#organization` },
          about: { "@id": `${BASE_URL}/#webapplication` },
          dateModified: "2026-08-26",
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: guide.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "অভ্রজয়",
              item: `${BASE_URL}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: guide.eyebrow,
              item: url,
            },
          ],
        },
      ],
    });
    document.head.appendChild(structuredData);

    return () => structuredData.remove();
  }, [guide]);

  return null;
}

function GuideHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-primary/20 bg-primary text-primary-foreground shadow-sm">
      <div className="container flex min-h-16 items-center justify-between gap-4 py-2 sm:min-h-18">
        <a href="/" className="group flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/80">
          <span className="flex h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-primary-foreground/95 p-0.5 shadow-sm">
            <img src={BRAND_LOGO_SRC} alt="অভ্রজয়" className="h-full w-full object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold">অভ্রজয় (AvroJoy)</span>
            <span className="block truncate text-xs text-primary-foreground/75">অভ্র ⇄ বিজয় কনভার্টার</span>
          </span>
        </a>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground transition hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
          aria-label={theme === "dark" ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}

export function SeoGuidePage({ slug }: { slug: keyof typeof GUIDES }) {
  const guide = GUIDES[slug];
  const relatedGuides = Object.values(GUIDES).filter((item) => item.slug !== guide.slug);

  return (
    <div className="seo-guide-page min-h-svh bg-background text-foreground">
      <GuideMetadata guide={guide} />
      <GuideHeader />
      <main className="container py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <a href="/" className="font-semibold text-primary hover:underline">অভ্রজয়</a>
          <span className="px-2" aria-hidden="true">/</span>
          <span>{guide.eyebrow}</span>
        </nav>

        <article className="mx-auto max-w-4xl">
          <header className="rounded-3xl border border-primary/20 bg-card p-6 shadow-sm sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{guide.eyebrow}</p>
            <h1 className="mt-3 font-serif text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">{guide.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{guide.lead}</p>
            <a href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              অভ্রজয়ের মূল কনভার্টারে যান
            </a>
          </header>

          <section className="mt-6 rounded-2xl border bg-card/90 p-5 shadow-sm sm:p-7" aria-labelledby="steps-title">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">ধাপে ধাপে</p>
                <h2 id="steps-title" className="text-xl font-extrabold text-foreground">কীভাবে ব্যবহার করবেন</h2>
              </div>
            </div>
            <ol className="mt-5 space-y-4">
              {guide.steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-foreground sm:text-base">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">{index + 1}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-7" aria-labelledby="notes-title">
            <h2 id="notes-title" className="text-xl font-extrabold text-foreground">মনে রাখুন</h2>
            <ul className="mt-4 space-y-3">
              {guide.notes.map((note) => (
                <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-foreground sm:text-base">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>

          {guide.useCases && (
            <section className="mt-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-7" aria-labelledby="use-cases-title">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">কাজের ধরন</p>
                <h2 id="use-cases-title" className="mt-1 text-xl font-extrabold text-foreground">{guide.useCasesHeading ?? "কোন কাজে এই রূপান্তর দরকার হয়?"}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {guide.useCases.map((useCase) => (
                  <section key={useCase.title} className="rounded-xl border bg-muted/30 p-4">
                    <h3 className="font-extrabold text-foreground">{useCase.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{useCase.description}</p>
                  </section>
                ))}
              </div>
            </section>
          )}

          {guide.reviewMethod && (
            <section className="mt-6 rounded-2xl border border-primary/20 bg-card p-5 shadow-sm sm:p-7" aria-labelledby="review-method-title">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">বাস্তব কাজের আগে যাচাই</p>
              <h2 id="review-method-title" className="mt-1 text-xl font-extrabold text-foreground">{guide.reviewMethod.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{guide.reviewMethod.intro}</p>
              <ol className="mt-5 space-y-3">
                {guide.reviewMethod.checks.map((check, index) => (
                  <li key={check} className="flex gap-3 text-sm leading-relaxed text-foreground sm:text-base">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">{index + 1}</span>
                    <span className="pt-0.5">{check}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section className="mt-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-7" aria-labelledby="faq-title">
            <h2 id="faq-title" className="text-xl font-extrabold text-foreground">সাধারণ প্রশ্ন</h2>
            <div className="mt-3 divide-y divide-border">
              {guide.faqs.map((faq) => (
                <details key={faq.question} className="py-4">
                  <summary className="cursor-pointer font-bold text-foreground">{faq.question}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border bg-muted/40 p-5 sm:p-7" aria-labelledby="related-title">
            <h2 id="related-title" className="text-lg font-extrabold text-foreground">সম্পর্কিত ব্যবহারিক গাইড</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relatedGuides.map((item) => (
                <a key={item.slug} href={`/${item.slug}`} className="group rounded-xl border bg-card px-4 py-3 transition hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="block text-sm font-extrabold text-foreground group-hover:text-primary">{item.eyebrow}</span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary">বিস্তারিত পড়ুন <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </section>
        </article>
      </main>
      <footer className="border-t bg-primary py-6 text-primary-foreground">
        <div className="container text-center text-xs text-primary-foreground/80">© ২০২৬ অভ্রজয় (AvroJoy) • অভ্র/ইউনিকোড ⇄ বিজয়</div>
      </footer>
    </div>
  );
}
