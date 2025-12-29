// src/pages/Home.js

"use client";

import React, { useEffect, useRef } from "react";
// Navbar is now global in App.jsx
import { gsap } from "gsap";
import astronaut from "../assets/astronaut.png";
import earth from "../assets/earth.png";

export default function Home() {
  const astronautRef = useRef(null);

  useEffect(() => {
    // Basic GSAP animation for astronaut float
    if (astronautRef.current) {
      gsap.to(astronautRef.current, {
        y: -30,
        duration: 3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(astronautRef.current, {
        rotation: 5,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []); // Run once on mount

  return (
    <>
      <main className="relative min-h-screen bg-background text-foreground">
        {/* Navbar is now global in App.jsx */}

        <div className="text-center">
          {/* Hero Section */}
          <div className="relative flex items-center justify-center h-screen text-center overflow-hidden">
            {/* Earth at bottom */}
            <img
              loading="lazy"
              src={earth}
              alt="Earth"
              className="absolute bottom-0 w-full h-full object-cover opacity-80"
            />

            {/* BACK text */}
            <h2 className="absolute text-[5rem] md:text-[8rem] font-extrabold tracking-wider z-10 text-foreground">
              AEROZONE
            </h2>

            {/* Astronaut */}
            <img
              ref={astronautRef}
              src={astronaut}
              alt="Astronaut"
              className="absolute md:w-[450px] w-[400px] top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
            />

            {/* FRONT text */}
            <h2 className="absolute text-[5rem] md:text-[8rem] font-extrabold tracking-wider z-30 text-outline">
              AEROZONE
            </h2>
          </div>
        </div>
      </main>
    </>
  );
}