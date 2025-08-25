'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, User, Calendar, ArrowLeft, RotateCcw, AlertTriangle, DollarSign } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { getToken, getCurrentUser } from "@/lib/auth"
import { API_ENDPOINTS } from "@/lib/config"

interface UserProfile {
  profileId: number;
  username: string;
  bio: string;
  city: string;
  country: string;
  headline: string;
  picture: string;
}

interface UserInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  license: string;
  licenseState: string;
  licenseExpiry: string;
  dateOfBirth: string;
  createdOn: string;
}

interface RentalHistory {
  rentalId: number;
  vehicleId: number;
  vehicleName: string;
  vehicleImageUrl: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  totalCost: number;
  status: string;
  additionalNotes?: string;
  rentalCreatedOn: string;
  lateFees?: number;
  isLate?: boolean;
}

interface ActiveRentalResponse {
  hasActiveRental: boolean;
  message: string;
  data: {
    rentalId: number;
    vehicleId: number;
    vehicleName: string;
    vehicleType: string;
    vehicleImageUrl: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleColor: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    status: string;
    additionalNotes: string;
    rentalCreatedOn: string;
    isOverdue: boolean;
    hasOutstandingLateFees: boolean;
    totalOutstandingLateFees: number;
    daysLate?: number;
    potentialLateFees?: number;
  } | null;
}

interface EnhancedProfileResponse {
  profile: UserProfile;
  user: UserInfo;
  rentalHistory: RentalHistory[];
  currentBalance: number;
  totalRentals: number;
  activeRentals: number;
}

