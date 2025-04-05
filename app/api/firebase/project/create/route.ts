import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin, formatDoc } from '@/lib/firebase-admin';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// POST请求处理程序 - 创建新项目
export async function POST(request: NextRequest) {
  try {
    // 初始化Firebase Admin
    const { adminDb } = initializeFirebaseAdmin();
    
    // 从请求体获取数据
    const body = await request.json();
    const { title, html_content, is_public, user_id } = body;

    // 检查必要字段
    if (!title || !html_content) {
      return NextResponse.json(
        { error: '标题和HTML内容是必填项' },
        { status: 400 }
      );
    }

    // 构建要保存的数据
    const now = new Date();
    const projectData: Record<string, unknown> = {
      title,
      html_content,
      created_at: now,
      updated_at: now,
      is_public: !!is_public, // 确保布尔值
    };
    
    // 只有当user_id存在时才添加
    if (user_id) {
      projectData.user_id = user_id;
    }

    // 添加文档
    const docRef = await adminDb.collection(COLLECTION_NAME).add(projectData);
    
    // 获取新创建的文档
    const docSnapshot = await docRef.get();
    const project = formatDoc(docSnapshot);

    // 返回结果
    return NextResponse.json({ 
      success: true,
      project
    }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('创建项目失败:', error);
    return NextResponse.json(
      { error: '创建项目失败', details: errorMessage },
      { status: 500 }
    );
  }
} 