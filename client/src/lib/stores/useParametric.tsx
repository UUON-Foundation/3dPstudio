import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type CurveType = 
  | 'hypocycloid'
  | 'lissajous'
  | 'rose'
  | 'spiral'
  | 'helix'
  | 'epitrochoid'
  | 'butterfly'
  | 'flower'
  | 'star'
  | 'nebula_helix'
  | 'string_theory_tree'
  | 'factorial'
  | 'rocket'
  | 'cultural_glyph'
  | 'torus_knot'
  | 'strange_attractor'
  | 'mobius_strip'
  | 'klein_bottle'
  | 'trefoil_knot'
  | 'hopf_fibration'
  | 'clifford_torus'
  | 'boys_surface'
  | 'roman_surface'
  | 'enneper_surface'
  | 'catenoid'
  | 'helicoid';

export type RenderStyle = 'string' | 'tube' | 'ribbon' | 'solid' | 'mesh' | 'wireframe';
export type ColorScheme = 'rainbow' | 'ocean' | 'sunset' | 'neon' | 'plasma' | 'cool';
export type BackgroundStyle = 'gradient' | 'stars' | 'void';

export interface GameState {
  phase: 'menu' | 'playing' | 'ended';
  score: number;
  level: number;
  timeRemaining: number;
  targetsRemaining: number;
}

interface ParametricState {
  // Mathematical parameters
  curveType: CurveType;
  k: number;
  xFactor: number;
  yFactor: number;
  zFactor: number;
  aFactor: number;
  bFactor: number;
  cFactor: number;
  deltaFactor: number;
  complexity: number;
  
  // Animation
  animationSpeed: number;
  time: number;
  
  // Rendering
  renderStyle: RenderStyle;
  colorScheme: ColorScheme;
  brightness: number;
  showWireframe: boolean;
  backgroundStyle: BackgroundStyle;
  
  // Vector field
  showVectorField: boolean;
  vectorFieldDensity: number;
  vectorFieldScale: number;
  
  // UI state
  gameMode: boolean;
  gameState: GameState;
  showTutorial: boolean;
  
  // Actions
  setCurveType: (type: CurveType) => void;
  setK: (k: number) => void;
  setXFactor: (factor: number) => void;
  setYFactor: (factor: number) => void;
  setZFactor: (factor: number) => void;
  setAFactor: (factor: number) => void;
  setBFactor: (factor: number) => void;
  setCFactor: (factor: number) => void;
  setDeltaFactor: (factor: number) => void;
  setComplexity: (complexity: number) => void;
  
  setAnimationSpeed: (speed: number) => void;
  updateTime: (deltaTime: number) => void;
  
  setRenderStyle: (style: RenderStyle) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setBrightness: (brightness: number) => void;
  toggleWireframe: () => void;
  setBackgroundStyle: (style: BackgroundStyle) => void;
  
  toggleVectorField: () => void;
  setVectorFieldDensity: (density: number) => void;
  setVectorFieldScale: (scale: number) => void;
  
  toggleGameMode: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
  toggleTutorial: () => void;
  
  resetParameters: () => void;
}

export const useParametric = create<ParametricState>()(
  subscribeWithSelector((set, get) => ({
    // Initial mathematical parameters
    curveType: 'hypocycloid',
    k: 3,
    xFactor: 1,
    yFactor: 1,
    zFactor: 1,
    aFactor: 1,
    bFactor: 1,
    cFactor: 1,
    deltaFactor: 1,
    complexity: 1,
    
    // Initial animation
    animationSpeed: 1,
    time: 0,
    
    // Initial rendering
    renderStyle: 'tube',
    colorScheme: 'rainbow',
    brightness: 1.5,
    showWireframe: false,
    backgroundStyle: 'gradient',
    
    // Initial vector field
    showVectorField: false,
    vectorFieldDensity: 1,
    vectorFieldScale: 1,
    
    // Initial UI state
    gameMode: false,
    gameState: {
      phase: 'menu',
      score: 0,
      level: 1,
      timeRemaining: 60,
      targetsRemaining: 10
    },
    showTutorial: false,
    
    // Mathematical parameter actions
    setCurveType: (type) => set({ curveType: type }),
    setK: (k) => set({ k }),
    setXFactor: (factor) => set({ xFactor: factor }),
    setYFactor: (factor) => set({ yFactor: factor }),
    setZFactor: (factor) => set({ zFactor: factor }),
    setAFactor: (factor) => set({ aFactor: factor }),
    setBFactor: (factor) => set({ bFactor: factor }),
    setCFactor: (factor) => set({ cFactor: factor }),
    setDeltaFactor: (factor) => set({ deltaFactor: factor }),
    setComplexity: (complexity) => set({ complexity }),
    
    // Animation actions
    setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
    updateTime: (deltaTime) => set((state) => ({ time: state.time + deltaTime })),
    
    // Rendering actions
    setRenderStyle: (style) => set({ renderStyle: style }),
    setColorScheme: (scheme) => set({ colorScheme: scheme }),
    setBrightness: (brightness) => set({ brightness }),
    toggleWireframe: () => set((state) => ({ showWireframe: !state.showWireframe })),
    setBackgroundStyle: (style) => set({ backgroundStyle: style }),
    
    // Vector field actions
    toggleVectorField: () => set((state) => ({ showVectorField: !state.showVectorField })),
    setVectorFieldDensity: (density) => set({ vectorFieldDensity: density }),
    setVectorFieldScale: (scale) => set({ vectorFieldScale: scale }),
    
    // Game and UI actions
    toggleGameMode: () => set((state) => ({ 
      gameMode: !state.gameMode,
      gameState: { ...state.gameState, phase: 'menu' }
    })),
    updateGameState: (updates) => set((state) => ({ 
      gameState: { ...state.gameState, ...updates }
    })),
    toggleTutorial: () => set((state) => ({ showTutorial: !state.showTutorial })),
    
    // Reset function
    resetParameters: () => set({
      curveType: 'hypocycloid',
      k: 3,
      xFactor: 1,
      yFactor: 1,
      zFactor: 1,
      aFactor: 1,
      bFactor: 1,
      cFactor: 1,
      deltaFactor: 1,
      complexity: 1,
      animationSpeed: 1,
      renderStyle: 'tube',
      colorScheme: 'rainbow',
      brightness: 1.5,
      showWireframe: false,
      showVectorField: false,
      vectorFieldDensity: 1,
      vectorFieldScale: 1,
      time: 0
    })
  }))
);
