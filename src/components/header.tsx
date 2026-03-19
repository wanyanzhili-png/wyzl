import Link from 'next/link'
import { ShoppingCart, User, Search, Menu } from 'lucide-react'
import { useCart } from '@/lib/cart-store'

export default function Header() {
  const totalItems = useCart((state) => state.totalItems())
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Shop</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:underline">
              全部商品
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:underline">
              分类
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              关于我们
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/search" className="text-sm font-medium hover:underline">
            <Search className="h-5 w-5" />
          </Link>
          
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          <Link href="/account" className="text-sm font-medium hover:underline">
            <User className="h-5 w-5" />
          </Link>
          
          <button className="md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
