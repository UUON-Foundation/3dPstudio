import React, { useState, useRef, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { X, Wand2, Download, Box, Sparkles, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface ModelGenPortalProps {
  onClose: () => void;
}

interface GeneratedModel {
  id: string;
  prompt: string;
  glbUrl: string;
  previewUrl: string | null;
  timestamp: number;
}

const QUALITY_OPTIONS = [
  { id: 'standard', label: 'Standard', desc: '10K faces · Fast (~30s)' },
  { id: 'high', label: 'High', desc: '50K faces · Detailed (~60s)' },
];

const PROMPT_IDEAS = [
  'A sacred lotus flower with detailed petals',
  'Celtic trinity knot with ornate knotwork',
  'Ancient Egyptian ankh with hieroglyphs',
  'Flower of life sacred geometry medallion',
  'Viking compass with runic symbols',
  'Merkaba star tetrahedron crystal',
  'Human DNA double helix strand',
  'Solar system with orbiting planets',
  'Human heart with anatomical detail',
  'Neuron with branching dendrites',
  'Crystal geode cut in half',
  'Spiral galaxy with nebula clouds',
];

// Class-based error boundary that wraps the Canvas safely
interface EBState { hasError: boolean; errorMsg: string }
class CanvasErrorBoundary extends Component<{ children: React.ReactNode; onReset?: () => void }, EBState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error?.message || 'Failed to load model' };
  }
  componentDidCatch() {}
  reset() { this.setState({ hasError: false, errorMsg: '' }); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-red-300 text-sm">Model preview unavailable</p>
            <p className="text-gray-600 text-xs max-w-xs">{this.state.errorMsg}</p>
            <button
              onClick={() => { this.reset(); this.props.onReset?.(); }}
              className="text-xs text-cyan-400 underline"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function GLBViewer({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} />;
}

function GLBViewerWrapper({ url }: { url: string }) {
  return (
    <Suspense fallback={null}>
      <GLBViewer url={url} />
      <Environment preset="studio" />
    </Suspense>
  );
}

export function ModelGenPortal({ onClose }: ModelGenPortalProps) {
  const [prompt, setPrompt] = useState('');
  const [quality, setQuality] = useState('standard');
  const [status, setStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<GeneratedModel[]>([]);
  const [selected, setSelected] = useState<GeneratedModel | null>(null);
  const [canvasKey, setCanvasKey] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const generate = async () => {
    if (!prompt.trim() || status === 'generating') return;
    setStatus('generating');
    setProgress(0);
    setError(null);
    setStatusMsg('Submitting to Tripo3D AI...');

    try {
      const submitRes = await fetch('/api/generate-3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), quality }),
      });
      const submitData = await submitRes.json();
      if (!submitRes.ok || submitData.error) {
        throw new Error(submitData.error || 'Failed to submit task');
      }

      const { taskId } = submitData;
      setStatusMsg('Generating your 3D model...');

      await new Promise<void>((resolve, reject) => {
        const maxWait = setTimeout(() => {
          stopPolling();
          reject(new Error('Generation timed out after 3 minutes. Please try again.'));
        }, 180_000);
        pollRef.current = setInterval(async () => {
          try {
            const pollRes = await fetch(`/api/generate-3d/status/${taskId}`);
            const pollData = await pollRes.json();

            if (pollData.error) { reject(new Error(pollData.error)); return; }

            setProgress(pollData.progress ?? 0);

            if (pollData.status === 'success') {
              clearTimeout(maxWait);
              stopPolling();
              const newModel: GeneratedModel = {
                id: taskId,
                prompt: prompt.trim(),
                glbUrl: pollData.glbUrl,
                previewUrl: pollData.previewUrl,
                timestamp: Date.now(),
              };
              setModels(prev => [newModel, ...prev]);
              setSelected(newModel);
              setCanvasKey(k => k + 1);
              setStatus('done');
              setStatusMsg('');
              resolve();
            } else if (pollData.status === 'failed') {
              clearTimeout(maxWait);
              reject(new Error('Generation failed. Try a different prompt.'));
            } else {
              setStatusMsg(`Processing... ${pollData.progress ?? 0}%`);
            }
          } catch (e) {
            stopPolling();
            reject(e);
          }
        }, 3000);
      });
    } catch (err: any) {
      stopPolling();
      setStatus('error');
      setError(err.message);
    }
  };

  const downloadModel = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_').slice(0, 40)}.glb`;
    link.target = '_blank';
    link.click();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate(); }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-black/80 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Box className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI 3D Model Generator
            </h1>
            <p className="text-xs text-gray-500">Text to 3D · Powered by <a href="https://studio.tripo3d.ai/?via=phi1" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Tripo3D</a> · UUON Pstudio</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-cyan-500/20 bg-black/30 flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Prompt */}
            <div>
              <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2 block">
                Describe your 3D model
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={handleKey}
                placeholder="e.g. A glowing merkaba star with crystal facets..."
                className="w-full h-28 bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quality */}
            <div>
              <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2 block">
                Quality
              </label>
              <div className="space-y-1">
                {QUALITY_OPTIONS.map(q => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded border text-sm transition-all ${
                      quality === q.id
                        ? 'bg-cyan-600/30 border-cyan-400 text-cyan-200'
                        : 'border-gray-700 text-gray-400 hover:border-cyan-500/50'
                    }`}
                  >
                    <span className="font-medium">{q.label}</span>
                    <span className="text-xs opacity-60">{q.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <Button
              onClick={generate}
              disabled={status === 'generating' || !prompt.trim()}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold h-11"
            >
              {status === 'generating' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {statusMsg || 'Generating...'}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate 3D Model
                </>
              )}
            </Button>

            {/* Progress bar */}
            {status === 'generating' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress</span><span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Ideas */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                Ideas — click to use
              </label>
              <div className="space-y-0.5">
                {PROMPT_IDEAS.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(idea)}
                    className="w-full text-left text-xs text-gray-500 hover:text-cyan-300 py-1 px-2 rounded hover:bg-cyan-900/20 transition-all flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 opacity-40 flex-shrink-0" />
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 3D Preview */}
          <div className="flex-1 bg-black/20 relative overflow-hidden">
            {selected ? (
              <CanvasErrorBoundary key={canvasKey} onReset={() => setCanvasKey(k => k + 1)}>
                <Canvas
                  onCreated={({ gl }) => {
                    gl.domElement.addEventListener('webglcontextlost', (e) => {
                      e.preventDefault();
                    });
                  }}
                >
                  <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 10, 5]} intensity={1.5} />
                  <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4488ff" />
                  <GLBViewerWrapper url={selected.glbUrl} />
                  <OrbitControls autoRotate autoRotateSpeed={1} enableZoom />
                </Canvas>
              </CanvasErrorBoundary>
            ) : status === 'generating' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-cyan-300 font-semibold text-lg">{statusMsg}</p>
                    <p className="text-gray-600 text-sm mt-1">Tripo3D AI is sculpting your model</p>
                  </div>
                  <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-gray-600 text-xs">{progress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="text-center">
                  <Box className="w-16 h-16 text-cyan-400 mx-auto mb-3" />
                  <p className="text-gray-400">Your 3D model will appear here</p>
                  <p className="text-gray-600 text-sm mt-1">Type a prompt and click Generate</p>
                </div>
              </div>
            )}

            {/* Overlay info when model shown */}
            {selected && status !== 'generating' && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end justify-between pointer-events-none">
                <div>
                  <p className="text-cyan-300 text-sm font-medium">{selected.prompt}</p>
                  <p className="text-gray-500 text-xs">Drag to rotate · Scroll to zoom</p>
                </div>
                <Button
                  onClick={() => downloadModel(selected.glbUrl, selected.prompt)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white pointer-events-auto"
                  size="sm"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download GLB
                </Button>
              </div>
            )}
          </div>

          {/* Model history */}
          {models.length > 0 && (
            <div className="flex-shrink-0 border-t border-cyan-500/20 bg-black/40 p-3">
              <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider">Generated Models ({models.length})</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {models.map(m => (
                  <div
                    key={m.id}
                    onClick={() => { setSelected(m); setCanvasKey(k => k + 1); }}
                    className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all w-24 ${
                      selected?.id === m.id ? 'border-cyan-400' : 'border-gray-700 hover:border-cyan-500/50'
                    }`}
                  >
                    {m.previewUrl ? (
                      <img src={m.previewUrl} alt={m.prompt} className="w-24 h-16 object-cover" />
                    ) : (
                      <div className="w-24 h-16 bg-cyan-900/20 flex items-center justify-center">
                        <Box className="w-6 h-6 text-cyan-500" />
                      </div>
                    )}
                    <div className="p-1 bg-black/60">
                      <p className="text-xs text-gray-400 truncate">{m.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
