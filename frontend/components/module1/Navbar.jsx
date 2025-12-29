"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

// Navigation items configuration
const NAV_ITEMS = [
  { to: "/", label: "Home", id: "home" },
  {
    label: "Module 1",
    id: "module1",
    children: [
      { to: "/data", id: "DataPage", label: "Main chart", icon: "🏠" },
      { to: "/data2", id: "DataPage2", label: "Planer Checker", icon: "📊" },
      { to: "/pdf-to-json", id: "PdfJson", label: "PDF TO JSON", icon: "📈" },
    ],
  },
  { to: "/Module2", label: "Module 2", id: "module2" },
  {
    label: "Module 3",
    id: "module3",
    children: [
      { to: "/Module3Page1", id: "Module3Page1", label: "PRISM", icon: "📋" },
    ],
  },
  {
    label: "Module 4",
    id: "module4",
    children: [
      { to: "/Module4Page1", id: "Module4Page1", label: "ORBIT", icon: "🌐" },
    ],
  },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdownId(null);
  }, [location.pathname]);

  // Outside click handler
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleMobileMenuToggle = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    []
  );

  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  // Check if current page is home
  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-transparent py-3 ${!isHomePage ? 'backdrop-blur-md' : ''}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-4">
          <img src="/logo.jpg" alt="Aerozone" className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
          {NAV_ITEMS.map((item) => {
            const hasChildren = Array.isArray(item.children);
            const isSubActive =
              hasChildren && item.children.some((child) => location.pathname === child.to);

            if (hasChildren) {
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition ${isSubActive ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300" : "text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                      }`}
                  >
                    {item.label}
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${openDropdownId === item.id ? "rotate-180" : ""
                        }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openDropdownId === item.id && (
                    <div className="absolute left-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-lg py-2 z-10 border border-gray-200 dark:border-gray-700">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.to}
                          className={`block px-4 py-2 text-sm flex items-center ${location.pathname === child.to
                            ? "text-cyan-600 dark:text-cyan-300 bg-cyan-500/10"
                            : "text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            }`}
                        >
                          <span className="mr-2">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.to}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${location.pathname === item.to
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
                  : "text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition"
          onClick={handleMobileMenuToggle}
        >
          <div className="w-6 h-6 relative">
            <span
              className={`absolute block h-0.5 w-full bg-current transition ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
                }`}
            />
            <span className={`absolute block h-0.5 w-full bg-current transition ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
            <span
              className={`absolute block h-0.5 w-full bg-current transition ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
                }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Slide-out Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-5 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Aerozone" className="h-10 w-auto object-contain" />
            <span className="text-xs text-cyan-300/60 font-mono">NAVIGATION</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-cyan-500/20 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
          {NAV_ITEMS.map((item, index) => {
            const hasChildren = Array.isArray(item.children);
            const isSubActive =
              hasChildren && item.children.some((child) => location.pathname === child.to);

            if (hasChildren) {
              return (
                <div
                  key={item.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${isSubActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30"
                      : "text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60"
                      }`}
                  >
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 mr-3" />
                      {item.label}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${openDropdownId === item.id ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${openDropdownId === item.id ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="pl-4 space-y-1 border-l-2 border-cyan-500/30 ml-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.to}
                          className={`block px-4 py-2.5 rounded-lg text-sm flex items-center transition-all duration-200 ${location.pathname === child.to
                            ? "text-cyan-600 dark:text-cyan-300 bg-cyan-500/10"
                            : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:translate-x-1"
                            }`}
                        >
                          <span className="mr-3 text-base">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.to}
                className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 animate-fadeIn ${location.pathname === item.to
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30"
                  : "text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60"
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 mr-3" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-500/20 bg-gray-50 dark:bg-gray-950/50">
          <div className="text-center">
            <span className="text-xs text-gray-500">© 2024 AEROZONE</span>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
