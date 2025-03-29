'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import HtmlEditor from '@/components/HtmlEditor';
import ShareProject from '@/components/ShareProject';
import { supabase } from '@/lib/supabase';
import type { HtmlProject } from '@/lib/supabase';

export default function ProjectContent({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<HtmlProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setDebugError(null);
      try {
        console.log('正在获取项目数据，ID:', id);
        const { data, error } = await supabase
          .from('html_projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          const errorMsg = `获取项目数据失败: ${error.message || JSON.stringify(error)}`;
          console.error(errorMsg);
          setDebugError(errorMsg);
          throw new Error(errorMsg);
        }

        console.log('成功获取项目数据:', data ? '数据正常' : '没有数据');
        setProject(data);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : typeof error === 'object' && error !== null
            ? JSON.stringify(error)
            : '未知错误';
        
        console.error('获取项目失败:', errorMessage);
        setDebugError(errorMessage);
        toast.error('获取项目失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleUpdate = async (html: string, title: string) => {
    if (!project) return;

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
      console.log('准备更新项目:', project.id);
      const { error } = await supabase
        .from('html_projects')
        .update({
          title,
          html_content: html,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) {
        const errorMsg = `更新项目失败: ${error.message || JSON.stringify(error)}`;
        console.error(errorMsg);
        setDebugError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('项目更新成功');
      setProject({
        ...project,
        title,
        html_content: html,
        updated_at: new Date().toISOString()
      });
      
      setIsEditing(false);
      toast.success('项目更新成功');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null
          ? JSON.stringify(error)
          : '未知错误';
      
      console.error('更新项目失败:', errorMessage);
      setDebugError(errorMessage);
      toast.error('更新项目失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除此项目吗？此操作不可撤销。')) {
      return;
    }

    setDebugError(null);
    try {
      console.log('准备删除项目:', id);
      const { error } = await supabase
        .from('html_projects')
        .delete()
        .eq('id', id);

      if (error) {
        const errorMsg = `删除项目失败: ${error.message || JSON.stringify(error)}`;
        console.error(errorMsg);
        setDebugError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('项目删除成功');
      toast.success('项目已删除');
      router.push('/projects');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null
          ? JSON.stringify(error)
          : '未知错误';
      
      console.error('删除项目失败:', errorMessage);
      setDebugError(errorMessage);
      toast.error('删除项目失败');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  // 显示调试错误信息
  if (debugError) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">
                调试信息：
              </p>
              <pre className="mt-1 text-xs text-red-700 whitespace-pre-wrap break-words">
                {debugError}
              </pre>
              <p className="mt-2 text-sm text-red-700">
                请检查Supabase连接、项目设置和环境变量是否正确配置。
              </p>
              <div className="mt-3">
                <Link
                  href="/projects"
                  className="text-red-700 font-medium hover:text-red-600"
                >
                  返回我的项目
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">项目不存在</h2>
        <p className="text-gray-600 mb-6">该项目可能已被删除或不存在</p>
        <Link
          href="/projects"
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          返回我的项目
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            上次更新: {new Date(project.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                编辑项目
              </button>
              <Link
                href={`/preview/${project.id}`}
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                在新窗口中预览
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                删除项目
              </button>
            </>
          )}
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              取消编辑
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 sm:p-6">
          <HtmlEditor 
            initialHtml={project.html_content} 
            onSave={handleUpdate} 
            isEditing={true}
          />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <ShareProject projectId={project.id} />
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg font-medium leading-6 text-gray-900">HTML 预览</h3>
            </div>
            <div className="h-[600px] w-full">
              <iframe
                srcDoc={project.html_content}
                title={project.title}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </div>
          </div>
        </>
      )}

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