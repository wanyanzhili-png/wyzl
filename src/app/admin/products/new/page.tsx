'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      categoryId: formData.get('categoryId') as string,
      images: (formData.get('images') as string).split('\n').filter(url => url.trim()),
    }
    
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (res.ok) {
        router.push('/admin/products')
      } else {
        const data = await res.json()
        setError(data.error || '创建失败')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container py-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <a href="/admin/products" className="text-sm text-muted-foreground hover:underline">
            商品管理
          </a>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="font-medium">添加商品</span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">
              商品名称 *
            </label>
            <input
              name="name"
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入商品名称"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              商品描述
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="商品详细介绍"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                价格 (元) *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                库存 *
              </label>
              <input
                name="stock"
                type="number"
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              分类 *
            </label>
            <select
              name="categoryId"
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">选择分类</option>
              <option value="electronics">电子产品</option>
              <option value="clothing">服装配饰</option>
              <option value="home">家居生活</option>
              <option value="beauty">美妆护肤</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              商品图片 URL
            </label>
            <textarea
              name="images"
              rows={3}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="每行一个图片 URL"
              defaultValue="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建商品'}
            </button>
            <a
              href="/admin/products"
              className="px-6 py-3 border rounded-md text-center font-medium hover:bg-muted"
            >
              取消
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
