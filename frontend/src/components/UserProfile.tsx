'use client'

import { useState, useRef, useEffect } from 'react'
import { User, LogOut, Settings, Activity, ChevronDown } from 'lucide-react'
import { User as UserType } from '@/types'

interface UserProfileProps {
  user: UserType
  onLogout: () => void
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    setIsOpen(false)
    onLogout()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {getInitials(user.name)}
        </div>
        
        {/* User Info */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-secondary-900">{user.name}</p>
          <p className="text-xs text-secondary-600">{user.email}</p>
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-secondary-600 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-secondary-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-secondary-600 truncate">
                  {user.email}
                </p>
                {user.username && (
                  <p className="text-xs text-secondary-500 truncate">
                    @{user.username}
                  </p>
                )}
              </div>
            </div>
            
            {/* User Roles/Groups */}
            {(user.roles && user.roles.length > 0) || (user.groups && user.groups.length > 0) ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {user.roles?.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {role}
                  </span>
                ))}
                {user.groups?.map((group) => (
                  <span
                    key={group}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-800"
                  >
                    {group}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                // Handle profile view - you could navigate to a profile page
                console.log('View profile clicked')
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
            >
              <User className="w-4 h-4 mr-3" />
              View Profile
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                // Handle activity view - you could navigate to an activity page
                console.log('View activity clicked')
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
            >
              <Activity className="w-4 h-4 mr-3" />
              Activity
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                // Handle settings - you could navigate to a settings page
                console.log('Settings clicked')
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-secondary-200 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-danger-700 hover:bg-danger-50 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
