import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Truck,
  Shield,
  Clock,
  MapPin,
  Star,
  Phone,
  Mail,
  CheckCircle,
  Calendar,
  CreditCard,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Component() {
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
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Link href="/register">
            <Button size="sm">Book Now</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="w-fit">{"#1 Vehicle Rental Service"}</Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Rent Your Perfect Vehicle Today
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    From economy cars to luxury SUVs, find the perfect vehicle for your journey. Easy booking,
                    competitive prices, and 24/7 support.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="h-12 px-8">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Now
                    </Button>
                  </Link>
                  <Link href="/fleet">
                    <Button variant="outline" size="lg" className="h-12 px-8 bg-transparent">
                      View Fleet
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Free Cancellation
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    No Hidden Fees
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    24/7 Support
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="Vehicle Fleet"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Types Section */}
        <section id="vehicles" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Vehicle</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We offer a wide range of vehicles to suit every need and budget
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Car className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle>Economy Cars</CardTitle>
                  <CardDescription>Perfect for city driving and daily commutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-2">From $25/day</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Fuel efficient</li>
                    <li>• Easy parking</li>
                    <li>• Great for couples</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle>SUVs & Family Cars</CardTitle>
                  <CardDescription>Spacious vehicles for families and groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-2">From $45/day</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 7+ seating capacity</li>
                    <li>• Large luggage space</li>
                    <li>• All-weather capable</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Truck className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle>Trucks & Vans</CardTitle>
                  <CardDescription>Heavy-duty vehicles for moving and cargo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-2">From $65/day</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Large cargo capacity</li>
                    <li>• Moving equipment</li>
                    <li>• Commercial use</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>



        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Excellent service! The car was clean, well-maintained, and the booking process was seamless."
                  </p>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Business Traveler</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Great prices and friendly staff. I've been using RentEasy for all my family trips."
                  </p>
                  <div className="font-semibold">Mike Chen</div>
                  <div className="text-sm text-gray-500">Family Customer</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "The pickup was quick and the return process was hassle-free. Highly recommended!"
                  </p>
                  <div className="font-semibold">Emily Davis</div>
                  <div className="text-sm text-gray-500">Weekend Renter</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Hit the Road?</h2>
                <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Book your vehicle now and enjoy the freedom of the open road. Special discounts available for
                  first-time customers!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex gap-2">
                  <Input type="email" placeholder="Enter your email" className="bg-white text-gray-900" />
                  <Button variant="secondary">Get Quote</Button>
                </div>
                <p className="text-xs text-blue-200">
                  Get instant quotes and special offers. No spam, unsubscribe anytime.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now: (555) 123-4567
                </Button>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Online
                  </Button>
                </Link>
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
              <Link href="#" className="text-gray-600 hover:text-blue-600">
                Book Now
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">
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
