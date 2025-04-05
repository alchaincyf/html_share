import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  serverTimestamp, 
  Timestamp,
  where,
  DocumentSnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { HtmlProject } from './firebase';

// 集合名称
const COLLECTION_NAME = 'html_projects';

// 检查是否在客户端环境
const isClient = typeof window !== 'undefined';

// 格式化Firestore文档为HtmlProject类型
const formatDoc = (doc: DocumentSnapshot | QueryDocumentSnapshot<unknown>): HtmlProject => {
  const data = doc.data() || {};
  // 将Firestore的Timestamp转换为ISO字符串
  const created_at = data.created_at instanceof Timestamp 
    ? data.created_at.toDate().toISOString() 
    : data.created_at || new Date().toISOString();
  const updated_at = data.updated_at instanceof Timestamp 
    ? data.updated_at.toDate().toISOString() 
    : data.updated_at || new Date().toISOString();

  return {
    id: doc.id,
    title: data.title || '',
    html_content: data.html_content || '',
    created_at,
    updated_at,
    user_id: data.user_id || null,
    is_public: data.is_public || false
  };
};

// 创建新项目
export const createProject = async (projectData: Omit<HtmlProject, 'id' | 'created_at' | 'updated_at'>) => {
  if (!isClient || !db) {
    throw new Error('Firebase仅在客户端可用');
  }
  
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...projectData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    // 获取新创建的文档
    const snapshot = await getDoc(docRef);
    return { 
      id: docRef.id, 
      ...formatDoc({ id: docRef.id, data: () => snapshot.data() }) 
    };
  } catch (error) {
    console.error('创建项目失败:', error);
    throw error;
  }
};

// 获取所有项目
export const getAllProjects = async () => {
  if (!isClient || !db) {
    throw new Error('Firebase仅在客户端可用');
  }
  
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('updated_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => formatDoc(doc));
  } catch (error) {
    console.error('获取项目列表失败:', error);
    throw error;
  }
};

// 获取单个项目
export const getProject = async (id: string) => {
  if (!isClient || !db) {
    throw new Error('Firebase仅在客户端可用');
  }
  
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      throw new Error('项目不存在');
    }
    
    return formatDoc(snapshot);
  } catch (error) {
    console.error(`获取项目 ${id} 失败:`, error);
    throw error;
  }
};

// 更新项目
export const updateProject = async (id: string, data: Partial<Omit<HtmlProject, 'id' | 'created_at' | 'updated_at'>>) => {
  if (!isClient || !db) {
    throw new Error('Firebase仅在客户端可用');
  }
  
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp()
    });
    
    const updated = await getDoc(docRef);
    return formatDoc(updated);
  } catch (error) {
    console.error(`更新项目 ${id} 失败:`, error);
    throw error;
  }
};

// 删除项目
export const deleteProject = async (id: string) => {
  if (!isClient || !db) {
    throw new Error('Firebase仅在客户端可用');
  }
  
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error(`删除项目 ${id} 失败:`, error);
    throw error;
  }
};

// 获取公开的项目
export const getPublicProjects = async () => {
  if (!isClient || !db) {
    throw new Error('Firebase仅在客户端可用');
  }
  
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('is_public', '==', true),
      orderBy('updated_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => formatDoc(doc));
  } catch (error) {
    console.error('获取公开项目失败:', error);
    throw error;
  }
}; 