/**
 * Firebase Admin SDK 初始化
 * 用于服务器端API路由
 */

import * as admin from 'firebase-admin';

// 检查是否已初始化应用
const apps = admin.apps;

// 服务账号凭据
let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;

// 初始化 Firebase Admin SDK（如果尚未初始化）
try {
  if (!apps.length) {
    // 环境变量中获取Firebase配置
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
      : undefined;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const databaseURL = process.env.FIREBASE_DATABASE_URL;

    // 检查必要的环境变量
    if (!projectId || !privateKey || !clientEmail) {
      throw new Error('缺少Firebase Admin SDK必要的环境变量配置');
    }

    // 初始化应用
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
      databaseURL: databaseURL,
    });
  }

  // 获取Firestore和Auth实例
  adminDb = admin.firestore();
  adminAuth = admin.auth();
} catch (error) {
  console.error('Firebase Admin SDK初始化失败:', error);
  throw error;
}

/**
 * 格式化Firestore时间戳
 */
function formatTimestamp(timestamp: any): string {
  if (!timestamp) return '';

  if (timestamp._seconds !== undefined) {
    // Firestore Timestamp对象
    return new Date(timestamp._seconds * 1000).toISOString();
  } else if (timestamp.seconds !== undefined) {
    // admin.firestore.Timestamp对象
    return new Date(timestamp.seconds * 1000).toISOString();
  } else if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    // Firebase Timestamp对象（带有toDate方法）
    return timestamp.toDate().toISOString();
  } else if (timestamp instanceof Date) {
    // JavaScript Date对象
    return timestamp.toISOString();
  }

  // 其他格式（如ISO字符串）
  return timestamp.toString();
}

/**
 * 格式化Firestore文档
 */
function formatDoc(doc: admin.firestore.DocumentSnapshot): any {
  if (!doc.exists) return null;

  const data = doc.data() || {};
  return {
    id: doc.id,
    ...data,
    created_at: data.created_at ? formatTimestamp(data.created_at) : '',
    updated_at: data.updated_at ? formatTimestamp(data.updated_at) : '',
  };
}

export { adminDb, adminAuth, formatDoc, formatTimestamp, admin }; 