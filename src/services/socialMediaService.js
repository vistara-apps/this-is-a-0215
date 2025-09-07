import api from './api'

// Social Media Platform Configurations
export const PLATFORMS = {
  TWITTER: {
    id: 'twitter',
    name: 'Twitter',
    color: '#1DA1F2',
    maxLength: 280,
    supportsImages: true,
    supportsVideo: true,
    authUrl: '/auth/twitter'
  },
  INSTAGRAM: {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    maxLength: 2200,
    supportsImages: true,
    supportsVideo: true,
    authUrl: '/auth/instagram'
  },
  LINKEDIN: {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0077B5',
    maxLength: 3000,
    supportsImages: true,
    supportsVideo: true,
    authUrl: '/auth/linkedin'
  },
  FACEBOOK: {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    maxLength: 63206,
    supportsImages: true,
    supportsVideo: true,
    authUrl: '/auth/facebook'
  }
}

// Connect social media account
export const connectSocialAccount = async (platform) => {
  try {
    const response = await api.post('/social-accounts/connect', { platform })
    return response.data
  } catch (error) {
    throw new Error(`Failed to connect ${platform}: ${error.message}`)
  }
}

// Disconnect social media account
export const disconnectSocialAccount = async (accountId) => {
  try {
    await api.delete(`/social-accounts/${accountId}`)
    return true
  } catch (error) {
    throw new Error(`Failed to disconnect account: ${error.message}`)
  }
}

// Get connected accounts
export const getConnectedAccounts = async () => {
  try {
    const response = await api.get('/social-accounts')
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch connected accounts: ${error.message}`)
  }
}

// Publish post to social media platforms
export const publishPost = async (postData) => {
  try {
    const response = await api.post('/posts/publish', postData)
    return response.data
  } catch (error) {
    throw new Error(`Failed to publish post: ${error.message}`)
  }
}

// Schedule post for later publishing
export const schedulePost = async (postData) => {
  try {
    const response = await api.post('/posts/schedule', postData)
    return response.data
  } catch (error) {
    throw new Error(`Failed to schedule post: ${error.message}`)
  }
}

// Get analytics for connected accounts
export const getAnalytics = async (timeRange = '7d') => {
  try {
    const response = await api.get(`/analytics?range=${timeRange}`)
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`)
  }
}

// Get post performance metrics
export const getPostAnalytics = async (postId) => {
  try {
    const response = await api.get(`/analytics/posts/${postId}`)
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch post analytics: ${error.message}`)
  }
}

// Get interactions (comments, messages, mentions)
export const getInteractions = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters)
    const response = await api.get(`/interactions?${params}`)
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch interactions: ${error.message}`)
  }
}

// Reply to interaction
export const replyToInteraction = async (interactionId, replyText) => {
  try {
    const response = await api.post(`/interactions/${interactionId}/reply`, {
      content: replyText
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to send reply: ${error.message}`)
  }
}

// Mark interaction as read
export const markInteractionAsRead = async (interactionId) => {
  try {
    await api.patch(`/interactions/${interactionId}`, { read: true })
    return true
  } catch (error) {
    throw new Error(`Failed to mark interaction as read: ${error.message}`)
  }
}

// Get scheduled posts
export const getScheduledPosts = async () => {
  try {
    const response = await api.get('/posts/scheduled')
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch scheduled posts: ${error.message}`)
  }
}

// Update scheduled post
export const updateScheduledPost = async (postId, updates) => {
  try {
    const response = await api.patch(`/posts/${postId}`, updates)
    return response.data
  } catch (error) {
    throw new Error(`Failed to update post: ${error.message}`)
  }
}

// Delete scheduled post
export const deleteScheduledPost = async (postId) => {
  try {
    await api.delete(`/posts/${postId}`)
    return true
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`)
  }
}

// Upload media for posts
export const uploadMedia = async (file, platform) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('platform', platform)
    
    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to upload media: ${error.message}`)
  }
}
