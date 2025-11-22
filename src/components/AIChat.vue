<template>
  <div class="chat-container">
    <ScrollAlert v-if="showScrollAlert" :message="'📱 Scroll down to see chat and navigate'" @close="showScrollAlert = false" />
    
    <button class="btn-back-chat" @click="$emit('back')">← Back</button>

    <div class="chat-box glass" :class="{ 'has-nav': showNavigation }">
      <div class="chat-header">
        <h2>💬 AI Conversation</h2>
        <p class="subtitle">Let's chat and celebrate this beautiful day</p>
      </div>

      <div class="messages-container" ref="messagesContainer">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
          <div v-if="msg.type === 'ai'" class="message-avatar">🤖</div>
          <div class="message-bubble">
            <div class="message-content">{{ msg.text }}</div>
            <div class="message-time">{{ formatTime(msg.time) }}</div>
          </div>
          <div v-if="msg.type === 'user'" class="message-avatar user">💕</div>
        </div>
        
        <div v-if="isLoading" class="message ai">
          <div class="message-avatar">🤖</div>
          <div class="message-bubble">
            <div class="spinner-small"></div>
          </div>
        </div>
      </div>

      <!-- Show question options if available -->
      <div v-if="questionOptions && questionOptions.length > 0" class="question-options">
        <p class="options-label">What would you like to ask?</p>
        <button 
          v-for="(option, idx) in questionOptions" 
          :key="idx"
          class="question-option-btn"
          @click="askQuestion(option)"
        >
          {{ option }}
        </button>
      </div>

      <div class="input-area" v-if="!questionOptions || questionOptions.length === 0">
        <p class="placeholder-text">💭 Choose a question above to continue...</p>
      </div>
    </div>

    <button v-if="messages.length > 5 && showNavigation" class="btn-birthday" @click="$emit('next')">
      Click here  🎉
    </button>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { AIService } from '../services/aiService.js'
import ScrollAlert from './ScrollAlert.vue'

export default {
  name: 'AIChat',
  components: {
    ScrollAlert,
  },
  emits: ['next', 'back'],
  setup() {
    const messages = ref([
      {
        type: 'ai',
        text: 'Hi Manisha ji ',
        time: new Date(),
      },
    ])
    const isLoading = ref(false)
    const messagesContainer = ref(null)
    const showScrollAlert = ref(true)
    const showNavigation = ref(false)
    const questionOptions = ref([
      "Do you admire me ?",
      "what's your story?",
      "something funny hehe!",
      "What's your favorite memory with me  ?",
    ])
    
    // Show navigation after 2 seconds to prompt scrolling on mobile
    setTimeout(() => {
      showNavigation.value = true
    }, 2000)

    const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const askQuestion = async (question) => {
      messages.value.push({
        type: 'user',
        text: question,
        time: new Date(),
      })

      isLoading.value = true
      questionOptions.value = []

      await nextTick()
      scrollToBottom()

      try {
        const conversationHistory = messages.value
          .filter((m) => m.type !== 'loading')
          .map((m) => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.text,
          }))

        console.log('📨 Sending to AIService:', question);
        
        // Get a random response from available options or ask AI
        const options = AIService.getMessageOptions(question)
        let aiResponse
        
        if (options && options.options.length > 0) {
          // Select a random message from options
          console.log('✅ Found message options for this question');
          aiResponse = options.options[Math.floor(Math.random() * options.options.length)]
        } else {
          // Ask AI if no predefined options
          aiResponse = await AIService.chat(question, conversationHistory)
          console.log('✅ Got response from AIService');
        }

        isLoading.value = false
        messages.value.push({
          type: 'ai',
          text: aiResponse,
          time: new Date(),
        })

        // Show question options again
        questionOptions.value = [
          "Do you admire me ?",
          "what's your story?",
          "something funny hehe!",
          "What's your favorite memory with me  ?",
        ]

        await nextTick()
        scrollToBottom()
      } catch (error) {
        isLoading.value = false
        const errorMessage = error.message || error.toString();
        console.error('❌ Chat error:', errorMessage)
        
        // Build helpful error message
        let displayText = `❌ ${errorMessage}`;
        
        // Special handling for rate limit
        if (errorMessage.includes('Rate Limit') || errorMessage.includes('limit')) {
          displayText = `⏱️ Rate Limited!\n\n${errorMessage}\n\n💡 Tip: Free API has limited requests. Wait a moment and try again!`;
        }
        
        messages.value.push({
          type: 'ai',
          text: displayText,
          time: new Date(),
        })

        // Show question options again
        questionOptions.value = [
          "Do you admire me ?",
          "what's your story?",
          "something funny hehe!",
          "What's your favorite memory with me  ?",
        ]
      }
    }

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    return {
      messages,
      isLoading,
      askQuestion,
      formatTime,
      messagesContainer,
      questionOptions,
      showScrollAlert,
      showNavigation,
    }
  },
}
</script>

