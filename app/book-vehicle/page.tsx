'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Car, Calendar, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { getToken } from "@/lib/auth"
import { API_ENDPOINTS } from "@/lib/config"

export default function BookVehiclePage({
  searchParams,
}: {
  searchParams: { vehicleId?: string; vehicleName?: string; vehicleType?: string }
}) {
  const [formData, setFormData] = useState({
    vehicleId: searchParams.vehicleId || '',
    startDate: '',
    endDate: '',
    notes: ''
  })
  
  const [selectedVehicle, setSelectedVehicle] = useState({
    id: searchParams.vehicleId || '',
    name: searchParams.vehicleName || '',
    type: searchParams.vehicleType || '',
    price: 'Loading...'
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [vehicleLoading, setVehicleLoading] = useState(true)

  // Fetch vehicle details when component mounts
  useEffect(() => {
    if (searchParams.vehicleId) {
      fetchVehicleDetails()
    } else {
      setVehicleLoading(false)
    }
  }, [searchParams.vehicleId])

  const fetchVehicleDetails = async () => {
    try {
      const token = getToken()
      if (!token) {
        setError('Authentication required. Please sign in again.')
        setVehicleLoading(false)
        return
      }

      // Use the correct fleet endpoint with a large page size to get all vehicles
      const response = await fetch(`${API_ENDPOINTS.fleetAvailable}?page=0&size=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        let vehicles = []
        
        if (data.data && data.data.vehicles) {
          vehicles = data.data.vehicles
        } else if (data.content) {
          vehicles = data.content
        }
        
        // Find the specific vehicle by ID
        const vehicle = vehicles.find((v: any) => {
          // Handle both id and vehicleId fields from backend
          const vId = v.id || v.vehicleId
          return vId && vId.toString() === searchParams.vehicleId
        })
        
        if (vehicle) {
          setSelectedVehicle({
            id: (vehicle.id || vehicle.vehicleId).toString(),
            name: vehicle.name || vehicle.vehicleName || `${vehicle.make} ${vehicle.model}`,
            type: vehicle.type || vehicle.category || 'Unknown',
            price: vehicle.price || vehicle.rentalCostPerDay || 'Price not available'
          })
        } else {
          setError('Vehicle not found')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError('Failed to load vehicle details')
      }
    } catch (error) {
      setError('Failed to load vehicle details')
    } finally {
      setVehicleLoading(false)
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

      const requestBody = {
        vehicleId: parseInt(formData.vehicleId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        additionalNotes: formData.notes
      }
      

      
      const response = await fetch(API_ENDPOINTS.rent, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        // Try to get the response as text
        const responseText = await response.text()
        setError(`Server error: ${responseText}`)
        return
      }

      if (response.ok) {
        setSuccess(`Vehicle rented successfully! Rental ID: ${data.rentalId}, Total Cost: $${data.totalCost}`)
        // Redirect to fleet page after a delay
        setTimeout(() => {
          window.location.href = '/fleet'
        }, 3000)
      } else {
        // Use ONLY the backend error message - no hardcoding
        if (data.error) {
          setError(data.error)
        } else {
          setError('Rental failed - please try again')
        }
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
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
                    Book Your Vehicle
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Complete your rental booking
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Booking Form */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="mx-auto max-w-2xl">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                      <Link href="/fleet" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Fleet
                      </Link>
                    </div>
                    <CardTitle className="text-2xl">Vehicle Booking</CardTitle>
                    <CardDescription>
                      Complete your rental details
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

                      {/* Selected Vehicle Display */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Car className="h-5 w-5" />
                          Selected Vehicle
                        </h3>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          {vehicleLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              <span className="ml-2 text-gray-600">Loading vehicle details...</span>
                            </div>
                          ) : (
                            <div className="grid gap-2 md:grid-cols-2">
                              <div>
                                <span className="text-sm font-medium text-gray-600">Vehicle:</span>
                                <p className="text-lg font-semibold text-gray-900">{selectedVehicle.name}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Type:</span>
                                <p className="text-gray-900">{selectedVehicle.type}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Price:</span>
                                <p className="text-lg font-bold text-blue-600">{selectedVehicle.price}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">ID:</span>
                                <p className="text-gray-900">{selectedVehicle.id}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rental Dates */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Rental Dates
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <Input 
                              id="startDate" 
                              name="startDate"
                              type="date" 
                              value={formData.startDate}
                              onChange={handleInputChange}
                              required 
                            />
                          </div>
                          <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <Input 
                              id="endDate" 
                              name="endDate"
                              type="date" 
                              value={formData.endDate}
                              onChange={handleInputChange}
                              required 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Special Requests
                        </h3>
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Notes
                          </label>
                          <textarea 
                            id="notes" 
                            name="notes"
                            rows={4}
                            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            placeholder="Any special requests or additional information..."
                            value={formData.notes}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                          {isLoading ? 'Processing...' : 'Book Vehicle'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer
          id="contact"
          className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50"
        >
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
                <Link href="/book-vehicle" className="text-gray-600 hover:text-blue-600">
                  Book Now
                </Link>
                <Link href="/fleet" className="text-gray-600 hover:text-blue-600">
                  Fleet
                </Link>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Locations
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
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Privacy Policy
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