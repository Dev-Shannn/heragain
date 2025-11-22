<template>
  <div class="birthday-container">
    <!-- Confetti and particles -->
    <div class="confetti" v-for="i in 100" :key="`confetti-${i}`"></div>
    <div class="fireworks-particle" v-for="i in 50" :key="`firework-${i}`"></div>
    <div class="heart-particle" v-for="i in 30" :key="`heart-${i}`"></div>

    <button class="btn-back" @click="$emit('back')">← Back</button>

    <div class="celebration">
      <div class="birthday-content">
        <!-- Personalized greeting -->
        <div class="greeting-section">
          <h1 class="celebration-title">🎉 for you  🎉</h1>
          <p class="personalized-greeting">Dear {{ girlfriendName }},</p>
        </div>

        <!-- Photo section -->
        <div class="photo-section glass" v-if="showPhoto">
          <div class="photo-frame" @click="triggerImageHeartExplosion">
            <img 
              src="/img/girlfriend.jpeg" 
              alt="My Beautiful manisha"
              class="girlfriend-photo"
              @error="handleImageError"
            />
            <div class="photo-shine"></div>
          </div>
        </div>

      

        <!-- Special message -->
        <div class="special-message glass">
          <p class="message-text">
            Every moment with you is a precious gift. Your smile lights up the World 
          </p>
        </div>

        <!-- Why you're amazing -->
        <div class="wishes-section glass">
          <h2>See Here </h2>
          <div class="wishes-grid">
            <div v-for="(wish, index) in wishes" :key="index" class="wish-card">
              <div class="wish-emoji">{{ wish.emoji }}</div>
              <p>{{ wish.text }}</p>
            </div>
          </div>
        </div>

        <!-- Romantic timeline -->
      

        <!-- Final love message -->
        <div class="final-message glass">
          <p class="love-quote">made for you </p>
          <p class="signature">With endless love and devotion</p>
          <p class="heart-signature">❤️ Always Yours ❤️</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { createHeartExplosion } from '../utils/heartExplosion'

export default {
  name: 'BirthdayCard',
  emits: ['back'],
  setup() {
    const girlfriendName = ref('Manisha')
    const showPhoto = ref(true)
    const activeMoment = ref(0)

    const toggleMoment = (index) => {
      activeMoment.value = index
      // Trigger heart explosion on the timeline dot
      nextTick(() => {
        const dots = document.querySelectorAll('.timeline-dot')
        if (dots[index]) {
          createHeartExplosion(dots[index])
        }
      })
    }

    const wishes = [
      {
        emoji: '🌟',
        text: 'Your smile is the brightest star that guides me through every day',
      },
      {
        emoji: '💖',
        text: 'You are not just loved, you are cherished beyond measure',
      },
      {
        emoji: '🎊',
        text: 'Every single moment with you becomes a treasured memory',
      },
    
      {
        emoji: '🌈',
        text: 'You bring color and joy to my world in every possible way',
      },
    
    ]

    const moments = [
      {
        title: '💕 First Moment',
        text: 'The day I met you, everything changed. You became my reason to smile every single day.',
      },
      {
        title: '✨ Growing Together',
        text: 'With you, I discovered what true love means. You make me want to be a better person.',
      },
      {
        title: '🌹 Special Days',
        text: 'Every day with you is special. You turn ordinary moments into beautiful memories.',
      },
      {
        title: '💑 Forever Promise',
        text: 'I promise to love you, cherish you, and stand by you through all of life\'s adventures.',
      },
    ]

    const restart = () => {
      window.location.reload()
    }

    const printPage = () => {
      window.print()
    }

    const handleImageError = () => {
      console.warn('Image not found at /dist/img/girlfriend.jpeg')
      showPhoto.value = false
    }

    const triggerImageHeartExplosion = (event) => {
      createHeartExplosion(event.currentTarget)
    }

    onMounted(() => {
      // Auto-cycle through moments
      const momentInterval = setInterval(() => {
        activeMoment.value = (activeMoment.value + 1) % moments.length
      }, 6000)

      return () => clearInterval(momentInterval)
    })

    return {
      girlfriendName,
      showPhoto,
      activeMoment,
      wishes,
      moments,
      restart,
      printPage,
      handleImageError,
      toggleMoment,
      triggerImageHeartExplosion,
    }
  },
}
</script>

