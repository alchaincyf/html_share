#!/usr/bin/env node

/**
 * 此脚本用于检查 Supabase 连接和数据库设置
 * 运行方法: node scripts/check-supabase.js
 */

// 直接读取.env.local文件内容
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 尝试直接读取环境变量文件
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  console.log('尝试读取环境变量文件:', envPath);
  
  if (fs.existsSync(envPath)) {
    console.log('环境变量文件存在，内容:');
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log(envContent);
    
    // 解析环境变量
    const parsedEnv = dotenv.parse(envContent);
    console.log('解析后的环境变量:');
    console.log(parsedEnv);
    
    // 手动设置环境变量
    process.env.NEXT_PUBLIC_SUPABASE_URL = parsedEnv.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = parsedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  } else {
    console.log('环境变量文件不存在');
  }
} catch (err) {
  console.error('读取环境变量文件出错:', err);
}

const { createClient } = require('@supabase/supabase-js');

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 检查环境变量是否设置
console.log('=== Supabase 环境变量检查 ===');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl || '未设置'}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '已设置(密钥已隐藏)' : '未设置'}`);
console.log();

// 如果环境变量未设置，则退出
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 环境变量未正确设置，请检查 .env.local 文件');
  process.exit(1);
}

// 检查 URL 格式
console.log('=== Supabase URL 格式检查 ===');
try {
  new URL(supabaseUrl);
  console.log(`URL 格式正确: ✅ ${supabaseUrl}`);
} catch (err) {
  console.error(`URL 格式错误: ❌ ${supabaseUrl}`);
  console.error('请确保 URL 格式为: https://your-project-id.supabase.co');
  console.error('错误详情:', err.message);
  process.exit(1);
}
console.log();

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 检查连接
async function checkConnection() {
  console.log('=== Supabase 连接测试 ===');
  try {
    const { error } = await supabase.from('html_projects').select('count');
    if (error) {
      throw error;
    }
    console.log('✅ 连接成功');
    return true;
  } catch (err) {
    console.error('❌ 连接失败:', err.message);
    console.log();
    console.log('可能的原因:');
    console.log('1. Supabase 项目未启动或不可用');
    console.log('2. API 密钥不正确或过期');
    console.log('3. html_projects 表不存在');
    console.log();
    return false;
  }
}

// 检查表是否存在
async function checkTable() {
  console.log('=== html_projects 表检查 ===');
  try {
    // 获取所有表
    const { error } = await supabase
      .from('html_projects')
      .select('*')
      .limit(1);

    if (error && error.code === '42P01') {
      console.error('❌ html_projects 表不存在');
      console.log();
      console.log('请在 Supabase 控制台中运行以下 SQL 脚本创建表:');
      console.log(`
-- 创建html_projects表
CREATE TABLE IF NOT EXISTS html_projects (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID,
  is_public BOOLEAN DEFAULT TRUE
);

-- 创建RLS策略
ALTER TABLE html_projects ENABLE ROW LEVEL SECURITY;

-- 创建访问策略（暂时允许所有操作，后续可以添加用户认证）
CREATE POLICY "允许所有操作" ON html_projects
  USING (true)
  WITH CHECK (true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_html_projects_updated_at
BEFORE UPDATE ON html_projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
      `);
      return false;
    } else if (error) {
      console.error('❌ 检查表失败:', error.message);
      return false;
    }

    console.log('✅ html_projects 表存在');
    return true;
  } catch (err) {
    console.error('❌ 检查表失败:', err.message);
    return false;
  }
}

// 主函数
async function main() {
  const connectionSuccess = await checkConnection();
  if (!connectionSuccess) {
    process.exit(1);
  }

  const tableExists = await checkTable();
  if (!tableExists) {
    process.exit(1);
  }

  console.log();
  console.log('=== 结论 ===');
  console.log('✅ Supabase 设置正确，你的应用应该能够正常工作！');
  console.log();
}

main().catch(err => {
  console.error('检查过程出错:', err);
  process.exit(1);
}); 