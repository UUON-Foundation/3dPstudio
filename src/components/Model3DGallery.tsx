import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Download, Box, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Model3DGalleryProps {
  onClose: () => void;
}

interface ModelInfo {
  name: string;
  symbol: string;
  description: string;
  path: string;
  category: string;
}

const models: ModelInfo[] = [
  // Original Sacred Symbols
  { name: 'Chakra Mandala', symbol: 'chakra_mandala', description: '7 energy centers in circular sacred geometry', path: '/models/chakra_mandala_3d.glb', category: 'Hindu / Buddhist' },
  { name: 'Egyptian Ankh', symbol: 'ankh', description: 'Ancient symbol of eternal life', path: '/models/ankh_3d.glb', category: 'Egyptian' },
  { name: 'Hamsa Hand', symbol: 'hamsa_hand', description: 'Protective hand with all-seeing eye', path: '/models/hamsa_hand_3d.glb', category: 'Middle Eastern' },
  { name: 'Celtic Cross', symbol: 'celtic_cross', description: 'Cross with intricate Celtic knotwork', path: '/models/celtic_cross_3d.glb', category: 'Celtic' },
  { name: 'Sri Yantra', symbol: 'sri_yantra', description: '9 interlocking triangles mandala', path: '/models/sri_yantra_3d.glb', category: 'Hindu / Buddhist' },
  { name: 'Flower of Life', symbol: 'flower_of_life', description: 'Sacred geometry pattern of creation', path: '/models/flower_of_life_3d.glb', category: 'Sacred Geometry' },
  // World Symbols
  { name: 'Om / Aum', symbol: 'om_aum', description: 'Primordial sacred sound of the universe', path: '/models/om_aum_3d.glb', category: 'Hindu / Buddhist' },
  { name: 'Yin Yang', symbol: 'yin_yang', description: 'Taoist duality and cosmic balance', path: '/models/yin_yang_3d.glb', category: 'Taoist' },
  { name: 'Merkaba', symbol: 'merkaba', description: 'Star tetrahedron — sacred light vehicle', path: '/models/merkaba_3d.glb', category: 'Sacred Geometry' },
  { name: 'Dharma Wheel', symbol: 'dharma_wheel', description: 'Buddhist 8-spoked wheel of enlightenment', path: '/models/dharma_wheel_3d.glb', category: 'Hindu / Buddhist' },
  { name: 'Tree of Life', symbol: 'tree_of_life', description: 'Kabbalistic diagram of 10 Sephirot', path: '/models/tree_of_life_3d.glb', category: 'Kabbalah' },
  { name: 'Eye of Horus', symbol: 'eye_of_horus', description: 'Ancient Egyptian protective sacred eye', path: '/models/eye_of_horus_3d.glb', category: 'Egyptian' },
  { name: 'Ouroboros', symbol: 'ouroboros', description: 'Serpent eating its tail — eternal cycle', path: '/models/ouroboros_3d.glb', category: 'Alchemical' },
  { name: "Metatron's Cube", symbol: 'metatrons_cube', description: 'Sacred geometry containing all Platonic solids', path: '/models/metatrons_cube_3d.glb', category: 'Sacred Geometry' },
  { name: 'Pentacle', symbol: 'pentacle', description: 'Five-pointed star of elemental protection', path: '/models/pentacle_3d.glb', category: 'Wiccan / Pagan' },
  // Celtic & Norse
  { name: 'Triskelion', symbol: 'triskelion', description: 'Celtic triple spiral of life, death, rebirth', path: '/models/triskelion_3d.glb', category: 'Celtic' },
  { name: 'Triquetra', symbol: 'triquetra', description: 'Three-part Celtic knot of eternity', path: '/models/triquetra_3d.glb', category: 'Celtic' },
  { name: 'Vegvisir', symbol: 'vegvisir', description: 'Norse Viking compass of protection', path: '/models/vegvisir_3d.glb', category: 'Norse' },
  { name: "Mjolnir", symbol: 'mjolnir', description: "Thor's Hammer with Viking knotwork", path: '/models/mjolnir_3d.glb', category: 'Norse' },
  // Healing & Nature
  { name: 'Caduceus', symbol: 'caduceus', description: 'Hermetic staff of healing — twin serpents', path: '/models/caduceus_3d.glb', category: 'Greek / Hermetic' },
  { name: 'Lotus Flower', symbol: 'lotus_flower', description: 'Sacred bloom of purity and awakening', path: '/models/lotus_flower_3d.glb', category: 'Hindu / Buddhist' },
  { name: 'Medicine Wheel', symbol: 'medicine_wheel', description: 'Native American circle of four directions', path: '/models/medicine_wheel_3d.glb', category: 'Native American' },
  { name: 'Phoenix Rising', symbol: 'phoenix', description: 'Sacred bird of rebirth and transformation', path: '/models/phoenix_3d.glb', category: 'Mythology' },
  // Mathematics & Geometry
  { name: 'Vesica Piscis', symbol: 'vesica_piscis', description: 'Foundation shape of sacred geometry', path: '/models/vesica_piscis_3d.glb', category: 'Sacred Geometry' },
  { name: 'Golden Spiral', symbol: 'golden_spiral', description: "Fibonacci's divine proportion in nature", path: '/models/golden_spiral_3d.glb', category: 'Sacred Geometry' },
  { name: 'Icosahedron', symbol: 'icosahedron', description: 'Platonic solid of water — 20 faces', path: '/models/icosahedron_3d.glb', category: 'Sacred Geometry' },
  { name: 'Dodecahedron', symbol: 'dodecahedron', description: "Plato's cosmic shape of the universe", path: '/models/dodecahedron_3d.glb', category: 'Sacred Geometry' },
  // More Symbols
  { name: 'Star of David', symbol: 'star_of_david', description: 'Jewish hexagram sacred geometry', path: '/models/star_of_david_3d.glb', category: 'Kabbalah' },
  { name: 'Triple Moon', symbol: 'triple_moon', description: 'Wiccan goddess — maiden, mother, crone', path: '/models/triple_moon_3d.glb', category: 'Wiccan / Pagan' },
  { name: 'Endless Knot', symbol: 'endless_knot', description: 'Buddhist symbol of interconnectedness', path: '/models/endless_knot_3d.glb', category: 'Hindu / Buddhist' },
  { name: 'Egyptian Scarab', symbol: 'scarab', description: 'Sacred beetle of Ra — transformation', path: '/models/scarab_3d.glb', category: 'Egyptian' },
  { name: 'Nazar Eye', symbol: 'nazar_eye', description: 'Turkish blue eye — protection from evil', path: '/models/nazar_eye_3d.glb', category: 'Middle Eastern' },
  { name: 'Seed of Life', symbol: 'seed_of_life', description: 'Seven circles — first stage of creation', path: '/models/seed_of_life_3d.glb', category: 'Sacred Geometry' },
  { name: 'Ganesha', symbol: 'ganesha', description: 'Hindu elephant god of wisdom', path: '/models/ganesha_3d.glb', category: 'Hindu / Buddhist' },
  { name: 'Sun Cross', symbol: 'sun_cross', description: 'Universal ancient solar wheel symbol', path: '/models/sun_cross_3d.glb', category: 'Pagan / Universal' },
  { name: 'Enneagram', symbol: 'enneagram', description: 'Nine-pointed spiritual growth symbol', path: '/models/enneagram_3d.glb', category: 'Esoteric' },
  { name: 'Labyrinth', symbol: 'labyrinth', description: 'Ancient seven-circuit walking meditation', path: '/models/labyrinth_3d.glb', category: 'Universal' },
  { name: 'Crystal Grid', symbol: 'crystal_grid', description: 'Merkaba energy activation crystal grid', path: '/models/crystal_grid_3d.glb', category: 'Sacred Geometry' },
  // Mythology & Deity
  { name: 'Quetzalcoatl', symbol: 'quetzalcoatl', description: 'Aztec feathered serpent god of wind', path: '/models/quetzalcoatl_3d.glb', category: 'Mesoamerican' },
  { name: 'Shiva Lingam', symbol: 'shiva_lingam', description: 'Hindu sacred stone of cosmic energy', path: '/models/shiva_lingam_3d.glb', category: 'Hindu / Buddhist' },
  { name: 'Winged Sun Disk', symbol: 'winged_sun', description: 'Egyptian solar disc with spread wings', path: '/models/winged_sun_3d.glb', category: 'Egyptian' },
  { name: 'Buddha Mudra', symbol: 'buddha_mudra', description: 'Sacred hand gesture of protection', path: '/models/buddha_mudra_3d.glb', category: 'Hindu / Buddhist' },
  { name: 'Meridian Map', symbol: 'meridian_map', description: 'TCM energy channels on human body', path: '/models/meridian_map_3d.glb', category: 'Healing' },
  // Platonic Solids Set
  { name: 'Tetrahedron', symbol: 'tetrahedron', description: 'Platonic solid of fire — 4 faces', path: '/models/tetrahedron_3d.glb', category: 'Sacred Geometry' },
  { name: 'Hexahedron (Cube)', symbol: 'hexahedron', description: 'Platonic solid of earth — 6 faces', path: '/models/hexahedron_3d.glb', category: 'Sacred Geometry' },
  { name: 'Octahedron', symbol: 'octahedron', description: 'Platonic solid of air — 8 faces', path: '/models/octahedron_3d.glb', category: 'Sacred Geometry' },
];

