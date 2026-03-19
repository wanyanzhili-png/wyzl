import { prisma } from '@/lib/prisma'

async function main() {
  // 创建分类
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: '电子产品',
      slug: 'electronics',
    },
  })

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: '服装配饰',
      slug: 'clothing',
    },
  })

  const home = await prisma.category.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      name: '家居生活',
      slug: 'home',
    },
  })

  const beauty = await prisma.category.upsert({
    where: { slug: 'beauty' },
    update: {},
    create: {
      name: '美妆护肤',
      slug: 'beauty',
    },
  })

  // 创建示例商品
  const products = [
    {
      name: '无线蓝牙耳机',
      description: '高品质音质，长续航，舒适佩戴体验。支持主动降噪，适合通勤和运动使用。',
      price: 299,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      categoryId: electronics.id,
    },
    {
      name: '智能手表',
      description: '多功能智能手表，支持心率监测、运动追踪、消息提醒等功能。',
      price: 899,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      categoryId: electronics.id,
    },
    {
      name: '纯棉 T 恤',
      description: '100% 纯棉材质，透气舒适，简约百搭。多色可选。',
      price: 99,
      stock: 200,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
      categoryId: clothing.id,
    },
    {
      name: '休闲牛仔裤',
      description: '经典版型，舒适弹力面料，日常穿搭必备。',
      price: 299,
      stock: 150,
      images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800'],
      categoryId: clothing.id,
    },
    {
      name: '北欧风格台灯',
      description: '简约设计，温暖光线，适合卧室和书房使用。',
      price: 199,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'],
      categoryId: home.id,
    },
    {
      name: '香薰蜡烛套装',
      description: '天然大豆蜡，多种香型，营造温馨氛围。',
      price: 129,
      stock: 120,
      images: ['https://images.unsplash.com/photo-1602825418950-495df5dc2e9d?w=800'],
      categoryId: home.id,
    },
    {
      name: '保湿面霜',
      description: '深层保湿，温和配方，适合所有肤质。',
      price: 189,
      stock: 90,
      images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'],
      categoryId: beauty.id,
    },
    {
      name: '精华液',
      description: '高浓度精华，改善肌肤质地，提亮肤色。',
      price: 399,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=800'],
      categoryId: beauty.id,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('✅ 种子数据创建成功！')
  console.log(`- 分类：4 个`)
  console.log(`- 商品：${products.length} 个`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
