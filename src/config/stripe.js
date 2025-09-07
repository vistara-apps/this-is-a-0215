import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here'

export const stripe = loadStripe(stripePublishableKey)

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Limited AI generations per month',
      'Basic scheduling for 1-2 platforms',
      'Basic analytics'
    ],
    limits: {
      aiGenerations: 10,
      platforms: 2,
      scheduledPosts: 5
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: 'price_pro_monthly',
    features: [
      'Increased AI generations',
      'Scheduling for up to 5 platforms',
      'Advanced analytics',
      'Priority support'
    ],
    limits: {
      aiGenerations: 500,
      platforms: 5,
      scheduledPosts: 100
    }
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    price: 79,
    priceId: 'price_business_monthly',
    features: [
      'Unlimited AI generations',
      'Scheduling for unlimited platforms',
      'Team collaboration features',
      'Priority support',
      'Custom integrations'
    ],
    limits: {
      aiGenerations: -1, // unlimited
      platforms: -1, // unlimited
      scheduledPosts: -1 // unlimited
    }
  }
}
