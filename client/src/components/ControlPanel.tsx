import React from 'react';
import { useParametric } from '../lib/stores/useParametric';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ControlPanel() {
  const {
    curveType,
    setCurveType,
    k,
    setK,
    xFactor,
    setXFactor,
    yFactor,
    setYFactor,
    zFactor,
    setZFactor,
    aFactor,
    setAFactor,
    bFactor,
    setBFactor,
    cFactor,
    setCFactor,
    deltaFactor,
    setDeltaFactor,
    complexity,
    setComplexity,
    animationSpeed,
    setAnimationSpeed,
    resetParameters,
    showVectorField,
    toggleVectorField,
    vectorFieldDensity,
    setVectorFieldDensity,
    vectorFieldScale,
    setVectorFieldScale
  } = useParametric();

  const curveTypes = [
    'hypocycloid',
    'lissajous',
    'rose',
    'spiral',
    'helix',
    'epitrochoid',
    'butterfly',
    'flower',
    'star',
    'nebula_helix',
    'string_theory_tree',
    'factorial',
    'rocket',
    'cultural_glyph',
    'torus_knot',
    'strange_attractor',
    'mobius_strip',
    'klein_bottle',
    'trefoil_knot',
    'hopf_fibration',
    'clifford_torus',
    'boys_surface',
    'roman_surface',
    'enneper_surface',
    'catenoid',
    'helicoid'
  ];

  return (
    <Card className="absolute top-4 right-4 w-80 bg-black/80 border-blue-500/30 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-blue-300">
          Parametric Controls
        </CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={resetParameters}
            variant="outline"
            size="sm"
            className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
          >
            Reset
          </Button>
          <Button
            onClick={toggleVectorField}
            variant={showVectorField ? "default" : "outline"}
            size="sm"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            Vector Field
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Curve Type Selection */}
        <div>
          <label className="text-sm text-blue-200 mb-2 block">Curve Type</label>
          <Select value={curveType} onValueChange={setCurveType}>
            <SelectTrigger className="bg-black/50 border-blue-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-blue-500/30">
              {curveTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="text-white hover:bg-blue-500/20"
                >
                  {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-blue-200 mb-2 block">K Factor</label>
            <Slider
              value={[k]}
              onValueChange={(value) => setK(value[0])}
              min={0.1}
              max={20}
              step={0.1}
              className="mb-1"
            />
            <Badge variant="outline" className="text-xs">
              {k.toFixed(1)}
            </Badge>
          </div>

          <div>
            <label className="text-sm text-blue-200 mb-2 block">Complexity</label>
            <Slider
              value={[complexity]}
              onValueChange={(value) => setComplexity(value[0])}
              min={0.1}
              max={10}
              step={0.1}
              className="mb-1"
            />
            <Badge variant="outline" className="text-xs">
              {complexity.toFixed(1)}
            </Badge>
          </div>
        </div>

        {/* Axis Factors */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-red-200 mb-2 block">X Factor</label>
            <Slider
              value={[xFactor]}
              onValueChange={(value) => setXFactor(value[0])}
              min={0.1}
              max={5}
              step={0.1}
              className="mb-1"
            />
            <Badge variant="outline" className="text-xs bg-red-500/20">
              {xFactor.toFixed(1)}
            </Badge>
          </div>

          <div>
            <label className="text-sm text-green-200 mb-2 block">Y Factor</label>
            <Slider
              value={[yFactor]}
              onValueChange={(value) => setYFactor(value[0])}
              min={0.1}
              max={5}
              step={0.1}
              className="mb-1"
            />
            <Badge variant="outline" className="text-xs bg-green-500/20">
              {yFactor.toFixed(1)}
            </Badge>
          </div>

          <div>
            <label className="text-sm text-blue-200 mb-2 block">Z Factor</label>
            <Slider
              value={[zFactor]}
              onValueChange={(value) => setZFactor(value[0])}
              min={0.1}
              max={5}
              step={0.1}
              className="mb-1"
            />
            <Badge variant="outline" className="text-xs bg-blue-500/20">
              {zFactor.toFixed(1)}
            </Badge>
          </div>
        </div>

        {/* Advanced Parameters */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-purple-200 mb-2 block">A Factor</label>
            <Slider
              value={[aFactor]}
              onValueChange={(value) => setAFactor(value[0])}
              min={0.1}
              max={3}
              step={0.1}
              className="mb-1"
            />
            <Badge variant="outline" className="text-xs">
              {aFactor.toFixed(1)}
            </Badge>
          </div>

          <div>
            <label className="text-sm text-purple-200 mb-2 block">B Factor</label>
            <Slider
              value={[bFactor]}
              onValueChange={(value) => setBFactor(value[0])}
              min={0.1}
              max={3}
              step={0.1}
              className="mb-1"
            />
            <Badge variant="outline" className="text-xs">
              {bFactor.toFixed(1)}
            </Badge>
          </div>

          <div>
            <label className="text-sm text-yellow-200 mb-2 block">C Factor</label>
            <Slider
              value={[cFactor]}
              onValueChange={(value) => setCFactor(value[0])}
              min={0.1}
              max={3}
              step={0.1}
              className="mb-1"
            />
            <Badge variant="outline" className="text-xs">
              {cFactor.toFixed(1)}
            </Badge>
          </div>

          <div>
            <label className="text-sm text-orange-200 mb-2 block">Delta</label>
            <Slider
              value={[deltaFactor]}
              onValueChange={(value) => setDeltaFactor(value[0])}
              min={0.1}
              max={3}
              step={0.1}
              className="mb-1"
            />
            <Badge variant="outline" className="text-xs">
              {deltaFactor.toFixed(1)}
            </Badge>
          </div>
        </div>

        {/* Animation Speed */}
        <div>
          <label className="text-sm text-cyan-200 mb-2 block">Animation Speed</label>
          <Slider
            value={[animationSpeed]}
            onValueChange={(value) => setAnimationSpeed(value[0])}
            min={0}
            max={3}
            step={0.1}
            className="mb-1"
          />
          <Badge variant="outline" className="text-xs">
            {animationSpeed.toFixed(1)}x
          </Badge>
        </div>

        {/* Vector Field Controls */}
        {showVectorField && (
          <div className="border-t border-purple-500/30 pt-4 space-y-3">
            <div>
              <label className="text-sm text-purple-200 mb-2 block">Field Density</label>
              <Slider
                value={[vectorFieldDensity]}
                onValueChange={(value) => setVectorFieldDensity(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="mb-1"
              />
              <Badge variant="outline" className="text-xs bg-purple-500/20">
                {vectorFieldDensity.toFixed(1)}
              </Badge>
            </div>

            <div>
              <label className="text-sm text-purple-200 mb-2 block">Field Scale</label>
              <Slider
                value={[vectorFieldScale]}
                onValueChange={(value) => setVectorFieldScale(value[0])}
                min={0.1}
                max={2}
                step={0.1}
                className="mb-1"
              />
              <Badge variant="outline" className="text-xs bg-purple-500/20">
                {vectorFieldScale.toFixed(1)}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
