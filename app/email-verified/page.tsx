import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, CheckCircle, ArrowRight, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function EmailVerifiedPage() {
  return (
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
          <Link href="#contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>
        <div className="ml-6 flex gap-2">
          <Link href="/signin">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Success Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
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
                      <span className="font-medium">john@example.com</span>
                    </div>
                    <p className="text-sm text-green-600">
                      You can now access all features of your RentEasy account, including booking vehicles and managing your rentals.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link href="/fleet">
                      <Button size="lg" className="w-full sm:w-auto">
                        <Car className="mr-2 h-4 w-4" />
                        Browse Vehicles
                      </Button>
                    </Link>
                    <Link href="/book-vehicle">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Book Now
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
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What's Next?</h2>
                <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl mt-4">
                  Now that your account is verified, here's what you can do
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Browse Our Fleet</h3>
                  <p className="text-gray-600">
                    Explore our wide selection of vehicles from economy cars to luxury SUVs.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Book Your Vehicle</h3>
                  <p className="text-gray-600">
                    Choose your preferred vehicle and dates to make a reservation.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <ArrowRight className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hit the Road</h3>
                  <p className="text-gray-600">
                    Pick up your vehicle and enjoy your journey with peace of mind.
                  </p>
                </div>
              </div>
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