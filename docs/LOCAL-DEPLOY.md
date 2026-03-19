# 本地部署指南

## 前提条件

- Node.js 18+ 已安装
- 已克隆 GitHub 仓库
- Supabase 项目已创建

---

## 步骤 1: 克隆仓库

```bash
git clone https://github.com/wanyanzhili-png/wyzl.git
cd wyzl
```

---

## 步骤 2: 安装依赖

```bash
npm install
```

---

## 步骤 3: 配置环境变量

创建 `.env` 文件（或编辑现有的）：

```bash
# Supabase 数据库连接
DATABASE_URL="postgresql://postgres.ljyifwwoqbijmomluilr:wanyan19891204@db.ljyifwwoqbijmomluilr.supabase.co:5432/postgres"

# NextAuth 配置
NEXTAUTH_SECRET="xeGsRr6cDrDB6WLiKJA3Bx9FiGhOmdIroxrrL+vJPUc="
NEXTAUTH_URL="http://localhost:3000"

# Stripe 配置（可选，测试时可用测试密钥）
# STRIPE_SECRET_KEY="sk_test_xxx"
# STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
```

---

## 步骤 4: 生成 Prisma 客户端

```bash
npx prisma generate
```

---

## 步骤 5: 运行数据库迁移

```bash
# 生产环境部署（推荐）
npx prisma migrate deploy

# 或者使用 db push（开发环境）
npx prisma db push
```

如果成功，你会看到类似输出：
```
✔ Migration applied
✔ Database is now in sync with your schema
```

---

## 步骤 6: 导入示例数据（可选）

```bash
npx tsx prisma/seed.ts
```

---

## 步骤 7: 创建管理员账户

### 方法 A: 使用 Prisma Studio

```bash
npx prisma studio
```

然后在浏览器中手动添加管理员用户。

### 方法 B: 使用 SQL

在 Supabase SQL Editor 中执行：

```sql
-- 先生成密码哈希（在终端运行）
-- node -e "require('bcryptjs').hash('你的密码', 10).then(console.log)"

-- 然后执行 SQL（替换密码哈希）
INSERT INTO users (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@yourstore.com',
  '$2a$10$...', -- 替换为 bcrypt 哈希
  'ADMIN',
  NOW(),
  NOW()
);
```

---

## 步骤 8: 本地测试

```bash
npm run dev
```

访问 http://localhost:3000 测试网站功能。

---

## 步骤 9: 部署到 Vercel

### 9.1 在 Vercel 导入项目

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择 `wanyanzhili-png/wyzl` 仓库
4. 点击 "Import"

### 9.2 配置环境变量

在 Vercel 项目设置 → Environment Variables 添加：

```bash
DATABASE_URL=postgresql://postgres.ljyifwwoqbijmomluilr:wanyan19891204@db.ljyifwwoqbijmomluilr.supabase.co:5432/postgres
NEXTAUTH_SECRET=xeGsRr6cDrDB6WLiKJA3Bx9FiGhOmdIroxrrL+vJPUc=
NEXTAUTH_URL=https://你的项目.vercel.app
```

### 9.3 部署

1. 点击 "Deploy"
2. 等待构建完成（约 2-3 分钟）
3. 访问 Vercel 分配的域名

---

## 🐛 常见问题

### Q: `npx prisma migrate deploy` 失败

A: 检查：
1. DATABASE_URL 是否正确
2. Supabase 项目是否激活（登录 supabase.com 查看）
3. 网络连接是否正常

### Q: 数据库连接超时

A: Supabase 免费项目 90 天不登录会暂停。解决方法：
1. 登录 https://supabase.com
2. 进入项目，点击激活

### Q: 迁移成功但表不存在

A: 检查 schema 是否正确：
```bash
npx prisma db pull
npx prisma generate
```

---

## ✅ 完成检查清单

- [ ] 依赖安装完成
- [ ] `.env` 文件配置正确
- [ ] Prisma 客户端生成成功
- [ ] 数据库迁移成功
- [ ] 本地测试通过
- [ ] Vercel 部署成功
- [ ] 管理员账户创建

---

**🎉 部署完成！**
