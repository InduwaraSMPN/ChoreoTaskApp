'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task, TaskFilters, TaskStats, CreateTaskRequest, UpdateTaskRequest } from '@/types'
import { taskApi, getErrorMessage } from '@/lib/api'

interface UseTasksReturn {
  tasks: Task[]
  taskStats: TaskStats | null
  isLoading: boolean
  error: string | null
  filters: TaskFilters
  setFilters: (filters: TaskFilters) => void
  createTask: (data: CreateTaskRequest) => Promise<void>
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  refreshTasks: () => Promise<void>
  refreshStats: () => Promise<void>
}

/**
 * Custom hook for managing tasks state and operations
 */
export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({})

  // Load tasks when filters change
  useEffect(() => {
    loadTasks()
  }, [filters])

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    await Promise.all([
      loadTasks(),
      loadTaskStats()
    ])
  }

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await taskApi.getAll(filters)
      setTasks(response.tasks)
    } catch (err) {
      console.error('Error loading tasks:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const loadTaskStats = useCallback(async () => {
    try {
      const response = await taskApi.getStats()
      setTaskStats(response.stats)
    } catch (err) {
      console.error('Error loading task stats:', err)
      // Don't set error for stats failure, just log it
    }
  }, [])

  const createTask = useCallback(async (data: CreateTaskRequest) => {
    try {
      setError(null)
      const response = await taskApi.create(data)
      
      // Add new task to the beginning of the list
      setTasks(prev => [response.task, ...prev])
      
      // Refresh stats
      await loadTaskStats()
    } catch (err) {
      console.error('Error creating task:', err)
      setError(getErrorMessage(err))
      throw err
    }
  }, [loadTaskStats])

  const updateTask = useCallback(async (id: string, data: UpdateTaskRequest) => {
    try {
      setError(null)
      const response = await taskApi.update(id, data)
      
      // Update task in the list
      setTasks(prev => prev.map(task => 
        task.id === id ? response.task : task
      ))
      
      // Refresh stats
      await loadTaskStats()
    } catch (err) {
      console.error('Error updating task:', err)
      setError(getErrorMessage(err))
      throw err
    }
  }, [loadTaskStats])

  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null)
      await taskApi.delete(id)
      
      // Remove task from the list
      setTasks(prev => prev.filter(task => task.id !== id))
      
      // Refresh stats
      await loadTaskStats()
    } catch (err) {
      console.error('Error deleting task:', err)
      setError(getErrorMessage(err))
      throw err
    }
  }, [loadTaskStats])

  const refreshTasks = useCallback(async () => {
    await loadTasks()
  }, [loadTasks])

  const refreshStats = useCallback(async () => {
    await loadTaskStats()
  }, [loadTaskStats])

  return {
    tasks,
    taskStats,
    isLoading,
    error,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    refreshStats
  }
}
