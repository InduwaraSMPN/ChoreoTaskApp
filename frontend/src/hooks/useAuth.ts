'use client'

import { useState, useEffect } from 'react'
import { User, AuthState } from '@/types'
import { authService } from '@/lib/auth'

/**
 * Custom hook for managing authentication state
 * Provides authentication status, user information, and auth actions
 */
export function useAuth(): AuthState & {
  login: (redirectPath?: string) => void
  logout: () => void
  checkAuth: () => Promise<void>
} {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  })

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      // First try to get user from cookie (post-login)
      const userFromCookie = authService.getUserInfoFromCookie()
      
      if (userFromCookie) {
        setAuthState({
          isAuthenticated: true,
          user: userFromCookie,
          isLoading: false,
          error: null
        })
        return
      }

      // If no cookie, check auth status via API
      const authResult = await authService.checkAuthStatus()
      
      setAuthState({
        isAuthenticated: authResult.isAuthenticated,
        user: authResult.user,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication check failed'
      })
    }
  }

  const login = (redirectPath?: string) => {
    authService.login(redirectPath)
  }

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    })
    authService.logout()
  }

  const checkAuth = async () => {
    await checkAuthStatus()
  }

  return {
    ...authState,
    login,
    logout,
    checkAuth
  }
}
