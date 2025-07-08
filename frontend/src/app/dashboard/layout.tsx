'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      // First, try to get user info from cookie (post-login)
      const userFromCookie = authService.getUserInfoFromCookie()
      
      if (userFromCookie) {
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      // If no cookie, check auth status via API
      const authResult = await authService.checkAuthStatus()
      
      if (authResult.isAuthenticated) {
        setIsAuthenticated(true)
      } else {
        // Redirect to login if not authenticated
        authService.login('/dashboard')
        return
      }
    } catch (error) {
      console.error('Authentication check failed:', error)
      // Redirect to login on error
      authService.login('/dashboard')
      return
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="large" text="Redirecting to login..." />
      </div>
    )
  }

  return <>{children}</>
}
