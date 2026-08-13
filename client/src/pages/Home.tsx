/*
 * ডিজাইন দিক: টিল ডেস্ক (Teal Desk)
 * - গভীর টিল হেডার, কাগজের মতো ব্যাকগ্রাউন্ড, সাদা কার্ড
 * - দুই কলাম টেক্সটবক্স: অভ্র (ইনপুট) ⇄ সুতন্নী এমজে (আউটপুট)
 * - ইনপুট: Hind Siliguri; আউটপুট: SutonnyMJ + Times New Roman
 * - দিক টগল, দিক পরিবর্তন (সুয়াপ), মুছুন, কপি, পেস্ট
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Minus,
  Plus,
  History as HistoryIcon,
  RotateCcw,
  Trash2,
  Clock3,
} from "lucide-react";
import { toast } from "sonner";
import {
  convert,
  convertFile,
  convertToBijoy,
  convertToUnicode,
  type ConvertDirection,
  segmentBijoyText,
  mapSegmentsToBijoy,
  extractTextFrom,
} from "@/lib/converter";
import { Download, FileText, Upload, Loader2 } from "lucide-react";
import { useRef as useFileRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EXAMPLE_TEXT = `আমাদের তৈরিকৃত অভ্র/ইউনিকোড ⇄ বিজয় কনভার্টারটির 'লাইভ প্রিভিউ' এবং DOCX ফাইল আপলোড ফিচারটি অত্যন্ত সাবলীলভাবে কাজ করছে। বাংলা ফন্টের পাশাপাশি ইংরেজি (Times New Roman) এবং সংখ্যার (1, 2, 3) মিশ্রণ রেন্ডারিং একেবারেই নিখুঁত।

কনভার্টারের সর্বোচ্চ সক্ষমতা যাচাইয়ের জন্য নিচের জটিল নমুনাগুলো পরীক্ষা করা হলো:

১. কঠিন যু্গ্ববর্ণ ও কার-চিহ্ন: শান্ত (ন্ত), উল্লাস (ল্ল), দয়াময় (য়), গাঢ় (ঢ়), বিজ্ঞান (জ্ঞ), ক্ষমা (ক্ষ), ব্রাহ্মণ (হ্ম), আকাঙ্ক্ষা (ঙ্ক্ষ), স্পর্ধা (র্ধ) এবং শ্রেণি (শ+র-ফলা+ে-কার)।
২. যতিচিহ্ন ও বিশেষ গ্লিফ: ব্র্যাকেট (টেস্টিং), কমা, সেমিকোলন; ড্যাশ—সবগুলোই সঠিক আউটপুট দিচ্ছে। প্রথম বাক্যটি এখানে শেষ হলো। এরপর ডাবল-দাঁড়ি॥ 'সিঙ্গেল কোট' এবং "ডাবল কোট" সঠিকভাবে কাজ করছে।
৩. রিচ-টেক্সট ফরম্যাটিং: এই বাক্যের বোল্ড, ইটালিক এবং কালার করা অংশগুলো DOCX ফাইলে হুবহু সংরক্ষিত থাকে, কোনো টেক্সট বা স্টাইল হারায় না।
৪. ডুয়াল-সাইজ (Dual-size): "The quick brown fox jumps over 13 lazy dogs." —এই ইংরেজি বাক্যটি বাংলার চেয়ে ঠিক 2pt ছোট হয়ে প্রদর্শিত হচ্ছে।

শুভেচ্ছায়,

মো. হাবিবুল্লাহ নাঈম
শিক্ষার্থী (আইডি: ২০১০৮০৪১২৭)
বাংলা বিভাগ, রাজশাহী বিশ্ববিদ্যালয়।`;

const HISTORY_STORAGE_KEY = "abc-recent-conversions";
const MAX_HISTORY_ITEMS = 6;

type ConversionHistoryItem = {
  id: string;
  direction: ConvertDirection;
  input: string;
  output: string;
  label: string;
  createdAt: number;
};

const formatHistoryTime = (timestamp: number) =>
  new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));

const compactHistoryText = (text: string, max = 92) => {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > max ? `${compact.slice(0, max)}…` : compact;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [direction, setDirection] = useState<ConvertDirection>("u2b");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("abc-font-size") : null;
    const n = saved ? parseInt(saved, 10) : NaN;
    return Number.isFinite(n) && n >= 12 && n <= 32 ? n : 20;
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useFileRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [filePreviewText, setFilePreviewText] = useState<string>("");
  const [filePreviewInput, setFilePreviewInput] = useState<string>("");
  const [history, setHistory] = useState<ConversionHistoryItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY_ITEMS) : [];
    } catch {
      return [];
    }
  });
  const [fileResult, setFileResult] = useState<{
    name: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Private browsing/storage-restricted environments should not block conversion.
    }
  }, [history]);

  const addHistoryItem = useCallback(
    (record: Omit<ConversionHistoryItem, "id" | "createdAt">) => {
      if (!record.input.trim() || !record.output.trim()) return;
      setHistory((previous) => {
        const nextItem: ConversionHistoryItem = {
          ...record,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: Date.now(),
        };
        const withoutDuplicate = previous.filter(
          (item) =>
            !(
              item.direction === record.direction &&
              item.input === record.input &&
              item.output === record.output
            ),
        );
        return [nextItem, ...withoutDuplicate].slice(0, MAX_HISTORY_ITEMS);
      });
    },
    [],
  );

  const reuseHistoryItem = (item: ConversionHistoryItem) => {
    setActiveTab("text");
    setDirection(item.direction);
    setInput(item.input);
    setOutput(item.output);
    setIsLive(true);
    toast.success("Recent history থেকে রূপান্তরটি ফিরিয়ে আনা হয়েছে");
  };

  const removeHistoryItem = (id: string) => {
    setHistory((previous) => previous.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success("Recent conversion history মুছে ফেলা হয়েছে");
  };

  const doConvert = useCallback(
    (text: string, dir: ConvertDirection, remember = false, label = "লাইভ টেক্সট") => {
      if (!text.trim()) {
        setOutput("");
        return;
      }
      try {
        const converted = convert(text, dir);
        setOutput(converted);
        if (remember) {
          addHistoryItem({
            direction: dir,
            input: text,
            output: converted,
            label,
          });
        }
        return converted;
      } catch {
        toast.error("রূপান্তরে ত্রুটি হয়েছে। আবার চেষ্টা করুন।");
      }
    },
    [addHistoryItem],
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
    doConvert(input, direction, true);
    toast.success("রূপান্তর সম্পন্ন হয়েছে");
  };

  const toggleDirection = () => {
    const newDir = direction === "u2b" ? "b2u" : "u2b";
    setDirection(newDir);
    setInput("");
    setOutput("");
  };

  // দিক-পরিবর্তন: ইনপুট-আউটপুট অদল-বদল করার আগে টেক্সটের ধরন মিলিয়ে
  // রূপান্তর করা হয় — তাছাড়া বিজয়-কোড অভ্র→বিজয় পাইপলাইনে গেলে হিজি-বিজি হয়।
  // নতুন বিজয়ে: আউটপুট (পরিষ্কার রূপান্তর) ইনপুটে যায়, আগের ইনপুট আউটপুটে
  // (তার উপযুক্ত রূপান্তর সহ)। কোনো স্থানীয় প্রি-ম্যাপ পাঙ্কচুয়েশন বিজয় ইনপুট
  // হিসেবে পাঠানোর আগে বিজয়→অভ্র করে পরিষ্কার করা হয়।
  const swapTexts = () => {
    const newDir = direction === "u2b" ? "b2u" : "u2b";
    // আগের আউটপুট ইতোমধ্যে একবার রূপান্তরিত — সেটি এখন ইনপুট হলে তা আর
    // একবার রূপান্তর হলে দুই গুণ এনকোডিংয়ের মতো হিজি-বিজি হয়। তাই
    // আগের ইনপুটকেই নতুন দিকে রূপান্তর করে যাচায় করি কোনটি ব্যবহার করব।
    let swappedIn = input;
    let swappedOut = output;
    if (direction === "u2b") {
      // বিজয়→অভ্র হলে: বিজয় আউটপুট ইনপুট-বক্সে যায় তার বিজয়→অভ্র রূপান্তরে,
      // আর স্ক্রিনে আগের অভ্র ইনপুটই দেখায় (ইতিমধ্যে সঠিক অভ্রই ছিল।)
      swappedIn = convertToUnicode(output || input);
    } else {
      // অভ্র→বিজয় হলে: অভ্র ইনপুটের বিজয়-রূপ ইনপুট-বক্সে (বিজয় কোড হিসেবে),
      // আগের বিজয় আউটপুটের অভ্র-রূপ আউটপুটে।
      swappedIn = output ? output : convertToBijoy(input);
      swappedOut = convertToUnicode(input);
    }
    setDirection(newDir);
    setInput(swappedIn);
    setOutput(swappedOut);
    toast.success(
      newDir === "u2b" ? "অভ্র → বিজয় দিকে সুইচ করা হলো" : "বিজয় → অভ্র দিকে সুইচ করা হলো",
    );
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
      if (direction === "u2b") {
        // রিচ-টেক্সট কপি: Word-এ পেস্ট করলে বাংলা SutonnyMJ (বড়) ও
        // ইংরেজি Times New Roman (এক ধাপ ছোট) সাইজ সহ বজায় থাকে
        const parts = outSegments
          .map((seg: { text: string; bangla: boolean }) => {
            const ff = seg.bangla
              ? "SutonnyMJ"
              : '"Times New Roman", Times, serif';
            const sz = seg.bangla ? `${bnPx}px` : `${latPx}px`;
            const esc = seg.text
              .replaceAll("&", "&amp;")
              .replaceAll("<", "&lt;")
              .replaceAll(">", "&gt;");
            return `<span style="font-family:${ff};font-size:${sz}">${esc}</span>`;
          })
          .join("");
        const html = `<div style="font-family:SutonnyMJ;font-size:${bnPx}px">${parts}</div>`;
        const data = [
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([output], { type: "text/plain" }),
          }),
        ];
        await navigator.clipboard.write(data);
      } else {
        await navigator.clipboard.writeText(output);
      }
      setCopied(true);
      toast.success("বিজয় টেক্সট কপি করা হয়েছে (সাইজ ও ফন্টসহ)");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ফলব্যাক: শুধু প্ল্যান টেক্সট
      try {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success("বিজয় টেক্সট কপি করা হয়েছে");
        setTimeout(() => setCopied(false), 1500);
      } catch {
        toast.error("কপি করা যায়নি");
      }
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
    setActiveTab("text");
  };

  /* ── ফাইল কনভার্টার ─────────────────────────────── */
  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = /\.(docx|txt)$/i.test(file.name);
    if (!ok) {
      toast.error("শুধুমাত্র .docx বা .txt ফাইল দিন");
      return;
    }
    setSelectedFile(file);
    setFileResult(null);
  };

  const runFileConvert = async () => {
    if (!selectedFile) {
      toast.info("প্রথমে একটি ফাইল নির্বাচন করুন");
      return;
    }
    setConverting(true);
    try {
      const result = await convertFile(selectedFile, direction);
      if (fileResult) URL.revokeObjectURL(fileResult.url);
      const url = URL.createObjectURL(result.blob);
      setFileResult({ name: result.name, url });
      // ডুয়াল-সাইজ প্রিভিউর জন্য কনভার্টেড টেক্সটের নমুনা —
      // ফাইলের এক্সট্র্যাক্টেড টেক্সটকে সোজা convert() দিয়ে বিজয়ে নিয়ে আসা হয়
      // (যে নিয়মে রান-ফন্ট সিদ্ধান্ত হয়, সেই একই নিয়মে প্রিভিউ দেখে)।
      try {
        const extracted = await extractTextFrom(selectedFile);
        const head = extracted ? extracted.slice(0, 700) : "";
        const previewOutput = head ? convert(head, direction) : "";
        setFilePreviewInput(head);
        setFilePreviewText(previewOutput);
        if (head && previewOutput) {
          addHistoryItem({
            direction,
            input: head,
            output: previewOutput,
            label: `${result.name} · preview`,
          });
        }
      } catch {
        setFilePreviewInput("");
        setFilePreviewText("");
        // File download remains successful even if a preview cannot be indexed.
      }
      toast.success(
        result.kind === "docx"
          ? "ডকুমেন্ট রূপান্তর সম্পন্ন — ফরম্যাটিং অক্ষুণ্ণ"
          : "টেক্সট ফাইল রূপান্তর সম্পন্ন",
      );
    } catch {
      toast.error("ফাইল রূপান্তরে ত্রুটি — ফাইলটি ঠিকমতো .docx/.txt কিনা যাচাই করুন");
    } finally {
      setConverting(false);
    }
  };

  const charCount = input.length;

  const outCharCount = output.length;

  // ── দুই-সাইজ রিচ প্রিভিউ ──
  // বাংলা fontSize(px) SutonnyMJ-তে, ইংরেজি/সংখ্যা 12/14 অনুপাতে ছোটে TNR-তে।
  const basePx = fontSize;
  const bnPx = basePx;
  // ইংরেজি/সংখ্যা ঠিক এক ধাপ ছোট: ১৪px হয়ে ১২px, ২০px হয়ে ১৮px —
  // ratio-এর বদলে স্পষ্ট পদক্ষেপ (step), কমপক্ষে ১০px।
  const latPx = Math.max(basePx - 2, 10);
  // বিউটপুট-কোড সব লাতিন-রেঞ্জ — সেগমেন্ট করা হয় ইউনিকোড ইনপুটের
  // ভাষা অনুযায়ী, যাতে বাংলা ও ইংরেজি আলাদা-আলাদা সাইজ পায়।
  const outSegments: { text: string; bangla: boolean }[] = useMemo(
    () => (direction === "u2b" && input ? mapSegmentsToBijoy(input, direction) : []),
    [direction, input],
  );
  const outPreviewRef = useRef<HTMLDivElement>(null);
  const outAreaRef = useRef<HTMLTextAreaElement>(null);
  const syncScroll = (from: HTMLElement, to: HTMLElement | null) => {
    if (!to) return;
    to.scrollTop = from.scrollTop;
    to.scrollLeft = from.scrollLeft;
  };

  /* ── প্রিভিউ সিলেকশন-স্থায়িত্ব ──
     আউটপুট প্যানেলে HTML রিচ-প্রিভিউয়ের নিচে একটি সম্পূর্ণ অদৃশ্য (কিন্তু
     সিলেক্টযোগ্য) টেক্সট-এরিয়া রাখা হয়েছে। রিচ-প্রিভিউর ওপর ক্লিক/ড্র্যাগ করলে
     তার কার্সার-অবস্থান তৈরি করে এবং অনুরূপ অ্যাংকার-পজিশনে অদৃশ্য টেক্সট-এরিয়ার
     সিলেকশন তৈরি হয় — ফলে সিলেকশন আর উপর-নিচ ঝাঁপিয়ে পড়ে না। */
  // প্রিভিউর ভেতরে কার্সার: (x, y) → অদৃশ্য টেক্সট-এরিয়ার চরিত্র-ইনডেক্স।
  // বিভিন্ন-সাইজ সেগমেন্ট মিলিয়ে ইনডেক্স বের করতে হয়: প্রতিটি সেগমেন্টের
  // <span> নোডের দৈর্ঘ্য/স্থানানুযায়ী অফসেট জমা করে টার্গেট পয়েন্টের সেগমেন্ট
  // ও তার ভেতরে অফসেট নির্ণয় করা হয়।
  const previewPointToIndex = (x: number, y: number): number => {
    const el = outAreaRef.current;
    if (!el) return 0;
    // (১) ডকুমেন্ট কার্সার-রেঞ্জ দিয়ে টার্গেট নোড+অফসেট পাই
    let range: Range | null = null;
    try {
      const r = document.caretRangeFromPoint ? document.caretRangeFromPoint(x, y) : null;
      if (r) range = r;
    } catch {
      range = null;
    }
    if (range) {
      let cur: Node | null = range.startContainer;
      while (cur) {
        if (cur === outPreviewRef.current) break;
        cur = cur.parentNode;
      }
      if (cur === outPreviewRef.current) {
        // (২) টার্গেট <span> সেগমেন্টটি খুঁজে জমা-দৈর্ঘ্যে ইনডেক্স বানাই
        const off = range.startOffset;
        let acc = 0;
        for (const seg of outSegments) {
          if (acc + seg.text.length >= off) {
            return Math.min(el.value.length, acc + (off - acc));
          }
          acc += seg.text.length;
        }
        return Math.min(el.value.length, acc);
      }
    }
    // (৩) রেঞ্জ পাওয়া না গেলে স্ক্রিন-অবস্থান অনুযায়ী সেগমেন্ট-ভিত্তিক অনুমান
    if (!outPreviewRef.current) return 0;
    const rect = outPreviewRef.current.getBoundingClientRect();
    let acc = 0;
    let yAcc = 0;
    const lineHeight = bnPx * 1.7;
    const targetY = y - rect.top + outPreviewRef.current.scrollTop;
    for (const seg of outSegments) {
      const lines = Math.max(1, Math.ceil(seg.text.length / ((rect.width - 24) / (bnPx * 0.6))));
      const segH = lines * lineHeight;
      if (yAcc + segH > targetY) {
        const yInSeg = Math.max(0, targetY - yAcc);
        const frac = Math.min(1, yInSeg / segH);
        return Math.min(el.value.length, acc + Math.round(frac * seg.text.length));
      }
      yAcc += segH;
      acc += seg.text.length;
    }
    return Math.min(el.value.length, acc);
  };
  // রিচ-প্রিভিউতে দৃশ্যমান হাইলাইট — হিডেন টেক্সট-এরিয়ার সিলেকশনের সাথে সিঙ্ক
  const [outSel, setOutSel] = useState<{ start: number; end: number } | null>(null);
  useEffect(() => {
    const onSelectionChange = () => {
      const el = outAreaRef.current;
      if (!el || document.activeElement !== el) {
        setOutSel(null);
        return;
      }
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      if (start === end) {
        setOutSel(null);
      } else {
        setOutSel({ start: Math.min(start, end), end: Math.max(start, end) });
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);
  // সেগমেন্ট-তালিকা → হাইলাইট-সহ রেন্ডার রূপ (sel ইনডেক্সগুলো বিস্তৃত টেক্সটে)
  const renderRichSegments = () => {
    const sel = outSel;
    const nodes: React.ReactNode[] = [];
    let acc = 0;
    outSegments.forEach((seg, i) => {
      const segStart = acc;
      const segEnd = acc + seg.text.length;
      acc = segEnd;
      let lo = segStart;
      let hi = segEnd; // সেলেক্টেড রঞ্জ বিস্তৃত টেক্সটে [sel.start, sel.end)
      let curStart = segStart;
      if (!sel || hi <= sel.start || lo >= sel.end) {
        // এই সেগমেন্টে সেলেকশন নেই
        nodes.push(
          <span key={i} className={seg.bangla ? "seg-bn" : "seg-lat"} style={{ fontSize: seg.bangla ? `${bnPx}px` : `${latPx}px` }}>{seg.text}</span>,
        );
        return;
      }
      const selLo = Math.max(sel.start, lo);
      const selHi = Math.min(sel.end, hi);
      // তিন ভাগ: পূর্ব / সেলেক্টেড / পর
      if (curStart < selLo) nodes.push(
        <span key={`${i}-a`} className={seg.bangla ? "seg-bn" : "seg-lat"} style={{ fontSize: seg.bangla ? `${bnPx}px` : `${latPx}px` }}>{seg.text.slice(0, selLo - curStart)}</span>,
      );
      nodes.push(
        <mark key={`${i}-b`} className="!bg-primary/25 !text-inherit rounded-[2px] px-0 py-0">{seg.text.slice(selLo - curStart, selHi - curStart)}</mark>,
      );
      if (selHi < curStart + seg.text.length) nodes.push(
        <span key={`${i}-c`} className={seg.bangla ? "seg-bn" : "seg-lat"} style={{ fontSize: seg.bangla ? `${bnPx}px` : `${latPx}px` }}>{seg.text.slice(selHi - curStart)}</span>,
      );
    });
    return nodes;
  };
  const previewMouseDown = (e: React.MouseEvent) => {
    if (direction !== "u2b") return;
    const el = outAreaRef.current;
    if (!el) return;
    const idx = previewPointToIndex(e.clientX, e.clientY);
    // প্রথম ক্লিকে ফোকাস নিতে দিই (ড্র্যাগ-রানের জন্য), ক্লিকের পরে শুরু-পজিশন
    // পুনরায় বসাই — ফলে ড্র্যাগ করলে সিলেকশন আর উপর-নিচ ঝাঁপিয়ে পড়ে না।
    el.focus();
    el.setSelectionRange(idx, idx);
  };
  const previewMouseMove = (e: React.MouseEvent) => {
    if (direction !== "u2b") return;
    if (e.buttons !== 1) return;
    const el = outAreaRef.current;
    if (!el) return;
    const idx = previewPointToIndex(e.clientX, e.clientY);
    // ড্র্যাগ-রান: ক্লিক-পয়েন্ট থেকে কারেন্ট-পয়েন্ট পর্যন্ত
    el.setSelectionRange(
      Math.min(el.selectionStart ?? idx, idx),
      Math.max(el.selectionEnd ?? idx, idx),
    );
  };
  const previewMouseUp = () => {
    if (direction !== "u2b") return;
    const el = outAreaRef.current;
    if (!el) return;
    // ক্লিক-মাত্র হলে (কোনো সিলেকশন নেই) কার্সার অবস্থানটুকুই ধরে রাখা হয়
    if (el.selectionStart === el.selectionEnd) {
      el.setSelectionRange(el.selectionStart, el.selectionStart);
    }
  };

  function adjustFontSize(delta: number) {
    setFontSize((s) => {
      const next = Math.min(32, Math.max(12, s + delta));
      localStorage.setItem("abc-font-size", String(next));
      return next;
    });
  }

  return (
    <div className="app-shell min-h-screen flex flex-col bg-background">
      {/* হেডার — গভীর টিল */}
      <header className="site-header relative overflow-hidden bg-primary text-primary-foreground">
        {/* ⇄ মোটিফ ব্যাকগ্রাউন্ড */}
        <div
          className="site-header__motif pointer-events-none absolute inset-y-0 right-0 flex items-center opacity-[0.07]"
          aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="select-none text-5xl font-black tracking-tight md:text-7xl">
              ⇄
            </span>
          ))}
        </div>
        <div className="site-header__inner container relative flex items-center justify-between py-4">
          <div className="site-brand flex items-center gap-3">
            <a
              href="/"
              aria-label="অভ্র ⇄ বিজয় কনভার্টারের হোম"
              className="group/logo relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/95 p-1 shadow-inner transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none md:h-14 md:w-14"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300 group-hover/logo:border-accent/70 group-focus-visible/logo:border-accent/70 motion-reduce:transition-none"
              />
              <img
                src="/manus-storage/avro-bijoy-letter-pairs_c859b208.png"
                alt="A ও অ থেকে B ও ব-তে রূপান্তরের চিহ্ন"
                className="relative h-full w-full object-contain transition-transform duration-300 ease-out group-hover/logo:rotate-[1.5deg] group-focus-visible/logo:rotate-[1.5deg] motion-reduce:transform-none motion-reduce:transition-none"
              />
            </a>
            <div className="site-brand__copy">
              <h1 className="site-brand__title text-lg font-extrabold leading-tight tracking-tight md:text-2xl">
                অভ্র ⇄ বিজয় কনভার্টার
              </h1>
              <p className="site-brand__subtitle mt-0.5 text-xs opacity-85 md:text-sm">
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

      <main className="app-main container flex-1">
        {/* প্রোমোট শিরোনাম */}
        <div className="hero-panel mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="hero-panel__copy">
            <p className="eyebrow">Bangla typography workspace</p>
            <h2 className="hero-title text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              অভ্রে লিখুন, বিজয়ে নিন
            </h2>
            <p className="hero-summary mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
              সোলাইমান লিপি / কালপুরুষ টেক্সট সঠিক যুক্তাক্ষর, য়, ড়, ঢ়,
              র-ফলা এবং দাঁড়ি (।) সহ বিজয় (সুতন্নী এমজে) ফন্টে
              রূপান্তর হয় — মিশ্র টেক্সটে ইংরেজি Times New Roman-এ রাখা হয়।
            </p>
          </div>
          <div className="hero-panel__actions">
            <div className="status-puck">
              <span className="status-puck__dot" />
              লাইভ কনভার্সন সক্রিয়
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hero-example border-primary/30 text-primary hover:bg-accent"
              onClick={loadExample}>
              উদাহরণ দেখুন
            </Button>
          </div>
        </div>

        {/* ট্যাব সুইচার */}
        <div className="workspace-tabs mb-5 flex items-center gap-1.5 rounded-full border bg-card p-1.5 shadow-sm w-fit">
          <Button
            variant={activeTab === "text" ? "default" : "ghost"}
            size="sm"
            className={
              activeTab === "text"
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted"
            }
            onClick={() => setActiveTab("text")}>
            <FileText className="mr-1.5 h-4 w-4" />
            টেক্সট কনভার্টার
          </Button>
          <Button
            variant={activeTab === "file" ? "default" : "ghost"}
            size="sm"
            className={
              activeTab === "file"
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted"
            }
            onClick={() => setActiveTab("file")}>
            <Upload className="mr-1.5 h-4 w-4" />
            ফাইল কনভার্টার
          </Button>
        </div>

        {activeTab === "text" ? (
        <>
        {/* কনভার্টার কার্ড */}
        <div className="workspace-card converter-card overflow-hidden rounded-2xl border bg-card shadow-lg">
          {/* দিক টগল বার */}
          <div className="converter-toolbar flex flex-wrap items-center justify-between gap-2 border-b bg-secondary/60 px-4 py-3">
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
                {direction === "u2b" ? "বিজয় → অভ্র" : "অভ্র → বিজয়"}
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
            <div className="editor-pane editor-pane--input flex flex-col border-b md:border-b-0 md:border-r">
              <div className="editor-pane__header flex items-center justify-between border-b border-border/70 bg-muted/50 px-4 py-2.5">
                <span className="text-sm font-semibold text-foreground">
                  {direction === "u2b"
                    ? "অভ্র টেক্সট (ইউনিকোড)"
                    : "বিজয় টেক্সট (সুতন্নী এমজে)"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {charCount} অক্ষর
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:bg-accent"
                    aria-label="ফন্ট ছোট করুন"
                    onClick={() => adjustFontSize(-2)}>
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-7 text-center text-xs tabular-nums text-muted-foreground">
                    {fontSize}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:bg-accent"
                    aria-label="ফন্ট বড় করুন"
                    onClick={() => adjustFontSize(2)}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
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
                  style={{ fontSize: `${fontSize}px` }}
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

            <div className="editor-pane editor-pane--output flex flex-col">
              <div className="editor-pane__header flex items-center justify-between border-b bg-muted/50 px-4 py-2.5">
                <span className="text-sm font-semibold text-muted-foreground">
                  {direction === "u2b"
                    ? "বিজয় আউটপুট (সুতন্নী এমজে)"
                    : "অভ্র আউটপুট (ইউনিকোড)"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {outCharCount} অক্ষর
                </span>
                {direction === "u2b" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-xs font-medium text-primary underline decoration-dotted underline-offset-2">
                        কোড যাচাই
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs whitespace-pre-line text-xs" sideOffset={8}>
                      প্রতিটি নতুন শব্দের শুরুর এ-কার (ে) → SutonnyMJ-এ U+2020 (†) — ছোট লেডিঙ মাত্রা ছাড়াই; একই শব্দের মাঝে এ-কার → U+2021 (‡) — মাত্রাসহ। উদাহরণ: রেল = † + i + j, কেন = † + K + b; 'এখন রেল এখন' = GLb †ij GLb। ওয়ার্ডে SutonnyMJ ফন্টে পেস্ট করলে নির্ভুল দেখায়।
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="relative">
                <Textarea
                  ref={outAreaRef}
                  value={output}
                  readOnly={isLive}
                  onChange={(e) => {
                    setIsLive(false);
                    setOutput(e.target.value);
                  }}
                  onScroll={(e) => syncScroll(e.currentTarget, outPreviewRef.current)}
                  placeholder="রূপান্তরিত টেক্সট এখানে দেখাবে..."
                    className={
                    "min-h-[320px] resize-none rounded-none border-0 shadow-none focus-visible:ring-0 " +
                    (direction === "u2b"
                      ? "font-output-bijoy"
                      : "font-input-bn") +
                    (direction === "u2b" ? " absolute inset-0 text-transparent caret-transparent abc-no-native-sel" : "")
                  }
                  style={{ fontSize: `${fontSize}px` }}
                  aria-hidden={direction === "u2b"}
                  tabIndex={direction === "u2b" ? 0 : 0}
                />
                {direction === "u2b" && (
                  <div
                    ref={outPreviewRef}
                    className="bijoy-rich min-h-[320px] select-text px-3 py-2"
                    style={{ fontSize: `${bnPx}px` }}
                    onScroll={(e) => syncScroll(e.currentTarget, outAreaRef.current)}
                    onMouseDown={previewMouseDown}
                    onMouseMove={previewMouseMove}
                    onMouseUp={previewMouseUp}>
                    {renderRichSegments()}
                  </div>
                )}
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
                  কপি করে Word-এ SutonnyMJ ফন্টে পেস্ট করুন
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
                SutonnyMJ
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
              বাংলা দাঁড়ি (।) বিজয়ে সোজা দাঁড়ি-স্ট্রোক গ্লিফে
              রূপান্তর হয় — ম-ফলা বা ক্র-এর মতো দেখায় না।
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
              &quot;কপি&quot; বাটনে ক্লিক করুন এবং Word/Publisher-এ SutonnyMJ
              ফন্ট সিলেক্ট করে পেস্ট করুন।
            </li>
            <li>
              কম্পিউটারে SutonnyMJ ফন্ট ইনস্টল না থাকলে আউটপুট বাংলা
              দেখাবে না — এটি স্বাভাবিক, কপি করা টেক্সট সঠিকই থাকবে।
            </li>
          </ol>
        </div>
        </>
        ) : (
        /* ফাইল কনভার্টার প্যানেল */
        <div className="overflow-hidden rounded-2xl border bg-card shadow-lg">
          <div className="border-b bg-secondary/60 px-4 py-3">
            <h3 className="text-base font-bold text-foreground">
              ডকুমেন্ট রূপান্তর — .docx / .txt
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              বোল্ড, ইটালিক, ফুটনোট, এন্ডনোট ও ফন্ট-স্টাইল অক্ষুণ্ণ
              রাখা হয়; বাংলা SutonnyMJ-তে ও ইংরেজি Times New Roman-এ
              রূপান্তর হয়।
            </p>
          </div>
          <div className="px-4 py-6">
            <div className="mx-auto max-w-xl">
              {/* দিক সিলেকশন */}
              <div className="mb-4 flex items-center justify-center gap-1.5 rounded-full border bg-secondary/50 p-1">
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    direction === "u2b"
                      ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                      : "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted"
                  }
                  onClick={() => setDirection("u2b")}>
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
                  বিজয় → অভ্র
                </Button>
              </div>

              {/* ফাইল সিলেকশন এরিয়া */}
              <label
                htmlFor="file-upload"
                className={
                  "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors " +
                  (selectedFile
                    ? "border-primary/60 bg-primary/5"
                    : "border-border bg-muted/40 hover:border-primary/40 hover:bg-muted/70")
                }>
                <Upload
                  className={
                    "mb-3 h-8 w-8 " +
                    (selectedFile ? "text-primary" : "text-muted-foreground")
                  }
                />
                {selectedFile ? (
                  <>
                    <p className="font-semibold text-foreground break-all">
                      {selectedFile.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB — পরিবর্তন
                      করতে হলে আবার ক্লিক করুন
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-foreground">
                      এখানে ক্লিক করে ফাইল নির্বাচন করুন
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      .docx (Word) বা .txt — সর্বোচ্চ 20 MB
                    </p>
                  </>
                )}
              </label>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept=".docx,.txt,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                onChange={onFileSelected}
              />

              {/* রূপান্তর + ডাউনলোড */}
              <div className="mt-5 flex flex-col items-center gap-3">
                <Button
                  size="lg"
                  disabled={!selectedFile || converting}
                  className="h-12 min-w-56 text-base font-semibold shadow-md disabled:opacity-50"
                  onClick={runFileConvert}>
                  {converting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      রূপান্তর হচ্ছে...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="mr-2 h-5 w-5" />
                      ফাইল রূপান্তর করুন
                    </>
                  )}
                </Button>
                {fileResult && (
                  <a
                    href={fileResult.url}
                    download={fileResult.name}
                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white shadow-md transition-transform hover:bg-emerald-700 active:scale-[0.97]">
                    <Download className="h-4 w-4" />
                    ডাউনলোড করুন — {fileResult.name}
                  </a>
                )}
              </div>

              {/* ফাইলের কনভার্টেড টেক্সট নমুনা — ডুয়াল-সাইজ: বাংলা বড্ড,
                  ইংরেজি এক ধাপ ছোট (12/14 নিয়ম) */}
              {direction === "u2b" && filePreviewText && (
                <div className="mt-5 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      নমুনা প্রিভিউ — বাংলা বড়, ইংরেজি এক ধাপ ছোট
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div
                    className="bijoy-rich max-h-48 overflow-y-auto rounded-lg border bg-accent/30 px-3 py-2"
                    style={{ fontSize: `${bnPx}px` }}>
                    {mapSegmentsToBijoy(filePreviewInput, direction).map(
                      (
                        seg: { text: string; bangla: boolean },
                        i: number,
                      ) => (
                        <span
                          key={i}
                          className={seg.bangla ? "seg-bn" : "seg-lat"}
                          style={{
                            fontSize: seg.bangla
                              ? `${bnPx}px`
                              : `${latPx}px`,
                          }}>
                          {seg.text}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              <p className="mt-4 text-center text-xs text-muted-foreground">
                রূপান্তর করা হয় — প্রতিটি টেক্সট-রানের ফন্ট SutonnyMJ (বাংলা)
                / Times New Roman (ইংরেজি) হয়ে যায়; বোল্ড, ইটালিক ও
                ফুটনোট-রেফারেন্স অপরিবর্তিত থাকে।
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Recent conversion history — local-only, দ্রুত পুনর্ব্যবহারযোগ্য */}
        <section
          className="recent-history mt-7 pb-2"
          aria-labelledby="recent-history-title">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HistoryIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="recent-history-title"
                    className="text-lg font-extrabold tracking-tight text-foreground">
                    Recent conversion history
                  </h2>
                  {history.length > 0 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                      {history.length}/ {MAX_HISTORY_ITEMS}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  আপনার সাম্প্রতিক রূপান্তরগুলো এই ডিভাইসেই থাকে
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={clearHistory}>
                <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                সব মুছুন
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-card/70 px-5 py-8 text-center">
              <Clock3 className="mx-auto h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold text-foreground">
                এখনো কোনো conversion history নেই
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                একটি রূপান্তর সম্পন্ন করলে সেটি এখানে দ্রুত ব্যবহারের জন্য দেখা যাবে।
              </p>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {history.map((item) => {
                const inputClass =
                  item.direction === "u2b" ? "font-input-bn" : "font-output-bijoy";
                const outputClass =
                  item.direction === "u2b" ? "font-output-bijoy" : "font-input-bn";
                return (
                  <article
                    key={item.id}
                    className="group rounded-2xl border bg-card p-4 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                          <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-sm font-bold text-foreground">
                              {item.direction === "u2b"
                                ? "অভ্র → বিজয়"
                                : "বিজয় → অভ্র"}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {formatHistoryTime(item.createdAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {item.label}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground opacity-70 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                        onClick={() => removeHistoryItem(item.id)}
                        aria-label="এই history মুছুন">
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="min-w-0 rounded-xl border bg-muted/35 px-3 py-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          ইনপুট
                        </p>
                        <p className={`mt-1 truncate text-sm text-foreground ${inputClass}`}>
                          {compactHistoryText(item.input)}
                        </p>
                      </div>
                      <div className="min-w-0 rounded-xl border bg-accent/35 px-3 py-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          আউটপুট
                        </p>
                        <p className={`mt-1 truncate text-sm text-foreground ${outputClass}`}>
                          {compactHistoryText(item.output)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
                      <span className="text-xs text-muted-foreground">
                        {item.input.length.toLocaleString("bn-BD")} অক্ষর
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/25 text-primary hover:bg-accent"
                        onClick={() => reuseHistoryItem(item)}>
                        <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                        আবার ব্যবহার করুন
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
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
