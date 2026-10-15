import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import CookieNotice from "./components/CookieNotice";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Route-based code splitting: only the homepage ships in the initial bundle.
// Guide/story/info pages load on demand, cutting first-visit download size.
const AvroJoyStoryPage = lazy(() => import("./pages/AvroJoyStory"));
const PublicInfoPage = lazy(() =>
  import("./pages/PublicInfoPages").then((m) => ({ default: m.PublicInfoPage })),
);
const SeoGuidePage = lazy(() =>
  import("./pages/SeoGuides").then((m) => ({ default: m.SeoGuidePage })),
);
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <div
      className="flex min-h-[60dvh] items-center justify-center"
      role="status"
      aria-label="পেজ লোড হচ্ছে">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/avrojoy-er-jonmokotha"} component={AvroJoyStoryPage} />
        <Route path={"/privacy"}><PublicInfoPage slug="privacy" /></Route>
        <Route path={"/terms"}><PublicInfoPage slug="terms" /></Route>
        <Route path={"/contact"}><PublicInfoPage slug="contact" /></Route>
        <Route path={"/thesis-bijoy-checklist"}><PublicInfoPage slug="thesis-bijoy-checklist" /></Route>
        <Route path={"/avro-to-bijoy"}>
          <SeoGuidePage slug="avro-to-bijoy" />
        </Route>
        <Route path={"/bijoy-to-unicode"}>
          <SeoGuidePage slug="bijoy-to-unicode" />
        </Route>
        <Route path={"/docx-txt-bijoy-converter"}>
          <SeoGuidePage slug="docx-txt-bijoy-converter" />
        </Route>
        <Route path={"/sutonnymj-to-nikosh"}>
          <SeoGuidePage slug="sutonnymj-to-nikosh" />
        </Route>
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieNotice />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
