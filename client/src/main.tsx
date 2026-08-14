import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(() => {
        window.dispatchEvent(new Event("avrojoy:pwa-registered"));
      })
      .catch((error) => {
        console.warn("AvroJoy offline service worker registration failed", error);
      });
  });
}
