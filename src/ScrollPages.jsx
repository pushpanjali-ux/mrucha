// import { useEffect, useLayoutEffect, useRef } from "react"
// import gsap from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"
// import HomePage from "./pages/HomePage"
// import ProductPage from "./pages/Productpage"
// // import CreatorsPage from "./pages/CreatorsPage"

// gsap.registerPlugin(ScrollTrigger)

// export default function ScrollPages() {
//   const containerRef = useRef(null)

//   // ✅ Force scroll to top on mount
//   useEffect(() => {
//     window.scrollTo(0, 0)
//   }, [])

//   useLayoutEffect(() => {
//     if (!containerRef.current) return

//     const sections = gsap.utils.toArray(".panel")

//     const ctx = gsap.context(() => {
//       gsap.to(sections, {
//         xPercent: -100 * (sections.length - 1),
//         ease: "none",
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top top",
//           pin: true,
//           scrub: 1,
//           snap: 1 / (sections.length - 1),
//           end: () => "+=" + containerRef.current.offsetWidth,
//         },
//       })

//       // ✅ Run refresh AFTER all layout is done
//       setTimeout(() => {
//         ScrollTrigger.refresh()
//       }, 100)
//     }, containerRef)

//     return () => ctx.revert()
//   }, [])

//   return (
//     <div ref={containerRef} className="flex w-[300vw] h-screen">
//       <div className="panel w-screen h-screen shrink-0"><HomePage /></div>
//       <div className="panel w-screen h-screen shrink-0"><ProductPage /></div>
//       {/* <div className="panel w-screen h-screen shrink-0"><CreatorsPage /></div> */}
//     </div>
//   )
// }

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
    // OPTIONAL: any scroll-based animations can still go here
    // e.g. scroll-triggered fade-ins, pins, etc.

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

