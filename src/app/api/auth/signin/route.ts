import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/auth/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, redirect = true } = body
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: error.message || '登录失败' },
      { status: 401 }
    )
  }
}
