import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function VictoryParticles() {
  const points = useRef<THREE.Points>(null)
  const count = 100
  
  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Spiral formation
      const angle = (i / count) * Math.PI * 20
      const radius = Math.random() * 10
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (i / count) * 20 - 10
      positions[i * 3 + 2] = Math.sin(angle) * radius
      
      // Upward spiral motion
      velocities[i * 3] = (Math.random() - 0.5) * 0.05
      velocities[i * 3 + 1] = Math.random() * 0.1
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05
      
      // Alternate between cyan and orange
      const isCyan = Math.random() > 0.5
      colors[i * 3] = isCyan ? 0.04 : 0.96
      colors[i * 3 + 1] = isCyan ? 0.98 : 0.56
      colors[i * 3 + 2] = isCyan ? 0.98 : 0.05
    }
    
    return { positions, velocities, colors }
  }, [])

  useFrame(({ clock }) => {
    if (!points.current) return
    const positions = points.current.geometry.attributes.position.array as Float32Array
    const time = clock.getElapsedTime()
    
    for (let i = 0; i < count * 3; i += 3) {
      const angle = time + i
      const radius = 5 + Math.sin(time * 0.5 + i) * 2
      
      positions[i] = Math.cos(angle * 0.2) * radius + particlesData.velocities[i]
      positions[i + 1] += particlesData.velocities[i + 1]
      positions[i + 2] = Math.sin(angle * 0.2) * radius + particlesData.velocities[i + 2]
      
      if (positions[i + 1] > 10) positions[i + 1] = -10
    }
    
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.y = time * 0.1
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particlesData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
} 