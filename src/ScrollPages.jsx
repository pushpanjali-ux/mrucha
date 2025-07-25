

//vertical scroll
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CircularGallery from "./pages/UsersPage";
// import CreatorsPage from "./pages/CreatorsPage"

gsap.registerPlugin(ScrollTrigger);

export default function ScrollPages() {
  useEffect(() => {
   
    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="w-full flex flex-col">
      <section id="home">
        <HomePage />
      </section>
      <section id="products">
        <ProductPage />
      </section>
      <section id="users">
        <CircularGallery />
      </section>
    </div>
  );
}

