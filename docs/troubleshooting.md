# Troubleshooting Guide

This guide helps you resolve common issues when developing and deploying the Choreo Full-Stack Sample application.

## 🚨 Common Issues

### Development Environment

#### Node.js Version Issues

**Problem**: Build fails with Node.js version errors
```
Error: The engine "node" is incompatible with this module
```

**Solution**:
1. Check your Node.js version: `node --version`
2. Ensure you have Node.js 18+ installed
3. Use nvm to switch versions if needed:
   ```bash
   nvm install 18
   nvm use 18
   ```

#### Port Already in Use

**Problem**: Development server fails to start
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
1. Kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   ```
2. Or use a different port:
   ```bash
   npm run dev -- --port 3001
   ```

#### Module Not Found Errors

**Problem**: Import errors for custom modules
```
Module not found: Can't resolve '@/components/TaskList'
```

**Solution**:
1. Check if the file exists at the correct path
2. Verify TypeScript path mapping in `tsconfig.json`
3. Restart the development server
4. Clear Next.js cache: `rm -rf .next`

### Authentication Issues

#### Login Redirect Loop

**Problem**: User gets stuck in infinite login redirects

**Possible Causes & Solutions**:

1. **Incorrect Authentication Configuration**
   - Check `component.yaml` authentication settings
   - Verify `postLoginPath` is set correctly
   - Ensure managed authentication is enabled

2. **Cookie Issues**
   - Clear browser cookies for the domain
   - Check if cookies are being set properly
   - Verify CORS settings allow credentials

3. **Session Configuration**
   - Check session expiry settings
   - Verify session hint is being passed correctly

#### API Authentication Failures

**Problem**: API calls return 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

**Solution**:
1. **Check Headers**: Verify `x-jwt-assertion` header is present
2. **Backend Middleware**: Ensure auth middleware is properly configured
3. **Development Mode**: Check if development auth bypass is working
4. **Token Validation**: Verify JWT decoding logic

#### Session Not Persisting

**Problem**: User gets logged out on page refresh

**Solution**:
1. Check if cookies are being stored properly
2. Verify session storage implementation
3. Check browser cookie settings
4. Ensure HTTPS in production

### API Connection Issues

#### CORS Errors

**Problem**: Browser blocks API requests
```
Access to fetch at 'http://localhost:3001/api/tasks' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:
1. **Backend CORS Configuration**:
   ```javascript
   app.use(cors({
     origin: process.env.CORS_ORIGIN || '*',
     credentials: true
   }))
   ```

2. **Development Proxy**: Use Next.js rewrites in `next.config.js`
3. **Production**: Ensure Choreo connection is properly configured

#### Connection Refused

