'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Calendar, Flag, Clock } from 'lucide-react'
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types'

interface TaskFormProps {
  task?: Task | null
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

interface FormData {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'completed'
  dueDate: string
}

export default function TaskForm({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!task

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'todo',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    }
  })

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      })
    }
  }, [task, reset])

  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const submitData = {
        title: data.title.trim(),
        description: data.description.trim(),
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    reset()
    onCancel()
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="form-label">
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title', {
                required: 'Task title is required',
                minLength: {
                  value: 1,
                  message: 'Title must be at least 1 character'
                },
                maxLength: {
                  value: 200,
                  message: 'Title must be less than 200 characters'
                }
              })}
              className={`form-input ${errors.title ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="Enter task title..."
              disabled={isSubmitting || isLoading}
            />
            {errors.title && (
              <p className="form-error">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              {...register('description', {
                maxLength: {
                  value: 1000,
                  message: 'Description must be less than 1000 characters'
                }
              })}
              className={`form-input ${errors.description ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="Enter task description..."
              disabled={isSubmitting || isLoading}
            />
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
          </div>

          {/* Priority and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="form-label flex items-center space-x-1">
                <Flag className="w-4 h-4" />
                <span>Priority</span>
              </label>
              <select
                id="priority"
                {...register('priority')}
                className="form-input"
                disabled={isSubmitting || isLoading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="form-label flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Status</span>
              </label>
              <select
                id="status"
                {...register('status')}
                className="form-input"
                disabled={isSubmitting || isLoading}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="form-label flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Due Date</span>
            </label>
            <input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className="form-input"
              disabled={isSubmitting || isLoading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-outline"
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={isSubmitting || isLoading}
            >
              {(isSubmitting || isLoading) && (
                <div className="spinner w-4 h-4"></div>
              )}
              <span>
                {isSubmitting || isLoading 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Task' : 'Create Task')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
