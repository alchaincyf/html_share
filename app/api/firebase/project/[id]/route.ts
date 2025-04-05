import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin, formatDoc } from '@/lib/firebase-admin';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// GET请求处理程序 - 获取单个项目
export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 初始化Firebase Admin
    const { adminDb } = initializeFirebaseAdmin();
    
    // 获取项目ID
    const projectId = params.id;
    if (!projectId) {
      return NextResponse.json(
        { error: '缺少项目ID' },
        { status: 400 }
      );
    }

    // 获取文档引用
    const docRef = adminDb.collection(COLLECTION_NAME).doc(projectId);
    
    // 获取文档
    const docSnapshot = await docRef.get();
    
    // 检查文档是否存在
    if (!docSnapshot.exists) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }
    
    // 格式化文档
    const project = formatDoc(docSnapshot);
    
    // 返回结果
    return NextResponse.json({ project }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`获取项目失败 [ID: ${params.id}]:`, error);
    return NextResponse.json(
      { error: '获取项目失败', details: errorMessage },
      { status: 500 }
    );
  }
} 