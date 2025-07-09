# Task Management API Documentation

This document provides comprehensive documentation for the Task Management API backend service, including endpoint details, authentication requirements, and usage examples.

## 📋 API Overview

The Task Management API is a RESTful service built with Node.js and Express.js, designed to run on WSO2 Choreo platform. It provides endpoints for managing tasks with user authentication and authorization.

### Base Information

- **Base URL**: `https://your-choreo-service-url/api`
- **Authentication**: Choreo Managed Authentication (JWT via headers)
- **Content Type**: `application/json`
- **API Version**: `1.0.0`

### OpenAPI Specification

The complete API specification is available in the `backend/openapi.yaml` file and can be viewed using tools like Swagger Editor.

---

## 🔐 Authentication

### Authentication Method

The API uses Choreo's managed authentication system. When deployed on Choreo:

1. **Frontend Authentication**: Users authenticate via Choreo's managed auth
2. **Request Forwarding**: Choreo gateway forwards requests with user context
3. **JWT Assertion**: User information passed via `x-jwt-assertion` header
4. **Backend Processing**: API extracts user context from headers

### User Context

```typescript
interface User {
  sub: string                    // Unique user identifier
  email: string                  // User email address
  name: string                   // User display name
  preferred_username: string     // Username
  groups?: string[]              // User groups
  roles?: string[]               // User roles
}
```

### Authentication Headers

```http
x-jwt-assertion: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🏥 Health Endpoints

### GET /health

Basic health check endpoint for service monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development"
}
```

### GET /health/detailed

Comprehensive health check with system information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "system": {
    "platform": "linux",
    "nodeVersion": "v18.17.0",
    "memoryUsage": {
      "used": 45,
      "total": 128
    }
  },
  "dependencies": {
    "database": {
      "status": "healthy",
      "type": "in-memory"
    }
  }
}
```

---

## 📝 Task Management Endpoints

### GET /api/tasks

Retrieve all tasks for the authenticated user with optional filtering and sorting.

**Authentication**: Required

**Query Parameters:**
- `status` (optional): Filter by task status (`todo`, `in-progress`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)
- `sortBy` (optional): Sort field (`createdAt`, `updatedAt`, `title`, `priority`, `dueDate`)
- `sortOrder` (optional): Sort order (`asc`, `desc`)

**Example Request:**
```http
GET /api/tasks?status=todo&priority=high&sortBy=dueDate&sortOrder=asc
```

**Response:**
```json
{
  "tasks": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Complete project proposal",
      "description": "Finalize the project proposal document",
      "priority": "high",
      "status": "todo",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "userId": "user-123",
      "createdBy": "John Doe"
    }
  ],
  "total": 1,
  "filters": {
    "status": "todo",
    "priority": "high",
    "sortBy": "dueDate",
    "sortOrder": "asc"
  }
}
```

### POST /api/tasks

Create a new task for the authenticated user.

**Authentication**: Required

**Request Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Finalize the project proposal document",
  "priority": "high",
  "status": "todo",
  "dueDate": "2024-01-20T00:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Complete project proposal",
    "description": "Finalize the project proposal document",
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "userId": "user-123",
    "createdBy": "John Doe"
  }
}
```

### GET /api/tasks/{id}

Retrieve a specific task by ID.

**Authentication**: Required

**Path Parameters:**
- `id`: Task UUID

**Response:**
```json
{
  "task": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Complete project proposal",
    "description": "Finalize the project proposal document",
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "userId": "user-123",
    "createdBy": "John Doe"
  }
}
```

### PUT /api/tasks/{id}

Update an existing task.

**Authentication**: Required

**Path Parameters:**
- `id`: Task UUID

**Request Body:**
```json
{
  "title": "Updated task title",
  "status": "in-progress",
  "priority": "medium"
}
```

