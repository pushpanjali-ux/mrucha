import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import FlashLoader from "./Components/FlashLoader";
import ScrollPages from "./ScrollPages";
import SignupForm from "./Components/SignupForm";
import StoryPage from "./pages/StoryPage";
import ProductShowcase from "./pages/ProductShowcase";

export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isPageRefresh =
      performance.navigation.type === 1 || window.location.reload;
    const isHomePage = window.location.pathname === "/";

    if (isPageRefresh && isHomePage) {
      const timer = setTimeout(() => setLoading(false), 6000); // Adjust to match FlashLoader animation duration
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading && location.pathname === "/" ? (
        <FlashLoader />
      ) : (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<ScrollPages />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="/product/:slug" element={<ProductShowcase />} />
          </Routes>
        </AnimatePresence>
      )}
    </>
  );
}
