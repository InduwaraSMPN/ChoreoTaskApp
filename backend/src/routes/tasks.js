/**
 * Task management routes for the Task Management API
 * Handles CRUD operations for user tasks
 */

const express = require('express')
const { v4: uuidv4 } = require('uuid')
const Joi = require('joi')
const { ValidationError, NotFoundError } = require('../middleware/errorHandler')

const router = express.Router()

// In-memory task storage (replace with database in production)
const tasks = new Map()

// Validation schemas
const taskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).allow(''),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  status: Joi.string().valid('todo', 'in-progress', 'completed').default('todo'),
  dueDate: Joi.date().iso().allow(null)
})

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().max(1000).allow(''),
  priority: Joi.string().valid('low', 'medium', 'high'),
  status: Joi.string().valid('todo', 'in-progress', 'completed'),
  dueDate: Joi.date().iso().allow(null)
}).min(1)

/**
 * GET /api/tasks
 * Get all tasks for the authenticated user
 */
router.get('/', (req, res) => {
  const userId = req.user.sub
  const userTasks = Array.from(tasks.values()).filter(task => task.userId === userId)

  // Apply filters if provided
  let filteredTasks = userTasks

  if (req.query.status) {
    filteredTasks = filteredTasks.filter(task => task.status === req.query.status)
  }

  if (req.query.priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === req.query.priority)
  }

  // Sort tasks
  const sortBy = req.query.sortBy || 'createdAt'
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1

  filteredTasks.sort((a, b) => {
    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'dueDate') {
      const aValue = new Date(a[sortBy] || 0)
      const bValue = new Date(b[sortBy] || 0)
      return (aValue - bValue) * sortOrder
    }
    return a[sortBy]?.localeCompare(b[sortBy]) * sortOrder || 0
  })

  res.json({
    tasks: filteredTasks,
    total: filteredTasks.length,
    filters: {
      status: req.query.status,
      priority: req.query.priority,
      sortBy,
      sortOrder: req.query.sortOrder || 'asc'
    }
  })
})

/**
 * POST /api/tasks
 * Create a new task for the authenticated user
 */
router.post('/', async(req, res) => {
  const { error, value } = taskSchema.validate(req.body)

  if (error) {
    throw new ValidationError('Invalid task data', error.details)
  }

  const taskId = uuidv4()
  const currentTime = new Date().toISOString()

  const newTask = {
    id: taskId,
    userId: req.user.sub,
    ...value,
    createdAt: currentTime,
    updatedAt: currentTime,
    createdBy: req.user.name || req.user.email
  }

  tasks.set(taskId, newTask)

  res.status(201).json({
    message: 'Task created successfully',
    task: newTask
  })
})

/**
 * GET /api/tasks/stats
 * Get task statistics for the authenticated user
 */
router.get('/stats', (req, res) => {
  const userId = req.user.sub
  const userTasks = Array.from(tasks.values()).filter(task => task.userId === userId)

  const stats = {
    total: userTasks.length,
    byStatus: {
      todo: userTasks.filter(t => t.status === 'todo').length,
      'in-progress': userTasks.filter(t => t.status === 'in-progress').length,
      completed: userTasks.filter(t => t.status === 'completed').length
    },
    byPriority: {
      low: userTasks.filter(t => t.priority === 'low').length,
      medium: userTasks.filter(t => t.priority === 'medium').length,
      high: userTasks.filter(t => t.priority === 'high').length
    },
    overdue: userTasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length
  }

  res.json({ stats })
})

/**
 * GET /api/tasks/:id
 * Get a specific task by ID
 */
router.get('/:id', (req, res) => {
  const taskId = req.params.id
  const userId = req.user.sub

  const task = tasks.get(taskId)

  if (!task) {
    throw new NotFoundError('Task not found')
  }

  if (task.userId !== userId) {
    throw new NotFoundError('Task not found')
  }

  res.json({ task })
})

/**
 * PUT /api/tasks/:id
 * Update a specific task
 */
router.put('/:id', async(req, res) => {
  const taskId = req.params.id
  const userId = req.user.sub

  const task = tasks.get(taskId)

  if (!task) {
    throw new NotFoundError('Task not found')
  }

  if (task.userId !== userId) {
    throw new NotFoundError('Task not found')
  }

  const { error, value } = updateTaskSchema.validate(req.body)

  if (error) {
    throw new ValidationError('Invalid task data', error.details)
  }

  const updatedTask = {
    ...task,
    ...value,
    updatedAt: new Date().toISOString()
  }

  tasks.set(taskId, updatedTask)

  res.json({
    message: 'Task updated successfully',
    task: updatedTask
  })
})

/**
 * DELETE /api/tasks/:id
 * Delete a specific task
 */
router.delete('/:id', (req, res) => {
  const taskId = req.params.id
  const userId = req.user.sub

  const task = tasks.get(taskId)

  if (!task) {
    throw new NotFoundError('Task not found')
  }

  if (task.userId !== userId) {
    throw new NotFoundError('Task not found')
  }

  tasks.delete(taskId)

  res.json({
    message: 'Task deleted successfully',
    taskId
  })
})

module.exports = router
