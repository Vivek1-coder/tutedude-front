import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer, toast } from "react-toastify";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EhicalMD",
  description: "AI for healthcare systems",
};

import React from "react";
// import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";

// import { Toaster } from "@components/ui/toaster";

const Layout = ({ children }) => {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          {/* <Toaster /> */}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />{" "}
        </div>
      </body>
    </html>
  );
};

export default Layout;
