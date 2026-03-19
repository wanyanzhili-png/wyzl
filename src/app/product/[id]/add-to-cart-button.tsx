'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-store'
import { ShoppingCart, Check } from 'lucide-react'

interface ProductData {
  id: string
  name: string
  price: number
  image: string
}

interface AddToCartButtonProps {
  product: ProductData
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCart((state) => state.addItem)
  
  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-medium">
          数量:
        </label>
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-muted"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-muted"
          >
            +
          </button>
        </div>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={added}
        className={`w-full py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            已加入购物车
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            加入购物车
          </>
        )}
      </button>
    </div>
  )
}
