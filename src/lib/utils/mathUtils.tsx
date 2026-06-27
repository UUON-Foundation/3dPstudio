import * as THREE from 'three';
import { CurveType } from '../stores/useParametric';

/**
 * Calculate a single point on a parametric curve
 */
export function calculatePoint(
  t: number,
  k: number,
  xFactor: number = 1,
  yFactor: number = 1,
  zFactor: number = 1,
  aFactor: number = 1,
  bFactor: number = 1,
  cFactor: number = 1,
  deltaFactor: number = 1,
  complexity: number = 1,
  curveType: CurveType = 'hypocycloid'
): THREE.Vector3 {
  let x: number, y: number, z: number;
  
  // Apply complexity factor to parameter
  const complexT = t * complexity;
  
  switch (curveType) {
    case 'hypocycloid':
      x = (k - 1) * Math.cos(t) + Math.cos((k - 1) * t);
      y = (k - 1) * Math.sin(t) - Math.sin((k - 1) * t);
      z = Math.sin(complexT * zFactor) * 2;
      break;
      
    case 'lissajous':
      x = Math.cos(k * t);
      y = Math.sin(complexity * t);
      z = Math.sin((k + complexity) * t) * zFactor;
      break;
      
    case 'rose':
      x = Math.cos(k * t) * Math.cos(t);
      y = Math.cos(k * t) * Math.sin(t);
      z = Math.sin(complexT) * zFactor;
      break;
      
    case 'spiral':
      const spiralR = t * 0.1;
      x = spiralR * Math.cos(k * t);
      y = spiralR * Math.sin(k * t);
      z = t * zFactor * 0.1;
      break;
      
    case 'helix':
      x = Math.cos(t) * k;
      y = Math.sin(t) * k;
      z = t * zFactor;
      break;
      
    case 'epitrochoid':
      const R = k;
      const epiR = k * aFactor;
      const d = k * bFactor;
      x = (R + epiR) * Math.cos(t) - d * Math.cos((R + epiR) / epiR * t);
      y = (R + epiR) * Math.sin(t) - d * Math.sin((R + epiR) / epiR * t);
      z = Math.sin(complexT) * zFactor;
      break;
      
    case 'butterfly':
      x = Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5));
      y = Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5));
      z = Math.sin(complexT * 0.5) * zFactor;
      break;
      
    case 'flower':
      const petals = Math.floor(k);
      x = Math.cos(petals * t) * Math.cos(t) * aFactor;
      y = Math.cos(petals * t) * Math.sin(t) * aFactor;
      z = Math.sin(t * complexity) * zFactor;
      break;
      
    case 'star':
      const points = Math.floor(k);
      const angle = t * points;
      const radius = 1 + 0.5 * Math.cos(angle * 2);
      x = radius * Math.cos(t) * aFactor;
      y = radius * Math.sin(t) * bFactor;
      z = Math.sin(complexT) * zFactor;
      break;
      
    case 'nebula_helix':
      x = Math.cos(t) * (1 + 0.3 * Math.sin(k * t)) * aFactor;
      y = Math.sin(t) * (1 + 0.3 * Math.cos(k * t)) * bFactor;
      z = t * 0.1 + Math.sin(complexT) * zFactor;
      break;
      
    case 'string_theory_tree':
      x = t * Math.cos(k * t) + Math.sin(aFactor * t) * 0.5;
      y = t * Math.sin(k * t) + Math.cos(bFactor * t) * 0.5;
      z = Math.sin(complexT) * zFactor + Math.cos(deltaFactor * t) * 0.3;
      break;
      
    case 'factorial':
      const fact = Math.max(1, Math.floor(Math.abs(Math.sin(t * k)) * 5) + 1);
      x = Math.cos(t * fact) * aFactor;
      y = Math.sin(t * fact) * bFactor;
      z = Math.log(fact) * Math.sin(complexT) * zFactor;
      break;
      
    case 'rocket':
      x = Math.cos(t) * (1 - t * 0.01) * aFactor;
      y = Math.sin(t) * (1 - t * 0.01) * bFactor;
      z = t * zFactor + Math.sin(k * t) * 0.5;
      break;
      
    case 'cultural_glyph':
      // 12-tetrahedron pattern
      const tetraIndex = Math.floor(t / (Math.PI * 2 / 12)) % 12;
      const localT = (t % (Math.PI * 2 / 12)) * 12;
      x = Math.cos(tetraIndex * Math.PI / 6) * (1 + Math.sin(localT * k) * 0.3) * aFactor;
      y = Math.sin(tetraIndex * Math.PI / 6) * (1 + Math.cos(localT * k) * 0.3) * bFactor;
      z = Math.sin(localT * complexity) * zFactor;
      break;
      
    case 'torus_knot':
      const p = Math.floor(k);
      const q = Math.floor(aFactor * 3);
      x = Math.cos(p * t) * (2 + Math.cos(q * t));
      y = Math.sin(p * t) * (2 + Math.cos(q * t));
      z = Math.sin(q * t) * zFactor;
      break;
      
    case 'strange_attractor':
      // Lorenz-like attractor
      x = Math.sin(aFactor * t) * Math.cos(bFactor * t);
      y = Math.sin(bFactor * t) * Math.cos(cFactor * t);
      z = Math.sin(cFactor * t) * Math.cos(aFactor * t) * zFactor;
      break;
      
    case 'mobius_strip':
      const u = t;
      const v = Math.sin(k * t) * 0.5;
      x = (1 + v * Math.cos(u / 2)) * Math.cos(u) * aFactor;
      y = (1 + v * Math.cos(u / 2)) * Math.sin(u) * bFactor;
      z = v * Math.sin(u / 2) * zFactor;
      break;
      
    case 'klein_bottle':
      const u2 = t;
      const v2 = Math.sin(complexity * t) * Math.PI;
      if (u2 < Math.PI) {
        x = 3 * Math.cos(u2) * (1 + Math.sin(u2)) + 2 * (1 - Math.cos(u2) / 2) * Math.cos(u2) * Math.cos(v2);
        z = -8 * Math.sin(u2) - 2 * (1 - Math.cos(u2) / 2) * Math.sin(u2) * Math.cos(v2);
      } else {
        x = 3 * Math.cos(u2) * (1 + Math.sin(u2)) + 2 * (1 - Math.cos(u2) / 2) * Math.cos(v2 + Math.PI);
        z = -8 * Math.sin(u2);
      }
      y = -2 * (1 - Math.cos(u2) / 2) * Math.sin(v2);
      x *= aFactor * 0.3;
      y *= bFactor * 0.3;
      z *= zFactor * 0.3;
      break;
      
    case 'trefoil_knot':
      x = Math.sin(t) + 2 * Math.sin(2 * t);
      y = Math.cos(t) - 2 * Math.cos(2 * t);
      z = -Math.sin(3 * t) * zFactor;
      x *= aFactor * 0.5;
      y *= bFactor * 0.5;
      break;
      
    case 'hopf_fibration':
      x = Math.cos(t) * Math.cos(k * t) * aFactor;
      y = Math.cos(t) * Math.sin(k * t) * bFactor;
      z = Math.sin(t) * zFactor;
      break;
      
    case 'clifford_torus':
      x = (Math.cos(t) + Math.cos(k * t)) * aFactor;
      y = (Math.sin(t) + Math.sin(k * t)) * bFactor;
      z = Math.sin(complexity * t) * zFactor;
      break;
      
    case 'boys_surface':
      // Simplified Boys surface approximation
      x = Math.cos(t) * Math.sin(2 * t) * aFactor;
      y = Math.sin(t) * Math.sin(2 * t) * bFactor;
      z = Math.cos(2 * t) * zFactor;
      break;
      
    case 'roman_surface':
      // Simplified Roman surface
      x = Math.cos(t) * Math.sin(2 * t) * aFactor;
      y = Math.sin(t) * Math.cos(2 * t) * bFactor;
      z = Math.cos(t) * Math.cos(2 * t) * zFactor;
      break;
      
    case 'enneper_surface':
      x = t - Math.pow(t, 3) / 3 + t * Math.pow(Math.sin(k * t), 2);
      y = Math.sin(k * t) - Math.pow(Math.sin(k * t), 3) / 3 + Math.sin(k * t) * Math.pow(t, 2);
      z = 2 * t * Math.sin(k * t) * zFactor;
      x *= aFactor * 0.3;
      y *= bFactor * 0.3;
      break;
      
    case 'catenoid':
      x = Math.cos(t) * Math.cosh(k * Math.sin(complexity * t)) * aFactor;
      y = Math.sin(t) * Math.cosh(k * Math.sin(complexity * t)) * bFactor;
      z = k * Math.sin(complexity * t) * zFactor;
      break;
      
    case 'helicoid':
      x = Math.cos(t) * Math.sin(k * t) * aFactor;
      y = Math.sin(t) * Math.sin(k * t) * bFactor;
      z = k * t * zFactor * 0.1;
      break;
      
    default:
      x = Math.cos(t);
      y = Math.sin(t);
      z = 0;
  }
  
  // Apply axis factors
  x *= xFactor;
  y *= yFactor;
  z *= zFactor;
  
  return new THREE.Vector3(x, y, z);
}

