'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Car, Mail, Lock, ArrowLeft, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { setToken } from "@/lib/auth"

export default function SigninPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.token)
        router.push('/profile') // Redirect to profile page after successful login
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Sign in failed')
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
                  Welcome Back
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Sign in to your RentEasy account to continue booking vehicles
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Signin Form */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-md">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </div>
                  <CardTitle className="text-2xl">Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                      <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}
                    
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
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <Input 
                        id="password" 
                        name="password"
                        type="password" 
                        placeholder="Enter your password" 
                        value={formData.password}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Forgot your password?
                        </Link>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                          Sign Up
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