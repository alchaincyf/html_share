'use client';

import { useEffect, useState } from 'react';
import { getProject } from '@/lib/firebase-utils';
import type { HtmlProject } from '@/lib/firebase';

export default function PreviewContent({ id }: { id: string }) {
  const [project, setProject] = useState<HtmlProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProject(id);

        if (!projectData || !projectData.is_public) {
          setError('项目不存在或不可访问');
          return;
        }

        setProject(projectData);
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

  // 直接返回HTML内容，完全替换页面内容
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: project.html_content }} 
      style={{ 
        height: '100%', 
        width: '100%', 
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0
      }}
    />
  );
} 