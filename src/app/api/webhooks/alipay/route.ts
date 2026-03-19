import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAlipayNotify } from '@/lib/alipay'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const params: Record<string, string> = {}
    
    formData.forEach((value, key) => {
      params[key] = value as string
    })
    
    // 验证签名
    const isValid = verifyAlipayNotify(params)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    const {
      out_trade_no: orderId,
      trade_no: alipayTradeNo,
      trade_status: status,
      total_amount: amount,
    } = params
    
    // 处理支付结果
    if (status === 'TRADE_SUCCESS' || status === 'TRADE_FINISHED') {
      // 更新订单状态为已支付
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          paymentId: alipayTradeNo,
        },
      })
      
      // TODO: 扣减库存
      // TODO: 发送订单确认邮件
    } else if (status === 'TRADE_CLOSED') {
      // 订单关闭
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      })
    }
    
    // 返回 success 给支付宝
    return new NextResponse('success')
  } catch (error) {
    console.error('支付宝回调错误:', error)
    return NextResponse.json(
      { error: 'Webhook Error' },
      { status: 400 }
    )
  }
}
