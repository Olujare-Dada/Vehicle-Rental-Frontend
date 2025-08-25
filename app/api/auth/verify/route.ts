import { NextRequest, NextResponse } from 'next/server'
import { API_ENDPOINTS } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Call your backend API to verify token
    const response = await fetch(API_ENDPOINTS.verifyToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ 
        valid: true, 
        user: data.user || null 
      })
    } else {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 