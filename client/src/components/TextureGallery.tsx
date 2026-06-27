import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TextureGalleryProps {
  onClose: () => void;
}

interface TextureInfo {
  name: string;
  symbol: string;
  description: string;
  tier1: string;
  tier2: string;
  tier3: string;
}

const textures: TextureInfo[] = [
  {
    name: 'Chakra Mandala',
    symbol: 'chakra',
    description: '7 energy centers in circular sacred geometry',
    tier1: '/textures/sacred_symbols/tier1/chakra_mandala_diffuse_t1.png',
    tier2: '/textures/sacred_symbols/tier2/chakra_mandala_diffuse_t2.png',
    tier3: '/textures/sacred_symbols/tier3/chakra_mandala_diffuse_t3.png'
  },
  {
    name: 'Egyptian Ankh',
    symbol: 'ankh',
    description: 'Ancient symbol of life and immortality',
    tier1: '/textures/sacred_symbols/tier1/ankh_diffuse_t1.png',
    tier2: '/textures/sacred_symbols/tier2/ankh_diffuse_t2.png',
    tier3: '/textures/sacred_symbols/tier3/ankh_diffuse_t3.png'
  },
  {
    name: 'Hamsa Hand',
    symbol: 'hamsa',
    description: 'Hand of Fatima - protection symbol',
    tier1: '/textures/sacred_symbols/tier1/hamsa_diffuse_t1.png',
    tier2: '/textures/sacred_symbols/tier2/hamsa_diffuse_t2.png',
    tier3: '/textures/sacred_symbols/tier3/hamsa_diffuse_t3.png'
  },
  {
    name: 'Celtic Cross',
    symbol: 'cross',
    description: 'Sacred cross with intricate knotwork',
    tier1: '/textures/sacred_symbols/tier1/celtic_cross_diffuse_t1.png',
    tier2: '/textures/sacred_symbols/tier2/celtic_cross_diffuse_t2.png',
    tier3: '/textures/sacred_symbols/tier3/celtic_cross_diffuse_t3.png'
  },
  {
    name: 'Sri Yantra',
    symbol: 'yantra',
    description: 'Hindu tantric diagram with nine triangles',
    tier1: '/textures/sacred_symbols/tier1/sri_yantra_diffuse_t1.png',
    tier2: '/textures/sacred_symbols/tier2/sri_yantra_diffuse_t2.png',
    tier3: '/textures/sacred_symbols/tier3/sri_yantra_diffuse_t3.png'
  },
  {
    name: 'Flower of Life',
    symbol: 'flower',
    description: 'Sacred geometry pattern of creation',
    tier1: '/textures/sacred_symbols/tier1/flower_of_life_diffuse_t1.png',
    tier2: '/textures/sacred_symbols/tier2/flower_of_life_diffuse_t2.png',
    tier3: '/textures/sacred_symbols/tier3/flower_of_life_diffuse_t3.png'
  }
];

export function TextureGallery({ onClose }: TextureGalleryProps) {
  const [selectedTier, setSelectedTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier3');

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'tier1': return '8-bit (16 colors)';
      case 'tier2': return '12-bit (32 colors)';
      case 'tier3': return '16-bit (64 colors)';
      default: return tier;
    }
  };

  const downloadTexture = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_${selectedTier}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl bg-black/95 border-purple-500/30 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-purple-400" />
                Sacred Symbol Texture Gallery
              </CardTitle>
              <p className="text-sm text-gray-400 mt-1">Stylized pixel art textures for 3D models</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tier Selector */}
          <div className="flex items-center gap-4 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <label className="text-purple-200 font-medium">Quality Tier:</label>
            <Select value={selectedTier} onValueChange={(value: any) => setSelectedTier(value)}>
              <SelectTrigger className="bg-black/50 border-purple-500/30 text-white w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-purple-500/30">
                <SelectItem value="tier1" className="text-white hover:bg-purple-500/20">
                  Tier 1: {getTierLabel('tier1')}
                </SelectItem>
                <SelectItem value="tier2" className="text-white hover:bg-purple-500/20">
                  Tier 2: {getTierLabel('tier2')}
                </SelectItem>
                <SelectItem value="tier3" className="text-white hover:bg-purple-500/20">
                  Tier 3: {getTierLabel('tier3')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Texture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textures.map((texture) => {
              const currentTexture = texture[selectedTier];
              
              return (
                <Card key={texture.symbol} className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 hover:border-purple-400/50 transition-all">
                  <CardContent className="p-4 space-y-3">
                    {/* Texture Preview */}
                    <div className="relative aspect-square bg-black/50 rounded-lg overflow-hidden border border-purple-500/30">
                      <img
                        src={currentTexture}
                        alt={texture.name}
                        className="w-full h-full object-contain"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>

                    {/* Texture Info */}
                    <div>
                      <h3 className="text-lg font-bold text-purple-200">{texture.name}</h3>
                      <p className="text-xs text-gray-400">{texture.description}</p>
                    </div>

                    {/* Download Button */}
                    <Button
                      onClick={() => downloadTexture(currentTexture, texture.symbol)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download {getTierLabel(selectedTier).split(' ')[0]}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 space-y-2 text-sm">
            <h4 className="text-blue-300 font-semibold">About These Textures:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-xs">
              <li><strong>Tier 1 (8-bit):</strong> 16 colors max, flat shading with dithering, classic retro style</li>
              <li><strong>Tier 2 (12-bit):</strong> 32 colors, basic light wrapping and soft shadows</li>
              <li><strong>Tier 3 (16-bit):</strong> 64 colors, smooth blending with rim lighting effects</li>
              <li>All textures feature sacred symbols: mandalas, chakras, ankh, hamsa, crosses, yantras</li>
              <li>Perfect for 3D model texturing, game assets, spiritual visualization</li>
              <li>Optimized for export to GLB, STL, USD formats</li>
            </ul>
          </div>

          {/* Usage Instructions */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 space-y-2 text-sm">
            <h4 className="text-green-300 font-semibold">How to Use:</h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-300 text-xs">
              <li>Select your desired quality tier from the dropdown above</li>
              <li>Click "Download" on any texture to save it to your device</li>
              <li>Apply textures to your 3D models in external software (Blender, Maya, etc.)</li>
              <li>Export your textured models from this parametric engine as GLB files</li>
              <li>Share your creations on Sketchfab, ArtStation, or social media</li>
            </ol>
          </div>

          {/* Artist Credit */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-700">
            <p>Sacred Symbol Textures • Pixel Art Style • UUON Pstudio</p>
            <p className="mt-1">© 2025 UUON Pstudio</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
