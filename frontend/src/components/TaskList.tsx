'use client'

import { Task } from '@/types'
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Circle,
    Clock,
    Edit2,
    Flag,
    MoreVertical,
    Trash2
} from 'lucide-react'
import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onUpdate: () => void
}

export default function TaskList({ tasks, onEdit, onDelete, onUpdate }: TaskListProps) {
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)

  const handleDeleteClick = (taskId: string) => {
    setDeleteTaskId(taskId)
    setShowDropdown(null)
  }

  const handleDeleteConfirm = () => {
    if (deleteTaskId) {
      onDelete(deleteTaskId)
      setDeleteTaskId(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteTaskId(null)
  }

  const handleEditClick = (task: Task) => {
    onEdit(task)
    setShowDropdown(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-danger-600 bg-danger-50'
      case 'medium':
        return 'text-warning-600 bg-warning-50'
      case 'low':
        return 'text-success-600 bg-success-50'
      default:
        return 'text-secondary-600 bg-secondary-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-600" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-warning-600" />
      case 'todo':
        return <Circle className="w-5 h-5 text-secondary-400" />
      default:
        return <Circle className="w-5 h-5 text-secondary-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success-700 bg-success-50 border-success-200'
      case 'in-progress':
        return 'text-warning-700 bg-warning-50 border-warning-200'
      case 'todo':
        return 'text-secondary-700 bg-secondary-50 border-secondary-200'
      default:
        return 'text-secondary-700 bg-secondary-50 border-secondary-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-secondary-400" />
        </div>
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          No tasks found
        </h3>
        <p className="text-secondary-600">
          Create your first task to get started with managing your work.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-secondary-200">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 hover:bg-secondary-50 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(task.status)}
                </div>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        task.status === 'completed' 
                          ? 'text-secondary-500 line-through' 
                          : 'text-secondary-900'
                      }`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className={`mt-1 text-sm ${
                          task.status === 'completed'
                            ? 'text-secondary-400'
                            : 'text-secondary-600'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Task Meta */}
                  <div className="mt-3 flex items-center space-x-4 text-xs">
                    {/* Priority */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                      <Flag className="w-3 h-3 mr-1" />
                      {task.priority}
                    </span>

                    {/* Status */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full border font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>

                    {/* Due Date */}
                    {task.dueDate && (
                      <span className={`inline-flex items-center ${
                        isOverdue(task.dueDate) 
                          ? 'text-danger-600' 
                          : 'text-secondary-500'
                      }`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && (
                          <AlertCircle className="w-3 h-3 ml-1" />
                        )}
                      </span>
                    )}

                    {/* Created Date */}
                    <span className="text-secondary-400">
                      Created {formatDate(task.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="relative flex-shrink-0 ml-4">
                <button
                  onClick={() => setShowDropdown(showDropdown === task.id ? null : task.id)}
                  className="p-1 rounded-md text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors duration-200"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown === task.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-secondary-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleEditClick(task)}
                        className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4 mr-3" />
                        Edit Task
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-danger-700 hover:bg-danger-50 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete Task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTaskId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(null)}
        />
      )}
    </>
  )
}
