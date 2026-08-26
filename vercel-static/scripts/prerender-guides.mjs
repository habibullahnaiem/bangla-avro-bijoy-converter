import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(projectRoot, "dist", "public");
const templatePath = path.join(publicDir, "index.html");
const siteUrl = "https://avrojoy.vercel.app";
const siteName = "অভ্রজয় (AvroJoy)";

const guides = [
  {
    slug: "avro-to-bijoy",
    eyebrow: "ইউনিকোড টু বিজয় গাইড",
    title: "ইউনিকোড টু বিজয় কনভার্টার: অভ্র লেখা SutonnyMJ-তে রূপান্তর",
    description:
      "ইউনিকোড টু বিজয় কনভার্টার দিয়ে অভ্র/Unicode বাংলা লেখা SutonnyMJ বিজয় ফরম্যাটে রূপান্তরের ব্যবহারিক গাইড—Word-এ বাংলা ও English font ব্যবহারের নির্দেশনাসহ।",
    lead:
      "ইউনিকোড টু বিজয় বলতে আধুনিক অভ্র/Unicode বাংলা লেখাকে SutonnyMJ-ভিত্তিক বিজয় ফরম্যাটে নেওয়া বোঝায়। থিসিস, বই বা Word document-এ ব্যবহার করার আগে সঠিক direction, output preview এবং বাংলা–English font নির্বাচন জরুরি।",
    steps: [
      "মূল Text Converter-এ “অভ্র → বিজয়” নির্বাচন করুন।",
      "আপনার Unicode বাংলা লেখা টাইপ করুন বা পেস্ট করুন।",
      "Output preview দেখে Copy to Clipboard দিয়ে Word-এ পেস্ট করুন।",
      "বাংলা বিজয় অংশে SutonnyMJ এবং English অংশে Times New Roman ব্যবহার করুন।",
    ],
    notes: [
      "যুক্তবর্ণ, কারচিহ্ন বা যতিচিহ্ন রূপান্তরের পর output preview-তে একবার দেখে নিন।",
      "বাংলা–English mixed document-এ দুই ভাষার font family আলাদা রাখা পাঠযোগ্যতায় সহায়ক।",
      "Public converter-এ text conversion browser-এর ভেতরেই চলে।",
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
      [
        "ইউনিকোড টু বিজয় বলতে কী বোঝায়?",
        "অভ্র বা অন্য Unicode বাংলা লেখাকে SutonnyMJ-ভিত্তিক বিজয় ফরম্যাটে নেওয়াকে Unicode টু বিজয় বলা হয়। এটি Word, প্রকাশনা বা বিজয়-নির্ভর কাজে প্রয়োজন হতে পারে।",
      ],
      [
        "অভ্র ও Unicode কি একই জিনিস?",
        "অভ্র একটি বাংলা input method; অভ্র দিয়ে লেখা বাংলা সাধারণত Unicode text। তাই অভ্র থেকে বিজয় conversion একই Unicode-to-Bijoy workflow-এ করা যায়।",
      ],
      [
        "বাংলা–English mixed লেখা কি রূপান্তর করা যায়?",
        "হ্যাঁ। Word-এ বাংলা বিজয় অংশে SutonnyMJ এবং English name, title বা citation-এ Times New Roman রাখুন।",
      ],
      [
        "থিসিস বা Word file দেওয়ার আগে অভ্রজয়ের review method কী?",
        "প্রথমে direction ঠিক আছে কি না নিশ্চিত করুন। তারপর representative যুক্তবর্ণ, কারচিহ্ন, যতিচিহ্ন, English name/citation ও heading-এর মতো formatting-sensitive অংশ preview-তে দেখুন। DOCX download করলে Word-এ বাংলা অংশ SutonnyMJ এবং English অংশ Times New Roman রেখে একটি final proofread করুন।",
      ],
      [
        "Word-এ বাংলা অক্ষর হিজিবিজি দেখালে কী করব?",
        "সাধারণত বিজয় byte-কে Unicode font-এ দেখানোর কারণে এটি হয়। বাংলা অংশ SutonnyMJ font-এ দিন এবং English অংশে Times New Roman রাখুন।",
      ],
      [
        "আমার লেখা কি server-এ পাঠানো বা সংরক্ষণ করা হয়?",
        "Public converter-এ text conversion আপনার browser-এই চলে; login বা public cloud document list প্রয়োজন হয় না।",
      ],
    ],
  },
  {
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
      "Unicode output দেখে প্রয়োজনে বানান, spacing বা context যাচাই করুন।",
      "ফলাফল Unicode-compatible editor, website বা document-এ ব্যবহার করুন।",
    ],
    notes: [
      "উৎস লেখাটি সত্যিই বিজয়/SutonnyMJ-ভিত্তিক কি না নিশ্চিত করুন।",
      "পুরোনো document-এর layout আলাদা হতে পারে, তাই প্রকাশের আগে transformed text proofread করুন।",
      "রূপান্তরটি browser-ভিত্তিক; login বা ব্যক্তিগত cloud storage প্রয়োজন হয় না।",
    ],
    useCases: [
      ["পুরোনো SutonnyMJ লেখা উদ্ধার", "আগের বিজয় font-এ লেখা article, note বা manuscript আধুনিক Unicode editor-এ নিতে হলে আগে একটি ছোট অংশে direction ও output যাচাই করুন।"],
      ["ওয়েবসাইট ও সামাজিক মাধ্যমে পুনঃব্যবহার", "Unicode output copy করে website, CMS, Facebook বা অন্য Unicode-compatible platform-এ ব্যবহার করা যায়; প্রকাশের আগে নাম, যতিচিহ্ন ও spacing দ্রুত দেখে নিন।"],
      ["সম্পাদনা ও সংরক্ষণ", "পুরোনো বিজয় লেখা Unicode হলে খোঁজা, সম্পাদনা ও নতুন document-এ ব্যবহার সহজ হয়। রূপান্তরের আগে original copy রেখে final output proofread করুন।"],
    ],
    reviewMethod: {
      title: "বিজয় টু ইউনিকোড করার আগে সংক্ষিপ্ত review method",
      intro: "এটি কোনো স্বয়ংক্রিয় নিখুঁততার guarantee নয়। পুরোনো বিজয় লেখা নতুন editor বা web-এ নেওয়ার আগে নিচের ছোট review-টি করলে ভুল direction বা context-জনিত সমস্যা আগে ধরা সহজ হয়।",
      checks: [
        "উৎস যাচাই করুন: লেখাটি সত্যিই SutonnyMJ বা অন্য বিজয়-ভিত্তিক text কি না দেখুন; Unicode লেখা হলে এই direction ব্যবহার করবেন না।",
        "সঠিক direction নিন: Text Converter-এ “বিজয় → অভ্র” নির্বাচন করে ছোট একটি representative অংশ আগে paste করুন।",
        "চোখে পড়ার অংশ পরীক্ষা করুন: নাম, যুক্তবর্ণ, কারচিহ্ন, যতিচিহ্ন, quotation mark ও English name/URL দেখে নিন।",
        "Unicode output একটি নতুন Unicode-compatible editor-এ paste করে কয়েকটি line পড়ুন; অর্থহীন অক্ষর বা ভুল spacing থাকলে source ও direction আবার যাচাই করুন।",
        "মূল বিজয় লেখা আলাদা রেখে দিন এবং publish, edit বা archive করার আগে transformed output একবার final proofread করুন।",
      ],
    },
    faqs: [
      [
        "বিজয় থেকে ইউনিকোড কনভার্টার কী করে?",
        "এটি SutonnyMJ-ভিত্তিক পুরোনো বিজয় text-কে আধুনিক Unicode বাংলায় রূপান্তর করতে সাহায্য করে। Unicode output পরে সাধারণ browser, editor ও social platform-এ ব্যবহার করা যায়।",
      ],
      [
        "বিজয় টু ইউনিকোড করতে কোন লেখা input দেব?",
        "যে লেখা বিজয়/SutonnyMJ font-এ তৈরি হয়েছিল সেটি input box-এ paste করুন এবং “বিজয় → অভ্র” নির্বাচন করুন। Unicode লেখা ভুল করে এই direction-এ দিলে অর্থবহ ফল নাও আসতে পারে।",
      ],
      [
        "বিজয় লেখা কীভাবে Unicode-এ নেব?",
        "বিজয় → অভ্র direction নির্বাচন করে SutonnyMJ-ভিত্তিক বিজয় লেখা paste করুন, তারপর Unicode output দেখে কপি করুন।",
      ],
      [
        "Unicode লেখা ভুল করে বিজয় → অভ্র-তে দিলে কী হবে?",
        "সঠিক উৎস-encoding না হলে অর্থবহ ফল নাও আসতে পারে। Unicode লেখা হলে অভ্র → বিজয় direction ব্যবহার করুন।",
      ],
      [
        "রূপান্তরিত লেখা কি website বা social platform-এ ব্যবহার করা যাবে?",
        "হ্যাঁ। Unicode output আধুনিক browser, social platform এবং Unicode-compatible editor-এ ব্যবহার করা যায়; প্রকাশের আগে একবার দেখে নেওয়া ভালো।",
      ],
      [
        "পুরোনো বিজয় DOCX file কীভাবে Unicode করব?",
        "হোমপেজের File Converter-এ “বিজয় → অভ্র” direction নির্বাচন করে DOCX file দিন। Preview ও download-এর পরে Word-এ গুরুত্বপূর্ণ paragraph, heading এবং reference অংশ একবার proofread করুন।",
      ],
      [
        "রূপান্তরের ফল অর্থহীন বা ভাঙা দেখালে কী করব?",
        "আগে source লেখাটি সত্যিই বিজয়/SutonnyMJ কি না এবং direction ঠিক আছে কি না যাচাই করুন। একটি ছোট অংশে আবার পরীক্ষা করুন; তারপর Unicode-compatible editor-এ paste করে নাম, যতিচিহ্ন ও spacing দেখুন।",
      ],
    ],
  },
  {
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
      "ফাইল রূপান্তর করে preview দেখুন।",
      "ফলাফল download করে Word-এ বাংলা বিজয় অংশ SutonnyMJ font-এ আছে কি না যাচাই করুন।",
    ],
    notes: [
      "ফাইল রূপান্তর ও download প্রস্তুতি বর্তমান browser session-এ সম্পন্ন হয়।",
      "জটিল Word document-এ মূল formatting ও output আলাদা করে পরীক্ষা করা ভালো অভ্যাস।",
      "পুরোনো বিজয় DOCX unreadable হলে font-repair action শুধু সেই ধরনের file-এর জন্য ব্যবহার করুন।",
    ],
    useCasesHeading: "কোন DOCX/TXT কাজে file conversion দরকার হয়?",
    useCases: [
      ["থিসিস, রিপোর্ট ও জমা দেওয়ার আগে প্রস্তুতি", "Unicode Word file বিজয় policy অনুযায়ী প্রস্তুত করতে হলে original file আলাদা রেখে সঠিক direction, preview ও download-এর পর Word proofread করুন।"],
      ["Formatting-sensitive Word document", "Heading, bold/italic, quotation, table cell বা reference-ঘেঁষা অংশ থাকলে representative অংশ preview-তে দেখুন এবং downloaded DOCX খুলে গুরুত্বপূর্ণ জায়গা যাচাই করুন।"],
      ["Plain TXT ও ছোট manuscript", "TXT file-এ direction ঠিক করে দ্রুত Unicode বা বিজয় output নিন। প্রকাশ বা সম্পাদনার আগে নাম, যুক্তবর্ণ, যতিচিহ্ন ও spacing দেখে রাখুন।"],
    ],
    reviewMethod: {
      title: "DOCX বিজয় কনভার্ট করার আগে file review method",
      intro: "এটি কোনো স্বয়ংক্রিয় নিখুঁততার guarantee নয়। থিসিস, রিপোর্ট বা formatting-sensitive Word file রূপান্তরের আগে ও পরে নিচের ছোট review-টি করলে ভুল direction এবং চোখে পড়ার formatting সমস্যা আগে ধরা সহজ হয়।",
      checks: [
        "মূল file-এর একটি আলাদা copy রেখে দিন এবং fileটি Unicode/অভ্র না পুরোনো বিজয়/SutonnyMJ source—তা আগে নিশ্চিত করুন।",
        "File Converter-এ সঠিক direction নির্বাচন করে DOCX বা TXT file দিন; ভুল direction-এ অর্থবহ ফল নাও আসতে পারে।",
        "Preview-তে heading, নাম, যুক্তবর্ণ, কারচিহ্ন, দাড়ি, quotation এবং বাংলা–English mixed অংশের কয়েকটি representative line দেখুন।",
        "Downloaded DOCX Word-এ খুলে bold/italic, table cell, reference ও indentation-ঘেঁষা অংশ দ্রুত proofread করুন; জটিল document-এ সব formatting একবার পরীক্ষা করা ভালো।",
        "প্রয়োজনে বাংলা বিজয় run-এ SutonnyMJ এবং English run-এ Times New Roman আছে কি না যাচাই করে তারপর final file ব্যবহার করুন।",
      ],
    },
    faqs: [
      [
        "কোন file format ব্যবহার করা যায়?",
        "বর্তমান File Converter-এ DOCX এবং TXT file নির্বাচন করা যায়। অন্য format আগে উপযুক্তভাবে DOCX বা TXT-তে প্রস্তুত করুন।",
      ],
      [
        "DOCX বিজয় কনভার্টার কি দুই direction-এ কাজ করে?",
        "হ্যাঁ। File Converter-এ প্রয়োজন অনুযায়ী “অভ্র → বিজয়” বা “বিজয় → অভ্র” direction নির্বাচন করুন। File-এর উৎস encoding অনুযায়ী direction ঠিক করা সবচেয়ে গুরুত্বপূর্ণ ধাপ।",
      ],
      [
        "Bold, italic, table বা reference থাকা DOCX কীভাবে যাচাই করব?",
        "রূপান্তরের আগে preview-তে কয়েকটি representative অংশ দেখুন। Download করার পরে Word-এ heading, bold/italic emphasis, quotation, table cell ও reference-ঘেঁষা অংশ দ্রুত proofread করুন; জটিল file-এ original copy রেখে কাজ করা ভালো।",
      ],
      [
        "Download করা file খোলার পর font আলাদা দেখালে কী করব?",
        "বাংলা বিজয় run-এ SutonnyMJ এবং English run-এ Times New Roman আছে কি না দেখুন। প্রয়োজনে output download করার আগে preview দেখুন।",
      ],
      [
        "পুরোনো বিজয় DOCX পড়া না গেলে কী করব?",
        "পুরোনো বিজয় byte Times New Roman-এর মতো Unicode font-এ দেখালে লেখা unreadable হতে পারে। আগে source ও direction যাচাই করুন; প্রয়োজন হলে হোমপেজের font-repair action কেবল পুরোনো বিজয় DOCX-এর জন্য ব্যবহার করুন, তারপর output proofread করুন।",
      ],
    ],
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function replaceTag(html, expression, replacement) {
  if (!expression.test(html)) throw new Error(`Expected HTML marker was not found: ${expression}`);
  return html.replace(expression, replacement);
}

