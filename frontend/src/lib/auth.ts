/**
 * Authentication utilities for Choreo managed authentication
 * Handles login, logout, user info retrieval, and session management
 *
 * This implementation follows Choreo's managed authentication guide:
 * - Uses /auth/login and /auth/logout endpoints
 * - Handles userinfo cookie parsing and cleanup
 * - Supports session_hint for proper logout
 * - Implements /auth/userinfo endpoint for session validation
 * - Manages post-login path configuration
 */

import Cookies from 'js-cookie'
import { User } from '@/types'

// Configuration constants for Choreo managed authentication
const AUTH_CONFIG = {
  LOGIN_ENDPOINT: '/auth/login',
  LOGOUT_ENDPOINT: '/auth/logout',
  USERINFO_ENDPOINT: '/auth/userinfo',
  USERINFO_COOKIE: 'userinfo',
  SESSION_HINT_COOKIE: 'session_hint',
  DEFAULT_POST_LOGIN_PATH: '/dashboard',
  DEFAULT_POST_LOGOUT_PATH: '/',
  COOKIE_PATH: '/',
  SESSION_STORAGE_KEY: 'user',
  LAST_LOGIN_KEY: 'lastLogin'
} as const

/**
 * Authentication service for Choreo managed authentication
 */
export class AuthService {
  private static instance: AuthService
  private user: User | null = null
  private isAuthenticated: boolean = false

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Initiate login by redirecting to Choreo auth endpoint
   * @param redirectPath - Optional path to redirect to after login (defaults to /dashboard)
   * @param options - Additional login options
   */
  login(redirectPath?: string, options?: {
    forceReauth?: boolean
    prompt?: 'none' | 'login' | 'consent' | 'select_account'
  }): void {
    const targetPath = redirectPath || AUTH_CONFIG.DEFAULT_POST_LOGIN_PATH
    let loginUrl = AUTH_CONFIG.LOGIN_ENDPOINT

    // Build query parameters
    const params = new URLSearchParams()

    // Add redirect parameter
    if (targetPath !== AUTH_CONFIG.DEFAULT_POST_LOGIN_PATH) {
      params.append('redirect', targetPath)
    }

    // Add additional options if provided
    if (options?.forceReauth) {
      params.append('prompt', 'login')
    } else if (options?.prompt) {
      params.append('prompt', options.prompt)
    }

    // Construct final URL
    const queryString = params.toString()
    const finalUrl = queryString ? `${loginUrl}?${queryString}` : loginUrl

    console.log('🔐 Redirecting to login:', finalUrl)
    window.location.href = finalUrl
  }

  /**
   * Initiate logout by redirecting to Choreo auth endpoint
   * @param postLogoutPath - Optional path to redirect to after logout (defaults to /)
   */
  logout(postLogoutPath?: string): void {
    const sessionHint = Cookies.get(AUTH_CONFIG.SESSION_HINT_COOKIE)
    const targetPath = postLogoutPath || AUTH_CONFIG.DEFAULT_POST_LOGOUT_PATH

    // Build logout URL with parameters
    const params = new URLSearchParams()

    if (sessionHint) {
      params.append('session_hint', sessionHint)
    }

    if (targetPath !== AUTH_CONFIG.DEFAULT_POST_LOGOUT_PATH) {
      params.append('post_logout_redirect_uri', window.location.origin + targetPath)
    }

    const queryString = params.toString()
    const logoutUrl = queryString
      ? `${AUTH_CONFIG.LOGOUT_ENDPOINT}?${queryString}`
      : AUTH_CONFIG.LOGOUT_ENDPOINT

    // Clear local user state before redirect
    this.user = null
    this.isAuthenticated = false
    this.clearStoredUserData()

    // Clear all auth-related cookies
    this.clearAuthCookies()

    console.log('🔐 Redirecting to logout:', logoutUrl)
    window.location.href = logoutUrl
  }

