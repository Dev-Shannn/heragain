/**
 * Heart Explosion Animation Utility
 * Creates a beautiful heart burst effect when triggered
 */

export const createHeartExplosion = (element) => {
  if (!element) return

  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // Create 15-20 heart particles
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

    // Random angle and distance
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5)
    const distance = 80 + Math.random() * 120
    const vx = Math.cos(angle) * distance
    const vy = Math.sin(angle) * distance

    document.body.appendChild(heart)

    // Animate heart
    let x = 0
    let y = 0
    let opacity = 1
    let scale = 1
    let rotation = Math.random() * 360

    const animationDuration = 1000 + Math.random() * 500 // 1-1.5s
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      // Easing: ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      x = vx * easeProgress
      y = vy * easeProgress - 9.81 * progress * progress * 50 // gravity effect
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

export const triggerHeartExplosion = (selector) => {
  const element = document.querySelector(selector)
  if (element) {
    createHeartExplosion(element)
  }
}
