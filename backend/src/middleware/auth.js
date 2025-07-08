/**
 * Authentication middleware for Choreo managed authentication
 * Extracts user information from Choreo gateway headers
 */

// Note: We don't need to install jsonwebtoken since we're just decoding (not verifying)
// Choreo gateway already validates the JWT before forwarding

/**
 * Middleware to extract and validate user information from Choreo authentication
 * Choreo gateway passes user information via headers when managed auth is enabled
 */
const authMiddleware = (req, res, next) => {
  try {
    // Choreo passes user information via x-jwt-assertion header
    const jwtAssertion = req.headers['x-jwt-assertion']

    if (!jwtAssertion) {
      // For development/testing, allow requests without auth
      if (process.env.NODE_ENV === 'development') {
        req.user = {
          sub: 'dev-user-123',
          email: 'developer@example.com',
          name: 'Development User',
          preferred_username: 'devuser'
        }
        return next()
      }

      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      })
    }

    // Decode JWT assertion (Choreo provides this pre-validated)
    // In production, this JWT is already validated by Choreo gateway
    // Simple base64 decode for the payload (JWT format: header.payload.signature)
    const parts = jwtAssertion.split('.')
    if (parts.length !== 3) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid JWT format',
        timestamp: new Date().toISOString()
      })
    }

    const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString())

    if (!decoded) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid authentication token',
        timestamp: new Date().toISOString()
      })
    }

    // Extract user information from JWT claims
    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      name: decoded.name || decoded.given_name + ' ' + decoded.family_name,
      preferred_username: decoded.preferred_username,
      groups: decoded.groups || [],
      roles: decoded.roles || []
    }

    // Log user access for debugging (remove in production)
    if (process.env.LOG_LEVEL === 'debug') {
      console.log('🔐 Authenticated user:', {
        sub: req.user.sub,
        email: req.user.email,
        name: req.user.name
      })
    }

    next()
  } catch (error) {
    console.error('❌ Authentication error:', error)

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication failed',
      timestamp: new Date().toISOString()
    })
  }
}

/**
 * Middleware to check if user has specific role
 * @param {string} requiredRole - Role required to access the endpoint
 */
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      })
    }

    if (!req.user.roles || !req.user.roles.includes(requiredRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Role '${requiredRole}' required`,
        timestamp: new Date().toISOString()
      })
    }

    next()
  }
}

module.exports = { authMiddleware, requireRole }
