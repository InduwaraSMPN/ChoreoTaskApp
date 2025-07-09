# Choreo Full-Stack Sample Application

A comprehensive Task Management System demonstrating full-stack application development on WSO2 Choreo platform.

## 🏗️ Architecture Overview

This sample application consists of two main components:

- **Backend Service** (Node.js): RESTful API for task management deployed as a Choreo Service component
- **Frontend Web App** (Next.js): Modern web application deployed as a Choreo Web Application component

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js Web   │    │  Choreo Gateway  │    │  Node.js API    │
│   Application   │◄──►│  + Auth Layer    │◄──►│    Service      │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## ✨ Features Demonstrated

### Backend (Node.js Service)
- ✅ RESTful API with OpenAPI specification
- ✅ Choreo Service component configuration
- ✅ User authentication context handling
- ✅ Health checks and monitoring
- ✅ CORS configuration for Choreo

### Frontend (Next.js Web App)
- ✅ Choreo managed authentication integration
- ✅ Secure API communication via Choreo connections
- ✅ Modern UI with Tailwind CSS
- ✅ Session management and error handling
- ✅ Responsive design

### Integration Features
- ✅ Secure frontend-backend communication
- ✅ Choreo's built-in authentication system
- ✅ Connection-based service discovery
- ✅ Session expiry handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed locally
- WSO2 Choreo account
- GitHub account (for repository hosting)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd choreo-fullstack-sample
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 📦 Project Structure

```
choreo-fullstack-sample/
├── backend/                 # Node.js Service Component
│   ├── .choreo/
│   │   └── component.yaml   # Choreo service configuration
│   ├── src/
│   │   ├── app.js          # Express application
│   │   ├── routes/         # API route handlers
│   │   └── middleware/     # Custom middleware
│   ├── openapi.yaml        # API specification
│   └── package.json
├── frontend/               # Next.js Web Application Component
│   ├── .choreo/
│   │   └── component.yaml  # Choreo web app configuration
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   └── lib/          # Utility functions
│   ├── package.json
│   └── next.config.js
└── docs/
    ├── deployment-guide.md      # Step-by-step deployment
    ├── authentication-flow.md   # Auth integration details
    └── api-documentation.md     # API usage examples
```

## 🔐 Authentication Flow

This application uses Choreo's managed authentication system following the [official guide](https://medium.com/choreo-tech-blog/secure-your-react-spas-with-choreo-managed-authentication-8b7d2d45147b):

1. **User Login**: Frontend redirects to `/auth/login`
2. **Choreo Handles Auth**: OIDC flow with built-in identity provider
3. **Session Management**: Secure cookies for API access
4. **API Calls**: Authenticated requests via `/choreo-apis/` prefix
5. **Session Expiry**: Automatic re-login on 401 responses

### 📚 Detailed Documentation

- **[Authentication Implementation Guide](docs/choreo-authentication-implementation.md)** - Complete technical implementation details
- **[Deployment Configuration Guide](docs/choreo-deployment-config.md)** - Step-by-step deployment instructions
- **[Authentication Flow Diagram](docs/authentication-flow.md)** - Visual flow and technical details

## 🚀 Deployment to Choreo

### Step 1: Deploy Backend Service
1. Create new Service component in Choreo
2. Connect to your GitHub repository
3. Set component directory to `/backend`
4. Select Node.js buildpack
5. Build and deploy

### Step 2: Deploy Frontend Web App
1. Create new Web Application component in Choreo
2. Connect to the same GitHub repository
3. Set component directory to `/frontend`
4. Select React buildpack (works for Next.js)
5. Enable managed authentication
6. Build and deploy

### Step 3: Create Connection
1. In frontend component, go to Connections
2. Create connection to backend service
3. Configure access mode and authentication

For detailed deployment instructions, see [docs/deployment-guide.md](docs/deployment-guide.md)

## 📚 Documentation

- [Deployment Guide](docs/deployment-guide.md) - Complete deployment walkthrough
- [Authentication Flow](docs/authentication-flow.md) - Detailed auth integration
- [API Documentation](docs/api-documentation.md) - Backend API reference
- [Backend README](backend/README.md) - Backend-specific documentation
- [Frontend README](frontend/README.md) - Frontend-specific documentation

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run test         # Run tests
npm run lint         # Lint code
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Lint code
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- [WSO2 Choreo Documentation](https://wso2.com/choreo/docs/)
- [Choreo Community Discord](https://discord.com/invite/wso2)
- [GitHub Issues](../../issues)

---

**Built with ❤️ for the WSO2 Choreo community**
