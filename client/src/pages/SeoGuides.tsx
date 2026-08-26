import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const BRAND_LOGO_SRC = "/manus-storage/bangla-converter-exact-reference-logo_2f0bb0ec.png";
const BASE_URL = "https://avrojoy.vercel.app";

type Guide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  steps: string[];
  notes: string[];
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
    eyebrow: "বিজয় থেকে ইউনিকোড গাইড",
    title: "বিজয় থেকে Unicode বাংলা: পুরোনো SutonnyMJ লেখা রূপান্তরের নিয়ম",
    description:
      "SutonnyMJ-ভিত্তিক বিজয় টেক্সট Unicode বা অভ্র বাংলা লেখায় রূপান্তরের বাংলা গাইড, সঠিক input direction ও সম্পাদনার পরামর্শ।",
    lead:
      "পুরোনো বিজয় text আধুনিক Unicode পরিবেশে ব্যবহার করতে চাইলে সঠিক উৎস ও direction জানা জরুরি। অভ্রজয় বিজয় → অভ্র mode-এ সেই text Unicode বাংলায় রূপান্তর করে, যাতে তা আধুনিক app ও web-এ ব্যবহার করা যায়।",
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
    faqs: [
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
    ],
  },
  "docx-txt-bijoy-converter": {
    slug: "docx-txt-bijoy-converter",
    eyebrow: "DOCX ও TXT ফাইল গাইড",
    title: "DOCX ও TXT বিজয় কনভার্টার: Word ফাইল রূপান্তরের ব্যবহারিক নির্দেশনা",
    description:
      "DOCX বা TXT file-কে অভ্র/Unicode ও বিজয় (SutonnyMJ)-এর মধ্যে রূপান্তরের বাংলা নির্দেশনা, download ও font-check workflow।",
    lead:
      "প্রতিদিনের Word document বা plain-text file রূপান্তরের জন্য File Converter ব্যবহার করুন। রূপান্তরের দিক ঠিক করে file নির্বাচন, preview এবং download—সব ধাপ browser-এর ভেতরেই সম্পন্ন হয়।",
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
    faqs: [
      {
        question: "কোন file format ব্যবহার করা যায়?",
        answer:
          "বর্তমান File Converter-এ DOCX (Word) এবং TXT file নির্বাচন করা যায়। অন্য format আগে উপযুক্তভাবে DOCX বা TXT-তে প্রস্তুত করুন।",
      },
      {
        question: "Download করা file খোলার পর font আলাদা দেখালে কী করব?",
        answer:
          "বাংলা বিজয় run-এ SutonnyMJ এবং English run-এ Times New Roman আছে কি না দেখুন। প্রয়োজনে output download করার আগে preview-ও দেখে নিতে পারেন।",
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
              name: "অভ্রজয় (AvroJoy)",
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
              <h2 id="use-cases-title" className="mt-1 text-xl font-extrabold text-foreground">কোন কাজে Unicode টু বিজয় দরকার হয়?</h2>
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