  /**
   * Get user information from userinfo cookie (available after login)
   * This should be called on the post-login page as per Choreo guide
   */
  getUserInfoFromCookie(): User | null {
    try {
      const encodedUserInfo = Cookies.get(AUTH_CONFIG.USERINFO_COOKIE)

      if (!encodedUserInfo) {
        console.log('🔐 No userinfo cookie found')
        return null
      }

      console.log('🔐 Found userinfo cookie, parsing user information')

      // Decode the base64 encoded user info (as per Choreo guide)
      const userInfo = JSON.parse(atob(encodedUserInfo))

      // Validate required fields
      if (!userInfo.sub) {
        console.error('🔐 Invalid userinfo: missing sub claim')
        return null
      }

      // Clear the cookie after reading (as recommended by Choreo guide)
      Cookies.remove(AUTH_CONFIG.USERINFO_COOKIE, { path: AUTH_CONFIG.COOKIE_PATH })
      console.log('🔐 Userinfo cookie cleared after reading')

      // Transform user info to our User type
      this.user = {
        id: userInfo.sub,
        email: userInfo.email || '',
        name: userInfo.name || this.buildFullName(userInfo.given_name, userInfo.family_name),
        username: userInfo.preferred_username || userInfo.email || userInfo.sub,
        groups: Array.isArray(userInfo.groups) ? userInfo.groups : [],
        roles: Array.isArray(userInfo.roles) ? userInfo.roles : [],
        profileComplete: !!(userInfo.name && userInfo.email)
      }

      this.isAuthenticated = true

      // Store in localStorage for session persistence
      this.storeUserData(this.user)

      console.log('🔐 User authenticated via cookie:', {
        id: this.user.id,
        email: this.user.email,
        name: this.user.name
      })

      return this.user
    } catch (error) {
      console.error('🔐 Error parsing user info cookie:', error)
      // Clear potentially corrupted cookie
      Cookies.remove(AUTH_CONFIG.USERINFO_COOKIE, { path: AUTH_CONFIG.COOKIE_PATH })
      return null
    }
  }

  /**
   * Check authentication status via API endpoint (as per Choreo guide)
   * This endpoint returns 200 OK with user info if authenticated, 401 if not
   */
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      console.log('🔐 Checking authentication status via API')

      const response = await fetch(AUTH_CONFIG.USERINFO_ENDPOINT, {
        method: 'GET',
        credentials: 'include', // Include cookies for Choreo auth
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })

