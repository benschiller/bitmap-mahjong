import { Html } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/web'

interface GameOverScreenProps {
  finalScore: number
  onRestart: () => void
}

export function GameOverScreen({ finalScore, onRestart }: GameOverScreenProps) {
  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 }
  })

  return (
    <Html fullscreen>
      <animated.div style={{
        opacity,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 32, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Press Start 2P', monospace",
        color: '#F4900C',
        textShadow: '0 0 20px rgba(244, 144, 12, 0.5)',
        padding: '20px'
      }}>
        <div className="gameover-title">
          TIME EXPIRED
        </div>
        <div className="reward-label">
          Partial Mining Reward
        </div>
        <div className="score-value">
          {finalScore.toLocaleString()} sats
        </div>
        <button 
          onClick={onRestart}
          className="restart-button"
        >
          Try Again
        </button>

        <style>{`
          .gameover-title {
            font-size: 48px;
            margin-bottom: 40px;
            animation: pulse 2s infinite;
            text-align: center;
          }

          .reward-label {
            font-size: 24px;
            color: #0AFBFB;
            text-shadow: 0 0 20px rgba(10, 251, 251, 0.5);
            margin-bottom: 20px;
            text-align: center;
          }

          .score-value {
            font-size: 36px;
            margin-bottom: 40px;
            text-align: center;
          }

          .restart-button {
            background: linear-gradient(90deg, #0AFBFB, #80FFFF);
            border: none;
            padding: 16px 32px;
            color: #000020;
            font-family: 'Press Start 2P', monospace;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
            box-shadow: 0 0 20px rgba(10, 251, 251, 0.3);
            transition: all 0.3s ease;
          }

          .restart-button:hover {
            box-shadow: 0 0 30px rgba(10, 251, 251, 0.5);
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          @media (max-width: 768px) {
            .gameover-title {
              font-size: 32px;
              margin-bottom: 30px;
            }

            .reward-label {
              font-size: 18px;
              margin-bottom: 15px;
            }

            .score-value {
              font-size: 24px;
              margin-bottom: 30px;
            }

            .restart-button {
              padding: 12px 24px;
              font-size: 14px;
            }
          }
        `}</style>
      </animated.div>
    </Html>
  )
} 