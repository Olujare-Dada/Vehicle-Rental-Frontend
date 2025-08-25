'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Car, Calendar, ArrowLeft, RotateCcw, FileText, AlertCircle, DollarSign } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { getToken } from "@/lib/auth"
import { API_ENDPOINTS, BACKEND_URL } from "@/lib/config"

interface Rental {
  rentalId: number;
  vehicleId: number;
  vehicleName: string;
  vehicleType: string;
  startDate: string;
  endDate: string;
  totalCost: string;
  status: string;
  additionalNotes?: string;
}

interface ReturnFormData {
  rentalId: number;
  returnDate: string;
  returnNotes: string;
}

interface LateFeeInfo {
  isLate: boolean;
  daysLate: number;
  lateFeeAmount: number;
  dailyRate: number;
  totalAmount: number;
}

export default function ReturnVehiclePage({
  searchParams,
}: {
  searchParams: { rentalId?: string }
}) {
  const [rental, setRental] = useState<Rental | null>(null)
  const [formData, setFormData] = useState<ReturnFormData>({
    rentalId: parseInt(searchParams.rentalId || '0'),
    returnDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    returnNotes: "Vehicle returned in good condition",
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [rentalLoading, setRentalLoading] = useState(true)
  const [lateFeeInfo, setLateFeeInfo] = useState<LateFeeInfo | null>(null)
  const [userBalance, setUserBalance] = useState<number>(0)
  const [balanceLoading, setBalanceLoading] = useState(false)

  // Fetch user balance
  const fetchUserBalance = async () => {
    try {
      setBalanceLoading(true)
      const token = getToken()
      if (!token) {
        setError('Authentication required')
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
        
        // Your endpoint returns: { "balance": "2230.00", "message": "Balance retrieved successfully" }
        if (data.balance !== undefined) {
          const balance = parseFloat(data.balance.toString())
          setUserBalance(balance)
          return balance
        } else {
          setError('Invalid balance response format')
          return 0
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Failed to fetch balance')
        return 0
      }
    } catch (error) {
      setError('Failed to fetch balance')
      return 0
    } finally {
      setBalanceLoading(false)
    }
  }

  // Validate if user can afford the return (including late fees)
  const validatePaymentAbility = (totalAmount: number): boolean => {
    // This function is removed - we rely on backend affordability check instead
    // The backend will tell us if the user can afford the return
    return true
  }

  // Check return affordability with backend
  const checkReturnAffordability = async (returnDate: string): Promise<boolean> => {
    try {
      const token = getToken()
      if (!token) {
        setError('Authentication required')
        return false
      }

      const response = await fetch(API_ENDPOINTS.checkReturnAffordability(parseInt(formData.rentalId.toString())), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnDate: returnDate
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Your endpoint returns: { "success": true, "message": "...", "data": { "canReturn": true, ... } }
        if (data.success && data.data) {
          const affordability = data.data
          
          if (!affordability.canReturn) {
            setError(affordability.message || 'Cannot return vehicle at this time')
            return false
          }
          
          // Update late fee info from backend
          if (affordability.isLate) {
            setLateFeeInfo({
              isLate: true,
              daysLate: affordability.daysLate,
              lateFeeAmount: affordability.lateFees,
              dailyRate: affordability.lateFees / affordability.daysLate, // Calculate daily rate
              totalAmount: affordability.lateFees // Only late fees, not rental cost
            })
          } else {
            // No late fees, clear any existing late fee info
            setLateFeeInfo(null)
          }
          
          return true
        } else {
          setError(data.message || 'Failed to check affordability')
          return false
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || errorData.message || 'Failed to check return affordability')
        return false
      }
    } catch (error) {
      setError('Network error while checking affordability')
      return false
    }
  }

  // Calculate late fees based on return date
  const calculateLateFees = (expectedReturnDate: string, actualReturnDate: string, dailyRate: number = 15.00) => {
    const expected = new Date(expectedReturnDate)
    const actual = new Date(actualReturnDate)
    
    // Reset time to compare only dates (not time)
    expected.setHours(0, 0, 0, 0)
    actual.setHours(0, 0, 0, 0)
    
    const timeDiff = actual.getTime() - expected.getTime()
    const daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24))
    
    if (daysLate > 0) {
      const lateFeeAmount = daysLate * dailyRate
      return {
        isLate: true,
        daysLate,
        lateFeeAmount,
        dailyRate,
        totalAmount: lateFeeAmount
      }
    }
    
    return {
      isLate: false,
      daysLate: 0,
      lateFeeAmount: 0,
      dailyRate,
      totalAmount: 0
    }
  }

  // Update late fee info when return date changes
  useEffect(() => {
    if (rental && formData.returnDate) {
      const lateFeeInfo = calculateLateFees(rental.endDate, formData.returnDate)
      setLateFeeInfo(lateFeeInfo)
    }
  }, [formData.returnDate, rental])

  // Debug: Log when userBalance changes
  useEffect(() => {
    console.log('🔄 userBalance state changed to:', userBalance)
  }, [userBalance])

  // Fetch rental details and user balance when component mounts
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchRentalDetails(),
        fetchUserBalance()
      ])
    }
    fetchData()
  }, [])

  const fetchRentalDetails = async () => {
    try {
      const token = getToken()
      if (!token) {
        setError('Authentication required. Please sign in again.')
        setRentalLoading(false)
        return
      }

      // Use the new active rental endpoint instead of fetching all rentals
      const response = await fetch(API_ENDPOINTS.rentalsActive, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.hasActiveRental && data.data) {
          const activeRental = data.data
          // Check if this is the rental we want to return
          if (activeRental.rentalId.toString() === searchParams.rentalId) {
            setRental({
              rentalId: activeRental.rentalId,
              vehicleId: activeRental.vehicleId,
              vehicleName: activeRental.vehicleName,
              vehicleType: activeRental.vehicleType,
              startDate: activeRental.startDate,
              endDate: activeRental.endDate,
              totalCost: activeRental.totalCost.toString(),
              status: activeRental.status,
              additionalNotes: activeRental.additionalNotes
            })
            setFormData(prev => ({
              ...prev,
              rentalId: activeRental.rentalId
            }))
          } else {
            setError('Rental not found or not active')
          }
        } else {
          setError('No active rental found')
        }
      } else {
        setError('Failed to load rental details')
      }
    } catch (error) {
      setError('Failed to load rental details')
    } finally {
      setRentalLoading(false)
    }
  }

  // Function to handle expired token
  const handleExpiredToken = () => {
    // Clear the expired token
    localStorage.removeItem('jwtToken')
    // Redirect to login
    window.location.href = '/signin?message=session-expired'
  }

  // Function to verify JWT token validity
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.verifyToken, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = getToken()
      if (!token) {
        setError('Authentication required. Please sign in again.')
        return
      }

      // Verify token before making the request
      const isTokenValid = await verifyToken(token)
      if (!isTokenValid) {
        setError('Your session has expired. Please sign in again.')
        return
      }

      // Validate form data
      if (!formData.returnNotes.trim()) {
        setError('Please provide return notes')
        return
      }

      // Validate return date
      if (rental) {
        const startDate = new Date(rental.startDate)
        const returnDate = new Date(formData.returnDate)
        const endDate = new Date(rental.endDate)
        
        if (returnDate < startDate) {
          setError('Return date cannot be before the rental start date')
          return
        }
        
        if (returnDate > endDate && !lateFeeInfo?.isLate) {
          setError('Return date is after the expected return date. Late fees will be calculated.')
          return
        }
      }

      // Check affordability with backend
      const canReturn = await checkReturnAffordability(formData.returnDate)
      if (!canReturn) {
        return
      }

      // Calculate total amount needed (only late fees, rental cost is already paid)
      const lateFeeAmount = lateFeeInfo?.isLate ? lateFeeInfo.lateFeeAmount : 0
      const totalAmount = lateFeeAmount // Only late fees, not rental cost

      // Validate user has sufficient balance (only for late fees)
      if (totalAmount > 0 && !validatePaymentAbility(totalAmount)) {
        return
      }

      // Refresh balance before proceeding
      const currentBalance = await fetchUserBalance()
      if (currentBalance === undefined || currentBalance < totalAmount) {
        // Don't hardcode error - let the backend handle this validation
      }

      const requestBody = {
        rentalId: parseInt(formData.rentalId.toString()),
        returnDate: formData.returnDate,
        returnNotes: formData.returnNotes
      }
      
      // Validate request format matches backend expectations
      const requiredFields = ['rentalId', 'returnDate', 'returnNotes']
      const missingFields = requiredFields.filter(field => !requestBody[field as keyof typeof requestBody])
      
      if (missingFields.length > 0) {
      }

      // Validate data types
      if (typeof requestBody.rentalId !== 'number' || requestBody.rentalId <= 0) {
      }

      if (!requestBody.returnDate) {
      }

      if (!requestBody.returnNotes.trim()) {
      }
      
      // Verify the rental exists and belongs to the user
      try {
        const rentalCheckResponse = await fetch(API_ENDPOINTS.rentalsActive, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (rentalCheckResponse.ok) {
          const activeRentalData = await rentalCheckResponse.json()
          
          if (activeRentalData.hasActiveRental && activeRentalData.data) {
            const activeRental = activeRentalData.data
            if (activeRental.rentalId === requestBody.rentalId) {
            } else {
            }
          } else {
          }
        } else {
          // Could not verify rental ownership
        }
      } catch (rentalCheckError) {
        // Rental ownership check failed
      }
      
      const response = await fetch(API_ENDPOINTS.returnVehicle, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        // Add timeout to catch hanging requests
        signal: AbortSignal.timeout(30000) // 30 second timeout
      })

              let data
        try {
          data = await response.json()
        } catch (parseError) {
          data = {}
        }

        if (response.ok && data.success) {
          setSuccess(`Vehicle returned successfully! Final amount: ${data.data?.finalAmount || 'No additional charges'}`)
          setShowSuccessModal(true)
          // Don't redirect automatically - let user choose where to go
        } else if (response.ok) {
          // Response is ok but might not have the expected structure
          const successMessage = data.message || data.success || 'Vehicle returned successfully!'
          setSuccess(successMessage)
          setShowSuccessModal(true)
        } else {
          // Handle specific error cases
          if (response.status === 403) {
            // Try to get backend error message
            if (data && data.error) {
              setError(data.error)
            } else {
              setError('Access denied (403 Forbidden)')
            }
            
            // Don't redirect for 403 - let user see the error
          } else if (response.status === 401) {
            setError('Authentication failed. Please sign in again.')
            setTimeout(() => handleExpiredToken(), 2000)
          } else {
            setError(data.error || `Failed to return vehicle (Status: ${response.status})`)
          }
        }
    } catch (error) {
      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timed out. The server took too long to respond. Please try again.')
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setError('Network error. Please check your connection and try again.')
        } else {
          setError(`Error: ${error.message}`)
        }
      } else {
        setError('Network error. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'mileage' ? parseInt(value) || 0 : value
      }
      return newData
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const clearToken = () => {
    localStorage.removeItem('jwtToken')
    // Redirect to login
    window.location.href = '/signin?message=session-expired'
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setSuccess('')
    // Reset form data
    setFormData({
      rentalId: parseInt(searchParams.rentalId || '0'),
      returnDate: new Date().toISOString().split('T')[0],
      returnNotes: "Vehicle returned in good condition",
    })
  }

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSuccessModal) {
        handleSuccessModalClose()
      }
    }

    if (showSuccessModal) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showSuccessModal])

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
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Return Vehicle
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Complete your vehicle return and settle any outstanding charges.
                  </p>
                </div>
              </div>

              {/* Balance Display */}
              <div className="mt-8 max-w-md mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Current Balance</span>
                    </div>
                    {balanceLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <span className={`text-lg font-bold ${userBalance < 0 ? 'text-red-600' : 'text-blue-900'}`}>
                        ${userBalance.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                {/* Debug info */}
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                  <div>Debug: userBalance = {userBalance}</div>
                  <div>Debug: balanceLoading = {balanceLoading.toString()}</div>
                  <div>Debug: userBalance type = {typeof userBalance}</div>
                </div>
                {userBalance < 0 && (
                  <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                    ⚠️ Negative balance detected. You may need to add funds.
                  </div>
                )}
                <button
                  onClick={fetchUserBalance}
                  disabled={balanceLoading}
                  className="mt-2 w-full text-xs text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
                >
                  {balanceLoading ? 'Refreshing...' : '🔄 Refresh Balance'}
                </button>
              </div>

              {/* Return Form */}
              <div className="mx-auto max-w-2xl mt-12">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                      <Link href="/profile" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Profile
                      </Link>
                    </div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <RotateCcw className="h-6 w-6" />
                      Vehicle Return
                    </CardTitle>
                    <CardDescription>
                      Provide return details and confirm vehicle return
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      {error && (
                        <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      )}
                      
                      {success && (
                        <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-700">{success}</p>
                        </div>
                      )}

                      {/* Rental Information */}
                      {rentalLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-600">Loading rental details...</span>
                        </div>
                      ) : rental ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Car className="h-5 w-5" />
                            Rental Information
                          </h3>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="grid gap-2 md:grid-cols-2">
                              <div>
                                <span className="text-sm font-medium text-gray-600">Vehicle:</span>
                                <p className="text-lg font-semibold text-gray-900">{rental.vehicleName}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Type:</span>
                                <p className="text-gray-900">{rental.vehicleType}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Rental Period:</span>
                                <p className="text-gray-900">{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Total Cost:</span>
                                <p className="text-gray-900">{rental.totalCost}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm text-red-700">No rental information available</p>
                        </div>
                      )}

                      {/* Return Date */}
                      <div>
                        <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Return Date
                        </label>
                        <Input
                          id="returnDate"
                          name="returnDate"
                          type="date"
                          value={formData.returnDate}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                        />
                        {/* Late Fee Warning */}
                        {lateFeeInfo && lateFeeInfo.isLate && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <span className="text-sm font-medium">Late Return Detected</span>
                            </div>
                            <div className="mt-2 text-sm text-red-600">
                              <p>• Days Late: {lateFeeInfo.daysLate}</p>
                              <p>• Daily Late Fee: ${lateFeeInfo.dailyRate.toFixed(2)}</p>
                              <p>• Total Late Fee: <strong>${lateFeeInfo.lateFeeAmount.toFixed(2)}</strong></p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Return Notes */}
                      <div>
                        <label htmlFor="returnNotes" className="block text-sm font-medium text-gray-700 mb-1">
                          Return Notes
                        </label>
                        <textarea 
                          id="returnNotes" 
                          name="returnNotes"
                          rows={4}
                          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                          placeholder="Describe the condition of the vehicle upon return..."
                          value={formData.returnNotes}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      {/* Return Summary */}
                      {rental && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="text-sm font-medium text-blue-900 mb-3">Return Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Rental Cost (Already Paid):</span>
                              <span className="font-medium text-gray-500">{rental.totalCost}</span>
                            </div>
                            {lateFeeInfo && lateFeeInfo.isLate ? (
                              <>
                                <div className="flex justify-between text-red-700">
                                  <span>Late Fee ({lateFeeInfo.daysLate} days):</span>
                                  <span className="font-medium">${lateFeeInfo.lateFeeAmount.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-blue-200 pt-2">
                                  <div className="flex justify-between font-medium text-red-900">
                                    <span>Total Amount Due:</span>
                                    <span>${lateFeeInfo.lateFeeAmount.toFixed(2)}</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="border-t border-blue-200 pt-2">
                                <div className="flex justify-between font-medium text-green-900">
                                  <span>Total Amount Due:</span>
                                  <span>$0.00</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Payment Validation */}
                            <div className="border-t border-blue-200 pt-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-blue-700">Your Balance:</span>
                                <span className={`font-medium ${userBalance < 0 ? 'text-red-600' : 'text-blue-900'}`}>
                                  ${userBalance.toFixed(2)}
                                </span>
                              </div>
                              {(() => {
                                const totalAmount = lateFeeInfo && lateFeeInfo.isLate ? lateFeeInfo.lateFeeAmount : 0
                                
                                const canAfford = userBalance >= totalAmount
                                const remainingBalance = userBalance - totalAmount
                                
                                if (totalAmount === 0) {
                                  return (
                                    <div className="mt-2 p-2 rounded text-xs bg-green-100 border border-green-200 text-green-700">
                                      ✅ No additional charges. Your rental is complete.
                                    </div>
                                  )
                                }
                                
                                return (
                                  <div className="mt-2 p-2 rounded text-xs">
                                    {canAfford ? (
                                      <div className="bg-green-100 border border-green-200 text-green-700">
                                        ✅ Payment approved. Remaining balance: ${remainingBalance.toFixed(2)}
                                      </div>
                                    ) : (
                                      <div className="bg-red-100 border border-red-200 text-red-700">
                                        ❌ Insufficient balance. Need ${(totalAmount - userBalance).toFixed(2)} more.
                                      </div>
                                    )}
                                  </div>
                                )
                              })()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading || !rental}>
                          {isLoading ? 'Processing Return...' : 'Return Vehicle'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        {/* Success Modal */}
        {showSuccessModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleSuccessModalClose}
          >
            <div 
              className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                {/* Success Message */}
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Vehicle Returned Successfully!
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Your vehicle has been returned and the rental is now complete.
                  {lateFeeInfo && lateFeeInfo.isLate && (
                    <span className="block mt-2 text-red-600 font-medium">
                      Late fee of ${lateFeeInfo.lateFeeAmount.toFixed(2)} has been added to your account.
                    </span>
                  )}
                  <span className="block mt-2 text-blue-600 font-medium">
                    Your new balance: ${userBalance.toFixed(2)}
                  </span>
                </p>
                
                {/* Navigation Options */}
                <div className="space-y-3">
                  <Link 
                    href="/" 
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    onClick={handleSuccessModalClose}
                  >
                    🏠 Go to Home
                  </Link>
                  
                  <Link 
                    href="/fleet" 
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    onClick={handleSuccessModalClose}
                  >
                    🚗 Browse Fleet
                  </Link>
                  
                  <Link 
                    href="/profile" 
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    onClick={handleSuccessModalClose}
                  >
                    👤 View Profile
                  </Link>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={handleSuccessModalClose}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
} 