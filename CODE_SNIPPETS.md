# 🔑 Key Code Snippets - Implementation Reference

## 1. ScrollAlert Component Usage

### In Story.vue
```vue
<template>
  <div class="story-container">
    <!-- Scroll alert at top -->
    <ScrollAlert 
      v-if="showScrollAlert" 
      :message="'📱 Scroll down to see navigation buttons and continue'"
      @close="showScrollAlert = false" 
    />
    
    <!-- Rest of content -->
    <div class="story-content" :class="{ 'has-nav': showNavigation }">
      <!-- ... -->
    </div>
  </div>
</template>

<script>
import ScrollAlert from './ScrollAlert.vue'

export default {
  components: { ScrollAlert },
  setup() {
    const showScrollAlert = ref(true)
    const showNavigation = ref(false)
    
    // Show navigation after 2 seconds
    onMounted(() => {
      setTimeout(() => {
        showNavigation.value = true
      }, 2000)
    })
    
    return {
      showScrollAlert,
      showNavigation,
    }
  }
}
</script>
```

---

## 2. Responsive Content Scaling

### CSS for Story.vue
```css
.story-content {
  max-width: 700px;
  width: 100%;
  position: relative;
  transition: transform 0.3s ease;  /* Smooth transition */
}

/* When navigation is visible, scale down */
.story-content.has-nav {
  transform: scale(0.9);
  transform-origin: center top;  /* Scale from top */
}
```

### CSS for AIChat.vue
```css
.chat-box {
  width: 100%;
  max-width: 800px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  min-height: 750px;
  max-height: 90vh;
  animation: fadeIn 0.6s ease-out;
  transition: transform 0.3s ease;
}

.chat-box.has-nav {
  transform: scale(0.9);
  transform-origin: center top;
}
```

---

## 3. Heart Explosion Animation

### Full Implementation
```javascript
// src/utils/heartExplosion.js
export const createHeartExplosion = (element) => {
  if (!element) return

  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const particleCount = 18
  const hearts = ['❤️', '💕', '💖', '💗']

  for (let i = 0; i < particleCount; i++) {
    const heart = document.createElement('div')
    heart.className = 'heart-explosion-particle'
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]
    heart.style.position = 'fixed'
    heart.style.left = centerX + 'px'
    heart.style.top = centerY + 'px'
    heart.style.fontSize = '1.5rem'
    heart.style.pointerEvents = 'none'
    heart.style.zIndex = '9999'

    // Calculate trajectory
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5)
    const distance = 80 + Math.random() * 120
    const vx = Math.cos(angle) * distance
    const vy = Math.sin(angle) * distance

    document.body.appendChild(heart)

    // Animate
    let x = 0, y = 0, opacity = 1, scale = 1, rotation = Math.random() * 360
    const animationDuration = 1000 + Math.random() * 500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)  // ease-out

      x = vx * easeProgress
      y = vy * easeProgress - 9.81 * progress * progress * 50  // gravity!
      opacity = 1 - progress
      scale = 1 - progress * 0.3
      rotation += 5

      heart.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`
      heart.style.opacity = opacity

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        heart.remove()
      }
    }

    animate()
  }
}
```

### Usage in Birthday.vue
```vue
<template>
  <div class="timeline">
    <div 
      v-for="(moment, index) in moments" 
      :key="index" 
      class="timeline-item" 
      :class="{ active: index === activeMoment }"
      @click="toggleMoment(index)"  <!-- Click to expand & explode! -->
    >
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <!-- ... -->
      </div>
    </div>
  </div>
</template>

<script>
import { createHeartExplosion } from '../utils/heartExplosion'

export default {
  setup() {
    const toggleMoment = (index) => {
      activeMoment.value = index
      
      // Trigger explosion from the clicked dot
      nextTick(() => {
        const dots = document.querySelectorAll('.timeline-dot')
        if (dots[index]) {
          createHeartExplosion(dots[index])
        }
      })
    }
    
    return { toggleMoment }
  }
}
</script>
```

---

## 4. Timeline Animation Enhancements

### Smooth Expansion with Bounce
```css
.timeline-content {
  width: calc(50% - 40px);
  background: rgba(255, 255, 255, 0.08);
  padding: 0 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  margin-left: 40px;
  text-align: left;
  max-height: 0;
  overflow: hidden;
  /* Custom easing for bouncy feel */
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
}

