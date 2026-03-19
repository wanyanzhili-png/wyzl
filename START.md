# 电商独立站 - 启动指南

## ✅ 已完成功能

### Phase 1 - 基础框架 ✅

| 模块 | 状态 | 文件位置 |
|------|------|---------|
| 项目初始化 | ✅ | 根目录 |
| 数据库模型 | ✅ | `prisma/schema.prisma` |
| 首页 | ✅ | `src/app/page.tsx` |
| 商品列表页 | ✅ | `src/app/products/page.tsx` |
| 商品详情页 | ✅ | `src/app/product/[id]/page.tsx` |
| 用户登录 | ✅ | `src/app/login/page.tsx` |
| 用户注册 | ✅ | `src/app/register/page.tsx` |
| 个人中心 | ✅ | `src/app/account/page.tsx` |
| 购物车状态 | ✅ | `src/lib/cart-store.ts` |
| 基础组件 | ✅ | `src/components/` |

---

## 🚀 快速启动

### 步骤 1: 配置数据库

**选项 A: 使用 Supabase（推荐，最简单）**

1. 访问 https://supabase.com 创建免费项目
2. 进入项目 → Settings → Database
3. 复制 **Connection String (URI)**
4. 编辑 `.env` 文件：
   ```bash
   DATABASE_URL="postgresql://postgres.xxx:你的密码@aws-0-region.pooler.supabase.com:6543/postgres"
   ```

**选项 B: 使用 Neon（免费 PostgreSQL）**

1. 访问 https://neon.tech 创建数据库
2. 获取连接字符串
3. 更新 `.env` 文件

**选项 C: 本地 PostgreSQL**

```bash
docker run -d \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ecommerce \
  -p 5432:5432 \
  postgres:15
```

### 步骤 2: 配置环境变量

```bash
cd ecommerce-site

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
```

**必须配置:**
```bash
# 数据库连接（从 Supabase/Neon 获取）
DATABASE_URL="postgresql://..."

# NextAuth 密钥（运行 openssl rand -base64 32 生成）
NEXTAUTH_SECRET="你的密钥"
NEXTAUTH_URL="http://localhost:3000"
```

生成密钥：
```bash
openssl rand -base64 32
```

### 步骤 3: 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 运行数据库迁移（创建表结构）
npm run db:migrate

# 导入示例数据（可选）
npm run db:seed
```

### 步骤 4: 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 📁 项目结构

```
ecommerce-site/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # 首页
│   │   ├── layout.tsx            # 根布局
│   │   ├── products/             # 商品列表页
│   │   ├── product/[id]/         # 商品详情页
│   │   ├── login/                # 登录页
│   │   ├── register/             # 注册页
│   │   ├── account/              # 个人中心
│   │   ├── cart/                 # 购物车（待开发）
│   │   ├── checkout/             # 结算（待开发）
│   │   └── api/
│   │       └── auth/             # 认证 API
│   ├── components/               # React 组件
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── product-card.tsx
│   ├── lib/                      # 工具函数
│   │   ├── utils.ts
│   │   ├── cart-store.ts         # 购物车状态
│   │   └── prisma.ts             # 数据库客户端
│   └── auth/
│       └── auth.ts               # NextAuth 配置
├── prisma/
│   ├── schema.prisma             # 数据库模型
│   └── seed.ts                   # 种子数据脚本
├── docs/
│   └── PLAN.md                   # 完整开发计划
├── .env.example                  # 环境变量示例
├── .env                          # 环境变量（自己创建）
└── README.md                     # 项目说明
```

---

## 🗄️ 数据库模型

已创建的表：

- **users** - 用户表（含密码登录）
- **categories** - 商品分类
- **products** - 商品信息
- **orders** - 订单
- **order_items** - 订单明细
- **accounts/sessions/verification_tokens** - NextAuth 所需

---

## 🎯 下一步开发计划

### Phase 2 (Week 5-8): 购物车 + 支付

- [ ] 购物车页面 (`/cart`)
- [ ] 结算流程 (`/checkout`)
- [ ] Stripe 支付集成
- [ ] 订单创建和管理

### Phase 3 (Week 9-12): 后台管理

- [ ] 后台管理界面 (`/admin`)
- [ ] 商品 CRUD
- [ ] 订单管理
- [ ] 数据统计

---

## 🐛 常见问题

**Q: Prisma 报错 "datasource property url is no longer supported"**

A: Prisma 7 需要新的配置方式，已修复。确保：
- `prisma/schema.prisma` 中 datasource 不包含 `url`
- `prisma.config.ts` 已正确配置
- `.env` 中有 `DATABASE_URL`

**Q: 登录/注册不工作**

A: 检查：
1. `.env` 中 `NEXTAUTH_SECRET` 是否已设置
2. 数据库迁移是否成功运行
3. 浏览器控制台是否有错误

**Q: 图片不显示**

A: 已配置 Unsplash 图片源，确保商品图片 URL 是有效的 https 链接。

---

## 📞 需要帮助？

查看详细文档：
- `docs/PLAN.md` - 完整开发计划
- `README.md` - 项目概述

或继续询问下一步怎么做！
