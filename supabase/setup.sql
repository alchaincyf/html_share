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