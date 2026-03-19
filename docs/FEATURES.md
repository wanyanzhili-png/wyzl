# 电商独立站 - 功能扩展文档

## 📦 本次新增功能 (IJKL)

---

## I) 部署上线 ✅

### 新增文件
- `docs/DEPLOY.md` - 完整部署指南

### 部署流程摘要

**1. 准备生产数据库 (Supabase)**
```bash
# 访问 https://supabase.com 创建项目
# 获取数据库连接字符串
```

**2. 推送代码到 GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

**3. 部署到 Vercel**
- 访问 https://vercel.com/new
- 导入 GitHub 仓库
- 配置环境变量
- 点击 Deploy

**4. 配置环境变量**
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=你的密钥
NEXTAUTH_URL=https://你的域名.vercel.app
STRIPE_SECRET_KEY=sk_live_xxx
RESEND_API_KEY=re_xxx
```

详细步骤见 `docs/DEPLOY.md`

---

## J) 支付宝/微信支付集成 ✅

### 新增文件
- `src/lib/alipay.ts` - 支付宝支付封装
- `src/lib/wechat-pay.ts` - 微信支付封装
- `src/app/api/webhooks/alipay/route.ts` - 支付宝回调
- `src/app/api/webhooks/wechat/route.ts` - 微信支付回调

### 支付宝配置

**1. 申请支付宝开放平台账号**
- 访问 https://open.alipay.com
- 创建应用，获取 APP_ID

**2. 配置密钥**
- 生成 RSA2 密钥对
- 上传公钥到支付宝平台
- 下载支付宝公钥

**3. 环境变量配置**
```bash
ALIPAY_APP_ID="2021xxxxxxxxx"
ALIPAY_PRIVATE_KEY="MIIEvQIBADANBg..."
ALIPAY_PUBLIC_KEY="MIIBIjANBg..."
```

**4. 配置回调地址**
- 登录通知 URL: `https://你的域名/api/webhooks/alipay`

### 微信支付配置

**1. 申请微信商户平台账号**
- 访问 https://pay.weixin.qq.com
- 完成企业认证

**2. 配置 API 密钥**
- 商户平台 → API 安全 → 设置 API v3 密钥
- 下载 API 证书

**3. 环境变量配置**
```bash
WECHAT_PAY_APP_ID="wx_xxxxxxxxxxxxx"
WECHAT_PAY_MCH_ID="1234567890"
WECHAT_PAY_PRIVATE_KEY="MIIEvQIBADANBg..."
WECHAT_PAY_API_V3_KEY="your-api-v3-key-32-chars"
WECHAT_PAY_SERIAL_NO="xxxxxxxxxxxxxxxx"
```

**4. 配置回调地址**
- 商户平台 → 开发配置 → 支付回调 URL
- 设置为：`https://你的域名/api/webhooks/wechat`

### 使用方式

在结算页面选择支付方式后，系统会自动调用对应的支付接口：

```typescript
// 订单创建 API 已集成
if (paymentMethod === 'alipay') {
  // 调用支付宝支付
} else if (paymentMethod === 'wechat') {
  // 调用微信支付
}
```

---

## K) 商品评价系统 ✅

### 新增文件
- `src/components/review-form.tsx` - 评价表单组件
- `src/app/api/reviews/route.ts` - 评价 API
- 更新了 `src/app/product/[id]/page.tsx` - 商品详情页增加评价展示

### 数据库变更

新增 `Review` 模型：
```prisma
model Review {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  rating    Int      // 1-5 星
  content   String?
  images    String[]
  createdAt DateTime @default(now())
  
  @@unique([userId, productId]) // 每个用户对每个商品只能评价一次
}
```

### 功能特性

✅ **评价提交**
- 仅购买过该商品的用户可以评价
- 1-5 星评分
- 文字评价
- 每个用户对每个商品只能评价一次

✅ **评价展示**
- 商品详情页显示平均评分
- 评价列表按时间倒序
- 显示评价者昵称和评价时间

✅ **评价管理**
- API 支持获取商品所有评价
- 后续可扩展：评价点赞、举报、商家回复

### 更新数据库

```bash
# 运行迁移
npm run db:migrate

# 重新生成 Prisma 客户端
npm run db:generate
```

---

## L) 邮件通知系统 ✅

### 新增文件
- `src/lib/email.ts` - 邮件发送封装

### 依赖安装

已安装 `resend` 邮件服务

### 环境变量配置

```bash
RESEND_API_KEY="re_xxxxxxxxxxxxx"
```

获取 API 密钥：
1. 访问 https://resend.com
2. 注册账号
3. 创建 API Key
4. 配置发件人域名（可选）

### 邮件类型

**1. 订单确认邮件**
- 触发：订单创建成功后
- 内容：订单号、商品清单、金额
- 接收人：下单用户

**2. 发货通知邮件**
- 触发：订单状态更新为 SHIPPED
- 内容：订单号、物流单号
- 接收人：下单用户

**3. 欢迎邮件**
- 触发：用户注册成功
- 内容：欢迎词、新手优惠券
- 接收人：新用户

### 集成位置

- 订单创建 API (`/api/orders`) 已集成订单确认邮件
- 后续可在后台管理添加发货通知

### 自定义邮件模板

编辑 `src/lib/email.ts` 中的 HTML 模板，可以自定义：
- 发件人名称
- 邮件主题
- 邮件内容样式
- 添加公司 Logo

---

## 📋 完整功能清单

### Phase 1: 基础框架 ✅
- [x] 首页
- [x] 商品列表（分类/排序/分页）
- [x] 商品详情
- [x] 用户认证（登录/注册）
- [x] 个人中心

### Phase 2: 购物车 + 支付 ✅
- [x] 购物车
- [x] 结算流程
- [x] 订单管理
- [x] Stripe 支付
- [x] 支付宝支付（集成代码）
- [x] 微信支付（集成代码）

### Phase 3: 后台管理 ✅
- [x] 管理仪表盘
- [x] 商品管理
- [x] 订单管理

### Phase 4: 扩展功能 ✅
- [x] 部署指南
- [x] 商品评价系统
- [x] 邮件通知系统

---

## 🚀 下一步行动

### 立即可做

1. **运行数据库迁移**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

2. **配置邮件服务**
   ```bash
   # 获取 Resend API 密钥
   # 添加到 .env 文件
   RESEND_API_KEY="re_xxx"
   ```

3. **测试评价系统**
   - 创建测试订单
   - 以购买用户身份登录
   - 访问商品详情页提交评价

### 部署前准备

1. **配置支付**
   - Stripe: 测试模式已可用
   - 支付宝：申请开放平台账号
   - 微信：申请商户平台账号

2. **配置邮件**
   - Resend 免费版每月 3000 封
   - 配置发件人域名提升送达率

3. **部署到 Vercel**
   - 参考 `docs/DEPLOY.md`

---

## 📞 常见问题

**Q: 评价系统如何限制只有购买用户才能评价？**

A: 在 `/api/reviews` 中检查用户是否有已支付的订单包含该商品。

**Q: 邮件发送失败怎么办？**

A: 检查：
1. RESEND_API_KEY 是否正确
2. 发件人域名是否验证（Resend 后台）
3. 查看 Vercel Logs 排查错误

**Q: 支付宝/微信测试环境怎么配置？**

A: 
- 支付宝：使用沙箱环境（开放平台 → 沙箱）
- 微信：使用测试账号（微信开放平台）

---

**🎉 恭喜！你的电商独立站功能已非常完善！**
