'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Get error details from URL parameters
    const code = searchParams.get('code')
    const message = searchParams.get('message')
    
    setErrorCode(code)
    setErrorMessage(message)
  }, [searchParams])

  const getErrorTitle = (code: string | null) => {
    switch (code) {
      case 'access_denied':
        return 'Access Denied'
      case 'invalid_request':
        return 'Invalid Request'
      case 'server_error':
        return 'Server Error'
      case 'temporarily_unavailable':
        return 'Service Temporarily Unavailable'
      default:
        return 'Authentication Error'
    }
  }

  const getErrorDescription = (code: string | null, message: string | null) => {
    if (message) {
      return message
    }

    switch (code) {
      case 'access_denied':
        return 'You have denied access to the application or do not have the required permissions.'
      case 'invalid_request':
        return 'The authentication request was invalid or malformed.'
      case 'server_error':
        return 'An internal server error occurred during authentication.'
      case 'temporarily_unavailable':
        return 'The authentication service is temporarily unavailable. Please try again later.'
      default:
        return 'An unexpected error occurred during the authentication process.'
    }
  }

  const handleRetry = () => {
    // Redirect to login to retry authentication
    window.location.href = '/auth/login'
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-danger-600" />
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">
            {getErrorTitle(errorCode)}
          </h1>

          {/* Error Description */}
          <p className="text-secondary-600 mb-8">
            {getErrorDescription(errorCode, errorMessage)}
          </p>

          {/* Error Details */}
          {errorCode && (
            <div className="bg-secondary-100 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-medium text-secondary-900 mb-2">
                Error Details:
              </h3>
              <div className="text-sm text-secondary-600 space-y-1">
                <div>
                  <span className="font-medium">Code:</span> {errorCode}
                </div>
                {errorMessage && (
                  <div>
                    <span className="font-medium">Message:</span> {errorMessage}
                  </div>
                )}
                <div>
                  <span className="font-medium">Time:</span> {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              onClick={handleGoHome}
              className="btn-outline w-full flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-secondary-200">
            <p className="text-sm text-secondary-500">
              If this problem persists, please contact support or try again later.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
