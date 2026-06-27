import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Stars } from '@react-three/drei';
import { useParametric } from '../lib/stores/useParametric';
import { useAudio } from '../lib/stores/useAudio';
import { generateCurvePoints } from '../lib/utils/mathUtils';
import { createGeometryFromPoints } from '../lib/utils/geometryUtils';
import { generateVectorField } from '../lib/utils/vectorField';
import * as THREE from 'three';

export function Scene3D() {
  const groupRef = useRef<THREE.Group>(null);
  const vectorFieldRef = useRef<THREE.Group>(null);
  const targetsRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  const {
    curveType,
    k,
    xFactor,
    yFactor,
    zFactor,
    aFactor,
    bFactor,
    cFactor,
    deltaFactor,
    complexity,
    renderStyle,
    colorScheme,
    brightness,
    showWireframe,
    animationSpeed,
    time,
    updateTime,
    gameMode,
    gameState,
    updateGameState,
    backgroundStyle,
    showVectorField,
    vectorFieldDensity,
    vectorFieldScale
  } = useParametric();

  const { playHit, playSuccess } = useAudio();

  // Update animation time
  useFrame((state, delta) => {
    updateTime(delta * animationSpeed);
    
    // Update camera for game mode
    if (gameMode && groupRef.current) {
      const curve = groupRef.current.children[0];
      if (curve) {
        // Simple camera following logic for game mode
        camera.lookAt(curve.position);
      }
    }

    // Game mode collision detection
    if (gameMode && gameState.phase === 'playing') {
      // Simple target collision detection would go here
      // For now, just update game timer
      if (gameState.timeRemaining > 0) {
        updateGameState({
          timeRemaining: Math.max(0, gameState.timeRemaining - delta)
        });
      } else if (gameState.timeRemaining <= 0) {
        updateGameState({ phase: 'ended' });
        playSuccess();
      }
    }
  });

  // Generate curve points
  const curvePoints = useMemo(() => {
    return generateCurvePoints(
      curveType,
      k + Math.sin(time * 0.5) * 0.1, // Add slight animation
      xFactor,
      yFactor,
      zFactor,
      aFactor,
      bFactor,
      cFactor,
      deltaFactor,
      complexity,
      1000 // number of points
    );
  }, [curveType, k, xFactor, yFactor, zFactor, aFactor, bFactor, cFactor, deltaFactor, complexity, time]);

  // Generate geometry from points
  const geometry = useMemo(() => {
    if (curvePoints.length === 0) return null;
    
    return createGeometryFromPoints(
      curvePoints,
      renderStyle,
      colorScheme,
      showWireframe,
      brightness
    );
  }, [curvePoints, renderStyle, colorScheme, showWireframe, brightness]);

  // Generate vector field
  const vectorField = useMemo(() => {
    if (!showVectorField) return null;
    
    return generateVectorField(
      curvePoints,
      vectorFieldDensity,
      vectorFieldScale,
      colorScheme
    );
  }, [showVectorField, curvePoints, vectorFieldDensity, vectorFieldScale, colorScheme]);

  // Background effect based on style
  const backgroundEffect = useMemo(() => {
    switch (backgroundStyle) {
      case 'stars':
        return <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />;
      case 'void':
        return null;
      case 'gradient':
      default:
        return (
          <mesh position={[0, 0, -50]} scale={[100, 100, 1]}>
            <planeGeometry />
            <meshBasicMaterial>
              <texture
                attach="map"
                image={(() => {
                  const canvas = document.createElement('canvas');
                  canvas.width = 256;
                  canvas.height = 256;
                  const ctx = canvas.getContext('2d')!;
                  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
                  gradient.addColorStop(0, '#1a1a2e');
                  gradient.addColorStop(0.5, '#16213e');
                  gradient.addColorStop(1, '#0f3460');
                  ctx.fillStyle = gradient;
                  ctx.fillRect(0, 0, 256, 256);
                  return canvas;
                })()}
              />
            </meshBasicMaterial>
          </mesh>
        );
    }
  }, [backgroundStyle]);

  return (
    <>
      {backgroundEffect}
      
      {/* Grid for reference */}
      <Grid
        position={[0, -5, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#333"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#666"
        fadeDistance={25}
        fadeStrength={1}
      />

      {/* Main curve group */}
      <group ref={groupRef}>
        {geometry && (
          <primitive object={geometry} />
        )}
      </group>

      {/* Vector field */}
      {vectorField && (
        <group ref={vectorFieldRef}>
          <primitive object={vectorField} />
        </group>
      )}

      {/* Game mode targets */}
      {gameMode && (
        <group ref={targetsRef}>
          {/* Simple target spheres for game mode */}
          {Array.from({ length: 5 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(i * Math.PI * 0.4) * 8,
                Math.cos(i * Math.PI * 0.3) * 6,
                Math.sin(i * Math.PI * 0.2) * 4
              ]}
            >
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color="#ff6b6b"
                emissive="#ff6b6b"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.8}
        rotateSpeed={0.4}
        minDistance={3}
        maxDistance={50}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />
    </>
  );
}
