import React from 'react';
import { useParametric } from '../lib/stores/useParametric';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export function GameUI() {
  const {
    gameState,
    updateGameState,
    toggleGameMode
  } = useParametric();

  const startGame = () => {
    updateGameState({
      phase: 'playing',
      score: 0,
      level: 1,
      timeRemaining: 60,
      targetsRemaining: 10
    });
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(0).padStart(2, '0')}`;
  };

  if (gameState.phase === 'menu') {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <Card className="w-96 bg-black/80 border-green-500/30 text-white">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-green-300 mb-4">
              Parametric Explorer Game
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              Navigate through the parametric curve and collect targets!
            </p>
            <div className="space-y-3">
              <Button
                onClick={startGame}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Start Game
              </Button>
              <Button
                onClick={toggleGameMode}
                variant="outline"
                className="w-full border-green-500/50 text-green-300"
              >
                Exit Game Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState.phase === 'playing') {
    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <Card className="bg-black/80 border-green-500/30 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-green-200">SCORE</div>
                <Badge variant="outline" className="text-green-300 bg-green-500/20">
                  {gameState.score}
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-blue-200">LEVEL</div>
                <Badge variant="outline" className="text-blue-300 bg-blue-500/20">
                  {gameState.level}
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-yellow-200">TIME</div>
                <Badge variant="outline" className="text-yellow-300 bg-yellow-500/20">
                  {formatTime(gameState.timeRemaining)}
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-red-200">TARGETS</div>
                <Badge variant="outline" className="text-red-300 bg-red-500/20">
                  {gameState.targetsRemaining}
                </Badge>
              </div>
            </div>
            
            <div className="mt-3">
              <Progress 
                value={(gameState.timeRemaining / 60) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState.phase === 'ended') {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <Card className="w-96 bg-black/80 border-blue-500/30 text-white">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">
              Game Complete!
            </h2>
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-gray-300">Final Score: </span>
                <Badge variant="outline" className="text-green-300 bg-green-500/20">
                  {gameState.score}
                </Badge>
              </div>
              <div>
                <span className="text-gray-300">Level Reached: </span>
                <Badge variant="outline" className="text-blue-300 bg-blue-500/20">
                  {gameState.level}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={startGame}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Play Again
              </Button>
              <Button
                onClick={toggleGameMode}
                variant="outline"
                className="w-full border-blue-500/50 text-blue-300"
              >
                Exit Game Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
