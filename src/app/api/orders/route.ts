import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPaymentSession } from '@/lib/stripe'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, total, address, paymentMethod } = body
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: '购物车为空' },
        { status: 400 }
      )
    }
    
    // 这里应该获取当前登录用户
    // 暂时用示例用户 ID
    const userId = 'user-id-from-session' // TODO: 从 session 获取
    
    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        address,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })
    
    // 发送订单确认邮件
    await sendOrderConfirmationEmail({
      id: order.id,
      userEmail: order.user.email,
      userName: order.user.name,
      total: Number(order.total),
      items: order.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    })
    
    // 根据支付方式生成支付链接
    let paymentUrl: string | null = null
    
    if (paymentMethod === 'stripe' || paymentMethod === 'card') {
      // 创建 Stripe 支付会话
      paymentUrl = await createPaymentSession(order.id, Number(total))
    } else if (paymentMethod === 'alipay') {
      // TODO: 集成支付宝
      // paymentUrl = await createAlipayPayment(order)
    } else if (paymentMethod === 'wechat') {
      // TODO: 集成微信支付
      // paymentUrl = await createWechatPayment(order)
    }
    
    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl,
    })
  } catch (error) {
    console.error('创建订单错误:', error)
    return NextResponse.json(
      { error: '创建订单失败，请稍后重试' },
      { status: 500 }
    )
  }
}
