import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Scene3D } from './Scene3D';
import { ControlPanel } from './ControlPanel';
import { RenderPanel } from './RenderPanel';
import { ExportPanel } from './ExportPanel';
import { InfoPanel } from './InfoPanel';
import { TextureGallery } from './TextureGallery';
import { Model3DGallery } from './Model3DGallery';
import { ImageGenPortal } from './ImageGenPortal';
import { ModelGenPortal } from './ModelGenPortal';
import { GameUI } from './GameUI';
import { Tutorial } from './Tutorial';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import { useParametric } from '../lib/stores/useParametric';
import { useAudio } from '../lib/stores/useAudio';
import { Wand2, Box, Image, Layers, Info, Sparkles } from 'lucide-react';
import * as THREE from 'three';

const controls = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'leftward', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'rightward', keys: ['KeyD', 'ArrowRight'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['ShiftLeft'] },
  { name: 'toggleGame', keys: ['KeyG'] },
  { name: 'toggleTutorial', keys: ['KeyT'] },
  { name: 'reset', keys: ['KeyR'] },
  { name: 'export', keys: ['KeyE'] },
];

type ActivePortal = null | 'info' | 'textures' | 'models' | 'imagegen' | 'modelgen';

export function ParametricExplorer() {
  const { 
    backgroundStyle, 
    setBackgroundStyle,
    gameMode,
    toggleGameMode,
    showTutorial,
    toggleTutorial,
    resetParameters
  } = useParametric();
  
  const { toggleMute } = useAudio();
  const [showControls, setShowControls] = useState(true);
  const [activePortal, setActivePortal] = useState<ActivePortal>(null);

  const openPortal = (portal: ActivePortal) => setActivePortal(portal);
  const closePortal = () => setActivePortal(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyG':
          event.preventDefault();
          toggleGameMode();
          break;
        case 'KeyT':
          event.preventDefault();
          toggleTutorial();
          break;
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            resetParameters();
          }
          break;
        case 'KeyM':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            toggleMute();
          }
          break;
        case 'KeyH':
          event.preventDefault();
          setShowControls(prev => !prev);
          break;
        case 'Digit1':
          event.preventDefault();
          setBackgroundStyle('gradient');
          break;
        case 'Digit2':
          event.preventDefault();
          setBackgroundStyle('stars');
          break;
        case 'Digit3':
          event.preventDefault();
          setBackgroundStyle('void');
          break;
        case 'KeyI':
          event.preventDefault();
          setActivePortal(prev => prev === 'info' ? null : 'info');
          break;
        case 'KeyX':
          event.preventDefault();
          setActivePortal(prev => prev === 'textures' ? null : 'textures');
          break;
        case 'KeyB':
          event.preventDefault();
          setActivePortal(prev => prev === 'models' ? null : 'models');
          break;
        case 'Escape':
          setActivePortal(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleGameMode, toggleTutorial, resetParameters, toggleMute, setBackgroundStyle]);

  const getBackgroundColor = useCallback(() => {
    switch (backgroundStyle) {
      case 'gradient': return '#1a1a2e';
      case 'stars': return '#0a0a0a';
      case 'void': return '#000000';
      default: return '#1a1a2e';
    }
  }, [backgroundStyle]);

  return (
    <WebGLErrorBoundary>
      <div className="w-full h-full relative overflow-hidden">
        <KeyboardControls map={controls}>
          <Canvas
            shadows
            camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 1000 }}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
              premultipliedAlpha: false,
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(getBackgroundColor());
            }}
          >
            <color attach="background" args={[getBackgroundColor()]} />
            <ambientLight intensity={0.3} color="#4a90e2" />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5}
              color="#ffffff"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[-10, -10, -5]} intensity={0.8} color="#ff6b6b" />
            <spotLight
              position={[0, 20, 10]}
              angle={0.3}
              penumbra={0.2}
              intensity={1.0}
              color="#4ecdc4"
              castShadow
            />
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
          </Canvas>

          {/* UI Overlays */}
          {showControls && (
            <>
              <ControlPanel />
              <RenderPanel />
              <ExportPanel />
            </>
          )}

          {gameMode && <GameUI />}
          {showTutorial && <Tutorial />}

          {/* Portals (fixed overlays) */}
          {activePortal === 'info' && <InfoPanel onClose={closePortal} />}
          {activePortal === 'textures' && <TextureGallery onClose={closePortal} />}
          {activePortal === 'models' && <Model3DGallery onClose={closePortal} />}
          {activePortal === 'imagegen' && <ImageGenPortal onClose={closePortal} />}
          {activePortal === 'modelgen' && <ModelGenPortal onClose={closePortal} />}

          {/* ── Top Navigation Bar ── */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-sm border-b border-white/10 z-10">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                  UUON Pstudio
                </span>
                <span className="text-xs text-gray-500">by UUON Pstudio</span>
              </div>
            </div>

            {/* Portal Navigation */}
            <nav className="flex items-center gap-1">
              <NavButton
                icon={<Layers className="w-3.5 h-3.5" />}
                label="Parametric"
                active={activePortal === null}
                color="cyan"
                onClick={closePortal}
                shortcut="ESC"
              />
              <NavButton
                icon={<Sparkles className="w-3.5 h-3.5" />}
                label="Generate 3D"
                active={activePortal === 'modelgen'}
                color="purple"
                onClick={() => openPortal('modelgen')}
              />
              <NavButton
                icon={<Wand2 className="w-3.5 h-3.5" />}
                label="AI Images"
                active={activePortal === 'imagegen'}
                color="pink"
                onClick={() => openPortal('imagegen')}
              />
              <NavButton
                icon={<Box className="w-3.5 h-3.5" />}
                label="3D Models"
                active={activePortal === 'models'}
                color="cyan"
                onClick={() => openPortal('models')}
                shortcut="B"
              />
              <NavButton
                icon={<Image className="w-3.5 h-3.5" />}
                label="Textures"
                active={activePortal === 'textures'}
                color="pink"
                onClick={() => openPortal('textures')}
                shortcut="X"
              />
              <NavButton
                icon={<Info className="w-3.5 h-3.5" />}
                label="Info"
                active={activePortal === 'info'}
                color="blue"
                onClick={() => openPortal('info')}
                shortcut="I"
              />
            </nav>
          </div>

          {/* Help text */}
          <div className="absolute bottom-16 left-4 text-white text-xs opacity-40 pointer-events-none">
            H = toggle controls · G = game mode · T = tutorial · ESC = close portal
          </div>
        </KeyboardControls>
      </div>
    </WebGLErrorBoundary>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  color: 'cyan' | 'purple' | 'pink' | 'blue';
  onClick: () => void;
  shortcut?: string;
}

function NavButton({ icon, label, active, color, onClick, shortcut }: NavButtonProps) {
  const colorMap = {
    cyan:   { active: 'bg-cyan-600/80 border-cyan-400 text-cyan-100', inactive: 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-600/20' },
    purple: { active: 'bg-purple-600/80 border-purple-400 text-purple-100', inactive: 'border-purple-500/30 text-purple-400 hover:bg-purple-600/20' },
    pink:   { active: 'bg-pink-600/80 border-pink-400 text-pink-100', inactive: 'border-pink-500/30 text-pink-400 hover:bg-pink-600/20' },
    blue:   { active: 'bg-blue-600/80 border-blue-400 text-blue-100', inactive: 'border-blue-500/30 text-blue-400 hover:bg-blue-600/20' },
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all ${
        active ? colorMap[color].active : colorMap[color].inactive
      }`}
    >
      {icon}
      {label}
      {shortcut && <span className="opacity-40 text-[10px] ml-0.5">[{shortcut}]</span>}
    </button>
  );
}
