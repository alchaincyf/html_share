'use client';

import { useEffect, useState } from 'react';
import { getProject } from '@/lib/firebase-utils';

export default function PreviewPage({ params }: { params: { id: string } }) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProject(params.id);

        if (!projectData || !projectData.is_public) {
          setError('项目不存在或不可访问');
          return;
        }

        // 设置页面标题为项目标题
        if (projectData.title) {
          document.title = projectData.title;
        }

        setHtmlContent(projectData.html_content);
      } catch (err) {
        console.error('获取项目失败:', err);
        setError('获取项目失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  useEffect(() => {
    if (htmlContent) {
      try {
        // 将HTML内容设置为整个文档内容
        document.open();
        document.write(htmlContent);
        document.close();
        
        // 恢复滚动行为
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      } catch (error) {
        console.error('渲染HTML内容时出错:', error);
        setError('渲染HTML内容时出错');
      }
    }
  }, [htmlContent]);

  // 加载状态和错误状态需要显示，但一旦HTML内容加载完成，
  // document.write将替换整个页面，所以这里的返回值不再重要
  if (isLoading) {
    return (
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        加载中...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: 'red', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        {error}
      </div>
    );
  }

  // 返回一个空div，因为document.write已经替换了整个页面内容
  return <div></div>;
} 