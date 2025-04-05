import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin, isFirebaseAdminInitialized } from '@/lib/firebase-admin';

/**
 * 健康检查API端点
 * 用于监控API状态
 */
export async function GET() {
  const requestId = `health_${Date.now()}`;
  console.log(`[${requestId}] 收到健康检查请求`);
  
  const status = {
    api: {
      status: 'operational',
      timestamp: new Date().toISOString()
    },
    firebase: {
      initialized: isFirebaseAdminInitialized(),
      mock_mode: false,
      connection: 'unknown',
      error: null
    },
    environment: {
      node_env: process.env.NODE_ENV || 'unknown',
      firebase_configured: false
    }
  };
  
  // 检查环境变量是否已配置
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];
  
  const missingVars = requiredVars.filter(varName => {
    const value = process.env[varName];
    return !value || value.trim() === '' || value === 'undefined';
  });
  
  status.environment.firebase_configured = missingVars.length === 0;
  
  try {
    // 尝试初始化Firebase
    console.log(`[${requestId}] 检查Firebase连接状态`);
    const firebase = initializeFirebaseAdmin();
    status.firebase.initialized = true;
    status.firebase.mock_mode = firebase.isUsingMockData;
    
    // 尝试进行简单的数据库操作以验证连接
    if (!firebase.isUsingMockData) {
      try {
        // 简单测试Firestore连接
        const testCollection = firebase.adminDb.collection('_health_check');
        const testDocId = `test_${Date.now()}`;
        
        await testCollection.doc(testDocId).set({
          timestamp: new Date(),
          test: true
        });
        
        const doc = await testCollection.doc(testDocId).get();
        await testCollection.doc(testDocId).delete();
        
        status.firebase.connection = doc.exists ? 'connected' : 'failed';
        console.log(`[${requestId}] Firebase连接状态: ${status.firebase.connection}`);
      } catch (dbError) {
        status.firebase.connection = 'error';
        status.firebase.error = dbError instanceof Error ? dbError.message : String(dbError);
        console.error(`[${requestId}] Firebase连接测试失败:`, dbError);
      }
    } else {
      status.firebase.connection = 'mock_mode';
      console.log(`[${requestId}] Firebase处于模拟模式`);
    }
  } catch (error) {
    status.firebase.connection = 'error';
    status.firebase.error = error instanceof Error ? error.message : String(error);
    console.error(`[${requestId}] 健康检查过程中发生错误:`, error);
  }
  
  // 设置适当的状态码
  const isHealthy = status.firebase.connection === 'connected' || 
                    status.firebase.connection === 'mock_mode';
  
  console.log(`[${requestId}] 健康检查完成, 状态: ${isHealthy ? 'healthy' : 'unhealthy'}`);
  
  return NextResponse.json(
    { status },
    { status: isHealthy ? 200 : 503 }
  );
} 