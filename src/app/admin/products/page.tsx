import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export default async function AdminProductsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  
  if (user?.role !== 'ADMIN') {
    redirect('/')
  }
  
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
            后台管理
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="font-medium">商品管理</span>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
        >
          添加商品
        </Link>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium">商品</th>
              <th className="text-left p-4 font-medium">分类</th>
              <th className="text-left p-4 font-medium">价格</th>
              <th className="text-left p-4 font-medium">库存</th>
              <th className="text-left p-4 font-medium">状态</th>
              <th className="text-left p-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative rounded bg-muted overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {product.description?.slice(0, 50)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm">
                  {product.category?.name || '-'}
                </td>
                <td className="p-4 font-medium">
                  {formatPrice(Number(product.price))}
                </td>
                <td className="p-4">
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? '有货' : '缺货'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      编辑
                    </Link>
                    <form action={`/admin/products/delete/${product.id}`} method="POST" className="inline">
                      <button
                        type="submit"
                        className="text-red-600 hover:underline text-sm"
                        onClick={(e) => {
                          if (!confirm('确定要删除这个商品吗？')) {
                            e.preventDefault()
                          }
                        }}
                      >
                        删除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
