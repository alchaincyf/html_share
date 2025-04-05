'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { animatePreviewContainer, animateTextAreaPaste } from '@/lib/animeUtils';

interface SimpleHtmlEditorProps {
  initialHtml?: string;
  onDeploy?: (html: string, title: string) => void;
}

export default function SimpleHtmlEditor({ 
  initialHtml = '', 
  onDeploy 
}: SimpleHtmlEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  const [title, setTitle] = useState('我的网页');
  const [previewReady, setPreviewReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // 实时更新预览
  useEffect(() => {
    const updatePreview = () => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(html);
          iframeDoc.close();
          
          // 预览加载完成动画
          if (html.trim() && !previewReady) {
            setPreviewReady(true);
            
            if (previewContainerRef.current) {
              animatePreviewContainer(previewContainerRef.current);
            }
          }
        }
      }
    };

    updatePreview();
  }, [html, previewReady]);

  // 从HTML中提取标题
  useEffect(() => {
    if (html.trim()) {
      try {
        // 使用正则表达式提取title标签内容
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          const extractedTitle = titleMatch[1].trim();
          if (extractedTitle) {
            setTitle(extractedTitle);
          }
        } else {
          // 尝试从iframe中获取标题
          setTimeout(() => {
            if (iframeRef.current) {
              const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
              if (iframeDoc && iframeDoc.title) {
                setTitle(iframeDoc.title);
              }
            }
          }, 500); // 给预览一些加载时间
        }
      } catch (error) {
        console.error('提取标题时出错:', error);
      }
    }
  }, [html]);

  const handleDeploy = () => {
    if (onDeploy) {
      onDeploy(html, title);
    }
  };

  const handlePaste = () => {
    // 聚焦到文本框并触发动画
    if (textareaRef.current) {
      animateTextAreaPaste(textareaRef.current);
    }
  };

  const handleClearPreview = () => {
    setHtml('');
    setPreviewReady(false);
    setTitle('我的网页'); // 重置标题为默认值
  };

  const hasContent = html.trim().length > 0;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-center mb-2 space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-2/3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            网页标题
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-10"
              placeholder="给您的网页起个名字"
            />
            {hasContent && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-gray-500 italic">从HTML提取的标题</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-indigo-700 flex items-center">
              <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
              粘贴您的HTML代码
            </h3>
          </div>
          
          <div className="relative group">
            <motion.div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md shadow-sm">
                点击此处粘贴您的HTML代码
              </span>
            </motion.div>
            
            <textarea
              ref={textareaRef}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              onPaste={handlePaste}
              className="w-full h-64 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm transition-all"
              placeholder="在这里粘贴您的HTML代码..."
              spellCheck="false"
            />
          </div>
        </div>

        {hasContent && (
          <div className="flex justify-end mt-2 space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleClearPreview}
              className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              清除
            </motion.button>
          </div>
        )}
      </div>

      {/* 预览区域 */}
      <div 
        ref={previewContainerRef} 
        className={`w-full ${!hasContent ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}
      >
        <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-green-700 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              实时预览
            </h3>
            {hasContent && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeploy}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-1.5" />
                立即部署
              </motion.button>
            )}
          </div>
          
          <div className="h-[500px] overflow-auto">
            {!hasContent ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
                <p className="text-center px-4">
                  在上方粘贴HTML代码后，预览将在此处显示
                </p>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="HTML Preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            )}
          </div>
        </div>
      </div>

      {/* 指引说明 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800"
      >
        <h4 className="font-medium flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-1.5 text-blue-500" />
          使用提示
        </h4>
        <ul className="mt-2 ml-6 list-disc space-y-1 text-blue-700">
          <li>复制您需要展示的HTML代码，然后粘贴到上方的输入框</li>
          <li>网页标题会自动从您的HTML代码中提取，您也可以手动修改</li>
          <li>输入框下方会实时显示您HTML的预览效果</li>
          <li>满意后，点击&quot;立即部署&quot;按钮发布您的网页</li>
          <li>系统会自动生成一个可分享的链接，您可以将其发送给他人</li>
        </ul>
      </motion.div>
    </div>
  );
} 