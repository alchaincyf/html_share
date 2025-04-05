import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// 确保只初始化一次
const apps = getApps();
if (!apps.length) {
  try {
    // 确保环境变量正确设置
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('缺少FIREBASE_PROJECT_ID环境变量');
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log('Firebase Admin SDK 初始化成功');
  } catch (error) {
    console.error('Firebase Admin SDK 初始化失败:', error);
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();

// 格式化时间戳
export const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString();
  
  // 如果是Firestore Timestamp
  if (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) {
    return new Date(timestamp._seconds * 1000).toISOString();
  }
  
  // 如果是date对象
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  
  // 如果是ISO字符串
  return timestamp;
};

// 格式化Firestore文档
export const formatDoc = (doc: any) => {
  if (!doc || !doc.data) return null;
  
  const data = doc.data() || {};
  
  return {
    id: doc.id,
    title: data.title || '',
    html_content: data.html_content || '',
    created_at: formatTimestamp(data.created_at),
    updated_at: formatTimestamp(data.updated_at),
    user_id: data.user_id || null,
    is_public: data.is_public || false
  };
}; 