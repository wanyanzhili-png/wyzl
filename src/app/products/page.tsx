import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product-card'
import { Suspense } from 'react'

interface PageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    page?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { category, sort = 'newest', page = '1' } = params
  
  const pageNum = parseInt(page, 10) || 1
  const pageSize = 12
  
  // 获取所有分类
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  
  // 构建查询条件
  const where = category ? { categoryId: category } : {}
  
  // 构建排序
  const orderBy: any = {}
  if (sort === 'price-asc') orderBy.price = 'asc'
  else if (sort === 'price-desc') orderBy.price = 'desc'
  else if (sort === 'name') orderBy.name = 'asc'
  else orderBy.createdAt = 'desc' // newest
  
  // 获取商品
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      include: {
        category: true,
      },
    }),
    prisma.product.count({ where }),
  ])
  
  const totalPages = Math.ceil(total / pageSize)
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Categories */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="font-bold text-lg mb-4">分类</h2>
            <nav className="space-y-2">
              <a
                href="/products"
                className={`block px-3 py-2 rounded-md text-sm ${
                  !category
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                全部商品
              </a>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className={`block px-3 py-2 rounded-md text-sm ${
                    category === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {cat.name}
                </a>
              ))}
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {category 
                ? categories.find(c => c.id === category)?.name 
                : '全部商品'}
            </h1>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                共 {total} 件商品
              </span>
              
              <select
                defaultValue={sort}
                onChange={(e) => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('sort', e.target.value)
                  window.location.href = url.toString()
                }}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="newest">最新上架</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
                <option value="name">名称 A-Z</option>
              </select>
            </div>
          </div>
          
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    image={product.images[0] || '/placeholder.jpg'}
                    slug={product.id}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {pageNum > 1 && (
                    <a
                      href={`/products?${new URLSearchParams({ 
                        ...(category && { category }), 
                        page: String(pageNum - 1) 
                      })}`}
                      className="px-4 py-2 border rounded-md hover:bg-muted"
                    >
                      上一页
                    </a>
                  )}
                  
                  <span className="px-4 py-2 text-sm">
                    第 {pageNum} 页 / 共 {totalPages} 页
                  </span>
                  
                  {pageNum < totalPages && (
                    <a
                      href={`/products?${new URLSearchParams({ 
                        ...(category && { category }), 
                        page: String(pageNum + 1) 
                      })}`}
                      className="px-4 py-2 border rounded-md hover:bg-muted"
                    >
                      下一页
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">暂无商品</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
