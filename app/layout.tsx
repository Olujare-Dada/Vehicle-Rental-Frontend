import React from 'react'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RentEasy - Vehicle Rental Service',
  description: 'Your trusted partner for vehicle rentals. Safe, reliable, and affordable.',
}

export default function RootLayout({
  children,
}: {
  children: any
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 