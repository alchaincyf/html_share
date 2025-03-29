'use client';

import { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface HtmlEditorProps {
  initialHtml?: string;
  onSave?: (html: string, title: string) => void;
  isEditing?: boolean;
}

export default function HtmlEditor({ initialHtml = '', onSave, isEditing = false }: HtmlEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  const [title, setTitle] = useState('未命名项目');
  const [previewKey, setPreviewKey] = useState(Date.now());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 当HTML内容改变时更新预览
  useEffect(() => {
    updatePreview();
  }, [html, previewKey]);

  const updatePreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
      }
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(html, title);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col sm:flex-row items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-2/3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            项目标题
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="输入项目标题"
          />
        </div>
        
        <div className="flex space-x-2 w-full sm:w-1/3 justify-end">
          <button
            type="button"
            onClick={() => setPreviewKey(Date.now())}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            刷新预览
          </button>
          
          {onSave && (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isEditing ? '更新' : '保存'}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/2">
          <div className="border rounded-md">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="text-sm font-medium">HTML 代码</h3>
            </div>
            <div className="relative">
              <SyntaxHighlighter
                language="html"
                style={atomDark}
                customStyle={{
                  margin: 0,
                  borderRadius: '0 0 0.375rem 0.375rem',
                }}
              >
                {html}
              </SyntaxHighlighter>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 resize-none p-4"
                placeholder="输入HTML代码..."
                style={{ fontFamily: 'monospace', fontSize: '14px' }}
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="border rounded-md h-[500px]">
            <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
              <h3 className="text-sm font-medium">预览</h3>
            </div>
            <div className="h-[calc(500px-37px)] overflow-auto">
              <iframe
                ref={iframeRef}
                title="HTML Preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 