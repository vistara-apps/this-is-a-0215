import React, { useState } from 'react'
import { BarChart3, TrendingUp, Users, MessageSquare, Eye, Heart } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Card from '../components/Card'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'

const Analytics = () => {
  const { analytics } = useApp()
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data for charts
  const engagementData = [
    { date: 'Mon', twitter: 120, instagram: 89, linkedin: 67 },
    { date: 'Tue', twitter: 98, instagram: 156, linkedin: 78 },
    { date: 'Wed', twitter: 145, instagram: 134, linkedin: 89 },
    { date: 'Thu', twitter: 167, instagram: 178, linkedin: 95 },
    { date: 'Fri', twitter: 189, instagram: 145, linkedin: 104 },
    { date: 'Sat', twitter: 156, instagram: 198, linkedin: 67 },
    { date: 'Sun', twitter: 134, instagram: 167, linkedin: 56 }
  ]

  const platformData = [
    { name: 'Twitter', value: 35, color: '#1DA1F2' },
    { name: 'Instagram', value: 30, color: '#E4405F' },
    { name: 'LinkedIn', value: 25, color: '#0077B5' },
    { name: 'Facebook', value: 10, color: '#1877F2' }
  ]

  const postPerformanceData = [
    { title: 'AI Tips for Marketers', likes: 245, shares: 67, comments: 23 },
    { title: 'Social Media Trends 2024', likes: 189, shares: 45, comments: 34 },
    { title: 'Content Strategy Guide', likes: 167, shares: 78, comments: 19 },
    { title: 'Automation Tools Review', likes: 156, shares: 34, comments: 28 }
  ]

  const stats = [
    {
      name: 'Total Reach',
      value: '45.2K',
      change: '+12.5%',
      changeType: 'positive',
      icon: Eye
    },
    {
      name: 'Engagement Rate',
      value: '8.7%',
      change: '+2.1%',
      changeType: 'positive',
      icon: Heart
    },
    {
      name: 'New Followers',
      value: '1,234',
      change: '+5.3%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'Total Comments',
      value: '567',
      change: '-1.2%',
      changeType: 'negative',
      icon: MessageSquare
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <BarChart3 className="w-8 h-8 mr-3" />
            Analytics Dashboard
          </h1>
          <p className="text-white/70 mt-1">Track your social media performance across all platforms</p>
        </div>
        <div className="flex space-x-2 mt-4 lg:mt-0">
          {['7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="w-8 h-8 text-primary-400" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-white/70 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-white">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Engagement Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" strokeWidth={2} />
                <Line type="monotone" dataKey="instagram" stroke="#E4405F" strokeWidth={2} />
                <Line type="monotone" dataKey="linkedin" stroke="#0077B5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posts */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Posts</h3>
          <div className="space-y-4">
            {postPerformanceData.map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{post.title}</p>
                  <div className="flex space-x-4 mt-1">
                    <span className="text-xs text-white/60">❤️ {post.likes}</span>
                    <span className="text-xs text-white/60">🔄 {post.shares}</span>
                    <span className="text-xs text-white/60">💬 {post.comments}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {post.likes + post.shares + post.comments}
                  </div>
                  <div className="text-xs text-white/60">total</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Performance</h3>
          <div className="space-y-4">
            {analytics.platformData.map((platform, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    platform.platform === 'Twitter' ? 'bg-blue-500' :
                    platform.platform === 'Instagram' ? 'bg-pink-500' :
                    'bg-blue-600'
                  }`}></div>
                  <span className="text-sm font-medium text-white">{platform.platform}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{platform.engagement.toLocaleString()}</div>
                  <div className="text-xs text-white/60">{platform.posts} posts</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-green-300 mb-2">📈 Best Performing Time</h4>
            <p className="text-sm text-white/90">Your posts perform best on Thursdays at 2 PM. Consider scheduling more content during this time.</p>
          </div>
          <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">🎯 Content Strategy</h4>
            <p className="text-sm text-white/90">AI-generated content has 23% higher engagement. Continue leveraging AI for content creation.</p>
          </div>
          <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-300 mb-2">🌟 Platform Focus</h4>
            <p className="text-sm text-white/90">Instagram shows the highest growth potential. Consider increasing posting frequency there.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Analytics