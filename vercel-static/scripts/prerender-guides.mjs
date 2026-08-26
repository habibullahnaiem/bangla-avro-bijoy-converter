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
    eyebrow: "বিজয় থেকে ইউনিকোড গাইড",
    title: "বিজয় থেকে Unicode বাংলা: পুরোনো SutonnyMJ লেখা রূপান্তরের নিয়ম",
    description:
      "SutonnyMJ-ভিত্তিক বিজয় টেক্সট Unicode বা অভ্র বাংলা লেখায় রূপান্তরের বাংলা গাইড, সঠিক input direction ও সম্পাদনার পরামর্শ।",
    lead:
      "পুরোনো বিজয় text আধুনিক Unicode পরিবেশে ব্যবহার করতে চাইলে সঠিক উৎস ও direction জানা জরুরি। অভ্রজয় বিজয় → অভ্র mode-এ সেই text Unicode বাংলায় রূপান্তর করে, যাতে তা আধুনিক app ও web-এ ব্যবহার করা যায়।",
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
    faqs: [
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
    ],
  },
  {
    slug: "docx-txt-bijoy-converter",
    eyebrow: "DOCX ও TXT ফাইল গাইড",
    title: "DOCX ও TXT বিজয় কনভার্টার: Word ফাইল রূপান্তরের ব্যবহারিক নির্দেশনা",
    description:
      "DOCX বা TXT file-কে অভ্র/Unicode ও বিজয় (SutonnyMJ)-এর মধ্যে রূপান্তরের বাংলা নির্দেশনা, download ও font-check workflow।",
    lead:
      "Word document বা plain-text file রূপান্তরের জন্য File Converter ব্যবহার করুন। রূপান্তরের দিক ঠিক করে file নির্বাচন, preview এবং download—সব ধাপ browser-এর ভেতরেই সম্পন্ন হয়।",
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
    faqs: [
      [
        "কোন file format ব্যবহার করা যায়?",
        "বর্তমান File Converter-এ DOCX এবং TXT file নির্বাচন করা যায়। অন্য format আগে উপযুক্তভাবে DOCX বা TXT-তে প্রস্তুত করুন।",
      ],
      [
        "Download করা file খোলার পর font আলাদা দেখালে কী করব?",
        "বাংলা বিজয় run-এ SutonnyMJ এবং English run-এ Times New Roman আছে কি না দেখুন। প্রয়োজনে output download করার আগে preview দেখুন।",
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
  html = replaceTag(html, /<div id="root"><\/div>/, `<div id="root">${pageMarkup(guide, url)}</div>`);

  const routeDirectory = path.join(publicDir, guide.slug);
  fs.mkdirSync(routeDirectory, { recursive: true });
  fs.writeFileSync(path.join(routeDirectory, "index.html"), html, "utf8");
  console.log(`Generated crawl-visible ${guide.slug}/index.html`);
}
