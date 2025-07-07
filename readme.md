# ansarigen

Generate stunning AI art and audio from your ideas using advanced models.  
Beautiful, production-ready UI built with Next.js, Tailwind CSS, and shadcn/ui.

## ✨ Features

- **AI Image Generation**:  
  - Enter a prompt and generate unique images using multiple models (e.g., flux, gptimage, kontext).
  - Customize width, height, seed, and advanced options (no logo, enhance, private, safe, transparent).
  - Image-to-image support and referrer tracking.
  - Download generated images or try again with a new prompt.
  - Prompt suggestions for inspiration.
  - Local history of generated images.

- **AI Audio Generation**:  
  - Enter a prompt and generate speech/audio using various AI voices.
  - Choose from multiple voice styles (Alloy, Echo, Fable, Onyx, Nova, Shimmer).
  - Download generated audio.
  - Prompt suggestions for quick testing.

- **Modern UI/UX**:  
  - Responsive, accessible design.
  - Toast notifications for feedback.
  - Loading spinners and smooth transitions.
  - Navigation between image and audio generation.

## 🗂️ Project Structure

```
image_gen_ai/
  app/
    api/generate-image/      # API route for image generation (server-side)
    audio-gen/               # Audio generation page
    globals.css              # Global styles (Tailwind)
    layout.tsx               # App layout and navigation
    page.tsx                 # Main image generation page
  components/
    ui/                      # Reusable UI components (shadcn/ui)
  hooks/                     # Custom React hooks
  lib/                       # Utility functions
  public/                    # Static assets (icons, manifest)
  tailwind.config.ts         # Tailwind CSS configuration
  tsconfig.json              # TypeScript configuration
  next.config.js             # Next.js configuration
  package.json               # Dependencies and scripts
```

## ⚙️ Setup & Configuration

### 1. Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the project root with the following:

```
POLLINATIONS_API_TOKEN=your_pollinations_api_token_here
```

- The `POLLINATIONS_API_TOKEN` is required for image generation.  
- You can obtain a token from [Pollinations API](https://pollinations.ai/).

### 4. Development

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 🛠️ Configuration

- **Image Domains**:  
  The app is configured to allow images from `image.pollinations.ai` (see `next.config.js`).
- **UI Library**:  
  Uses [shadcn/ui](https://ui.shadcn.com/) and [Lucide React](https://lucide.dev/) for icons.
- **Styling**:  
  Tailwind CSS with custom themes and animations.

## 🚀 Usage

- Go to the home page to generate images.
- Use the navigation to access the audio generator.
- Enter your prompt, adjust options, and click "Generate".
- Download or retry as needed.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE) (or specify your license here)
