import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
})

export async function createPaymentSession(orderId: string, amount: number) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cny',
          product_data: {
            name: '订单支付',
          },
          unit_amount: Math.round(amount * 100), // 转换为分
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/order/success?id=${orderId}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
    metadata: {
      orderId,
    },
  })
  
  return session.url
}

export async function handleWebhookSignature(
  body: string,
  signature: string
) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!endpointSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured')
  }
  
  return stripe.webhooks.constructEvent(body, signature, endpointSecret)
}
