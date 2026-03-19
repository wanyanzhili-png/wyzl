import { prisma } from '@/lib/prisma'
import { Star } from 'lucide-react'
import { ReviewForm } from '@/components/review-form'
import { auth } from '@/auth/auth'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) {
    return <div>商品不存在</div>
  }

  // 计算平均评分
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0

  // 检查用户是否已购买该商品（用于显示评价表单）
  const hasPurchased = session?.user.id
    ? await prisma.order.findFirst({
        where: {
          userId: session.user.id,
          status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
          items: {
            some: { productId: id },
          },
        },
      })
    : false

  // 检查用户是否已评价
  const hasReviewed = session?.user.id
    ? await prisma.review.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: id,
          },
        },
      })
    : false

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
            <img
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.category && (
            <a
              href={`/products?category=${product.category.id}`}
              className="text-sm text-muted-foreground hover:underline mb-2"
            >
              {product.category.name}
            </a>
          )}

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.reviews.length} 条评价
            </span>
          </div>

          <div className="text-3xl font-bold text-primary mb-6">
            ¥{Number(product.price).toFixed(2)}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">库存:</span>
              <span
                className={`font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.stock > 0 ? `有货 (${product.stock}件)` : '缺货'}
              </span>
            </div>
          </div>

          {/* TODO: Add to cart button */}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">用户评价</h2>

        {/* Review Form */}
        {session?.user && hasPurchased && !hasReviewed ? (
          <div className="mb-8 p-6 border rounded-lg">
            <h3 className="font-bold mb-4">发表评价</h3>
            <ReviewForm productId={id} userId={session.user.id} />
          </div>
        ) : session?.user && hasReviewed ? (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
            您已经评价过该商品
          </div>
        ) : (
          <div className="mb-8 p-4 bg-muted rounded-md text-center text-muted-foreground">
            {session?.user
              ? '您还没有购买过该商品，购买后可以发表评价'
              : '登录后购买可以发表评价'}
          </div>
        )}

        {/* Reviews List */}
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                      {review.user.name?.[0] || review.user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">
                        {review.user.name || '匿名用户'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.content && (
                  <p className="text-muted-foreground">{review.content}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            暂无评价，快来成为第一个评价的人吧！
          </div>
        )}
      </div>
    </div>
  )
}
