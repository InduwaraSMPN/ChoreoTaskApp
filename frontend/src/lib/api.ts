/**
 * API client for communicating with the Task Management backend
 * Handles authentication, error handling, and API calls
 */

import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters, 
  TaskListResponse, 
  TaskStats,
  User,
  UserPreferences,
  UserActivity,
  ApiError 
} from '@/types'
import { handleSessionExpiry } from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/choreo-apis'

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

/**
 * API client class for making authenticated requests
 */
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Make an authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      credentials: 'include', // Include cookies for Choreo auth
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // Handle authentication errors
      if (response.status === 401) {
        handleSessionExpiry()
        throw new ApiClientError('Authentication required', 401)
      }
      
      // Parse response
      const data = await response.json()
      
      if (!response.ok) {
        throw new ApiClientError(
          data.message || `HTTP ${response.status}`,
          response.status,
          data
        )
      }
      
      return data
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error
      }
      
      // Network or other errors
      console.error('API request failed:', error)
      throw new ApiClientError(
        'Network error or server unavailable',
        0,
        error
      )
    }
  }

  // Task API methods
  async getTasks(filters?: TaskFilters): Promise<TaskListResponse> {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
    
    const queryString = params.toString()
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`
    
    return this.request<TaskListResponse>(endpoint)
  }

  async getTask(id: string): Promise<{ task: Task }> {
    return this.request<{ task: Task }>(`/tasks/${id}`)
  }

  async createTask(data: CreateTaskRequest): Promise<{ task: Task; message: string }> {
    return this.request<{ task: Task; message: string }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<{ task: Task; message: string }> {
    return this.request<{ task: Task; message: string }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTask(id: string): Promise<{ message: string; taskId: string }> {
    return this.request<{ message: string; taskId: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  async getTaskStats(): Promise<{ stats: TaskStats }> {
    return this.request<{ stats: TaskStats }>('/tasks/stats')
  }

  // User API methods
  async getUserProfile(): Promise<{ profile: User }> {
    return this.request<{ profile: User }>('/user/profile')
  }

  async getUserPreferences(): Promise<{ preferences: UserPreferences }> {
    return this.request<{ preferences: UserPreferences }>('/user/preferences')
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<{ preferences: UserPreferences }> {
    return this.request<{ preferences: UserPreferences }>('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    })
  }

  async getUserActivity(): Promise<{ activity: UserActivity }> {
    return this.request<{ activity: UserActivity }>('/user/activity')
  }

  async logoutUser(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/user/logout', {
      method: 'POST',
    })
  }

  async getUserPermissions(): Promise<{ permissions: any }> {
    return this.request<{ permissions: any }>('/user/permissions')
  }
}

// Create and export API client instance
export const apiClient = new ApiClient()

// Convenience functions for common operations
export const taskApi = {
  getAll: (filters?: TaskFilters) => apiClient.getTasks(filters),
  getById: (id: string) => apiClient.getTask(id),
  create: (data: CreateTaskRequest) => apiClient.createTask(data),
  update: (id: string, data: UpdateTaskRequest) => apiClient.updateTask(id, data),
  delete: (id: string) => apiClient.deleteTask(id),
  getStats: () => apiClient.getTaskStats(),
}

export const userApi = {
  getProfile: () => apiClient.getUserProfile(),
  getPreferences: () => apiClient.getUserPreferences(),
  updatePreferences: (preferences: Partial<UserPreferences>) => 
    apiClient.updateUserPreferences(preferences),
  getActivity: () => apiClient.getUserActivity(),
  logout: () => apiClient.logoutUser(),
  getPermissions: () => apiClient.getUserPermissions(),
}

// Error handling utilities
export const isApiError = (error: any): error is ApiClientError => {
  return error instanceof ApiClientError
}

export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

export const isNetworkError = (error: any): boolean => {
  return isApiError(error) && error.status === 0
}

export const isAuthError = (error: any): boolean => {
  return isApiError(error) && error.status === 401
}

export const isValidationError = (error: any): boolean => {
  return isApiError(error) && error.status === 400
}

export const isNotFoundError = (error: any): boolean => {
  return isApiError(error) && error.status === 404
}
