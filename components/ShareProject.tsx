'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface ShareProjectProps {
  projectId: string;
}

export default function ShareProject({ projectId }: ShareProjectProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/preview/${projectId}`
    : '';

  const copyToClipboard = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setCopied(true);
          toast.success('链接已复制到剪贴板');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error('复制链接失败:', err);
          toast.error('复制链接失败');
        });
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">分享你的HTML项目</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>复制以下链接分享给朋友，他们可以直接浏览你的HTML项目。</p>
        </div>
        <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
              value={shareUrl}
            />
          </div>
          <button
            type="button"
            onClick={copyToClipboard}
            className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {copied ? '已复制' : '复制链接'}
          </button>
        </div>
      </div>
    </div>
  );
} 