<style scoped>
.birthday-container {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
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
  z-index: 10;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.celebration {
  position: relative;
  width: 100%;
}

/* Enhanced Confetti */
.confetti {
  position: fixed;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  pointer-events: none;
  animation: fall 4s linear forwards;
  border-radius: 50%;
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti:nth-child(odd) {
  animation-duration: 3.5s;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

.confetti:nth-child(even) {
  animation-duration: 4.5s;
  animation-delay: calc(var(--index, 0) * 0.15s);
}

/* Fireworks particles */
.fireworks-particle {
  position: fixed;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #ff006e, #ff1e8a);
  pointer-events: none;
  border-radius: 50%;
  animation: fireworks 2.5s ease-out forwards;
  animation-delay: calc(var(--index, 0) * 0.08s);
}

@keyframes fireworks {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx, 0), var(--ty, 0)) scale(0);
    opacity: 0;
  }
}

.fireworks-particle:nth-child(1) { --tx: 80px; --ty: -80px; }
.fireworks-particle:nth-child(2) { --tx: -80px; --ty: -80px; }
.fireworks-particle:nth-child(3) { --tx: 100px; --ty: 50px; }
.fireworks-particle:nth-child(4) { --tx: -100px; --ty: 50px; }
.fireworks-particle:nth-child(5) { --tx: 120px; --ty: -20px; }

/* Heart particles */
.heart-particle {
  position: fixed;
  font-size: 1.5rem;
  pointer-events: none;
  animation: floatUp 4s ease-out forwards;
  animation-delay: calc(var(--index, 0) * 0.2s);
  opacity: 0.7;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(var(--float, 50px)) scale(0);
    opacity: 0;
  }
}

.heart-particle:nth-child(odd)::before {
  content: '❤️';
}

.heart-particle:nth-child(even)::before {
  content: '💕';
}

.birthday-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

/* Greeting Section */
.greeting-section {
  animation: slideDown 0.6s ease-out;
  margin-bottom: 30px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.celebration-title {
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 15px;
  text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.3);
  animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  letter-spacing: 2px;
}

.personalized-greeting {
  font-size: 2rem;
  color: white;
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease-out 0.3s both;
  margin: 0;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

/* Photo Section */
.photo-section {
  margin: 30px 0 40px;
  padding: 25px;
  border-radius: 25px;
  animation: fadeIn 1s ease-out 0.5s both;
}

.photo-frame {
  position: relative;
  width: 100%;
  max-width: 350px;
  margin: 0 auto 15px;
  border-radius: 20px;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
  aspect-ratio: 3/4;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.photo-frame:hover {
  transform: scale(1.02);
  box-shadow: 0 25px 70px rgba(102, 126, 234, 0.5);
}

.photo-frame:active {
  transform: scale(0.98);
}

.girlfriend-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: zoomIn 1s ease-out;
}

@keyframes zoomIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.photo-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
  pointer-events: none;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}


/* Special Message */
.special-message {
  padding: 30px 25px;
  margin: 30px 0;
  border-radius: 25px;
  animation: fadeIn 1s ease-out 0.7s both;
}

.message-text {
  color: white;
  font-size: 1.15rem;
  line-height: 1.8;
  font-weight: 500;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
}

/* Cake section */
.cake-section {
  font-size: 8rem;
  margin: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  animation: bounce 1s ease-in-out infinite;
}

.candle {
  animation: flicker 1.5s ease-in-out infinite;
  font-size: 5rem;
}

.candle:nth-child(1) {
  animation-delay: 0.2s;
}

.candle:nth-child(3) {
  animation-delay: 0.1s;
}

@keyframes flicker {
  0%, 100% {
    opacity: 1;
    transform: translateY(0px);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* Wishes section */
.wishes-section {
  margin: 40px 0;
  padding: 40px 30px;
  border-radius: 25px;
  animation: fadeIn 1s ease-out 1s both;
}

.wishes-section h2 {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 30px;
  font-weight: 700;
}

.wishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
}

.wish-card {
  background: rgba(255, 255, 255, 0.08);
  padding: 25px 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  animation: slideUp 0.6s ease-out both;
  cursor: pointer;
}

.wish-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.wish-card:nth-child(1) { animation-delay: 0.1s; }
.wish-card:nth-child(2) { animation-delay: 0.2s; }
.wish-card:nth-child(3) { animation-delay: 0.3s; }
.wish-card:nth-child(4) { animation-delay: 0.4s; }
.wish-card:nth-child(5) { animation-delay: 0.5s; }
.wish-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.wish-emoji {
  font-size: 2.5rem;
  margin-bottom: 12px;
  display: block;
  animation: spin 2s ease-in-out infinite;
}

.wish-card:hover .wish-emoji {
  animation: spin 0.6s ease-in-out;
}

@keyframes spin {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
}

.wish-card p {
  color: white;
  font-size: 0.9rem;
  line-height: 1.5;
  font-weight: 500;
}

/* Timeline section */
.timeline-section {
  padding: 40px 30px;
  margin: 40px 0;
  border-radius: 25px;
  animation: fadeIn 1s ease-out 1.2s both;
}

.timeline-section h2 {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 30px;
  font-weight: 700;
}

.timeline {
  position: relative;
  padding: 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%);
}

