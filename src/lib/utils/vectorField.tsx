import * as THREE from 'three';
import { ColorScheme } from '../stores/useParametric';
import { calculateTangent, getColorForPoint } from './mathUtils';

/**
 * Generate a vector field visualization around the parametric curve
 */
export function generateVectorField(
  curvePoints: THREE.Vector3[],
  density: number = 1.0,
  scale: number = 1.0,
  colorScheme: ColorScheme = 'rainbow'
): THREE.Group {
  const group = new THREE.Group();
  
  if (curvePoints.length === 0) return group;
  
  // Calculate bounding box of the curve
  const box = new THREE.Box3().setFromPoints(curvePoints);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  // Determine grid resolution based on density
  const resolution = Math.floor(10 * density);
  const step = Math.max(size.x, size.y, size.z) / resolution;
  
  // Create vector field grid
  for (let x = -resolution / 2; x <= resolution / 2; x++) {
    for (let y = -resolution / 2; y <= resolution / 2; y++) {
      for (let z = -resolution / 2; z <= resolution / 2; z++) {
        const position = new THREE.Vector3(
          center.x + x * step,
          center.y + y * step,
          center.z + z * step
        );
        
        // Calculate vector field direction at this position
        const fieldVector = calculateVectorFieldDirection(position, curvePoints);
        
        if (fieldVector.length() > 0.001) { // Only draw significant vectors
          const arrow = createVectorArrow(position, fieldVector, scale, colorScheme);
          group.add(arrow);
        }
      }
    }
  }
  
  return group;
}

/**
 * Calculate the vector field direction at a given position
 */
function calculateVectorFieldDirection(
  position: THREE.Vector3,
  curvePoints: THREE.Vector3[]
): THREE.Vector3 {
  if (curvePoints.length === 0) return new THREE.Vector3();
  
  // Find the closest point on the curve
  let closestDistance = Infinity;
  let closestIndex = 0;
  
  for (let i = 0; i < curvePoints.length; i++) {
    const distance = position.distanceTo(curvePoints[i]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }
  
  // Calculate gradient-like field
  const closestPoint = curvePoints[closestIndex];
  const direction = new THREE.Vector3().subVectors(closestPoint, position);
  
  // Add some curl to make the field more interesting
  const curl = new THREE.Vector3(-direction.y, direction.x, direction.z * 0.5);
  direction.add(curl.multiplyScalar(0.3));
  
  // Normalize and apply distance-based decay
  const distance = Math.max(0.1, closestDistance);
  const intensity = Math.exp(-distance * 2) / distance;
  
  return direction.normalize().multiplyScalar(intensity);
}

/**
 * Create a visual arrow for a vector field element
 */
function createVectorArrow(
  position: THREE.Vector3,
  direction: THREE.Vector3,
  scale: number,
  colorScheme: ColorScheme
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(position);
  
  // Calculate arrow length based on vector magnitude
  const length = direction.length() * scale * 2;
  const normalizedDirection = direction.clone().normalize();
  
  if (length < 0.01) return group; // Skip very small vectors
  
  // Create arrow shaft
  const shaftGeometry = new THREE.CylinderGeometry(0.01, 0.01, length, 4);
  const shaftMaterial = new THREE.MeshBasicMaterial({
    color: getVectorColor(position, colorScheme),
    transparent: true,
    opacity: 0.6
  });
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
  
  // Position and orient shaft
  shaft.position.copy(normalizedDirection.clone().multiplyScalar(length / 2));
  shaft.lookAt(position.clone().add(normalizedDirection));
  shaft.rotateX(Math.PI / 2);
  
  // Create arrow head
  const headGeometry = new THREE.ConeGeometry(0.03, length * 0.3, 4);
  const headMaterial = new THREE.MeshBasicMaterial({
    color: getVectorColor(position, colorScheme),
    transparent: true,
    opacity: 0.8
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  
  // Position and orient head
  head.position.copy(normalizedDirection.clone().multiplyScalar(length * 0.85));
  head.lookAt(position.clone().add(normalizedDirection));
  head.rotateX(Math.PI / 2);
  
  group.add(shaft);
  group.add(head);
  
  return group;
}

/**
 * Get color for vector based on position and color scheme
 */
function getVectorColor(position: THREE.Vector3, colorScheme: ColorScheme): THREE.Color {
  // Use position to determine color variation
  const t = (position.x + position.y + position.z) * 0.1 % 1;
  return getColorForPoint(position, Math.floor(t * 100), 100, colorScheme);
}

/**
 * Create a flow field visualization showing the overall field pattern
 */
export function generateFlowField(
  curvePoints: THREE.Vector3[],
  density: number = 1.0,
  colorScheme: ColorScheme = 'rainbow'
): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];
  const velocities: number[] = [];
  
  if (curvePoints.length === 0) return new THREE.Points(geometry);
  
  // Calculate bounding box
  const box = new THREE.Box3().setFromPoints(curvePoints);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  const numParticles = Math.floor(500 * density);
  
  for (let i = 0; i < numParticles; i++) {
    // Random position within bounding box
    const position = new THREE.Vector3(
      center.x + (Math.random() - 0.5) * size.x * 1.5,
      center.y + (Math.random() - 0.5) * size.y * 1.5,
      center.z + (Math.random() - 0.5) * size.z * 1.5
    );
    
    // Calculate velocity based on field
    const velocity = calculateVectorFieldDirection(position, curvePoints);
    
    positions.push(position.x, position.y, position.z);
    velocities.push(velocity.x, velocity.y, velocity.z);
    
    // Color based on velocity magnitude
    const speed = velocity.length();
    const color = getColorForPoint(position, Math.floor(speed * 100), 100, colorScheme);
    colors.push(color.r, color.g, color.b);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
  
  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  
  return new THREE.Points(geometry, material);
}

/**
 * Create streamlines following the vector field
 */
export function generateStreamlines(
  curvePoints: THREE.Vector3[],
  numLines: number = 10,
  colorScheme: ColorScheme = 'rainbow'
): THREE.Group {
  const group = new THREE.Group();
  
  if (curvePoints.length === 0) return group;
  
  const box = new THREE.Box3().setFromPoints(curvePoints);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  for (let i = 0; i < numLines; i++) {
    // Random starting position
    let currentPos = new THREE.Vector3(
      center.x + (Math.random() - 0.5) * size.x,
      center.y + (Math.random() - 0.5) * size.y,
      center.z + (Math.random() - 0.5) * size.z
    );
    
    const streamlinePoints: THREE.Vector3[] = [];
    const maxSteps = 100;
    const stepSize = 0.05;
    
    // Follow the field
    for (let step = 0; step < maxSteps; step++) {
      streamlinePoints.push(currentPos.clone());
      
      const fieldDirection = calculateVectorFieldDirection(currentPos, curvePoints);
      
      if (fieldDirection.length() < 0.001) break;
      
      currentPos.add(fieldDirection.normalize().multiplyScalar(stepSize));
      
      // Stop if we go too far from the curve
      if (currentPos.distanceTo(center) > size.length()) break;
    }
    
    if (streamlinePoints.length > 2) {
      const geometry = new THREE.BufferGeometry().setFromPoints(streamlinePoints);
      
      // Create colors for the streamline
      const colors: number[] = [];
      streamlinePoints.forEach((point, index) => {
        const color = getColorForPoint(point, index, streamlinePoints.length, colorScheme);
        colors.push(color.r, color.g, color.b);
      });
      
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        linewidth: 1
      });
      
      const line = new THREE.Line(geometry, material);
      group.add(line);
    }
  }
  
  return group;
}
