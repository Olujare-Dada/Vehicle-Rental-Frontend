'use client'

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, CheckCircle, XCircle, ArrowRight, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/lib/config"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error')
      setMessage('No verification token provided.')
      return
    }

    const verifyEmail = async () => {
      try {
        // The backend expects a GET request with token as query parameter
        const response = await fetch(`${API_ENDPOINTS.verifyEmail}?token=${token}`, {
          method: 'GET',
          redirect: 'manual', // Don't follow redirects automatically
        })

        if (response.status === 302) {
          // Backend redirected successfully - check the Location header
          const location = response.headers.get('Location')
          if (location && location.includes('status=success')) {
            setVerificationStatus('success')
            setMessage('Your email has been successfully verified!')
          } else if (location && location.includes('status=error')) {
            setVerificationStatus('error')
            const urlParams = new URLSearchParams(location.split('?')[1])
            setMessage(urlParams.get('message') || 'Email verification failed.')
          } else {
            setVerificationStatus('success')
            setMessage('Your email has been successfully verified!')
          }
        } else if (response.ok) {
          setVerificationStatus('success')
          setMessage('Your email has been successfully verified!')
        } else {
          const errorData = await response.json().catch(() => ({}))
          setVerificationStatus('error')
          setMessage(errorData.error || 'Email verification failed. Please try again.')
        }
      } catch (error) {
        setVerificationStatus('error')
        setMessage('Network error. Please check your connection and try again.')
      }
    }

    verifyEmail()
  }, [token])

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-3xl text-blue-800">Verifying Your Email</CardTitle>
              <CardDescription className="text-lg text-blue-700">
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-blue-600">
                This should only take a moment.
              </p>
            </CardContent>
          </Card>
        )

      case 'success':
        return (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-green-800">Email Verified!</CardTitle>
              <CardDescription className="text-lg text-green-700">
                Your email address has been successfully verified. Your account is now active and ready to use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <Mail className="h-5 w-5" />
                  <span className="font-medium">Email verification completed</span>
                </div>
                <p className="text-sm text-green-600">
                  You can now access all features of your RentEasy account, including booking vehicles and managing your rentals.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/signin">
                  <Button size="lg" className="w-full sm:w-auto">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/fleet">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Car className="mr-2 h-4 w-4" />
                    Browse Vehicles
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-green-200">
                <p className="text-sm text-green-600">
                  Need help?{" "}
                  <Link href="#" className="font-medium text-green-700 hover:text-green-800 underline">
                    Contact our support team
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 'error':
        return (
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-3xl text-red-800">Verification Failed</CardTitle>
              <CardDescription className="text-lg text-red-700">
                {message}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Verification unsuccessful</span>
                </div>
                <p className="text-sm text-red-600">
                  The verification link may have expired or is invalid. Please try signing up again or contact support.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Sign Up Again
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Try Signing In
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-red-200">
                <p className="text-sm text-red-600">
                  Still having trouble?{" "}
                  <Link href="#" className="font-medium text-red-700 hover:text-red-800 underline">
                    Contact our support team
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
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
        {/* Verification Result Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              {renderContent()}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <div className="container text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} RentEasy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
