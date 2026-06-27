import * as THREE from 'three';
import { RenderStyle, ColorScheme } from '../stores/useParametric';
import { getColorForPoint } from './mathUtils';

/**
 * Create geometry from parametric curve points based on render style
 */
export function createGeometryFromPoints(
  points: THREE.Vector3[],
  renderStyle: RenderStyle,
  colorScheme: ColorScheme,
  showWireframe: boolean,
  brightness: number = 1.0
): THREE.Object3D | null {
  if (points.length === 0) return null;
  
  const group = new THREE.Group();
  
  switch (renderStyle) {
    case 'string':
      group.add(createStringCurve(points, colorScheme, brightness));
      break;
      
    case 'tube':
      group.add(createTubeCurve(points, colorScheme, 0.1, brightness));
      break;
      
    case 'ribbon':
      group.add(createRibbonCurve(points, colorScheme, 0.2, brightness));
      break;
      
    case 'solid':
      group.add(createSolidShape(points, colorScheme, brightness));
      break;
      
    case 'mesh':
      group.add(createMeshSurface(points, colorScheme, brightness));
      break;
      
    case 'wireframe':
      group.add(createWireframeCurve(points, colorScheme, brightness));
      break;
      
    default:
      group.add(createTubeCurve(points, colorScheme, 0.1, brightness));
  }
  
  // Add wireframe overlay if requested
  if (showWireframe && renderStyle !== 'wireframe') {
    const wireframe = createWireframeCurve(points, colorScheme, brightness * 0.5);
    if (wireframe.material instanceof THREE.Material) {
      wireframe.material.opacity = 0.3;
      wireframe.material.transparent = true;
    }
    group.add(wireframe);
  }
  
  return group;
}

/**
 * Create a simple line curve
 */
function createStringCurve(
  points: THREE.Vector3[],
  colorScheme: ColorScheme,
  brightness: number
): THREE.Line {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  // Create colors array
  const colors: number[] = [];
  points.forEach((point, index) => {
    const color = getColorForPoint(point, index, points.length, colorScheme);
    color.multiplyScalar(brightness);
    colors.push(color.r, color.g, color.b);
  });
  
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    linewidth: 2
  });
  
  return new THREE.Line(geometry, material);
}

/**
 * Create a tube-based curve with thickness
 */
function createTubeCurve(
  points: THREE.Vector3[],
  colorScheme: ColorScheme,
  radius: number,
  brightness: number
): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, points.length * 2, radius, 8, false);
  
  // Create colors for vertices
  const positionAttribute = geometry.getAttribute('position');
  const colors: number[] = [];
  
  for (let i = 0; i < positionAttribute.count; i++) {
    const t = i / positionAttribute.count;
    const color = getColorForPoint(
      new THREE.Vector3().fromBufferAttribute(positionAttribute, i),
      Math.floor(t * points.length),
      points.length,
      colorScheme
    );
    color.multiplyScalar(brightness);
    colors.push(color.r, color.g, color.b);
  }
  
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.3,
    roughness: 0.4,
    emissive: new THREE.Color(0x222222),
    emissiveIntensity: 0.1
  });
  
  return new THREE.Mesh(geometry, material);
}

/**
 * Create a ribbon-style surface
 */
