import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// 微信支付配置
const WECHAT_CONFIG = {
  appId: process.env.WECHAT_PAY_APP_ID || '',
  mchId: process.env.WECHAT_PAY_MCH_ID || '',
  privateKey: process.env.WECHAT_PAY_PRIVATE_KEY || '',
  apiV3Key: process.env.WECHAT_PAY_API_V3_KEY || '',
  serialNo: process.env.WECHAT_PAY_SERIAL_NO || '',
}

// 生成微信支付签名
function generateWechatSign(method: string, url: string, body?: string): string {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const nonce = crypto.randomBytes(16).toString('hex')
  
  const bodyHash = body 
    ? crypto.createHash('sha256').update(body).digest('hex')
    : ''
  
  const signString = `${method}\n${url}\n${timestamp}\n${nonce}\n${bodyHash}\n`
  
  const sign = crypto
    .privateEncrypt(
      {
        key: Buffer.from(WECHAT_CONFIG.privateKey, 'base64').toString('utf8'),
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(signString)
    )
    .toString('base64')
  
  return `mchid="${WECHAT_CONFIG.mchId}",nonce_str="${nonce}",signature="${sign}",timestamp="${timestamp}",serial_no="${WECHAT_CONFIG.serialNo}"`
}

// 创建微信支付订单（JSAPI）
export async function createWechatPayment(orderData: {
  orderId: string
  amount: number
  description: string
  openid: string // 用户微信 openid
}) {
  const { orderId, amount, description, openid } = orderData
  
  const url = '/v3/pay/transactions/jsapi'
  const body = JSON.stringify({
    appid: WECHAT_CONFIG.appId,
    mchid: WECHAT_CONFIG.mchId,
    description,
    out_trade_no: orderId,
    notify_url: `${process.env.NEXTAUTH_URL}/api/webhooks/wechat`,
    amount: {
      total: Math.round(amount * 100), // 转换为分
      currency: 'CNY',
    },
    payer: {
      openid,
    },
  })
  
  const authorization = generateWechatSign('POST', url, body)
  
  const response = await fetch(`https://api.mch.weixin.qq.com${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `WECHATPAY2-SHA256-RSA2048 ${authorization}`,
    },
    body,
  })
  
  const data = await response.json()
  
  if (data.prepay_id) {
    // 返回前端需要的支付参数
    return {
      appId: WECHAT_CONFIG.appId,
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: crypto.randomBytes(16).toString('hex'),
      package: `prepay_id=${data.prepay_id}`,
      signType: 'RSA',
    }
  }
  
  throw new Error(data.message || '创建微信支付失败')
}

// 验证微信支付回调签名
export function verifyWechatNotify(
  headers: Headers,
  body: string
): boolean {
  const signature = headers.get('Wechatpay-Signature')
  const nonce = headers.get('Wechatpay-Nonce')
  const timestamp = headers.get('Wechatpay-Timestamp')
  
  if (!signature || !nonce || !timestamp) {
    return false
  }
  
  const signString = `${timestamp}\n${nonce}\n${body}\n`
  
  const publicKey = `-----BEGIN PUBLIC KEY-----\n${WECHAT_CONFIG.privateKey}\n-----END PUBLIC KEY-----`
  
  const verify = crypto
    .createVerify('SHA256')
    .update(signString)
  
  return verify.verify(publicKey, signature, 'base64')
}
