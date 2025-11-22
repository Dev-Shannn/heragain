<template>
  <div class="story-container">
    <ScrollAlert
      v-if="showScrollAlert"
      :message="'📱 Scroll down to see navigation buttons and continue'"
      @close="showScrollAlert = false"
    />

    <button class="btn-back" @click="$emit('back')">← Back</button>

    <div class="story-content" :class="{ 'has-nav': showNavigation }">
      <div class="story-header">
        <h2 class="gradient-text">✨ For Manisha ✨</h2>
        <p class="story-subtitle">
          A small story from my side… about you, about us, and the way you changed my world.
        </p>
      </div>

      <div class="story-scenes">
        <div
          v-for="(scene, index) in scenes"
          :key="index"
          :class="['scene', { active: currentScene === index }]"
        >
          <div class="scene-image-large">{{ scene.image }}</div>
          <div class="scene-header-small">
            <div class="scene-number">Part {{ index + 1 }}</div>
            <div class="scene-emoji">{{ scene.emoji }}</div>
          </div>
          <h3>{{ scene.title }}</h3>
          <p>{{ scene.content }}</p>
        </div>
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: ((currentScene + 1) / scenes.length * 100) + '%' }"
        ></div>
      </div>

      <div class="scene-navigation" v-if="showNavigation">
        <button
          class="btn-nav btn-prev"
          @click="previousScene"
          :disabled="currentScene === 0"
        >
          ← Previous
        </button>

        <span class="scene-indicator">
          {{ currentScene + 1 }} / {{ scenes.length }}
        </span>

        <button
          class="btn-nav btn-next"
          @click="nextScene"
          :disabled="currentScene === scenes.length - 1"
        >
          Next →
        </button>
      </div>

      <button
        v-if="currentScene === scenes.length - 1 && showNavigation"
        class="btn-continue"
        @click="$emit('next')"
      >
        Let\'s Chat 💬
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import ScrollAlert from './ScrollAlert.vue'

export default {
  name: 'StorySection',
  components: {
    ScrollAlert,
  },
  emits: ['next', 'back'],
  setup() {
    const currentScene = ref(0)
    const showScrollAlert = ref(true)
    const showNavigation = ref(false)
    let hideTimer = null

    const scenes = [
      {
        emoji: '👀',
        title: 'The First Glimpse',
        content:
          'I still remember the first time I really noticed you, Manisha. It wasn\'t some filmy slow-motion moment, but for me… time actually slowed a little.  I didn\'t say it out loud, but from that day, my day in college started feeling incomplete without seeing you at least once.',
        image: '✨',
      },
      {
        emoji: '🍫',  
        title: 'Small Moments, Big Feelings',
        content:
          'Some moments with you are so small the world would never pause for them, yet they stay with me longer than whole days—a smile, a joke, a glance, a simple conversation that shouldn’t mean anything but somehow becomes something I keep tucked in my mind for later."',
        image: '🍀',
      },
      {
        emoji: '🌧️',
        title: 'The Way I See You',
        content:
          'The world sees your smile, but I see the storms you survived, the silence behind your laughter, the strength you learned too early, the weight you carry quietly, and I didn’t fall for the smile they notice—I fell for the soul only I could see.',
        image: '💫',
      },
      {
        emoji: '📝',
        title: 'verbalizing the Unspoken',
        content:
          'you are so much more than words can capture, but I hope this little story gives you a glimpse of how deeply you are seen, appreciated, and cherished.',
        image: '🕊️',
      },
    ]

    onMounted(() => {
      // Show navigation after 2 seconds to prompt scrolling on mobile
      hideTimer = setTimeout(() => {
        showNavigation.value = true
      }, 2000)

      return () => {
        if (hideTimer) clearTimeout(hideTimer)
      }
    })

    const nextScene = () => {
      if (currentScene.value < scenes.length - 1) {
        currentScene.value++
      }
    }

    const previousScene = () => {
      if (currentScene.value > 0) {
        currentScene.value--
      }
    }

    return {
      currentScene,
      scenes,
      nextScene,
      previousScene,
      showScrollAlert,
      showNavigation,
    }
  },
}
</script>

