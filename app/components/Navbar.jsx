"use client";
import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Activity } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // replaces useLocation()
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-[#006d77]" />
              <span className="text-xl font-bold text-[#293241] dark:text-white">
                EthicalMD
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#006d77] ${
                  pathname === item.href
                    ? "text-[#006d77]"
                    : "text-[#293241] dark:text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="bg-[#006d77] hover:bg-[#006d77]/90"
                  size="sm"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-[#006d77]"
                      : "text-[#293241] dark:text-gray-300"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button
                    className="bg-[#006d77] hover:bg-[#006d77]/90 w-full"
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};
