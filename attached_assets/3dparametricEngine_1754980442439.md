
# 3D Parametric Engine - Complete Export Documentation

**Author:** UUON Pstudio  
**Copyright:** © 2024 UUON Pstudio. All rights reserved.  
**Date:** December 30, 2024  

## Overview

This is a complete 3D parametric curve explorer built with React, Three.js, and TypeScript that allows users to visualize and interact with mathematical curves in 3D space. The application features real-time curve generation, multiple visualization styles, interactive controls, and a game mode for educational exploration.

## System Architecture

### Core Technologies
- **Frontend Framework:** React 18 with TypeScript
- **3D Rendering:** Three.js with React Three Fiber (@react-three/fiber)
- **3D Utilities:** React Three Drei (@react-three/drei)
- **State Management:** Zustand with subscribeWithSelector
- **Animation:** Framer Motion
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Backend:** Express.js with TypeScript
- **Database:** SQLite with Drizzle ORM
- **Package Manager:** npm

### Project Structure
```
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── lib/               # Utilities and stores
│   │   ├── styles/            # CSS files
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   └── index.html             # HTML template
├── server/                    # Backend Express application
├── shared/                    # Shared TypeScript schemas
└── migrations/                # Database migrations
```

## Dependencies

### Core Dependencies (package.json)
```json
{
  "dependencies": {
    "@react-three/drei": "^9.114.3",
    "@react-three/fiber": "^8.17.10",
    "@tanstack/react-query": "^5.62.3",
    "drizzle-orm": "^0.36.4",
    "express": "^4.21.1",
    "framer-motion": "^11.15.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.171.0",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.171.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "better-sqlite3": "^12.1.0",
    "drizzle-kit": "^0.31.2",
    "postcss": "^8.5.1",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vite": "^6.0.3"
  }
}
```

## Mathematical Engine

### Core Mathematical Functions

#### Curve Types Supported
- **Hypocycloid:** Classic epicycloid curves with cardioid and nephroid variants
- **Lissajous:** Sine wave combinations creating complex 3D patterns
- **Rose:** Mathematical roses with configurable petal counts
- **Spiral:** Archimedean and logarithmic spiral variants
- **Helix:** 3D helical structures with variable pitch
- **Epitrochoid:** Rolling circle curves with extended patterns
- **Butterfly:** Lorenz butterfly attractors
- **Flower:** Parametric flower patterns with dynamic petals
- **Star:** Multi-pointed star configurations
- **Nebula Helix:** Chaotic cosmic-inspired patterns
- **String Theory Tree:** Branching patterns with quantum oscillations
- **Factorial:** Mathematical factorial visualizations
- **Rocket:** Rocket exhaust plume physics simulation
- **Cultural Glyph:** 12-tetrahedron sacred geometry formationsu
- **Advanced Surfaces:** Torus knots, strange attractors, minimal surfaces, etc.

#### Mathematical Equations

**Hypocycloid:**
```
X(t) = (k-1)·cos(t) + cos((k-1)·t)
Y(t) = (k-1)·sin(t) - sin((k-1)·t) 
Z(t) = z·sin(complexity·t)
```

**Lissajous:**
```
X(t) = cos(k·t)
Y(t) = sin(complexity·t)
Z(t) = z·sin((k+complexity)·t)
```

**Rose:**
```
X(t) = cos(k·t)·cos(t)
Y(t) = cos(k·t)·sin(t)
Z(t) = z·sin(complexity·t)
```

## Key Components

### 1. ParametricExplorer.tsx
Main application component that orchestrates the entire system.

```typescript
// Key features:
- Canvas initialization with Three.js scene
- Keyboard controls integration
- Background style management
- Audio system initialization
- Component coordination
```

### 2. Scene3D.tsx
Core 3D rendering engine handling curve visualization and interactions.

```typescript
// Key features:
- Real-time curve generation and rendering
- Camera controls and animation
- Game mode collision detection
- Target system management
- Keyboard input handling
```

### 3. mathUtils.tsx
Mathematical calculation engine for parametric curves.

```typescript
// Key features:
- calculatePoint(): Single point calculation for any curve type
- generateCurvePoints(): Array generation for curve visualization
- Recursive factor system for enhanced complexity
- Safe equation evaluation for custom formulas
- Color scheme management
```

### 4. geometryUtils.tsx
3D geometry creation utilities for different visualization styles.

```typescript
// Key features:
- createStringCurve(): Line-based visualization
- createTubeCurve(): Tube geometry with material properties
- createRibbonCurve(): Ribbon-style parametric surfaces
- createSolidShape(): Solid geometric forms
- createMeshSurface(): Complex mesh surfaces
- createWireframeCurve(): Wireframe visualizations
```

### 5. ControlPanel.tsx
User interface for parameter manipulation.

```typescript
// Key features:
- Curve type selection (26+ types)
- Parameter sliders (k, x, y, z, a, b, c, delta, complexity)
- Real-time value updates
- Animation controls
- Reset functionality
```

### 6. RenderPanel.tsx
Visualization options and export functionality.

```typescript
// Key features:
- Render style selection (string, tube, ribbon, solid, mesh, wireframe)
- Color scheme switching (6 schemes with gradients)
- Brightness control
- Wireframe overlay toggle
- Background type selection
- USDZ export functionality
```

### 7. Store Management (Zustand)

#### useParametric.tsx
```typescript
// State management for:
- Mathematical parameters (k, factors, complexity)
- Visualization settings (render style, colors, brightness)
- Animation state (speed, direction, time)
- Game mode state (score, targets, level)
- UI state (modals, panels)
```

#### useAudio.tsx
```typescript
// Audio system management:
- Background music control
- Sound effects (hit, success sounds)
- Volume management
- Audio loading and initialization
```

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm package manager

