'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
  
  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">购物车是空的</h1>
          <p className="text-muted-foreground mb-8">
            快去挑选心仪的商品吧！
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            去购物
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">购物车 ({totalItems()} 件商品)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 border rounded-lg p-4"
            >
              <div className="w-24 h-24 relative flex-shrink-0 rounded-md overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${item.productId}`}
                    className="font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-primary font-bold mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-muted"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-muted-foreground hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">小计</p>
                <p className="text-lg font-bold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">订单摘要</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">商品数量</span>
                <span>{totalItems()} 件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">商品金额</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">运费</span>
                <span className="text-green-600">免运费</span>
              </div>
              
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>总计</span>
                <span className="text-primary">{formatPrice(totalPrice())}</span>
              </div>
            </div>
            
            <Link
              href="/checkout"
              className="w-full block text-center bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              去结算
            </Link>
            
            <Link
              href="/products"
              className="block text-center text-sm text-muted-foreground hover:underline mt-4"
            >
              继续购物
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