const CATEGORIES = ['All', ...Array.from(new Set(models.map(m => m.category))).sort()];
const PAGE_SIZE = 9;

function Model3DViewer({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={2.5} />;
}

export function Model3DGallery({ onClose }: Model3DGalleryProps) {
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(0);

  const filtered = category === 'All' ? models : models.filter(m => m.category === category);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const downloadModel = (path: string, name: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = `${name}_3d.glb`;
    link.click();
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setPage(0);
    setSelectedModel(null);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-7xl bg-black/95 border-cyan-500/30 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                <Box className="w-6 h-6 text-cyan-400" />
                3D Sacred Symbol Models
                <span className="text-sm font-normal text-gray-400 ml-2">({models.length} models)</span>
              </CardTitle>
              <p className="text-xs text-gray-400 mt-1">High-quality GLB models ready to export and promote</p>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Filter + Pagination */}
          <div className="flex items-center gap-3 mt-3">
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-black/50 border-cyan-500/30 text-white w-52 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-cyan-500/30">
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="text-white hover:bg-cyan-500/20 text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-gray-400">{filtered.length} models</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1 rounded border border-cyan-500/30 disabled:opacity-30 hover:bg-cyan-500/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-400">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1 rounded border border-cyan-500/30 disabled:opacity-30 hover:bg-cyan-500/20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Selected Model Full Preview */}
          {selectedModel && (
            <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="aspect-square bg-black/50 rounded-lg overflow-hidden border-2 border-cyan-500/30">
                    <Canvas>
                      <PerspectiveCamera makeDefault position={[0, 0, 3]} />
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[10, 10, 5]} intensity={1.2} />
                      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#88aaff" />
                      <Suspense fallback={null}>
                        <Model3DViewer modelPath={selectedModel.path} />
                        <Environment preset="studio" />
                      </Suspense>
                      <OrbitControls enableZoom autoRotate autoRotateSpeed={1} />
                    </Canvas>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs px-2 py-1 rounded-full bg-cyan-900/50 border border-cyan-500/30 text-cyan-300">{selectedModel.category}</span>
                        <h2 className="text-2xl font-bold text-cyan-300 mt-2">{selectedModel.name}</h2>
                        <p className="text-gray-300 text-sm">{selectedModel.description}</p>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-xs text-gray-300 space-y-1">
                        <p><strong className="text-blue-300">Format:</strong> GLB (binary GLTF 2.0)</p>
                        <p><strong className="text-blue-300">Quality:</strong> High-detail relief sculpture</p>
                        <p><strong className="text-blue-300">Compatible:</strong> Blender, Unity, Unreal, Sketchfab</p>
                        <p><strong className="text-blue-300">Publisher:</strong> UUON Pstudio</p>
                      </div>
                    </div>
                    <div className="space-y-2 mt-3">
                      <Button
                        onClick={() => downloadModel(selectedModel.path, selectedModel.symbol)}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download GLB
                      </Button>
                      <button
                        onClick={() => setSelectedModel(null)}
                        className="w-full text-xs text-gray-500 hover:text-gray-300"
                      >
                        ← Back to gallery
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model Grid */}
          <div className="grid grid-cols-3 gap-3">
            {paged.map((model) => (
              <Card
                key={model.symbol}
                className={`bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer ${
                  selectedModel?.symbol === model.symbol ? 'ring-2 ring-cyan-400' : ''
                }`}
                onClick={() => setSelectedModel(model)}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="aspect-square bg-black/50 rounded overflow-hidden border border-cyan-500/20 flex items-center justify-center">
                    <Box className="w-12 h-12 text-cyan-700 opacity-50" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cyan-200 truncate">{model.name}</p>
                    <p className="text-xs text-gray-500 truncate">{model.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 border-t border-gray-800 pt-3">
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