function pageMarkup(guide, url) {
  const steps = guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const notes = guide.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("");
  const useCases = guide.useCases
    ? `<section aria-labelledby="use-cases-title"><h2 id="use-cases-title">${escapeHtml(guide.useCasesHeading ?? "কোন কাজে এই রূপান্তর দরকার হয়?")}</h2>${guide.useCases.map(([title, description]) => `<section><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></section>`).join("")}</section>`
    : "";
  const reviewMethod = guide.reviewMethod
    ? `<section aria-labelledby="review-method-title"><h2 id="review-method-title">${escapeHtml(guide.reviewMethod.title)}</h2><p>${escapeHtml(guide.reviewMethod.intro)}</p><ol>${guide.reviewMethod.checks.map((check) => `<li>${escapeHtml(check)}</li>`).join("")}</ol></section>`
    : "";
  const faqs = guide.faqs
    .map(
      ([question, answer]) =>
        `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`,
    )
    .join("");

  return `<main class="avrojoy-crawl-guide" data-route="${guide.slug}">
  <nav aria-label="Breadcrumb"><a href="/">অভ্রজয় (AvroJoy)</a> <span aria-hidden="true">›</span> <span>${escapeHtml(guide.eyebrow)}</span></nav>
  <article>
    <p>${escapeHtml(guide.eyebrow)}</p>
    <h1>${escapeHtml(guide.title)}</h1>
    <p>${escapeHtml(guide.lead)}</p>
    <p><a href="/">অভ্রজয়ের মূল কনভার্টারে যান</a></p>
    <h2>কীভাবে ব্যবহার করবেন</h2>
    <ol>${steps}</ol>
    <h2>মনে রাখুন</h2>
    <ul>${notes}</ul>
    ${useCases}
    ${reviewMethod}
    <h2>সাধারণ প্রশ্ন</h2>
    ${faqs}
    <p><a href="/bijoy-to-unicode">বিজয় থেকে Unicode গাইড</a> · <a href="/docx-txt-bijoy-converter">DOCX ও TXT ফাইল গাইড</a></p>
  </article>
</main>`;
}

