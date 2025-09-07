import React from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar,
  Sparkles,
  BarChart3,
  ArrowUpRight,
  Clock
} from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'

const Dashboard = () => {
  const { analytics, posts, interactions } = useApp()
  const scheduledPosts = posts.filter(p => p.status === 'scheduled')
  const unreadInteractions = interactions.filter(i => !i.read)

  const stats = [
    {
      name: 'Total Posts',
      value: analytics.totalPosts,
      icon: BarChart3,
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Engagement',
      value: analytics.totalEngagement.toLocaleString(),
      icon: TrendingUp,
      change: '+8.5%',
      changeType: 'positive'
    },
    {
      name: 'Avg. Engagement',
      value: analytics.averageEngagement,
      icon: Users,
      change: '+4.3%',
      changeType: 'positive'
    },
    {
      name: 'Unread Messages',
      value: unreadInteractions.length,
      icon: MessageSquare,
      change: '+2',
      changeType: 'neutral'
    }
  ]

  const quickActions = [
    {
      name: 'Generate Content',
      description: 'Create AI-powered social posts',
      icon: Sparkles,
      href: '/generator',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Schedule Posts',
      description: 'Plan your content calendar',
      icon: Calendar,
      href: '/calendar',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'View Analytics',
      description: 'Track performance metrics',
      icon: BarChart3,
      href: '/analytics',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
          <p className="text-white/70 mt-1">Here's what's happening with your social media today.</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <Button variant="secondary" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            {scheduledPosts.length} Scheduled
          </Button>
          <Link to="/generator">
            <Button variant="primary" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
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
                      stat.changeType === 'positive' ? 'text-green-400' : 
                      stat.changeType === 'negative' ? 'text-red-400' : 'text-white/70'
                    }`}>
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link key={action.name} to={action.href}>
            <Card className="p-6 hover:bg-white/20 transition-all duration-200 cursor-pointer group">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">{action.name}</h3>
                  <p className="text-white/70 text-sm">{action.description}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/50 ml-auto group-hover:text-white transition-colors" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Posts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Posts</h3>
            <Link to="/calendar">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {scheduledPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{post.content}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {new Date(post.scheduledTime).toLocaleDateString()} • {post.platforms.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Interactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Interactions</h3>
            <Link to="/inbox">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {interactions.slice(0, 3).map((interaction) => (
              <div key={interaction.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${interaction.read ? 'bg-white/30' : 'bg-yellow-400'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{interaction.content}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {interaction.author} • {interaction.platform} • {new Date(interaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard