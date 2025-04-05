'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getAllProjects } from '@/lib/firebase-utils';
import type { HtmlProject } from '@/lib/firebase';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<HtmlProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'checking' | 'connected' | 'failed'
  >('checking');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('正在连接 Firebase...');
        setConnectionStatus('checking');
        
        // 获取项目列表
        const projectsList = await getAllProjects();
        
        console.log(`成功获取 ${projectsList?.length || 0} 个项目`);
        setProjects(projectsList || []);
        setErrorDetails(null);
        setConnectionStatus('connected');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : typeof error === 'object' && error !== null
            ? JSON.stringify(error)
            : '未知错误';
            
        console.error('获取项目列表失败:', error);
        setErrorDetails(errorMessage);
        setConnectionStatus('failed');
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

      {connectionStatus === 'connected' && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-3 flex items-center">
          <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <p className="text-sm text-green-700">数据库连接正常</p>
        </div>
      )}

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
                请确保已经在 Firebase 中创建了 html_projects 集合，并在 .env.local 文件中设置了正确的 Firebase 配置。
              </p>
              <div className="mt-3">
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  重新加载页面
                </button>
              </div>
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