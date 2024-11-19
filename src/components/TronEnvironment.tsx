import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function TronEnvironment() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Circular grid lines */}
      {[10, 20, 30].map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <ringGeometry args={[radius, radius + 0.1, 64]} />
          <meshBasicMaterial color="#0AFBFB" transparent opacity={0.1} />
        </mesh>
      ))}
      
      {/* Background planes with grid texture */}
      <mesh position={[0, 0, -15]} rotation={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial 
          color="#000033" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
    </group>
  )
} 