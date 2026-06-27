import React, { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WebGL Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isWebGLError = this.state.error?.message?.includes('WebGL');
      
      if (isWebGLError) {
        return (
          <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <div className="max-w-2xl bg-black/80 border-2 border-yellow-500/30 rounded-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
                <h1 className="text-2xl font-bold text-yellow-500">WebGL Not Available</h1>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  UUON Pstudio requires WebGL to render visualizations. 
                  Your browser or environment doesn't currently support WebGL.
                </p>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                  <h3 className="text-blue-300 font-semibold mb-2">For Best Experience:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Use a modern browser (Chrome, Firefox, Edge, Safari)</li>
                    <li>Enable hardware acceleration in browser settings</li>
                    <li>Update your graphics drivers</li>
                    <li>Try opening in a new tab or window</li>
                  </ul>
                </div>
                
                <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                  <h3 className="text-purple-300 font-semibold mb-2">About This Application:</h3>
                  <p className="text-sm">
                    UUON Pstudio visualizes complex mathematical curves and vector fields 
                    in real-time 3D space. It supports 26+ curve types including hypocycloids, lissajous 
                    patterns, torus knots, Klein bottles, and Möbius strips.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    UUON Pstudio
                  </p>
                </div>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded transition-colors"
                >
                  Reload Application
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

    return this.props.children;
  }
}
