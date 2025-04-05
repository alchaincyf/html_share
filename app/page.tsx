'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRightIcon, CodeBracketIcon, ShareIcon, FolderIcon } from '@heroicons/react/24/outline';
import TypedText from '@/components/TypedText';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/AnimatedButton';

// 延迟加载重要性较低的动画内容
const LazyFeatureSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // 使用requestIdleCallback在浏览器空闲时间加载特性部分
    const loadFeatures = () => setIsLoaded(true);
    
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        // 使用更具体的类型定义
        type RequestIdleCallbackFn = (
          callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void,
          options?: { timeout: number }
        ) => number;
        
        const requestIdleCallback = window.requestIdleCallback as RequestIdleCallbackFn;
        requestIdleCallback(loadFeatures, { timeout: 2000 });
      } else {
        // 退回到setTimeout作为后备方案
        const timer = setTimeout(loadFeatures, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);
  
  const featureItems = [
    {
      icon: CodeBracketIcon,
      title: "实时预览",
      description: "实时查看您的HTML代码效果，支持JavaScript交互，让开发过程更流畅、更直观。"
    },
    {
      icon: ShareIcon,
      title: "一键分享",
      description: "生成唯一的分享链接，轻松与他人分享您的HTML项目，无需任何部署或复杂配置。"
    },
    {
      icon: FolderIcon,
      title: "项目管理",
      description: "保存并管理您的HTML项目，随时可以编辑和更新，轻松进行版本管理和迭代优化。"
    }
  ];
  
  if (!isLoaded) {
    return <div className="h-96 bg-gradient-to-b from-white to-indigo-50 py-24 sm:py-32 w-full" />;
  }
  
  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 py-24 sm:py-32 w-full">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-indigo-600">更简单、更高效</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            为创作者打造的创新体验
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            AIPage.top 提供了一系列强大而直观的功能，让HTML创作和分享变得前所未有的简单。
          </p>
        </motion.div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {featureItems.map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover-lift"
              >
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    {feature.description}
                  </p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  // 减少初始动画数量和复杂度
  return (
    <div className="relative isolate overflow-hidden">
      {/* 简化背景装饰 */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 pt-24 pb-12 sm:pt-32 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/20 mb-6">
            全新体验
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              AIPage.top
            </span>
            <br />
            <span className="text-2xl sm:text-4xl mt-2 block">
              <TypedText 
                strings={[
                  "HTML创作与即时分享平台", 
                  "网页开发的最佳助手",
                  "所见即所得的HTML编辑器"
                ]}
                typeSpeed={80}
                backSpeed={50}
                loop={true}
                className="inline"
              />
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            轻松创建、预览和分享您的HTML页面，无需部署，所见即所得，完全像是一个独立的网站。
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <AnimatedButton
              href="/create"
              className="rounded-full group relative overflow-hidden bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-xl transition-all duration-300 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span className="relative z-10">开始创建</span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </AnimatedButton>
            <AnimatedButton 
              href="/projects" 
              className="group text-sm font-semibold leading-6 text-gray-900 flex items-center"
            >
              查看项目库 
              <ArrowUpRightIcon className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
      
      {/* 特点展示部分 - 延迟加载 */}
      <LazyFeatureSection />

      {/* 简化底部装饰背景 */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </div>
  );
}
