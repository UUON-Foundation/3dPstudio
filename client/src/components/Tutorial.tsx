import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useParametric } from '../lib/stores/useParametric';
import { Badge } from './ui/badge';

const tutorialSteps = [
  {
    title: "Welcome to UUON Pstudio",
    content: "A multi-portal creative studio for sacred geometry visualization, AI 3D model generation, AI image creation, and parametric math exploration.",
    tips: ["Use mouse to rotate, zoom, and pan the view", "Try different curve types to see mathematical beauty unfold"]
  },
  {
    title: "Curve Types",
    content: "Choose from 26+ mathematical curve types including hypocycloids, lissajous, spirals, and complex surfaces.",
    tips: ["Start with 'hypocycloid' or 'rose' for classic patterns", "Try 'string_theory_tree' for complex visualizations"]
  },
  {
    title: "Parameters",
    content: "Control the mathematical parameters that define your curves. Each parameter affects the shape in unique ways.",
    tips: ["K Factor: Controls the fundamental frequency", "Complexity: Adds mathematical depth", "XYZ Factors: Scale along axes"]
  },
  {
    title: "Vector Fields",
    content: "Toggle vector field visualization to see the mathematical flow and gradients around your curves.",
    tips: ["Enable Vector Field in the control panel", "Adjust density and scale for different views"]
  },
  {
    title: "Render Styles",
    content: "Experiment with different visualization styles from wireframes to solid tubes and ribbons.",
    tips: ["Tube style shows thickness and flow", "Wireframe reveals structure", "Ribbon creates surfaces"]
  },
  {
    title: "Game Mode",
    content: "Try the interactive game mode where you navigate through parametric curves and collect targets!",
    tips: ["Press G to toggle game mode", "Use WASD keys to move", "Collect targets for points"]
  },
  {
    title: "Export & Sharing",
    content: "Export your creations in multiple formats including GLB (with animation), USD, STL for 3D printing, and JSON for parameters.",
    tips: ["Use the Export Panel for different formats", "GLB includes animation and materials", "Share your mathematical art"]
  }
];

export function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toggleTutorial } = useParametric();

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/90 border-cyan-500/30 text-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-cyan-300">
              {currentTutorial.title}
            </CardTitle>
            <Badge variant="outline" className="text-cyan-300 bg-cyan-500/20">
              {currentStep + 1} / {tutorialSteps.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            {currentTutorial.content}
          </p>

          <div className="bg-cyan-500/10 rounded-lg p-4">
            <h4 className="text-cyan-300 font-semibold mb-2">Tips:</h4>
            <ul className="space-y-1">
              {currentTutorial.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-cyan-500/30">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="border-cyan-500/50 text-cyan-300 disabled:opacity-50"
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep
                      ? 'bg-cyan-400'
                      : index < currentStep
                      ? 'bg-cyan-600'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button
                onClick={toggleTutorial}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Get Started
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Next
              </Button>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <Button
              onClick={toggleTutorial}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Skip Tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
