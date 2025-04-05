import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import PageTransition from "@/components/PageTransition";
import PageEffects from "@/components/PageEffects";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIPage.top - 轻松创建分享HTML页面",
  description: "一键创建、预览和分享您的HTML页面，无需部署，即刻呈现",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-50 to-white min-h-screen`}
      >
        <Header />
        <PageEffects />
        <main className="container mx-auto px-4 py-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
