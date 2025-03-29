import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML预览 - 元宝伴侣",
  description: "HTML项目预览页面",
};

export default function PreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
} 