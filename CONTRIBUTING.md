# Contributing to Choreo Full-Stack Sample

Thank you for your interest in contributing to the Choreo Full-Stack Sample application! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)
   - Screenshots or error logs if applicable

### Suggesting Features

1. **Check existing feature requests** to avoid duplicates
2. **Describe the use case** and why the feature would be valuable
3. **Provide implementation ideas** if you have them
4. **Consider the scope** - features should align with the sample's educational purpose

### Code Contributions

1. **Fork the repository** and create a feature branch
2. **Follow the coding standards** outlined below
3. **Write tests** for new functionality
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- WSO2 Choreo account (for deployment testing)

### Local Development

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/choreo-fullstack-sample.git
   cd choreo-fullstack-sample
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📝 Coding Standards

### General Guidelines

- **Write clear, readable code** with meaningful variable and function names
- **Add comments** for complex logic or business rules
- **Follow existing patterns** and conventions in the codebase
- **Keep functions small** and focused on a single responsibility
- **Use TypeScript** for type safety where applicable

### Backend (Node.js)

- **Use ES6+ features** consistently
- **Follow RESTful API conventions** for endpoints
- **Implement proper error handling** with appropriate HTTP status codes
- **Add JSDoc comments** for functions and classes
- **Use async/await** instead of callbacks or raw promises
- **Validate input data** using Joi or similar libraries

### Frontend (Next.js/React)

- **Use functional components** with hooks
- **Follow React best practices** for state management
- **Use TypeScript interfaces** for props and state
- **Implement proper error boundaries** and loading states
- **Follow accessibility guidelines** (WCAG 2.1)
- **Use semantic HTML** elements where appropriate

### CSS/Styling

- **Use Tailwind CSS** utility classes consistently
- **Follow mobile-first** responsive design principles
- **Maintain consistent spacing** and typography
- **Use CSS custom properties** for theme values
- **Avoid inline styles** except for dynamic values

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Frontend Testing

```bash
cd frontend
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run end-to-end tests
```

### Test Guidelines

- **Write unit tests** for utility functions and business logic
- **Write integration tests** for API endpoints
- **Write component tests** for React components
- **Aim for high test coverage** (>80%)
- **Test error scenarios** and edge cases
- **Use descriptive test names** that explain the expected behavior

## 📚 Documentation

### Code Documentation

- **Add JSDoc comments** for functions, classes, and modules
- **Document API endpoints** in OpenAPI specification
- **Include usage examples** in README files
- **Keep documentation up-to-date** with code changes

### User Documentation

- **Update README files** when adding new features
- **Add deployment instructions** for new components
- **Include troubleshooting guides** for common issues
- **Provide clear setup instructions** for new developers

## 🔍 Code Review Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Run linting** and fix any issues
3. **Update documentation** as needed
4. **Rebase your branch** on the latest main
5. **Write a clear commit message** following conventional commits

### Pull Request Guidelines

1. **Use a descriptive title** that summarizes the change
2. **Provide detailed description** of what was changed and why
3. **Reference related issues** using keywords (fixes #123)
4. **Include screenshots** for UI changes
5. **Add testing instructions** for reviewers

### Review Criteria

- **Code quality** and adherence to standards
- **Test coverage** and quality
- **Documentation** completeness
- **Performance** impact
- **Security** considerations
- **Compatibility** with existing features

## 🚀 Deployment Testing

### Choreo Deployment

1. **Test locally** first to ensure everything works
2. **Deploy to Choreo** development environment
3. **Verify authentication** integration works correctly
4. **Test API connections** between frontend and backend
5. **Check health endpoints** and monitoring

### Deployment Checklist

- [ ] Backend service builds and deploys successfully
- [ ] Frontend application builds and deploys successfully
- [ ] Authentication flow works end-to-end
- [ ] API connections are properly configured
- [ ] Health checks pass
- [ ] No console errors in browser
- [ ] Mobile responsiveness works correctly

## 🎯 Contribution Areas

### High Priority

- **Bug fixes** for existing functionality
- **Performance improvements** and optimizations
- **Accessibility enhancements** for better usability
- **Test coverage** improvements
- **Documentation** updates and clarifications

### Medium Priority

- **New UI components** that enhance the user experience
- **Additional API endpoints** that demonstrate best practices
- **Integration examples** with other Choreo services
- **Deployment automation** improvements

### Low Priority

- **Code refactoring** for better maintainability
- **Developer experience** improvements
- **Additional sample data** or scenarios
- **Styling enhancements** and visual improvements

## 📞 Getting Help

### Community Support

- **GitHub Discussions** for general questions and ideas
- **GitHub Issues** for bug reports and feature requests
- **WSO2 Discord** for real-time community support
- **Choreo Documentation** for platform-specific questions

### Maintainer Contact

- **Create an issue** for bugs or feature requests
- **Start a discussion** for questions or ideas
- **Tag maintainers** in pull requests for review

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the Apache 2.0 License.

## 🙏 Recognition

Contributors will be recognized in the project README and release notes. Thank you for helping make this sample application better for the entire Choreo community!

---

**Happy Contributing!** 🎉