<style scoped>
.chat-container {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.btn-back-chat {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  z-index: 10;
}

.btn-back-chat:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.chat-box {
  width: 100%;
  max-width: 800px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 75vh;
  max-height: 90vh;
  animation: fadeIn 0.6s ease-out;
  transition: transform 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
}

.chat-box.has-nav {
  transform: scale(0.9);
  transform-origin: center top;
}

.chat-header {
  text-align: center;
  margin-bottom: 15px;
  flex-shrink: 0;
}

.chat-header h2 {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 5px;
}

.chat-header .subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  animation: slideIn 0.4s ease-out;
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message.user {
  justify-content: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.message-avatar.user {
  font-size: 1.6rem;
}

.message-bubble {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.message-content {
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 12px;
  word-wrap: break-word;
  font-size: 0.85rem;
  line-height: 1.4;
  animation: slideIn 0.3s ease-out;
}

.message.ai .message-content {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.3) 0%, rgba(0, 242, 254, 0.3) 100%);
  color: white;
  border-left: 3px solid #4facfe;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
}

.message-time {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 0 6px;
}

.message.user .message-time {
  text-align: right;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.input-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  min-height: 50px;
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: 0;
  text-align: center;
}

.input-field {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-field:focus {
  background: rgba(255, 255, 255, 0.25);
}

.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-send {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(79, 172, 254, 0.4);
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(79, 172, 254, 0.6);
}

.btn-send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.question-options {
  margin: 0;
  padding: 12px;
  background: rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  border-left: 4px solid #667eea;
  flex-shrink: 0;
}

.question-options .options-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-weight: 600;
}

.question-option-btn {
  display: block;
  width: 100%;
  background: rgba(102, 126, 234, 0.2);
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(102, 126, 234, 0.5);
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  margin-top: 6px;
  text-align: left;
  line-height: 1.3;
  font-weight: 500;
}

.question-option-btn:hover {
  background: rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.8);
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.message-options {
  margin: 15px 0;
  padding: 15px;
  background: rgba(79, 172, 254, 0.15);
  border-radius: 15px;
  border-left: 4px solid #4facfe;
}

.options-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
  font-weight: 600;
}

.message-option-btn {
  display: block;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(79, 172, 254, 0.4);
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  margin-top: 8px;
  text-align: left;
  line-height: 1.4;
  overflow-y: auto;
  max-height: 100px;
}

.message-option-btn:hover {
  background: rgba(79, 172, 254, 0.3);
  border-color: rgba(79, 172, 254, 0.7);
  transform: translateX(5px);
}

