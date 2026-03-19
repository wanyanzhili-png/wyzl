# 电商独立站 - 快速启动指南

## 🚀 项目初始化完成

恭喜！你的 Next.js 电商项目已经创建成功。

## 📋 已完成的工作

- ✅ Next.js 14 + TypeScript + Tailwind CSS 项目初始化
- ✅ Prisma ORM 配置（PostgreSQL）
- ✅ 数据库模型设计（User, Product, Order, etc.）
- ✅ 购物车状态管理（Zustand）
- ✅ 基础组件（Header, Footer, ProductCard）
- ✅ 首页设计

## 🔧 下一步配置

### 1. 设置数据库

**选项 A: 本地 PostgreSQL**
```bash
# 安装 Docker 并运行 PostgreSQL
docker run -d \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ecommerce \
  -p 5432:5432 \
  postgres:15

# 然后运行数据库迁移
npx prisma migrate dev
```

**选项 B: 使用 Supabase（推荐）**
1. 访问 https://supabase.com 创建免费项目
2. 获取数据库连接字符串
3. 更新 `.env` 文件中的 `DATABASE_URL`
4. 运行迁移：`npx prisma migrate dev`

**选项 C: 使用 Neon**
1. 访问 https://neon.tech 创建免费数据库
2. 获取连接字符串
3. 更新 `.env` 文件

### 2. 配置环境变量

```bash
# 复制示例环境变量文件
cp .env.example .env

# 编辑 .env 文件，填入你的配置
```

**必须配置:**
- `DATABASE_URL` - 数据库连接字符串
- `NEXTAUTH_SECRET` - 运行 `openssl rand -base64 32` 生成

**可选配置:**
- `RESEND_API_KEY` - 邮件服务
- `STRIPE_*` - 支付集成

### 3. 生成 NextAuth 密钥

```bash
openssl rand -base64 32
```

将输出复制到 `.env` 的 `NEXTAUTH_SECRET` 字段。

### 4. 运行数据库迁移

```bash
npx prisma migrate dev --name init
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
ecommerce-site/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # 首页
│   │   ├── layout.tsx    # 根布局
│   │   └── ...
│   ├── components/       # React 组件
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── product-card.tsx
│   ├── lib/              # 工具函数
│   │   ├── utils.ts
│   │   └── cart-store.ts
│   └── ...
├── prisma/
│   └── schema.prisma     # 数据库模型
├── docs/
│   └── PLAN.md           # 项目计划
└── .env.example          # 环境变量示例
```

## 📅 开发计划

参考 `docs/PLAN.md` 文件，项目分为 3 个 Phase：

- **Phase 1 (Week 1-4)**: 基础框架 + 商品展示 ✅ 进行中
- **Phase 2 (Week 5-8)**: 购物车 + 支付集成
- **Phase 3 (Week 9-12)**: 后台管理 + 优化

## 🎯 下一步任务

1. **配置数据库** - 选择上述数据库选项之一
2. **运行迁移** - `npx prisma migrate dev`
3. **创建商品数据** - 编写种子脚本添加示例商品
4. **开发商品列表页** - `/products` 路由
5. **开发商品详情页** - `/product/[slug]` 路由

## 📞 需要帮助？

查看项目文档或继续询问下一步具体怎么做。
