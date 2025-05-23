import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin, formatDoc } from '@/lib/firebase-admin';
import { getSafeHTML } from '@/lib/html-utils';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// POST请求处理程序 - 更新项目
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('开始处理更新项目请求', params.id);
    
    // 初始化Firebase Admin
    let adminDb;
    try {
      const firebaseAdmin = initializeFirebaseAdmin();
      adminDb = firebaseAdmin.adminDb;
      console.log('Firebase Admin SDK初始化成功');
    } catch (initError) {
      console.error('Firebase Admin SDK初始化失败:', initError);
      return NextResponse.json(
        { 
          error: '初始化Firebase失败', 
          details: initError instanceof Error ? initError.message : String(initError) 
        },
        { status: 500 }
      );
    }
    
    // 获取项目ID
    const projectId = params.id;
    if (!projectId) {
      return NextResponse.json(
        { error: '缺少项目ID' },
        { status: 400 }
      );
    }

    // 从请求体获取数据
    let body;
    try {
      body = await request.json();
      console.log('成功解析请求体');
    } catch (parseError) {
      console.error('解析请求体失败:', parseError);
      return NextResponse.json(
        { error: '请求体解析失败', details: String(parseError) },
        { status: 400 }
      );
    }
    
    const { title, html_content, is_public } = body;

    // 构建更新数据
    const updateData: Record<string, unknown> = {
      updated_at: new Date() // 总是更新时间戳
    };

    // 只更新提供的字段
    if (title !== undefined) updateData.title = title;
    if (html_content !== undefined) {
      // 处理HTML内容以提高安全性
      updateData.html_content = getSafeHTML(html_content);
    }
    if (is_public !== undefined) updateData.is_public = !!is_public;

    // 获取文档引用
    const docRef = adminDb.collection(COLLECTION_NAME).doc(projectId);

    // 检查文档是否存在
    let docSnapshot;
    try {
      docSnapshot = await docRef.get();
      if (!docSnapshot.exists) {
        return NextResponse.json(
          { error: '项目不存在' },
          { status: 404 }
        );
      }
      console.log('文档存在，准备更新');
    } catch (getDocError) {
      console.error('获取文档失败:', getDocError);
      return NextResponse.json(
        { 
          error: '检查项目是否存在失败', 
          details: getDocError instanceof Error ? getDocError.message : String(getDocError) 
        },
        { status: 500 }
      );
    }

    // 更新文档
    try {
      await docRef.update(updateData);
      console.log('文档更新成功');
    } catch (updateError) {
      console.error('更新文档失败:', updateError);
      return NextResponse.json(
        { 
          error: '更新项目失败', 
          details: updateError instanceof Error ? updateError.message : String(updateError) 
        },
        { status: 500 }
      );
    }

    // 获取更新后的文档
    let updatedSnapshot;
    try {
      updatedSnapshot = await docRef.get();
      console.log('成功获取更新后的项目');
    } catch (getUpdatedError) {
      console.error('获取更新后的文档失败:', getUpdatedError);
      return NextResponse.json(
        { 
          error: '获取更新后的项目失败', 
          details: getUpdatedError instanceof Error ? getUpdatedError.message : String(getUpdatedError) 
        },
        { status: 500 }
      );
    }
    
    const project = formatDoc(updatedSnapshot);

    // 返回结果
    console.log('项目更新成功完成');
    return NextResponse.json({ 
      success: true,
      project
    }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`更新项目失败 [ID: ${params.id}]:`, error);
    return NextResponse.json(
      { error: '更新项目失败', details: errorMessage },
      { status: 500 }
    );
  }
} 