'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getCurrentUser, User } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated()
        setIsAuth(authenticated)
        
        if (!authenticated) {
          // Redirect to signin page if not authenticated
          router.push('/signin')
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/signin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show children only if authenticated
  return isAuth ? <>{children}</> : null
}

// Hook to get current user
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authStatus, setAuthStatus] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [currentUser, authenticated] = await Promise.all([
          getCurrentUser(),
          isAuthenticated()
        ])
        
        setUser(currentUser)
        setAuthStatus(authenticated)
      } catch (error) {
        console.error('Auth hook error:', error)
        setUser(null)
        setAuthStatus(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { user, isLoading, isAuthenticated: authStatus }
} 