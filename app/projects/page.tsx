'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getAllProjects } from '@/lib/firebase-utils';
import type { HtmlProject } from '@/lib/firebase';
import { FolderIcon, PlusIcon, ClockIcon, CalendarIcon, GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

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
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="ml-3 text-indigo-500 font-medium">正在加载您的项目...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FolderIcon className="h-8 w-8 text-indigo-600 mr-2" />
            我的页面项目库
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            在这里管理和访问您创建的所有HTML页面项目，随时可以编辑和分享
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/create"
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            创建新项目
          </Link>
        </div>
      </div>

      {connectionStatus === 'connected' && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-sm text-green-700">连接正常，您的项目数据已成功加载</p>
        </div>
      )}

      {errorDetails && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
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
                请检查网络连接或稍后再试。
              </p>
              <div className="mt-3">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                >
                  重新加载
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!errorDetails && projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <FolderIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">项目库为空</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">您还没有创建任何HTML项目，立即开始创建您的第一个项目吧！</p>
          <Link
            href="/create"
            className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 rounded-full font-medium hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            创建第一个项目
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="block group">
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex-shrink-0">
                    {project.is_public ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <GlobeAltIcon className="h-3 w-3 mr-1" />
                        公开
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <LockClosedIcon className="h-3 w-3 mr-1" />
                        私有
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-5 py-4 flex-1">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>创建于: {formatDate(project.created_at)}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>最后更新: {formatDate(project.updated_at)}</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 text-right">
                  <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors flex items-center justify-end">
                    查看详情
                    <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 