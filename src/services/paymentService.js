import { stripe } from '../config/stripe'
import { SUBSCRIPTION_PLANS } from '../config/stripe'
import api from './api'

// Create checkout session for subscription
export const createCheckoutSession = async (planId, userId) => {
  try {
    const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId)
    if (!plan || plan.id === 'free') {
      throw new Error('Invalid subscription plan')
    }

    const response = await api.post('/payments/create-checkout-session', {
      priceId: plan.priceId,
      userId,
      successUrl: `${window.location.origin}/subscription/success`,
      cancelUrl: `${window.location.origin}/subscription/cancel`
    })

    const { sessionId } = response.data
    const stripeInstance = await stripe
    
    const { error } = await stripeInstance.redirectToCheckout({
      sessionId
    })

    if (error) {
      throw new Error(error.message)
    }

    return true
  } catch (error) {
    throw new Error(error.message || 'Failed to create checkout session')
  }
}

// Create customer portal session
export const createPortalSession = async (customerId) => {
  try {
    const response = await api.post('/payments/create-portal-session', {
      customerId,
      returnUrl: `${window.location.origin}/settings/billing`
    })

    const { url } = response.data
    window.location.href = url
    
    return true
  } catch (error) {
    throw new Error(error.message || 'Failed to create portal session')
  }
}

// Get subscription status
export const getSubscriptionStatus = async (userId) => {
  try {
    const response = await api.get(`/payments/subscription/${userId}`)
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to get subscription status')
  }
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await api.post('/payments/cancel-subscription', {
      subscriptionId
    })
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to cancel subscription')
  }
}

// Update subscription
export const updateSubscription = async (subscriptionId, newPriceId) => {
  try {
    const response = await api.post('/payments/update-subscription', {
      subscriptionId,
      newPriceId
    })
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to update subscription')
  }
}

// Get usage statistics for billing
export const getUsageStats = async (userId, period = 'current_month') => {
  try {
    const response = await api.get(`/payments/usage/${userId}?period=${period}`)
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to get usage statistics')
  }
}

// Check if user can perform action based on subscription limits
export const checkSubscriptionLimits = async (userId, action, count = 1) => {
  try {
    const response = await api.post('/payments/check-limits', {
      userId,
      action,
      count
    })
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to check subscription limits')
  }
}

// Get available plans
export const getAvailablePlans = () => {
  return Object.values(SUBSCRIPTION_PLANS)
}

// Get plan by ID
export const getPlanById = (planId) => {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId)
}

// Format price for display
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Check if feature is available for user's plan
export const isFeatureAvailable = (userPlan, feature) => {
  const plan = getPlanById(userPlan)
  if (!plan) return false

  const featureMap = {
    'unlimited_ai': plan.limits.aiGenerations === -1,
    'unlimited_platforms': plan.limits.platforms === -1,
    'unlimited_posts': plan.limits.scheduledPosts === -1,
    'team_collaboration': plan.id === 'business',
    'priority_support': ['pro', 'business'].includes(plan.id),
    'custom_integrations': plan.id === 'business'
  }

  return featureMap[feature] || false
}

// Get remaining usage for current billing period
export const getRemainingUsage = async (userId) => {
  try {
    const response = await api.get(`/payments/remaining-usage/${userId}`)
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to get remaining usage')
  }
}
