import React from 'react';
import { useParametric } from '../lib/stores/useParametric';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function RenderPanel() {
  const {
    renderStyle,
    setRenderStyle,
    colorScheme,
    setColorScheme,
    backgroundStyle,
    setBackgroundStyle,
    showWireframe,
    toggleWireframe
  } = useParametric();

  const renderStyles = [
    'string',
    'tube',
    'ribbon',
    'solid',
    'mesh',
    'wireframe'
  ];

  const colorSchemes = [
    'rainbow',
    'ocean',
    'sunset',
    'neon',
    'plasma',
    'cool'
  ];

  const backgroundStyles = [
    'gradient',
    'stars',
    'void'
  ];

  return (
    <Card className="absolute bottom-4 left-96 w-auto bg-black/90 border-purple-500/30 text-white">
      <CardContent className="py-2 px-4">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs text-purple-200">Style:</label>
            <Select value={renderStyle} onValueChange={setRenderStyle}>
              <SelectTrigger className="bg-black/50 border-purple-500/30 text-white w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-purple-500/30">
                {renderStyles.map((style) => (
                  <SelectItem
                    key={style}
                    value={style}
                    className="text-white hover:bg-purple-500/20 text-xs"
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-purple-200">Color:</label>
            <Select value={colorScheme} onValueChange={setColorScheme}>
              <SelectTrigger className="bg-black/50 border-purple-500/30 text-white w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-purple-500/30">
                {colorSchemes.map((scheme) => (
                  <SelectItem
                    key={scheme}
                    value={scheme}
                    className="text-white hover:bg-purple-500/20 text-xs"
                  >
                    {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-purple-200">Background:</label>
            <Select value={backgroundStyle} onValueChange={setBackgroundStyle}>
              <SelectTrigger className="bg-black/50 border-purple-500/30 text-white w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-purple-500/30">
                {backgroundStyles.map((style) => (
                  <SelectItem
                    key={style}
                    value={style}
                    className="text-white hover:bg-purple-500/20 text-xs"
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={toggleWireframe}
            className={`text-xs px-3 py-1 rounded border ${
              showWireframe
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-black/50 border-purple-500/30 text-purple-200'
            }`}
          >
            Wireframe
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