.timeline-item.active .timeline-content {
  max-height: 300px;
  padding: 20px;  /* Padding animates smoothly */
  background: rgba(255, 0, 110, 0.15);
  border-color: rgba(255, 0, 110, 0.3);
  opacity: 1;  /* Fade in effect */
}
```

### Hover Effects
```css
.timeline-item:hover {
  transform: translateX(10px);  /* Slide right */
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline-dot:hover {
  transform: translateX(-50%) scale(1.2);  /* Grow 20% */
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Heartbeat Animation
```css
@keyframes heartPulse {
  0% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.5);
  }
  100% {
    transform: translateX(-50%) scale(1.4);
  }
}

.timeline-item.active .timeline-dot {
  background: #ff006e;
  border-color: white;
  animation: heartPulse 0.6s ease-out;
  box-shadow: 0 0 20px rgba(255, 0, 110, 0.5);
}
```

---

## 5. ScrollAlert Component

### Full Component Code
```vue
<template>
  <Transition name="slide-down">
    <div v-if="isVisible" class="scroll-alert-container">
      <div class="scroll-alert">
        <span class="alert-icon">👇</span>
        <span class="alert-text">{{ message }}</span>
        <button class="alert-close" @click="close">✕</button>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ScrollAlert',
  props: {
    duration: {
      type: Number,
      default: 4000,  // 4 seconds
    },
    message: {
      type: String,
      default: '📱 Scroll down to see more and navigate',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isVisible = ref(false)
    let autoHideTimer = null

    const show = () => {
      isVisible.value = true
      if (autoHideTimer) clearTimeout(autoHideTimer)
      autoHideTimer = setTimeout(() => {
        close()
      }, props.duration)
    }

    const close = () => {
      isVisible.value = false
      if (autoHideTimer) clearTimeout(autoHideTimer)
      emit('close')
    }

    onMounted(() => show())
    onUnmounted(() => {
      if (autoHideTimer) clearTimeout(autoHideTimer)
    })

    return { isVisible, close, show }
  },
}
</script>

<style scoped>
.scroll-alert-container {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 100%;
  max-width: 500px;
  padding: 0 20px;
}

.scroll-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #ff006e 0%, #f093fb 100%);
  color: white;
  padding: 12px 18px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(255, 0, 110, 0.4);
  animation: slideInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.alert-icon {
  font-size: 1.2rem;
  animation: bounce 1s ease-in-out infinite;
}

.alert-text {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
```

---

## 6. Complete Toggle Function

### In Birthday.vue Setup
```javascript
const toggleMoment = (index) => {
  // Update active moment
  activeMoment.value = index
  
  // Wait for DOM to update, then trigger explosion
  nextTick(() => {
    const dots = document.querySelectorAll('.timeline-dot')
    if (dots[index]) {
      // Burst hearts from clicked dot
      createHeartExplosion(dots[index])
    }
  })
}
```

---

## 7. Imports Required

### Story.vue
```javascript
import { ref, onMounted } from 'vue'
import ScrollAlert from './ScrollAlert.vue'
```

### AIChat.vue
```javascript
import { ref, nextTick } from 'vue'
import ScrollAlert from './ScrollAlert.vue'
```

### Birthday.vue
```javascript
import { ref, onMounted, nextTick } from 'vue'
import { createHeartExplosion } from '../utils/heartExplosion'
```

---

## 8. Package.json Dependencies

```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "tsparticles": "^2.12.0",
    "vue3-particles": "^2.12.0"
  }
}
```

---

## 9. Key CSS Easing Values

### Bounce (for Timeline)
```css
cubic-bezier(0.34, 1.56, 0.64, 1)
/* Creates a bouncy, spring-like effect */
```

### Ease Out (for Animations)
```css
cubic-bezier(0.25, 0.46, 0.45, 0.94)
/* Smooth deceleration */
```

### Custom Easing (for Heart Burst)
```javascript
const easeProgress = 1 - Math.pow(1 - progress, 3)
/* Cubic ease-out in JavaScript */
```

---

## 10. Physics Simulation Constants

### Heart Explosion
```javascript
const particleCount = 18        // Hearts per burst
const distance = 80 + Math.random() * 120  // 80-200px spread
const gravityForce = 9.81 * progress * progress * 50  // Realistic fall
const animationDuration = 1000 + Math.random() * 500  // 1-1.5 seconds
```

---

## Summary

These code snippets show:
- ✅ How to use ScrollAlert component
- ✅ How to implement responsive scaling
- ✅ How physics-based particle animations work
- ✅ How smooth easing creates polished UX
- ✅ How to trigger animations from user interactions
- ✅ Best practices for Vue 3 Composition API

All code is production-ready and well-documented! 🚀

