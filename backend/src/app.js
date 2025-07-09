const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

// Import middleware
const { authMiddleware } = require('./middleware/auth')
const { errorHandler } = require('./middleware/errorHandler')

// Import routes
const healthRoutes = require('./routes/health')
const taskRoutes = require('./routes/tasks')
const userRoutes = require('./routes/user')

// Create Express application
const app = express()

// Configuration
const PORT = process.env.PORT || 8080
const NODE_ENV = process.env.NODE_ENV || 'development'
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}))

// CORS configuration for Choreo
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-jwt-assertion']
}))

// Logging middleware
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check routes (no auth required)
app.use('/health', healthRoutes)

// Authentication middleware for protected routes
app.use('/api', authMiddleware)

// API routes (protected)
app.use('/api/tasks', taskRoutes)
app.use('/api/user', userRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Choreo Task Management API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Task Management API server running on port ${PORT}`)
  console.log(`📝 Environment: ${NODE_ENV}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API base URL: http://localhost:${PORT}/api`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Process terminated')
    process.exit(0)
  })
})

module.exports = app
