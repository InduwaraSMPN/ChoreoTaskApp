# Task Management Web Application - Frontend

A modern Next.js web application designed for deployment on WSO2 Choreo as a Web Application component. This frontend provides an intuitive interface for task management with integrated user authentication.

## 🏗️ Architecture

This web application demonstrates Choreo Web Application component best practices:

- **Next.js 14 with App Router**: Modern React framework with file-based routing
- **TypeScript**: Type-safe development with excellent IDE support
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Choreo Managed Authentication**: Seamless authentication integration
- **Responsive Design**: Mobile-first approach with modern UI patterns

## 📁 Project Structure

```
frontend/
├── .choreo/
│   └── component.yaml          # Choreo web app configuration
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css        # Global styles and Tailwind
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx           # Home page
│   │   ├── dashboard/         # Dashboard pages (protected)
│   │   └── auth/              # Authentication pages
│   ├── components/            # Reusable React components
│   │   ├── TaskList.tsx       # Task list with CRUD operations
│   │   ├── TaskForm.tsx       # Task creation/editing form
│   │   ├── FilterBar.tsx      # Task filtering and sorting
│   │   ├── UserProfile.tsx    # User profile dropdown
│   │   └── ...               # Other UI components
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # Authentication service
│   │   └── api.ts            # API client for backend communication
│   └── types/                 # TypeScript type definitions
│       └── index.ts          # Shared types and interfaces
├── package.json               # Dependencies and scripts
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## ✨ Features

### User Interface
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme Ready**: Prepared for theme switching
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Real-time Updates**: Optimistic UI updates with error handling
- **Filtering & Sorting**: Advanced filtering by status, priority, and date
- **Search Functionality**: Full-text search across task titles and descriptions
- **Task Statistics**: Visual dashboard with task counts and progress

### Authentication Integration
- **Choreo Managed Auth**: Seamless integration with Choreo's authentication system
- **Session Management**: Automatic session handling and expiry detection
- **User Profile**: Display user information and roles
- **Protected Routes**: Automatic redirection for unauthenticated users

## 🔐 Authentication Flow

This application integrates with Choreo's managed authentication:

### Login Process
1. User clicks "Login" button
2. Redirects to `/auth/login` (handled by Choreo)
3. Choreo manages OIDC/OAuth2 flow
4. User redirected back to `/dashboard` after successful login
5. User info extracted from `userinfo` cookie
6. Session established for API calls

### Session Management
- **Cookie-based**: Uses secure cookies set by Choreo
- **Automatic Refresh**: Handles token refresh transparently
- **Expiry Handling**: Detects 401 responses and triggers re-login
- **Logout**: Clears session and redirects to logout endpoint

### User Context
```typescript
interface User {
  id: string
  email: string
  name: string
  username: string
  groups?: string[]
  roles?: string[]
}
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend service running (see backend README)

### Setup
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_BASE_URL=/choreo-apis
   NEXT_PUBLIC_APP_NAME=Task Management
   NEXT_PUBLIC_DEBUG=true
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard

