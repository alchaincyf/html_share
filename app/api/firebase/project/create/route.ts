import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin, formatDoc } from '@/lib/firebase-admin';
import { getSafeHTML } from '@/lib/html-utils';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// POST请求处理程序 - 创建新项目
export async function POST(request: NextRequest) {
  try {
    console.log('开始处理创建项目请求');
    
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
    
    const { title, html_content, is_public, user_id } = body;

    // 检查必要字段
    if (!title || !html_content) {
      console.log('缺少必要字段', { title: !!title, html_content: !!html_content });
      return NextResponse.json(
        { error: '标题和HTML内容是必填项' },
        { status: 400 }
      );
    }

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

    // 处理HTML内容以提高安全性
    const safeHtmlContent = getSafeHTML(html_content);

    // 构建要保存的数据
    const now = new Date();
    const projectData: Record<string, unknown> = {
      title,
      html_content: safeHtmlContent,
      created_at: now,
      updated_at: now,
      is_public: !!is_public, // 确保布尔值
    };
    
    // 只有当user_id存在时才添加
    if (user_id) {
      projectData.user_id = user_id;
    }

    console.log('准备添加新项目到Firestore');
    
    // 添加文档
    let docRef;
    try {
      docRef = await adminDb.collection(COLLECTION_NAME).add(projectData);
      console.log('项目成功添加到Firestore, ID:', docRef.id);
    } catch (firestoreError) {
      console.error('添加文档到Firestore失败:', firestoreError);
      return NextResponse.json(
        { 
          error: '保存项目失败', 
          details: firestoreError instanceof Error ? firestoreError.message : String(firestoreError) 
        },
        { status: 500 }
      );
    }
    
    // 获取新创建的文档
    let docSnapshot;
    try {
      docSnapshot = await docRef.get();
      console.log('成功获取新建项目数据');
    } catch (getDocError) {
      console.error('获取新创建的文档失败:', getDocError);
      return NextResponse.json(
        { 
          error: '获取创建的项目失败', 
          details: getDocError instanceof Error ? getDocError.message : String(getDocError),
          project_id: docRef.id // 至少返回项目ID
        },
        { status: 500 }
      );
    }
    
    const project = formatDoc(docSnapshot);

    // 返回结果
    console.log('项目创建成功');
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