function structuredData(guide, url) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: guide.title,
        description: guide.description,
        inLanguage: "bn-BD",
        mainEntityOfPage: url,
        isPartOf: { "@id": `${siteUrl}/#website` },
        author: { "@type": "Person", name: "মো. হাবিবুল্লাহ নাঈম" },
        publisher: { "@id": `${siteUrl}/#organization` },
        about: { "@id": `${siteUrl}/#webapplication` },
        dateModified: "2026-08-26",
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: guide.faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: guide.eyebrow, item: url },
        ],
      },
    ],
  };
}

if (!fs.existsSync(templatePath)) {
  throw new Error(`Expected Vite output was not found: ${templatePath}`);
}

const baseTemplate = fs.readFileSync(templatePath, "utf8");

for (const guide of guides) {
  const url = `${siteUrl}/${guide.slug}`;
  const title = `${guide.title} | অভ্রজয়`;
  const data = JSON.stringify(structuredData(guide, url));
  let html = baseTemplate;

  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${escapeHtml(guide.description)}" />`,
  );
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceTag(html, /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/>/, '<meta property="og:type" content="article" />');
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:url" content="${url}" />`);
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:title" content="${escapeHtml(guide.title)}" />`);
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(guide.description)}" />`,
  );
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(guide.title)}" />`);
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(guide.description)}" />`,
  );
  html = replaceTag(
    html,
    /<script id="avrojoy-home-faq-structured-data"[\s\S]*?<\/script>/,
    `<script id="avrojoy-guide-structured-data" type="application/ld+json">${data}</script>`,
  );
  html = replaceTag(html, /<div id="root">[\s\S]*?<\/div>/, `<div id="root">${pageMarkup(guide, url)}</div>`);

  const routeDirectory = path.join(publicDir, guide.slug);
  fs.mkdirSync(routeDirectory, { recursive: true });
  fs.writeFileSync(path.join(routeDirectory, "index.html"), html, "utf8");
  console.log(`Generated crawl-visible ${guide.slug}/index.html`);
}
