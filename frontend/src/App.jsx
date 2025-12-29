import React, { useEffect, useRef, useState } from "react";
import './App.css';
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import GlobalLoader from "./components/GlobalLoader";
import Navbar from "../components/module1/Navbar"; // Global Navbar for all pages

import DataPage from "../pages/DataPage";
import Home from "../pages/Home";
import PdfJson from "../pages/PdfJson";
import DataPage2 from "../pages/DataPage2";
import Module2Page from "../pages/Module2Page";
import { Routes, Route, useLocation } from "react-router-dom";
import Module3Page1 from "../pages/Module3Page1";
import Module4Page1 from "../pages/Module4Page1";
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
            <Route path="/data" element={<DataPage />} />
            <Route path="/pdf-to-json" element={<PdfJson />} />
            <Route path="/data2" element={<DataPage2 />} />
            <Route path="/Module2" element={<Module2Page />} />
            <Route path="/Module3Page1" element={<Module3Page1 />} />
            <Route path="/Module4Page1" element={<Module4Page1 />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;