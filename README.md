# Happy Birthday Mi Amor 🎉

A special Vue.js application to celebrate your girlfriend's birthday with storytelling, AI conversation, and beautiful animations.

## Features

✨ **Storytelling Experience** - Share your love story through beautifully animated scenes
💬 **AI Chat** - Have a romantic conversation with personalized responses
🎨 **Beautiful Animations** - Smooth transitions and engaging visual effects
📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
🚀 **Easy Deployment** - Optimized for Vercel deployment

## Technologies Used

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Lightning fast build tool
- **GSAP** - Advanced animations
- **CSS3** - Beautiful styling and animations

## Getting Started

### Prerequisites
- Node.js >= 24.1.0
- npm >= 11.4.1

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Project Structure

```
hbd-miamor/
├── src/
│   ├── components/
│   │   ├── Welcome.vue      # Welcome/intro screen
│   │   ├── Story.vue        # Storytelling component
│   │   ├── AIChat.vue       # AI conversation component
│   │   └── Birthday.vue     # Birthday celebration screen
│   ├── styles/
│   │   └── main.css         # Global styles
│   ├── App.vue              # Main app component
│   └── main.js              # Entry point
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel deployment config
└── package.json             # Project dependencies
```

## Deployment on Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Vercel will automatically detect it's a Vue.js/Vite project
5. Click "Deploy" - that's it! 🚀

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Customization

### Edit Story Scenes
Open `src/components/Story.vue` and modify the `scenes` array to add your own story.

### Customize AI Responses
Edit `src/components/AIChat.vue` and update the `responses` array with your personal messages.

### Change Colors & Styling
Modify `src/styles/main.css` for color gradients and global styles.
Modify individual component `<style>` sections for component-specific styling.

### Add Birthday Wishes
Update the `wishes` array in `src/components/Birthday.vue` to add more wishes.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

- Images are optimized and use emojis for lightweight design
- Lazy loading is built-in with Vue 3
- CSS animations are hardware-accelerated
- Vite provides extremely fast builds

## License

MIT - Feel free to use this for your special occasions!

## Made with ❤️

This app was created to celebrate love and special moments. Happy Birthday to your amazing girlfriend! 🎂✨
# for-miamor
