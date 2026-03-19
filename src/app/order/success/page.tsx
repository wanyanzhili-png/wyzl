import Link from 'next/link'
import { CheckCircle, ShoppingBag } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const orderId = params.id
  
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="h-24 w-24 mx-auto text-green-600 mb-6" />
        <h1 className="text-2xl font-bold mb-4">订单提交成功！</h1>
        
        {orderId && (
          <p className="text-muted-foreground mb-8">
            订单号：{orderId}
          </p>
        )}
        
        <div className="border rounded-lg p-6 mb-8 text-left">
          <h2 className="font-bold mb-4">下一步操作</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                1
              </span>
              <span>请前往个人中心查看订单状态</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                2
              </span>
              <span>完成支付后我们将尽快发货</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                3
              </span>
              <span>收到商品后如有问题请联系客服</span>
            </li>
          </ol>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/account"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            查看订单
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 border rounded-md font-medium hover:bg-muted"
          >
            继续购物
          </Link>
        </div>
      </div>
    </div>
  )
}
