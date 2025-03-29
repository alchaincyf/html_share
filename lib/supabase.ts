import { createClient } from '@supabase/supabase-js';

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 检查URL有效性
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 验证Supabase URL
if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  console.error('无效的Supabase URL:', supabaseUrl);
}

// 验证Supabase Anon Key
if (!supabaseAnonKey) {
  console.error('Supabase Anon Key 未设置');
}

// 创建Supabase客户端
export const supabase = createClient(
  isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey
);

// 定义HTML项目的类型
export type HtmlProject = {
  id: string;
  title: string;
  html_content: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_public: boolean;
}; 