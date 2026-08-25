import { useEffect } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Moon, Quote, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const BRAND_LOGO_SRC = "/manus-storage/bangla-converter-exact-reference-logo_2f0bb0ec.png";
const STORY_URL = "https://avrojoy.vercel.app/avrojoy-er-jonmokotha";
const STORY_TITLE = "অভ্রজয়ের জন্মকথা: একটি থিসিস, শেষ মুহূর্তের হতাশা এবং নতুন এক শুরুর গল্প";
const STORY_DESCRIPTION = "স্নাতকোত্তর থিসিসের শেষ মুহূর্তের formatting সমস্যা থেকে কীভাবে অভ্রজয়ের শুরু—মো. হাবিবুল্লাহ নাঈমের নিজের ভাষায় সেই গল্প।";

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

function StoryMetadata() {
  useEffect(() => {
    document.title = `${STORY_TITLE} | অভ্রজয়`;
    setMeta('meta[name="description"]', "name", STORY_DESCRIPTION);
    setMeta('meta[property="og:title"]', "property", STORY_TITLE);
    setMeta('meta[property="og:description"]', "property", STORY_DESCRIPTION);
    setMeta('meta[property="og:url"]', "property", STORY_URL);
    setMeta('meta[name="twitter:title"]', "name", STORY_TITLE);
    setMeta('meta[name="twitter:description"]', "name", STORY_DESCRIPTION);

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = STORY_URL;

    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.id = "avrojoy-story-structured-data";
    structuredData.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: STORY_TITLE,
      description: STORY_DESCRIPTION,
      inLanguage: "bn-BD",
      mainEntityOfPage: STORY_URL,
      author: { "@type": "Person", name: "মো. হাবিবুল্লাহ নাঈম" },
      publisher: { "@type": "Organization", name: "অভ্রজয় (AvroJoy)" },
      datePublished: "2026-08-25",
      dateModified: "2026-08-25",
    });
    document.head.appendChild(structuredData);

    return () => structuredData.remove();
  }, []);

  return null;
}

