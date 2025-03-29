import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">页面不存在</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        您尝试访问的页面可能已被删除、移动或从未存在。
      </p>
      <Link 
        href="/" 
        className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
} 