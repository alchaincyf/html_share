import { NextRequest, NextResponse } from 'next/server';
import { adminDb, formatDoc } from '@/lib/firebase-admin';
import { collection, query, orderBy, getDocs } from 'firebase-admin/firestore';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// GET请求处理程序 - 获取所有项目
export async function GET(request: NextRequest) {
  try {
    // 构建查询
    const projectsRef = collection(adminDb, COLLECTION_NAME);
    const q = query(projectsRef, orderBy('updated_at', 'desc'));
    
    // 执行查询
    const snapshot = await getDocs(q);
    
    // 格式化结果
    const projects = snapshot.docs.map(doc => formatDoc(doc));
    
    // 返回结果
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error: any) {
    console.error('获取项目列表失败:', error);
    return NextResponse.json(
      { error: '获取项目列表失败', details: error.message },
      { status: 500 }
    );
  }
} 