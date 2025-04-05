/**
 * Firebase Admin SDK 初始化
 * 用于服务器端API路由
 */

import * as admin from 'firebase-admin';

// 定义时间戳类型
type TimestampLike = {
  _seconds?: number;
  seconds?: number;
  toDate?: () => Date;
} | Date | string | number;

// 服务账号凭据
let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;
let isInitialized = false;

/**
 * 初始化 Firebase Admin SDK
 * 仅在实际需要时执行初始化
 */
function initializeFirebaseAdmin() {
  if (isInitialized) return { adminDb, adminAuth };
  
  try {
    // 检查是否已初始化应用
    const apps = admin.apps;
    
    if (!apps.length) {
      // 环境变量中获取Firebase配置
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const databaseURL = process.env.FIREBASE_DATABASE_URL;

      // 详细检查每个环境变量
      const missingVars = [];
      if (!projectId) missingVars.push('FIREBASE_PROJECT_ID');
      if (!privateKey) missingVars.push('FIREBASE_PRIVATE_KEY');
      if (!clientEmail) missingVars.push('FIREBASE_CLIENT_EMAIL');

      // 如果缺少任何必要的环境变量，抛出详细错误
      if (missingVars.length > 0) {
        const errorMsg = `缺少Firebase Admin SDK必要的环境变量配置: ${missingVars.join(', ')}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      try {
        // 初始化应用
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey,
            clientEmail,
          }),
          databaseURL: databaseURL,
        });
        console.log('Firebase Admin SDK初始化成功');
      } catch (initError) {
        const errorMsg = initError instanceof Error 
          ? `Firebase应用初始化失败: ${initError.message}` 
          : 'Firebase应用初始化失败: 未知错误';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
    }

    // 获取Firestore和Auth实例
    try {
      adminDb = admin.firestore();
      adminAuth = admin.auth();
      isInitialized = true;
      
      return { adminDb, adminAuth };
    } catch (serviceError) {
      const errorMsg = serviceError instanceof Error 
        ? `Firebase服务获取失败: ${serviceError.message}` 
        : 'Firebase服务获取失败: 未知错误';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Firebase Admin SDK初始化失败:', error);
    // 重新抛出错误以便API路由可以捕获和处理
    throw error;
  }
}

/**
 * 格式化Firestore时间戳
 */
function formatTimestamp(timestamp: TimestampLike): string {
  if (!timestamp) return '';

  if (typeof timestamp === 'object') {
    if ('_seconds' in timestamp && timestamp._seconds !== undefined) {
      // Firestore Timestamp对象
      return new Date(timestamp._seconds * 1000).toISOString();
    } else if ('seconds' in timestamp && timestamp.seconds !== undefined) {
      // admin.firestore.Timestamp对象
      return new Date(timestamp.seconds * 1000).toISOString();
    } else if ('toDate' in timestamp && typeof timestamp.toDate === 'function') {
      // Firebase Timestamp对象（带有toDate方法）
      return timestamp.toDate().toISOString();
    } else if (timestamp instanceof Date) {
      // JavaScript Date对象
      return timestamp.toISOString();
    }
  }

  // 其他格式（如ISO字符串）
  return String(timestamp);
}

/**
 * 格式化Firestore文档
 */
function formatDoc(doc: admin.firestore.DocumentSnapshot): Record<string, unknown> {
  if (!doc.exists) return null as unknown as Record<string, unknown>;

  const data = doc.data() || {};
  return {
    id: doc.id,
    ...data,
    created_at: data.created_at ? formatTimestamp(data.created_at as TimestampLike) : '',
    updated_at: data.updated_at ? formatTimestamp(data.updated_at as TimestampLike) : '',
  };
}

export { 
  initializeFirebaseAdmin, 
  formatDoc, 
  formatTimestamp, 
  admin,
  adminDb,
  adminAuth
}; 