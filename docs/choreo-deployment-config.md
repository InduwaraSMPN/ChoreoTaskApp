# Choreo Deployment Configuration

This document provides step-by-step instructions for deploying the application with Choreo managed authentication.

## 🚀 Backend Service Deployment

### 1. Create Service Component

1. **Login to Choreo Console**
   - Navigate to [Choreo Console](https://console.choreo.dev/)
   - Select your organization

2. **Create New Component**
   - Click "Create" → "Service"
   - Choose "GitHub" as source
   - Connect your repository
   - Set component directory: `/backend`
   - Select "Node.js" buildpack

3. **Build Configuration**
   ```yaml
   # Choreo will auto-detect these from package.json
   Build Command: npm install
   Start Command: npm start
   Port: 8080
   ```

4. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=8080
   CORS_ORIGIN=https://your-frontend-url.choreoapis.dev
   LOG_LEVEL=info
   ```

5. **Deploy**
   - Click "Build" to create the first build
   - Once successful, click "Deploy" to deploy to Development environment
   - Note the API URL for frontend configuration

### 2. API Endpoint Configuration

Your backend will be available at:
```
https://{uuid}-dev.{region}.choreoapis.dev/{org-name}/{component-name}/v1.0
```

Example:
```
https://3fe77b4a-67f5-4460-a8e9-1140da68d971-dev.e1-us-east-azure.choreoapis.dev/task-management/backend-service/v1.0
```

## 🌐 Frontend Application Deployment

### 1. Create Web Application Component

1. **Create New Component**
   - Click "Create" → "Web Application"
   - Choose "GitHub" as source
   - Connect your repository
   - Set component directory: `/frontend`
   - Select "Node.js" buildpack

2. **Build Configuration**
   ```yaml
   Build Command: npm run build
   Start Command: npm start
   Port: 3000
   ```

3. **Environment Variables**
   ```bash
   NEXT_PUBLIC_API_BASE_URL=/choreo-apis
   NEXT_PUBLIC_APP_NAME=Task Management
   NODE_ENV=production
   ```

### 2. Enable Managed Authentication

1. **Navigate to Deploy Section**
   - Go to your web application component
   - Click "Deploy" in the left navigation

2. **Configure & Deploy**
   - Click "Configure & Deploy" in the Set Up card

3. **Add Configuration**
   ```javascript
   // Add this to the configuration section
   window.configs = {
     apiUrl: '/choreo-apis/{org-name}/{backend-component-name}/v1.0',
     appName: 'Task Management',
     version: '1.0.0'
   };
   ```

4. **Enable Managed Authentication**
   - Toggle "Managed Authentication with Choreo" to **ON**
   - Configure the following settings:

   ```
   Post Login Path: /dashboard
   Post Logout Path: /
   ```

5. **Identity Provider Setup**
   - For development: Use Choreo's built-in IdP
   - For production: Configure external IdP (see below)

6. **Create Test Users** (Development Only)
   - Click "Create" under "Manage Users"
   - Add test users with email and password
   - Note credentials for testing

7. **Deploy**
   - Click "Deploy" to deploy with managed authentication
   - Note the Web App URL for testing

## 🔗 Create Connection

### 1. Connect Frontend to Backend

1. **Navigate to Dependencies**
   - Go to your frontend component
   - Click "Dependencies" in the left navigation

2. **Add Connection**
   - Click "Add Connection"
   - Select your backend service component
   - Choose the appropriate environment (Development)
   - Click "Add"

3. **Verify Connection**
   - The connection should appear in the dependencies list
   - This enables the `/choreo-apis/` prefix for API calls

## 🔐 Identity Provider Configuration (Production)

### Option 1: Asgardeo (Recommended)

1. **Create Asgardeo Application**
   - Login to [Asgardeo Console](https://console.asgardeo.io/)
   - Create new "Single Page Application"
   - Configure redirect URLs:
     ```
     Authorized Redirect URLs: https://your-app-url.choreoapis.dev/auth/callback
     Logout URLs: https://your-app-url.choreoapis.dev/
     ```

2. **Configure in Choreo**
   - Go to Settings → Authentication Keys
   - Select your environment
   - Choose "Asgardeo" as Identity Provider
   - Enter Client ID and Client Secret
   - Click "Add Keys"

### Option 2: Azure Active Directory

1. **Register Application in Azure AD**
   - Go to Azure Portal → Azure Active Directory → App registrations
   - Click "New registration"
   - Configure:
     ```
     Name: Task Management App
     Redirect URI: https://your-app-url.choreoapis.dev/auth/callback
     ```

2. **Configure in Choreo**
   - Go to Settings → Authentication Keys
   - Select your environment
   - Choose "Azure AD" as Identity Provider
   - Enter Application (client) ID and Client Secret
   - Click "Add Keys"

## 🧪 Testing the Deployment

### 1. Access the Application

1. **Get Web App URL**
   - Go to your frontend component
   - Copy the "Web App URL" from the Development environment card

2. **Test Authentication Flow**
   - Open the Web App URL
   - Click "Login" or navigate to `/dashboard`
   - Should redirect to Choreo login page
   - Login with test user credentials
   - Should redirect back to `/dashboard`

### 2. Test API Integration

1. **Verify API Calls**
   - Open browser developer tools
   - Navigate to Network tab
   - Perform actions that make API calls (create task, get profile)
   - Verify requests go to `/choreo-apis/` endpoints
   - Check for proper authentication headers

2. **Test Logout**
   - Click logout button
   - Should clear session and redirect to home page
   - Verify subsequent API calls return 401

## 🔧 Configuration Updates

### Update Authentication Settings

If you need to change authentication settings after deployment:

1. **Navigate to Authentication Settings**
   - Go to your frontend component
   - Click "Authentication Settings" on the Set Up card

2. **Modify Settings**
   - Update Post Login Path, Post Logout Path, or IdP settings
   - Click "Save"

3. **Redeploy**
   - Click "Deploy" to apply changes

### Update Environment Variables

1. **Go to Component Settings**
   - Navigate to your component
   - Click "Settings" → "Environment Variables"

2. **Update Variables**
   - Modify existing variables or add new ones
   - Click "Save"

3. **Redeploy**
   - Trigger a new deployment to apply changes

## 📊 Monitoring and Troubleshooting

### 1. Check Logs

1. **Backend Logs**
   - Go to backend component → "Observability" → "Logs"
   - Filter by log level and time range
   - Look for authentication-related errors

2. **Frontend Logs**
   - Go to frontend component → "Observability" → "Logs"
   - Check for build and runtime errors

### 2. Common Issues

**Authentication Redirect Loop**
- Check Post Login Path configuration
- Verify frontend routing matches configured paths
- Ensure IdP redirect URLs are correct

**API 401 Errors**
- Verify connection between frontend and backend
- Check CORS configuration in backend
- Ensure managed authentication is enabled

**Build Failures**
- Check environment variables
- Verify Node.js version compatibility
- Review build logs for specific errors

### 3. Health Checks

Use these endpoints to verify deployment:

```bash
# Backend health check
curl https://your-backend-url.choreoapis.dev/health

# Backend root endpoint
curl https://your-backend-url.choreoapis.dev/

# Frontend (should return HTML)
curl https://your-frontend-url.choreoapis.dev/
```

## 📚 Additional Resources

- [Choreo Documentation](https://wso2.com/choreo/docs/)
- [Choreo Managed Authentication Guide](https://medium.com/choreo-tech-blog/secure-your-react-spas-with-choreo-managed-authentication-8b7d2d45147b)
- [Asgardeo Documentation](https://wso2.com/asgardeo/docs/)
- [Azure AD App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