/**
 * Generate an array of points for a complete curve
 */
export function generateCurvePoints(
  curveType: CurveType,
  k: number,
  xFactor: number,
  yFactor: number,
  zFactor: number,
  aFactor: number,
  bFactor: number,
  cFactor: number,
  deltaFactor: number,
  complexity: number,
  numPoints: number = 1000
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const maxT = Math.PI * 2 * Math.max(1, Math.floor(k));
  
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * maxT;
    const point = calculatePoint(
      t, k, xFactor, yFactor, zFactor,
      aFactor, bFactor, cFactor, deltaFactor,
      complexity, curveType
    );
    points.push(point);
  }
  
  return points;
}

/**
 * Get color for a point based on position and scheme
 */
export function getColorForPoint(
  point: THREE.Vector3,
  index: number,
  totalPoints: number,
  colorScheme: string
): THREE.Color {
  const t = index / totalPoints;
  
  switch (colorScheme) {
    case 'rainbow':
      return new THREE.Color().setHSL(t, 1, 0.6);
      
    case 'ocean':
      return new THREE.Color().lerpColors(
        new THREE.Color('#001f3f'),
        new THREE.Color('#7FDBFF'),
        t
      );
      
    case 'sunset':
      const sunsetColors = [
        new THREE.Color('#ff6b6b'),
        new THREE.Color('#ffa726'),
        new THREE.Color('#ffee58'),
        new THREE.Color('#ab47bc')
      ];
      const idx = Math.floor(t * (sunsetColors.length - 1));
      const nextIdx = Math.min(idx + 1, sunsetColors.length - 1);
      const localT = (t * (sunsetColors.length - 1)) - idx;
      return new THREE.Color().lerpColors(sunsetColors[idx], sunsetColors[nextIdx], localT);
      
    case 'neon':
      return new THREE.Color().setHSL(t * 0.8, 1, 0.8);
      
    case 'plasma':
      const plasmaR = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
      const plasmaG = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 + Math.PI * 2 / 3);
      const plasmaB = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 + Math.PI * 4 / 3);
      return new THREE.Color(plasmaR, plasmaG, plasmaB);
      
    case 'cool':
      return new THREE.Color().lerpColors(
        new THREE.Color('#6a5acd'),
        new THREE.Color('#98fb98'),
        t
      );
      
    default:
      return new THREE.Color().setHSL(t, 1, 0.6);
  }
}

/**
 * Calculate tangent vector at a point for vector field visualization
 */
export function calculateTangent(
  t: number,
  curveType: CurveType,
  k: number,
  xFactor: number,
  yFactor: number,
  zFactor: number,
  aFactor: number,
  bFactor: number,
  cFactor: number,
  deltaFactor: number,
  complexity: number,
  delta: number = 0.001
): THREE.Vector3 {
  const p1 = calculatePoint(t - delta, k, xFactor, yFactor, zFactor, aFactor, bFactor, cFactor, deltaFactor, complexity, curveType);
  const p2 = calculatePoint(t + delta, k, xFactor, yFactor, zFactor, aFactor, bFactor, cFactor, deltaFactor, complexity, curveType);
  
  return p2.sub(p1).normalize();
}
