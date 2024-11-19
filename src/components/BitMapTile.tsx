import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { animated, useSpring } from '@react-spring/three'
import { Mesh } from 'three'
import { Vector3 } from '@react-three/fiber'

interface BitMapTileProps {
  size: number
  position: [number, number, number]
  isSelected: boolean
  isMatched?: boolean
  onClick: () => void
}

const BITMAP_ORANGE = '#F4900C'
const SELECTION_GOLD = '#ffd700'

export function BitMapTile({ 
  size, 
  position, 
  isSelected, 
  isMatched, 
  onClick 
}: BitMapTileProps) {
  const mesh = useRef<Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  const { scale, color } = useSpring({
    scale: isHovered || isSelected ? 1.1 : 1,
    color: isSelected ? SELECTION_GOLD : BITMAP_ORANGE,
    config: { tension: 150, friction: 10 }
  })

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    // For mobile, trigger hover state immediately on touch
    setIsHovered(true)
  }

  const handlePointerUp = (e: any) => {
    e.stopPropagation()
    // Clear hover state and trigger click
    setIsHovered(false)
    onClick()
  }

  return (
    <animated.mesh
      ref={mesh}
      position={position}
      scale={scale}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setIsHovered(false)}
    >
      <boxGeometry args={[size, 0.2, size]} />
      <animated.meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        toneMapped={false}
      />
    </animated.mesh>
  )
} 