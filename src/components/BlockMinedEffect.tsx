import { Html } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/web'

interface BlockMinedEffectProps {
  onComplete: () => void
}

export function BlockMinedEffect({ onComplete }: BlockMinedEffectProps) {
  const { opacity, y } = useSpring({
    from: { opacity: 0, y: 0 },
    to: async (animate) => {
      await animate({ opacity: 1, y: 0 })
      await animate({ opacity: 1, y: -50 })
      await animate({ opacity: 0, y: -100 })
      onComplete()
    },
    config: { tension: 120, friction: 14 }
  })

  return (
    <Html fullscreen>
      <animated.div style={{
        opacity,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: y.to(y => `translate(-50%, -50%) translateY(${y}px)`),
        textAlign: 'center',
        fontFamily: "'Press Start 2P', monospace",
        pointerEvents: 'none'
      }}>
        <div style={{
          fontSize: '48px',
          color: '#F4900C',
          textShadow: '0 0 30px rgba(244, 144, 12, 0.8)',
          marginBottom: '20px'
        }}>
          BLOCK MINED!
        </div>
        <div style={{
          fontSize: '36px',
          color: '#0AFBFB',
          textShadow: '0 0 20px rgba(10, 251, 251, 0.8)'
        }}>
          +50,000 sats
        </div>
      </animated.div>
    </Html>
  )
} 