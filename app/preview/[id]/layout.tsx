export const metadata = {
  title: 'HTML预览',
  description: '用户HTML内容预览',
};

export default function PreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
} 