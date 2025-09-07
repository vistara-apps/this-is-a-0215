# SocialFlow AI Deployment Guide

This guide covers the complete deployment process for SocialFlow AI, including frontend, backend services, and third-party integrations.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │  External APIs  │
│   (React/Vite)  │◄──►│   (Backend)     │◄──►│  (OpenAI, etc.) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Vercel      │    │   PostgreSQL    │    │     Stripe      │
│   (Hosting)     │    │   (Database)    │    │   (Payments)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_OPENAI_API_KEY=sk-your-openai-api-key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-app.vercel.app`

### Option 2: Netlify

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

### Option 3: Docker

1. **Build Docker Image**
   ```bash
   docker build -t socialflow-ai .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e VITE_SUPABASE_URL=your-url \
     -e VITE_SUPABASE_ANON_KEY=your-key \
     socialflow-ai
   ```

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready

### 2. Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `database/schema.sql`
3. Run the SQL script

### 3. Configure Authentication

1. Go to Authentication > Providers
2. Enable Email provider
3. Configure OAuth providers (Google, GitHub):
   ```
   Google:
   - Client ID: your-google-client-id
   - Client Secret: your-google-client-secret
   
   GitHub:
   - Client ID: your-github-client-id
   - Client Secret: your-github-client-secret
   ```

### 4. Set Up Row Level Security

The schema includes RLS policies, but verify they're enabled:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 💳 Payment Setup (Stripe)

### 1. Configure Stripe

1. Create products and prices in Stripe Dashboard:
   ```
   Pro Plan:
   - Price: $29/month
   - Price ID: price_pro_monthly
   
   Business Plan:
   - Price: $79/month
   - Price ID: price_business_monthly
   ```

2. Set up webhooks:
   ```
   Endpoint URL: https://your-api.com/webhooks/stripe
   Events:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
   ```

### 2. Update Configuration

Update `src/config/stripe.js` with your price IDs:

```javascript
export const SUBSCRIPTION_PLANS = {
  PRO: {
    priceId: 'price_1234567890', // Your actual price ID
    // ...
  },
  BUSINESS: {
    priceId: 'price_0987654321', // Your actual price ID
    // ...
  }
}
```

## 🤖 AI Integration (OpenAI)

### 1. Get API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an API key
3. Set usage limits and monitoring

### 2. Configure Rate Limits

For production, implement rate limiting:

```javascript
// In your backend service
const rateLimit = {
  free: 10, // requests per hour
  pro: 500,
  business: -1 // unlimited
}
```

## 📱 Social Media API Setup

### Twitter API v2

1. **Apply for Developer Access**
   - Go to [developer.twitter.com](https://developer.twitter.com)
   - Apply for Essential access (free)

2. **Create App**
   ```
   App Name: SocialFlow AI
   App Description: AI-powered social media management
   Website URL: https://your-domain.com
   Callback URL: https://your-domain.com/auth/twitter/callback
   ```

3. **Configure OAuth 2.0**
   ```
   Client ID: your-twitter-client-id
   Client Secret: your-twitter-client-secret
   Scopes: tweet.read, tweet.write, users.read, offline.access
   ```

### Meta APIs (Instagram/Facebook)

1. **Create Meta App**
   - Go to [developers.facebook.com](https://developers.facebook.com)
   - Create new app

2. **Add Products**
   - Instagram Basic Display
   - Facebook Login
   - Instagram API (for business accounts)

3. **Configure OAuth**
   ```
   Valid OAuth Redirect URIs:
   - https://your-domain.com/auth/instagram/callback
   - https://your-domain.com/auth/facebook/callback
   ```

### LinkedIn API

1. **Create LinkedIn App**
   - Go to [developer.linkedin.com](https://developer.linkedin.com)
   - Create new app

2. **Request Access**
   - Apply for Marketing Developer Platform
   - Wait for approval (can take several days)

3. **Configure OAuth**
   ```
   Authorized Redirect URLs:
   - https://your-domain.com/auth/linkedin/callback
   ```

## 🔐 Security Configuration

### Environment Variables

**Never commit sensitive keys to version control!**

Production environment variables:

```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI
OPENAI_API_KEY=sk-your-production-key

# Payments
STRIPE_PUBLISHABLE_KEY=pk_live_your-key
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Social Media APIs
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Security
JWT_SECRET=your-super-secure-jwt-secret
ENCRYPTION_KEY=your-32-character-encryption-key
```

### CORS Configuration

Configure CORS in Supabase:

```sql
-- In Supabase SQL Editor
SELECT cron.schedule('cors-update', '0 0 * * *', 
  'UPDATE auth.config SET cors_allowed_origins = ''https://your-domain.com,https://www.your-domain.com'''
);
```

## 📊 Monitoring & Analytics

### 1. Error Tracking

Add error tracking service (e.g., Sentry):

```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
})
```

### 2. Performance Monitoring

Monitor key metrics:
- API response times
- Database query performance
- User engagement metrics
- Subscription conversion rates

### 3. Uptime Monitoring

Set up uptime monitoring:
- Use services like Pingdom or UptimeRobot
- Monitor critical endpoints
- Set up alerts for downtime

## 🚀 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔧 Post-Deployment Checklist

### 1. Functionality Testing

- [ ] User registration and login
- [ ] Social media account connection
- [ ] AI content generation
- [ ] Post scheduling
- [ ] Analytics dashboard
- [ ] Payment processing
- [ ] Webhook handling

### 2. Performance Testing

- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database query optimization
- [ ] CDN configuration

### 3. Security Testing

- [ ] SSL certificate installed
- [ ] HTTPS redirect configured
- [ ] API rate limiting
- [ ] Input validation
- [ ] XSS protection
- [ ] CSRF protection

### 4. SEO & Accessibility

- [ ] Meta tags configured
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Accessibility compliance (WCAG 2.1)

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment Variables Not Loading**
   ```bash
   # Check variable names start with VITE_
   # Restart development server after changes
   ```

3. **Database Connection Issues**
   ```bash
   # Check Supabase URL and keys
   # Verify RLS policies
   # Check network connectivity
   ```

4. **API Rate Limits**
   ```bash
   # Implement exponential backoff
   # Add request queuing
   # Monitor usage dashboards
   ```

### Support Resources

- 📧 Technical Support: tech@socialflow-ai.com
- 📖 Documentation: [docs.socialflow-ai.com](https://docs.socialflow-ai.com)
- 💬 Community: [Discord](https://discord.gg/socialflow-ai)

---

**Deployment completed successfully! 🎉**
