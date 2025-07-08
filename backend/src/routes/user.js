/**
 * User profile routes for the Task Management API
 * Handles user information and profile management
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/user/profile
 * Get the authenticated user's profile information
 */
router.get('/profile', (req, res) => {
  // Extract user information from the authentication middleware
  const userProfile = {
    id: req.user.sub,
    email: req.user.email,
    name: req.user.name,
    username: req.user.preferred_username,
    groups: req.user.groups || [],
    roles: req.user.roles || [],
    lastLogin: new Date().toISOString(),
    profileComplete: !!(req.user.name && req.user.email)
  };

  res.json({
    message: 'User profile retrieved successfully',
    profile: userProfile
  });
});

/**
 * GET /api/user/preferences
 * Get user preferences (demo endpoint)
 */
router.get('/preferences', (req, res) => {
  // In a real application, these would be stored in a database
  const defaultPreferences = {
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: false,
      taskReminders: true,
      weeklyDigest: true
    },
    dashboard: {
      defaultView: 'list',
      tasksPerPage: 10,
      showCompletedTasks: false
    }
  };

  res.json({
    message: 'User preferences retrieved successfully',
    preferences: defaultPreferences
  });
});

/**
 * PUT /api/user/preferences
 * Update user preferences (demo endpoint)
 */
router.put('/preferences', (req, res) => {
  // In a real application, these would be validated and stored in a database
  const updatedPreferences = {
    ...req.body,
    updatedAt: new Date().toISOString(),
    updatedBy: req.user.sub
  };

  res.json({
    message: 'User preferences updated successfully',
    preferences: updatedPreferences
  });
});

/**
 * GET /api/user/activity
 * Get user activity summary
 */
router.get('/activity', (req, res) => {
  const userId = req.user.sub;
  
  // In a real application, this would query actual activity data
  const activitySummary = {
    userId,
    period: 'last_30_days',
    summary: {
      tasksCreated: 15,
      tasksCompleted: 12,
      tasksInProgress: 3,
      averageCompletionTime: '2.5 days',
      mostProductiveDay: 'Tuesday',
      streakDays: 7
    },
    recentActivity: [
      {
        id: '1',
        type: 'task_completed',
        description: 'Completed task: Review project proposal',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'task_created',
        description: 'Created task: Prepare presentation slides',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'task_updated',
        description: 'Updated task priority: Fix bug in authentication',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ]
  };

  res.json({
    message: 'User activity retrieved successfully',
    activity: activitySummary
  });
});

/**
 * POST /api/user/logout
 * Handle user logout (cleanup any server-side session data)
 */
router.post('/logout', (req, res) => {
  // In a real application, you might clean up server-side session data here
  // For Choreo managed auth, the actual logout is handled by the frontend
  
  res.json({
    message: 'Logout processed successfully',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/user/permissions
 * Get user permissions and roles
 */
router.get('/permissions', (req, res) => {
  const permissions = {
    userId: req.user.sub,
    roles: req.user.roles || [],
    groups: req.user.groups || [],
    permissions: [
      'tasks:read',
      'tasks:create',
      'tasks:update',
      'tasks:delete',
      'profile:read',
      'profile:update'
    ],
    features: {
      canCreateTasks: true,
      canDeleteTasks: true,
      canViewAnalytics: true,
      canExportData: false,
      canManageTeam: false
    }
  };

  res.json({
    message: 'User permissions retrieved successfully',
    permissions
  });
});

module.exports = router;
