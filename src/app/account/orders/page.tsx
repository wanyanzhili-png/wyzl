import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"

export default async function OrdersPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }
  
  // 获取用户订单
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">我的订单</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-6">暂无订单</p>
          <a
            href="/products"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            去购物
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">订单号：</span>
                  <span className="font-mono">{order.id}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">下单时间：</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="font-medium">
                  状态：
                  <span className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <div className="w-20 h-20 relative flex-shrink-0 rounded bg-muted">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>单价：{formatPrice(Number(item.price))}</span>
                        <span>数量：{item.quantity}</span>
                        <span className="font-bold text-primary">
                          小计：{formatPrice(Number(item.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-4 py-3 bg-muted/50 flex items-center justify-between">
                <div className="font-bold text-lg">
                  实付：{formatPrice(Number(order.total))}
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border rounded-md text-sm hover:bg-muted">
                    查看详情
                  </button>
                  {order.status === 'PENDING' && (
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                      去支付
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    PENDING: '待支付',
    PAID: '已支付',
    SHIPPED: '已发货',
    DELIVERED: '已完成',
    CANCELLED: '已取消',
    REFUNDED: '已退款',
  }
  return map[status] || status
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: 'text-orange-600',
    PAID: 'text-green-600',
    SHIPPED: 'text-blue-600',
    DELIVERED: 'text-green-600',
    CANCELLED: 'text-red-600',
    REFUNDED: 'text-gray-600',
  }
  return map[status] || 'text-gray-600'
}
