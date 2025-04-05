'use client';

import { useEffect, useState } from 'react';
import { apiGetProject } from '@/lib/api-client';

export default function PreviewPage({ params }: { params: { id: string } }) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // 使用API客户端获取项目
        const projectData = await apiGetProject(params.id);

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

  // 使用iframe替代document.write，更安全
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        srcDoc={htmlContent || ''}
        title="HTML预览"
        style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-scripts allow-forms"
      />
    </div>
  );
} 