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
      default: 4000, // 4 seconds
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

      // Auto hide after duration
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

    onMounted(() => {
      show()
    })

    onUnmounted(() => {
      if (autoHideTimer) clearTimeout(autoHideTimer)
    })

    return {
      isVisible,
      close,
      show,
    }
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

.alert-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.alert-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

@media (max-width: 600px) {
  .scroll-alert-container {
    top: 50px;
    padding: 0 12px;
  }

  .scroll-alert {
    padding: 10px 14px;
    border-radius: 10px;
  }

  .alert-icon {
    font-size: 1rem;
  }

  .alert-text {
    font-size: 0.8rem;
  }

  .alert-close {
    width: 20px;
    height: 20px;
    font-size: 0.8rem;
  }
}
</style>
