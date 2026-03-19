import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/product-card'

// 示例商品数据（后续会从数据库加载）
const featuredProducts = [
  {
    id: '1',
    name: '优质商品示例 1',
    price: 299,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    slug: 'product-1',
  },
  {
    id: '2',
    name: '优质商品示例 2',
    price: 499,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    slug: 'product-2',
  },
  {
    id: '3',
    name: '优质商品示例 3',
    price: 199,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    slug: 'product-3',
  },
  {
    id: '4',
    name: '优质商品示例 4',
    price: 399,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    slug: 'product-4',
  },
]

export default function HomePage() {
  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="relative rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-16 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            欢迎来到 Shop
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            发现优质商品，享受便捷购物体验。我们精心挑选每一件商品，只为给您最好的选择。
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            立即购物
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">精选商品</h2>
          <Link href="/products" className="text-sm font-medium hover:underline flex items-center gap-1">
            查看全部
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">热门分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['电子产品', '服装配饰', '家居生活', '美妆护肤'].map((category) => (
            <Link
              key={category}
              href={`/categories/${encodeURIComponent(category)}`}
              className="relative h-32 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <span className="font-medium text-lg">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t">
        <div className="text-center p-6">
          <h3 className="font-bold mb-2">🚀 快速配送</h3>
          <p className="text-sm text-muted-foreground">
            全国包邮，最快次日达
          </p>
        </div>
        <div className="text-center p-6">
          <h3 className="font-bold mb-2">💳 安全支付</h3>
          <p className="text-sm text-muted-foreground">
            支持多种支付方式，安全有保障
          </p>
        </div>
        <div className="text-center p-6">
          <h3 className="font-bold mb-2">🔄 无忧退换</h3>
          <p className="text-sm text-muted-foreground">
            7 天无理由退换货
          </p>
        </div>
      </section>
    </div>
  )
}
