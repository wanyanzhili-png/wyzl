import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { productId, rating, content } = body

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '评分无效' },
        { status: 400 }
      )
    }

    // 检查是否已购买该商品
    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
        items: {
          some: { productId },
        },
      },
    })

    if (!hasPurchased) {
      return NextResponse.json(
        { error: '只有购买过该商品的用户才能评价' },
        { status: 403 }
      )
    }

    // 检查是否已评价
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: '您已经评价过该商品' },
        { status: 400 }
      )
    }

    // 创建评价
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        content: content || null,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    // TODO: 发送邮件通知商家

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('创建评价错误:', error)
    return NextResponse.json(
      { error: '创建评价失败' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: '缺少商品 ID' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('获取评价错误:', error)
    return NextResponse.json(
      { error: '获取评价失败' },
      { status: 500 }
    )
  }
}
