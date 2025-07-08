'use client'

import { AlertCircle, X } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  className?: string
  variant?: 'error' | 'warning' | 'info'
}

export default function ErrorMessage({ 
  message, 
  onDismiss, 
  className = '',
  variant = 'error'
}: ErrorMessageProps) {
  const variantClasses = {
    error: 'bg-danger-50 border-danger-200 text-danger-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800'
  }

  const iconClasses = {
    error: 'text-danger-600',
    warning: 'text-warning-600',
    info: 'text-primary-600'
  }

  return (
    <div className={`rounded-lg border p-4 ${variantClasses[variant]} ${className}`}>
      <div className="flex items-start">
        <AlertCircle className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${iconClasses[variant]}`} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-3 flex-shrink-0 p-1 rounded-md hover:bg-opacity-20 hover:bg-current transition-colors duration-200 ${iconClasses[variant]}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
