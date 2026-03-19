# 电商独立站 - 部署上线指南

## 🚀 部署到 Vercel + Supabase（生产环境）

---

## 前置准备

- GitHub 账号
- Vercel 账号（https://vercel.com）
- Supabase 账号（https://supabase.com）
- 域名（可选）

---

## 步骤 1: 准备生产数据库

### 1.1 创建 Supabase 生产项目

1. 访问 https://supabase.com
2. 点击 "New Project"
3. 填写：
   - Name: `ecommerce-prod`
   - Database Password: 强密码（保存好）
   - Region: 选择离用户最近的（如 Asia East）
4. 等待项目创建（约 2 分钟）

### 1.2 获取数据库连接字符串

1. 进入项目 → Settings → Database
2. 点击 "Connection string"
3. 选择 "URI" 模式
4. 复制连接字符串，格式：
   ```
   postgresql://postgres.xxx:密码@aws-0-region.pooler.supabase.com:6543/postgres
   ```

### 1.3 运行数据库迁移

```bash
# 本地临时设置生产数据库 URL
export DATABASE_URL="你的 Supabase 连接字符串"

# 生成 Prisma 客户端
npx prisma generate

# 运行迁移到生产数据库
npx prisma migrate deploy

# 导入示例数据（可选）
npx tsx prisma/seed.ts
```

### 1.4 创建管理员账户

使用 Prisma Studio 或直接 SQL：

```sql
-- 在 Supabase SQL Editor 中执行
INSERT INTO users (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@yourstore.com',
  '$2a$10$...', -- 用 bcrypt 加密的密码
  'ADMIN',
  NOW(),
  NOW()
);
```

生成密码哈希：
```bash
node -e "require('bcryptjs').hash('你的密码', 10).then(console.log)"
```

---

## 步骤 2: 部署到 Vercel

### 2.1 推送代码到 GitHub

```bash
cd ecommerce-site

# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/你的用户名/ecommerce-site.git
git branch -M main
git push -u origin main
```

### 2.2 在 Vercel 导入项目

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择你的 `ecommerce-site` 仓库
4. 点击 "Import"

### 2.3 配置环境变量

在 Vercel 项目设置 → Environment Variables 添加：

```bash
# 必需
DATABASE_URL=postgresql://...（Supabase 连接字符串）
NEXTAUTH_SECRET=你的密钥（openssl rand -base64 32）
NEXTAUTH_URL=https://你的域名.vercel.app

# 可选（支付功能）
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 可选（邮件功能）
RESEND_API_KEY=re_xxx
```

### 2.4 部署

1. 点击 "Deploy"
2. 等待构建完成（约 2-3 分钟）
3. 访问 Vercel 分配的域名：`https://你的项目.vercel.app`

---

## 步骤 3: 配置自定义域名（可选）

### 3.1 在 Vercel 添加域名

1. 项目设置 → Domains
2. 输入你的域名：`yourstore.com`
3. 点击 "Add"

### 3.2 配置 DNS

在你的域名注册商处添加 DNS 记录：

```
类型    名称    内容
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### 3.3 更新环境变量

```bash
NEXTAUTH_URL=https://yourstore.com
```

---

## 步骤 4: 配置 Stripe Webhook（生产）

### 4.1 在 Stripe 添加 Webhook

1. 访问 https://dashboard.stripe.com
2. Developers → Webhooks → Add endpoint
3. Endpoint URL: `https://你的域名.vercel.app/api/webhooks/stripe`
4. 选择事件：
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. 点击 "Add endpoint"

### 4.2 复制 Webhook 密钥

- 复制 `Signing secret`（whsec_开头）
- 添加到 Vercel 环境变量：`STRIPE_WEBHOOK_SECRET`

---

## 步骤 5: 测试生产环境

### 5.1 功能测试清单

- [ ] 首页加载正常
- [ ] 商品列表页正常
- [ ] 商品详情页正常
- [ ] 用户注册成功
- [ ] 用户登录成功
- [ ] 添加到购物车
- [ ] 结算流程完整
- [ ] 支付成功（用 Stripe 测试卡）
- [ ] 订单创建成功
- [ ] 后台管理可访问
- [ ] 商品管理功能正常

### 5.2 性能检查

1. 访问 https://pagespeed.web.dev
2. 输入你的域名
3. 检查分数（目标：>90）

---

## 步骤 6: 监控和维护

### 6.1 Vercel 监控

- 项目 → Analytics 查看访问量
- 项目 → Deployments 查看部署历史
- 项目 → Logs 查看错误日志

### 6.2 Supabase 监控

- 项目 → Dashboard 查看数据库使用
- 项目 → Logs 查看数据库日志

### 6.3 备份策略

**Supabase 自动备份：**
- Pro 计划：每天自动备份
- Free 计划：手动备份（定期导出）

**手动备份命令：**
```bash
# 导出数据
npx prisma db pull

# 或直接用 Supabase 的备份功能
```

---

## 🔐 安全建议

### 环境变量安全

- ✅ 所有敏感信息都放在环境变量
- ✅ `.env` 文件已添加到 `.gitignore`
- ✅ 不在代码中硬编码密钥

### 数据库安全

- ✅ 使用连接池（Supabase Pooler）
- ✅ 启用 SSL 连接
- ✅ 定期备份

### 认证安全

- ✅ 密码 bcrypt 加密
- ✅ NextAuth.js 会话管理
- ✅ HTTPS 强制（Vercel 自动）

---

## 💰 成本估算

### 免费额度（够用）

| 服务 | 免费额度 | 是否够用 |
|------|---------|---------|
| Vercel | 100GB 流量/月 | ✅ 个人小店够用 |
| Supabase | 500MB 数据库 | ✅ 约 10 万商品 |
| Stripe | 按交易收费 | ✅ 2.9% + $0.30/笔 |

### 升级建议

- 月销 < 100 单：免费额度足够
- 月销 > 100 单：考虑 Vercel Pro ($20/月)
- 商品 > 10 万：考虑 Supabase Pro ($25/月)

---

## 🐛 常见问题

**Q: 部署后数据库连接失败？**

A: 检查：
1. DATABASE_URL 是否正确（包含密码）
2. Supabase 项目是否活跃（90 天不登录会暂停）
3. 防火墙设置（允许所有 IP）

**Q: 图片不显示？**

A: 确保 `next.config.ts` 配置了远程图片源：
```typescript
images: {
  remotePatterns: [
    { hostname: 'images.unsplash.com' },
    { hostname: '你的图片存储域名' },
  ],
}
```

**Q: 支付回调不工作？**

A: 检查：
1. Stripe Webhook URL 是否正确
2. Webhook 密钥是否配置
3. 查看 Vercel Logs 排查错误

**Q: 如何回滚部署？**

A: Vercel → Deployments → 找到之前的版本 → 点击 "Promote to Production"

---

## 📞 部署完成检查清单

- [ ] 生产数据库创建并迁移
- [ ] 代码推送到 GitHub
- [ ] Vercel 项目创建并部署
- [ ] 环境变量配置完成
- [ ] 自定义域名配置（可选）
- [ ] Stripe Webhook 配置
- [ ] 管理员账户创建
- [ ] 完整功能测试通过
- [ ] 性能测试通过
- [ ] 监控和备份配置

---

**🎉 恭喜！你的电商独立站已正式上线！**

访问你的域名开始购物吧！
