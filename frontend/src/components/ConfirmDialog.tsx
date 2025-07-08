'use client'

import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmDialogProps) {
  // Close dialog on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isLoading, onCancel])

  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: 'text-danger-600',
      button: 'btn-danger'
    },
    warning: {
      icon: 'text-warning-600',
      button: 'btn-warning'
    },
    info: {
      icon: 'text-primary-600',
      button: 'btn-primary'
    }
  }

  const styles = variantStyles[variant]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full bg-opacity-20 flex items-center justify-center ${
              variant === 'danger' ? 'bg-danger-100' : 
              variant === 'warning' ? 'bg-warning-100' : 'bg-primary-100'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${styles.icon}`} />
            </div>
            <h2 className="text-lg font-semibold text-secondary-900">
              {title}
            </h2>
          </div>
          
          {!isLoading && (
            <button
              onClick={onCancel}
              className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-secondary-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-secondary-200 bg-secondary-50 rounded-b-xl">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="btn-outline"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${styles.button} flex items-center space-x-2`}
          >
            {isLoading && (
              <div className="spinner w-4 h-4"></div>
            )}
            <span>
              {isLoading ? 'Processing...' : confirmText}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
