/**
 * Authentication utilities for Choreo managed authentication
 * Handles login, logout, user info retrieval, and session management
 */

import Cookies from 'js-cookie'
import { User } from '@/types'

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
   * @param redirectPath - Optional path to redirect to after login
   */
  login(redirectPath?: string): void {
    const loginUrl = '/auth/login'
    const url = redirectPath ? `${loginUrl}?redirect=${encodeURIComponent(redirectPath)}` : loginUrl
    window.location.href = url
  }

  /**
   * Initiate logout by redirecting to Choreo auth endpoint
   */
  logout(): void {
    const sessionHint = Cookies.get('session_hint')
    const logoutUrl = sessionHint 
      ? `/auth/logout?session_hint=${sessionHint}`
      : '/auth/logout'
    
    // Clear local user state
    this.user = null
    this.isAuthenticated = false
    
    // Clear any stored user data
    this.clearStoredUserData()
    
    window.location.href = logoutUrl
  }

  /**
   * Get user information from userinfo cookie (available after login)
   * This should be called on the post-login page
   */
  getUserInfoFromCookie(): User | null {
    try {
      const encodedUserInfo = Cookies.get('userinfo')
      
      if (!encodedUserInfo) {
        return null
      }

      // Decode the base64 encoded user info
      const userInfo = JSON.parse(atob(encodedUserInfo))
      
      // Clear the cookie after reading (as recommended by Choreo)
      Cookies.remove('userinfo', { path: '/' })
      
      // Store user info for session
      this.user = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim(),
        username: userInfo.preferred_username,
        groups: userInfo.groups || [],
        roles: userInfo.roles || [],
        profileComplete: !!(userInfo.name && userInfo.email)
      }
      
      this.isAuthenticated = true
      
      // Store in localStorage for session persistence
      this.storeUserData(this.user)
      
      return this.user
    } catch (error) {
      console.error('Error parsing user info cookie:', error)
      return null
    }
  }

  /**
   * Check authentication status by calling the userinfo endpoint
   */
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      const response = await fetch('/auth/userinfo', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (response.ok) {
        const userInfo = await response.json()
        
        this.user = {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim(),
          username: userInfo.preferred_username,
          groups: userInfo.groups || [],
          roles: userInfo.roles || [],
          profileComplete: !!(userInfo.name && userInfo.email)
        }
        
        this.isAuthenticated = true
        this.storeUserData(this.user)
        
        return { isAuthenticated: true, user: this.user }
      } else if (response.status === 401) {
        // User is not authenticated
        this.user = null
        this.isAuthenticated = false
        this.clearStoredUserData()
        
        return { isAuthenticated: false, user: null }
      } else {
        throw new Error(`Auth check failed with status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      
      // Try to get user from localStorage as fallback
      const storedUser = this.getStoredUserData()
      if (storedUser) {
        this.user = storedUser
        this.isAuthenticated = true
        return { isAuthenticated: true, user: storedUser }
      }
      
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
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('lastLogin', new Date().toISOString())
    } catch (error) {
      console.error('Error storing user data:', error)
    }
  }

  /**
   * Get stored user data from localStorage
   */
  private getStoredUserData(): User | null {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        return JSON.parse(userData)
      }
    } catch (error) {
      console.error('Error retrieving stored user data:', error)
    }
    return null
  }

  /**
   * Clear stored user data
   */
  private clearStoredUserData(): void {
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('lastLogin')
    } catch (error) {
      console.error('Error clearing stored user data:', error)
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
