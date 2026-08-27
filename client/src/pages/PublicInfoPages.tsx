import { useEffect } from "react";
import { ArrowLeft, CheckCircle2, FileText, MessageCircle, Moon, ShieldCheck, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const BRAND_LOGO_SRC = "/manus-storage/avrojoy-logo-192w_cf2f754c.webp";
const BASE_URL = "https://avrojoy.vercel.app";

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type PublicPage = {
  slug: "privacy" | "terms" | "contact" | "thesis-bijoy-checklist";
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  structuredType: "WebPage" | "Article";
  sections: Section[];
};

const PAGES: Record<PublicPage["slug"], PublicPage> = {
  privacy: {
    slug: "privacy",
    eyebrow: "গোপনীয়তা নীতি",
    title: "অভ্রজয় গোপনীয়তা নীতি",
    description: "AvroJoy কীভাবে browser-ভিত্তিক রূপান্তর, local history, cookies এবং যোগাযোগের তথ্য ব্যবহার করে তার সহজ বাংলা ব্যাখ্যা।",
    lead: "আপনার লেখা ও document-এর গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। অভ্রজয়ের public converter এমনভাবে তৈরি যে সাধারণ text ও file conversion আপনার browser-এর ভেতরেই সম্পন্ন হয়।",
    structuredType: "WebPage",
    sections: [
      {
        title: "কোন তথ্য browser-এ থাকে",
        paragraphs: [
          "Text conversion, DOCX/TXT processing এবং output প্রস্তুতি আপনার বর্তমান browser session-এ চলে। Public converter ব্যবহার করতে account বা cloud document storage প্রয়োজন হয় না।",
          "সাম্প্রতিক রূপান্তরের history সুবিধাটি আপনার নিজের device-এর browser storage-এ থাকে। আপনি চাইলে সাইটের “সব মুছুন” control ব্যবহার করে এটি সরিয়ে দিতে পারেন।",
        ],
      },
      {
        title: "PWA, cache ও browser data",
        paragraphs: [
          "Offline ব্যবহার সহজ করতে browser কিছু app resource cache করে রাখতে পারে। এটি আপনার device-এর browser data-এর অংশ; browser settings থেকে site data clear করলে তা সরানো যায়।",
        ],
      },
      {
        title: "যোগাযোগ ও ভবিষ্যৎ বিজ্ঞাপন",
        paragraphs: [
          "আপনি WhatsApp-এ যোগাযোগ করলে আপনার পাঠানো বার্তা সেই platform-এর নিজস্ব নীতিমালার অধীনে থাকে। বর্তমানে AvroJoy-এ Google AdSense বিজ্ঞাপন চালু নেই। ভবিষ্যতে বিজ্ঞাপন চালু হলে cookie, consent ও বিজ্ঞাপন-সংক্রান্ত disclosure এই নীতিতে হালনাগাদ করা হবে।",
        ],
      },
      {
        title: "আপনার করণীয়",
        bullets: [
          "সংবেদনশীল document ব্যবহারের আগে নিজের device-এর নিরাপত্তা নিশ্চিত করুন।",
          "রূপান্তরের ফল প্রকাশ বা জমা দেওয়ার আগে একবার যাচাই করুন।",
          "গোপনীয়তা নিয়ে প্রশ্ন থাকলে Contact page-এর WhatsApp link ব্যবহার করুন।",
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    eyebrow: "ব্যবহারের শর্ত ও দায়-সীমা",
    title: "অভ্রজয় ব্যবহারের শর্ত ও দায়-সীমা",
    description: "AvroJoy converter ব্যবহারের সাধারণ শর্ত, output যাচাইয়ের দায়িত্ব, content rights এবং service limitation-এর বাংলা ব্যাখ্যা।",
    lead: "অভ্রজয় বাংলা Unicode/অভ্র ও বিজয়/SutonnyMJ workflow সহজ করতে সহায়ক tool। গুরুত্বপূর্ণ document-এ output যাচাইয়ের দায়িত্ব ব্যবহারকারীরই থাকে।",
    structuredType: "WebPage",
    sections: [
      {
        title: "রূপান্তরের ফল যাচাই",
        paragraphs: [
          "এই tool বাংলা document conversion সহজ করতে তৈরি। তবে thesis, প্রকাশনা, আইনগত কাগজ, পরীক্ষার উত্তরপত্র বা অন্য গুরুত্বপূর্ণ নথি জমা/প্রকাশের আগে output, font, যুক্তবর্ণ, কারচিহ্ন, punctuation এবং formatting নিজে যাচাই করবেন।",
          "Font, source document, Microsoft Word version বা editor-এর পার্থক্যে rendering আলাদা হতে পারে। কোনো নির্দিষ্ট প্রতিষ্ঠানের submission rule মেনে চলার দায়িত্ব ব্যবহারকারীর।",
        ],
      },
      {
        title: "গ্রহণযোগ্য ব্যবহার",
        bullets: [
          "নিজের বা ব্যবহারের অনুমতি থাকা লেখা ও file রূপান্তর করুন।",
          "অন্যের copyright, privacy বা আইন ভাঙে এমন content ব্যবহার করবেন না।",
          "সাইটের নিরাপত্তা, availability বা অন্য ব্যবহারকারীর কাজ ব্যাহত করার চেষ্টা করবেন না।",
        ],
      },
      {
        title: "মালিকানা ও পরিবর্তন",
        paragraphs: [
          "AvroJoy-এর code, design ও original content-এর স্বত্ব সংরক্ষিত। অনুমতি ছাড়া তা কপি বা পুনঃপ্রকাশ করা যাবে না। প্রয়োজন, নিরাপত্তা বা compatibility অনুযায়ী service ও এই শর্ত হালনাগাদ হতে পারে।",
        ],
      },
      {
        title: "দায়-সীমা",
        paragraphs: [
          "AvroJoy সহায়ক service হিসেবে দেওয়া হয়। conversion output থেকে হওয়া কোনো ক্ষতি, deadline miss বা third-party formatting issue-এর জন্য site owner দায়ী নন। এটি আইনগত পরামর্শ নয়।",
        ],
      },
    ],
  },
  contact: {
    slug: "contact",
    eyebrow: "যোগাযোগ ও সহায়তা",
    title: "AvroJoy যোগাযোগ ও সহায়তা",
    description: "AvroJoy converter নিয়ে সাহায্য, feedback বা সমস্যা জানানোর জন্য WhatsApp যোগাযোগের তথ্য এবং support guidance।",
    lead: "Converter, DOCX/TXT workflow, font display বা site feedback নিয়ে সাহায্য দরকার হলে নিচের WhatsApp contact ব্যবহার করুন।",
    structuredType: "WebPage",
    sections: [
      {
        title: "কী বিষয়ে যোগাযোগ করবেন",
        bullets: [
          "রূপান্তরের সময় দেখা দেওয়া নির্দিষ্ট text বা document সমস্যা।",
          "SutonnyMJ, Unicode বা Word font display সংক্রান্ত feedback।",
          "সাইটের feature idea, accessibility বা technical suggestion।",
        ],
      },
      {
        title: "যোগাযোগের আগে যা পাঠাবেন",
        paragraphs: [
          "সমস্যাটি বোঝাতে ছোট একটি sample text, কোন direction ব্যবহার করেছেন, কোন app/Word version-এ দেখেছেন এবং সম্ভব হলে screenshot পাঠান। ব্যক্তিগত বা সংবেদনশীল document পুরোটা পাঠানোর প্রয়োজন নেই।",
        ],
      },
      {
        title: "স্বেচ্ছা সহায়তা",
        paragraphs: [
          "আপনি চাইলে সাইটের উন্নয়ন ও রক্ষণাবেক্ষণে স্বেচ্ছা সহায়তা করতে পারেন। এটি কোনো বাধ্যতামূলক payment নয় এবং converter-এর সাধারণ ব্যবহারে কোনো প্রভাব ফেলে না।",
        ],
      },
    ],
  },
  "thesis-bijoy-checklist": {
    slug: "thesis-bijoy-checklist",
    eyebrow: "থিসিস জমার আগে যাচাই",
    title: "থিসিসে অভ্র থেকে বিজয়: জমা দেওয়ার আগে ৭টি ব্যবহারিক যাচাই",
    description: "থিসিস বা গবেষণাপত্র Avro/Unicode থেকে Bijoy SutonnyMJ-তে নেওয়ার আগে font, mixed text, formatting ও PDF preview যাচাইয়ের বাংলা checklist।",
    lead: "থিসিসের মতো গুরুত্বপূর্ণ document-এ conversion শেষ ধাপ নয়। বিজয়/SutonnyMJ output ব্যবহার করার আগে নিচের ব্যবহারিক যাচাইগুলো করুন।",
    structuredType: "Article",
    sections: [
      {
        title: "১. মূল document-এর একটি backup রাখুন",
        paragraphs: ["Google Docs বা Word-এর original Unicode copy আলাদা রাখুন। Conversion output নিয়ে কাজ করার সময় মূল file overwrite করবেন না।"],
      },
      {
        title: "২. সঠিক দিক নির্বাচন করুন",
        paragraphs: ["Unicode/অভ্র লেখা বিজয়ে নিতে “অভ্র → বিজয়” এবং পুরোনো SutonnyMJ-বিজয় লেখা আধুনিক Unicode-এ আনতে “বিজয় → অভ্র” নির্বাচন করুন।"],
      },
      {
        title: "৩. বাংলা ও English font আলাদা করে দেখুন",
        paragraphs: ["Word-এ বিজয় বাংলা অংশ SutonnyMJ-তে এবং English অংশ Times New Roman-এ স্বাভাবিক দেখাচ্ছে কি না দেখুন। Mixed text-এ font family ভুল হলে লেখা অস্বাভাবিক লাগতে পারে।"],
      },
      {
        title: "৪. formatting-sensitive অংশ proofread করুন",
        paragraphs: ["Heading, italic, bold, table, list, quotation, footnote/endnote, indent এবং hyperlink-এর আশপাশ একবার পরীক্ষা করুন।"],
      },
      {
        title: "৫. যুক্তবর্ণ ও যতিচিহ্ন দেখুন",
        paragraphs: ["শুরু, মাঝ ও শেষের কারচিহ্ন, র-ফলা, যুক্তবর্ণ, দাঁড়ি, quote, বন্ধনী এবং বাংলা–English সংখ্যার আশপাশ আলাদা করে proofread করুন।"],
      },
      {
        title: "৬. Font size ও paragraph spacing মিলিয়ে নিন",
        paragraphs: ["নির্দেশিত font size, line spacing, margin ও paragraph style প্রয়োগের পর কয়েকটি page দেখে নিন। কেবল একটি page ঠিক দেখালেই পুরো document ঠিক আছে ধরে নেবেন না।"],
      },
      {
        title: "৭. Print/PDF preview দেখুন",
        paragraphs: ["জমা দেওয়ার আগে Word-এর print preview বা PDF export-এ কয়েকটি শুরু-মাঝ-শেষের page দেখুন। এতে page break, heading ও alignment সমস্যা সহজে ধরা পড়ে।"],
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

function PublicPageMetadata({ page }: { page: PublicPage }) {
  useEffect(() => {
    const url = `${BASE_URL}/${page.slug}`;
    document.title = `${page.title} | অভ্রজয়`;
    setMeta('meta[name="description"]', "name", page.description);
    setMeta('meta[property="og:title"]', "property", page.title);
    setMeta('meta[property="og:description"]', "property", page.description);
    setMeta('meta[property="og:url"]', "property", url);
    setMeta('meta[name="twitter:title"]', "name", page.title);
    setMeta('meta[name="twitter:description"]', "name", page.description);

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;

    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.id = "avrojoy-public-info-structured-data";
    structuredData.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": page.structuredType,
      headline: page.title,
      name: page.title,
      description: page.description,
      inLanguage: "bn-BD",
      mainEntityOfPage: url,
      author: { "@type": "Person", name: "মো. হাবিবুল্লাহ নাঈম" },
      publisher: { "@type": "Organization", name: "অভ্রজয় (AvroJoy)" },
      dateModified: "2026-08-25",
    });
    document.head.appendChild(structuredData);

    return () => structuredData.remove();
  }, [page]);

  return null;
}

function PublicHeader() {
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
            <span className="block truncate text-xs text-primary-foreground/75">বাংলা রূপান্তর সহায়তা</span>
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

function PublicFooter() {
  const currentCopyrightYear = new Intl.DateTimeFormat("bn-BD", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <footer className="border-t bg-primary py-6 text-primary-foreground">
      <div className="container flex flex-col items-center gap-3 text-center text-xs text-primary-foreground/85">
        <nav aria-label="Footer links" className="flex flex-wrap justify-center gap-x-4 gap-y-2 font-semibold">
          <a href="/privacy" className="underline-offset-4 hover:text-primary-foreground hover:underline">গোপনীয়তা</a>
          <a href="/terms" className="underline-offset-4 hover:text-primary-foreground hover:underline">ব্যবহারের শর্ত</a>
          <a href="/contact" className="underline-offset-4 hover:text-primary-foreground hover:underline">যোগাযোগ</a>
          <a href="/thesis-bijoy-checklist" className="underline-offset-4 hover:text-primary-foreground hover:underline">থিসিস checklist</a>
        </nav>
        <span>© {currentCopyrightYear} অভ্রজয় (AvroJoy) • অভ্র/ইউনিকোড ⇄ বিজয়</span>
      </div>
    </footer>
  );
}

export function PublicInfoPage({ slug }: { slug: PublicPage["slug"] }) {
  const page = PAGES[slug];
  const isContact = page.slug === "contact";

  return (
    <div className="seo-guide-page public-info-page min-h-svh bg-background text-foreground">
      <PublicPageMetadata page={page} />
      <PublicHeader />
      <main className="container py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <a href="/" className="font-semibold text-primary hover:underline">অভ্রজয়</a>
          <span className="px-2" aria-hidden="true">/</span>
          <span>{page.eyebrow}</span>
        </nav>

        <article className="mx-auto max-w-4xl">
          <header className="rounded-3xl border border-primary/20 bg-card p-6 shadow-sm sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{page.eyebrow}</p>
            <h1 className="mt-3 font-serif text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">{page.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{page.lead}</p>
          </header>

          {isContact && (
            <section className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-7" aria-labelledby="whatsapp-title">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><MessageCircle className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h2 id="whatsapp-title" className="text-xl font-extrabold text-foreground">WhatsApp-এ সাহায্য নিন</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">সমস্যার সংক্ষিপ্ত বিবরণ ও প্রয়োজনীয় sample/screenshot পাঠান।</p>
                  <a href="https://wa.me/8801601599355" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp: 01601599355
                  </a>
                </div>
              </div>
            </section>
          )}

          <div className="mt-6 space-y-5">
            {page.sections.map((section) => (
              <section key={section.title} className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                <h2 className="text-xl font-extrabold text-foreground">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-sm leading-relaxed text-foreground sm:text-base">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-7" aria-labelledby="back-to-tool-title">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 id="back-to-tool-title" className="text-xl font-extrabold text-foreground">রূপান্তর শুরু করুন</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">প্রয়োজন হলে হোমপেজে ফিরে text বা file converter ব্যবহার করুন।</p>
                <a href="/" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  কনভার্টারে যান
                </a>
              </div>
            </div>
          </section>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}
