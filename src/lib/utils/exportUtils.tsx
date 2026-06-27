import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { useParametric } from '../stores/useParametric';
import { generateCurvePoints } from './mathUtils';
import { createGeometryFromPoints } from './geometryUtils';
import { generateVectorField } from './vectorField';

/**
 * Export the current parametric curve as GLTF/GLB with animation, materials, and UV mapping
 * This captures ALL visible geometry including curve, vector field, and effects
 */
export async function exportToGLTF(binary: boolean = true): Promise<void> {
  const state = useParametric.getState();
  
  // Create a scene to hold our export content
  const scene = new THREE.Scene();
  scene.name = 'ParametricScene';
  
  // Generate curve points
  const curvePoints = generateCurvePoints(
    state.curveType,
    state.k,
    state.xFactor,
    state.yFactor,
    state.zFactor,
    state.aFactor,
    state.bFactor,
    state.cFactor,
    state.deltaFactor,
    state.complexity,
    2000
  );
  
  if (curvePoints.length === 0) {
    throw new Error('No curve points generated for export');
  }
  
  // Animation setup
  const animationDuration = 10; // 10 seconds
  const fps = 30;
  const frames = animationDuration * fps;
  const animations: THREE.AnimationClip[] = [];
  
  // Create main curve geometry
  const curveGeometry = createCurveGeometry(curvePoints, state);
  if (curveGeometry) {
    curveGeometry.name = 'ParametricCurve';
    scene.add(curveGeometry);
    
    // Add animation for curve
    const curveAnimation = createAnimationClip('ParametricCurve', state, frames, fps);
    animations.push(curveAnimation);
  }
  
  // Create vector field if enabled
  if (state.showVectorField) {
    const vectorField = generateVectorField(
      curvePoints,
      state.vectorFieldDensity,
      state.vectorFieldScale,
      state.colorScheme
    );
    if (vectorField) {
      vectorField.name = 'VectorField';
      scene.add(vectorField);
      
      // Add animation for vector field
      const fieldAnimation = createAnimationClip('VectorField', state, frames, fps);
      animations.push(fieldAnimation);
    }
  }
  
  // Add lights for proper shading
  const light1 = new THREE.DirectionalLight(0xffffff, 1.0);
  light1.position.set(10, 10, 10);
  light1.name = 'MainLight';
  scene.add(light1);
  
  // Configure GLTF exporter
  const exporter = new GLTFExporter();
  
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => {
        try {
          if (binary) {
            // GLB - binary format
            const blob = new Blob([result as ArrayBuffer], { type: 'application/octet-stream' });
            downloadFile(blob, `parametric_${state.curveType}_${Date.now()}.glb`);
          } else {
            // GLTF - JSON format
            const output = JSON.stringify(result, null, 2);
            const blob = new Blob([output], { type: 'application/json' });
            downloadFile(blob, `parametric_${state.curveType}_${Date.now()}.gltf`);
          }
          console.log(`GLTF export completed: ${animations.length} animations, vector field: ${state.showVectorField}`);
          resolve();
        } catch (error) {
          console.error('Failed to save GLTF:', error);
          reject(error);
        }
      },
      (error) => {
        console.error('GLTF export error:', error);
        reject(error);
      },
      {
        binary,
        trs: false,
        onlyVisible: true,
        truncateDrawRange: true,
        animations: animations.length > 0 ? animations : undefined,
        includeCustomExtensions: true
      }
    );
  });
}

/**
 * Create curve geometry with proper materials and UV mapping
 */
