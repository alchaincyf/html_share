import { NextRequest, NextResponse } from 'next/server';
import { adminDb, formatDoc } from '@/lib/firebase-admin';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// POST请求处理程序 - 更新项目
export async function POST(
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

    // 从请求体获取数据
    const body = await request.json();
    const { title, html_content, is_public } = body;

    // 构建更新数据
    const updateData: any = {
      updated_at: new Date() // 总是更新时间戳
    };

    // 只更新提供的字段
    if (title !== undefined) updateData.title = title;
    if (html_content !== undefined) updateData.html_content = html_content;
    if (is_public !== undefined) updateData.is_public = !!is_public;

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

    // 更新文档
    await docRef.update(updateData);

    // 获取更新后的文档
    const updatedSnapshot = await docRef.get();
    const project = formatDoc(updatedSnapshot);

    // 返回结果
    return NextResponse.json({ 
      success: true,
      project
    }, { status: 200 });
  } catch (error: any) {
    console.error(`更新项目失败 [ID: ${params.id}]:`, error);
    return NextResponse.json(
      { error: '更新项目失败', details: error.message },
      { status: 500 }
    );
  }
} 