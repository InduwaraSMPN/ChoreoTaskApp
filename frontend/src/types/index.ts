// Type definitions for the Task Management application

export interface User {
  id: string
  email: string
  name: string
  username: string
  groups?: string[]
  roles?: string[]
  lastLogin?: string
  profileComplete?: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'completed'
  dueDate?: string | null
  createdAt: string
  updatedAt: string
  userId: string
  createdBy: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  status?: 'todo' | 'in-progress' | 'completed'
  dueDate?: string | null
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  status?: 'todo' | 'in-progress' | 'completed'
  dueDate?: string | null
}

export interface TaskFilters {
  status?: 'todo' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate'
  sortOrder?: 'asc' | 'desc'
}

export interface TaskStats {
  total: number
  byStatus: {
    todo: number
    'in-progress': number
    completed: number
  }
  byPriority: {
    low: number
    medium: number
    high: number
  }
  overdue: number
}

export interface ApiResponse<T = any> {
  message?: string
  data?: T
  error?: string
  timestamp?: string
}

export interface TaskListResponse {
  tasks: Task[]
  total: number
  filters: TaskFilters
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    taskReminders: boolean
    weeklyDigest: boolean
  }
  dashboard: {
    defaultView: 'list' | 'grid' | 'kanban'
    tasksPerPage: number
    showCompletedTasks: boolean
  }
}

export interface UserActivity {
  userId: string
  period: string
  summary: {
    tasksCreated: number
    tasksCompleted: number
    tasksInProgress: number
    averageCompletionTime: string
    mostProductiveDay: string
    streakDays: number
  }
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'task_created' | 'task_completed' | 'task_updated' | 'task_deleted'
  description: string
  timestamp: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined
}

// API error types
export interface ApiError {
  error: string
  message: string
  timestamp: string
  details?: any
}

// Component prop types
export interface TaskCardProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export interface TaskFormProps {
  task?: Task
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export interface FilterBarProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
  taskStats: TaskStats
}

// Utility types
export type TaskPriority = Task['priority']
export type TaskStatus = Task['status']
export type SortField = NonNullable<TaskFilters['sortBy']>
export type SortOrder = NonNullable<TaskFilters['sortOrder']>

// Environment configuration
export interface AppConfig {
  apiBaseUrl: string
  appName: string
  debug: boolean
  version: string
}