.btn-birthday {
  margin-top: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid white;
  padding: 8px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-birthday:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .btn-back-chat {
    top: 12px;
    left: 12px;
    padding: 9px 15px;
    font-size: 0.8rem;
  }

  .chat-box {
    min-height: auto;
    height: 70vh;
    max-height: 75vh;
    padding: 5px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .chat-header {
    text-align: center;
    margin-bottom: 8px;
  }

  .chat-header h2 {
    font-size: 1.5rem;
    margin-bottom: 2px;
  }

  .chat-header .subtitle {
    font-size: 0.9rem;
    display: none;
  }

  .messages-container {
    gap: 10px;
    padding: 8px;
    margin-bottom: 10px;
  }

  .message {
    gap: 8px;
  }

  .message-avatar {
    font-size: 1.6rem;
  }

  .message-avatar.user {
    font-size: 1.4rem;
  }

  .message-content {
    max-width: 88%;
    padding: 8px 11px;
    font-size: 0.88rem;
    border-radius: 11px;
  }

  .message-time {
    font-size: 0.7rem;
  }

  .question-options {
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 12px;
  }

  .question-options .options-label {
    font-size: 0.78rem;
    margin-bottom: 8px;
  }

  .question-option-btn {
    padding: 10px 11px;
    font-size: 0.84rem;
    margin-top: 6px;
    border-radius: 8px;
  }

  .input-area {
    padding: 12px;
  }

  .placeholder-text {
    font-size: 0.9rem;
  }

  .btn-birthday {
    margin-top: 0;
    padding: 7px 18px;
    font-size: 0.95rem;
  }
}

/* Extra small devices (320px - 480px) */
@media (max-width: 480px) {
  .btn-back-chat {
    top: 10px;
    left: 10px;
    padding: 7px 11px;
    font-size: 0.75rem;
  }

  .chat-box {
    min-height: auto;
    height: 68vh;
    max-height: 72vh;
    padding: 4px;
    max-width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .chat-header {
    margin-bottom: 6px;
  }

  .chat-header h2 {
    font-size: 1.15rem;
    margin-bottom: 1px;
  }

  .chat-header .subtitle {
    font-size: 0.78rem;
    display: none;
  }

  .messages-container {
    gap: 8px;
    padding: 6px;
    margin-bottom: 8px;
  }

  .message {
    gap: 6px;
  }

  .message-avatar {
    font-size: 1.3rem;
  }

  .message-avatar.user {
    font-size: 1.1rem;
  }

  .message-content {
    max-width: 87%;
    padding: 7px 9px;
    font-size: 0.8rem;
    border-radius: 9px;
    line-height: 1.35;
  }

  .message-time {
    font-size: 0.65rem;
  }

  .spinner-small {
    width: 18px;
    height: 18px;
  }

  .question-options {
    padding: 11px;
    margin-bottom: 10px;
    border-radius: 10px;
  }

  .question-options .options-label {
    font-size: 0.72rem;
    margin-bottom: 6px;
  }

  .question-option-btn {
    padding: 8px 9px;
    font-size: 0.78rem;
    margin-top: 5px;
    border-radius: 7px;
    line-height: 1.3;
  }

  .input-area {
    padding: 10px;
    min-height: 45px;
  }

  .placeholder-text {
    font-size: 0.78rem;
  }

  .btn-birthday {
    margin-top: 0;
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}

/* Small tablets (481px - 768px) */
@media (max-width: 768px) and (min-width: 481px) {
  .btn-back-chat {
    top: 12px;
    left: 12px;
    padding: 8px 14px;
    font-size: 0.82rem;
  }

  .chat-box {
    min-height: auto;
    height: 70vh;
    max-height: 74vh;
    padding: 5px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .chat-header {
    margin-bottom: 8px;
  }

  .chat-header h2 {
    font-size: 1.35rem;
    margin-bottom: 2px;
  }

  .chat-header .subtitle {
    font-size: 0.88rem;
    display: none;
  }

  .messages-container {
    gap: 9px;
    padding: 7px;
  }

  .message-avatar {
    font-size: 1.5rem;
  }

  .message-avatar.user {
    font-size: 1.3rem;
  }

  .message-content {
    max-width: 88%;
    padding: 8px 10px;
    font-size: 0.83rem;
    line-height: 1.4;
  }

  .question-options {
    padding: 12px;
    border-radius: 11px;
  }

  .question-options .options-label {
    font-size: 0.77rem;
    margin-bottom: 7px;
  }

  .question-option-btn {
    padding: 9px 10px;
    font-size: 0.81rem;
    margin-top: 5px;
    border-radius: 8px;
  }

  .btn-birthday {
    margin-top: 0;
    padding: 7px 20px;
    font-size: 0.93rem;
  }
}

/* Landscape orientation */
@media (max-height: 500px) and (orientation: landscape) {
  .btn-back-chat {
    top: 8px;
    left: 8px;
    padding: 6px 10px;
    font-size: 0.7rem;
  }

  .chat-box {
    min-height: auto;
    max-height: 80vh;
    padding: 11px;
  }

  .chat-header {
    margin-bottom: 7px;
  }

  .chat-header h2 {
    font-size: 1rem;
    margin-bottom: 2px;
  }

  .chat-header .subtitle {
    font-size: 0.7rem;
    display: none;
  }

  .messages-container {
    gap: 6px;
    padding: 5px;
    margin-bottom: 6px;
    min-height: 250px;
  }

  .message-avatar {
    font-size: 1.2rem;
  }

  .message-avatar.user {
    font-size: 1rem;
  }

  .message-content {
    max-width: 85%;
    font-size: 0.75rem;
    padding: 5px 8px;
    border-radius: 8px;
    line-height: 1.3;
  }

  .message-time {
    font-size: 0.6rem;
  }

  .question-options {
    padding: 10px;
    margin-bottom: 8px;
    border-radius: 10px;
  }

  .question-options .options-label {
    font-size: 0.7rem;
    margin-bottom: 4px;
  }

  .question-option-btn {
    padding: 6px 8px;
    font-size: 0.73rem;
    margin-top: 3px;
    border-radius: 6px;
    line-height: 1.25;
  }

  .btn-birthday {
    padding: 9px 18px;
    font-size: 0.78rem;
    margin-top: 5px;
  }
}
</style>
