import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// 支付宝配置
const ALIPAY_CONFIG = {
  appId: process.env.ALIPAY_APP_ID || '',
  privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
  gateway: 'https://openapi.alipay.com/gateway.do',
  sandbox: process.env.NODE_ENV === 'development',
}

// 生成支付宝签名
function generateSign(params: Record<string, string>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .filter(key => params[key] && key !== 'sign')
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  const signString = sortedParams + ALIPAY_CONFIG.privateKey
  const sign = crypto
    .createSign('RSA-SHA256')
    .update(signString, 'utf8')
    .sign(ALIPAY_CONFIG.privateKey, 'base64')
  
  return sign
}

// 创建支付宝支付链接
export async function createAlipayPayment(orderData: {
  orderId: string
  amount: number
  subject: string
  body?: string
}) {
  const { orderId, amount, subject, body } = orderData
  
  const params: Record<string, string> = {
    app_id: ALIPAY_CONFIG.appId,
    method: 'alipay.trade.page.pay',
    format: 'JSON',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().replace('Z', '+08:00'),
    version: '1.0',
    biz_content: JSON.stringify({
      out_trade_no: orderId,
      total_amount: amount.toFixed(2),
      subject,
      body: body || '',
      product_code: 'FAST_INSTANT_TRADE_PAY',
      return_url: `${process.env.NEXTAUTH_URL}/order/success?id=${orderId}`,
      notify_url: `${process.env.NEXTAUTH_URL}/api/webhooks/alipay`,
    }),
  }
  
  params.sign = generateSign(params)
  
  const queryString = new URLSearchParams(params).toString()
  const paymentUrl = `${ALIPAY_CONFIG.gateway}?${queryString}`
  
  return paymentUrl
}

// 验证支付宝回调签名
export function verifyAlipayNotify(params: Record<string, string>): boolean {
  const sign = params.sign
  if (!sign) return false
  
  const paramsToVerify = { ...params }
  delete paramsToVerify.sign
  delete paramsToVerify.sign_type
  
  const verifyString = Object.keys(paramsToVerify)
    .sort()
    .map(key => `${key}=${paramsToVerify[key]}`)
    .join('&')
  
  const verify = crypto
    .createVerify('RSA-SHA256')
    .update(verifyString, 'utf8')
  
  const publicKey = `-----BEGIN PUBLIC KEY-----\n${ALIPAY_CONFIG.privateKey}\n-----END PUBLIC KEY-----`
  
  return verify.verify(publicKey, sign, 'base64')
}
