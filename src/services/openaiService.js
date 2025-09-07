import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled by backend
})

export const generateContent = async ({ prompt, tone = 'professional', platform = 'all', maxLength = 280 }) => {
  try {
    const platformContext = {
      twitter: 'Twitter (280 characters max, use hashtags, engaging)',
      instagram: 'Instagram (longer form, visual focus, use emojis and hashtags)',
      linkedin: 'LinkedIn (professional, thought leadership, industry insights)',
      facebook: 'Facebook (conversational, community-focused)',
      all: 'social media (versatile for multiple platforms)'
    }

    const toneContext = {
      professional: 'professional and authoritative',
      casual: 'casual and friendly',
      creative: 'creative and inspiring',
      humorous: 'humorous and entertaining'
    }

    const systemPrompt = `You are a social media content expert. Create engaging ${toneContext[tone]} content for ${platformContext[platform] || platformContext.all}. 
    
    Guidelines:
    - Keep it under ${maxLength} characters if specified
    - Include relevant hashtags (3-5 max)
    - Make it engaging and shareable
    - Match the tone: ${tone}
    - Optimize for ${platform === 'all' ? 'multiple platforms' : platform}
    
    Return ONLY the content, no explanations.`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content?.trim()
    
    // Extract hashtags from content
    const hashtagRegex = /#[\w]+/g
    const hashtags = content.match(hashtagRegex) || []
    
    return {
      content,
      hashtags,
      usage: response.usage
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('Failed to generate content. Please try again.')
  }
}

export const generateHashtags = async (content, count = 5) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Generate ${count} relevant hashtags for the following social media content. Return only hashtags separated by spaces, no explanations.`
        },
        { role: 'user', content }
      ],
      max_tokens: 50,
      temperature: 0.5,
    })

    const hashtagsText = response.choices[0]?.message?.content?.trim()
    return hashtagsText.split(' ').filter(tag => tag.startsWith('#'))
  } catch (error) {
    console.error('Error generating hashtags:', error)
    return []
  }
}

export const suggestImages = async (content) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Based on the social media content, suggest 3 image concepts that would work well. Be specific and descriptive. Return as a JSON array of strings.'
        },
        { role: 'user', content }
      ],
      max_tokens: 100,
      temperature: 0.6,
    })

    const suggestions = response.choices[0]?.message?.content?.trim()
    try {
      return JSON.parse(suggestions)
    } catch {
      return suggestions.split('\n').filter(s => s.trim())
    }
  } catch (error) {
    console.error('Error suggesting images:', error)
    return []
  }
}