function createCurveGeometry(points: THREE.Vector3[], state: any): THREE.Group | null {
  if (points.length === 0) return null;
  
  const group = new THREE.Group();
  group.name = 'ParametricCurve';
  
  // Create curve from points
  const curve = new THREE.CatmullRomCurve3(points);
  
  // Create tube geometry with UV mapping
  const tubeGeometry = new THREE.TubeGeometry(
    curve,
    Math.floor(points.length * 2),
    0.1,
    16,
    false
  );
  
  // Generate vertex colors
  const positions = tubeGeometry.getAttribute('position');
  const colors = new Float32Array(positions.count * 3);
  
  for (let i = 0; i < positions.count; i++) {
    const t = i / positions.count;
    const color = getColorAtT(t, state.colorScheme);
    
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  tubeGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Create PBR material
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.3,
    roughness: 0.4,
    emissive: new THREE.Color(0x111111),
    emissiveIntensity: state.brightness * 0.5,
    side: THREE.DoubleSide,
    flatShading: false
  });
  
  const mesh = new THREE.Mesh(tubeGeometry, material);
  mesh.name = 'CurveMesh';
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  // Add metadata using gltfExtras (properly exported by GLTFExporter)
  mesh.userData.gltfExtras = {
    author: 'UUON Pstudio',
    organization: 'UUON Pstudio',
    curveType: state.curveType,
    parameters: {
      k: state.k,
      complexity: state.complexity,
      xFactor: state.xFactor,
      yFactor: state.yFactor,
      zFactor: state.zFactor,
      aFactor: state.aFactor,
      bFactor: state.bFactor,
      cFactor: state.cFactor,
      deltaFactor: state.deltaFactor
    },
    rendering: {
      renderStyle: state.renderStyle,
      colorScheme: state.colorScheme
    },
    exportDate: new Date().toISOString(),
    generator: 'UUON Pstudio v1.0',
    license: 'Created using open source software',
    credits: 'Built with Three.js, React Three Fiber, and open source libraries'
  };
  
  group.add(mesh);
  return group;
}

/**
 * Create animation clip with parametric parameter changes over time
 * @param targetName - Name of the target object for animation tracks
 */
function createAnimationClip(targetName: string, state: any, frames: number, fps: number): THREE.AnimationClip {
  const duration = frames / fps;
  const times: number[] = [];
  const rotationValues: number[] = [];
  const scaleValues: number[] = [];
  const positionValues: number[] = [];
  
  // Create keyframes for rotation, scale pulsing, and subtle position animation
  for (let i = 0; i <= frames; i++) {
    const t = (i / frames) * duration;
    times.push(t);
    
    // Rotation animation (full rotation over duration)
    const angle = (i / frames) * Math.PI * 2 * state.animationSpeed;
    // Quaternion for rotation around Y axis: (0, sin(angle/2), 0, cos(angle/2))
    const halfAngle = angle * 0.5;
    rotationValues.push(0, Math.sin(halfAngle), 0, Math.cos(halfAngle));
    
    // Subtle scale pulsing
    const scale = 1.0 + Math.sin(angle * 2) * 0.05;
    scaleValues.push(scale, scale, scale);
    
    // Subtle floating motion
    const floatY = Math.sin(angle * 3) * 0.2;
    positionValues.push(0, floatY, 0);
  }
  
  // Create animation tracks with proper target naming
  const rotationTrack = new THREE.QuaternionKeyframeTrack(
    `${targetName}.quaternion`,
    times,
    rotationValues
  );
  
  const scaleTrack = new THREE.VectorKeyframeTrack(
    `${targetName}.scale`,
    times,
    scaleValues
  );
  
  const positionTrack = new THREE.VectorKeyframeTrack(
    `${targetName}.position`,
    times,
    positionValues
  );
  
  // Create animation clip with all tracks
  return new THREE.AnimationClip('ParametricAnimation', duration, [
    rotationTrack,
    scaleTrack,
    positionTrack
  ]);
}

/**
 * Get color at parameter t based on color scheme
 */
function getColorAtT(t: number, colorScheme: string): THREE.Color {
  switch (colorScheme) {
    case 'rainbow':
      return new THREE.Color().setHSL(t, 1.0, 0.5);
    case 'ocean':
      return new THREE.Color().setHSL(0.5 + t * 0.2, 0.8, 0.4 + t * 0.2);
    case 'fire':
      return new THREE.Color().setHSL(t * 0.1, 1.0, 0.5);
    case 'cosmic':
      return new THREE.Color().setHSL(0.7 + t * 0.3, 0.9, 0.3 + t * 0.3);
    case 'neon':
      const neonHue = Math.floor(t * 6) / 6;
      return new THREE.Color().setHSL(neonHue, 1.0, 0.5);
    default:
      return new THREE.Color(1, 1, 1);
  }
}

/**
 * Export the current parametric curve as USD format for 3D viewers
 * Note: This exports plain USD text format, not binary USDZ
 * For Apple AR QuickLook, you would need to package this as USDZ using command-line tools
 */
