'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import HtmlEditor from '@/components/HtmlEditor';
import { createProject } from '@/lib/firebase-utils';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { DocumentPlusIcon } from '@heroicons/react/24/solid';

export default function CreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);

  const handleSave = async (html: string, title: string) => {
    if (!html.trim()) {
      toast.error('HTML内容不能为空');
      return;
    }

    if (!title.trim()) {
      toast.error('请输入项目标题');
      return;
    }

    setIsSubmitting(true);
    setDebugError(null);

    try {
      console.log('准备创建项目...');
      
      const result = await createProject({
        title,
        html_content: html,
        is_public: true
      });

      console.log('项目创建成功:', result);
      toast.success('项目创建成功');
      router.push(`/projects/${result.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null
          ? JSON.stringify(error)
          : '未知错误';
      
      console.error('保存项目失败:', errorMessage);
      setDebugError(errorMessage);
      toast.error('保存项目失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start">
            <DocumentPlusIcon className="h-8 w-8 mr-2 text-indigo-600" />
            创建新页面
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl">
            粘贴您的HTML代码，即时预览效果并一键部署分享
          </p>
        </div>
        <div className="hidden sm:flex mt-4 sm:mt-0 space-x-2 items-center bg-indigo-50 px-4 py-2 rounded-lg">
          <CodeBracketIcon className="h-5 w-5 text-indigo-500" />
          <span className="text-sm text-indigo-700">开始创作，无限可能</span>
        </div>
      </div>

      {debugError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">
                创建过程中遇到问题
              </p>
              <pre className="mt-1 text-xs text-red-700 whitespace-pre-wrap break-words">
                {debugError}
              </pre>
              <p className="mt-2 text-sm text-red-700">
                请检查网络连接或稍后重试。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl overflow-hidden p-4 sm:p-6 border border-gray-100">
        <HtmlEditor onSave={handleSave} />
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-700">正在保存您的创作...</p>
          </div>
        </div>
      )}
      
      {/* 装饰元素 */}
      <div className="absolute right-0 top-32 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80caff] to-[#4f46e5] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </div>
  );
} 