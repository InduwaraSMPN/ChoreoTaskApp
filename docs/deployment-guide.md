# Choreo Full-Stack Deployment Guide

This guide provides step-by-step instructions for deploying the Task Management full-stack application on WSO2 Choreo platform.

## 📋 Prerequisites

Before starting the deployment process, ensure you have:

1. **WSO2 Choreo Account**: Sign up at [console.choreo.dev](https://console.choreo.dev)
2. **GitHub Account**: For hosting your source code
3. **GitHub Repository**: Fork or create a repository with the application code
4. **Repository Structure**: Ensure your repository has the following structure:
   ```
   your-repo/
   ├── backend/          # Node.js service code
   ├── frontend/         # Next.js web application code
   ├── docs/            # Documentation
   └── README.md        # Project documentation
   ```

## 🚀 Deployment Overview

The deployment process involves:
1. **Deploy Backend Service** - Node.js API service
2. **Deploy Frontend Web App** - Next.js web application
3. **Create Connection** - Link frontend to backend
4. **Configure Authentication** - Set up managed authentication
5. **Test Integration** - Verify end-to-end functionality

---

## Part 1: Deploy Backend Service

### Step 1.1: Create Service Component

1. **Access Choreo Console**
   - Go to [console.choreo.dev](https://console.choreo.dev)
   - Sign in with your credentials
   - Select your organization

2. **Create New Component**
   - Click **+ Create** button
   - Select **Service** card
   - Choose **Build and Deploy from Source Code**

3. **Connect GitHub Repository**
   - Click **Authorize with GitHub**
   - Grant necessary permissions to Choreo GitHub App
   - Select your repository from the list
   - Or use **Use Public GitHub Repository** option with repository URL

### Step 1.2: Configure Service Settings

1. **Repository Configuration**
   - **GitHub Account**: Your GitHub username/organization
   - **GitHub Repository**: Your repository name
   - **Branch**: `main` (or your default branch)
   - **Component Directory**: `/backend`

2. **Buildpack Configuration**
   - **Buildpack**: Select **Node.js**
   - **Language Version**: `20.x`
   - **Build Command**: `npm install` (default)
   - **Start Command**: `npm start` (default)

3. **Component Details**
   - **Component Display Name**: `Task Management API`
   - **Component Name**: `task-management-api` (must be unique)
   - **Description**: `RESTful API service for task management with user authentication`

4. **Click Create**

### Step 1.3: Build Backend Service

1. **Navigate to Build Section**
   - Go to the **Build** tab in your component
   - Click **Build Latest**

2. **Monitor Build Process**
   - Watch the build logs for any errors
   - Ensure all dependencies are installed correctly
   - Verify the build completes successfully

3. **Build Validation**
   - Check for **Dockerfile Scan** results
   - Review **Container Vulnerability Scan** results
   - Address any critical issues if found

### Step 1.4: Deploy Backend Service

1. **Navigate to Deploy Section**
   - Go to the **Deploy** tab
   - Click **Configure & Deploy**

2. **Environment Configuration**
   - Review default environment variables
   - Add any additional configurations if needed
   - Click **Next**

3. **File Mount Configuration**
   - Skip file mount configuration for this example
   - Click **Next**

4. **Review Endpoint Details**
   - Verify the endpoint configuration
   - Ensure port 3001 is configured
   - Check health check endpoint `/health`
   - Click **Deploy**

5. **Monitor Deployment**
   - Wait for deployment to complete
   - Verify **Deployment Status** shows as **Active**
   - Note the service endpoint URL for later use

---

## Part 2: Deploy Frontend Web Application

### Step 2.1: Create Web Application Component

1. **Create New Component**
   - In the same project, click **+ Create**
   - Select **Web Application** card
   - Choose **Build and Deploy from Source Code**

2. **Connect Same Repository**
   - Use the same GitHub repository
   - Or authorize again if needed

### Step 2.2: Configure Web App Settings

1. **Repository Configuration**
   - **GitHub Account**: Your GitHub username/organization
   - **GitHub Repository**: Same repository as backend
   - **Branch**: `main`
   - **Component Directory**: `/frontend`

2. **Buildpack Configuration**
   - **Buildpack**: Select **React** (works for Next.js)
   - **Build Command**: `npm run build`
   - **Build Path**: `out`
   - **Node Version**: `18`

3. **Component Details**
   - **Component Display Name**: `Task Management Web`
   - **Component Name**: `task-management-web` (must be unique)
   - **Description**: `Modern Next.js web application for task management with Choreo managed authentication`

4. **Click Create**

### Step 2.3: Build Frontend Application

1. **Navigate to Build Section**
   - Go to the **Build** tab
   - Click **Build Latest**

2. **Monitor Build Process**
   - Watch for Next.js build completion
   - Verify static export generation
   - Check for any build errors

### Step 2.4: Deploy Frontend Application

1. **Navigate to Deploy Section**
   - Go to the **Deploy** tab
   - Click **Configure & Deploy**

2. **Environment Configuration**
   - Review environment variables
   - Ensure `NEXT_PUBLIC_API_BASE_URL` is set to `/choreo-apis`
   - Click **Next**

3. **Authentication Settings**
   - **Enable Managed Authentication**: ✅ Checked
   - **Post Login Path**: `/dashboard`
   - **Post Logout Path**: `/`
   - **Error Path**: `/auth/error`
   - **Session Expiry Time**: `10080` (7 days in minutes)
   - **Additional Scopes**: Leave empty for default
   - Click **Deploy**
   demo
   qP#bJZ96

4. **Monitor Deployment**
   - Wait for deployment to complete
   - Verify **Deployment Status** shows as **Active**
   - Note the web application URL

---

## Part 3: Create Connection Between Components

### Step 3.1: Navigate to Connections

1. **Access Frontend Component**
   - Go to your frontend web application component
   - Click on **Connections** in the left navigation

2. **Create New Connection**
   - Click **+ Create** button
   - This opens the Marketplace view

### Step 3.2: Configure Service Connection

1. **Select Backend Service**
   - Click on the **Services** tab
   - Find your `Task Management API` service
   - Click on the service card

2. **Connection Configuration**
   - **Connection Name**: `task-api-connection`
   - **Description**: `Connection to Task Management API`
   - **Access Mode**: Select appropriate mode (usually **Project**)
   - **Authentication Scheme**: Select **None** (auth handled by Choreo)

3. **Create Connection**
   - Click **Create**
   - Note the connection details and service URL format

---

## Part 4: Configure Authentication

### Step 4.1: Backend Authentication Setup

1. **Navigate to Backend Settings**
   - Go to your backend service component
   - Click **Settings** → **Authentication Keys**

2. **Generate Authentication Keys**
   - Select **Development** environment
   - Choose **Choreo Built-In Identity Provider**
   - Click **Generate Secret**
   - Note the generated credentials

### Step 4.2: Frontend Authentication Setup

1. **Navigate to Frontend Settings**
   - Go to your frontend web application component
   - Click **Settings** → **Authentication Keys**

2. **Configure Identity Provider**
   - Select **Development** environment
   - Choose **Choreo Built-In Identity Provider**
   - Click **Generate Secret**
   - Verify authentication is properly configured

### Step 4.3: Test User Setup (Optional)

1. **Create Test Users**
   - Go to **Organization Settings** → **User Management**
   - Add test users for development
   - Assign appropriate roles and groups

---

## Part 5: Test the Deployment

### Step 5.1: Access the Application

1. **Open Web Application**
   - Go to your frontend component
   - Click the **Web App URL** in the deployment card
   - This should open the application home page

2. **Test Authentication**
   - Click **Get Started** or **Launch Application**
   - You should be redirected to Choreo's login page
   - Sign in with your Choreo credentials

3. **Verify Dashboard Access**
   - After login, you should be redirected to `/dashboard`
   - Verify user profile appears in the header
   - Check that the dashboard loads without errors

### Step 5.2: Test API Integration

1. **Create a Task**
   - Click **New Task** button
   - Fill in task details
   - Submit the form
   - Verify the task appears in the list

2. **Test CRUD Operations**
   - Edit an existing task
   - Mark tasks as complete
   - Delete a task
   - Verify all operations work correctly

3. **Test Filtering and Search**
   - Use the filter options
   - Try the search functionality
   - Verify results update correctly

### Step 5.3: Test Authentication Flow

1. **Test Logout**
   - Click on user profile dropdown
   - Select **Sign Out**
   - Verify you're redirected to the home page

2. **Test Session Persistence**
   - Log in again
   - Refresh the page
   - Verify you remain logged in

3. **Test Protected Routes**
   - Try accessing `/dashboard` without authentication
   - Verify you're redirected to login

---

## 🔧 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```
   Issue: Build fails with dependency errors
   Solution: 
   - Check package.json for correct dependencies
   - Verify Node.js version compatibility
   - Review build logs for specific errors
   ```

2. **Authentication Issues**
   ```
   Issue: Login redirects fail
   Solution:
   - Verify managed authentication is enabled
   - Check authentication paths configuration
   - Ensure identity provider is properly configured
   ```

3. **API Connection Issues**
   ```
   Issue: Frontend can't connect to backend
   Solution:
   - Verify connection is created between components
   - Check API base URL configuration
   - Review CORS settings in backend
   ```

4. **Static Export Issues**
   ```
   Issue: Next.js build fails during export
   Solution:
   - Ensure output: 'export' is set in next.config.js
   - Verify no server-side only features are used
   - Check image optimization is disabled
   ```

### Health Check Verification

1. **Backend Health Check**
   ```bash
   curl https://your-backend-url/health
   ```
   Should return 200 status with health information

2. **Frontend Accessibility**
   ```bash
   curl https://your-frontend-url/
   ```
   Should return 200 status with HTML content

### Log Analysis

1. **Backend Logs**
   - Go to backend component → **Observability** → **Logs**
   - Check for authentication and API errors
   - Monitor request/response patterns

2. **Frontend Logs**
   - Go to frontend component → **Observability** → **Logs**
   - Check for build and runtime errors
   - Monitor authentication flow logs

---

## 🎯 Production Deployment

### Environment Promotion

1. **Promote Backend to Production**
   - Go to backend component
   - Click **Promote** from Development to Production
   - Configure production environment variables
   - Deploy to production

2. **Promote Frontend to Production**
   - Go to frontend component
   - Click **Promote** from Development to Production
   - Update authentication settings for production
   - Deploy to production

3. **Update Connections**
   - Ensure connections work in production environment
   - Update any environment-specific configurations

### Production Considerations

1. **Security**
   - Review and update CORS settings
   - Configure proper authentication scopes
   - Enable security headers

2. **Performance**
   - Monitor application performance
   - Set up alerts for critical metrics
   - Configure auto-scaling if needed

3. **Monitoring**
   - Set up comprehensive logging
   - Configure health check alerts
   - Monitor user authentication flows

---

## 📚 Next Steps

After successful deployment:

1. **Custom Domain** (Optional)
   - Configure custom domain for your organization
   - Update DNS settings
   - Configure SSL certificates

2. **Advanced Authentication**
   - Integrate with external identity providers
   - Configure role-based access control
   - Set up user groups and permissions

3. **Database Integration**
   - Add Choreo-managed database
   - Update backend to use persistent storage
   - Configure database connections

4. **Monitoring and Analytics**
   - Set up application monitoring
   - Configure usage analytics
   - Create custom dashboards

5. **CI/CD Enhancement**
   - Set up automated testing
   - Configure deployment pipelines
   - Enable auto-deployment on code changes

---

## 🆘 Support

If you encounter issues during deployment:

1. **Documentation**: Review [Choreo Documentation](https://wso2.com/choreo/docs/)
2. **Community**: Join [Choreo Discord](https://discord.com/invite/wso2)
3. **Support**: Contact WSO2 support team
4. **GitHub Issues**: Report issues in the sample repository

---

**Congratulations!** 🎉 You have successfully deployed a full-stack application on WSO2 Choreo platform.