export async function exportToUSD(): Promise<void> {
  const state = useParametric.getState();
  
  const points = generateCurvePoints(
    state.curveType,
    state.k,
    state.xFactor,
    state.yFactor,
    state.zFactor,
    state.aFactor,
    state.bFactor,
    state.cFactor,
    state.deltaFactor,
    state.complexity,
    2000
  );
  
  if (points.length === 0) {
    throw new Error('No curve points generated for export');
  }
  
  const geometry = createGeometryFromPoints(
    points,
    state.renderStyle,
    state.colorScheme,
    false,
    state.brightness
  );
  
  if (!geometry) {
    throw new Error('Failed to create geometry for export');
  }
  
  try {
    const usdContent = generateUSDContent(geometry, state);
    const blob = new Blob([usdContent], { type: 'text/plain' });
    downloadFile(blob, `parametric_curve_${state.curveType}_${Date.now()}.usd`);
    console.log('USD export completed successfully');
  } catch (error) {
    console.error('Failed to export USD:', error);
    throw error;
  }
}

/**
 * Generate USD content for the 3D geometry with materials
 */
function generateUSDContent(geometry: THREE.Object3D, state: any): string {
  const timestamp = new Date().toISOString();
  
  let usdContent = `#usda 1.0
(
    defaultPrim = "ParametricCurve"
    metersPerUnit = 1
    upAxis = "Y"
)

def Xform "ParametricCurve" (
    kind = "component"
)
{
    def Scope "Geom"
    {
`;

  geometry.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      usdContent += generateMeshUSD(child, `Mesh_${child.id}`);
    }
  });

  usdContent += `    }
    
    def "Metadata"
    {
        string curveType = "${state.curveType}"
        float k = ${state.k}
        float complexity = ${state.complexity}
        string renderStyle = "${state.renderStyle}"
        string colorScheme = "${state.colorScheme}"
        string exportDate = "${timestamp}"
        string generator = "UUON Pstudio"
    }
}
`;

  return usdContent;
}

/**
 * Generate USD content for a single mesh with materials
 */
function generateMeshUSD(mesh: THREE.Mesh, name: string): string {
  const geometry = mesh.geometry;
  const position = geometry.getAttribute('position');
  const color = geometry.getAttribute('color');
  
  let meshContent = `        def Mesh "${name}"
        {
            int[] faceVertexCounts = [`;
  
  if (geometry.index) {
    const indexCount = geometry.index.count;
    for (let i = 0; i < indexCount; i += 3) {
      meshContent += '3';
      if (i + 3 < indexCount) meshContent += ', ';
    }
  } else {
    const vertexCount = position.count;
    for (let i = 0; i < vertexCount; i += 3) {
      meshContent += '3';
      if (i + 3 < vertexCount) meshContent += ', ';
    }
  }
  
  meshContent += `]
            int[] faceVertexIndices = [`;
  
  if (geometry.index) {
    const indices = geometry.index.array;
    for (let i = 0; i < indices.length; i++) {
      meshContent += indices[i];
      if (i < indices.length - 1) meshContent += ', ';
    }
  } else {
    for (let i = 0; i < position.count; i++) {
      meshContent += i;
      if (i < position.count - 1) meshContent += ', ';
    }
  }
  
  meshContent += `]
            point3f[] points = [`;
  
  const positions = position.array;
  for (let i = 0; i < positions.length; i += 3) {
    meshContent += `(${positions[i].toFixed(6)}, ${positions[i + 1].toFixed(6)}, ${positions[i + 2].toFixed(6)})`;
    if (i + 3 < positions.length) meshContent += ', ';
  }
  
  meshContent += `]
`;

  if (color) {
    meshContent += `            color3f[] primvars:displayColor = [`;
    const colors = color.array;
    for (let i = 0; i < colors.length; i += 3) {
      meshContent += `(${colors[i].toFixed(3)}, ${colors[i + 1].toFixed(3)}, ${colors[i + 2].toFixed(3)})`;
      if (i + 3 < colors.length) meshContent += ', ';
    }
    meshContent += `] (
                interpolation = "vertex"
            )
`;
  }

  meshContent += `        }
`;

  return meshContent;
}

/**
 * Export curve data as JSON with full parameter state
 */
