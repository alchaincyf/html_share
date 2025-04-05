import { NextRequest, NextResponse } from 'next/server';

/**
 * 健康检查API端点
 * 用于监控API状态
 */
export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _request: NextRequest
) {
  try {
    // 检查Firebase Admin SDK是否可以导入
    let firebaseAdminStatus = 'unknown';
    
    try {
      // 测试可以导入Firebase Admin模块，但不初始化
      const { admin } = await import('@/lib/firebase-admin');
      if (admin) {
        firebaseAdminStatus = 'available';
      }
    } catch (error) {
      firebaseAdminStatus = 'error';
      console.error('Firebase Admin SDK导入检查失败:', error);
    }

    // 获取当前时间
    const timestamp = new Date().toISOString();
    
    // 返回状态信息
    return NextResponse.json({
      status: 'healthy',
      timestamp,
      api_version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      firebase_admin: firebaseAdminStatus
    }, { status: 200 });
  } catch (error: unknown) {
    // 如果发生错误，返回错误信息
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      status: 'unhealthy',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 