.timeline-item {
  margin-bottom: 30px;
  position: relative;
  animation: slideUp 0.6s ease-out both;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline-item:hover {
  transform: translateX(10px);
}

.timeline-item:nth-child(1) { animation-delay: 0.2s; }
.timeline-item:nth-child(2) { animation-delay: 0.3s; }
.timeline-item:nth-child(3) { animation-delay: 0.4s; }
.timeline-item:nth-child(4) { animation-delay: 0.5s; }

.timeline-dot {
  position: absolute;
  left: 50%;
  top: 0;
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline-dot:hover {
  transform: translateX(-50%) scale(1.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.timeline-item.active .timeline-dot {
  background: #ff006e;
  border-color: white;
  transform: translateX(-50%) scale(1.4);
  box-shadow: 0 0 20px rgba(255, 0, 110, 0.5);
  animation: heartPulse 0.6s ease-out;
}

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
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
}

.timeline-item.active .timeline-content {
  max-height: 300px;
  padding: 20px;
  background: rgba(255, 0, 110, 0.15);
  border-color: rgba(255, 0, 110, 0.3);
  opacity: 1;
}

.timeline-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.timeline-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

/* Final message */
.final-message {
  padding: 35px 30px;
  margin: 40px 0;
  border-radius: 25px;
  animation: fadeIn 1s ease-out 1.4s both;
}

.love-quote {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.4rem;
  line-height: 1.8;
  font-weight: 600;
  font-style: italic;
  margin-bottom: 20px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.signature {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  margin-bottom: 10px;
  font-weight: 500;
}

.heart-signature {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 15px;
  animation: heartBeat 1.5s ease-in-out infinite;
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.2);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.2);
  }
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 40px;
  animation: fadeIn 1s ease-out 1.6s both;
}

.btn-restart,
.btn-print {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid white;
  padding: 15px 40px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  font-weight: 700;
  font-size: 1rem;
}

.btn-print {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 10px 30px rgba(79, 172, 254, 0.4);
}

.btn-restart:hover,
.btn-print:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
}