### Installation Steps

1. **Clone/Extract Project Files**
```bash
# Create new directory
mkdir 3d-parametric-engine
cd 3d-parametric-engine

# Copy all project files maintaining directory structure
```

2. **Install Dependencies**
```bash
npm install
```

3. **Database Setup**
```bash
# Generate database
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate
```

4. **Development Server**
```bash
# Start development server (runs both frontend and backend)
npm run dev
```

5. **Build for Production**
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Configuration Files

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": "http://localhost:5000"
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared")
    }
  }
});
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... additional color definitions
      }
    },
  },
  plugins: [],
};

export default config;
```

### tsconfig.json
```json
{
  "include": ["client/src/**/*", "shared/**/*", "server/**/*"],
  "exclude": ["node_modules", "build", "dist", "**/*.test.ts"],
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/typescript/tsbuildinfo",
    "noEmit": true,
    "module": "ESNext",
    "strict": true,
    "lib": ["esnext", "dom", "dom.iterable"],
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "types": ["node", "vite/client"],
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

## Key Features

### Mathematical Engine
- Parametric curve calculation using configurable k-values, z-factors, and complexity
- Dynamic point generation with adaptive detail levels
- Color scheme system with gradient mapping
- Curve classification for educational purposes
- Recursive factor system with 3-level depth for enhanced visual complexity

### Visualization System
- Multiple render styles: string, tube, ribbon, solid, mesh, wireframe
- Real-time material properties and lighting
- Color scheme switching with smooth transitions
- Performance optimization for real-time rendering
- Wireframe overlay support

### User Interface
- Responsive control panels for parameter adjustment
- Modal system for tutorials and game states
- Keyboard shortcuts for power users
- Mobile-responsive design
- Cinematic HUD with holographic effects

### Game Mode
- Target collection mechanics with collision detection
- Score and timing systems
- Progressive difficulty levels
- Audio feedback system (muted by default)
- Real-time performance metrics

### Export Capabilities
- USDZ format export for AR/VR applications
- 3D model generation from parametric curves
- Multiple export formats supported
- Real-time model generation

## Data Flow

1. **Parameter Input** → Control panels update Zustand stores
2. **State Changes** → Trigger curve recalculation in math utilities  
3. **Curve Generation** → Create 3D geometry using Three.js
4. **Rendering** → React Three Fiber renders scene with updated geometry
5. **User Interaction** → Camera controls and keyboard input update parameters
6. **Game Logic** → Collision detection and score updates in game mode

## Performance Optimizations

### Memory Management
- Efficient geometry disposal and recreation
- Point array optimization with adaptive detail levels
- Texture and material reuse
- Component memoization with React.memo

### Rendering Optimizations
- Three.js object pooling for targets
- Frustum culling for off-screen objects
- Level-of-detail (LOD) for complex geometries
- Selective re-rendering based on parameter changes

## Deployment

### Production Build
```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

### Environment Variables
```bash
# Optional environment configuration
NODE_ENV=production
PORT=5000
DATABASE_URL=./data.db
```

## Browser Compatibility

### Minimum Requirements
- WebGL 2.0 support
- ES2020 JavaScript features
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Recommended Specifications
- 4GB RAM minimum
- Dedicated graphics card for optimal performance
- 1920x1080 resolution or higher

## API Endpoints

### Backend Routes (Express.js)
```typescript
// Health check
GET /api/health

// Model data management
GET /api/models
POST /api/models
PUT /api/models/:id
DELETE /api/models/:id

// Export functionality
POST /api/export/usdz
POST /api/export/geometry
```

## Database Schema

### Models Table (SQLite + Drizzle ORM)
```sql
CREATE TABLE models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  curve_type TEXT,
  parameters TEXT, -- JSON string
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Common Issues

1. **WebGL Context Lost**
   - Reduce complexity parameter
   - Lower detail level
   - Restart browser

2. **Performance Issues**
   - Disable wireframe overlay
   - Reduce point density
   - Use simpler render styles

3. **Build Errors**
   - Clear node_modules and reinstall
   - Update Node.js to latest LTS
   - Check TypeScript version compatibility

## License & Attribution

```
© 2024 UUON Pstudio. All rights reserved.

This 3D Parametric Engine is a proprietary educational and research tool
developed for mathematical visualization and interactive learning.

Dependencies are used under their respective open-source licenses:
- React (MIT License)
- Three.js (MIT License)
- React Three Fiber (MIT License)
- Additional dependencies as listed in package.json
```

## Contact & Support

**Developer:** UUON Pstudio  
**Organization:** UUON Pstudio  
**Project Type:** Educational Mathematics Visualization Tool  
**Last Updated:** December 30, 2024  

---

## Technical Implementation Notes

### Critical Code Snippets

#### Curve Point Calculation
```typescript
export function calculatePoint(
  t: number, 
  k: number, 
  xFactor: number = 1.0,
  yFactor: number = 1.0,
  zFactor: number, 
  aFactor: number = 1.0,
  bFactor: number = 1.0,
  cFactor: number = 1.0,
  deltaFactor: number = 1.0,
  complexity: number, 
  curveType: CurveType = "hypocycloid",
  customEquations?: { x: string; y: string; z: string }
): THREE.Vector3
```

#### Geometry Creation
```typescript
export function createTubeCurve(
  points: THREE.Vector3[], 
  colorScheme: keyof typeof colorSchemes, 
  thickness: number, 
  showWireframe: boolean,
  brightness: number = 1.0
): THREE.Object3D
```

#### State Management
```typescript
export const useParametric = create<ParametricState>()(
  subscribeWithSelector((set, get) => ({
    // 50+ state properties and methods
  }))
);
```

This documentation provides complete information for recreating, deploying, and maintaining the 3D Parametric Engine in any environment.
