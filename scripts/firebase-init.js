// Firebase初始化脚本
// 用于初始化Firebase Firestore数据库，创建必要的集合和索引

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  limit 
} = require('firebase/firestore');

// Firebase配置
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkFirebaseConnection() {
  console.log('检查Firebase连接...');
  
  try {
    // 尝试获取html_projects集合
    const projectsRef = collection(db, 'html_projects');
    const q = query(projectsRef, limit(1));
    await getDocs(q);
    
    console.log('✅ Firebase连接成功！');
    console.log('提示: 请确保在Firebase Console中创建了以下内容:');
    console.log('  - Firestore数据库已启用');
    console.log('  - html_projects集合已创建');
    console.log('  - 已设置适当的安全规则');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase连接失败!');
    console.error('错误详情:', error.message);
    console.error('');
    console.error('请检查以下内容:');
    console.error('  1. 您的.env.local文件中的Firebase配置是否正确');
    console.error('  2. Firebase项目是否已创建并启用Firestore');
    console.error('  3. 您的IP地址是否被Firebase允许访问');
    
    return false;
  }
}

// 执行检查
checkFirebaseConnection()
  .then((result) => {
    if (result) {
      console.log('Firebase检查完成，一切正常！');
    } else {
      console.error('Firebase检查失败，请修复以上问题。');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('执行检查时发生错误:', error);
    process.exit(1);
  }); 