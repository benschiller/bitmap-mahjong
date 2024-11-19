import { Html } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/web'

interface ScorePopupProps {
  position: [number, number, number]
  score: number
  onComplete: () => void
}

export function ScorePopup({ position, score, onComplete }: ScorePopupProps) {
  const { opacity, y } = useSpring({
    from: { opacity: 1, y: 0 },
    to: { opacity: 0, y: 2 },
    config: { duration: 1000 },
    onRest: onComplete
  })

  return (
    <Html position={position}>
      <animated.div style={{
        opacity,
        transform: y.to(y => `translateY(${-y * 50}px)`),
        color: '#0AFBFB',
        fontSize: '24px',
        fontFamily: 'monospace',
        textShadow: '0 0 10px #0AFBFB',
        pointerEvents: 'none',
        textAlign: 'center'
      }}>
        +{score} sats
      </animated.div>
    </Html>
  )
} 