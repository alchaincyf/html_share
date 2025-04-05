import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin, formatDoc } from '@/lib/firebase-admin';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// GET请求处理程序 - 获取所有项目
export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _request: NextRequest
) {
  try {
    // 初始化Firebase Admin
    const { adminDb } = initializeFirebaseAdmin();
    
    // 创建查询 - 按更新时间倒序排列
    const projectsRef = adminDb.collection(COLLECTION_NAME);
    const querySnapshot = await projectsRef
      .orderBy('updated_at', 'desc')
      .get();
    
    // 格式化结果
    const projects = querySnapshot.docs.map(doc => formatDoc(doc));

    // 返回结果
    return NextResponse.json({ 
      projects,
      count: projects.length
    }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('获取项目列表失败:', error);
    return NextResponse.json(
      { error: '获取项目列表失败', details: errorMessage },
      { status: 500 }
    );
  }
} 