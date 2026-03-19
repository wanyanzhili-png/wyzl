import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY || '')

// 发送订单确认邮件
export async function sendOrderConfirmationEmail(order: {
  id: string
  userEmail: string
  userName?: string | null
  total: number
  items: Array<{
    product: { name: string; images: string[] }
    quantity: number
    price: number
  }>
}) {
  try {
    await resend.emails.send({
      from: 'Shop <orders@yourstore.com>',
      to: order.userEmail,
      subject: `订单确认 - ${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">感谢您的订购！</h1>
          
          <p>亲爱的 ${order.userName || '用户'}，</p>
          
          <p>您的订单已确认，我们将尽快为您处理。</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2 style="color: #333; font-size: 18px;">订单详情</h2>
            <p><strong>订单号：</strong> ${order.id}</p>
            <p><strong>订单金额：</strong> ¥${Number(order.total).toFixed(2)}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333; font-size: 16px;">商品清单</h3>
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span>${item.product.name} × ${item.quantity}</span>
                <span>¥${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          
          <p style="color: #666; font-size: 14px;">
            如有任何问题，请随时联系我们的客服。
          </p>
          
          <p>祝您购物愉快！</p>
          <p><strong>Shop 团队</strong></p>
        </div>
      `,
    })
    
    return { success: true }
  } catch (error) {
    console.error('发送邮件失败:', error)
    return { success: false, error }
  }
}

// 发送发货通知邮件
export async function sendShippingNotificationEmail(order: {
  id: string
  userEmail: string
  userName?: string | null
  trackingNumber?: string
}) {
  try {
    await resend.emails.send({
      from: 'Shop <orders@yourstore.com>',
      to: order.userEmail,
      subject: `订单已发货 - ${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">您的订单已发货！</h1>
          
          <p>亲爱的 ${order.userName || '用户'}，</p>
          
          <p>好消息！您的订单已经发货，预计 2-3 天内送达。</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p><strong>订单号：</strong> ${order.id}</p>
            ${order.trackingNumber ? `
              <p><strong>物流单号：</strong> ${order.trackingNumber}</p>
            ` : ''}
          </div>
          
          <p>您可以通过个人中心查看订单详情和物流信息。</p>
          
          <p>感谢您的支持！</p>
          <p><strong>Shop 团队</strong></p>
        </div>
      `,
    })
    
    return { success: true }
  } catch (error) {
    console.error('发送邮件失败:', error)
    return { success: false, error }
  }
}

// 发送欢迎邮件
export async function sendWelcomeEmail(user: {
  email: string
  name?: string | null
}) {
  try {
    await resend.emails.send({
      from: 'Shop <welcome@yourstore.com>',
      to: user.email,
      subject: '欢迎来到 Shop！',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">欢迎加入 Shop！</h1>
          
          <p>亲爱的 ${user.name || '用户'}，</p>
          
          <p>感谢您注册 Shop 账号！我们致力于为您提供最优质的购物体验。</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #333; font-size: 16px;">新手福利</h3>
            <p>使用优惠码 <strong>WELCOME10</strong> 即可享受首单 9 折优惠！</p>
          </div>
          
          <p>现在就开始探索我们的精选商品吧！</p>
          
          <p>祝您购物愉快！</p>
          <p><strong>Shop 团队</strong></p>
        </div>
      `,
    })
    
    return { success: true }
  } catch (error) {
    console.error('发送邮件失败:', error)
    return { success: false, error }
  }
}
