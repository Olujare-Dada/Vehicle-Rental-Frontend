import { NextRequest, NextResponse } from 'next/server'
import { API_ENDPOINTS } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      city,
      state,
      zipcode,
      license,
      licenseState,
      licenseExpiry,
      dateOfBirth,
      currentBalance
    } = body

    // Validate required fields
    if (!username || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Username, first name, last name, email, and password are required' },
        { status: 400 }
      )
    }

    // Call your backend API
    const response = await fetch(API_ENDPOINTS.signup, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
        phone: phone || '',
        address: address || '',
        city: city || '',
        state: state || '',
        zipcode: zipcode || '',
        license: license || '',
        licenseState: licenseState || '',
        licenseExpiry: licenseExpiry || '',
        dateOfBirth: dateOfBirth || '',
        currentBalance: currentBalance || 0.00
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || 'Signup failed' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 