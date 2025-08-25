'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Car, User, Mail, Phone, MapPin, ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    license: '',
    licenseState: '',
    licenseExpiry: '',
    dateOfBirth: '',
    currentBalance: 0.00
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(data.message || 'Account created successfully! Please check your email for verification.')
        // Redirect to email verification page after a delay
        setTimeout(() => {
          router.push('/email-verification?status=pending')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Signup failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  return (
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
                  Create Your Account
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Join RentEasy and start booking vehicles today
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Signup Form */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </div>
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription>
                    Fill in your information to create your RentEasy account
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
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <Input 
                            id="firstName" 
                            name="firstName"
                            type="text" 
                            placeholder="John" 
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <Input 
                            id="lastName" 
                            name="lastName"
                            type="text" 
                            placeholder="Doe" 
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <Input 
                            id="username" 
                            name="username"
                            type="text" 
                            placeholder="johndoe" 
                            value={formData.username}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <Input 
                            id="email" 
                            name="email"
                            type="email" 
                            placeholder="john@example.com" 
                            value={formData.email}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <Input 
                            id="phone" 
                            name="phone"
                            type="tel" 
                            placeholder="(555) 123-4567" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Address Information
                      </h3>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <Input 
                          id="address" 
                          name="address"
                          type="text" 
                          placeholder="123 Main St" 
                          value={formData.address}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <Input 
                            id="city" 
                            name="city"
                            type="text" 
                            placeholder="New York" 
                            value={formData.city}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <Input 
                            id="state" 
                            name="state"
                            type="text" 
                            placeholder="NY" 
                            value={formData.state}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <Input 
                            id="zipcode" 
                            name="zipcode"
                            type="text" 
                            placeholder="10001" 
                            value={formData.zipcode}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Driver's License */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Driver's License Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                            License Number
                          </label>
                          <Input 
                            id="license" 
                            name="license"
                            type="text" 
                            placeholder="DL123456789" 
                            value={formData.license}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="licenseState" className="block text-sm font-medium text-gray-700 mb-1">
                            License State
                          </label>
                          <Input 
                            id="licenseState" 
                            name="licenseState"
                            type="text" 
                            placeholder="NY" 
                            value={formData.licenseState}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                            License Expiry Date
                          </label>
                          <Input 
                            id="licenseExpiry" 
                            name="licenseExpiry"
                            type="date" 
                            value={formData.licenseExpiry}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <Input 
                            id="dateOfBirth" 
                            name="dateOfBirth"
                            type="date" 
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Account Security
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                          </label>
                          <Input 
                            id="password" 
                            name="password"
                            type="password" 
                            placeholder="Create a password" 
                            value={formData.password}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                          </label>
                          <Input 
                            id="confirmPassword" 
                            name="confirmPassword"
                            type="password" 
                            placeholder="Confirm your password" 
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                          Sign In
                        </Link>
                      </p>
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
  )
} 