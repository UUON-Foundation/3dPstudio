import React, { useState, useRef } from 'react';
import { X, Wand2, Download, RefreshCw, Image, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface ImageGenPortalProps {
  onClose: () => void;
}

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

const ASPECT_RATIOS = [
  { label: 'Square 1:1', width: 1024, height: 1024 },
  { label: 'Portrait 3:4', width: 768, height: 1024 },
  { label: 'Landscape 4:3', width: 1024, height: 768 },
  { label: 'Wide 16:9', width: 1280, height: 720 },
];

const STYLE_PRESETS = [
  { label: 'Sacred Geometry', suffix: ', sacred geometry, golden ratio, mystical, detailed' },
  { label: 'Cosmic / Space', suffix: ', cosmic, nebula, galaxy, space art, vibrant colors' },
  { label: 'Spiritual Art', suffix: ', spiritual, ethereal, divine light, meditation, serene' },
  { label: 'Ancient Symbols', suffix: ', ancient symbols, stone carvings, archaeological, mystical' },
  { label: 'Fantasy', suffix: ', fantasy art, magical, glowing, detailed illustration' },
  { label: 'Photorealistic', suffix: ', photorealistic, 8k, ultra detailed, cinematic lighting' },
  { label: 'Oil Painting', suffix: ', oil painting, classical art, detailed brushwork, gallery quality' },
  { label: 'Digital Art', suffix: ', digital art, concept art, trending on artstation, vibrant' },
];

const PROMPT_IDEAS = [
  'A sacred lotus floating on cosmic water with golden light rays',
  'Metatron\'s cube glowing with divine energy in space',
  'Ancient Egyptian temple at sunrise with sacred hieroglyphs',
  'A DNA double helix intertwined with sacred geometry patterns',
  'The flower of life mandala emanating rainbow light',
  'A Tibetan singing bowl with sound waves visible in the air',
  'Tree of Life with roots in the earth and branches in the stars',
  'A crystal merkaba star rotating in golden light',
];

export function ImageGenPortal({ onClose }: ImageGenPortalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    const fullPrompt = prompt.trim() + selectedStyle.suffix;
    const seed = Math.floor(Math.random() * 999999);
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${selectedRatio.width}&height=${selectedRatio.height}&seed=${seed}&nologo=true`;

    try {
      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image generation failed. Please try again.'));
        img.src = imageUrl;
        setTimeout(() => reject(new Error('Generation timed out. Try a simpler prompt.')), 60000);
      });

      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt: fullPrompt,
        timestamp: Date.now(),
      };
      setImages(prev => [newImage, ...prev]);
      setSelectedImage(newImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `uuon_pstudio_${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30 bg-black/80 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Image Studio
            </h1>
            <p className="text-xs text-gray-500">Text to image generation · UUON Pstudio</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — controls */}
        <div className="w-80 flex-shrink-0 border-r border-purple-500/20 flex flex-col overflow-y-auto bg-black/40">
          <div className="p-4 space-y-4">
            {/* Prompt */}
            <div>
              <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 block">
                Your Prompt
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your image... e.g. A glowing sacred lotus in space with golden rays"
                className="w-full h-28 bg-black/50 border border-purple-500/30 rounded-lg p-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-purple-400"
              />
              <p className="text-xs text-gray-600 mt-1">Press Enter to generate</p>
            </div>

            {/* Style presets */}
            <div>
              <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 block">
                Style
              </label>
              <div className="grid grid-cols-2 gap-1">
                {STYLE_PRESETS.map(style => (
                  <button
                    key={style.label}
                    onClick={() => setSelectedStyle(style)}
                    className={`text-xs px-2 py-1.5 rounded border transition-all text-left truncate ${
                      selectedStyle.label === style.label
                        ? 'bg-purple-600/40 border-purple-400 text-purple-200'
                        : 'border-gray-700 text-gray-400 hover:border-purple-500/50 hover:text-gray-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect ratio */}
            <div>
              <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 block">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-1">
                {ASPECT_RATIOS.map(ratio => (
                  <button
                    key={ratio.label}
                    onClick={() => setSelectedRatio(ratio)}
                    className={`text-xs px-2 py-1.5 rounded border transition-all ${
                      selectedRatio.label === ratio.label
                        ? 'bg-purple-600/40 border-purple-400 text-purple-200'
                        : 'border-gray-700 text-gray-400 hover:border-purple-500/50 hover:text-gray-200'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <Button
              onClick={generateImage}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>

            {error && (
              <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Prompt ideas */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Ideas — click to use
              </label>
              <div className="space-y-1">
                {PROMPT_IDEAS.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(idea)}
                    className="w-full text-left text-xs text-gray-500 hover:text-purple-300 py-1 px-2 rounded hover:bg-purple-900/20 transition-all"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — preview + history */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main preview */}
          <div className="flex-1 flex items-center justify-center bg-black/20 overflow-hidden p-6">
            {loading ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-purple-300 font-medium">Generating your image...</p>
                  <p className="text-gray-600 text-xs mt-1">This usually takes 10–30 seconds</p>
                </div>
              </div>
            ) : selectedImage ? (
              <div className="relative max-h-full max-w-full">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="max-h-full max-w-full object-contain rounded-lg border border-purple-500/20 shadow-2xl"
                  style={{ maxHeight: 'calc(100vh - 300px)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg p-3 flex items-end justify-between">
                  <p className="text-xs text-gray-300 line-clamp-2 flex-1 mr-3">{selectedImage.prompt}</p>
                  <Button
                    onClick={() => downloadImage(selectedImage.url, selectedImage.prompt)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-500 text-white flex-shrink-0"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-40">
                <Image className="w-16 h-16 text-purple-400 mx-auto" />
                <div>
                  <p className="text-gray-400 font-medium">Your generated images will appear here</p>
                  <p className="text-gray-600 text-xs mt-1">Type a prompt and click Generate</p>
                </div>
              </div>
            )}
          </div>

          {/* History strip */}
          {images.length > 0 && (
            <div className="flex-shrink-0 border-t border-purple-500/20 bg-black/40 p-3">
              <p className="text-xs text-gray-500 mb-2">History ({images.length})</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <div
                    key={img.timestamp}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 cursor-pointer rounded overflow-hidden border-2 transition-all ${
                      selectedImage?.timestamp === img.timestamp
                        ? 'border-purple-400'
                        : 'border-gray-700 hover:border-purple-500/50'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
