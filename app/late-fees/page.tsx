'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Car, DollarSign, Calendar, AlertTriangle, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { getToken, getCurrentUser } from "@/lib/auth"
import { API_ENDPOINTS } from "@/lib/config"

interface LateFee {
  id: number;
  username: string;
  rentalId: number;
  daysLate: number;
  totalCost: number;
  amountPaid: number;
  createdAt: string;
}

interface PaymentFormData {
  lateFeeId: number;
  paymentAmount: number;
  paymentNotes: string;
}

export default function LateFeesPage() {
  const [lateFees, setLateFees] = useState<LateFee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [paymentLoading, setPaymentLoading] = useState<number | null>(null)
  const [userBalance, setUserBalance] = useState<number>(0)
  const [balanceLoading, setBalanceLoading] = useState(false)

  useEffect(() => {
    fetchLateFees()
    fetchUserBalance()
  }, [])

  const fetchLateFees = async () => {
    try {
      setLoading(true)
      setError('')

      const token = getToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      const response = await fetch(API_ENDPOINTS.lateFeesUser, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setLateFees(data.data)
        } else {
          setError(data.message || 'Failed to fetch late fees')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch late fees')
      }
    } catch (error) {
      console.error('Error fetching late fees:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserBalance = async () => {
    try {
      setBalanceLoading(true)
      const token = getToken()
      if (!token) {
        return
      }

      const response = await fetch(API_ENDPOINTS.balance, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const balance = parseFloat(data.data.currentBalance.toString())
          setUserBalance(balance)
        }
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setBalanceLoading(false)
    }
  }

  const handlePayment = async (lateFee: LateFee) => {
    try {
      setPaymentLoading(lateFee.id)
      setError('')
      setSuccess('')

      const token = getToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      // Calculate remaining amount
      const remainingAmount = lateFee.totalCost - lateFee.amountPaid
      
      // Check if user has sufficient balance
      if (userBalance < remainingAmount) {
        setError(`Insufficient balance. You have $${userBalance.toFixed(2)} but need $${remainingAmount.toFixed(2)}`)
        return
      }

      const paymentData: PaymentFormData = {
        lateFeeId: lateFee.id,
        paymentAmount: remainingAmount,
        paymentNotes: `Full payment for late fee #${lateFee.id}`
      }

      const response = await fetch(API_ENDPOINTS.lateFeesPay, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSuccess(`Payment successful! New balance: $${data.data.newBalance.toFixed(2)}`)
          // Refresh data
          await Promise.all([fetchLateFees(), fetchUserBalance()])
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(''), 3000)
        } else {
          setError(data.message || 'Payment failed')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Payment failed')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      setError('Network error. Please try again.')
    } finally {
      setPaymentLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRemainingAmount = (lateFee: LateFee) => {
    return lateFee.totalCost - lateFee.amountPaid
  }

  const isFullyPaid = (lateFee: LateFee) => {
    return lateFee.amountPaid >= lateFee.totalCost
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white sticky top-0 z-50">
          <Link href="/" className="flex items-center justify-center">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">RentEasy</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/profile" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Profile
            </Link>
            <Link href="/fleet" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Fleet
            </Link>
          </nav>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-red-50 to-orange-100">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Late Fee Management
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    View and manage your outstanding late fees
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Balance Display Section */}
          <section className="w-full py-6 bg-white border-b">
            <div className="container px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium text-blue-900">Account Balance</span>
                    </div>
                    {balanceLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    ) : (
                      <div className="text-right">
                        <span className={`text-2xl font-bold ${userBalance < 0 ? 'text-red-600' : 'text-blue-900'}`}>
                          ${userBalance.toFixed(2)}
                        </span>
                        {userBalance < 0 && (
                          <div className="text-xs text-red-600 mt-1">
                            ⚠️ Negative balance
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={fetchUserBalance}
                    disabled={balanceLoading}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
                  >
                    {balanceLoading ? 'Refreshing...' : '🔄 Refresh Balance'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Late Fees Content */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="mx-auto max-w-4xl">
                <div className="flex items-center gap-2 mb-6">
                  <Link href="/profile" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Profile
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                  </div>
                ) : lateFees.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No late fees found</p>
                        <p className="text-sm text-gray-400">You're all caught up with your payments!</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {lateFees.map((lateFee) => (
                      <Card key={lateFee.id} className="border-l-4 border-l-red-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Late Fee #{lateFee.id}
                                </h3>
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                  {isFullyPaid(lateFee) ? 'PAID' : 'OUTSTANDING'}
                                </span>
                              </div>
                              
                              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Car className="h-4 w-4" />
                                  <span>Rental #{lateFee.rentalId}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(lateFee.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4" />
                                  <span>{lateFee.daysLate} days late</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span className="font-medium">${lateFee.totalCost.toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Payment Progress */}
                              <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                  <span>Amount Paid:</span>
                                  <span>${lateFee.amountPaid.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                  <span>Remaining:</span>
                                  <span className="font-medium text-red-600">
                                    ${getRemainingAmount(lateFee).toFixed(2)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(lateFee.amountPaid / lateFee.totalCost) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Payment Button */}
                            {!isFullyPaid(lateFee) && (
                              <div className="ml-4">
                                <Button
                                  onClick={() => handlePayment(lateFee)}
                                  disabled={paymentLoading === lateFee.id}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  {paymentLoading === lateFee.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  ) : (
                                    <>
                                      <DollarSign className="mr-2 h-4 w-4" />
                                      Pay ${getRemainingAmount(lateFee).toFixed(2)}
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Refresh Button */}
                <div className="mt-8 text-center">
                  <Button
                    onClick={fetchLateFees}
                    disabled={loading}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Late Fees
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  )
}
