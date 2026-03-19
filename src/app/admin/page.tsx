import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export default async function AdminDashboard() {
  const session = await auth()
  
  // 检查管理员权限
  if (!session?.user) {
    redirect('/login')
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  
  if (user?.role !== 'ADMIN') {
    redirect('/')
  }
  
  // 获取统计数据
  const [productCount, orderCount, totalRevenue, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true },
        },
      },
    }),
  ])
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">后台管理</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
        >
          添加商品
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-sm text-muted-foreground mb-2">商品总数</h3>
          <p className="text-3xl font-bold">{productCount}</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm text-muted-foreground mb-2">订单总数</h3>
          <p className="text-3xl font-bold">{orderCount}</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm text-muted-foreground mb-2">总收入</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatPrice(Number(totalRevenue._sum.total || 0))}
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm text-muted-foreground mb-2">待处理订单</h3>
          <p className="text-3xl font-bold text-orange-600">
            {recentOrders.filter(o => o.status === 'PENDING').length}
          </p>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted px-6 py-4">
          <h2 className="font-bold">最近订单</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">订单号</th>
                <th className="text-left p-4 font-medium">用户</th>
                <th className="text-left p-4 font-medium">金额</th>
                <th className="text-left p-4 font-medium">状态</th>
                <th className="text-left p-4 font-medium">时间</th>
                <th className="text-left p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="p-4 font-mono text-sm">{order.id}</td>
                  <td className="p-4 text-sm">{order.user.email}</td>
                  <td className="p-4 font-medium">{formatPrice(Number(order.total))}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBg(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {order.createdAt.toLocaleDateString('zh-CN')}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      查看
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link
          href="/admin/products"
          className="border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-bold text-lg mb-2">📦 商品管理</h3>
          <p className="text-sm text-muted-foreground">
            添加、编辑、删除商品，管理库存
          </p>
        </Link>
        <Link
          href="/admin/orders"
          className="border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-bold text-lg mb-2">📋 订单管理</h3>
          <p className="text-sm text-muted-foreground">
            查看所有订单，更新订单状态
          </p>
        </Link>
        <Link
          href="/admin/categories"
          className="border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-bold text-lg mb-2">🏷️ 分类管理</h3>
          <p className="text-sm text-muted-foreground">
            管理商品分类
          </p>
        </Link>
      </div>
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

function getStatusBg(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-orange-100 text-orange-800',
    PAID: 'bg-green-100 text-green-800',
    SHIPPED: 'bg-blue-100 text-blue-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}