.btn-print:hover {
  box-shadow: 0 15px 40px rgba(79, 172, 254, 0.6);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Glass effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media print {
  .btn-back,
  .action-buttons,
  .confetti,
  .fireworks-particle,
  .heart-particle {
    display: none;
  }

  .celebration-title {
    font-size: 2.5rem;
  }

  .photo-section {
    page-break-inside: avoid;
  }

  .wishes-section,
  .timeline-section,
  .final-message {
    page-break-inside: avoid;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .birthday-container {
    padding: 20px;
  }

  .celebration-title {
    font-size: 2.5rem;
  }

  .personalized-greeting {
    font-size: 1.5rem;
  }

  .photo-frame {
    max-width: 280px;
  }

  .cake-section {
    font-size: 6rem;
    gap: 15px;
  }

  .candle {
    font-size: 3.5rem;
  }

  .wishes-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .timeline::before {
    left: 15px;
  }

  .timeline-dot {
    left: 15px;
  }

  .timeline-content {
    width: calc(100% - 55px);
    margin-left: 40px;
  }

  .timeline-item.active .timeline-content {
    max-height: 320px;
  }

  .love-quote {
    font-size: 1.2rem;
  }

  .special-message {
    padding: 20px 15px;
  }

  .message-text {
    font-size: 1rem;
  }

  .action-buttons {
    gap: 10px;
  }

  .btn-restart,
  .btn-print {
    padding: 12px 30px;
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .birthday-container {
    padding: 15px;
  }

  .btn-back {
    top: 12px;
    left: 12px;
    padding: 8px 15px;
    font-size: 0.8rem;
  }

  .celebration-title {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  .personalized-greeting {
    font-size: 1.2rem;
  }

  .photo-frame {
    max-width: 100%;
    border: 3px solid white;
    margin-bottom: 10px;
  }

  .photo-caption {
    font-size: 0.95rem;
  }

  .special-message {
    padding: 15px 12px;
    margin: 20px 0;
  }

  .message-text {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .cake-section {
    font-size: 4rem;
    margin: 25px 0;
    gap: 12px;
  }

  .candle {
    font-size: 2.5rem;
  }

  .wishes-section,
  .timeline-section {
    padding: 15px 12px;
    margin: 20px 0;
  }

  .wishes-section h2,
  .timeline-section h2 {
    font-size: 1.4rem;
    margin-bottom: 15px;
  }

  .wishes-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .wish-card {
    padding: 15px 12px;
    border-radius: 15px;
  }

  .wish-emoji {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  .wish-card p {
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .timeline-content {
    width: calc(100% - 45px);
    padding: 15px;
    font-size: 0.9rem;
  }

  .timeline-item.active .timeline-content {
    max-height: 300px;
  }

  .timeline-title {
    font-size: 1rem;
  }

  .timeline-text {
    font-size: 0.9rem;
  }

  .final-message {
    padding: 15px 12px;
    margin: 20px 0;
  }

  .love-quote {
    font-size: 1rem;
    line-height: 1.6;
  }

  .signature {
    font-size: 0.9rem;
  }

  .heart-signature {
    font-size: 1.2rem;
  }

  .action-buttons {
    gap: 8px;
    margin-top: 20px;
  }

  .btn-restart,
  .btn-print {
    padding: 10px 20px;
    font-size: 0.85rem;
  }

  .confetti {
    width: 7px;
    height: 7px;
  }

  .fireworks-particle {
    width: 5px;
    height: 5px;
  }

  .heart-particle {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .birthday-container {
    padding: 12px;
    padding-top: 50px;
    min-height: 100vh;
  }

  .btn-back {
    top: 10px;
    left: 10px;
    padding: 6px 12px;
    font-size: 0.75rem;
    border-radius: 15px;
  }

  .celebration-title {
    font-size: 1.5rem;
    margin-bottom: 5px;
  }

  .personalized-greeting {
    font-size: 1rem;
  }

  .photo-frame {
    max-width: 100%;
    border: 2px solid white;
    margin-bottom: 8px;
  }

  .photo-caption {
    font-size: 0.85rem;
  }

  .cake-section {
    font-size: 3rem;
    margin: 15px 0;
    gap: 10px;
  }

  .candle {
    font-size: 1.8rem;
  }

  .special-message {
    padding: 12px 10px;
    margin: 12px 0;
  }

  .message-text {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .wishes-section,
  .timeline-section {
    padding: 12px 10px;
    margin: 12px 0;
    border-radius: 15px;
  }

  .wishes-section h2,
  .timeline-section h2 {
    font-size: 1.15rem;
    margin-bottom: 10px;
  }

  .wishes-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .wish-card {
    padding: 12px 10px;
    border-radius: 12px;
  }

  .wish-emoji {
    font-size: 1.6rem;
    margin-bottom: 6px;
  }

  .wish-card p {
    font-size: 0.8rem;
  }

  .timeline::before {
    left: 12px;
  }

  .timeline-dot {
    left: 12px;
    width: 16px;
    height: 16px;
    border-width: 2px;
  }

  .timeline-content {
    width: calc(100% - 45px);
    padding: 10px;
    margin-left: 32px;
    border-radius: 10px;
  }

  .timeline-item.active .timeline-content {
    max-height: 280px;
  }

  .timeline-title {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  .timeline-text {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .final-message {
    padding: 12px 10px;
    margin: 12px 0;
    border-radius: 15px;
  }

  .love-quote {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .signature {
    font-size: 0.85rem;
  }

  .heart-signature {
    font-size: 1.1rem;
    margin-top: 8px;
  }

  .action-buttons {
    gap: 6px;
    margin-top: 12px;
  }

  .btn-restart,
  .btn-print {
    padding: 8px 16px;
    font-size: 0.8rem;
    border-radius: 18px;
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  .birthday-container {
    padding: 12px;
    min-height: auto;
  }

  .celebration-title {
    font-size: 1.4rem;
    margin-bottom: 5px;
  }

  .personalized-greeting {
    font-size: 1rem;
    margin-bottom: 5px;
  }

  .photo-section {
    margin: 10px 0;
  }

  .photo-frame {
    max-width: 150px;
    margin: 0 auto 8px;
  }

  .cake-section {
    font-size: 2.5rem;
    margin: 10px 0;
  }

  .wishes-section,
  .timeline-section {
    padding: 10px;
    margin: 8px 0;
  }

  .wishes-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .wish-card {
    padding: 8px;
  }

  .wish-emoji {
    font-size: 1.3rem;
    margin-bottom: 2px;
  }

  .wish-card p {
    font-size: 0.75rem;
    line-height: 1.2;
  }

  .timeline-content {
    width: calc(100% - 40px);
    padding: 8px;
  }

  .timeline-item.active .timeline-content {
    max-height: 200px;
  }

  .timeline-title {
    font-size: 0.8rem;
  }

  .timeline-text {
    font-size: 0.75rem;
    line-height: 1.3;
  }

  .special-message,
  .final-message {
    padding: 10px;
    margin: 8px 0;
  }

  .message-text,
  .love-quote {
    font-size: 0.85rem;
  }

  .action-buttons {
    gap: 5px;
    margin-top: 8px;
  }

  .btn-restart,
  .btn-print {
    padding: 6px 12px;
    font-size: 0.7rem;
  }
}
</style>
