-- SocialFlow AI Database Schema
-- This file contains the complete database schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
    stripe_customer_id TEXT UNIQUE,
    subscription_id TEXT,
    subscription_status TEXT,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social accounts table
CREATE TABLE public.social_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('twitter', 'instagram', 'linkedin', 'facebook')),
    platform_user_id TEXT NOT NULL,
    username TEXT,
    display_name TEXT,
    profile_image_url TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform, platform_user_id)
);

-- Posts table
CREATE TABLE public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[],
    hashtags TEXT[],
    platforms TEXT[] NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    ai_generated BOOLEAN DEFAULT false,
    ai_prompt TEXT,
    tone TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post publications table (tracks individual platform publications)
CREATE TABLE public.post_publications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    platform_post_id TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('likes', 'shares', 'comments', 'views', 'clicks', 'impressions', 'reach', 'engagement_rate')),
    value INTEGER NOT NULL DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactions table (comments, messages, mentions)
CREATE TABLE public.interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
    platform TEXT NOT NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('comment', 'message', 'mention', 'reply')),
    platform_interaction_id TEXT NOT NULL,
    author_username TEXT NOT NULL,
    author_display_name TEXT,
    author_profile_image TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    replied_at TIMESTAMP WITH TIME ZONE,
    reply_content TEXT,
    interaction_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(platform, platform_interaction_id)
);

-- Usage tracking table (for subscription limits)
CREATE TABLE public.usage_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    usage_type TEXT NOT NULL CHECK (usage_type IN ('ai_generation', 'post_scheduled', 'platform_connected')),
    count INTEGER DEFAULT 1,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, usage_type, period_start)
);

-- Webhooks table (for tracking webhook events)
CREATE TABLE public.webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source TEXT NOT NULL CHECK (source IN ('stripe', 'twitter', 'instagram', 'linkedin', 'facebook')),
    event_type TEXT NOT NULL,
    event_id TEXT UNIQUE,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_users_stripe_customer_id ON public.users(stripe_customer_id);

CREATE INDEX idx_social_accounts_user_id ON public.social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON public.social_accounts(platform);
CREATE INDEX idx_social_accounts_active ON public.social_accounts(is_active);

CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_scheduled_time ON public.posts(scheduled_time);
CREATE INDEX idx_posts_created_at ON public.posts(created_at);

CREATE INDEX idx_post_publications_post_id ON public.post_publications(post_id);
CREATE INDEX idx_post_publications_social_account_id ON public.post_publications(social_account_id);
CREATE INDEX idx_post_publications_status ON public.post_publications(status);

CREATE INDEX idx_analytics_post_id ON public.analytics(post_id);
CREATE INDEX idx_analytics_social_account_id ON public.analytics(social_account_id);
CREATE INDEX idx_analytics_platform ON public.analytics(platform);
CREATE INDEX idx_analytics_metric_type ON public.analytics(metric_type);
CREATE INDEX idx_analytics_recorded_at ON public.analytics(recorded_at);

CREATE INDEX idx_interactions_user_id ON public.interactions(user_id);
CREATE INDEX idx_interactions_social_account_id ON public.interactions(social_account_id);
CREATE INDEX idx_interactions_is_read ON public.interactions(is_read);
CREATE INDEX idx_interactions_interaction_timestamp ON public.interactions(interaction_timestamp);

CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_period ON public.usage_tracking(period_start, period_end);

CREATE INDEX idx_webhooks_source ON public.webhooks(source);
CREATE INDEX idx_webhooks_processed ON public.webhooks(processed);
CREATE INDEX idx_webhooks_created_at ON public.webhooks(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Social accounts policies
CREATE POLICY "Users can view own social accounts" ON public.social_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social accounts" ON public.social_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social accounts" ON public.social_accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social accounts" ON public.social_accounts
    FOR DELETE USING (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Users can view own posts" ON public.posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- Post publications policies
CREATE POLICY "Users can view own post publications" ON public.post_publications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts 
            WHERE posts.id = post_publications.post_id 
            AND posts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own post publications" ON public.post_publications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.posts 
            WHERE posts.id = post_publications.post_id 
            AND posts.user_id = auth.uid()
        )
    );

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.social_accounts 
            WHERE social_accounts.id = analytics.social_account_id 
            AND social_accounts.user_id = auth.uid()
        )
    );

-- Interactions policies
CREATE POLICY "Users can view own interactions" ON public.interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions" ON public.interactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON public.usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get user's current usage for a period
CREATE OR REPLACE FUNCTION get_user_usage(
    p_user_id UUID,
    p_usage_type TEXT,
    p_period_start DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE,
    p_period_end DATE DEFAULT (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE
)
RETURNS INTEGER AS $$
DECLARE
    usage_count INTEGER;
BEGIN
    SELECT COALESCE(SUM(count), 0)
    INTO usage_count
    FROM public.usage_tracking
    WHERE user_id = p_user_id
    AND usage_type = p_usage_type
    AND period_start >= p_period_start
    AND period_end <= p_period_end;
    
    RETURN usage_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_usage(
    p_user_id UUID,
    p_usage_type TEXT,
    p_count INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
    current_period_start DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
    current_period_end DATE := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE;
BEGIN
    INSERT INTO public.usage_tracking (user_id, usage_type, count, period_start, period_end)
    VALUES (p_user_id, p_usage_type, p_count, current_period_start, current_period_end)
    ON CONFLICT (user_id, usage_type, period_start)
    DO UPDATE SET count = usage_tracking.count + p_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
