-- -----------------------------
-- 留言系统数据库表结构设计
-- -----------------------------

-- 删除现有表（如果存在）
DROP TABLE IF EXISTS guestbook_likes CASCADE;
DROP TABLE IF EXISTS guestbook_replies CASCADE;
DROP TABLE IF EXISTS guestbook_messages CASCADE;

-- -----------------------------
-- 1. 留言主表
-- -----------------------------
CREATE TABLE guestbook_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 留言者名称
    message TEXT NOT NULL, -- 留言内容
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- 状态：active/inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, -- 创建时间
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL -- 更新时间
);

-- 添加更新时间触发器
CREATE OR REPLACE FUNCTION update_guestbook_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guestbook_message_timestamp
BEFORE UPDATE ON guestbook_messages
FOR EACH ROW
EXECUTE FUNCTION update_guestbook_message_timestamp();

-- -----------------------------
-- 2. 留言回复表
-- -----------------------------
CREATE TABLE guestbook_replies (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL REFERENCES guestbook_messages(id) ON DELETE CASCADE, -- 关联的主留言ID
    name VARCHAR(100) NOT NULL, -- 回复者名称
    content TEXT NOT NULL, -- 回复内容
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- 状态：active/inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, -- 创建时间
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL -- 更新时间
);

-- 添加更新时间触发器
CREATE OR REPLACE FUNCTION update_guestbook_reply_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guestbook_reply_timestamp
BEFORE UPDATE ON guestbook_replies
FOR EACH ROW
EXECUTE FUNCTION update_guestbook_reply_timestamp();

-- 添加索引以提高查询性能
CREATE INDEX idx_guestbook_replies_message_id ON guestbook_replies(message_id);

-- -----------------------------
-- 3. 留言点赞表
-- -----------------------------
CREATE TABLE guestbook_likes (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL REFERENCES guestbook_messages(id) ON DELETE CASCADE, -- 关联的留言ID
    ip_address VARCHAR(50) NOT NULL, -- 点赞者IP地址（用于防止重复点赞）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL -- 创建时间
);

-- 添加唯一约束，防止同一IP重复点赞
ALTER TABLE guestbook_likes
ADD CONSTRAINT unique_message_ip_like UNIQUE (message_id, ip_address);

-- 添加索引以提高查询性能
CREATE INDEX idx_guestbook_likes_message_id ON guestbook_likes(message_id);

-- -----------------------------
-- 4. 视图：带有点赞数和回复数的留言视图
-- -----------------------------
CREATE VIEW guestbook_messages_with_counts AS
SELECT 
    m.*,
    (SELECT COUNT(*) FROM guestbook_likes l WHERE l.message_id = m.id) AS likes_count,
    (SELECT COUNT(*) FROM guestbook_replies r WHERE r.message_id = m.id AND r.status = 'active') AS replies_count
FROM guestbook_messages m;

-- -----------------------------
-- 5. 示例数据
-- -----------------------------
-- 插入示例留言
INSERT INTO guestbook_messages (name, message)
VALUES 
    ('张三', '这是一条示例留言！'),
    ('李四', '感谢分享，很有帮助！');

-- 插入示例回复
INSERT INTO guestbook_replies (message_id, name, content)
VALUES 
    (1, '王五', '我也这么觉得！'),
    (1, '赵六', '非常赞同！');

-- 插入示例点赞
INSERT INTO guestbook_likes (message_id, ip_address)
VALUES 
    (1, '127.0.0.1'),
    (2, '127.0.0.1'),
    (1, '192.168.1.1');

-- -----------------------------
-- 6. 查询示例
-- -----------------------------
-- 查询所有留言，包含点赞数和回复数
-- SELECT * FROM guestbook_messages_with_counts ORDER BY created_at DESC;

-- 查询特定留言的回复
-- SELECT * FROM guestbook_replies WHERE message_id = 1 ORDER BY created_at ASC;

-- 查询特定留言的点赞数
-- SELECT COUNT(*) FROM guestbook_likes WHERE message_id = 1;

-- -----------------------------
-- 7. 权限设置（Supabase特定）
-- -----------------------------
-- 允许匿名用户访问（根据需要调整）
-- GRANT ALL ON guestbook_messages TO anon;
-- GRANT ALL ON guestbook_replies TO anon;
-- GRANT ALL ON guestbook_likes TO anon;
-- GRANT ALL ON guestbook_messages_with_counts TO anon;

-- -----------------------------
-- 8. 索引优化
-- -----------------------------
-- 为经常查询的字段添加索引
CREATE INDEX idx_guestbook_messages_created_at ON guestbook_messages(created_at DESC);
CREATE INDEX idx_guestbook_messages_status ON guestbook_messages(status);
CREATE INDEX idx_guestbook_replies_created_at ON guestbook_replies(created_at);
CREATE INDEX idx_guestbook_likes_created_at ON guestbook_likes(created_at);
