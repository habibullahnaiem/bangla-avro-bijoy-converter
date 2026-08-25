import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AvroJoyStoryPage from "./pages/AvroJoyStory";
import { PublicInfoPage } from "./pages/PublicInfoPages";
import { SeoGuidePage } from "./pages/SeoGuides";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
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
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
