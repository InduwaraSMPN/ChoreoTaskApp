# Task Management API - Backend Service

A Node.js Express API service designed for deployment on WSO2 Choreo as a Service component. This backend provides RESTful endpoints for task management with integrated user authentication.

## 🏗️ Architecture

This service demonstrates Choreo Service component best practices:

- **Express.js Framework**: Lightweight and flexible web framework
- **Choreo Authentication Integration**: Seamless user context handling
- **OpenAPI Specification**: Complete API documentation and validation
- **Health Monitoring**: Built-in health checks for Choreo monitoring
- **Error Handling**: Comprehensive error handling and logging

## 📁 Project Structure

```
backend/
├── .choreo/
│   └── component.yaml          # Choreo service configuration
├── src/
│   ├── app.js                  # Main Express application
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   └── errorHandler.js    # Global error handling
│   └── routes/
│       ├── health.js          # Health check endpoints
│       ├── tasks.js           # Task CRUD operations
│       └── user.js            # User profile endpoints
├── openapi.yaml               # API specification
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🚀 API Endpoints

### Health Endpoints
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health information
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Task Management (Protected)
- `GET /api/tasks` - Get user's tasks (with filtering and sorting)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### User Management (Protected)
- `GET /api/user/profile` - Get user profile
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update user preferences
- `GET /api/user/activity` - Get user activity summary
- `GET /api/user/permissions` - Get user permissions

## 🔐 Authentication

This service integrates with Choreo's managed authentication system:

### How It Works
1. **Choreo Gateway**: Handles OIDC/OAuth2 authentication flow
2. **JWT Assertion**: User information passed via `x-jwt-assertion` header
3. **Auth Middleware**: Extracts and validates user context
4. **User Context**: Available in `req.user` for all protected routes

### User Object Structure
```javascript
req.user = {
  sub: "user-unique-id",
  email: "user@example.com", 
  name: "User Name",
  preferred_username: "username",
  groups: ["group1", "group2"],
  roles: ["role1", "role2"]
}
```

## 🛠️ Local Development

### Prerequisites
- Node.js 20.17.0+ installed
- npm 10+ or yarn package manager

### Setup
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the API**
   - API Base URL: http://localhost:3001
   - Health Check: http://localhost:3001/health
   - API Documentation: View `openapi.yaml` in Swagger Editor

### Development Scripts
```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm test             # Run tests
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
```

### Environment Variables
```bash
NODE_ENV=development        # Environment mode
PORT=3001                  # Server port
LOG_LEVEL=debug            # Logging level
CORS_ORIGIN=*              # CORS origin (use specific domains in production)
```

## 🚀 Choreo Deployment

### Step 1: Prepare Repository
1. Ensure your code is in a GitHub repository
2. The backend code should be in a `/backend` directory
3. Commit all changes and push to GitHub

### Step 2: Create Service Component
1. Go to Choreo Console
2. Click **+ Create** → **Service**
3. Connect your GitHub repository
4. Set **Component Directory** to `/backend`
5. Select **Node.js** buildpack
6. Set **Language Version** to `20.x`

### Step 3: Configure Component
The `.choreo/component.yaml` file contains all necessary configuration:
- Service port: 3001
- Health check endpoint: `/health`
- OpenAPI specification: `openapi.yaml`
- Environment-specific settings

### Step 4: Build and Deploy
1. Click **Build Latest** in the Build section
2. Once build succeeds, go to **Deploy** section
3. Click **Configure & Deploy**
4. Review settings and click **Deploy**

### Step 5: Test Deployment
1. Check health endpoint: `https://your-service-url/health`
2. Verify API endpoints are accessible
3. Test authentication integration

## 🔧 Configuration

### Choreo Component Configuration
The `.choreo/component.yaml` file configures:
- **Build Settings**: Node.js buildpack, version, commands
- **Endpoints**: REST API on port 3001 with OpenAPI spec
- **Health Checks**: Monitoring configuration
- **Resources**: Memory and CPU limits
- **Environment Variables**: Per-environment configuration

### CORS Configuration
The service is configured to work with Choreo's architecture:
- Development: Allows all origins (`*`)
- Production: Restricts to Choreo domains (`*.choreoapps.dev`)

## 📊 Monitoring and Observability

### Health Checks
- **Basic Health**: Service status and uptime
- **Detailed Health**: System metrics and dependencies
- **Readiness Probe**: Service ready to handle requests
- **Liveness Probe**: Service is alive and responsive

### Logging
- Structured logging with timestamps
- Request/response logging via Morgan
- Error logging with stack traces
- User action logging for debugging

### Metrics
The service exposes metrics for monitoring:
- Memory usage
- CPU usage
- Request counts
- Response times
- Error rates

## 🧪 Testing

### Manual Testing
1. **Health Check**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Create Task** (requires auth in production)
   ```bash
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title": "Test Task", "description": "Test Description"}'
   ```

3. **Get Tasks**
   ```bash
   curl http://localhost:3001/api/tasks
   ```

### Automated Testing
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Choreo managed auth is enabled
   - Check `x-jwt-assertion` header is present
   - Ensure user context is properly extracted

2. **CORS Issues**
   - Verify CORS_ORIGIN environment variable
   - Check frontend domain is allowed
   - Ensure credentials are included in requests

3. **Health Check Failures**
   - Verify service is running on correct port
   - Check health endpoint returns 200 status
   - Review health check configuration

4. **Build Failures**
   - Verify Node.js version compatibility
   - Check all dependencies are listed in package.json
   - Review build logs for specific errors

### Debug Mode
Enable debug logging:
```bash
LOG_LEVEL=debug npm run dev
```

## 📚 API Documentation

The complete API documentation is available in the `openapi.yaml` file. You can:

1. **View in Swagger Editor**: Copy the content to https://editor.swagger.io/
2. **Generate Client SDKs**: Use OpenAPI generators for various languages
3. **Import to Postman**: Import the OpenAPI spec for testing

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add tests for new functionality
3. Update OpenAPI specification for API changes
4. Ensure proper error handling and logging
5. Test with Choreo authentication integration

## 📄 License

This project is licensed under the Apache 2.0 License.
