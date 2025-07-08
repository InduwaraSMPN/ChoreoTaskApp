'use client'

import { Filter, SortAsc, SortDesc, X } from 'lucide-react'
import { TaskFilters, TaskStats } from '@/types'

interface FilterBarProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
  taskStats: TaskStats
}

export default function FilterBar({ filters, onFiltersChange, taskStats }: FilterBarProps) {
  const handleFilterChange = (key: keyof TaskFilters, value: string | undefined) => {
    const newFilters = { ...filters }
    
    if (value === '' || value === undefined) {
      delete newFilters[key]
    } else {
      newFilters[key] = value as any
    }
    
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <label htmlFor="status-filter" className="text-sm font-medium text-secondary-700">
          Status:
        </label>
        <select
          id="status-filter"
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="text-sm border-secondary-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All ({taskStats.total})</option>
          <option value="todo">To Do ({taskStats.byStatus.todo})</option>
          <option value="in-progress">In Progress ({taskStats.byStatus['in-progress']})</option>
          <option value="completed">Completed ({taskStats.byStatus.completed})</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="flex items-center space-x-2">
        <label htmlFor="priority-filter" className="text-sm font-medium text-secondary-700">
          Priority:
        </label>
        <select
          id="priority-filter"
          value={filters.priority || ''}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="text-sm border-secondary-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All</option>
          <option value="high">High ({taskStats.byPriority.high})</option>
          <option value="medium">Medium ({taskStats.byPriority.medium})</option>
          <option value="low">Low ({taskStats.byPriority.low})</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="flex items-center space-x-2">
        <label htmlFor="sort-filter" className="text-sm font-medium text-secondary-700">
          Sort by:
        </label>
        <select
          id="sort-filter"
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="text-sm border-secondary-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="createdAt">Created Date</option>
          <option value="updatedAt">Updated Date</option>
          <option value="title">Title</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      {/* Sort Order */}
      <button
        onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
        className="flex items-center space-x-1 px-3 py-1 text-sm border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        title={`Sort ${filters.sortOrder === 'desc' ? 'ascending' : 'descending'}`}
      >
        {filters.sortOrder === 'desc' ? (
          <SortDesc className="w-4 h-4" />
        ) : (
          <SortAsc className="w-4 h-4" />
        )}
        <span>{filters.sortOrder === 'desc' ? 'Desc' : 'Asc'}</span>
      </button>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-danger-600 border border-danger-300 rounded-md hover:bg-danger-50 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-danger-500"
        >
          <X className="w-4 h-4" />
          <span>Clear</span>
        </button>
      )}

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-1 text-sm text-secondary-600">
          <Filter className="w-4 h-4" />
          <span>{Object.keys(filters).length} filter{Object.keys(filters).length !== 1 ? 's' : ''} active</span>
        </div>
      )}
    </div>
  )
}
