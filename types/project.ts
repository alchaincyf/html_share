/**
 * 项目类型定义
 */

// 项目类型
export interface ProjectType {
  id: string;
  title: string;
  html_content: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  user_id?: string;
} 