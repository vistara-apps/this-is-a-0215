import React, { useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import Card from '../components/Card'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'

const Calendar = () => {
  const { posts } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getPostsForDate = (date) => {
    return posts.filter(post => 
      isSameDay(new Date(post.scheduledTime), date)
    )
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const getPlatformColor = (platform) => {
    const colors = {
      twitter: 'bg-blue-500',
      instagram: 'bg-pink-500',
      linkedin: 'bg-blue-600',
      facebook: 'bg-blue-700'
    }
    return colors[platform] || 'bg-gray-500'
  }

  const selectedDatePosts = getPostsForDate(selectedDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <CalendarIcon className="w-8 h-8 mr-3" />
            Content Calendar
          </h1>
          <p className="text-white/70 mt-1">Plan and schedule your social media content</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(-1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-white/70">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(day => {
                const dayPosts = getPostsForDate(day)
                const isSelected = isSameDay(day, selectedDate)
                const isTodayDate = isToday(day)

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`relative p-2 min-h-[80px] text-left rounded-lg transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : isTodayDate
                        ? 'bg-white/20 text-white'
                        : 'hover:bg-white/10 text-white/70'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayPosts.slice(0, 2).map((post, index) => (
                        <div
                          key={index}
                          className="text-xs p-1 bg-white/20 rounded text-white truncate"
                          title={post.content}
                        >
                          {post.content.substring(0, 20)}...
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <div className="text-xs text-white/70">
                          +{dayPosts.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {format(selectedDate, 'EEEE, MMMM d')}
            </h3>

            {selectedDatePosts.length > 0 ? (
              <div className="space-y-4">
                {selectedDatePosts.map((post) => (
                  <div key={post.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium text-white">
                        {format(new Date(post.scheduledTime), 'h:mm a')}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs text-white ${
                        post.status === 'scheduled' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {post.status}
                      </div>
                    </div>
                    
                    <p className="text-white/90 text-sm mb-3 line-clamp-3">
                      {post.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {post.platforms.map((platform) => (
                        <span
                          key={platform}
                          className={`px-2 py-1 rounded-full text-xs text-white ${getPlatformColor(platform)}`}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                    
                    {post.aiGenerated && (
                      <div className="mt-2 flex items-center">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white text-xs">AI</span>
                        </div>
                        <span className="text-xs text-white/60">AI Generated</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/50 text-sm">No posts scheduled for this date</p>
                <Button variant="primary" size="sm" className="mt-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Total Posts</span>
                <span className="text-white font-medium">{posts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Scheduled</span>
                <span className="text-white font-medium">
                  {posts.filter(p => p.status === 'scheduled').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">AI Generated</span>
                <span className="text-white font-medium">
                  {posts.filter(p => p.aiGenerated).length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Calendar