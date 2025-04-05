/**
 * Firebase Admin SDK 初始化
 * 用于服务器端API路由
 * 
 * 增强版：
 * - 支持环境变量详细验证
 * - 提供更详细的错误信息
 * - 开发环境下支持降级和模拟数据
 */

import * as admin from 'firebase-admin';

// 定义时间戳类型
type TimestampLike = {
  _seconds?: number;
  seconds?: number;
  toDate?: () => Date;
} | Date | string | number;

// 定义模拟数据类型
interface MockDocumentData {
  id: string;
  [key: string]: unknown;
}

// 服务账号凭据
let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;
let isInitialized = false;
let isUsingMockData = false; // 标记是否使用模拟数据

// 内存中模拟数据存储
const mockCollections: Record<string, MockDocumentData[]> = {
  'html_projects': []
};

// 检查环境变量是否已配置
function validateEnvironmentVars(): { valid: boolean; missingVars: string[] } {
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];
  
  const missingVars = requiredVars.filter(varName => {
    const value = process.env[varName];
    return !value || value.trim() === '' || value === 'undefined';
  });
  
  return {
    valid: missingVars.length === 0,
    missingVars
  };
}

// 格式化环境变量
function formatEnvironmentVars() {
  // 特别处理 FIREBASE_PRIVATE_KEY，确保换行符正确
  if (process.env.FIREBASE_PRIVATE_KEY) {
    // 有些环境会把引号也包含在环境变量中，需要去除
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // 去除可能的首尾引号
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    
    // 确保换行符正确处理
    process.env.FIREBASE_PRIVATE_KEY = privateKey.replace(/\\n/g, '\n');
  }
}

// 创建模拟的Firestore文档
function createMockDoc(id: string, data: Record<string, unknown>): admin.firestore.DocumentSnapshot {
  return {
    id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: { id } as any, // 这里必须使用any，因为无法完全模拟Firestore的复杂类型
    data: () => data,
    exists: true,
    get: (field: string) => data[field],
    metadata: { hasPendingWrites: false, fromCache: false }
  } as admin.firestore.DocumentSnapshot;
}

// 创建模拟的Firestore集合
function createMockCollection(name: string) {
  return {
    doc: (id: string) => {
      return {
        id,
        get: async () => {
          const doc = mockCollections[name].find(doc => doc.id === id);
          return createMockDoc(id, doc ? { ...doc } : {});
        },
        set: async (data: Record<string, unknown>) => {
          const index = mockCollections[name].findIndex(doc => doc.id === id);
          if (index >= 0) {
            mockCollections[name][index] = { id, ...data };
          } else {
            mockCollections[name].push({ id, ...data });
          }
          return Promise.resolve();
        },
        update: async (data: Record<string, unknown>) => {
          const index = mockCollections[name].findIndex(doc => doc.id === id);
          if (index >= 0) {
            mockCollections[name][index] = { 
              ...mockCollections[name][index],
              ...data
            };
          }
          return Promise.resolve();
        },
        delete: async () => {
          const index = mockCollections[name].findIndex(doc => doc.id === id);
          if (index >= 0) {
            mockCollections[name].splice(index, 1);
          }
          return Promise.resolve();
        }
      };
    },
    add: async (data: Record<string, unknown>) => {
      const id = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      mockCollections[name].push({ id, ...data });
      
      // 返回文档引用
      return {
        id,
        get: async () => createMockDoc(id, { id, ...data })
      };
    },
    where: () => ({
      get: async () => ({
        docs: mockCollections[name].map(doc => createMockDoc(doc.id, { ...doc }))
      })
    }),
    orderBy: () => ({
      get: async () => ({
        docs: mockCollections[name].map(doc => createMockDoc(doc.id, { ...doc }))
      })
    })
  };
}

