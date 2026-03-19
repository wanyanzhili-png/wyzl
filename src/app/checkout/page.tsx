'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { CreditCard, Truck, Shield } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  if (items.length === 0) {
    router.push('/cart')
    return null
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const orderData = {
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalPrice(),
      address: {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        province: formData.get('province') as string,
        city: formData.get('city') as string,
        district: formData.get('district') as string,
        detail: formData.get('detail') as string,
      },
      paymentMethod: formData.get('payment') as string,
    }
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      
      if (res.ok) {
        const data = await res.json()
        clearCart()
        
        // 跳转到支付或订单成功页
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        } else {
          router.push(`/order/success?id=${data.orderId}`)
        }
      } else {
        const data = await res.json()
        setError(data.error || '创建订单失败')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">结算</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}
            
            {/* 收货地址 */}
            <section className="border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">收货地址</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    收货人姓名 *
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    手机号码 *
                  </label>
                  <input
                    name="phone"
                    required
                    type="tel"
                    pattern="[0-9]{11}"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="11 位手机号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    省份 *
                  </label>
                  <input
                    name="province"
                    required
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="如：广东省"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    城市 *
                  </label>
                  <input
                    name="city"
                    required
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="如：深圳市"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    区县 *
                  </label>
                  <input
                    name="district"
                    required
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="如：南山区"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    详细地址 *
                  </label>
                  <input
                    name="detail"
                    required
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="街道、楼号、门牌号"
                  />
                </div>
              </div>
            </section>
            
            {/* 支付方式 */}
            <section className="border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">支付方式</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="wechat"
                    defaultChecked
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">💚</div>
                    <div className="font-medium">微信支付</div>
                  </div>
                </label>
                <label className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="alipay"
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">💙</div>
                    <div className="font-medium">支付宝</div>
                  </div>
                </label>
                <label className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    className="sr-only"
                  />
                  <div className="text-center">
                    <CreditCard className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">银行卡</div>
                  </div>
                </label>
              </div>
            </section>
            
            {/* 配送方式 */}
            <section className="border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">配送方式</h2>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Truck className="h-5 w-5" />
                <span>快递配送 - 免运费（预计 2-3 天送达）</span>
              </div>
            </section>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-md font-bold text-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? '提交中...' : `提交订单 - ${formatPrice(totalPrice())}`}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">订单摘要</h2>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-16 h-16 relative flex-shrink-0 rounded bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      × {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">商品金额</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">运费</span>
                <span className="text-green-600">¥0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>实付金额</span>
                <span className="text-primary">{formatPrice(totalPrice())}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>安全支付，请放心购物</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
