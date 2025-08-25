'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Car, Truck, Users, Calendar, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { getToken } from "@/lib/auth"
import { API_ENDPOINTS } from "@/lib/config"

interface Vehicle {
  id?: number;
  vehicleId?: number;
  name?: string;
  make?: string;
  model?: string;
  year?: number;
  type?: string;
  category?: string;
  price?: string;
  rentalCostPerDay?: string;
  description?: string;
  features?: string[];
  image?: string;
  vehicleImageUrl?: string;
  icon?: string;
  available?: boolean;
  status?: string;
  vehicleRentalStatus?: string;
}

interface FleetResponse {
  content: Vehicle[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Icon mapping
const iconMap: { [key: string]: any } = {
  'Car': Car,
  'Users': Users,
  'Truck': Truck
}

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  })

  useEffect(() => {
    // Add a small delay to ensure token is available
    const timer = setTimeout(() => {
      fetchFleet()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [currentPage])

  const fetchFleet = async () => {
    try {
      setLoading(true)
      setError('')
      
      const token = getToken()

      
      if (!token) {
        setError('Authentication required. Please sign in again.')
        return
      }
      
      // Use the correct endpoint with pagination
      const url = `${API_ENDPOINTS.fleetAvailable}?page=${currentPage}&size=10`
      
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
      })
      
              if (response.ok) {
          const data = await response.json()
        
        // Handle your backend response format
        if (data.data && data.data.vehicles) {
          setVehicles(data.data.vehicles)
          setTotalPages(data.data.pagination.totalPages)
          setTotalElements(data.data.pagination.totalItems)
        } else if (data.content) {
          // Spring Boot pagination format
          setVehicles(data.content)
          setTotalPages(data.totalPages)
          setTotalElements(data.totalElements)
        } else {
          // Fallback to empty array
          setVehicles([])
          setTotalPages(0)
          setTotalElements(0)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.message || 'Failed to load fleet')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
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
                  Our Vehicle Fleet
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Choose from our wide selection of vehicles to suit your needs and budget
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            {/* Search and Filter */}
            <div className="mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter Vehicles
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-2">
                      Search Vehicles
                    </label>
                    <Input
                      id="searchTerm"
                      placeholder="Search by name, make, model, or type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <Input
                              type="number"
                              placeholder="0"
                              value={priceRange.min}
                              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                              className="h-10 pl-8"
                            />
                          </div>
                        </div>
                        <div className="text-gray-400">to</div>
                        <div className="flex-1">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <Input
                              type="number"
                              placeholder="1000"
                              value={priceRange.max}
                              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                              className="h-10 pl-8"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>💡 Quick ranges:</span>
                        <button
                          onClick={() => setPriceRange({min: '0', max: '50'})}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          Budget ($0-50)
                        </button>
                        <button
                          onClick={() => setPriceRange({min: '50', max: '100'})}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          Mid ($50-100)
                        </button>
                        <button
                          onClick={() => setPriceRange({min: '100', max: '200'})}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          Premium ($100+)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setPriceRange({min: '', max: ''})
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchFleet} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {/* Vehicle Status Summary */}
                <div className="mb-6 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Available: {vehicles.filter(v => v.status?.toLowerCase() === 'available').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Rented: {vehicles.filter(v => v.status?.toLowerCase() !== 'available').length}
                    </span>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {vehicles
                    .filter(vehicle => {
                      const vehicleName = vehicle.name || `${vehicle.make} ${vehicle.model}` || ''
                      const vehicleMake = vehicle.make || ''
                      const vehicleModel = vehicle.model || ''
                      const vehicleType = vehicle.type || vehicle.category || ''
                      const vehiclePrice = vehicle.price || vehicle.rentalCostPerDay || ''
                      
                      // Extract numeric price value (remove $ and /day)
                      const priceMatch = vehiclePrice.match(/\$?(\d+(?:\.\d+)?)/)
                      const priceValue = priceMatch ? parseFloat(priceMatch[1]) : 0
                      
                      // Apply search filter
                      if (searchTerm) {
                        const searchLower = searchTerm.toLowerCase()
                        const matchesSearch = 
                          vehicleName.toLowerCase().includes(searchLower) ||
                          vehicleMake.toLowerCase().includes(searchLower) ||
                          vehicleModel.toLowerCase().includes(searchLower) ||
                          vehicleType.toLowerCase().includes(searchLower)
                        
                        if (!matchesSearch) return false
                      }
                      
                      // Apply price range filter
                      if (priceRange.min && priceValue < parseFloat(priceRange.min)) return false
                      if (priceRange.max && priceValue > parseFloat(priceRange.max)) return false
                      
                      return true
                    })
                    .map((vehicle) => {
                      const vehicleId = vehicle.vehicleId || vehicle.id
                      const vehicleName = vehicle.name || `${vehicle.make} ${vehicle.model}`
                      const vehicleType = vehicle.type || vehicle.category
                      const vehiclePrice = vehicle.price || vehicle.rentalCostPerDay
                      const vehicleImage = vehicle.image || vehicle.vehicleImageUrl || "/placeholder.svg?height=300&width=400"
                      const vehicleIcon = vehicle.icon || 'car'
                      
                      const IconComponent = iconMap[vehicleIcon] || Car
                      
                      // Determine availability from status field
                      const isAvailable = vehicle.status?.toLowerCase() === 'available'
                      const statusText = vehicle.status || 'Unknown'
                      const statusColor = isAvailable ? 'bg-green-600' : 'bg-red-600'
                      
                      return (
                        <Card key={vehicleId} className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${!isAvailable ? 'opacity-75' : ''}`}>
                          <CardHeader>
                            <div className="relative overflow-hidden rounded-lg">
                              <Image
                                src={vehicleImage}
                                width={400}
                                height={300}
                                alt={vehicleName}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                  {vehicleType}
                                </span>
                                <span className={`${statusColor} text-white px-2 py-1 rounded text-xs font-medium`}>
                                  {statusText}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                              <IconComponent className="h-6 w-6 text-blue-600" />
                              <CardTitle className="text-xl">{vehicleName}</CardTitle>
                            </div>
                            <CardDescription className="text-base">
                              {vehicle.description || `${vehicle.make} ${vehicle.model} (${vehicle.year})`}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="text-2xl font-bold text-blue-600">{vehiclePrice}</div>
                              {vehicle.features && vehicle.features.length > 0 && (
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {vehicle.features.map((feature: string, index: number) => (
                                    <li key={index}>• {feature}</li>
                                  ))}
                                </ul>
                              )}
                              {isAvailable ? (
                                <Link href={`/book-vehicle?vehicleId=${vehicleId}&vehicleName=${encodeURIComponent(vehicleName)}&vehicleType=${encodeURIComponent(vehicleType || '')}`} className="block">
                                  <Button className="w-full group-hover:bg-blue-700 transition-colors">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Book Now
                                  </Button>
                                </Link>
                              ) : (
                                <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Currently Rented
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12">
                    <Button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 0}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({totalElements} vehicles)
                      </span>
                    </div>
                    
                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages - 1}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
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
                <Phone className="h-4 w-4" />
                (555) 123-4567
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@renteasy.com
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                123 Main St, City, State
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t pt-6 mt-8">
          <p className="text-xs text-center text-gray-600">
            © {new Date().getFullYear()} RentEasy. All rights reserved.
          </p>
        </div>
      </footer>
      </div>
    </ProtectedRoute>
  )
} 