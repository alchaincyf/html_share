/**
 * API测试脚本
 * 用于测试Firebase代理API功能
 * 
 * 使用方法: node scripts/test-api.js
 */

// 模拟fetch函数，在Node.js环境中使用
const fetch = require('node-fetch');

// 基础URL
const BASE_URL = 'http://localhost:3000/api/firebase';

// 测试创建项目
async function testCreateProject() {
  try {
    console.log('测试创建项目...');
    const response = await fetch(`${BASE_URL}/project/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '测试项目 ' + new Date().toISOString(),
        html_content: '<html><body><h1>Hello World</h1><p>这是一个测试项目</p></body></html>',
        is_public: true
      })
    });

    const data = await response.json();
    console.log('创建项目结果:', data);
    return data.project.id;
  } catch (error) {
    console.error('创建项目失败:', error);
    return null;
  }
}

// 测试获取所有项目
async function testGetAllProjects() {
  try {
    console.log('测试获取所有项目...');
    const response = await fetch(`${BASE_URL}/projects`);
    const data = await response.json();
    console.log(`获取到 ${data.projects.length} 个项目`);
    console.log('第一个项目:', data.projects[0]);
  } catch (error) {
    console.error('获取项目列表失败:', error);
  }
}

// 测试获取单个项目
async function testGetProject(projectId) {
  try {
    console.log(`测试获取项目 (ID: ${projectId})...`);
    const response = await fetch(`${BASE_URL}/project/${projectId}`);
    const data = await response.json();
    console.log('获取项目结果:', data.project.title);
  } catch (error) {
    console.error('获取项目失败:', error);
  }
}

// 测试更新项目
async function testUpdateProject(projectId) {
  try {
    console.log(`测试更新项目 (ID: ${projectId})...`);
    const response = await fetch(`${BASE_URL}/project/${projectId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '已更新 - ' + new Date().toISOString(),
        html_content: '<html><body><h1>Updated Content</h1><p>内容已更新</p></body></html>'
      })
    });

    const data = await response.json();
    console.log('更新项目结果:', data.project.title);
  } catch (error) {
    console.error('更新项目失败:', error);
  }
}

// 测试获取公开项目
async function testGetPublicProjects() {
  try {
    console.log('测试获取公开项目...');
    const response = await fetch(`${BASE_URL}/projects/public`);
    const data = await response.json();
    console.log(`获取到 ${data.projects.length} 个公开项目`);
  } catch (error) {
    console.error('获取公开项目失败:', error);
  }
}

// 测试删除项目
async function testDeleteProject(projectId) {
  try {
    console.log(`测试删除项目 (ID: ${projectId})...`);
    const response = await fetch(`${BASE_URL}/project/${projectId}/delete`, {
      method: 'DELETE'
    });

    const data = await response.json();
    console.log('删除项目结果:', data);
  } catch (error) {
    console.error('删除项目失败:', error);
  }
}

// 运行所有测试
async function runAllTests() {
  // 创建一个测试项目
  const projectId = await testCreateProject();
  
  if (!projectId) {
    console.error('测试无法继续，无法创建项目');
    return;
  }
  
  // 等待一秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 获取所有项目
  await testGetAllProjects();
  
  // 等待一秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 获取特定项目
  await testGetProject(projectId);
  
  // 等待一秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 更新项目
  await testUpdateProject(projectId);
  
  // 等待一秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 获取公开项目
  await testGetPublicProjects();
  
  // 等待一秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 删除项目
  await testDeleteProject(projectId);
  
  console.log('所有测试完成');
}

// 执行测试
runAllTests(); 