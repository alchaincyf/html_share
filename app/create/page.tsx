'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import HtmlEditor from '@/components/HtmlEditor';
import { supabase } from '@/lib/supabase';

export default function CreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      const projectId = uuidv4();
      
      const { error } = await supabase
        .from('html_projects')
        .insert({
          id: projectId,
          title,
          html_content: html,
          is_public: true
        });

      if (error) {
        throw error;
      }

      toast.success('项目创建成功');
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('保存项目失败:', error);
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