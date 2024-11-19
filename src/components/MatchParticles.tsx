import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MatchParticlesProps {
  position: [number, number, number]
  color?: string
  count?: number
}

export function MatchParticles({ 
  position, 
  color = '#0AFBFB', 
  count = 20 
}: MatchParticlesProps) {
  const points = useRef<THREE.Points>(null)
  
  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Random positions in a sphere
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.5
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.random() * 0.5
      positions[i * 3 + 2] = Math.sin(angle) * radius
      
      // Random velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.1
      velocities[i * 3 + 1] = Math.random() * 0.1
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1
    }
    
    return { positions, velocities }
  }, [count])

  useFrame(() => {
    if (!points.current) return
    const positions = points.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] += particlesData.velocities[i]
      positions[i + 1] += particlesData.velocities[i + 1]
      positions[i + 2] += particlesData.velocities[i + 2]
      particlesData.velocities[i + 1] -= 0.003 // gravity
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesData.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
} 