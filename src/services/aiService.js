// AI Service for birthday chatbot
// REAL ChatGPT integration with message selection feature

const MESSAGE_OPTIONS = {
  admiration: [
    "You know what's crazy? A five-minute conversation with you can fix my whole day without you even trying.",
    "Some people are interesting to look at, but you’re interesting to know — that’s rarer.",
    "You don’t have to do anything special, just being yourself is enough to leave an impact."
  ],
  story: [
    "If someone had told me a random classmate would become one of the most memorable parts of my college life, I wouldn’t have believed it — until you happened.",
    "Our story isn’t dramatic, but it’s real — small conversations, jokes, looks… and somehow they became parts of my favourite memories.",
  ],
  funny: [
    "You’re dangerous — one minute you’re roasting me and the next minute you’re smiling like nothing happened. My brain can’t keep up 😆",
    "You really say ‘chup raho’ like it’s my nickname at this point 😭 but lowkey it’s funny too."
  ],
  memory: [
    "Some small random moments stay longer than big ones — and for some reason, the ones with you do.",
    "It’s funny how normal conversations with you become memories without even trying."
  ],
  future: [
    "I don’t know what the future looks like, but I know it will be interesting if you’re somewhere in it.",
    "No rush, no pressure — just letting life move… and seeing where it takes us."
  ],
  beautiful: [
    "Your looks will always get attention, but your personality is what actually makes you unforgettable.",
    "You’re beautiful, yes — but the real thing that stands out is how you carry yourself without trying to impress anyone."
  ]
};


export const AIService = {
  // Detect question type and return available message options
  getMessageOptions(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    const isLoveQuestion = lowerMessage.includes('admire') && lowerMessage.includes('you') && (lowerMessage.includes('you') || lowerMessage.includes('me'));
    const isStoryQuestion = (lowerMessage.includes("what's") || lowerMessage.includes('story')) && (lowerMessage.includes('your') || lowerMessage.includes('us'));
    const isFunnyQuestion = lowerMessage.includes('something funny') && lowerMessage.includes('hehe');
    const isMemoryQuestion = lowerMessage.includes('favorite') && lowerMessage.includes('memory');
    const isFutureQuestion = (lowerMessage.includes('dream') || lowerMessage.includes('future')) && (lowerMessage.includes('we') || lowerMessage.includes('us') || lowerMessage.includes('our'));
    const isBeautifulQuestion = lowerMessage.includes('beautiful') && (lowerMessage.includes('you') || lowerMessage.includes('me'));

    if (isLoveQuestion) {
      return { category: 'love', options: MESSAGE_OPTIONS.admiration };
    } else if (isStoryQuestion) {
      return { category: 'story', options: MESSAGE_OPTIONS.story };
    } else if (isFunnyQuestion) {
      return { category: 'funny', options: MESSAGE_OPTIONS.funny };
    } else if (isMemoryQuestion) {
      return { category: 'memory', options: MESSAGE_OPTIONS.memory };
    } else if (isFutureQuestion) {
      return { category: 'future', options: MESSAGE_OPTIONS.future };
    } else if (isBeautifulQuestion) {
      return { category: 'beautiful', options: MESSAGE_OPTIONS.beautiful };
    }
    
    return null; // No template match
  },

  async chat(userMessage, conversationHistory = []) {
    console.log('🤖 Starting AI Chat Service...');
    console.log('User Message:', userMessage);
    
    try {
      console.log('🔄 Attempting to use AI model...');
      const response = await this.callFreeAI(userMessage, conversationHistory);
      console.log('✅ Got AI response');
      return response;
    } catch (error) {
      console.error('❌ AI Error:', error.message);
      return `❌ I couldn't reach my AI brain right now (API error: ${error.message}).\n\nPlease try again in a moment. The API may be rate-limited or temporarily unavailable.`;
    }
  },

  async callFreeAI(userMessage, conversationHistory) {
    // Call our backend proxy instead of HF API directly (avoids CORS issues)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    
    console.log('🔐 Checking backend configuration...');
    console.log('📤 Calling backend API at:', backendUrl);

    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
        }),
      });

      console.log('📥 Response Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error Details:', errorData);
        
        // Handle rate limits
        if (response.status === 429 || response.status === 503) {
          const message = errorData.error || 'API rate limit reached. You can make requests again in a few moments.';
          throw new Error(`⏱️ Rate Limit: ${message}`);
        }
        
        throw new Error(`API Error (${response.status}): ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('📦 Response Data:', data);

      if (!data.response) {
        throw new Error('❌ No content in response');
      }

      console.log('✅ AI Response:', data.response.substring(0, 100) + '...');
      return data.response;
    } catch (fetchError) {
      console.error('❌ Fetch Error:', fetchError.message);
      throw fetchError;
    }
  },

  formatMessageForLLM(messages) {
    // Format messages for Llama chat model
    return messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n') + '\nASSISTANT:';
  },


};
