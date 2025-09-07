import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '1',
    email: 'user@example.com',
    subscriptionTier: 'pro',
    connectedAccounts: ['twitter', 'instagram', 'linkedin']
  })

  const [posts, setPosts] = useState([
    {
      id: '1',
      content: 'Just launched our new AI-powered content generator! 🚀 #AI #SocialMedia #Innovation',
      platforms: ['twitter', 'linkedin'],
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      aiGenerated: true,
      hashtags: ['#AI', '#SocialMedia', '#Innovation']
    },
    {
      id: '2',
      content: 'Behind the scenes of building SocialFlow AI ✨ What features would you like to see next?',
      platforms: ['instagram', 'twitter'],
      scheduledTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      aiGenerated: false,
      hashtags: ['#BTS', '#SocialFlow']
    }
  ])

  const [analytics, setAnalytics] = useState({
    totalPosts: 47,
    totalEngagement: 12543,
    averageEngagement: 267,
    topPerformingPost: 'AI Content Generation Tips',
    weeklyGrowth: 8.5,
    platformData: [
      { platform: 'Twitter', posts: 18, engagement: 5420 },
      { platform: 'Instagram', posts: 15, engagement: 4200 },
      { platform: 'LinkedIn', posts: 14, engagement: 2923 }
    ]
  })

  const [interactions, setInteractions] = useState([
    {
      id: '1',
      type: 'comment',
      platform: 'twitter',
      author: '@johndoe',
      content: 'This is amazing! How does the AI generate such relevant content?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      postId: '1'
    },
    {
      id: '2',
      type: 'message',
      platform: 'instagram',
      author: '@sarah_tech',
      content: 'Hi! I saw your post about SocialFlow AI. Could you share more details about pricing?',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '3',
      type: 'mention',
      platform: 'linkedin',
      author: 'Alex Thompson',
      content: 'Great tool @SocialFlow! Really helping our marketing team save time.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      read: true
    }
  ])

  const addPost = (post) => {
    const newPost = {
      ...post,
      id: Date.now().toString(),
      status: 'scheduled',
      scheduledTime: post.scheduledTime || new Date().toISOString()
    }
    setPosts(prev => [...prev, newPost])
  }

  const updatePost = (id, updates) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, ...updates } : post
    ))
  }

  const markInteractionAsRead = (id) => {
    setInteractions(prev => prev.map(interaction =>
      interaction.id === id ? { ...interaction, read: true } : interaction
    ))
  }

  const value = {
    user,
    posts,
    analytics,
    interactions,
    addPost,
    updatePost,
    markInteractionAsRead
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}