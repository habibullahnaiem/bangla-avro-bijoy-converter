/*
 * ডিজাইন দিক: টিল ডেস্ক (Teal Desk)
 * - গভীর টিল হেডার, কাগজের মতো ব্যাকগ্রাউন্ড, সাদা কার্ড
 * - দুই কলাম টেক্সটবক্স: অভ্র (ইনপুট) ⇄ সুতন্নী এমজে (আউটপুট)
 * - ইনপুট: Hind Siliguri; আউটপুট: SutonniMJ + Times New Roman
 * - দিক টগল, দিক পরিবর্তন (সুয়াপ), মুছুন, কপি, পেস্ট
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeftRight,
  ArrowRightLeft,
  ClipboardCopy,
  ClipboardPaste,
  Eraser,
  Sun,
  Check,
  ArrowDownUp,
} from "lucide-react";
import { toast } from "sonner";
import { convert, type ConvertDirection } from "@/lib/converter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EXAMPLE_TEXT = `সম্পাদক মহোদয়,
ক্রীড়া বিভাগের নিকট নিয়োজনপত্র পাঠানো হলো। রেলগাড়ি নির্ধারণ সন্ধ্যা ৭টায়। পদোন্নতি ও বল্লভ মহোদয়ের নির্দেশ বাস্তবায়ন করা হলো। অ্যান্ত, ল্ল, য়, ড়, ঢ় যুক্তবর্ণ ভাঙবে না — দাঁড়িও হ-এর মতো হবে না। ধন্যবাদ।
The Times newspaper — 2026।`;

export default function Home() {
  const [direction, setDirection] = useState<ConvertDirection>("u2b");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doConvert = useCallback(
    (text: string, dir: ConvertDirection) => {
      if (!text.trim()) {
        setOutput("");
        return;
      }
      try {
        setOutput(convert(text, dir));
      } catch {
        toast.error("রূপান্তরে ত্রুটি হয়েছে। আবার চেষ্টা করুন।");
      }
    },
    [],
  );

  // লাইভ রূপান্তর (ডিবাউন্স ৩০০ms)
  useEffect(() => {
    if (!isLive) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doConvert(input, direction);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, direction, isLive, doConvert]);

  const handleManualConvert = () => {
    doConvert(input, direction);
    toast.success("রূপান্তর সম্পন্ন হয়েছে");
  };

  const toggleDirection = () => {
    setDirection((d) => (d === "u2b" ? "b2u" : "u2b"));
    setInput("");
    setOutput("");
  };

  const swapTexts = () => {
    setInput(output);
    setOutput(input);
    toast.success("টেক্সট অদল-বদল করা হয়েছে");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const copyOutput = async () => {
    if (!output) {
      toast.info("কপি করার মতো কিছু নেই");
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("বিজয় টেক্সট কপি করা হয়েছে");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("কপি করা যায়নি");
    }
  };

  const pasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput((prev) => prev + text);
      toast.success("পেস্ট করা হয়েছে");
    } catch {
      toast.error("ক্লিপবোর্ড পড়া যায়নি — ব্রাউজারের অনুমতি যাচাই করুন");
    }
  };

  const loadExample = () => {
    setInput(EXAMPLE_TEXT);
  };

  const charCount = input.length;
  const outCharCount = output.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* হেডার — গভীর টিল */}
      <header className="relative overflow-hidden bg-primary text-primary-foreground shadow-md">
        {/* ⇄ মোটিফ ব্যাকগ্রাউন্ড */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center opacity-[0.07]"
          aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="select-none text-5xl font-black tracking-tight md:text-7xl">
              ⇄
            </span>
          ))}
        </div>
        <div className="container relative flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground text-primary shadow-inner">
              <span className="font-serif text-[1.05rem] font-black leading-none tracking-tight">
                অ⇄ব
              </span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-tight tracking-tight md:text-2xl">
                অভ্র ⇄ বিজয় কনভার্টার
              </h1>
              <p className="mt-0.5 text-xs opacity-85 md:text-sm">
                ইউনিকোড ⇄ সুতন্নী এমজে • যুক্তাক্ষর ও দাঁড়ি নির্ভুল
              </p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() =>
                  toast.info("ডার্ক মোড শিগগিরই আসছে")
                }
                aria-label="থিম">
                <Sun className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>থিম সুইচ শিগগিরই আসছে</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <main className="container flex-1 py-8 md:py-10">
        {/* প্রোমোট শিরোনাম */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              অভ্রে লিখুন, বিজয়ে নিন
            </h2>
            <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
              সোলাইমান লিপি / কালপুরুষ টেক্সট সঠিক যুক্তাক্ষর, য়, ড়, ঢ়,
              র-ফলা এবং দাঁড়ি (।) সহ বিজয় (সুতন্নী এমজে) ফন্টে
              রূপান্তর হয় — মিশ্র টেক্সটে ইংরেজি Times New Roman-এ রাখা হয়।
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:bg-accent"
            onClick={loadExample}>
            উদাহরণ দেখুন
          </Button>
        </div>

        {/* কনভার্টার কার্ড */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-lg">
          {/* দিক টগল বার */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-secondary/60 px-4 py-3">
            <div className="flex items-center gap-1.5 rounded-full bg-card p-1 shadow-sm">
              <Button
                variant="outline"
                size="sm"
                className={
                  direction === "u2b"
                    ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted"
                }
                onClick={() => setDirection("u2b")}>
                <span className="font-serif mr-1 font-bold">অ</span>
                <ArrowRightLeft className="mx-1 h-3.5 w-3.5" />
                <span className="font-serif mr-1 font-bold">ব</span>
                অভ্র → বিজয়
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={
                  direction === "b2u"
                    ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted"
                }
                onClick={() => setDirection("b2u")}>
                <span className="font-serif mr-1 font-bold">ব</span>
                <ArrowRightLeft className="mx-1 h-3.5 w-3.5" />
                <span className="font-serif mr-1 font-bold">অ</span>
                বিজয় → অভ্র
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border bg-card text-muted-foreground hover:bg-accent"
                onClick={swapTexts}>
                <ArrowDownUp className="mr-1.5 h-3.5 w-3.5" />
                দিক পরিবর্তন
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border bg-card text-muted-foreground hover:bg-accent"
                onClick={clearAll}>
                <Eraser className="mr-1.5 h-3.5 w-3.5" />
                মুছুন
              </Button>
            </div>
          </div>

          {/* দুই কলাম টেক্সটবক্স */}
          <div className="grid gap-0 md:grid-cols-2">
            <div className="flex flex-col border-b md:border-b-0 md:border-r">
              <div className="flex items-center justify-between border-b border-border/70 bg-muted/50 px-4 py-2.5">
                <span className="text-sm font-semibold text-foreground">
                  {direction === "u2b"
                    ? "অভ্র টেক্সট (ইউনিকোড)"
                    : "বিজয় টেক্সট (সুতন্নী এমজে)"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {charCount} অক্ষর
                </span>
              </div>
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    direction === "u2b"
                      ? "এখানে অভ্র/ইউনিকোড টেক্সট লিখুন বা পেস্ট করুন..."
                      : "এখানে বিজয় টেক্সট লিখুন বা পেস্ট করুন..."
                  }
                  className={
                    "min-h-[320px] resize-none rounded-none border-0 shadow-none focus-visible:ring-0 " +
                    (direction === "u2b" ? "font-input-bn" : "font-output-bijoy")
                  }
                />
              </div>
              <div className="flex items-center gap-2 border-t bg-muted/50 px-4 py-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border bg-card text-muted-foreground hover:bg-accent"
                  onClick={pasteInput}>
                  <ClipboardPaste className="mr-1.5 h-3.5 w-3.5" />
                  পেস্ট
                </Button>
                <span className="hidden text-xs text-muted-foreground md:inline">
                  টাইপ করলেই লাইভ রূপান্তর হয়
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2.5">
                <span className="text-sm font-semibold text-muted-foreground">
                  {direction === "u2b"
                    ? "বিজয় আউটপুট (সুতন্নী এমজে)"
                    : "অভ্র আউটপুট (ইউনিকোড)"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {outCharCount} অক্ষর
                </span>
              </div>
              <div className="relative">
                <Textarea
                  value={output}
                  readOnly={isLive}
                  onChange={(e) => {
                    setIsLive(false);
                    setOutput(e.target.value);
                  }}
                  placeholder="রূপান্তরিত টেক্সট এখানে দেখাবে..."
                  className={
                    "min-h-[320px] resize-none rounded-none border-0 bg-accent/30 shadow-none focus-visible:ring-0 " +
                    (direction === "u2b"
                      ? "font-output-bijoy"
                      : "font-input-bn")
                  }
                />
              </div>
              <div className="flex items-center gap-2 border-t bg-muted/50 px-4 py-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border bg-card text-muted-foreground hover:bg-accent"
                  onClick={copyOutput}>
                  {copied ? (
                    <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  কপি
                </Button>
                <span className="text-xs text-muted-foreground">
                  কপি করে Word-এ SutonniMJ ফন্টে পেস্ট করুন
                </span>
              </div>
            </div>
          </div>

          {/* রূপান্তর বাটন */}
          <div className="flex flex-wrap items-center justify-center gap-3 border-t bg-secondary/60 px-4 py-4">
            <Button
              size="lg"
              className="h-12 min-w-56 text-base font-semibold shadow-md"
              onClick={handleManualConvert}>
              <ArrowRightLeft className="mr-2 h-5 w-5" />
              রূপান্তর করুন
            </Button>
          </div>
        </div>

        {/* ফন্ট প্রিভিউ — প্রোডাক্ট প্রমিজ হিসেবে উপস্থাপন */}
        <div className="mt-4 overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="grid md:grid-cols-2">
            <div className="flex items-center gap-4 border-b border-border/60 px-4 py-3 md:border-b-0 md:border-r">
              <span className="rounded-md bg-muted px-2.5 py-1 font-input-bn text-sm font-semibold text-foreground">
                সোলাইমান লিপি
              </span>
              <span className="text-sm text-muted-foreground">
                কালপুরুষ / যেকোনো ইউনিকোড টেক্সট ইনপুটে কাজ করে
              </span>
            </div>
            <div className="flex items-center gap-4 px-4 py-3">
              <span className="rounded-md bg-muted px-2.5 py-1 font-output-bijoy text-sm font-semibold text-foreground">
                SutonniMJ
              </span>
              <span className="text-sm text-muted-foreground">
                বিজয় আউটপুট — ইংরেজি ও সংখ্যা Times New Roman-এ
              </span>
            </div>
          </div>
        </div>

        {/* প্রেস/প্রকাশনা চরিত্র — গ্লিফ প্রিভিউ স্ট্রিপ */}
        <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              যুক্তবর্ণ প্রিভিউ — কোনোটি ভাঙে না
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              ["ন্ত", "ক্যান্টিন"],
              ["ল্ল", "বল্লভ"],
              ["য়", "নিয়োজন"],
              ["ড়", "গাড়ি"],
              ["ঢ়", "বড়াই"],
              ["্র", "ক্রীড়া"],
              ["্র্", "প্রত্যাহার"],
              ["জ্ঞ", "জ্ঞান"],
              ["ক্ষ", "লক্ষ্য"],
              ["শ্র", "শ্রীরাম"],
              ["।", "দাঁড়ি"],
            ].map(([glyph, word]) => (
              <div
                key={glyph}
                className="flex items-baseline gap-1.5">
                <span className="font-input-bn text-lg font-bold text-primary">
                  {glyph}
                </span>
                <span className="text-xs text-muted-foreground">{word}</span>
              </div>
            ))}
          </div>
        </div>

        {/* টিপস কার্ড — শান্ত, এডিটরিয়াল */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" />
            </div>
            <h3 className="mb-1 text-base font-bold text-foreground">
              যুক্তাক্ষর নির্ভুল
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              ন্ত, ল্ল, য়, ড়, ঢ়, র-ফলা, রেফ, জ্ঞ, ক্ষ, শ্র — কোনো
              যুক্তবর্ণই ভাঙে না।
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" />
            </div>
            <h3 className="mb-1 text-base font-bold text-foreground">
              দাঁড়ি সঠিক থাকে
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              বাংলা দাঁড়ি (।) বিজয়ে সঠিক দাঁড়ি-গ্লিফে রূপান্তর হয় —
              হ-এর মতো দেখায় না।
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" />
            </div>
            <h3 className="mb-1 text-base font-bold text-foreground">
              ইংরেজি Times New Roman
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              মিশ্র টেক্সটে ইংরেজি শব্দ ও সংখ্যা Times New Roman-এ রাখা হয়।
            </p>
          </div>
        </div>

        {/* সহায়তা */}
        <div className="mt-6 rounded-xl border border-border/70 bg-card/60 p-5 text-sm leading-relaxed text-muted-foreground">
          <p className="mb-2 font-semibold text-foreground">
            কীভাবে ব্যবহার করবেন
          </p>
          <ol className="list-inside list-decimal space-y-1">
            <li>বাম বক্সে অভ্র/ইউনিকোড টেক্সট লিখুন বা পেস্ট করুন।</li>
            <li>
              ডান বক্সে বিজয় (সুতন্নী এমজে) রূপান্তর লাইভ দেখা যাবে।
            </li>
            <li>
              &quot;কপি&quot; বাটনে ক্লিক করুন এবং Word/Publisher-এ SutonniMJ
              ফন্ট সিলেক্ট করে পেস্ট করুন।
            </li>
            <li>
              কম্পিউটারে SutonniMJ ফন্ট ইনস্টল না থাকলে আউটপুট বাংলা
              দেখাবে না — এটি স্বাভাবিক, কপি করা টেক্সট সঠিকই থাকবে।
            </li>
          </ol>
        </div>
      </main>

      {/* ফুটার */}
      <footer className="mt-6 border-t bg-primary py-6 text-primary-foreground">
        <div className="container flex flex-col items-center gap-1 text-center text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/15 font-serif text-xs font-black">
              অ⇄ব
            </span>
            অভ্র ⇄ বিজয় কনভার্টার — নির্ভুল বাংলা ফন্ট রূপান্তর
          </p>
          <p className="text-xs opacity-80">
            ইউনিকোড ⇄ বিজয় • সুতন্নী এমজে • Times New Roman
          </p>
        </div>
      </footer>
    </div>
  );
}
