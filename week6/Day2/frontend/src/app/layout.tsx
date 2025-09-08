import type React from "react";
import { integralCF, satoshi } from "@/styles/fonts";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import Providers from "./provider";
import SocketClient from "./SocketClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata = {
  title: "Shopco",
  description:
    "Ecommerce website built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${integralCF.variable} ${satoshi.variable}`}>
        <Providers>
          <SocketClient />
          <Navbar />
          <main>{children}</main>
          <NewsletterSection />
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </Providers>
      </body>
    </html>
  );
}
