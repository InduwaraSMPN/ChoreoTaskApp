'use client'

import ErrorMessage from '@/components/ErrorMessage'
import FilterBar from '@/components/FilterBar'
import LoadingSpinner from '@/components/LoadingSpinner'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import { ToastContainer, useToast } from '@/components/Toast'
import UserProfile from '@/components/UserProfile'
import { getErrorMessage, taskApi } from '@/lib/api'
import { authService } from '@/lib/auth'
import { Task, TaskFilters, TaskStats, User } from '@/types'
import { AlertCircle, BarChart3, CheckCircle, Clock, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  // State management
  const [user, setUser] = useState<User | null>(null)
  const { toasts, removeToast, success, error: showError } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Authentication and initial data loading
  useEffect(() => {
    initializeDashboard()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load tasks when filters change
  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [filters, user]) // eslint-disable-line react-hooks/exhaustive-deps

  const initializeDashboard = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check authentication status
      const authResult = await authService.checkAuthStatus()
      
      if (!authResult.isAuthenticated) {
        // Redirect to login if not authenticated
        authService.login('/dashboard')
        return
      }

      setUser(authResult.user)
      
      // Load initial data
      await Promise.all([
        loadTasks(),
        loadTaskStats()
      ])
    } catch (err) {
      console.error('Dashboard initialization error:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const loadTasks = async () => {
    try {
      const response = await taskApi.getAll(filters)
      setTasks(response.tasks)
    } catch (err) {
      console.error('Error loading tasks:', err)
      setError(getErrorMessage(err))
    }
  }

  const loadTaskStats = async () => {
    try {
      const response = await taskApi.getStats()
      setTaskStats(response.stats)
    } catch (err) {
      console.error('Error loading task stats:', err)
      // Don't set error for stats failure, just log it
    }
  }

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await taskApi.create(taskData)
      setTasks(prev => [response.task, ...prev])
      setShowTaskForm(false)
      await loadTaskStats() // Refresh stats
      success('Task created', 'Your new task has been created successfully')
    } catch (err) {
      console.error('Error creating task:', err)
      showError('Failed to create task', getErrorMessage(err))
    }
  }

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return

    try {
      const response = await taskApi.update(editingTask.id, taskData)
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id ? response.task : task
      ))
      setEditingTask(null)
      await loadTaskStats() // Refresh stats
      success('Task updated', 'Your task has been updated successfully')
    } catch (err) {
      console.error('Error updating task:', err)
      showError('Failed to update task', getErrorMessage(err))
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.delete(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
      await loadTaskStats() // Refresh stats
    } catch (err) {
      console.error('Error deleting task:', err)
      setError(getErrorMessage(err))
    }
  }

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters)
  }

  const handleLogout = () => {
    authService.logout()
  }

  // Filter tasks by search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-secondary-900">
                Task Management
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
              
              {user && (
                <UserProfile user={user} onLogout={handleLogout} />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage 
              message={error} 
              onDismiss={() => setError(null)} 
            />
          </div>
        )}

        {/* Stats Cards */}
        {taskStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-secondary-900">{taskStats.total}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">In Progress</p>
                  <p className="text-2xl font-bold text-warning-600">{taskStats.byStatus['in-progress']}</p>
                </div>
                <Clock className="w-8 h-8 text-warning-600" />
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Completed</p>
                  <p className="text-2xl font-bold text-success-600">{taskStats.byStatus.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Overdue</p>
                  <p className="text-2xl font-bold text-danger-600">{taskStats.overdue}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-danger-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </div>
              
              {taskStats && (
                <FilterBar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  taskStats={taskStats}
                />
              )}
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-secondary-900">
              Your Tasks ({filteredTasks.length})
            </h2>
          </div>
          <div className="card-body p-0">
            <TaskList
              tasks={filteredTasks}
              onEdit={handleTaskEdit}
              onDelete={handleDeleteTask}
              onUpdate={loadTasks}
            />
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}
