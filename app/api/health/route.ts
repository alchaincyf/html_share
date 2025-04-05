import { NextRequest, NextResponse } from 'next/server';

/**
 * 健康检查API端点
 * 用于监控API状态
 */
export async function GET(request: NextRequest) {
  try {
    // 检查Firebase Admin SDK是否已初始化
    let firebaseAdminStatus = 'unknown';
    
    try {
      const { adminDb } = await import('@/lib/firebase-admin');
      // 如果没有抛出错误，说明初始化成功
      firebaseAdminStatus = 'initialized';
    } catch (error) {
      firebaseAdminStatus = 'error';
      console.error('Firebase Admin SDK初始化检查失败:', error);
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
  } catch (error: any) {
    // 如果发生错误，返回错误信息
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 