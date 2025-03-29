'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import type { HtmlProject } from '@/lib/supabase';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<HtmlProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('正在连接 Supabase...');
        // 先测试连接
        const { error: connectionError } = await supabase.from('html_projects').select('count');
        
        if (connectionError) {
          console.error('Supabase 连接测试失败:', connectionError);
          setErrorDetails(`连接错误: ${connectionError.message || JSON.stringify(connectionError)}`);
          throw connectionError;
        }
        
        console.log('连接成功，正在获取项目列表...');
        const { data, error } = await supabase
          .from('html_projects')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('获取项目数据失败:', error);
          setErrorDetails(`数据错误: ${error.message || JSON.stringify(error)}`);
          throw error;
        }

        console.log(`成功获取 ${data?.length || 0} 个项目`);
        setProjects(data || []);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : typeof error === 'object' && error !== null
            ? JSON.stringify(error)
            : '未知错误';
            
        console.error('获取项目列表失败:', error);
        setErrorDetails(errorMessage);
        toast.error('获取项目列表失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的HTML项目</h1>
          <p className="mt-1 text-sm text-gray-600">
            管理并分享您的HTML项目
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            创建新项目
          </Link>
        </div>
      </div>

      {errorDetails && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                数据库连接错误：{errorDetails}
              </p>
              <p className="mt-2 text-sm text-red-700">
                请确保已经在 Supabase 中创建了 html_projects 表，并在 .env.local 文件中设置了正确的 URL 和 API Key。
              </p>
            </div>
          </div>
        </div>
      )}

      {!errorDetails && projects.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">您还没有任何HTML项目</p>
          <Link
            href="/create"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            创建您的第一个项目
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id} className="hover:bg-gray-50">
                <Link href={`/projects/${project.id}`} className="block">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-indigo-600 truncate">
                        {project.title}
                      </h3>
                      <div className="flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {project.is_public ? '公开' : '私有'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          创建于: {formatDate(project.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          最后更新: {formatDate(project.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 