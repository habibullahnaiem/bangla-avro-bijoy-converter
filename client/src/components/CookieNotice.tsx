import { useEffect, useState } from "react";

const KEY = "avrojoy-cookie-consent-v1";

/**
 * Lightweight cookie/storage notice (Bangla). Shown once until dismissed;
 * the choice is remembered in localStorage. Required reading for AdSense
 * reviewers: the site discloses browser-storage/cookie usage up front.
 */
export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {
      /* storage unavailable — just hide for this session */
    }
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="কুকি নোটিশ"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          AvroJoy আপনার পছন্দ মনে রাখতে ও অভিজ্ঞতা উন্নত করতে cookies ও browser
          storage ব্যবহার করে। বিস্তারিত{" "}
          <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
            গোপনীয়তা নীতিতে
          </a>{" "}
          পড়ুন।
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          বুঝেছি
        </button>
      </div>
    </div>
  );
}