function StoryHeader() {
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
            <span className="block truncate text-xs text-primary-foreground/75">আমাদের গল্প</span>
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

export default function AvroJoyStoryPage() {
  return (
    <div className="seo-guide-page story-page min-h-svh bg-background text-foreground">
      <StoryMetadata />
      <StoryHeader />
      <main className="container py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <a href="/" className="font-semibold text-primary hover:underline">অভ্রজয়</a>
          <span className="px-2" aria-hidden="true">/</span>
          <span>আমাদের গল্প</span>
        </nav>

        <article className="mx-auto max-w-4xl">
          <header className="rounded-3xl border border-primary/20 bg-card p-6 shadow-sm sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">অভ্রজয়ের জন্মকথা</p>
            <h1 className="mt-3 font-serif text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">{STORY_TITLE}</h1>
            <p className="story-page__lead mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              একটি প্রয়োজন, একটি deadline এবং নিজের document ঠিক রাখার প্রবল ইচ্ছা—এই তিনটি থেকেই অভ্রজয়ের শুরু।
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-foreground">
              <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span><strong>মো. হাবিবুল্লাহ নাঈম</strong> · বাংলা বিভাগ, রাজশাহী বিশ্ববিদ্যালয়</span>
            </div>
          </header>

          <section className="mt-6 rounded-2xl border bg-card/90 p-5 shadow-sm sm:p-7" aria-label="অভ্রজয়ের গল্প">
            <div className="story-page__content max-w-3xl space-y-8 text-[0.98rem] leading-8 text-foreground sm:text-base sm:leading-8">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">একটি থিসিস থেকে শুরু</h2>
                <p className="mt-3">
                  গল্পটা শুরু হয়েছিল স্নাতকোত্তরের থিসিস জমা দেওয়ার ঠিক কিছুদিন আগে। গবেষণার পুরো কাজটি করা হয়েছিল Google Docs-এ, অভ্র বা Unicode বাংলা ব্যবহার করে। Reference যোগ করা, নির্দিষ্ট অংশ italic বা bold করা—সবকিছুই যত্ন নিয়ে সাজানো ছিল। পরিকল্পনাও ছিল সহজ: শেষে file-টি Word document হিসেবে নামিয়ে অনলাইনের কোনো converter দিয়ে বিজয়ে রূপান্তর করা হবে।
                </p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-start gap-3">
                  <Quote className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                  <p className="font-medium leading-7 text-foreground">
                    থিসিসের শেষ মুহূর্তে সমস্যা শুধু text বদলানোর ছিল না—ফরম্যাটিং, বাংলা–ইংরেজি মিশ্র লেখা ও font-size-এর সামঞ্জস্যও ধরে রাখতে হতো।
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">বিপর্যয় ও সময়ের টানাটানি</h2>
                <p className="mt-3">
                  রূপান্তর করতে গিয়েই দেখা গেল, এত যত্নের formatting পুরোপুরি ভেঙে যাচ্ছে। প্রচলিত converter-এ English শব্দগুলো বাংলার মতো অদ্ভুত হয়ে যাচ্ছিল, আবার আলাদা করে font নির্বাচন ও size সামঞ্জস্য না করলে লেখা একসঙ্গে স্বাভাবিক দেখাচ্ছিল না। Italic ও bold অংশও ঠিক থাকছিল না। হাতে সময় কম, আর document-এর সূক্ষ্ম formatting সামলানোর উপায়ও মিলছিল না।
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">প্রয়োজন থেকেই অভ্রজয়</h2>
                <p className="mt-3">
                  সেই চাপের মধ্যেই একটি সিদ্ধান্ত নেওয়া হয়: পাতার পর পাতা হাতে ঠিক করার বদলে সমস্যার একটি স্থায়ী সমাধান খোঁজা হবে। ব্যক্তিগত সেই প্রয়োজন ও জেদ থেকেই জন্ম নেয় অভ্রজয়—অভ্র থেকে বিজয়, কিংবা বিজয় থেকে অভ্রতে document-aware রূপান্তরের একটি ব্যবহারিক উদ্যোগ।
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">বাস্তব পরীক্ষা ও নতুন শুরু</h2>
                <p className="mt-3">
                  প্রাথমিক কাঠামো দাঁড় করিয়ে নিজের থিসিসের file দিয়েই পরীক্ষা শুরু হয়। conversion-এর সময় যে ত্রুটি সামনে এসেছে, সেগুলো একে একে চিহ্নিত করে সমাধান করার চেষ্টা করা হয়েছে—বিশেষ করে বাংলা–English mixed text, font family, font size এবং document formatting-এর ব্যবহারিক সমস্যাগুলো। শেষ পর্যন্ত নিজের তৈরি tool ব্যবহার করেই নির্ধারিত সময়ের মধ্যে thesis জমা দেওয়া সম্ভব হয়।
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">আমাদের উদ্দেশ্য</h2>
                <p className="mt-3">
                  অভ্রজয় শুধু একটি converter নয়; এটি deadline-এর চাপ থেকে বেরিয়ে আসার একটি গল্প। বাংলা document-এর formatting, বাংলা–English মিশ্রণ বা font-size নিয়ে যেন কোনো শিক্ষার্থী, গবেষক কিংবা পেশাজীবী শেষ মুহূর্তে একই বিপদে না পড়েন—এই চাওয়াই এর মূল উদ্দেশ্য। ছোট্ট ব্যক্তিগত উদ্যোগটি সবার ডিজিটাল লেখালেখি ও রূপান্তরের পথ কিছুটা সহজ করুক।
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-7" aria-labelledby="story-next-title">
            <h2 id="story-next-title" className="text-xl font-extrabold text-foreground">আপনার কাজেও অভ্রজয় ব্যবহার করুন</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              অভ্র/Unicode লেখা বিজয়ে নিতে বা পুরোনো বিজয় লেখা Unicode-এ ফিরিয়ে আনতে হোমপেজের converter থেকে শুরু করুন।
            </p>
            <a href="/" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              কনভার্টারে যান
            </a>
          </section>
        </article>
      </main>
      <footer className="border-t bg-primary py-6 text-primary-foreground">
        <div className="container flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs text-primary-foreground/80">
          <span>© ২০২৬ অভ্রজয় (AvroJoy) • অভ্র/ইউনিকোড ⇄ বিজয়</span>
          <a href="/" className="font-semibold text-primary-foreground underline-offset-4 hover:underline">কনভার্টারে ফিরে যান <ArrowRight className="inline h-3.5 w-3.5" aria-hidden="true" /></a>
        </div>
      </footer>
    </div>
  );
}
