import { NextRequest, NextResponse } from 'next/server';
import { adminDb, formatDoc } from '@/lib/firebase-admin';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// GET请求处理程序 - 获取所有公开项目
export async function GET(request: NextRequest) {
  try {
    // 创建查询 - 查找所有is_public为true的项目并按更新时间排序
    const projectsRef = adminDb.collection(COLLECTION_NAME);
    const querySnapshot = await projectsRef
      .where('is_public', '==', true)
      .orderBy('updated_at', 'desc')
      .get();
    
    // 格式化结果
    const projects = querySnapshot.docs.map(doc => formatDoc(doc));

    // 返回结果
    return NextResponse.json({ 
      projects,
      count: projects.length
    }, { status: 200 });
  } catch (error: any) {
    console.error('获取公开项目失败:', error);
    return NextResponse.json(
      { error: '获取公开项目失败', details: error.message },
      { status: 500 }
    );
  }
} 