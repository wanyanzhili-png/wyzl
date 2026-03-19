import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWechatNotify } from '@/lib/wechat-pay'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headers = req.headers
    
    // 验证签名
    const isValid = verifyWechatNotify(headers, body)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    const data = JSON.parse(body)
    const {
      out_trade_no: orderId,
      transaction_id: wechatTradeNo,
      trade_state: status,
      amount: { total },
    } = data
    
    // 处理支付结果
    if (status === 'SUCCESS') {
      // 更新订单状态为已支付
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          paymentId: wechatTradeNo,
        },
      })
      
      // TODO: 扣减库存
      // TODO: 发送订单确认邮件
    }
    
    // 返回 success 给微信
    return NextResponse.json({
      code: 'SUCCESS',
      message: 'OK',
    })
  } catch (error) {
    console.error('微信支付回调错误:', error)
    return NextResponse.json(
      { error: 'Webhook Error' },
      { status: 400 }
    )
  }
}
