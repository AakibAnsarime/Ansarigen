"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AudioLines, Download, Sparkles, Play } from "lucide-react";
import { toast } from "sonner";

const VOICES = [
  { id: "alloy", label: "Alloy" },
  { id: "echo", label: "Echo" },
  { id: "fable", label: "Fable" },
  { id: "onyx", label: "Onyx" },
  { id: "nova", label: "Nova" },
  { id: "shimmer", label: "Shimmer" },
];

const PROMPT_SUGGESTIONS = [
  "Welcome to our AI-powered audio generator!",
  "Tell me a fun fact about space.",
  "Read a short poem about spring.",
  "Say: 'Thank you for using our app!'",
  "Explain how rainbows are formed.",
];

export default function AudioGenPage() {
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState("nova");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate audio");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);
    try {
      const encodedPrompt = encodeURIComponent("Say: " + prompt);
      const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai-audio&voice=${voice}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to generate audio");
      const blob = await response.blob();
      if (!blob.type.startsWith("audio/")) {
        setError("API did not return audio. Try a different prompt or voice.");
        setIsGenerating(false);
        return;
      }
      const audioObjectUrl = URL.createObjectURL(blob);
      setAudioUrl(audioObjectUrl);
      toast.success("Audio generated successfully!");
    } catch (err) {
      setError("Failed to generate audio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `ai-audio-${prompt.slice(0, 20).replace(/\s+/g, "-")}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Audio downloaded successfully!");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <AudioLines className="w-8 h-8 inline-block text-blue-600" />
            Generate AI Audio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Turn your text prompts into lifelike speech with advanced AI voices.
          </p>
        </div>

        {/* Generator Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AudioLines className="w-5 h-5" />
                Create Your Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  What should the AI say?
                </label>
                <Textarea
                  placeholder="Type your message or script here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[80px] resize-none border-2 focus:border-blue-500 transition-colors"
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{prompt.length}/500 characters</span>
                  <span>Shorter prompts work best</span>
                </div>
              </div>
              {/* Voice Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700">Voice</label>
                <select
                  className="w-full border rounded p-2 mt-1"
                  value={voice}
                  onChange={e => setVoice(e.target.value)}
                >
                  {VOICES.map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </div>
              {/* Suggestions */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Try these prompts:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs hover:bg-blue-50 hover:border-blue-200 transition-colors"
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 text-lg transition-all duration-200 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating audio...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Audio
                  </>
                )}
              </Button>
              {/* Error State */}
              {error && (
                <div className="text-red-600 text-sm text-center mt-2">{error}</div>
              )}
              {/* Audio Player & Download */}
              {audioUrl && !isGenerating && (
                <div className="flex flex-col items-center gap-4 mt-6">
                  <audio controls src={audioUrl} className="w-full max-w-md rounded shadow" />
                  <Button onClick={handleDownload} className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download Audio
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 