<style scoped>
.story-container {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.btn-back {
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

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.story-content {
  max-width: 700px;
  width: 100%;
  position: relative;
  transition: transform 0.3s ease;
}

.story-content.has-nav {
  transform: scale(0.9);
  transform-origin: center top;
}

.story-header {
  text-align: center;
  margin-bottom: 30px;
}

.story-header h2 {
  font-size: 2.5rem;
  animation: fadeIn 0.8s ease-out;
}

.story-subtitle {
  margin-top: 8px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.story-scenes {
  position: relative;
  height: 450px;
  margin-bottom: 40px;
  overflow: hidden;
}

.scene {
  position: absolute;
  width: 100%;
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  background: rgba(255, 255, 255, 0.08);
  padding: 50px 40px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  min-height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 100%;
}

.scene.active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.scene-image-large {
  font-size: 6rem;
  text-align: center;
  margin-bottom: 30px;
  animation: float 3s ease-in-out infinite;
}

.scene-header-small {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.scene-number {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.scene-emoji {
  font-size: 1.5rem;
}

.scene h3 {
  font-size: 2rem;
  color: white;
  margin-bottom: 20px;
  font-weight: 700;
  text-align: center;
}

.scene p {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.8;
  text-align: center;
}

.progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin-bottom: 30px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  transition: width 0.6s ease;
}

.scene-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 15px;
}

.btn-nav {
  background: linear-gradient(
    135deg,
    rgba(79, 172, 254, 0.2) 0%,
    rgba(0, 242, 254, 0.2) 100%
  );
  color: white;
  border: 2px solid rgba(79, 172, 254, 0.5);
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
}

.btn-nav:hover:not(:disabled) {
  background: linear-gradient(
    135deg,
    rgba(79, 172, 254, 0.4) 0%,
    rgba(0, 242, 254, 0.4) 100%
  );
  border-color: rgba(79, 172, 254, 1);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(79, 172, 254, 0.3);
}

.btn-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.scene-indicator {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 700;
  min-width: 60px;
  text-align: center;
}

.btn-continue {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid white;
  padding: 15px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  font-weight: 700;
  animation: fadeIn 0.8s ease-out;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-continue:hover {
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

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@media (max-width: 600px) {
  .story-container {
    padding: 15px;
  }

  .btn-back {
    top: 12px;
    left: 12px;
    padding: 9px 15px;
    font-size: 0.85rem;
  }

  .story-header h2 {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .story-subtitle {
    font-size: 0.9rem;
  }

  .story-scenes {
    height: auto;
    min-height: 380px;
    margin-bottom: 25px;
    overflow: visible;
  }

  .scene {
    padding: 30px 20px;
    min-height: 380px;
    border-radius: 20px;
  }

  .scene-image-large {
    font-size: 5rem;
    margin-bottom: 20px;
  }

  .scene h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  .scene p {
    font-size: 0.98rem;
    line-height: 1.6;
  }

  .progress-bar {
    height: 3px;
    margin-bottom: 20px;
  }

  .scene-navigation {
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }

  .btn-nav {
    padding: 10px 18px;
    font-size: 0.9rem;
    flex: 1;
    min-width: 100px;
  }

  .scene-indicator {
    font-size: 0.95rem;
  }

  .btn-continue {
    padding: 5px;
    font-size: 1rem;
    border-radius: 20px;
  }
}

/* Extra small devices (320px - 480px) */
@media (max-width: 480px) {
  .story-container {
    padding: 12px;
    padding-top: 50px;
    min-height: 100vh;
  }

  .btn-back {
    top: 10px;
    left: 10px;
    padding: 8px 12px;
    font-size: 0.75rem;
  }

  .story-header {
    margin-bottom: 18px;
  }

  .story-header h2 {
    font-size: 1.6rem;
  }

  .story-subtitle {
    font-size: 0.85rem;
  }

  .story-scenes {
    height: auto;
    min-height: 340px;
    margin-bottom: 18px;
    overflow: visible;
  }

  .scene {
    padding: 22px 15px;
    min-height: 340px;
    border-radius: 15px;
  }

  .scene-image-large {
    font-size: 4rem;
    margin-bottom: 12px;
  }

  .scene-header-small {
    gap: 10px;
    margin-bottom: 10px;
  }

  .scene-number {
    font-size: 0.65rem;
    letter-spacing: 0.2px;
  }

  .scene-emoji {
    font-size: 1.2rem;
  }

  .scene h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  .scene p {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .progress-bar {
    height: 2px;
    margin-bottom: 15px;
  }

  .scene-navigation {
    gap: 8px;
    margin-bottom: 15px;
  }

  .btn-nav {
    padding: 8px 12px;
    font-size: 0.8rem;
    flex: 1;
    min-width: 80px;
  }

  .scene-indicator {
    font-size: 0.8rem;
    min-width: 45px;
  }

  .btn-continue {
    padding: 5px;
    font-size: 0.9rem;
    border-radius: 18px;
  }
}

/* Small tablets (481px - 768px) */
@media (max-width: 768px) and (min-width: 481px) {
  .story-container {
    padding: 16px;
  }

  .btn-back {
    top: 12px;
    left: 12px;
    padding: 9px 15px;
    font-size: 0.82rem;
  }

  .story-header h2 {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }

  .story-scenes {
    height: auto;
    min-height: 370px;
    margin-bottom: 25px;
    overflow: visible;
  }

  .scene {
    padding: 28px 20px;
    min-height: 370px;
    border-radius: 18px;
  }

  .scene-image-large {
    font-size: 4.5rem;
    margin-bottom: 18px;
  }

  .scene h3 {
    font-size: 1.3rem;
    margin-bottom: 12px;
  }

  .scene p {
    font-size: 0.96rem;
    line-height: 1.55;
  }

  .btn-nav {
    padding: 10px 16px;
    font-size: 0.87rem;
  }

  .scene-indicator {
    font-size: 0.92rem;
  }

  .btn-continue {
    padding: 5px;
    font-size: 0.98rem;
  }
}

/* Landscape orientation */
@media (max-height: 500px) and (orientation: landscape) {
  .story-container {
    padding: 8px;
    min-height: auto;
  }

  .btn-back {
    top: 8px;
    left: 8px;
    padding: 6px 10px;
    font-size: 0.7rem;
  }

  .story-header {
    margin-bottom: 10px;
  }

  .story-header h2 {
    font-size: 1.3rem;
  }

  .story-subtitle {
    font-size: 0.78rem;
  }

  .story-scenes {
    height: auto;
    min-height: 260px;
    margin-bottom: 12px;
    overflow: visible;
  }

  .scene {
    padding: 14px 12px;
    min-height: 260px;
    border-radius: 12px;
  }

  .scene-image-large {
    font-size: 2.2rem;
    margin-bottom: 8px;
  }

  .scene-header-small {
    gap: 8px;
    margin-bottom: 8px;
  }

  .scene-number {
    font-size: 0.6rem;
  }

  .scene-emoji {
    font-size: 0.95rem;
  }

  .scene h3 {
    font-size: 0.95rem;
    margin-bottom: 6px;
  }

  .scene p {
    font-size: 0.8rem;
    line-height: 1.35;
  }

  .progress-bar {
    height: 2px;
    margin-bottom: 10px;
  }

  .scene-navigation {
    gap: 8px;
    margin-bottom: 12px;
  }

  .btn-nav {
    padding: 5px 10px;
    font-size: 0.7rem;
  }

  .scene-indicator {
    font-size: 0.75rem;
    min-width: 40px;
  }

  .btn-continue {
    padding: 5px;
    font-size: 0.8rem;
    border-radius: 15px;
  }
}
</style>
