'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { HtmlProject } from '@/lib/supabase';

export default function PreviewContent({ id }: { id: string }) {
  const [project, setProject] = useState<HtmlProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('html_projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data || !data.is_public) {
          setError('项目不存在或不可访问');
          return;
        }

        setProject(data);
      } catch (err) {
        console.error('获取项目失败:', err);
        setError('获取项目失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error || !project) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-bold">{error || '项目不存在'}</p>
      </div>
    );
  }

  // 直接返回HTML内容，不包含任何框架元素
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: project.html_content }} 
      style={{ height: '100vh', width: '100vw', overflow: 'auto' }}
    />
  );
} 