import React, { useState } from 'react'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import { getAvailablePlans, formatPrice, createCheckoutSession } from '../services/paymentService'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const Pricing = () => {
  const { user } = useApp()
  const [isLoading, setIsLoading] = useState(null)
  const plans = getAvailablePlans()

  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      toast.success('You are already on the free plan!')
      return
    }

    setIsLoading(planId)
    try {
      await createCheckoutSession(planId, user.id)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(null)
    }
  }

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free':
        return <Sparkles className="w-8 h-8" />
      case 'pro':
        return <Zap className="w-8 h-8" />
      case 'business':
        return <Crown className="w-8 h-8" />
      default:
        return <Sparkles className="w-8 h-8" />
    }
  }

  const getPlanColor = (planId) => {
    switch (planId) {
      case 'free':
        return 'text-blue-400'
      case 'pro':
        return 'text-purple-400'
      case 'business':
        return 'text-yellow-400'
      default:
        return 'text-blue-400'
    }
  }

  const isCurrentPlan = (planId) => {
    return user.subscriptionTier === planId
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Scale your social media presence with AI-powered content creation and scheduling
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              {plan.id === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${getPlanColor(plan.id)} bg-white/10`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-white/60 ml-2">/month</span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limits Display */}
                <div className="bg-white/5 rounded-lg p-4 mb-8">
                  <h4 className="text-white font-medium mb-3">Plan Limits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/70">
                      <span>AI Generations</span>
                      <span>
                        {plan.limits.aiGenerations === -1 
                          ? 'Unlimited' 
                          : plan.limits.aiGenerations.toLocaleString()
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Platforms</span>
                      <span>
                        {plan.limits.platforms === -1 
                          ? 'Unlimited' 
                          : plan.limits.platforms
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Scheduled Posts</span>
                      <span>
                        {plan.limits.scheduledPosts === -1 
                          ? 'Unlimited' 
                          : plan.limits.scheduledPosts
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant={plan.id === 'pro' ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading === plan.id || isCurrentPlan(plan.id)}
                >
                  {isLoading === plan.id ? (
                    'Processing...'
                  ) : isCurrentPlan(plan.id) ? (
                    'Current Plan'
                  ) : plan.id === 'free' ? (
                    'Get Started Free'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>

                {isCurrentPlan(plan.id) && (
                  <p className="text-center text-green-400 text-sm mt-2">
                    ✓ You are currently on this plan
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-white/70">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What happens if I exceed my plan limits?
              </h3>
              <p className="text-white/70">
                If you reach your plan limits, you'll be notified and can either upgrade your plan or wait for the next billing cycle to reset your usage.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a free trial for paid plans?
              </h3>
              <p className="text-white/70">
                We offer a generous free plan to get you started. You can upgrade to a paid plan anytime to unlock additional features and higher limits.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                How secure is my payment information?
              </h3>
              <p className="text-white/70">
                We use Stripe for secure payment processing. Your payment information is encrypted and never stored on our servers.
              </p>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <p className="text-white/70 mb-4">
            Need a custom plan for your organization?
          </p>
          <Button variant="outline">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Pricing
