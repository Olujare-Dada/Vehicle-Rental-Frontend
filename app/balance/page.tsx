'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Car, ArrowLeft, Plus, Minus, DollarSign, RefreshCw } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { getToken } from "@/lib/auth"
import { API_ENDPOINTS } from "@/lib/config"

interface BalanceResponse {
  balance: string;
  message: string;
}

interface AddBalanceResponse {
  message: string;
  newBalance: string;
  addedAmount: string;
}

interface DebitBalanceResponse {
  message: string;
  newBalance: string;
  debitedAmount: string;
}

export default function BalancePage() {
  const [currentBalance, setCurrentBalance] = useState<string>('0.00')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Add balance form
  const [addAmount, setAddAmount] = useState('')
  const [addDescription, setAddDescription] = useState('')
  const [addingBalance, setAddingBalance] = useState(false)
  
  // Debit balance form
  const [debitAmount, setDebitAmount] = useState('')
  const [debitDescription, setDebitDescription] = useState('')
  const [debitingBalance, setDebitingBalance] = useState(false)

  // Fetch current balance on component mount
  useEffect(() => {
    fetchCurrentBalance()
  }, [])

  const fetchCurrentBalance = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = getToken()
      if (!token) {
        setError('Authentication required. Please sign in again.')
        return
      }

      const response = await fetch(API_ENDPOINTS.balance, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data: BalanceResponse = await response.json()
        setCurrentBalance(data.balance)
        setSuccess(data.message)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || 'Failed to fetch balance')
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingBalance(true)
    setError('')
    setSuccess('')

    try {
      const token = getToken()
      if (!token) {
        setError('Authentication required. Please sign in again.')
        return
      }

      const amount = parseFloat(addAmount)
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount greater than 0')
        return
      }

      const response = await fetch(API_ENDPOINTS.balanceAdd, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount,
          description: addDescription || 'Balance addition'
        }),
      })

      const data: AddBalanceResponse = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setCurrentBalance(data.newBalance)
        setAddAmount('')
        setAddDescription('')
      } else {
        setError(data.message || 'Failed to add balance')
      }
    } catch (error) {
      console.error('Error adding balance:', error)
      setError('Network error. Please try again.')
    } finally {
      setAddingBalance(false)
    }
  }

  const handleDebitBalance = async (e: React.FormEvent) => {
    e.preventDefault()
    setDebitingBalance(true)
    setError('')
    setSuccess('')

    try {
      const token = getToken()
      if (!token) {
        setError('Authentication required. Please sign in again.')
        return
      }

      const amount = parseFloat(debitAmount)
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount greater than 0')
        return
      }

      const currentBalanceNum = parseFloat(currentBalance)
      if (amount > currentBalanceNum) {
        setError('Insufficient balance. You cannot debit more than your current balance.')
        return
      }

      const response = await fetch(API_ENDPOINTS.balanceDebit, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount,
          description: debitDescription || 'Balance withdrawal'
        }),
      })

      const data: DebitBalanceResponse = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setCurrentBalance(data.newBalance)
        setDebitAmount('')
        setDebitDescription('')
      } else {
        setError(data.message || 'Failed to debit balance')
      }
    } catch (error) {
      console.error('Error debiting balance:', error)
      setError('Network error. Please try again.')
    } finally {
      setDebitingBalance(false)
    }
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
            <Link href="/fleet" className="text-sm font-medium hover:text-blue-600 transition-colors">
              View Fleet
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Home
            </Link>
          </nav>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Account Balance
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Manage your account balance for vehicle rentals
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Balance Management */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="mx-auto max-w-4xl">
                {/* Back to Home */}
                <div className="flex items-center gap-2 mb-6">
                  <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Link>
                </div>

                {/* Current Balance Display */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      Current Balance
                    </CardTitle>
                    <CardDescription>
                      Your current account balance for vehicle rentals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading balance...</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-4">
                          ${currentBalance}
                        </div>
                        <Button 
                          onClick={fetchCurrentBalance} 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Refresh Balance
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Error and Success Messages */}
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

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Add Balance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Plus className="h-5 w-5 text-green-600" />
                        Add Money
                      </CardTitle>
                      <CardDescription>
                        Add funds to your account for vehicle rentals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddBalance} className="space-y-4">
                        <div>
                          <label htmlFor="addAmount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount ($)
                          </label>
                          <Input
                            id="addAmount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="1000.00"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="addDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                          </label>
                          <Input
                            id="addDescription"
                            type="text"
                            placeholder="Initial deposit"
                            value={addDescription}
                            onChange={(e) => setAddDescription(e.target.value)}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={addingBalance}
                        >
                          {addingBalance ? 'Adding...' : 'Add Money'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Debit Balance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Minus className="h-5 w-5 text-red-600" />
                        Withdraw Money
                      </CardTitle>
                      <CardDescription>
                        Withdraw funds from your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleDebitBalance} className="space-y-4">
                        <div>
                          <label htmlFor="debitAmount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount ($)
                          </label>
                          <Input
                            id="debitAmount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={currentBalance}
                            placeholder="500.00"
                            value={debitAmount}
                            onChange={(e) => setDebitAmount(e.target.value)}
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Maximum: ${currentBalance}
                          </p>
                        </div>
                        <div>
                          <label htmlFor="debitDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                          </label>
                          <Input
                            id="debitDescription"
                            type="text"
                            placeholder="Withdrawal for personal use"
                            value={debitDescription}
                            onChange={(e) => setDebitDescription(e.target.value)}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          variant="outline"
                          className="w-full" 
                          disabled={debitingBalance || parseFloat(currentBalance) <= 0}
                        >
                          {debitingBalance ? 'Withdrawing...' : 'Withdraw Money'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                    <CardDescription>
                      Common balance amounts for quick addition
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-4">
                      {[100, 250, 500, 1000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() => {
                            setAddAmount(amount.toString())
                            setAddDescription(`Quick deposit of $${amount}`)
                          }}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
          <div className="container grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <Car className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-lg font-bold">RentEasy</span>
              </div>
              <p className="text-sm text-gray-600">
                Your trusted partner for vehicle rentals. Safe, reliable, and affordable.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Quick Links</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link href="/fleet" className="text-gray-600 hover:text-blue-600">
                  View Fleet
                </Link>
                <Link href="/book-vehicle" className="text-gray-600 hover:text-blue-600">
                  Book Vehicle
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                  Profile
                </Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Support</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Help Center
                </Link>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Contact Us
                </Link>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Terms of Service
                </Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  (555) 123-4567
                </div>
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  info@renteasy.com
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  123 Main St, City, State
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
} 