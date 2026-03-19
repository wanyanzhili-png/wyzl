import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, price, stock, categoryId, images } = body
    
    if (!name || !price) {
      return NextResponse.json(
        { error: '商品名称和价格为必填项' },
        { status: 400 }
      )
    }
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        images: images || [],
        categoryId: categoryId || null,
      },
    })
    
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('创建商品错误:', error)
    return NextResponse.json(
      { error: '创建失败，请稍后重试' },
      { status: 500 }
    )
  }
}
