# 3D Parametric Engine

## Overview

The 3D Parametric Engine is a sophisticated mathematical visualization tool built with React, Three.js, and TypeScript. It allows users to explore and interact with parametric curves and vector fields in 3D space. The application features real-time curve generation, multiple rendering styles, interactive game modes, and export capabilities for AR/VR applications. Users can visualize complex mathematical concepts through 26+ different curve types including hypocycloids, lissajous patterns, spirals, and advanced surfaces like Klein bottles and Mobius strips.

**New Feature:** Sacred Symbol Texture Library with 18 pixel art textures (6 symbols × 3 quality tiers) designed for 3D model texturing and spiritual visualization. Accessible via the Textures button or pressing "X".

## Recent Changes (October 17, 2025)

- **Sacred Symbol Texture System:**
  - Generated 18 stylized pixel art textures featuring sacred symbols (chakras, ankh, hamsa, celtic cross, sri yantra, flower of life)
  - Three quality tiers: Tier 1 (8-bit, 16 colors), Tier 2 (12-bit, 32 colors), Tier 3 (16-bit, 64 colors)
  - Created TextureGallery component accessible via "X" key or Textures button
  - Organized textures in `/textures/sacred_symbols/` directory structure
  - Comprehensive texture catalog with usage guidelines and spiritual meanings
- Enhanced export system with GLTF/GLB support including full animation data and embedded author metadata
- Redesigned UI with compact horizontal panels (RenderPanel, ExportPanel) at bottom
- Created comprehensive InfoPanel with mathematical documentation and open source credits
- Added WebGL error handling with graceful fallback for headless environments

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Framework**: React 18 with TypeScript provides the foundation, utilizing functional components with hooks for state management and lifecycle handling.

**3D Rendering**: Three.js with React Three Fiber serves as the primary 3D engine, offering declarative 3D scene composition. React Three Drei provides additional utilities and helpers for common 3D operations like cameras, controls, and geometry manipulation.

**State Management**: Zustand with subscribeWithSelector middleware handles global application state. The architecture separates concerns into specialized stores (useParametric, useAudio, useGame) for mathematical parameters, audio controls, and game state management.

**UI Components**: Radix UI primitives provide accessible, unstyled components that are customized with Tailwind CSS. The design system uses CSS custom properties for consistent theming and supports dark mode.

**Styling**: Tailwind CSS with custom CSS for specialized 3D and mathematical visualizations. The styling includes holographic UI effects and neon glow animations for an immersive experience.

### Backend Architecture

**Server Framework**: Express.js with TypeScript provides a minimal REST API structure. The server is configured with Vite integration for development and static file serving for production.

**Storage Layer**: The application uses a memory-based storage implementation (MemStorage) that implements a generic IStorage interface. This allows for easy migration to database-backed storage in the future.

**Development Setup**: Vite handles hot module replacement, asset bundling, and development server functionality. The configuration supports GLSL shaders and large 3D model files.

### Mathematical Engine

**Curve Generation**: The mathUtils module calculates parametric curve points using mathematical formulas for different curve types. It supports complex parameters including frequency factors (k), scaling factors (xyz), and complexity modifiers.

**Geometry Creation**: The geometryUtils module converts mathematical points into Three.js geometries with different rendering styles (string, tube, ribbon, solid, mesh, wireframe). It handles color schemes and material properties.

**Vector Field Visualization**: Advanced mathematical visualization showing gradient flows and field directions around parametric curves, with configurable density and scaling.

### Game Integration

**Interactive Mode**: Game mechanics allow users to navigate through 3D parametric curves, collect targets, and compete for scores. The game state includes phases (menu, playing, ended), scoring, and time management.

**Audio System**: Spatial audio integration with background music, sound effects for interactions, and hit detection feedback. Audio can be muted/unmuted with preserved state.

### Export Capabilities

**Multi-Format Export System**: The application provides comprehensive export functionality with support for multiple 3D file formats:

- **GLB/GLTF Export**: Industry-standard format with full support for animation, PBR materials, vertex colors, and UV mapping. Includes keyframe animation for rotation and scale effects. GLB is binary format, GLTF is JSON format.
- **USD Export**: Pixar Universal Scene Description format for 3D viewers and production pipelines. Exports plain USD text format with geometry, vertex colors, and metadata.
- **STL Export**: Standard format for 3D printing, exports solid geometry suitable for fabrication.
- **JSON Export**: Parameter backup system that saves all curve settings, rendering options, vector field configuration, and animation parameters for later restoration or sharing.

The export system generates high-resolution curve data (2000 points for 3D formats, 1000 for STL) with proper materials, shading information, and metadata for cross-platform compatibility.

### Sacred Symbol Texture System

**Texture Library**: 18 stylized pixel art textures organized in 3 quality tiers (8-bit, 12-bit, 16-bit) featuring spiritual and sacred geometry symbols:
- Chakra Mandala (7 energy centers)
- Egyptian Ankh (symbol of life)
- Hamsa Hand (protection symbol)
- Celtic Cross (faith and eternity)
- Sri Yantra (tantric diagram)
- Flower of Life (sacred geometry)

**Access**: Press "X" key or click "Textures" button to open the TextureGallery component. Users can browse, preview, and download textures for external use in 3D applications.

**Location**: `/client/public/textures/sacred_symbols/` with organized tier subdirectories and comprehensive catalog documentation.

## External Dependencies

### Core 3D and React Dependencies
- **React Three Fiber** (@react-three/fiber): React renderer for Three.js
- **React Three Drei** (@react-three/drei): Utility library for common Three.js operations
- **React Three Postprocessing** (@react-three/postprocessing): Post-processing effects pipeline
- **Three.js**: Core 3D graphics library

### UI and Styling
- **Radix UI**: Complete set of accessible UI primitives for React
- **Tailwind CSS**: Utility-first CSS framework with PostCSS integration
- **Class Variance Authority**: Utility for creating type-safe component variants
- **Clsx**: Utility for conditional CSS class names
- **Framer Motion**: Animation library for React components
- **Lucide React**: Icon library with consistent design

### State Management and Data Fetching
- **Zustand**: Lightweight state management with TypeScript support
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form validation and state management

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type-safe JavaScript development
- **ESBuild**: Fast JavaScript bundler for production builds
- **Vite Plugin GLSL**: GLSL shader support for custom materials

### Database and Backend
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon
- **Zod**: Runtime type validation and schema validation

### Audio and Media
- **Web Audio API**: Browser-native audio processing and playback
- **HTMLAudioElement**: Standard web audio elements for sound effects and background music

### Utility Libraries
- **Date-fns**: Modern date utility library
- **Nanoid**: Secure URL-friendly unique ID generator
- **CMDK**: Command menu component for keyboard navigation