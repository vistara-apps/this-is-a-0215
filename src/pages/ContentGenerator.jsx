import React, { useState } from 'react'
import { Sparkles, Copy, RefreshCw, Send, Hash, Image, Wand2 } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'
import { generateContent, generateHashtags, suggestImages } from '../services/openaiService'
import toast from 'react-hot-toast'

const ContentGenerator = () => {
  const { addPost } = useApp()
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('professional')
  const [platform, setPlatform] = useState('all')
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedHashtags, setGeneratedHashtags] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter'])

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate content')
      return
    }

    setIsGenerating(true)
    
    try {
      const result = await generateContent({
        prompt,
        tone,
        platform,
        maxLength: platform === 'twitter' ? 280 : 2000
      })
      
      setGeneratedContent(result.content)
      setGeneratedHashtags(result.hashtags)
      
      toast.success('Content generated successfully!')
      
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error(error.message)
      setGeneratedContent('')
      setGeneratedHashtags([])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSchedulePost = () => {
    if (!generatedContent) return

    const newPost = {
      content: generatedContent + ' ' + generatedHashtags.join(' '),
      platforms: selectedPlatforms,
      scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      aiGenerated: true,
      hashtags: generatedHashtags
    }

    addPost(newPost)
    
    // Reset form
    setPrompt('')
    setGeneratedContent('')
    setGeneratedHashtags([])
    
    alert('Post scheduled successfully!')
  }

  const tones = [
    { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
    { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { value: 'creative', label: 'Creative', description: 'Artistic and expressive' },
    { value: 'humorous', label: 'Humorous', description: 'Fun and entertaining' }
  ]

  const platforms = [
    { value: 'twitter', label: 'Twitter', color: 'bg-blue-500' },
    { value: 'instagram', label: 'Instagram', color: 'bg-pink-500' },
    { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-600' },
    { value: 'facebook', label: 'Facebook', color: 'bg-blue-700' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Sparkles className="w-8 h-8 mr-3" />
          AI Content Generator
        </h1>
        <p className="text-white/70 mt-1">Create engaging social media posts with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            Create Your Post
          </h2>

          {/* Prompt Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                What would you like to post about?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your topic, keywords, or brief description..."
                className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              />
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Tone & Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tones.map((toneOption) => (
                  <button
                    key={toneOption.value}
                    onClick={() => setTone(toneOption.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      tone === toneOption.value
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-sm">{toneOption.label}</div>
                    <div className="text-xs opacity-70">{toneOption.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Target Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platformOption) => (
                  <button
                    key={platformOption.value}
                    onClick={() => {
                      setSelectedPlatforms(prev => 
                        prev.includes(platformOption.value)
                          ? prev.filter(p => p !== platformOption.value)
                          : [...prev, platformOption.value]
                      )
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedPlatforms.includes(platformOption.value)
                        ? `${platformOption.color} text-white`
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {platformOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateContent}
              disabled={!prompt.trim() || isGenerating}
              loading={isGenerating}
              className="w-full"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>
          </div>
        </Card>

        {/* Generated Content Panel */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Generated Content
          </h2>

          {generatedContent ? (
            <div className="space-y-4">
              {/* Generated Text */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Post Content
                </label>
                <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
                  <p className="text-white text-sm leading-relaxed">{generatedContent}</p>
                </div>
              </div>

              {/* Generated Hashtags */}
              {generatedHashtags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    Suggested Hashtags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-600/30 text-primary-200 text-xs rounded-md"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => navigator.clipboard.writeText(generatedContent + ' ' + generatedHashtags.join(' '))}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={generateContent}
                  variant="outline"
                  size="sm"
                  disabled={isGenerating}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleSchedulePost}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/50">
                Enter a prompt and click "Generate Content" to create your AI-powered social media post
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Tips for Better Content Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-primary-600/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Hash className="w-5 h-5 text-primary-300" />
            </div>
            <h4 className="text-sm font-medium text-white mb-1">Be Specific</h4>
            <p className="text-xs text-white/60">Include specific topics, products, or events for targeted content</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-primary-600/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Wand2 className="w-5 h-5 text-primary-300" />
            </div>
            <h4 className="text-sm font-medium text-white mb-1">Use Keywords</h4>
            <p className="text-xs text-white/60">Include relevant keywords for better SEO and discoverability</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-primary-600/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <RefreshCw className="w-5 h-5 text-primary-300" />
            </div>
            <h4 className="text-sm font-medium text-white mb-1">Iterate</h4>
            <p className="text-xs text-white/60">Generate multiple versions to find the perfect tone and style</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-primary-600/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Image className="w-5 h-5 text-primary-300" />
            </div>
            <h4 className="text-sm font-medium text-white mb-1">Add Context</h4>
            <p className="text-xs text-white/60">Mention your audience, industry, or campaign goals for relevance</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ContentGenerator
