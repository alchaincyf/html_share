'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import HtmlEditor from '@/components/HtmlEditor';
import { createProject } from '@/lib/firebase-utils';

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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">创建新项目</h1>
        <p className="mt-1 text-sm text-gray-600">
          粘贴您的HTML代码，预览效果并保存分享
        </p>
      </div>

      {debugError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">
                调试信息：
              </p>
              <pre className="mt-1 text-xs text-red-700 whitespace-pre-wrap break-words">
                {debugError}
              </pre>
              <p className="mt-2 text-sm text-red-700">
                请检查Firebase连接、项目设置和环境变量是否正确配置。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 sm:p-6">
        <HtmlEditor onSave={handleSave} />
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <p className="text-gray-700">保存中，请稍候...</p>
          </div>
        </div>
      )}
    </div>
  );
} 