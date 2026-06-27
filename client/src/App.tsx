import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ParametricExplorer } from "./components/ParametricExplorer";
import { useAudio } from "./lib/stores/useAudio";
import "./styles/globals.css";
import "@fontsource/inter";

const queryClient = new QueryClient();

function App() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Initialize audio assets
  useEffect(() => {
    // Load background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    // Load sound effects
    const hitAudio = new Audio("/sounds/hit.mp3");
    hitAudio.volume = 0.5;
    setHitSound(hitAudio);

    const successAudio = new Audio("/sounds/success.mp3");
    successAudio.volume = 0.7;
    setSuccessSound(successAudio);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <Suspense fallback={
          <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-xl">Loading UUON Pstudio...</p>
            </div>
          </div>
        }>
          <ParametricExplorer />
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}

export default App;
