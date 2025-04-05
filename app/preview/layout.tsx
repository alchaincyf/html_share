export const metadata = {
  title: 'HTML预览',
  description: '用户HTML内容预览',
};

export default function PreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 这个布局将覆盖默认的应用布局，移除导航栏和其他UI元素
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
} 