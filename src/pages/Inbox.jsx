import React, { useState } from 'react'
import { MessageCircle, Reply, MoreHorizontal, Filter, Search } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'

const Inbox = () => {
  const { interactions, markInteractionAsRead } = useApp()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedInteraction, setSelectedInteraction] = useState(null)
  const [replyText, setReplyText] = useState('')

  const filteredInteractions = interactions.filter(interaction => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'unread') return !interaction.read
    return interaction.type === selectedFilter
  })

  const handleSelectInteraction = (interaction) => {
    setSelectedInteraction(interaction)
    if (!interaction.read) {
      markInteractionAsRead(interaction.id)
    }
  }

  const handleReply = () => {
    if (!replyText.trim() || !selectedInteraction) return
    
    // In a real app, this would send the reply via the platform's API
    console.log('Sending reply:', replyText, 'to', selectedInteraction.author)
    setReplyText('')
    alert('Reply sent successfully!')
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

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'comment': return '💬'
      case 'message': return '📩'
      case 'mention': return '🏷️'
      default: return '💬'
    }
  }

  const filters = [
    { id: 'all', label: 'All', count: interactions.length },
    { id: 'unread', label: 'Unread', count: interactions.filter(i => !i.read).length },
    { id: 'comment', label: 'Comments', count: interactions.filter(i => i.type === 'comment').length },
    { id: 'message', label: 'Messages', count: interactions.filter(i => i.type === 'message').length },
    { id: 'mention', label: 'Mentions', count: interactions.filter(i => i.type === 'mention').length }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <MessageCircle className="w-8 h-8 mr-3" />
            Unified Inbox
          </h1>
          <p className="text-white/70 mt-1">Manage all your social media interactions in one place</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters & Interaction List */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            {/* Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white/90 mb-3">Filter by Type</h3>
              <div className="space-y-1">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedFilter === filter.id
                        ? 'bg-primary-600 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="capitalize">{filter.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedFilter === filter.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interaction List */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white/90 mb-3">
                {filteredInteractions.length} Interactions
              </h3>
              
              {filteredInteractions.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredInteractions.map((interaction) => (
                    <button
                      key={interaction.id}
                      onClick={() => handleSelectInteraction(interaction)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedInteraction?.id === interaction.id
                          ? 'bg-primary-600/20 border-primary-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{getInteractionIcon(interaction.type)}</span>
                          <span className="text-xs font-medium text-white/90">
                            {interaction.author}
                          </span>
                          {!interaction.read && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getPlatformColor(interaction.platform)}`}>
                          {interaction.platform}
                        </span>
                      </div>
                      
                      <p className="text-sm text-white/70 line-clamp-2 mb-2">
                        {interaction.content}
                      </p>
                      
                      <div className="text-xs text-white/50">
                        {new Date(interaction.timestamp).toLocaleDateString()} • {new Date(interaction.timestamp).toLocaleTimeString()}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/50 text-sm">No interactions found</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Interaction Detail & Reply */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {selectedInteraction ? (
              <div className="space-y-6">
                {/* Interaction Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {selectedInteraction.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{selectedInteraction.author}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getPlatformColor(selectedInteraction.platform)}`}>
                          {selectedInteraction.platform}
                        </span>
                        <span className="text-xs text-white/60 capitalize">
                          {selectedInteraction.type}
                        </span>
                        <span className="text-xs text-white/60">
                          {new Date(selectedInteraction.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Interaction Content */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white leading-relaxed">
                    {selectedInteraction.content}
                  </p>
                </div>

                {/* Original Post Context (if applicable) */}
                {selectedInteraction.postId && (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-sm font-medium text-white/90 mb-2">In response to:</h4>
                    <p className="text-white/70 text-sm italic">
                      "Just launched our new AI-powered content generator! 🚀 #AI #SocialMedia #Innovation"
                    </p>
                  </div>
                )}

                {/* Reply Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <Reply className="w-5 h-5 mr-2" />
                    Reply
                  </h4>
                  
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-white/60">
                      Reply will be sent to {selectedInteraction.platform}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Save Draft
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Select an Interaction</h3>
                <p className="text-white/50">
                  Choose an interaction from the list to view details and reply
                </p>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          {selectedInteraction && (
            <Card className="p-6 mt-6">
              <h4 className="text-sm font-semibold text-white/90 mb-3">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">👍 Like</Button>
                <Button variant="outline" size="sm">❤️ Love</Button>
                <Button variant="outline" size="sm">🎉 Celebrate</Button>
                <Button variant="outline" size="sm">🤔 Think</Button>
                <Button variant="outline" size="sm">📌 Pin</Button>
                <Button variant="outline" size="sm">🔔 Follow</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Inbox