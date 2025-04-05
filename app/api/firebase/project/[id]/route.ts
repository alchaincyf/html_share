import { NextRequest, NextResponse } from 'next/server';
import { adminDb, formatDoc } from '@/lib/firebase-admin';
import { doc, getDoc } from 'firebase-admin/firestore';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// GET请求处理程序 - 获取单个项目
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取项目ID
    const projectId = params.id;
    if (!projectId) {
      return NextResponse.json(
        { error: '缺少项目ID' },
        { status: 400 }
      );
    }

    // 获取文档引用
    const docRef = doc(adminDb, COLLECTION_NAME, projectId);
    
    // 获取文档
    const docSnapshot = await getDoc(docRef);
    
    // 检查文档是否存在
    if (!docSnapshot.exists()) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }
    
    // 格式化文档
    const project = formatDoc(docSnapshot);
    
    // 返回结果
    return NextResponse.json({ project }, { status: 200 });
  } catch (error: any) {
    console.error(`获取项目失败 [ID: ${params.id}]:`, error);
    return NextResponse.json(
      { error: '获取项目失败', details: error.message },
      { status: 500 }
    );
  }
} 