### Development Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code with ESLint
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking
```

### Environment Variables
```bash
NEXT_PUBLIC_API_BASE_URL=/choreo-apis    # API base URL (relative for Choreo)
NEXT_PUBLIC_APP_NAME=Task Management     # Application name
NEXT_PUBLIC_DEBUG=false                  # Debug mode flag
```

## 🚀 Choreo Deployment

### Step 1: Prepare Repository
1. Ensure your code is in a GitHub repository
2. The frontend code should be in a `/frontend` directory
3. Commit all changes and push to GitHub

### Step 2: Create Web Application Component
1. Go to Choreo Console
2. Click **+ Create** → **Web Application**
3. Connect your GitHub repository
4. Set **Component Directory** to `/frontend`
5. Select **React** buildpack (works for Next.js)
6. Set **Node Version** to `18`

### Step 3: Configure Build Settings
The `.choreo/component.yaml` file contains all necessary configuration:
- Build command: `npm run build`
- Build output: `out` directory (static export)
- Managed authentication: Enabled
- Environment variables: Per-environment settings

### Step 4: Enable Managed Authentication
1. During deployment, ensure **Managed Authentication** is enabled
2. Configure authentication paths:
   - **Post Login Path**: `/dashboard`
   - **Post Logout Path**: `/`
   - **Error Path**: `/auth/error`
   - **Session Expiry**: 10080 minutes (7 days)

### Step 5: Build and Deploy
1. Click **Build Latest** in the Build section
2. Once build succeeds, go to **Deploy** section
3. Click **Configure & Deploy**
4. Review authentication settings
5. Click **Deploy**

### Step 6: Create Connection to Backend
1. In the web application component, go to **Connections**
2. Click **+ Create**
3. Select your backend service
4. Configure connection settings
5. This enables `/choreo-apis/` API calls

## 🔧 Configuration

### Next.js Configuration
The `next.config.js` file is configured for Choreo deployment:
- **Static Export**: Generates static files for hosting
- **Image Optimization**: Disabled for static export
- **API Rewrites**: Proxies API calls in development
- **Security Headers**: Adds security headers for production

### Tailwind CSS
Custom design system with:
- **Color Palette**: Primary, secondary, success, warning, danger colors
- **Typography**: Inter font with proper font weights
- **Components**: Pre-built component classes
- **Animations**: Smooth transitions and micro-interactions

### TypeScript
Strict TypeScript configuration with:
- **Path Mapping**: Clean imports with `@/` prefix
- **Type Safety**: Comprehensive type definitions
- **IDE Support**: Excellent autocomplete and error detection

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Test login/logout functionality
   - Verify session persistence
   - Check protected route access

2. **Task Management**
   - Create, edit, delete tasks
   - Test filtering and sorting
   - Verify search functionality

3. **Responsive Design**
   - Test on different screen sizes
   - Verify mobile navigation
   - Check touch interactions

### Automated Testing (Future Enhancement)
```bash
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:coverage     # Generate coverage report
```

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify managed authentication is enabled in Choreo
   - Check authentication paths configuration
   - Ensure cookies are enabled in browser

2. **API Connection Issues**
   - Verify connection to backend service is created
   - Check API base URL configuration
   - Review CORS settings in backend

3. **Build Failures**
   - Verify Node.js version compatibility
   - Check all dependencies are listed in package.json
   - Review build logs for specific errors

4. **Static Export Issues**
   - Ensure no server-side only features are used
   - Check image optimization is disabled
   - Verify all dynamic routes are properly configured

### Debug Mode
Enable debug logging:
```bash
NEXT_PUBLIC_DEBUG=true npm run dev
```

## 📱 Mobile Support

The application is fully responsive and supports:
- **Touch Navigation**: Optimized for touch interactions
- **Mobile Layouts**: Adapted layouts for small screens
- **Progressive Web App**: Can be installed on mobile devices
- **Offline Support**: Basic offline functionality (future enhancement)

## 🎨 Customization

### Theming
Customize the design system in `tailwind.config.js`:
- **Colors**: Update color palette
- **Typography**: Change fonts and sizes
- **Spacing**: Adjust spacing scale
- **Components**: Modify component styles

### Branding
Update branding elements:
- **Logo**: Replace logo in header component
- **App Name**: Update in environment variables
- **Favicon**: Replace favicon files
- **Meta Tags**: Update in layout.tsx

## 📚 API Integration

### API Client
The `lib/api.ts` file provides:
- **Type-safe API calls**: Full TypeScript support
- **Error Handling**: Comprehensive error handling
- **Authentication**: Automatic session management
- **Request/Response Interceptors**: Logging and debugging

### Usage Example
```typescript
import { taskApi } from '@/lib/api'

// Get all tasks
const tasks = await taskApi.getAll({ status: 'todo' })

// Create new task
const newTask = await taskApi.create({
  title: 'New Task',
  description: 'Task description',
  priority: 'high'
})
```

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Follow the component design patterns
4. Add proper error handling and loading states
5. Test authentication integration thoroughly
6. Ensure responsive design on all screen sizes

## 📄 License

This project is licensed under the Apache 2.0 License.
