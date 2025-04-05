'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// 动态导入编辑器组件，减少初始加载时间
const SimpleHtmlEditor = dynamic(() => import('@/components/SimpleHtmlEditor'), {
  loading: () => <div className="h-[500px] flex items-center justify-center">加载编辑器中...</div>,
  ssr: false // 确保组件仅在客户端渲染
});

export default function CreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 确保代码仅在客户端运行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 页面加载动画
  useEffect(() => {
    if (!isClient || animationPlayed) return;

    // 使用延迟加载的动画函数
    const runAnimation = async () => {
      try {
        // 等待动画工具加载完成
        const animations = await import('@/lib/animeUtils');
        animations.animatePageElements(() => setAnimationPlayed(true));
      } catch (err) {
        console.error('动画加载失败:', err);
        // 即使动画失败，也标记为已完成
        setAnimationPlayed(true);
      }
    };

    runAnimation();
  }, [animationPlayed, isClient]);

  const handleDeploy = async (html: string, title: string) => {
    if (!html.trim()) {
      toast.error('HTML内容不能为空');
      return;
    }

    if (!title.trim()) {
      toast.error('请输入网页标题');
      return;
    }

    setIsSubmitting(true);
    setDebugError(null);

    try {
      console.log('准备部署网页...');
      
      // 动态导入firebase-utils以减少初始加载时间
      const { createProject } = await import('@/lib/firebase-utils');
      
      const result = await createProject({
        title,
        html_content: html,
        is_public: true
      });

      console.log('网页部署成功:', result);

      // 创建成功动画
      if (isClient) {
        try {
          const animations = await import('@/lib/animeUtils');
          animations.animateSuccessIndicator(() => {
            toast.success('网页部署成功！');
            // 跳转到预览页面
            setTimeout(() => {
              router.push(`/preview/${result.id}`);
            }, 500);
          });
        } catch (err) {
          // 如果动画失败，仍然继续正常流程
          console.error('动画加载失败:', err);
          toast.success('网页部署成功！');
          setTimeout(() => {
            router.push(`/preview/${result.id}`);
          }, 500);
        }
      } else {
        // 无法使用动画时的回退处理
        toast.success('网页部署成功！');
        setTimeout(() => {
          router.push(`/preview/${result.id}`);
        }, 500);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null
          ? JSON.stringify(error)
          : '未知错误';
      
      console.error('部署失败:', errorMessage);
      setDebugError(errorMessage);
      toast.error('部署失败，请稍后重试');

      // 错误抖动动画
      if (isClient) {
        try {
          const animations = await import('@/lib/animeUtils');
          animations.animateErrorContainer();
        } catch (err) {
          console.error('动画加载失败:', err);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 mt-8 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="page-title text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start opacity-0">
            <RocketLaunchIcon className="h-8 w-8 mr-2 text-indigo-600" />
            创建并部署我的网页
          </h1>
          <p className="page-description mt-2 text-lg text-gray-600 max-w-2xl opacity-0">
            只需粘贴您的HTML代码，我们将帮您立即部署一个可访问的网页
          </p>
        </div>
      </motion.div>

      {debugError && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="error-container mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">
                部署过程中遇到问题
              </p>
              <pre className="mt-1 text-xs text-red-700 whitespace-pre-wrap break-words">
                {debugError}
              </pre>
              <p className="mt-2 text-sm text-red-700">
                请检查HTML代码格式或网络连接是否正常。
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="editor-container opacity-0">
        {isClient && <SimpleHtmlEditor onDeploy={handleDeploy} />}
      </div>

      {isSubmitting && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center"
          >
            <motion.div 
              animate={{ 
                rotate: 360,
                borderColor: ['#6366f1', '#8b5cf6', '#6366f1']
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear"
              }}
              className="h-10 w-10 border-t-2 border-b-2 rounded-full mb-4"
            />
            <p className="text-gray-700">正在部署您的网页...</p>
            
            <div className="success-indicator hidden">
              <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* 装饰元素 */}
      <div className="absolute right-0 top-32 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80caff] to-[#4f46e5] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </div>
  );
} 