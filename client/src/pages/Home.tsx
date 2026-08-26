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
  ArrowRight,
  ArrowRightLeft,
  ClipboardCopy,
  ClipboardPaste,
  Eraser,
  Sun,
  Check,
  ArrowDownUp,
  Minus,
  Plus,
  Printer,
  History as HistoryIcon,
  RotateCcw,
  Trash2,
  Clock3,
  X,
  Moon,
  Bookmark,
  HeartHandshake,
  MessageCircle,
  Share2,
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
  repairBijoyFontFile,
} from "@/lib/converter";
import { Download, FileText, Upload, Loader2 } from "lucide-react";
import { useRef as useFileRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";

const EXAMPLE_TEXT = `বিষয়: বাংলা নথির টাইপসেটিং ও রূপান্তর-সহায়তা

মো. হাবিবুল্লাহ নাঈম
বাংলা বিভাগ, রাজশাহী বিশ্ববিদ্যালয়
আইডি: ২০১০৮০৪১২৭

বাংলা প্রতিবেদন, গবেষণাপত্র কিংবা প্রকাশনার খসড়া প্রস্তুতের সময় ইউনিকোড/অভ্র লেখা থেকে বিজয় (SutonnyMJ) ফরম্যাটে রূপান্তর একটি গুরুত্বপূর্ণ ধাপ। অভ্রজয় ব্যবহার করে যুক্তাক্ষর, কারচিহ্ন ও যতিচিহ্নসহ সম্পূর্ণ লেখা একসঙ্গে রূপান্তর করা যায়—যেমন: শান্ত, উল্লাস, শ্রেণি, বিজ্ঞান, ব্রাহ্মণ, আকাঙ্ক্ষা, গাঢ় এবং ঋতু।

নথিতে বাংলা ও English একসঙ্গে থাকলেও কাজটি স্বচ্ছন্দ থাকে। উদাহরণ হিসেবে, “বাংলা ভাষা—একটি জীবন্ত ঐতিহ্য।” এই বাক্যের পাশে Office Memo 2026, Version 2.0 এবং 13টি reference রাখা যেতে পারে। DOCX/TXT ফাইল আপলোড করে রূপান্তরিত ফলাফল যাচাই, কপি অথবা print/PDF preview-তে নেওয়া যায়।

প্রকাশনার আগে দাঁড়ি, ডাবল-দাঁড়ি॥, কমা, সেমিকোলন; বন্ধনী (যেমন এই অংশ), single quote 'এবং' এবং ড্যাশ—সব যতিচিহ্ন একবার দেখে নেওয়া ভালো। Word-এ পেস্ট করার পর বাংলা অংশে SutonnyMJ এবং English অংশে Times New Roman ব্যবহার করলে নথির আকার ও পাঠযোগ্যতা সুসংগত থাকে।

এই নমুনাটি ব্যবহার করে আপনার নিজের চিঠি, অফিস-স্মারক, গবেষণার সারাংশ বা প্রকাশনা-উপযোগী বাংলা খসড়া দ্রুত পরীক্ষা করুন।`;

const HISTORY_STORAGE_KEY = "abc-recent-conversions";
const MAX_HISTORY_ITEMS = 6;
const BRAND_LOGO_SRC = "/manus-storage/bangla-converter-exact-reference-logo_2f0bb0ec.png";
const INSTALL_PROMPT_DISMISSED_KEY = "avrojoy-install-prompt-dismissed";
const DECORATIVE_GLYPHS = [
  "অ", "আ", "ই", "ঈ", "উ", "ক", "খ", "গ", "ঘ", "চ", "ছ", "ত",
  "থ", "ন", "প", "ফ", "ব", "ম", "র", "ল", "শ", "স", "হ",
] as const;

type ConversionHistoryItem = {
  id: string;
  direction: ConvertDirection;
  input: string;
  output: string;
  label: string;
  createdAt: number;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
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

const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const currentCopyrightYear = new Intl.DateTimeFormat("bn-BD", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [direction, setDirection] = useState<ConvertDirection>("u2b");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [supportNumberCopied, setSupportNumberCopied] = useState(false);
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
  const [filePrintInput, setFilePrintInput] = useState("");
  const [filePrintText, setFilePrintText] = useState("");
  const [filePrintDirection, setFilePrintDirection] = useState<ConvertDirection | null>(null);
  const [isFileDragActive, setIsFileDragActive] = useState(false);
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [pwaReady, setPwaReady] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Private browsing/storage-restricted environments should not block conversion.
    }
  }, [history]);

  useEffect(() => {
    const syncOnlineState = () => setIsOnline(navigator.onLine);
    const syncStandaloneState = () => {
      const standalone = window.matchMedia("(display-mode: standalone)").matches;
      setIsStandalone(
        standalone || Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
      );
    };
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      try {
        if (!localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY)) {
          setShowInstallPrompt(true);
        }
      } catch {
        setShowInstallPrompt(true);
      }
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsStandalone(true);
      setShowInstallPrompt(false);
      try {
        localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "installed");
      } catch {
        // Storage-restricted environments should still allow installation.
      }
      toast.success("অভ্রজয় অফলাইন অ্যাপ হিসেবে ইনস্টল হয়েছে");
    };
    const markPwaReady = () => setPwaReady(true);

    syncOnlineState();
    syncStandaloneState();
    const installPromptTimer = window.setTimeout(() => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
      if (standalone) return;
      try {
        if (!localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY)) {
          setShowInstallPrompt(true);
        }
      } catch {
        setShowInstallPrompt(true);
      }
    }, 1400);
    window.addEventListener("online", syncOnlineState);
    window.addEventListener("offline", syncOnlineState);
    window.addEventListener("resize", syncStandaloneState);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("avrojoy:pwa-registered", markPwaReady);

    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(markPwaReady).catch(() => undefined);
    }

    return () => {
      window.clearTimeout(installPromptTimer);
      window.removeEventListener("online", syncOnlineState);
      window.removeEventListener("offline", syncOnlineState);
      window.removeEventListener("resize", syncStandaloneState);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("avrojoy:pwa-registered", markPwaReady);
    };
  }, []);

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
    toast.success("সাম্প্রতিক রূপান্তরের ইতিহাস মুছে ফেলা হয়েছে");
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
    const copySuccessMessage =
      direction === "u2b"
        ? "কনভার্টেড বিজয় টেক্সট কপি হয়েছে — Copy to Clipboard"
        : "কনভার্টেড ইউনিকোড টেক্সট কপি হয়েছে — Copy to Clipboard";
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
      toast.success(copySuccessMessage);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ফলব্যাক: শুধু প্ল্যান টেক্সট
      try {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success(copySuccessMessage);
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

  const copySupportNumber = async () => {
    const supportNumber = "01601599355";
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(supportNumber);
      } else {
        const copyField = document.createElement("textarea");
        copyField.value = supportNumber;
        copyField.setAttribute("readonly", "");
        copyField.style.position = "fixed";
        copyField.style.opacity = "0";
        document.body.appendChild(copyField);
        copyField.select();
        const copiedWithFallback = document.execCommand("copy");
        document.body.removeChild(copyField);
        if (!copiedWithFallback) throw new Error("Clipboard fallback failed");
      }
      setSupportNumberCopied(true);
      toast.success("নম্বরটি ক্লিপবোর্ডে কপি হয়েছে");
      setTimeout(() => setSupportNumberCopied(false), 1500);
    } catch {
      toast.error("নম্বরটি কপি করা যায়নি");
    }
  };

  const shareSite = async () => {
    const shareUrl = window.location.origin;
    const shareData = {
      title: "অভ্রজয় (AvroJoy) — অভ্র ⇄ বিজয় কনভার্টার",
      text: "অভ্র/ইউনিকোড ⇄ বিজয় রূপান্তরের জন্য অভ্রজয় ব্যবহার করুন।",
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("শেয়ার করা হয়েছে");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const copyField = document.createElement("textarea");
        copyField.value = shareUrl;
        copyField.setAttribute("readonly", "");
        copyField.style.position = "fixed";
        copyField.style.opacity = "0";
        document.body.appendChild(copyField);
        copyField.select();
        const copiedWithFallback = document.execCommand("copy");
        document.body.removeChild(copyField);
        if (!copiedWithFallback) throw new Error("Clipboard fallback failed");
      }
      toast.success("সাইটের লিংক ক্লিপবোর্ডে কপি হয়েছে");
    } catch {
      toast.error("লিংক কপি করা যায়নি");
    }
  };

  const loadExample = () => {
    setInput(EXAMPLE_TEXT);
    setActiveTab("text");
  };

  /* ── ফাইল কনভার্টার ─────────────────────────────── */
  const acceptFile = (file?: File) => {
    if (!file) return;
    const ok = /\.(docx|txt)$/i.test(file.name);
    if (!ok) {
      toast.error("শুধুমাত্র .docx বা .txt ফাইল দিন");
      return;
    }
    if (fileResult) URL.revokeObjectURL(fileResult.url);
    setSelectedFile(file);
    setFileResult(null);
    setFilePreviewInput("");
    setFilePreviewText("");
    setFilePrintInput("");
    setFilePrintText("");
    setFilePrintDirection(null);
    setPrintPreviewOpen(false);
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
  };

  const handleFileDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragActive(true);
  };

  const handleFileDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsFileDragActive(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragActive(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const clearSelectedFile = () => {
    if (fileResult) URL.revokeObjectURL(fileResult.url);
    setSelectedFile(null);
    setFileResult(null);
    setFilePreviewInput("");
    setFilePreviewText("");
    setFilePrintInput("");
    setFilePrintText("");
    setFilePrintDirection(null);
    setPrintPreviewOpen(false);
    setIsFileDragActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("ফাইল সরানো হয়েছে");
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
        const convertedFull = extracted ? convert(extracted, direction) : "";
        setFilePrintInput(extracted);
        setFilePrintText(convertedFull);
        setFilePrintDirection(direction);
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
        setFilePrintInput("");
        setFilePrintText("");
        setFilePrintDirection(null);
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

  const runBijoyFontRepair = async () => {
    if (!selectedFile) {
      toast.info("প্রথমে একটি Word DOCX ফাইল নির্বাচন করুন");
      return;
    }
    if (!/\.docx$/i.test(selectedFile.name)) {
      toast.error("ফন্ট মেরামত শুধু .docx ফাইলের জন্য প্রযোজ্য");
      return;
    }
    setConverting(true);
    try {
      const result = await repairBijoyFontFile(selectedFile);
      if (fileResult) URL.revokeObjectURL(fileResult.url);
      const url = URL.createObjectURL(result.blob);
      setFileResult({ name: result.name, url });
      setFilePreviewInput("");
      setFilePreviewText("");
      setFilePrintInput("");
      setFilePrintText("");
      setFilePrintDirection(null);
      toast.success("Bijoy font mapping মেরামত সম্পন্ন — text অপরিবর্তিত রাখা হয়েছে");
    } catch {
      toast.error("ফন্ট মেরামত করা যায়নি — ফাইলটি বৈধ .docx কিনা যাচাই করুন");
    } finally {
      setConverting(false);
    }
  };

  const charCount = input.length;

  const outCharCount = output.length;

  // UX-only metrics: conversion bytes, font rendering and file pipelines never read or modify these values.
  const getTextMetrics = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return { words: 0, paragraphs: 0 };

    return {
      words: trimmed.split(/\s+/).length,
      // A blank line starts a new paragraph; wrapped lines remain one paragraph.
      paragraphs: trimmed.split(/\r?\n\s*\r?\n/).filter(Boolean).length,
    };
  };

  const inputMetrics = useMemo(() => getTextMetrics(input), [input]);
  const outputMetrics = useMemo(() => getTextMetrics(output), [output]);

  const filePrintSegments = useMemo(() => {
    if (!filePrintText || !filePrintDirection) return [];
    return filePrintDirection === "u2b"
      ? mapSegmentsToBijoy(filePrintInput, filePrintDirection)
      : segmentBijoyText(filePrintText);
  }, [filePrintDirection, filePrintInput, filePrintText]);

  const openPrintPreview = () => {
    if (!filePrintText) {
      toast.info("প্রথমে একটি ফাইল রূপান্তর করুন");
      return;
    }
    setPrintPreviewOpen(true);
  };

  const printPreview = () => {
    if (!filePrintText) return;
    window.setTimeout(() => window.print(), 50);
  };

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
  // word-initial e-kar marker (U+2020), mid-word e-kar marker (U+2021) এবং
  // রেফারেন্সের সিংগেল-কোট ক্লোজার (U+00D5) legacy glyph। র-কারের U+2026/U+201E
  // byte-গুলো কখনো আলাদা span-এ ভাঙা হয় না — SutonnyMJ-এর native spacing-ই সঠিক।
  const renderBijoyText = (
    text: string,
    className: string,
    size: number,
    keyPrefix: string,
  ) => {
    // U+00D5 একই সঙ্গে reference-এর closing quote এবং word-internal apostrophe
    // হতে পারে। শুধু U+00D4-র সঙ্গে জোড়া reference-closing quote চিহ্নিত করি;
    // apostrophe-এর appearance, copy ও raw code সম্পূর্ণ অপরিবর্তিত থাকে।
    const referenceCloseOffsets = new Set<number>();
    let unmatchedSingleQuoteOpens = 0;
    const isLegacyWordByte = (value: string) => /[A-Za-z0-9]/.test(value);
    for (let offset = 0; offset < text.length; offset += 1) {
      const character = text[offset];
      if (character === "Ô") {
        unmatchedSingleQuoteOpens += 1;
        continue;
      }
      if (character !== "Õ") continue;

      const previous = offset > 0 ? text[offset - 1] : "";
      const next = offset + 1 < text.length ? text[offset + 1] : "";
      const isWordInternalApostrophe =
        isLegacyWordByte(previous) && isLegacyWordByte(next);
      if (!isWordInternalApostrophe && unmatchedSingleQuoteOpens > 0) {
        referenceCloseOffsets.add(offset);
        unmatchedSingleQuoteOpens -= 1;
      }
    }

    let offset = 0;
    return text.split(/(†|‡|Õ)/g).map((part, index) => {
      const partOffset = offset;
      offset += part.length;
      if (!part) return null;

      const tokenClassName =
        part === "†"
          ? `${className} bijoy-ekar-initial`
          : part === "‡"
            ? `${className} bijoy-ekar-mid`
            : part === "Õ" && referenceCloseOffsets.has(partOffset)
              ? `${className} bijoy-quote-close`
              : className;

      return (
        <span
          key={`${keyPrefix}-${index}`}
          className={tokenClassName}
          style={{ fontSize: `${size}px` }}>
          {part}
        </span>
      );
    });
  };
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
          ...renderBijoyText(
            seg.text,
            seg.bangla ? "seg-bn" : "seg-lat",
            seg.bangla ? bnPx : latPx,
            `${i}-plain`,
          ),
        );
        return;
      }
      const selLo = Math.max(sel.start, lo);
      const selHi = Math.min(sel.end, hi);
      // তিন ভাগ: পূর্ব / সেলেক্টেড / পর
      if (curStart < selLo)
        nodes.push(
          ...renderBijoyText(
            seg.text.slice(0, selLo - curStart),
            seg.bangla ? "seg-bn" : "seg-lat",
            seg.bangla ? bnPx : latPx,
            `${i}-a`,
          ),
        );
      nodes.push(
        <mark key={`${i}-b`} className="!bg-primary/25 !text-inherit rounded-[2px] px-0 py-0">
          {renderBijoyText(
            seg.text.slice(selLo - curStart, selHi - curStart),
            seg.bangla ? "seg-bn" : "seg-lat",
            seg.bangla ? bnPx : latPx,
            `${i}-b`,
          )}
        </mark>,
      );
      if (selHi < curStart + seg.text.length)
        nodes.push(
          ...renderBijoyText(
            seg.text.slice(selHi - curStart),
            seg.bangla ? "seg-bn" : "seg-lat",
            seg.bangla ? bnPx : latPx,
            `${i}-c`,
          ),
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

  const copySelectedPreview = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (direction !== "u2b") return;
    const selection = window.getSelection();
    const preview = outPreviewRef.current;
    if (!selection || selection.isCollapsed || !preview) return;
    const anchor = selection.anchorNode;
    const focus = selection.focusNode;
    if (!anchor || !focus || !preview.contains(anchor) || !preview.contains(focus)) return;

    const fragment = selection.getRangeAt(0).cloneContents();
    const wrapper = document.createElement("div");
    wrapper.appendChild(fragment);
    wrapper.querySelectorAll<HTMLElement>(".seg-bn").forEach((node) => {
      node.style.fontFamily = "SutonnyMJ";
      node.style.fontSize = `${bnPx}px`;
    });
    wrapper.querySelectorAll<HTMLElement>(".seg-lat").forEach((node) => {
      node.style.fontFamily = '"Times New Roman", Times, serif';
      node.style.fontSize = `${latPx}px`;
    });

    e.preventDefault();
    e.clipboardData.setData("text/plain", selection.toString());
    e.clipboardData.setData(
      "text/html",
      `<div style="font-family:SutonnyMJ;font-size:${bnPx}px">${wrapper.innerHTML}</div>`,
    );
    setCopied(true);
    toast.success("নির্বাচিত বিজয় টেক্সট কপি করা হয়েছে");
    window.setTimeout(() => setCopied(false), 1500);
  };

  function adjustFontSize(delta: number) {
    setFontSize((s) => {
      const next = Math.min(32, Math.max(12, s + delta));
      localStorage.setItem("abc-font-size", String(next));
      return next;
    });
  }

  const installApp = async () => {
    if (!installPrompt) {
      toast.info("ব্রাউজারের menu থেকে ‘Install অভ্রজয়’ নির্বাচন করুন");
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setShowInstallPrompt(false);
        try {
          localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "installed");
        } catch {
          // The app can still complete installation when storage is restricted.
        }
        toast.success("অভ্রজয় ইনস্টল করার অনুরোধ গ্রহণ করা হয়েছে");
      } else {
        setShowInstallPrompt(false);
        try {
          localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "dismissed");
        } catch {
          // Dismissal persistence is best-effort.
        }
      }
    } catch {
      toast.error("অফলাইন অ্যাপ ইনস্টল করা যায়নি");
    } finally {
      setInstallPrompt(null);
    }
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    try {
      localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "dismissed");
    } catch {
      // The prompt remains dismissible even when storage is unavailable.
    }
  };

  return (
    <div className="app-shell min-h-screen flex flex-col bg-background">
      {/* হেডার — গভীর টিল, low-opacity keyboard ও ডানদিকে ঘন Bengali glyph cluster */}
      <header className="site-header relative overflow-hidden bg-primary text-primary-foreground">
        {/* ডিজাইন দিক: টিল ডেস্ক — banner-এর alphabet/keyboard visual language header-এও চলবে */}
        <div
          className="site-header__motif pointer-events-none absolute inset-y-0 right-0 flex items-center"
          aria-hidden>
          {DECORATIVE_GLYPHS.map((glyph, i) => (
            <span
              key={`${glyph}-${i}`}
              className="site-header__glyph select-none font-black tracking-tight">
              {glyph}
            </span>
          ))}
        </div>
        <div className="site-header__inner container relative flex items-center justify-between py-4">
          <div className="site-brand flex items-center gap-3">
            <a
              href="/"
              aria-label="অভ্রজয় (AvroJoy)-এর হোম"
              className="group/logo relative flex h-12 w-[4.4rem] items-center justify-center overflow-hidden rounded-xl bg-primary-foreground/95 p-0.5 shadow-inner transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none md:h-14 md:w-[4.7rem]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300 group-hover/logo:border-accent/70 group-focus-visible/logo:border-accent/70 motion-reduce:transition-none"
              />
              <img
                src={BRAND_LOGO_SRC}
                alt="অভ্র ও বিজয় রূপান্তরের চিহ্ন"
                className="relative h-full w-full object-contain transition-transform duration-300 ease-out group-hover/logo:rotate-[1.5deg] group-focus-visible/logo:rotate-[1.5deg] motion-reduce:transform-none motion-reduce:transition-none"
              />
            </a>
            <div className="site-brand__copy">
              <h1 className="site-brand__title text-lg font-extrabold leading-tight tracking-tight md:text-2xl">
                অভ্রজয় <span className="font-semibold opacity-90">(AvroJoy)</span>
              </h1>
              <p className="site-brand__subtitle mt-0.5 text-xs opacity-85 md:text-sm">
                অভ্র/ইউনিকোড ⇄ বিজয় • যুক্তাক্ষর ও দাঁড়ির যত্ন
              </p>
            </div>
          </div>
          <div className="site-header__actions flex items-center gap-2">
            {installPrompt && !isStandalone ? (
              <Button
                variant="outline"
                size="sm"
                className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                onClick={installApp}
                aria-label="অভ্রজয় অফলাইন অ্যাপ ইনস্টল করুন">
                <Download className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">অফলাইনে ইনস্টল</span>
              </Button>
            ) : null}
            {import.meta.env.PROD ? (
              <span
                className={`pwa-status-badge ${!isOnline ? "pwa-status-badge--offline" : ""}`}
                role="status"
                aria-live="polite"
                title={
                  !isOnline
                    ? "ইন্টারনেট ছাড়াই converter ব্যবহার করা যাচ্ছে"
                    : pwaReady
                      ? "অফলাইন ব্যবহারের জন্য app shell প্রস্তুত"
                      : "অফলাইন cache প্রস্তুত হচ্ছে"
                }>
                <span className="pwa-status-badge__dot" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {!isOnline ? "অফলাইন মোড" : pwaReady ? "অফলাইনে প্রস্তুত" : "PWA প্রস্তুত হচ্ছে"}
                </span>
              </span>
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  onClick={shareSite}
                  aria-label="অভ্রজয়ের লিংক শেয়ার করুন">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden md:inline">শেয়ার</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>সাইটের লিংক শেয়ার করুন</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => toggleTheme?.()}
                  aria-label={theme === "dark" ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}>
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {theme === "dark" ? "লাইট মোড" : "ডার্ক মোড"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      {showInstallPrompt && !isStandalone ? (
        <aside
          className="pwa-install-prompt"
          role="dialog"
          aria-modal="false"
          aria-labelledby="pwa-install-prompt-title">
          <div className="pwa-install-prompt__mark" aria-hidden="true">
            <Download className="h-5 w-5" />
          </div>
          <div className="pwa-install-prompt__body">
            <p className="pwa-install-prompt__eyebrow">অভ্রজয় অফলাইন অ্যাপ</p>
            <h2 id="pwa-install-prompt-title" className="pwa-install-prompt__title">
              একবার রেখে দিন, পরে অফলাইনেও ব্যবহার করুন
            </h2>
            <p className="pwa-install-prompt__copy">
              {installPrompt
                ? "ফোন বা কম্পিউটারের Home Screen-এ অভ্রজয় যোগ করলে দ্রুত খুলতে পারবেন। ভবিষ্যতে ব্যবহারের জন্য বুকমার্ক করে রাখুন।"
                : "ব্রাউজারের Install icon বা menu থেকে Install অভ্রজয় নির্বাচন করুন। ভবিষ্যতে ব্যবহারের জন্য বুকমার্ক করে রাখুন।"}
            </p>
            {!installPrompt ? (
              <p className="pwa-install-prompt__hint">
                Chrome/Edge: <strong>Ctrl/Cmd + D</strong> · iPhone/iPad: Share → Add to Home Screen
              </p>
            ) : null}
            <div className="pwa-install-prompt__actions">
              {installPrompt ? (
                <Button
                  size="sm"
                  className="pwa-install-prompt__install"
                  onClick={installApp}>
                  <Download className="mr-1.5 h-4 w-4" />
                  অ্যাপ ইনস্টল করুন
                </Button>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                className="pwa-install-prompt__later"
                onClick={dismissInstallPrompt}>
                {installPrompt ? "এখন নয়" : "বুঝেছি"}
              </Button>
            </div>
          </div>
          <button
            type="button"
            className="pwa-install-prompt__close"
            onClick={dismissInstallPrompt}
            aria-label="ইনস্টল বার্তা বন্ধ করুন">
            <X className="h-4 w-4" />
          </button>
        </aside>
      ) : null}

      <main className="app-main container flex-1">
        {/* ডিজাইন দিক: টিল ডেস্ক — compact intro, glyph-first AvroJoy identity, converter as the first-look product desk */}
        <div className="hero-panel mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="hero-panel__signature" aria-label="অভ্র ⇄ বিজয়">
            <span className="hero-panel__signature-label">অভ্র ⇄ বিজয়</span>
          </div>
          <div className="hero-panel__copy">
            <p className="eyebrow">অভ্রজয় • বাংলা লিপির সহজ সেতু</p>
            <h2 className="hero-title text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              অভ্রজয় — অভ্র হোক বা বিজয়, ফন্ট বদলে নেই ভয়
            </h2>
            <p className="hero-summary mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
              থিসিস, বই, রিপোর্ট বা Word-এর বাংলা লেখা বিজয়ে নিতে শুধু রূপান্তর নয়—formatting ঠিক থাকাও জরুরি।
              অভ্রজয় তাই যুক্তাক্ষর, যতিচিহ্ন, bold/italic, DOCX/TXT ও বাংলা–ইংরেজি mixed text যত্নে সামলায়;
              English শব্দের font বজায় রেখে SutonnyMJ–Times New Roman preview-তে ফল যাচাই করুন।
            </p>
            <p className="hero-bookmark-note mt-3">
              <Bookmark className="hero-bookmark-note__icon" aria-hidden="true" />
              ভবিষ্যতে ব্যবহারের জন্য বুকমার্ক করে রাখুন।
            </p>
          </div>
          <div className="hero-panel__actions">
            <div className="status-puck hero-interactive-control">
              <span className="status-puck__dot" />
              লাইভ কনভার্সন সক্রিয়
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hero-example hero-interactive-control border-primary/30 text-primary hover:bg-accent"
              onClick={loadExample}>
              উদাহরণ দেখুন
            </Button>
          </div>
        </div>

        {/* ট্যাব সুইচার */}
        <div className="workspace-tabs mb-4 flex items-center gap-1.5 rounded-full border bg-card p-1.5 shadow-sm w-fit">
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
            <div className="converter-toolbar__directions direction-switch flex items-center gap-1.5 rounded-full bg-card p-1 shadow-sm">
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
            {/* Teal Desk toolbar: keep the type-scale control centered between conversion directions and utility actions. */}
            <div className="converter-toolbar__font-size flex items-center gap-1" aria-label="ফন্ট সাইজ নিয়ন্ত্রণ">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:bg-accent"
                aria-label="ফন্ট ছোট করুন"
                onClick={() => adjustFontSize(-2)}>
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-7 text-center text-xs tabular-nums font-semibold text-muted-foreground">
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
            <div className="converter-toolbar__actions flex items-center gap-2">
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
                <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground" aria-live="polite">
                  <span>{charCount} অক্ষর</span>
                  <span className="hidden text-border sm:inline">·</span>
                  <span className="hidden sm:inline">{inputMetrics.words} শব্দ</span>
                  <span className="hidden text-border lg:inline">·</span>
                  <span className="hidden lg:inline">{inputMetrics.paragraphs} অনুচ্ছেদ</span>
                </div>
              </div>
              <div
                className="converter-editor-body relative"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    direction === "u2b"
                      ? "এখানে অভ্র/ইউনিকোড টেক্সট লিখুন বা পেস্ট করুন..."
                      : "এখানে বিজয় টেক্সট লিখুন বা পেস্ট করুন..."
                  }
                  className={
                    "h-full min-h-0 resize-none rounded-none border-0 shadow-none focus-visible:ring-0 " +
                    (direction === "u2b" ? "font-input-bn" : "font-output-bijoy")
                  }
                  style={{ fontSize: `${fontSize}px` }}
                />
              </div>
              <div className="editor-paste-footer flex items-center gap-2 border-t bg-muted/50 px-4 py-2.5">
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
                <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground" aria-live="polite">
                  <span>{outCharCount} অক্ষর</span>
                  <span className="hidden text-border sm:inline">·</span>
                  <span className="hidden sm:inline">{outputMetrics.words} শব্দ</span>
                  <span className="hidden text-border lg:inline">·</span>
                  <span className="hidden lg:inline">{outputMetrics.paragraphs} অনুচ্ছেদ</span>
                </div>
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
              <div
                className="converter-editor-body relative"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}>
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
                    "h-full min-h-0 resize-none rounded-none border-0 shadow-none focus-visible:ring-0 " +
                    (direction === "u2b"
                      ? "font-output-bijoy"
                      : "font-input-bn") +
                    (direction === "u2b"
                      ? " pointer-events-none absolute inset-0 text-transparent caret-transparent abc-no-native-sel"
                      : "")
                  }
                  style={{ fontSize: `${fontSize}px` }}
                  aria-hidden={direction === "u2b"}
                  tabIndex={direction === "u2b" ? 0 : 0}
                />
                {direction === "u2b" && (
                  <div
                    ref={outPreviewRef}
                    className="bijoy-rich h-full min-h-0 select-text overflow-y-auto px-3 py-2"
                    style={{ fontSize: `${bnPx}px` }}
                    onScroll={(e) => syncScroll(e.currentTarget, outAreaRef.current)}
                    onCopy={copySelectedPreview}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}>
                    {renderRichSegments()}
                  </div>
                )}
              </div>
              <div className="output-copy-footer flex flex-wrap items-center gap-2 border-t bg-muted/50 px-4 py-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="copy-output-button border-primary/30 bg-card text-primary hover:bg-accent"
                  onClick={copyOutput}
                  aria-label="Copy to Clipboard — কনভার্টেড টেক্সট কপি করুন"
                  title="Copy to Clipboard">
                  {copied ? (
                    <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Copy to Clipboard
                </Button>
                <span className="text-xs text-muted-foreground">
                  এক ক্লিকে কপি করুন • Word-এ SutonnyMJ ফন্টে পেস্ট করুন
                </span>
              </div>
            </div>
          </div>

          {/* রূপান্তর বাটন */}
          <div className="converter-actionbar flex flex-wrap items-center justify-center gap-3 border-t bg-secondary/60 px-4 py-4">
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
        <div className="type-legend mt-4 overflow-hidden rounded-xl border bg-card shadow-sm">
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
        <div className="glyph-strip mt-6 rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              যুক্তবর্ণ প্রিভিউ — কোনোটি ভাঙে না
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              ["ন্ট", "ক্যান্টিন"],
              ["ল্ল", "বল্লভ"],
              ["য়", "নিয়োজন"],
              ["ড়", "গাড়ি"],
              ["ঢ়", "রূঢ়"],
              ["্র", "ক্রীড়া"],
              ["্র্", "প্রত্যাহার"],
              ["জ্ঞ", "জ্ঞান"],
              ["ক্ষ", "লক্ষ্য"],
              ["শ্র", "শ্রাবণ"],
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

          {/* টিপস কার্ড — আইকন ও ব্যবহারিক উদাহরণসহ */}
        <div className="feature-grid mt-4 grid gap-4 md:grid-cols-3">
          <article className="feature-card rounded-xl border p-5">
            <div className="feature-card__icon mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Check className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-bold text-foreground">
              যুক্তাক্ষর ও যতিচিহ্নে যত্ন
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              ন্ত, ল্ল, য়, ড়, ঢ়, র-ফলা, রেফ, জ্ঞ, ক্ষ, শ্র এবং দাঁড়ির মতো
              গুরুত্বপূর্ণ বাংলা গঠনগুলোকে ভেঙে না দেওয়াই লক্ষ্য।
            </p>
            <div className="feature-card__example mt-4">
              <span className="feature-card__example-label">দ্রুত যাচাই</span>
              <span className="font-input-bn text-sm font-semibold text-primary">
                শান্ত · উল্লাস · শ্রেণি · দাঁড়ি
              </span>
            </div>
          </article>
          <article className="feature-card rounded-xl border p-5">
            <div className="feature-card__icon mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <ArrowDownUp className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-bold text-foreground">
              স্মার্ট ডুয়াল-সাইজ
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              বাংলা SutonnyMJ-তে এবং ইংরেজি/সংখ্যা Times New Roman-এ থাকে;
              ইংরেজি অংশ বাংলার চেয়ে ২pt ছোট হয়ে রেন্ডার হয়।
            </p>
            <div className="feature-card__example mt-4">
              <span className="feature-card__example-label">দেখুন যেমন</span>
              <span className="text-sm text-foreground">
                বাংলা ১৪pt <span className="text-muted-foreground">+</span>{" "}
                <span className="font-serif text-xs">English 12pt</span>
              </span>
            </div>
          </article>
          <article className="feature-card rounded-xl border p-5">
            <div className="feature-card__icon mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-bold text-foreground">
              DOCX / TXT ফাইল রূপান্তর
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Word ও plain-text ফাইল আপলোড করে রূপান্তরিত ফল দেখুন, কপি করুন
              বা প্রিন্ট/PDF preview থেকে সংরক্ষণ করুন।
            </p>
            <div className="feature-card__example mt-4">
              <span className="feature-card__example-label">সহজ ধাপ</span>
              <span className="text-sm font-semibold text-primary">
                .docx / .txt → রূপান্তর → কপি
              </span>
            </div>
          </article>
        </div>

        {/* সহায়তা */}
        <div className="usage-card mt-6 rounded-xl border border-border/70 bg-card/60 p-5 text-sm leading-relaxed text-muted-foreground">
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
            <li>
              কনভার্ট করা DOCX-এ বাংলা অংশের indent, alignment, line-height ও
              font-size বদলানো যাবে; তবে বাংলা অংশের font family SutonnyMJ
              থেকে অন্য ফন্টে বদলাবেন না। বিজয় টেক্সট ফন্ট-নির্ভর হওয়ায় অন্য
              ফন্টে এটি হিজিবিজি দেখাবে। ইংরেজি অংশ আলাদাভাবে পরিবর্তন করা যায়।
            </li>
          </ol>
        </div>
        </>
        ) : (
        /* ফাইল কনভার্টার প্যানেল */
        <div className="file-workspace overflow-hidden rounded-2xl border bg-card shadow-lg">
          <div className="file-workspace__header border-b bg-secondary/60 px-4 py-3">
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
              <div className="file-direction direction-switch mb-4 flex items-center justify-center gap-1.5 rounded-full border bg-secondary/50 p-1">
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
                  "file-dropzone flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors " +
                  (isFileDragActive ? "file-dropzone--active " : "") +
                  (selectedFile
                    ? "border-primary/60 bg-primary/5"
                    : "border-border bg-muted/40 hover:border-primary/40 hover:bg-muted/70")
                }
                onDragEnter={handleFileDragOver}
                onDragOver={handleFileDragOver}
                onDragLeave={handleFileDragLeave}
                onDrop={handleFileDrop}>
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
              {selectedFile && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    ফাইলটি রূপান্তরের জন্য প্রস্তুত
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-destructive/25 text-destructive hover:bg-destructive/10"
                    onClick={clearSelectedFile}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    ফাইল সরান
                  </Button>
                </div>
              )}
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
                <Button
                  type="button"
                  variant="outline"
                  disabled={!selectedFile || converting || !/\.docx$/i.test(selectedFile.name)}
                  className="border-primary/35 bg-card text-primary hover:bg-primary/5 disabled:opacity-50"
                  onClick={runBijoyFontRepair}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  ক্ষতিগ্রস্ত বিজয় ফন্ট মেরামত
                </Button>
                <p className="file-repair-note max-w-md text-center text-xs leading-relaxed text-muted-foreground">
                  শুধু Word-এ Times New Roman হয়ে হিজিবিজি দেখা পুরোনো বিজয় DOCX-এর জন্য।
                  এটি লেখা বদলায় না; উচ্চ-নিশ্চয়তার বিজয় run-এ SutonnyMJ font mapping ফিরিয়ে দেয়।
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {filePrintText && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-accent"
                      onClick={openPrintPreview}>
                      <Printer className="mr-1.5 h-4 w-4" />
                      প্রিন্ট / PDF প্রিভিউ
                    </Button>
                  )}
                  {fileResult && (
                    <a
                      href={fileResult.url}
                      download={fileResult.name}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-md transition-transform hover:bg-emerald-700 active:scale-[0.97]">
                      <Download className="h-4 w-4" />
                      ডাউনলোড করুন — {fileResult.name}
                    </a>
                  )}
                </div>
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
                      ) =>
                        renderBijoyText(
                          seg.text,
                          seg.bangla ? "seg-bn" : "seg-lat",
                          seg.bangla ? bnPx : latPx,
                          `file-${i}`,
                        ),
                    )}
                  </div>
                </div>
              )}

              <p className="file-output-note mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                রূপান্তর করা হয় — প্রতিটি টেক্সট-রানের ফন্ট SutonnyMJ (বাংলা)
                / Times New Roman (ইংরেজি) হয়ে যায়; বোল্ড, ইটালিক, indent,
                alignment ও font-size সম্পাদনা নিরাপদ। বাংলা অংশের font family
                SutonnyMJ থেকে বদলালে বিজয় glyph হিজিবিজি দেখাতে পারে; ইংরেজি
                অংশ আলাদাভাবে পরিবর্তন করা যায়।
              </p>
            </div>
          </div>
        </div>
        )}

        {/* সাম্প্রতিক রূপান্তরের ইতিহাস — local-only, দ্রুত পুনর্ব্যবহারযোগ্য */}
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
                    সাম্প্রতিক রূপান্তর
                  </h2>
                  {history.length > 0 && (
                    <span className="history-capacity-badge rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
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
            <div className="history-empty-state rounded-2xl border border-dashed bg-card/70 px-5 py-8 text-center">
              <Clock3 className="mx-auto h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold text-foreground">
                এখনো কোনো রূপান্তরের ইতিহাস নেই
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

        <section
          id="avro-bijoy-guide"
          className="seo-guide-section mt-8 rounded-2xl border border-primary/20 bg-card/90 p-5 shadow-sm sm:p-6"
          aria-labelledby="avro-bijoy-guide-title">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            ব্যবহারিক বাংলা গাইড
          </p>
          <h2 id="avro-bijoy-guide-title" className="mt-1 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            অভ্র, বিজয় ও SutonnyMJ রূপান্তর সহজভাবে বুঝুন
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            অভ্রজয় দিয়ে ইউনিকোড বাংলা ও বিজয় (SutonnyMJ) লেখার মধ্যে রূপান্তর করা যায়।
            Word-এ ব্যবহার করার আগে আউটপুট দেখে নেওয়া এবং সঠিক ফন্ট নির্বাচন করা ভালো ফল দেয়।
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border bg-muted/30 p-4">
              <h3 className="font-bold text-foreground">অভ্র থেকে বিজয়</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">অভ্র → বিজয়</strong> নির্বাচন করে ইউনিকোড বাংলা লিখুন বা পেস্ট করুন।
                লাইভ রূপান্তর চালু থাকলে আউটপুট সঙ্গে সঙ্গেই দেখা যাবে; পরে কপি করে Word-এ ব্যবহার করুন।
              </p>
              <a href="/avro-to-bijoy" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                বিস্তারিত গাইড <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
            <article className="rounded-xl border bg-muted/30 p-4">
              <h3 className="font-bold text-foreground">বিজয় থেকে ইউনিকোড</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">বিজয় → অভ্র</strong> নির্বাচন করে SutonnyMJ-ভিত্তিক বিজয় টেক্সট দিন।
                রূপান্তরিত লেখা আধুনিক Unicode বাংলা হিসেবে কপি ও সম্পাদনা করা যাবে।
              </p>
              <a href="/bijoy-to-unicode" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                বিস্তারিত গাইড <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
            <article className="rounded-xl border bg-muted/30 p-4">
              <h3 className="font-bold text-foreground">DOCX/TXT ফাইল</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                ফাইল কনভার্টার ট্যাব থেকে <strong className="text-foreground">.docx</strong> বা <strong className="text-foreground">.txt</strong> নির্বাচন করুন,
                দিক ঠিক করুন এবং রূপান্তরিত file download করুন। এই প্রক্রিয়াটি আপনার ব্রাউজারেই সম্পন্ন হয়।
              </p>
              <a href="/docx-txt-bijoy-converter" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                বিস্তারিত গাইড <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
          </div>

          <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
            <h3 className="font-bold text-foreground">সাধারণ প্রশ্ন</h3>
            <div className="mt-3 divide-y divide-border">
              <details className="py-3">
                <summary className="cursor-pointer font-semibold text-foreground">Word-এ বিজয় আউটপুটে কোন font ব্যবহার করব?</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  বাংলা বিজয় অংশে SutonnyMJ এবং ইংরেজি অংশে Times New Roman ব্যবহার করুন। প্রয়োজন হলে এখানে থাকা rich copy বা file converter ব্যবহার করে ফল আগে যাচাই করুন।
                </p>
              </details>
              <details className="py-3">
                <summary className="cursor-pointer font-semibold text-foreground">আমার টেক্সট বা ফাইল কি server-এ সংরক্ষিত হয়?</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  না। বর্তমান public version-এ text conversion, file conversion এবং recent history আপনার browser-এর মধ্যেই কাজ করে; কোনো login বা ব্যক্তিগত cloud storage নেই।
                </p>
              </details>
              <details className="py-3">
                <summary className="cursor-pointer font-semibold text-foreground">যুক্তবর্ণ ও এ-কার ঠিক না দেখালে কী করব?</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  সঠিক direction বেছে নিয়েছেন কি না নিশ্চিত করুন এবং বিজয় ফল Word-এ SutonnyMJ font-এ দেখুন। জটিল DOCX হলে file converter-এর output download করে original formattingসহ পরীক্ষা করুন।
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* অভ্রজয় সম্পর্কে ও স্বেচ্ছাসেবী সহায়তা — page-end cards immediately before the footer. */}
        <section
          className="support-section mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"
          aria-label="অভ্রজয় সম্পর্কে ও সমর্থন">
          <article className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card/90 p-5 shadow-sm sm:p-6">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-primary/10" aria-hidden="true" />
            <div className="relative flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">অভ্রজয় সম্পর্কে</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-foreground">বাংলা লেখার পাশে একটি ব্যবহারিক সহকারী।</h2>
              </div>
            </div>
            <p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              একটি স্নাতকোত্তর থিসিসের শেষ সময়ের Word ও বিজয় রূপান্তর সমস্যার সমাধান খুঁজতে গিয়েই অভ্রজয়ের শুরু। সেই ব্যক্তিগত প্রয়োজন আজ বাংলা document workflow সহজ করার একটি উদ্যোগে পরিণত হয়েছে।
            </p>
            <a
              href="/avrojoy-er-jonmokotha"
              className="relative mt-4 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              অভ্রজয়ের জন্মকথা পড়ুন
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>

          <article className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/10 p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">সমর্থন করুন</p>
                <h2 className="mt-1 text-lg font-extrabold text-foreground">স্বেচ্ছাসেবী সহযোগিতা</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              অভ্রজয়ের উন্নয়ন ও রক্ষণাবেক্ষণে স্বেচ্ছায় সহায়তা করতে চাইলে নিচের নম্বরটি ব্যবহার করতে পারেন।
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2" aria-label="মোবাইল পেমেন্ট পদ্ধতি">
              {['বিকাশ', 'নগদ', 'রকেট'].map((method) => (
                <span key={method} className="rounded-lg border border-primary/20 bg-card/80 px-2 py-1.5 text-center text-xs font-bold text-foreground">
                  {method}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={copySupportNumber}
              title="নম্বর কপি করুন"
              className="mt-2 block w-full rounded-xl border border-primary/30 bg-card px-3 py-2 text-center font-mono text-sm font-bold tracking-wide text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="বিকাশ, নগদ ও রকেটের নম্বর ০১৬০১৫৯৯৩৫৫ কপি করুন">
              01601599355
              <span className="sr-only" aria-live="polite">{supportNumberCopied ? "নম্বর কপি হয়েছে" : ""}</span>
            </button>
            <a
              href="https://wa.me/8801601599355"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-card px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp-এ যোগাযোগ করুন
            </a>
          </article>
        </section>
      </main>

      {/* ফুটার — header-এর exact logo, banner-inspired keyboard ও Bengali glyph layer */}
      <footer className="site-footer mt-6 border-t bg-primary py-6 text-primary-foreground">
        <div
          className="site-footer__motif pointer-events-none absolute inset-0"
          aria-hidden>
          {DECORATIVE_GLYPHS.slice().reverse().map((glyph, i) => (
            <span
              key={`footer-${glyph}-${i}`}
              className="site-footer__glyph select-none font-black">
              {glyph}
            </span>
          ))}
        </div>
        <div className="site-footer__inner container relative flex flex-col items-center gap-2 text-center text-sm">
          <a
            href="/"
            aria-label="অভ্রজয় (AvroJoy)-এর হোম"
            className="site-footer__logo group/footer-logo relative flex h-12 w-[4.7rem] items-center justify-center overflow-hidden rounded-xl bg-primary-foreground/95 p-0.5 shadow-inner transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none">
            <img
              src={BRAND_LOGO_SRC}
              alt="অভ্র ও বিজয় রূপান্তরের চিহ্ন"
              className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover/footer-logo:rotate-[1.5deg] group-focus-visible/footer-logo:rotate-[1.5deg] motion-reduce:transform-none motion-reduce:transition-none"
            />
          </a>
          <p className="flex flex-wrap items-center justify-center gap-2 font-semibold">
            <span className="inline-flex h-7 items-center rounded-full bg-primary-foreground/15 px-2.5 font-serif text-[11px] font-black tracking-tight">
              অভ্র ⇄ বিজয়
            </span>
            অভ্রজয় (AvroJoy) — বাংলা লিপির সহজ সেতু
          </p>
          <p className="text-xs opacity-80">
            অভ্র/ইউনিকোড ⇄ বিজয় • SutonnyMJ • Times New Roman
          </p>
          <nav aria-label="Footer navigation" className="site-footer__nav flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold">
            <a href="/avrojoy-er-jonmokotha" className="underline-offset-4 transition hover:underline">আমাদের গল্প</a>
            <span aria-hidden="true" className="opacity-50">•</span>
            <a href="/privacy" className="underline-offset-4 transition hover:text-primary-foreground hover:underline">গোপনীয়তা</a>
            <span aria-hidden="true" className="opacity-50">•</span>
            <a href="/terms" className="underline-offset-4 transition hover:text-primary-foreground hover:underline">ব্যবহারের শর্ত</a>
            <span aria-hidden="true" className="opacity-50">•</span>
            <a href="/contact" className="underline-offset-4 transition hover:text-primary-foreground hover:underline">যোগাযোগ</a>
            <span aria-hidden="true" className="opacity-50">•</span>
            <a href="/thesis-bijoy-checklist" className="underline-offset-4 transition hover:text-primary-foreground hover:underline">থিসিস checklist</a>
          </nav>
          <p className="text-xs opacity-75">
            © {currentCopyrightYear} মো. হাবিবুল্লাহ নাঈম • সর্বস্বত্ব সংরক্ষিত
          </p>
          <p className="max-w-2xl text-xs leading-relaxed opacity-85">
            অনুমতি ছাড়া এই সাইটের code, design বা content কপি/পুনঃপ্রকাশ নিষিদ্ধ।
          </p>
        </div>
      </footer>

      {printPreviewOpen && filePrintText && (
        <div className="print-preview-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <section
            className="print-preview-dialog flex min-h-0 max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="print-preview-title">
            <div className="print-preview-actions flex shrink-0 items-center justify-between gap-3 border-b bg-secondary/60 px-4 py-3">
              <div className="min-w-0">
                <h2 id="print-preview-title" className="font-bold text-foreground">
                  প্রিন্ট / PDF প্রিভিউ
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  বাংলা SutonnyMJ-তে এবং ইংরেজি Times New Roman-এ থাকবে। PDF করতে print dialog-এ “Save as PDF” নির্বাচন করুন।
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:bg-accent"
                onClick={() => setPrintPreviewOpen(false)}
                aria-label="প্রিন্ট preview বন্ধ করুন">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="print-preview-paper min-h-0 flex-1 overflow-y-auto bg-white p-6 text-slate-900 sm:p-10">
              <div className="print-preview-paper__meta mb-5 border-b border-slate-200 pb-3 text-sm text-slate-500">
                {fileResult?.name ?? "রূপান্তরিত ডকুমেন্ট"}
              </div>
              <div className="print-preview-content bijoy-rich whitespace-pre-wrap break-words text-left" style={{ fontSize: `${bnPx}px` }}>
                {filePrintSegments.map((seg, i) =>
                  filePrintDirection === "u2b"
                    ? renderBijoyText(
                        seg.text,
                        seg.bangla ? "seg-bn" : "seg-lat",
                        seg.bangla ? bnPx : latPx,
                        `print-${i}`,
                      )
                    : (
                        <span
                          key={`${i}-${seg.text.slice(0, 8)}`}
                          className={seg.bangla ? "font-input-bn" : "seg-lat"}
                          style={{ fontSize: seg.bangla ? `${bnPx}px` : `${latPx}px` }}>
                          {seg.text}
                        </span>
                      ),
                )}
              </div>
            </div>
            <div className="print-preview-actions flex shrink-0 flex-wrap justify-end gap-2 border-t bg-muted/40 px-4 py-3">
              <Button type="button" variant="outline" onClick={() => setPrintPreviewOpen(false)}>
                বন্ধ করুন
              </Button>
              <Button type="button" onClick={printPreview}>
                <Printer className="mr-1.5 h-4 w-4" />
                প্রিন্ট করুন / PDF সংরক্ষণ
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