**Response:**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated task title",
    "description": "Finalize the project proposal document",
    "priority": "medium",
    "status": "in-progress",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "userId": "user-123",
    "createdBy": "John Doe"
  }
}
```

### DELETE /api/tasks/{id}

Delete a specific task.

**Authentication**: Required

**Path Parameters:**
- `id`: Task UUID

**Response:**
```json
{
  "message": "Task deleted successfully",
  "taskId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### GET /api/tasks/stats

Get task statistics for the authenticated user.

**Authentication**: Required

**Response:**
```json
{
  "stats": {
    "total": 15,
    "byStatus": {
      "todo": 5,
      "in-progress": 3,
      "completed": 7
    },
    "byPriority": {
      "low": 4,
      "medium": 8,
      "high": 3
    },
    "overdue": 2
  }
}
```

---

## 👤 User Management Endpoints

### GET /api/user/profile

Get the authenticated user's profile information.

**Authentication**: Required

**Response:**
```json
{
  "message": "User profile retrieved successfully",
  "profile": {
    "id": "user-123",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "groups": ["developers", "team-leads"],
    "roles": ["user", "task-manager"],
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "profileComplete": true
  }
}
```

### GET /api/user/preferences

Get user preferences and settings.

**Authentication**: Required

**Response:**
```json
{
  "message": "User preferences retrieved successfully",
  "preferences": {
    "theme": "light",
    "language": "en",
    "timezone": "UTC",
    "notifications": {
      "email": true,
      "push": false,
      "taskReminders": true,
      "weeklyDigest": true
    },
    "dashboard": {
      "defaultView": "list",
      "tasksPerPage": 10,
      "showCompletedTasks": false
    }
  }
}
```

### PUT /api/user/preferences

Update user preferences.

**Authentication**: Required

**Request Body:**
```json
{
  "theme": "dark",
  "notifications": {
    "email": false,
    "taskReminders": true
  }
}
```

**Response:**
```json
{
  "message": "User preferences updated successfully",
  "preferences": {
    "theme": "dark",
    "language": "en",
    "timezone": "UTC",
    "notifications": {
      "email": false,
      "push": false,
      "taskReminders": true,
      "weeklyDigest": true
    },
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### GET /api/user/activity

Get user activity summary and recent actions.

**Authentication**: Required

**Response:**
```json
{
  "message": "User activity retrieved successfully",
  "activity": {
    "userId": "user-123",
    "period": "last_30_days",
    "summary": {
      "tasksCreated": 15,
      "tasksCompleted": 12,
      "tasksInProgress": 3,
      "averageCompletionTime": "2.5 days",
      "mostProductiveDay": "Tuesday",
      "streakDays": 7
    },
    "recentActivity": [
      {
        "id": "1",
        "type": "task_completed",
        "description": "Completed task: Review project proposal",
        "timestamp": "2024-01-15T08:30:00.000Z"
      }
    ]
  }
}
```

---

## ❌ Error Responses

### Error Format

All error responses follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req-123"
}
```

### HTTP Status Codes

| Status Code | Description | Example |
|-------------|-------------|---------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Authentication required or invalid |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 500 | Internal Server Error | Unexpected server error |

### Common Error Examples

**Validation Error (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid task data",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Not Found Error (404):**
```json
{
  "error": "Not Found",
  "message": "Task not found",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔧 Usage Examples

### Frontend API Integration

```typescript
// Task API client example
import { apiClient } from '@/lib/api'

// Get all tasks
const tasks = await apiClient.getTasks({
  status: 'todo',
  sortBy: 'dueDate',
  sortOrder: 'asc'
})

// Create new task
const newTask = await apiClient.createTask({
  title: 'New Task',
  description: 'Task description',
  priority: 'high',
  dueDate: '2024-01-20T00:00:00.000Z'
})

// Update task
const updatedTask = await apiClient.updateTask('task-id', {
  status: 'completed'
})

// Delete task
await apiClient.deleteTask('task-id')
```

### cURL Examples

**Get Tasks:**
```bash
curl -X GET "https://your-api-url/api/tasks?status=todo" \
  -H "Accept: application/json" \
  -H "x-jwt-assertion: YOUR_JWT_TOKEN"
```

**Create Task:**
```bash
curl -X POST "https://your-api-url/api/tasks" \
  -H "Content-Type: application/json" \
  -H "x-jwt-assertion: YOUR_JWT_TOKEN" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "high"
  }'
```

**Update Task:**
```bash
curl -X PUT "https://your-api-url/api/tasks/task-id" \
  -H "Content-Type: application/json" \
  -H "x-jwt-assertion: YOUR_JWT_TOKEN" \
  -d '{
    "status": "completed"
  }'
```

---

## 📊 Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Rate Limit**: 1000 requests per hour per user
- **Burst Limit**: 100 requests per minute per user
- **Headers**: Rate limit information included in response headers

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

---

## 🔍 Monitoring and Observability

### Health Monitoring

The API provides multiple health check endpoints for monitoring:

- `/health` - Basic health status
- `/health/detailed` - Comprehensive health information
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

### Logging

The API implements structured logging with different levels:

- **Error**: Critical errors and exceptions
- **Warn**: Warning conditions
- **Info**: General information
- **Debug**: Detailed debugging information

### Metrics

Key metrics exposed for monitoring:

- Request count and response times
- Error rates by endpoint
- Authentication success/failure rates
- Task creation and completion rates

---

## 🛠️ Development and Testing

### Local Development

```bash
# Start the API server
cd backend
npm install
npm run dev

# API will be available at http://localhost:8080
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:8080/health

# Test with mock authentication (development mode)
curl -X GET http://localhost:8080/api/tasks \
  -H "Content-Type: application/json"
```

### Environment Variables

```bash
NODE_ENV=development
PORT=8080
LOG_LEVEL=debug
CORS_ORIGIN=*
```

---

This API documentation provides a comprehensive guide for integrating with the Task Management API. For additional support or questions, please refer to the project repository or contact the development team.
