import React, { useEffect, useRef, useState } from "react";
import './App.css';
import { ThemeProvider } from "./context/ThemeContext";
import GlobalLoader from "./components/GlobalLoader";
import Navbar from "../components/home/Navbar"; // Global Navbar for all pages

import MainChart from "../pages/MainChart";
import Home from "../pages/Home";
import PdfToJson from "../pages/PdfToJson";
import PlannerChecker from "../pages/PlannerChecker";
import Prism from "../pages/Prism";
import { Routes, Route, useLocation } from "react-router-dom";
import Orbit from "../pages/Orbit";
import Analysis1 from "../pages/Analysis1";
import Analysis2 from "../pages/Analysis2";
// import Lenis from "@studio-freight/lenis";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // If it's the very first load, we might want to skip this generic loader 
    // if the Home page has its own preloader.
    // However, the user asked for "in all pages i want loading".
    // So we will trigger it.

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setInitialLoad(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // const lenisRef = useRef(null);

  // useEffect(() => {
  //   const lenis = new Lenis({
  //     duration: 0.8,
  //     easing: (t) => t,
  //     smooth: true,
  //     direction: "vertical",
  //     gestureDirection: "vertical",
  //     smoothTouch: true,
  //   });

  //   function raf(time) {
  //     lenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }
  //   requestAnimationFrame(raf);

  //   lenisRef.current = lenis;

  //   return () => {
  //     lenis.destroy();
  //   };
  // }, []);

  return (
    <>
      <div className="bg-background text-foreground relative min-h-screen w-full overflow-hidden transition-colors duration-300">
        <GlobalLoader loading={loading} />

        <div className="relative z-10 min-h-screen w-full">
          {/* Global Navbar - Shows on all pages */}
          <Navbar />


          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/main-chart" element={<MainChart />} />
            <Route path="/pdf-to-json" element={<PdfToJson />} />
            <Route path="/planner-checker" element={<PlannerChecker />} />
            <Route path="/prism" element={<Prism />} />
            <Route path="/orbit" element={<Orbit />} />
            <Route path="/analysis1" element={<Analysis1 />} />
            <Route path="/analysis2" element={<Analysis2 />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;