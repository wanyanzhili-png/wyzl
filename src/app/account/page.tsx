import { auth } from "@/auth/auth"

export default async function Page() {
  const session = await auth()
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">个人中心</h1>
      
      {session?.user ? (
        <div className="max-w-md border rounded-lg p-6">
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">账户信息</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">邮箱:</span>
                <span>{session.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">姓名:</span>
                <span>{session.user.name || '未设置'}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <a
              href="/account/orders"
              className="block p-4 border rounded-md hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">我的订单</h3>
              <p className="text-sm text-muted-foreground">查看订单历史</p>
            </a>
            
            <a
              href="/account/address"
              className="block p-4 border rounded-md hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">收货地址</h3>
              <p className="text-sm text-muted-foreground">管理收货地址</p>
            </a>
            
            <form
              action={async () => {
                'use server'
                const { signOut } = await import('@/auth/auth')
                await signOut({ redirectTo: '/' })
              }}
            >
              <button
                type="submit"
                className="w-full py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                退出登录
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center">
          <p className="text-muted-foreground mb-6">请先登录以查看个人信息</p>
          <div className="flex gap-4 justify-center">
            <a
              href="/login"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              登录
            </a>
            <a
              href="/register"
              className="px-6 py-2 border rounded-md hover:bg-muted"
            >
              注册
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
