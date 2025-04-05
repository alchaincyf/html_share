import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// DELETE请求处理程序 - 删除项目
export async function DELETE(
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
    const docRef = adminDb.collection(COLLECTION_NAME).doc(projectId);

    // 检查文档是否存在
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }

    // 删除文档
    await docRef.delete();

    // 返回结果
    return NextResponse.json({ 
      success: true,
      message: '项目已成功删除'
    }, { status: 200 });
  } catch (error: any) {
    console.error(`删除项目失败 [ID: ${params.id}]:`, error);
    return NextResponse.json(
      { error: '删除项目失败', details: error.message },
      { status: 500 }
    );
  }
} 