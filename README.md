# SocialFlow AI

**Effortlessly create and schedule social media content with AI.**

SocialFlow AI is a comprehensive web application that helps creators and businesses streamline their social media content creation and scheduling process using AI-powered tools.

## 🚀 Features

### ✨ AI Content Generator
- Generate social media post captions using OpenAI GPT
- Relevant hashtag suggestions
- Platform-specific optimization (Twitter, Instagram, LinkedIn, Facebook)
- Multiple tone options (Professional, Casual, Creative, Humorous)

### 📅 Unified Content Calendar
- Visual drag-and-drop calendar interface
- Schedule posts across multiple platforms
- Batch content creation and scheduling
- Real-time publishing to social media platforms

### 📊 Cross-Platform Analytics Dashboard
- Consolidated performance metrics from all connected accounts
- Engagement tracking (likes, shares, comments, reach)
- Trend analysis and insights
- Platform comparison views

### 💬 Unified Inbox for Interactions
- Centralized inbox for comments, DMs, and mentions
- Multi-platform interaction management
- Quick reply functionality
- Read/unread status tracking

### 💳 Subscription Management
- Tiered subscription model (Free, Pro, Business)
- Stripe integration for secure payments
- Usage tracking and limits enforcement
- Customer portal for billing management

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-3.5/4 API
- **Payments**: Stripe
- **Social APIs**: Twitter, Instagram, LinkedIn, Facebook
- **Deployment**: Docker, Vercel/Netlify ready

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- OpenAI API key
- Stripe account (for payments)
- Social media developer accounts (Twitter, Meta, LinkedIn)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-0215.git
cd this-is-a-0215
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your actual API keys and configuration:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-openai-api-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the database schema:

```bash
# Copy the contents of database/schema.sql
# Paste and run in your Supabase SQL editor
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Run the SQL schema from `database/schema.sql`
4. Configure authentication providers in Authentication > Providers

### OpenAI Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com)
2. Add it to your `.env` file
3. Monitor usage in the OpenAI dashboard

### Stripe Setup

1. Create a Stripe account
2. Get your publishable key from the dashboard
3. Set up webhook endpoints for subscription events
4. Configure products and prices in the Stripe dashboard

### Social Media APIs

#### Twitter API
1. Apply for Twitter Developer access
2. Create a new app in the Twitter Developer Portal
3. Get your API keys and configure OAuth 2.0

#### Meta APIs (Instagram/Facebook)
1. Create a Meta Developer account
2. Create a new app and add Instagram/Facebook products
3. Configure OAuth redirect URLs

#### LinkedIn API
1. Create a LinkedIn Developer account
2. Create a new app and request Marketing Developer Platform access
3. Configure OAuth 2.0 settings

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Header.jsx
│   ├── Layout.jsx
│   └── Sidebar.jsx
├── config/             # Configuration files
│   ├── supabase.js
│   └── stripe.js
├── context/            # React context providers
│   └── AppContext.jsx
├── pages/              # Page components
│   ├── Analytics.jsx
│   ├── Calendar.jsx
│   ├── ContentGenerator.jsx
│   ├── Dashboard.jsx
│   ├── Inbox.jsx
│   ├── Login.jsx
│   └── Pricing.jsx
├── services/           # API service layers
│   ├── api.js
│   ├── authService.js
│   ├── openaiService.js
│   ├── paymentService.js
│   └── socialMediaService.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🔐 Authentication

The app uses Supabase Auth with support for:

- Email/password authentication
- OAuth providers (Google, GitHub)
- Password reset functionality
- Protected routes and user sessions

## 💰 Subscription Plans

### Free Tier
- 10 AI generations per month
- Basic scheduling for 2 platforms
- Basic analytics

### Pro Tier ($29/month)
- 500 AI generations per month
- Scheduling for up to 5 platforms
- Advanced analytics
- Priority support

### Business Tier ($79/month)
- Unlimited AI generations
- Unlimited platforms
- Team collaboration features
- Priority support
- Custom integrations

## 🚀 Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t socialflow-ai .

# Run the container
docker run -p 3000:3000 socialflow-ai
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build for production
npm run build

# Serve the dist folder with your preferred static server
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Social Media Endpoints
- `GET /social-accounts` - Get connected accounts
- `POST /social-accounts/connect` - Connect new account
- `DELETE /social-accounts/:id` - Disconnect account

### Content Endpoints
- `POST /posts/schedule` - Schedule a post
- `GET /posts/scheduled` - Get scheduled posts
- `POST /posts/publish` - Publish immediately

### Analytics Endpoints
- `GET /analytics` - Get analytics data
- `GET /analytics/posts/:id` - Get post-specific analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@socialflow-ai.com
- 💬 Discord: [Join our community](https://discord.gg/socialflow-ai)
- 📖 Documentation: [docs.socialflow-ai.com](https://docs.socialflow-ai.com)

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Supabase for the backend infrastructure
- Stripe for payment processing
- All the social media platforms for their APIs

---

**Built with ❤️ by the SocialFlow AI team**