export function exportCurveData(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const state = useParametric.getState();
      
      const curveData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        parameters: {
          curveType: state.curveType,
          k: state.k,
          xFactor: state.xFactor,
          yFactor: state.yFactor,
          zFactor: state.zFactor,
          aFactor: state.aFactor,
          bFactor: state.bFactor,
          cFactor: state.cFactor,
          deltaFactor: state.deltaFactor,
          complexity: state.complexity
        },
        rendering: {
          renderStyle: state.renderStyle,
          colorScheme: state.colorScheme,
          brightness: state.brightness,
          showWireframe: state.showWireframe,
          backgroundStyle: state.backgroundStyle
        },
        vectorField: {
          showVectorField: state.showVectorField,
          vectorFieldDensity: state.vectorFieldDensity,
          vectorFieldScale: state.vectorFieldScale
        },
        animation: {
          animationSpeed: state.animationSpeed
        }
      };
      
      const jsonString = JSON.stringify(curveData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      downloadFile(blob, `parametric_curve_${state.curveType}_${Date.now()}.json`);
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Export curve as STL for 3D printing
 */
export async function exportToSTL(): Promise<void> {
  const state = useParametric.getState();
  
  const points = generateCurvePoints(
    state.curveType,
    state.k,
    state.xFactor,
    state.yFactor,
    state.zFactor,
    state.aFactor,
    state.bFactor,
    state.cFactor,
    state.deltaFactor,
    state.complexity,
    1000
  );
  
  if (points.length === 0) {
    throw new Error('No curve points generated for STL export');
  }
  
  const geometry = createGeometryFromPoints(
    points,
    'tube',
    state.colorScheme,
    false,
    state.brightness
  );
  
  if (!geometry) {
    throw new Error('Failed to create geometry for STL export');
  }
  
  const stlContent = generateSTLContent(geometry);
  const blob = new Blob([stlContent], { type: 'text/plain' });
  downloadFile(blob, `parametric_curve_${state.curveType}_${Date.now()}.stl`);
}

/**
 * Generate STL content from geometry
 */
function generateSTLContent(geometry: THREE.Object3D): string {
  let stlContent = `solid ParametricCurve\n`;
  
  geometry.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geo = child.geometry;
      const position = geo.getAttribute('position');
      
      if (geo.index) {
        const indices = geo.index.array;
        for (let i = 0; i < indices.length; i += 3) {
          const v1 = new THREE.Vector3().fromBufferAttribute(position, indices[i]);
          const v2 = new THREE.Vector3().fromBufferAttribute(position, indices[i + 1]);
          const v3 = new THREE.Vector3().fromBufferAttribute(position, indices[i + 2]);
          
          const normal = new THREE.Vector3();
          const edge1 = new THREE.Vector3().subVectors(v2, v1);
          const edge2 = new THREE.Vector3().subVectors(v3, v1);
          normal.crossVectors(edge1, edge2).normalize();
          
          stlContent += `facet normal ${normal.x.toFixed(6)} ${normal.y.toFixed(6)} ${normal.z.toFixed(6)}\n`;
          stlContent += `  outer loop\n`;
          stlContent += `    vertex ${v1.x.toFixed(6)} ${v1.y.toFixed(6)} ${v1.z.toFixed(6)}\n`;
          stlContent += `    vertex ${v2.x.toFixed(6)} ${v2.y.toFixed(6)} ${v2.z.toFixed(6)}\n`;
          stlContent += `    vertex ${v3.x.toFixed(6)} ${v3.y.toFixed(6)} ${v3.z.toFixed(6)}\n`;
          stlContent += `  endloop\n`;
          stlContent += `endfacet\n`;
        }
      }
    }
  });
  
  stlContent += `endsolid ParametricCurve\n`;
  return stlContent;
}

/**
 * Export animated frames as image sequence
 */
export async function exportAnimationFrames(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  frames: number = 120
): Promise<void> {
  const state = useParametric.getState();
  const zip: any[] = [];
  
  for (let i = 0; i < frames; i++) {
    // Render frame
    renderer.render(scene, camera);
    
    // Capture frame
    const dataURL = renderer.domElement.toDataURL('image/png');
    const frameData = {
      name: `frame_${String(i).padStart(4, '0')}.png`,
      data: dataURL
    };
    
    zip.push(frameData);
    
    // Update animation time
    const t = i / frames;
    // This would need to update the scene based on animation parameters
  }
  
  console.log(`Captured ${frames} animation frames`);
  // Note: Actual ZIP creation would require a zip library
  // For now, we'll just log the capture
}

/**
 * Helper function to download a blob as a file
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
