import { extend, useFrame } from '@react-three/fiber'
import { GridHelper, Color, ShaderMaterial, Vector2 } from 'three'
import { useRef, useMemo } from 'react'

extend({ GridHelper })

export function Grid() {
  const gridRef = useRef<GridHelper>(null)

  // Custom shader material for the grid
  const gridMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color('#0AFBFB') },
        uOpacity: { value: 0.12 },
        uTime: { value: 0 },
        uResolution: { value: new Vector2(40, 40) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        void main() {
          // Create grid lines
          vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
          float line = min(grid.x, grid.y);
          
          // More gradual fade out towards edges
          float fadeOut = 1.0 - smoothstep(0.2, 0.8, length(vUv - 0.5) * 2.0);
          
          // Final color
          gl_FragColor = vec4(uColor, (1.0 - min(line, 1.0)) * uOpacity * fadeOut);
        }
      `,
      transparent: true,
      depthWrite: false
    })
  }, [])

  useFrame(({ clock }) => {
    gridMaterial.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <group position={[0, -0.5, 0]}>
      {/* Ground plane with custom grid shader */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60, 1, 1]} />
        <primitive object={gridMaterial} attach="material" />
      </mesh>

      {/* Dark background plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial 
          color="#000020" 
          opacity={0.95} 
          transparent 
        />
      </mesh>
    </group>
  )
} 