// 创建模拟的Firebase Admin SDK
function createMockFirebaseAdmin() {
  console.warn('⚠️ 使用模拟的Firebase Admin SDK。这仅适用于开发环境！');
  
  isUsingMockData = true;
  
  // 创建模拟的Firestore
  adminDb = {
    collection: (name: string) => createMockCollection(name)
  } as unknown as admin.firestore.Firestore;
  
  // 创建模拟的Auth
  adminAuth = {} as admin.auth.Auth;
  
  isInitialized = true;
  return { adminDb, adminAuth, isUsingMockData };
}

/**
 * 初始化 Firebase Admin SDK
 * 增强版：提供更详细的错误处理和降级机制
 */
function initializeFirebaseAdmin() {
  // 如果已初始化，直接返回实例
  if (isInitialized) {
    return { adminDb, adminAuth, isUsingMockData };
  }
  
  try {
    console.log('正在初始化Firebase Admin SDK...');
    
    // 格式化环境变量
    formatEnvironmentVars();
    
    // 验证环境变量
    const { valid, missingVars } = validateEnvironmentVars();
    
    // 检查是否已初始化应用
    const apps = admin.apps;
    
    // 如果环境变量无效
    if (!valid) {
      const missingVarsStr = missingVars.join(', ');
      console.warn(`⚠️ 缺少Firebase Admin SDK必要的环境变量: ${missingVarsStr}`);
      
      // 在开发环境中使用模拟数据
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔄 开发环境：使用模拟数据代替Firebase');
        return createMockFirebaseAdmin();
      } else {
        // 生产环境抛出错误
        throw new Error(`Firebase Admin SDK初始化失败: 缺少必要的环境变量 ${missingVarsStr}`);
      }
    }
    
    if (!apps.length) {
      // 从环境变量获取配置
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const databaseURL = process.env.FIREBASE_DATABASE_URL;
      
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
        console.log('✅ Firebase Admin SDK应用初始化成功');
      } catch (initError) {
        const errorMsg = initError instanceof Error 
          ? `Firebase应用初始化失败: ${initError.message}` 
          : 'Firebase应用初始化失败: 未知错误';
        console.error('❌ ' + errorMsg);
        
        // 在开发环境中使用模拟数据
        if (process.env.NODE_ENV !== 'production') {
          console.log('🔄 开发环境：使用模拟数据代替Firebase');
          return createMockFirebaseAdmin();
        } else {
          throw new Error(errorMsg);
        }
      }
    }

    // 获取Firestore和Auth实例
    try {
      adminDb = admin.firestore();
      adminAuth = admin.auth();
      isInitialized = true;
      isUsingMockData = false;
      
      console.log('✅ Firebase Admin SDK服务初始化成功');
      return { adminDb, adminAuth, isUsingMockData };
    } catch (serviceError) {
      const errorMsg = serviceError instanceof Error 
        ? `Firebase服务获取失败: ${serviceError.message}` 
        : 'Firebase服务获取失败: 未知错误';
      console.error('❌ ' + errorMsg);
      
      // 在开发环境中使用模拟数据
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔄 开发环境：使用模拟数据代替Firebase');
        return createMockFirebaseAdmin();
      } else {
        throw new Error(errorMsg);
      }
    }
  } catch (error) {
    console.error('❌ Firebase Admin SDK初始化失败:', error);
    
    // 在开发环境中使用模拟数据
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 开发环境：使用模拟数据代替Firebase');
      return createMockFirebaseAdmin();
    }
    
    // 重新抛出错误
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

// 检查Firebase Admin SDK是否初始化
function isFirebaseAdminInitialized(): boolean {
  return isInitialized;
}

// 检查是否使用模拟数据
function isUsingMockDatabase(): boolean {
  return isUsingMockData;
}

export { 
  initializeFirebaseAdmin, 
  formatDoc, 
  formatTimestamp, 
  admin,
  adminDb,
  adminAuth,
  isFirebaseAdminInitialized,
  isUsingMockDatabase
}; 