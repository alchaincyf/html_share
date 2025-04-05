'use client';

import { useEffect, useState } from 'react';
import { getProject } from '@/lib/firebase-utils';
import type { HtmlProject } from '@/lib/firebase';

export default function RawHtmlContent({ id }: { id: string }) {
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 禁用滚动条
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    const fetchProject = async () => {
      try {
        const projectData = await getProject(id);

        if (!projectData || !projectData.is_public) {
          setError('项目不存在或不可访问');
          return;
        }

        setHtml(projectData.html_content);
      } catch (err) {
        console.error('获取项目失败:', err);
        setError('获取项目失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();

    // 清理函数，恢复默认滚动行为
    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    };
  }, [id]);

  // 如果正在加载，显示最小化的加载状态
  if (isLoading) {
    return <div style={{ padding: '20px' }}>加载中...</div>;
  }

  // 如果有错误，显示最小化的错误信息
  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  // 直接输出HTML内容
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: html }} 
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    />
  );
} 