export default function ProfilePage() {
  const [enhancedProfile, setEnhancedProfile] = useState<EnhancedProfileResponse | null>(null)
  const [activeRental, setActiveRental] = useState<ActiveRentalResponse | null>(null)
  const [rentalHistory, setRentalHistory] = useState<RentalHistory[]>([])
  const [rentalHistoryPage, setRentalHistoryPage] = useState(0)
  const [rentalHistoryLoading, setRentalHistoryLoading] = useState(false)
  const [hasMoreRentals, setHasMoreRentals] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEnhancedProfile()
    fetchActiveRental()
  }, [])

  const fetchEnhancedProfile = async () => {
    try {
      setLoading(true)
      setError('')
      
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        setError('User not found')
        return
      }

      const token = getToken()
      
      const response = await fetch(API_ENDPOINTS.profileEnhanced(currentUser.username), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEnhancedProfile(data)
        // Initialize rental history with first page
        setRentalHistory(data.rentalHistory || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || 'Failed to fetch profile data')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveRental = async () => {
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(API_ENDPOINTS.rentalsActive, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setActiveRental(data)
      }
    } catch (error) {
      // Active rental error
    }
  }

  const loadMoreRentalHistory = async () => {
    try {
      setRentalHistoryLoading(true)
      const token = getToken()
      if (!token) return

      const nextPage = rentalHistoryPage + 1
      const response = await fetch(`${API_ENDPOINTS.rentalsUser}?page=${nextPage}&size=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const newRentals = data.rentals || data || []
        
        if (newRentals.length > 0) {
          setRentalHistory(prev => [...prev, ...newRentals])
          setRentalHistoryPage(nextPage)
        } else {
          setHasMoreRentals(false)
        }
      } else {
        // Failed to load more rental history
      }
    } catch (error) {
      // Error loading more rental history
    } finally {
      setRentalHistoryLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRentalStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'current':
      case 'rented':
        return 'bg-green-600'
      case 'completed':
      case 'finished':
      case 'returned':
        return 'bg-blue-600'
      case 'cancelled':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const handleReturnVehicle = (rentalId: number) => {
    window.location.href = `/return-vehicle?rentalId=${rentalId}`
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white sticky top-0 z-50">
            <Link href="/" className="flex items-center justify-center">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RentEasy</span>
            </Link>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white sticky top-0 z-50">
            <Link href="/" className="flex items-center justify-center">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RentEasy</span>
            </Link>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={fetchEnhancedProfile} variant="outline">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!enhancedProfile) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white sticky top-0 z-50">
            <Link href="/" className="flex items-center justify-center">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RentEasy</span>
            </Link>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">No profile data available</p>
                  <Button onClick={fetchEnhancedProfile} variant="outline">
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
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
            <Link href="/profile" className="text-sm font-medium text-blue-600">
              Profile
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
                    Your Profile
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    View and manage your profile information
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Balance Display Section */}
          <section className="w-full py-6 bg-white border-b">
            <div className="container px-4 md:px-6">
              <div className="max-w-2xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium text-blue-900">Account Balance</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${enhancedProfile.currentBalance < 0 ? 'text-red-600' : 'text-blue-900'}`}>
                        ${enhancedProfile.currentBalance.toFixed(2)}
                      </span>
                      {enhancedProfile.currentBalance < 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          ⚠️ Negative balance
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    Total Rentals: {enhancedProfile.totalRentals} | Active Rentals: {enhancedProfile.activeRentals}
                  </div>
                  <button
                    onClick={() => {
                      fetchEnhancedProfile()
                      fetchActiveRental()
                    }}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    🔄 Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Content */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="mx-auto max-w-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Link>
                </div>

                {/* Profile Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <User className="h-6 w-6" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Your personal and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Profile Picture */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                          {enhancedProfile.profile.picture ? (
                            <img
                              src={enhancedProfile.profile.picture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{enhancedProfile.user.firstName} {enhancedProfile.user.lastName}</h3>
                          <p className="text-gray-600">@{enhancedProfile.user.username}</p>
                          {enhancedProfile.profile.headline && (
                            <p className="text-sm text-blue-600 mt-1">{enhancedProfile.profile.headline}</p>
                          )}
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Bio</label>
                          <p className="text-gray-900 mt-1">{enhancedProfile.profile.bio || 'No bio provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Location</label>
                          <p className="text-gray-900 mt-1">
                            {enhancedProfile.profile.city && enhancedProfile.profile.country 
                              ? `${enhancedProfile.profile.city}, ${enhancedProfile.profile.country}`
                              : 'Location not specified'
                            }
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <p className="text-gray-900 mt-1">{enhancedProfile.user.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <p className="text-gray-900 mt-1">{enhancedProfile.user.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Address</label>
                          <p className="text-gray-900 mt-1">{enhancedProfile.user.address}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">License</label>
                          <p className="text-gray-900 mt-1">
                            {enhancedProfile.user.license} ({enhancedProfile.user.licenseState})
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rental Information */}
                <Card className="mt-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <Calendar className="h-6 w-6" />
                          My Rentals
                        </CardTitle>
                        <CardDescription>
                          View your current and past vehicle rentals
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => {
                          fetchEnhancedProfile()
                          fetchActiveRental()
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Active Rental Section */}
                    {activeRental && activeRental.hasActiveRental && activeRental.data && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                          <Car className="h-5 w-5" />
                          Current Active Rental
                        </h3>
                        <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                          <div className="flex items-start gap-4">
                            {/* Car Image */}
                            <div className="flex-shrink-0">
                              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                                {activeRental.data.vehicleImageUrl ? (
                                  <img 
                                    src={activeRental.data.vehicleImageUrl} 
                                    alt={activeRental.data.vehicleName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                    <Car className="h-8 w-8 text-gray-500" />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{activeRental.data.vehicleName}</h3>
                                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                                  ACTIVE
                                </span>
                                {activeRental.data.isOverdue && (
                                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                                    OVERDUE
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Car className="h-4 w-4" />
                                  <span>{activeRental.data.vehicleMake} {activeRental.data.vehicleModel} ({activeRental.data.vehicleYear})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(activeRental.data.startDate)} - {formatDate(activeRental.data.endDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span className="font-medium">${activeRental.data.totalCost.toFixed(2)}</span>
                                </div>
                                {activeRental.data.vehicleColor && (
                                  <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: activeRental.data.vehicleColor.toLowerCase() }}></span>
                                    <span>{activeRental.data.vehicleColor}</span>
                                  </div>
                                )}
                              </div>

                              {/* Overdue Warning */}
                              {activeRental.data.isOverdue && (
                                <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                                  <div className="flex items-center gap-2 text-red-700">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-sm font-medium">Rental is Overdue</span>
                                  </div>
                                  <div className="mt-2 text-sm text-red-600">
                                    <p>• Days Late: <strong>{activeRental.data.daysLate}</strong></p>
                                    <p>• Potential Late Fees: <strong>${activeRental.data.potentialLateFees?.toFixed(2)}</strong></p>
                                    {activeRental.data.hasOutstandingLateFees && (
                                      <p>• Outstanding Late Fees: <strong>${activeRental.data.totalOutstandingLateFees.toFixed(2)}</strong></p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {activeRental.data.additionalNotes && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-700">
                                    <span className="font-medium">Notes:</span> {activeRental.data.additionalNotes}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {/* Return Vehicle Button */}
                            <div className="ml-4 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReturnVehicle(activeRental.data!.rentalId)}
                                className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700"
                              >
                                <RotateCcw className="mr-1 h-3 w-3" />
                                Return Vehicle
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* No Active Rental Message */}
                    {activeRental && !activeRental.hasActiveRental && (
                      <div className="mb-8 text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No active rental at the moment</p>
                        <Link href="/fleet">
                          <Button>
                            <Car className="mr-2 h-4 w-4" />
                            Browse Vehicles
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Rental History Section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Rental History
                      </h3>
                      
                      {rentalHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No rental history found</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {rentalHistory.map((rental) => (
                            <div key={rental.rentalId} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                              <div className="flex items-start gap-4">
                                {/* Car Image */}
                                <div className="flex-shrink-0">
                                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                                    {rental.vehicleImageUrl ? (
                                      <img 
                                        src={rental.vehicleImageUrl} 
                                        alt={rental.vehicleName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                        <Car className="h-8 w-8 text-gray-500" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{rental.vehicleName}</h3>
                                    <span className={`${getRentalStatusColor(rental.status)} text-white px-2 py-1 rounded text-xs font-medium`}>
                                      {rental.status}
                                    </span>
                                  </div>
                                  
                                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Car className="h-4 w-4" />
                                      <span>{rental.vehicleMake} {rental.vehicleModel} ({rental.vehicleYear})</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</span>
                                    </div>
                                    {rental.actualReturnDate && (
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Returned: {formatDate(rental.actualReturnDate)}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-4 w-4" />
                                      <span className="font-medium">${rental.totalCost.toFixed(2)}</span>
                                    </div>
                                  </div>

                                  {/* Late Fee Information */}
                                  {rental.isLate && rental.lateFees && rental.lateFees > 0 && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                      <div className="flex items-center gap-2 text-red-700">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span className="text-sm font-medium">Late Return</span>
                                      </div>
                                      <div className="mt-2 text-sm text-red-600">
                                        <p>• Late Fees: <strong>${rental.lateFees.toFixed(2)}</strong></p>
                                      </div>
                                    </div>
                                  )}

                                  {rental.additionalNotes && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-700">
                                        <span className="font-medium">Notes:</span> {rental.additionalNotes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Load More Button */}
                          {hasMoreRentals && (
                            <div className="text-center pt-4">
                              <Button
                                onClick={loadMoreRentalHistory}
                                disabled={rentalHistoryLoading}
                                variant="outline"
                                className="flex items-center gap-2"
                              >
                                {rentalHistoryLoading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    Loading...
                                  </>
                                ) : (
                                  <>
                                    <Calendar className="h-4 w-4" />
                                    Load More History
                                  </>
                                )}
                              </Button>
                            </div>
                          )}

                          {/* No More Rentals Message */}
                          {!hasMoreRentals && rentalHistory.length > 0 && (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              No more rental history to load
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Balance Management */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      Balance Management
                    </CardTitle>
                    <CardDescription>
                      Manage your account balance for vehicle rentals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-blue-900">Current Balance</h4>
                            <p className="text-2xl font-bold text-blue-600">${enhancedProfile.currentBalance.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-blue-700">Active Rentals</p>
                            <p className="text-xl font-semibold text-blue-600">{enhancedProfile.activeRentals}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <Link href="/balance">
                          <Button className="w-full" variant="outline">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Add Funds
                          </Button>
                        </Link>
                        <Link href="/late-fees">
                          <Button className="w-full" variant="outline">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            View Late Fees
                          </Button>
                        </Link>
                      </div>
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
                  Fleet
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                  Profile
                </Link>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  About Us
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