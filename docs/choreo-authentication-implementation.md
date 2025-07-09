# Choreo Managed Authentication Implementation Guide

This document details how our application implements Choreo's managed authentication system, following the official guide and best practices.

## 🔐 Overview

Our implementation follows the [Choreo Managed Authentication Guide](https://medium.com/choreo-tech-blog/secure-your-react-spas-with-choreo-managed-authentication-8b7d2d45147b) and implements all recommended patterns:

- **Backend for Frontend (BFF) Architecture**: Secure token handling on the server side
- **Cookie-based Session Management**: Automatic session handling with secure cookies
- **JWT Assertion Processing**: Backend receives user info via `x-jwt-assertion` header
- **Proper Login/Logout Flow**: Standard OIDC/OAuth2.0 endpoints

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │  Choreo Gateway │    │  Backend API    │
│                 │    │                 │    │                 │
│ 1. /auth/login  │───▶│ 2. OIDC Flow    │    │                 │
│ 3. userinfo     │◀───│ 4. Set Cookies  │    │                 │
│    cookie       │    │                 │    │                 │
│ 5. API calls    │───▶│ 6. Add JWT      │───▶│ 7. Extract user │
│    with cookies │    │    assertion    │    │    from header  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Implementation Details

### Frontend Implementation

#### 1. Authentication Service (`frontend/src/lib/auth.ts`)

**Key Features:**
- Singleton pattern for consistent state management
- Configuration constants for all auth endpoints
- Enhanced error handling and logging
- Automatic cookie cleanup
- Session validation and fallback mechanisms

**Core Methods:**

```typescript
// Login with optional redirect and authentication options
login(redirectPath?: string, options?: { 
  forceReauth?: boolean 
  prompt?: 'none' | 'login' | 'consent' | 'select_account'
}): void

// Logout with optional post-logout redirect
logout(postLogoutPath?: string): void

// Get user info from userinfo cookie (post-login)
getUserInfoFromCookie(): User | null

// Check auth status via /auth/userinfo endpoint
checkAuthStatus(): Promise<{ isAuthenticated: boolean; user: User | null }>
```

#### 2. Authentication Hook (`frontend/src/hooks/useAuth.ts`)

Provides React components with:
- Authentication state management
- User information access
- Login/logout actions
- Automatic auth status checking

#### 3. API Client (`frontend/src/lib/api.ts`)

**Features:**
- Automatic cookie inclusion (`credentials: 'include'`)
- 401 error handling with automatic re-authentication
- Uses `/choreo-apis/` prefix for API calls
- Comprehensive error handling

### Backend Implementation

#### 1. Authentication Middleware (`backend/src/middleware/auth.js`)

**Key Features:**
- Extracts user info from `x-jwt-assertion` header
- Validates JWT structure (already validated by Choreo)
- Provides fallback for development environment
- Comprehensive error handling

**User Context:**
```javascript
req.user = {
  sub: decoded.sub,                    // User ID
  email: decoded.email,                // Email address
  name: decoded.name,                  // Full name
  preferred_username: decoded.preferred_username,
  groups: decoded.groups || [],        // User groups
  roles: decoded.roles || []           // User roles
}
```

#### 2. OpenAPI Specification (`backend/openapi.yaml`)

**Enhanced Features:**
- Security schemes documentation
- Comprehensive schema definitions
- Proper authentication requirements
- Tagged endpoints for better organization
- Detailed error responses

## 🔧 Configuration

### Frontend Configuration

```typescript
const AUTH_CONFIG = {
  LOGIN_ENDPOINT: '/auth/login',
  LOGOUT_ENDPOINT: '/auth/logout',
  USERINFO_ENDPOINT: '/auth/userinfo',
  USERINFO_COOKIE: 'userinfo',
  SESSION_HINT_COOKIE: 'session_hint',
  DEFAULT_POST_LOGIN_PATH: '/dashboard',
  DEFAULT_POST_LOGOUT_PATH: '/',
  COOKIE_PATH: '/',
  SESSION_STORAGE_KEY: 'user',
  LAST_LOGIN_KEY: 'lastLogin'
}
```

### Backend Configuration

```javascript
// CORS configuration for Choreo
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-jwt-assertion']
}))
```

## 🚀 Deployment Configuration

### Choreo Managed Authentication Settings

When deploying to Choreo, configure:

1. **Enable Managed Authentication**: Toggle on during deployment
2. **Post Login Path**: `/dashboard` (or your preferred landing page)
3. **Post Logout Path**: `/` (or your preferred logout landing page)
4. **Identity Provider**: Configure external IdP for production

### Environment Variables

```bash
# Frontend
NEXT_PUBLIC_API_BASE_URL=/choreo-apis
NEXT_PUBLIC_APP_NAME="Task Management"

# Backend
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.choreoapis.dev
LOG_LEVEL=info
```

## 🔍 Authentication Flow

### 1. User Login
```
User clicks Login → Redirect to /auth/login → Choreo OIDC flow → 
Set cookies → Redirect to /dashboard → Parse userinfo cookie
```

### 2. API Calls
```
Frontend API call → Include cookies → Choreo adds x-jwt-assertion → 
Backend extracts user → Process request
```

### 3. Session Validation
```
Check userinfo cookie → If not found, call /auth/userinfo → 
If 401, redirect to login → If 200, update user state
```

### 4. User Logout
```
User clicks Logout → Clear local state → Redirect to /auth/logout → 
Choreo clears session → Redirect to home page
```

## 🛡️ Security Features

### Frontend Security
- **XSS Protection**: No tokens stored in localStorage/sessionStorage
- **CSRF Protection**: Cookie-based authentication with SameSite attributes
- **Secure Cookie Handling**: Automatic cleanup after reading userinfo cookie
- **Session Validation**: Regular auth status checks with fallback mechanisms

### Backend Security
- **JWT Validation**: Choreo pre-validates all JWTs
- **Header Extraction**: Secure user context from trusted headers
- **CORS Configuration**: Proper cross-origin settings
- **Error Handling**: No sensitive information in error responses

## 📊 Monitoring and Debugging

### Logging
- Frontend: Console logs with 🔐 prefix for auth operations
- Backend: Structured logging with user context
- Development: Enhanced debug information

### Error Handling
- Network failures: Graceful fallback to stored user data
- Invalid tokens: Automatic re-authentication
- Session expiry: Transparent login redirect
- Cookie corruption: Automatic cleanup and re-auth

## 🧪 Testing

### Development Mode
- Fallback authentication for local development
- Mock user data when Choreo headers are missing
- Enhanced logging for debugging

### Production Validation
- Health check endpoints for monitoring
- User permissions endpoint for role validation
- Comprehensive error responses for troubleshooting

## 📚 References

- [Choreo Managed Authentication Guide](https://medium.com/choreo-tech-blog/secure-your-react-spas-with-choreo-managed-authentication-8b7d2d45147b)
- [Choreo Documentation](https://wso2.com/choreo/docs/)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [OIDC Core Specification](https://openid.net/specs/openid-connect-core-1_0.html)
