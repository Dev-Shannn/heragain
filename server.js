import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    const hfToken = process.env.VITE_HF_API_KEY;

    if (!hfToken) {
      return res.status(400).json({
        error: 'No HuggingFace API key configured',
      });
    }

    const SYSTEM_PROMPT = `You are a romantic AI assistant designed to celebrate someone's birthday. 
Your role is to:
1. Share heartfelt messages about love, appreciation, and celebration
2. Tell romantic stories and anecdotes
3. Create personalized birthday wishes
4. Be warm, sincere, and emotionally intelligent
5. Keep responses concise (1-3 paragraphs max)
6. Use emojis tastefully to add warmth
7. Adapt to the user's mood and questions

Always be genuine, poetic, and celebrate the beauty of the person you're talking to.`;

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const formattedInput = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n') + '\nASSISTANT:';

    console.log('🔄 Calling HuggingFace API...');

    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
      {
        headers: { Authorization: `Bearer ${hfToken}` },
        method: 'POST',
        body: JSON.stringify({
          inputs: formattedInput,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.9,
            top_p: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);

      if (response.status === 429 || response.status === 503) {
        const message = errorData.error || 'API rate limit reached. Please try again later.';
        return res.status(429).json({
          error: `Rate Limit: ${message}`,
        });
      }

      return res.status(response.status).json({
        error: errorData.error || 'Unknown API error',
      });
    }

    const data = await response.json();
    console.log('✅ Got HF response');

    let aiResponse = '';

    if (Array.isArray(data)) {
      aiResponse = data[0]?.generated_text || '';
    } else if (data.generated_text) {
      aiResponse = data.generated_text;
    }

    // Clean up the response
    aiResponse = aiResponse
      .replace(/\[.*?\]/g, '') // Remove special tokens
      .split('User:')[0] // Remove follow-up prompts
      .trim();

    if (!aiResponse) {
      return res.status(500).json({
        error: 'No content in API response',
      });
    }

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