**Problem**: Frontend can't connect to backend
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```

**Solution**:
1. Verify backend server is running
2. Check if backend is listening on correct port
3. Verify API base URL configuration
4. Check firewall settings

#### 404 API Endpoints

**Problem**: API endpoints return 404 Not Found

**Solution**:
1. Verify route definitions in backend
2. Check API base URL configuration
3. Ensure middleware is not interfering
4. Verify OpenAPI specification matches routes

### Build and Deployment Issues

#### Backend Build Failures

**Problem**: Backend fails to build on Choreo
```
npm ERR! missing script: build
```

**Solution**:
1. Add build script to `package.json`:
   ```json
   {
     "scripts": {
       "build": "echo 'No build step required'"
     }
   }
   ```
2. Ensure all dependencies are in `package.json`
3. Check Node.js version compatibility

#### Frontend Build Failures

**Problem**: Next.js build fails
```
Error: Failed to compile
```

**Solution**:
1. **TypeScript Errors**: Fix all TypeScript compilation errors
2. **Missing Dependencies**: Ensure all imports have corresponding packages
3. **Environment Variables**: Check if all required env vars are set
4. **Static Export**: Verify `next.config.js` export configuration

#### Static Export Issues

**Problem**: Next.js static export fails
```
Error: Image Optimization using Next.js' default loader is not compatible with `next export`
```

**Solution**:
1. Disable image optimization in `next.config.js`:
   ```javascript
   module.exports = {
     images: {
       unoptimized: true
     }
   }
   ```
2. Avoid server-side only features
3. Use static generation instead of server-side rendering

### Choreo Platform Issues

#### Component Creation Fails

**Problem**: Cannot create component in Choreo

**Solution**:
1. Check GitHub repository permissions
2. Verify component directory path
3. Ensure `component.yaml` is valid
4. Check organization limits

#### Health Check Failures

**Problem**: Choreo reports unhealthy service
```
Health check failed: Connection timeout
```

**Solution**:
1. **Backend Health Endpoint**: Ensure `/health` endpoint exists and responds
2. **Port Configuration**: Verify service listens on configured port
3. **Startup Time**: Increase health check initial delay
4. **Dependencies**: Check if service dependencies are available

#### Authentication Setup Issues

**Problem**: Managed authentication not working

**Solution**:
1. **Enable Managed Auth**: Verify it's enabled in component settings
2. **Identity Provider**: Check if identity provider is configured
3. **Scopes**: Verify required OAuth scopes are configured
4. **Redirect URLs**: Ensure redirect URLs are correctly set

### Performance Issues

#### Slow API Responses

**Problem**: API calls take too long

**Solution**:
1. **Database Queries**: Optimize database queries (if using database)
2. **Caching**: Implement response caching
3. **Logging**: Add performance logging to identify bottlenecks
4. **Resource Limits**: Check if container resources are sufficient

#### Memory Issues

**Problem**: Application runs out of memory
```
JavaScript heap out of memory
```

**Solution**:
1. **Memory Leaks**: Check for memory leaks in code
2. **Resource Limits**: Increase container memory limits
3. **Optimization**: Optimize data structures and algorithms
4. **Garbage Collection**: Monitor garbage collection patterns

## 🔧 Debugging Tools

### Backend Debugging

1. **Enable Debug Logging**:
   ```bash
   LOG_LEVEL=debug npm run dev
   ```

2. **Health Check Testing**:
   ```bash
   curl http://localhost:3001/health
   ```

3. **API Testing**:
   ```bash
   curl -X GET http://localhost:3001/api/tasks \
     -H "Content-Type: application/json"
   ```

### Frontend Debugging

1. **Browser Developer Tools**:
   - Network tab for API calls
   - Console for JavaScript errors
   - Application tab for cookies/storage

2. **Next.js Debug Mode**:
   ```bash
   DEBUG=* npm run dev
   ```

3. **TypeScript Checking**:
   ```bash
   npm run type-check
   ```

### Choreo Platform Debugging

1. **Component Logs**:
   - Go to component → Observability → Logs
   - Filter by log level and time range

2. **Health Monitoring**:
   - Check component health status
   - Review health check configuration

3. **Build Logs**:
   - Review build logs for errors
   - Check build configuration

## 📞 Getting Help

### Self-Help Resources

1. **Documentation**:
   - [Choreo Documentation](https://wso2.com/choreo/docs/)
   - [Next.js Documentation](https://nextjs.org/docs)
   - [Node.js Documentation](https://nodejs.org/docs/)

2. **GitHub Issues**:
   - Search existing issues in the repository
   - Create new issue with detailed information

3. **Community Forums**:
   - [WSO2 Discord](https://discord.com/invite/wso2)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/wso2-choreo)

### Creating Support Requests

When creating a support request, include:

1. **Environment Information**:
   - Operating system and version
   - Node.js and npm versions
   - Browser version (for frontend issues)

2. **Error Details**:
   - Complete error messages
   - Stack traces
   - Steps to reproduce

3. **Configuration**:
   - Relevant configuration files
   - Environment variables (without sensitive data)
   - Component settings

4. **Logs**:
   - Application logs
   - Browser console logs
   - Choreo component logs

### Emergency Contacts

For critical production issues:
1. Check WSO2 support channels
2. Contact your organization's Choreo administrator
3. Review Choreo status page for platform issues

---

**Remember**: Most issues can be resolved by carefully reading error messages and checking configuration. Take time to understand the error before seeking help.