function createRibbonCurve(
  points: THREE.Vector3[],
  colorScheme: ColorScheme,
  width: number,
  brightness: number
): THREE.Mesh {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];
  
  // Create ribbon vertices
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    // Calculate perpendicular vector
    const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
    const up = new THREE.Vector3(0, 0, 1);
    const right = new THREE.Vector3().crossVectors(direction, up).normalize().multiplyScalar(width);
    
    // Create quad vertices
    const v1 = new THREE.Vector3().addVectors(p1, right);
    const v2 = new THREE.Vector3().subVectors(p1, right);
    const v3 = new THREE.Vector3().addVectors(p2, right);
    const v4 = new THREE.Vector3().subVectors(p2, right);
    
    // Add vertices
    vertices.push(v1.x, v1.y, v1.z);
    vertices.push(v2.x, v2.y, v2.z);
    vertices.push(v3.x, v3.y, v3.z);
    vertices.push(v4.x, v4.y, v4.z);
    
    // Add colors
    const color = getColorForPoint(p1, i, points.length, colorScheme);
    color.multiplyScalar(brightness);
    for (let j = 0; j < 4; j++) {
      colors.push(color.r, color.g, color.b);
    }
    
    // Add normals
    const normal = new THREE.Vector3().crossVectors(direction, right).normalize();
    for (let j = 0; j < 4; j++) {
      normals.push(normal.x, normal.y, normal.z);
    }
    
    // Add indices for two triangles
    const baseIndex = i * 4;
    indices.push(
      baseIndex, baseIndex + 1, baseIndex + 2,
      baseIndex + 1, baseIndex + 3, baseIndex + 2
    );
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    metalness: 0.1,
    roughness: 0.8,
    transparent: true,
    opacity: 0.8
  });
  
  return new THREE.Mesh(geometry, material);
}

/**
 * Create a solid shape by extruding the curve
 */
function createSolidShape(
  points: THREE.Vector3[],
  colorScheme: ColorScheme,
  brightness: number
): THREE.Mesh {
  // Create a shape from the curve points (projected to XY plane)
  const shape = new THREE.Shape();
  
  if (points.length > 0) {
    shape.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    shape.lineTo(points[0].x, points[0].y); // Close the shape
  }
  
  const extrudeSettings = {
    depth: 0.5,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 10,
    bevelSize: 0.1,
    bevelThickness: 0.1
  };
  
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  
  // Add colors
  const positionAttribute = geometry.getAttribute('position');
  const colors: number[] = [];
  
  for (let i = 0; i < positionAttribute.count; i++) {
    const t = i / positionAttribute.count;
    const color = getColorForPoint(
      new THREE.Vector3().fromBufferAttribute(positionAttribute, i),
      Math.floor(t * points.length),
      points.length,
      colorScheme
    );
    color.multiplyScalar(brightness);
    colors.push(color.r, color.g, color.b);
  }
  
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.5,
    roughness: 0.3
  });
  
  return new THREE.Mesh(geometry, material);
}

/**
 * Create a mesh surface using the curve points
 */
function createMeshSurface(
  points: THREE.Vector3[],
  colorScheme: ColorScheme,
  brightness: number
): THREE.Mesh {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  
  // Create a surface by connecting points in a grid-like pattern
  const segments = Math.floor(Math.sqrt(points.length));
  
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const index = i * segments + j;
      if (index < points.length) {
        const point = points[index];
        vertices.push(point.x, point.y, point.z);
        
        const color = getColorForPoint(point, index, points.length, colorScheme);
        color.multiplyScalar(brightness);
        colors.push(color.r, color.g, color.b);
      }
    }
  }
  
  // Create indices for triangles
  for (let i = 0; i < segments - 1; i++) {
    for (let j = 0; j < segments - 1; j++) {
      const a = i * segments + j;
      const b = (i + 1) * segments + j;
      const c = (i + 1) * segments + (j + 1);
      const d = i * segments + (j + 1);
      
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    wireframe: false,
    metalness: 0.2,
    roughness: 0.6
  });
  
  return new THREE.Mesh(geometry, material);
}

/**
 * Create a wireframe representation
 */
function createWireframeCurve(
  points: THREE.Vector3[],
  colorScheme: ColorScheme,
  brightness: number
): THREE.LineSegments {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const colors: number[] = [];
  
  // Create line segments
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    vertices.push(p1.x, p1.y, p1.z);
    vertices.push(p2.x, p2.y, p2.z);
    
    const color1 = getColorForPoint(p1, i, points.length, colorScheme);
    const color2 = getColorForPoint(p2, i + 1, points.length, colorScheme);
    
    color1.multiplyScalar(brightness);
    color2.multiplyScalar(brightness);
    
    colors.push(color1.r, color1.g, color1.b);
    colors.push(color2.r, color2.g, color2.b);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    linewidth: 1
  });
  
  return new THREE.LineSegments(geometry, material);
}
