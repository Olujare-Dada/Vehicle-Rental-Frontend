'use client'

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
import { useAuth } from "@/components/auth/ProtectedRoute"
import { logout } from "@/lib/auth"
import { useEffect } from "react"
import { API_ENDPOINTS } from "@/lib/config"
import BackendStatus from "@/components/BackendStatus"

// TypeScript declaration for Voiceflow
declare global {
  interface Window {
    voiceflow: {
      chat: {
        load: (config: any) => void;
        updateContext: (context: any) => void;
      };
    };
  }
}

// Chatbot Component
function Chatbot() {
  const { user } = useAuth()
  
  useEffect(() => {
    // Use the official Voiceflow script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = `
      (function(d, t) {
          var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
          v.onload = function() {
            // Get JWT token for each request
            const token = localStorage.getItem("jwtToken");
            
            // Prepare context with user information and JWT token
            const context = {
              user: {
                username: '${user?.username || 'unknown'}',
                firstName: '${user?.firstName || 'unknown'}',
                lastName: '${user?.lastName || 'unknown'}',
                email: '${user?.email || 'unknown'}',
                id: '${user?.id || 'unknown'}'
              },
              auth: {
                token: token || 'no-token',
                isAuthenticated: !!token
              },
              session: {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
              },
              // API endpoints for chatbot to use
              api: {
                fleet: '${API_ENDPOINTS.fleet}',
                fleetAvailable: '${API_ENDPOINTS.fleetAvailable}',
                profile: '${API_ENDPOINTS.profileByUsername}',
                balance: '${API_ENDPOINTS.balance}',
                balanceAdd: '${API_ENDPOINTS.balanceAdd}',
                balanceDebit: '${API_ENDPOINTS.balanceDebit}',
                lateFees: '${API_ENDPOINTS.lateFeesUser}',
                lateFeesPay: '${API_ENDPOINTS.lateFeesPay}',
              },
              // Helper functions for chatbot to use with JWT authentication
              helpers: {
                getFleetData: async (page = 0, size = 10) => {
                  try {
                    const token = localStorage.getItem("jwtToken");
                    const response = await fetch('${API_ENDPOINTS.fleetAvailable}?page=' + page + '&size=' + size, {
                      headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                      }
                    });
                    if (response.ok) {
                      return await response.json();
                    } else {
                      throw new Error('HTTP ' + response.status);
                    }
                  } catch (error) {
                    return { error: error instanceof Error ? error.message : 'Unknown error' };
                  }
                },
                // Generic API call function with JWT authentication
                apiCall: async (endpoint, options = {}) => {
                  try {
                    const token = localStorage.getItem("jwtToken");
                    const response = await fetch(endpoint, {
                      ...options,
                      headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                        ...options.headers
                      }
                    });
                    if (response.ok) {
                      return await response.json();
                    } else {
                      throw new Error('HTTP ' + response.status);
                    }
                  } catch (error) {
                    return { error: error instanceof Error ? error.message : 'Unknown error' };
                  }
                }
              }
            };

            window.voiceflow.chat.load({
              verify: { projectID: '6897b9430a2a1fc690da3cde' },
              url: 'https://general-runtime.voiceflow.com',
              versionID: 'production',
              voice: {
                url: "https://runtime-api.voiceflow.com"
              },
              // Pass user information via launch event
              launch: {
                event: {
                  type: 'launch',
                  payload: {
                    user_name: '${user?.username || 'unknown'}',
                    user_email: '${user?.email || 'unknown'}',
                    user_first_name: '${user?.firstName || 'unknown'}',
                    user_last_name: '${user?.lastName || 'unknown'}',
                    user_id: '${user?.id || 'unknown'}'
                  }
                }
              }
            });
          }
          v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
      })(document, 'script');
    `
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[type="text/javascript"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [user]) // Re-run when user changes

  // Function to update chatbot context (can be called from other components)
  const updateChatbotContext = (newContext: any) => {
    if (window.voiceflow?.chat?.updateContext) {
      window.voiceflow.chat.updateContext(newContext);
    }
  };

  // Function to get fleet data for chatbot
  const getFleetDataForChatbot = async (page = 0, size = 10) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(API_ENDPOINTS.fleetAvailable + '?page=' + page + '&size=' + size, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  // Expose functions globally for other components to use
  useEffect(() => {
    (window as any).updateChatbotContext = updateChatbotContext;
    (window as any).getFleetDataForChatbot = getFleetDataForChatbot;
    return () => {
      delete (window as any).updateChatbotContext;
      delete (window as any).getFleetDataForChatbot;
    };
  }, []);

  return null // The chatbot will be rendered by the Voiceflow script
}

export default function Page() {
  const { user, isAuthenticated } = useAuth()

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
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Profile
              </Link>
              <Link href="/late-fees" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Late Fees
              </Link>
              <Link href="/balance" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Balance
              </Link>
              <div className="flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {user?.firstName || user?.username}
                  </span>
                </Link>
                <Link href="/balance">
                  <Button variant="ghost" size="sm">Balance</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/signin" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
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
                  <Link href="/book-vehicle">
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
                  src="https://i.postimg.cc/MGpt5sGf/car-1.png"
                  width={600}
                  height={400}
                  alt="Toyota Corolla - Premium Rental Vehicle"
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
                <Link href="/book-vehicle">
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

      {/* Chatbot - Only visible when authenticated */}
      {isAuthenticated && <Chatbot />}
      
      {/* Backend Status - Only visible in development */}
      <BackendStatus />
    </div>
  )
}
