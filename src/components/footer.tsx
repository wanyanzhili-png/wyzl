import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <p className="text-sm text-muted-foreground">
              优质商品，贴心服务
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">购物指南</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help/shipping" className="hover:underline">配送说明</Link></li>
              <li><Link href="/help/returns" className="hover:underline">退换货政策</Link></li>
              <li><Link href="/help/payment" className="hover:underline">支付方式</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">客户服务</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:underline">联系我们</Link></li>
              <li><Link href="/faq" className="hover:underline">常见问题</Link></li>
              <li><Link href="/privacy" className="hover:underline">隐私政策</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">关注我们</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="https://weibo.com" className="hover:underline">微博</Link></li>
              <li><Link href="https://wechat.com" className="hover:underline">微信</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
