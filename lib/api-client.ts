/**
 * API客户端 - 用于与Firebase代理API通信
 * 这个文件提供了一组函数，用于替代直接的Firebase客户端调用
 */

import { ProjectType } from '@/types/project';

// 基础API URL
const API_BASE_URL = '/api/firebase';

// API错误类型
interface ApiError extends Error {
  status?: number;
  details?: string;
}

// 通用fetch错误处理
async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    // 解析响应JSON
    const data = await response.json();
    
    // 检查HTTP状态码
    if (!response.ok) {
      const error = new Error(data.error || `HTTP错误: ${response.status}`) as ApiError;
      error.status = response.status;
      error.details = data.details;
      throw error;
    }
    
    return data;
  } catch (error: unknown) {
    const displayError = error instanceof Error ? error : new Error(String(error));
    console.error(`API请求失败 [${url}]:`, displayError);
    throw displayError;
  }
}

/**
 * 获取所有项目
 * 替代 getAllProjects 函数
 */
export async function apiGetAllProjects(): Promise<ProjectType[]> {
  const data = await fetchWithErrorHandling(`${API_BASE_URL}/projects`);
  return data.projects;
}

/**
 * 获取指定ID的项目
 * 替代 getProject 函数
 */
export async function apiGetProject(projectId: string): Promise<ProjectType> {
  const data = await fetchWithErrorHandling(`${API_BASE_URL}/project/${projectId}`);
  return data.project;
}

/**
 * 创建新项目
 * 替代 createProject 函数
 */
export async function apiCreateProject(
  title: string, 
  htmlContent: string, 
  isPublic: boolean = false,
  userId?: string
): Promise<ProjectType> {
  const data = await fetchWithErrorHandling(`${API_BASE_URL}/project/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      html_content: htmlContent,
      is_public: isPublic,
      user_id: userId,
    }),
  });
  
  return data.project;
}

/**
 * 更新项目
 * 替代 updateProject 函数
 */
export async function apiUpdateProject(
  projectId: string,
  updates: {
    title?: string;
    html_content?: string;
    is_public?: boolean;
  }
): Promise<ProjectType> {
  const data = await fetchWithErrorHandling(`${API_BASE_URL}/project/${projectId}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  return data.project;
}

/**
 * 删除项目
 * 替代 deleteProject 函数
 */
export async function apiDeleteProject(projectId: string): Promise<boolean> {
  const data = await fetchWithErrorHandling(`${API_BASE_URL}/project/${projectId}/delete`, {
    method: 'DELETE',
  });
  
  return data.success;
}

/**
 * 获取所有公开项目
 * 替代 getPublicProjects 函数
 */
export async function apiGetPublicProjects(): Promise<ProjectType[]> {
  const data = await fetchWithErrorHandling(`${API_BASE_URL}/projects/public`);
  return data.projects;
} 