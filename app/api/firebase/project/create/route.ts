import { NextRequest, NextResponse } from 'next/server';
import { adminDb, formatDoc } from '@/lib/firebase-admin';
import { collection, addDoc, getDoc } from 'firebase-admin/firestore';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// POST请求处理程序 - 创建新项目
export async function POST(request: NextRequest) {
  try {
    // 从请求体获取数据
    const body = await request.json();
    const { title, html_content, is_public = true, user_id = null } = body;

    // 验证必需的字段
    if (!title) {
      return NextResponse.json(
        { error: '缺少项目标题' },
        { status: 400 }
      );
    }

    if (!html_content) {
      return NextResponse.json(
        { error: '缺少HTML内容' },
        { status: 400 }
      );
    }

    // 当前时间
    const now = new Date();

    // 创建文档
    const docRef = await addDoc(collection(adminDb, COLLECTION_NAME), {
      title,
      html_content,
      is_public: !!is_public,
      user_id,
      created_at: now,
      updated_at: now
    });

    // 获取新创建的文档以返回完整数据
    const snapshot = await getDoc(docRef);
    const project = formatDoc(snapshot);

    // 返回结果
    return NextResponse.json({ 
      success: true,
      project,
      id: docRef.id
    }, { status: 201 });
  } catch (error: any) {
    console.error('创建项目失败:', error);
    return NextResponse.json(
      { error: '创建项目失败', details: error.message },
      { status: 500 }
    );
  }
} 