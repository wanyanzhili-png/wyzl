import { NextRequest, NextResponse } from 'next/server'
import { stripe, handleWebhookSignature } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }
  
  try {
    const event = await handleWebhookSignature(body, signature)
    
    // 处理支付成功事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      
      const orderId = session.metadata.orderId
      
      if (orderId) {
        // 更新订单状态为已支付
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            paymentId: session.payment_intent,
          },
        })
        
        // 更新商品库存
        const lineItems = session.line_items?.data || []
        for (const item of lineItems) {
          // 这里需要根据实际情况更新库存
          // await prisma.product.update({...})
        }
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error.message)
    return NextResponse.json(
      { error: 'Webhook Error' },
      { status: 400 }
    )
  }
}