      if (response.ok) {
        const userInfo = await response.json()
        console.log('🔐 User authenticated via API endpoint')

        // Validate required fields
        if (!userInfo.sub) {
          throw new Error('Invalid userinfo response: missing sub claim')
        }

        this.user = {
          id: userInfo.sub,
          email: userInfo.email || '',
          name: userInfo.name || this.buildFullName(userInfo.given_name, userInfo.family_name),
          username: userInfo.preferred_username || userInfo.email || userInfo.sub,
          groups: Array.isArray(userInfo.groups) ? userInfo.groups : [],
          roles: Array.isArray(userInfo.roles) ? userInfo.roles : [],
          profileComplete: !!(userInfo.name && userInfo.email)
        }

        this.isAuthenticated = true
        this.storeUserData(this.user)

        return { isAuthenticated: true, user: this.user }
      } else if (response.status === 401) {
        // User is not authenticated (as per Choreo guide)
        console.log('🔐 User not authenticated (401 response)')
        this.user = null
        this.isAuthenticated = false
        this.clearStoredUserData()

        return { isAuthenticated: false, user: null }
      } else {
        throw new Error(`Auth check failed with status: ${response.status}`)
      }
    } catch (error) {
      console.error('🔐 Auth status check failed:', error)

      // On network error, try to use stored user data as fallback
      const storedUser = this.getStoredUserData()
      if (storedUser && this.isStoredUserValid(storedUser)) {
        console.log('🔐 Using stored user data as fallback')
        this.user = storedUser
        this.isAuthenticated = true
        return { isAuthenticated: true, user: storedUser }
      }

      // Clear everything on error
      this.user = null
      this.isAuthenticated = false
      this.clearStoredUserData()

      return { isAuthenticated: false, user: null }
    }
  }

  /**
   * Get current user (from memory or localStorage)
   */
  getCurrentUser(): User | null {
    if (this.user) {
      return this.user
    }
    
    // Try to get from localStorage
    const storedUser = this.getStoredUserData()
    if (storedUser) {
      this.user = storedUser
      this.isAuthenticated = true
      return storedUser
    }
    
    return null
  }

  /**
   * Check if user is currently authenticated
   */
  getIsAuthenticated(): boolean {
    return this.isAuthenticated || !!this.getStoredUserData()
  }

  /**
   * Handle session expiry (401 responses from API calls)
   * Automatically redirect to login
   */
  handleSessionExpiry(): void {
    console.log('Session expired, redirecting to login...')
    this.user = null
    this.isAuthenticated = false
    this.clearStoredUserData()
    this.login(window.location.pathname)
  }

  /**
   * Store user data in localStorage
   */
  private storeUserData(user: User): void {
    try {
      localStorage.setItem(AUTH_CONFIG.SESSION_STORAGE_KEY, JSON.stringify(user))
      localStorage.setItem(AUTH_CONFIG.LAST_LOGIN_KEY, new Date().toISOString())
      console.log('🔐 User data stored in localStorage')
    } catch (error) {
      console.error('🔐 Error storing user data:', error)
    }
  }

  /**
   * Build full name from given and family names
   */
  private buildFullName(givenName?: string, familyName?: string): string {
    const parts = [givenName, familyName].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : ''
  }

  /**
   * Check if stored user data is still valid
   */
  private isStoredUserValid(user: User): boolean {
    try {
      const lastLoginStr = localStorage.getItem(AUTH_CONFIG.LAST_LOGIN_KEY)
      if (!lastLoginStr) return false

      const lastLogin = new Date(lastLoginStr)
      const now = new Date()
      const hoursSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60)

      // Consider stored data valid for 24 hours
      return hoursSinceLogin < 24 && !!user.id
    } catch (error) {
      console.error('🔐 Error validating stored user:', error)
      return false
    }
  }

  /**
   * Clear all authentication-related cookies
   */
  private clearAuthCookies(): void {
    try {
      // Clear userinfo cookie if it exists
      Cookies.remove(AUTH_CONFIG.USERINFO_COOKIE, { path: AUTH_CONFIG.COOKIE_PATH })

      // Clear session hint cookie if it exists
      Cookies.remove(AUTH_CONFIG.SESSION_HINT_COOKIE, { path: AUTH_CONFIG.COOKIE_PATH })

      // Clear any other potential auth cookies
      const authCookies = ['JSESSIONID', 'commonAuthId', 'opbs']
      authCookies.forEach(cookieName => {
        Cookies.remove(cookieName, { path: AUTH_CONFIG.COOKIE_PATH })
        Cookies.remove(cookieName, { path: '/', domain: window.location.hostname })
      })

      console.log('🔐 Authentication cookies cleared')
    } catch (error) {
      console.error('🔐 Error clearing auth cookies:', error)
    }
  }

  /**
   * Get stored user data from localStorage
   */
  private getStoredUserData(): User | null {
    try {
      const userData = localStorage.getItem(AUTH_CONFIG.SESSION_STORAGE_KEY)
      if (!userData) return null

      const user = JSON.parse(userData)
      console.log('🔐 Retrieved stored user data')
      return user
    } catch (error) {
      console.error('🔐 Error retrieving stored user data:', error)
      // Clear corrupted data
      this.clearStoredUserData()
      return null
    }
  }

  /**
   * Clear stored user data from localStorage
   */
  private clearStoredUserData(): void {
    try {
      localStorage.removeItem(AUTH_CONFIG.SESSION_STORAGE_KEY)
      localStorage.removeItem(AUTH_CONFIG.LAST_LOGIN_KEY)
      console.log('🔐 Stored user data cleared')
    } catch (error) {
      console.error('🔐 Error clearing stored user data:', error)
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance()

// Utility functions
export const isAuthenticated = (): boolean => authService.getIsAuthenticated()
export const getCurrentUser = (): User | null => authService.getCurrentUser()
export const login = (redirectPath?: string): void => authService.login(redirectPath)
export const logout = (): void => authService.logout()
export const handleSessionExpiry = (): void => authService.handleSessionExpiry()
