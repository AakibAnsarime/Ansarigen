"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Download, RefreshCw, Sparkles, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  // Pollinations options state
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState('flux');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [seed, setSeed] = useState<number | ''>('');
  const [nologo, setNologo] = useState(true);
  const [enhance, setEnhance] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [safe, setSafe] = useState(false);
  const [transparent, setTransparent] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [referrer, setReferrer] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fetch available models from Pollinations API
    fetch('https://image.pollinations.ai/models')
      .then(res => res.json())
      .then(data => setModels(data))
      .catch(() => setModels(['flux', 'gptimage', 'kontext']));
  }, []);

  useEffect(() => { setMounted(true); }, []);

  // Load generatedImages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('generatedImages');
    if (saved) {
      // Parse and revive Date objects
      const parsed = JSON.parse(saved).map((img: any) => ({
        ...img,
        timestamp: new Date(img.timestamp),
      }));
      setGeneratedImages(parsed);
    }
  }, []);

  // Save generatedImages to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
  }, [generatedImages]);

  const promptSuggestions = [
    'A futuristic cityscape at sunset with flying cars',
    'A magical forest with glowing mushrooms and fireflies',
    'A steampunk robot in a Victorian library',
    'An underwater palace with colorful coral gardens',
    'A space station orbiting a distant planet',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate an image');
      return;
    }
    setIsGenerating(true);
    try {
      const body: any = {
        prompt,
        model,
        width,
        height,
        nologo,
        enhance,
        private: isPrivate,
        safe,
      };
      if (seed !== '') body.seed = seed;
      if (transparent && model === 'gptimage') body.transparent = true;
      if (imageUrl) body.image = imageUrl;
      if (referrer) body.referrer = referrer;
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to generate image');
      const data = await response.json();
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        prompt: prompt,
        timestamp: new Date(),
      };
      setGeneratedImages(prev => [newImage, ...prev]);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${prompt.slice(0, 20).replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(prompt);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  // Remove a single image by id
  const handleRemoveImage = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
  };

  // Clear all images
  const handleClearAll = () => {
    setGeneratedImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header - removed, now in layout */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Generate Stunning AI Art
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into beautiful images with the power of artificial intelligence
          </p>
        </div>

        {/* Generator Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Create Your Artwork
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Describe your image
                </label>
                <Textarea
                  placeholder="A majestic dragon soaring through a stormy sky with lightning bolts..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none border-2 focus:border-purple-500 transition-colors"
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{prompt.length}/500 characters</span>
                  <span>Be specific for better results</span>
                </div>
              </div>
              {/* Pollinations Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Model</label>
                  <select className="w-full border rounded p-2" value={model} onChange={e => setModel(e.target.value)}>
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Width</label>
                  <input type="number" className="w-full border rounded p-2" value={width} min={64} max={2048} step={8} onChange={e => setWidth(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Height</label>
                  <input type="number" className="w-full border rounded p-2" value={height} min={64} max={2048} step={8} onChange={e => setHeight(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Seed (optional)</label>
                  <input type="number" className="w-full border rounded p-2" value={seed} min={0} max={9999999} onChange={e => setSeed(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Random if empty" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={nologo} onChange={e => setNologo(e.target.checked)} id="nologo" />
                  <label htmlFor="nologo" className="text-sm">No Logo</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={enhance} onChange={e => setEnhance(e.target.checked)} id="enhance" />
                  <label htmlFor="enhance" className="text-sm">Enhance Prompt</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} id="private" />
                  <label htmlFor="private" className="text-sm">Private</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={safe} onChange={e => setSafe(e.target.checked)} id="safe" />
                  <label htmlFor="safe" className="text-sm">Safe (strict NSFW filter)</label>
                </div>
                {model === 'gptimage' && (
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={transparent} onChange={e => setTransparent(e.target.checked)} id="transparent" />
                    <label htmlFor="transparent" className="text-sm">Transparent (gptimage only)</label>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Image-to-Image URL (optional)</label>
                  <input type="url" className="w-full border rounded p-2" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Referrer (optional)</label>
                  <input type="text" className="w-full border rounded p-2" value={referrer} onChange={e => setReferrer(e.target.value)} placeholder="mywebapp.com" />
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Try these prompts:
                </label>
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs hover:bg-purple-50 hover:border-purple-200 transition-colors"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 text-lg transition-all duration-200 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating your masterpiece...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Creating your artwork...
                    </h3>
                    <p className="text-gray-600">
                      This may take a few moments. Please wait while our AI works its magic.
                    </p>
                  </div>
                  <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Generated Images</h2>
                <p className="text-gray-600">Click on any image to download it</p>
              </div>
              <Button
                variant="destructive"
                onClick={handleClearAll}
                className="self-start md:self-auto"
              >
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image) => (
                <Card key={image.id} className="group shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(image.url, image.prompt)}
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleCopyPrompt(image.prompt)}
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                      >
                        {copiedPrompt === image.prompt ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveImage(image.id)}
                        className="bg-red-600/80 hover:bg-red-700/90 text-white border-white/30"
                        title="Remove image"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {mounted ? new Date(image.timestamp).toLocaleTimeString() : ''}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPrompt(image.prompt)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1 h-auto"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Use prompt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedImages.length === 0 && !isGenerating && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to create something amazing?
            </h3>
            <p className="text-gray-600">
              Enter a prompt above and let our AI generate stunning artwork for you.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 ansarigen. Powered by advanced AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}