import { useSpring, animated } from '@react-spring/web'
import { useEffect, useState } from 'react'
import { soundService } from '../services/SoundService'

interface GameStateProps {
  timeLimit: number
  currentScore: number
  blockProgress: number
  matchesNeeded: number
  matchesFound: number
  powerUpActive: boolean
  onPowerUpActivation: (active: boolean) => void
}

export function GameState({ 
  timeLimit, 
  currentScore, 
  blockProgress,
  matchesNeeded,
  matchesFound,
  powerUpActive,
  onPowerUpActivation
}: GameStateProps) {
  const [buttonState, setButtonState] = useState(0)
  const [showPowerUpEffect, setShowPowerUpEffect] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  
  // Handle power-up deactivation with animation
  useEffect(() => {
    if (!powerUpActive && buttonState === 2) {
      setIsResetting(true);
      // Fade out animation duration
      setTimeout(() => {
        setButtonState(0);
        setIsResetting(false);
      }, 1000);
    }
  }, [powerUpActive]);

  const progressSpring = useSpring({
    width: `${blockProgress}%`,
    config: { tension: 120, friction: 14 }
  })

  const buttonSpring = useSpring({
    background: isResetting 
      ? 'linear-gradient(90deg, #0AFBFB, #80FFFF)'
      : buttonState === 2 
        ? 'linear-gradient(90deg, #F4900C, #FFD700)'
        : 'linear-gradient(90deg, #0AFBFB, #80FFFF)',
    opacity: isResetting ? 0.5 : 1,
    config: { tension: 120, friction: 14 }
  })

  const handleButtonClick = () => {
    if (buttonState < 2 && !isResetting) {
      if (buttonState === 0) {
        soundService.playPowerUpStage1();
      } else if (buttonState === 1) {
        soundService.playPowerUpStage2();
      }
      
      setButtonState(prev => prev + 1);
      if (buttonState === 1) {
        setShowPowerUpEffect(true);
        onPowerUpActivation(true);
        setTimeout(() => setShowPowerUpEffect(false), 3000);
      }
    }
  }

  useEffect(() => {
    if (timeLimit === 60) {
      setIsResetting(true);
      setTimeout(() => {
        setButtonState(0);
        setShowPowerUpEffect(false);
        setIsResetting(false);
      }, 1000);
    }
  }, [timeLimit]);

  const getButtonText = () => {
    if (isResetting) return "Resetting...";
    switch(buttonState) {
      case 0: return "Buy Miner with AEON"
      case 1: return "Add Hash Rate?"
      case 2: return "5x Mining Power"
      default: return ""
    }
  }

  return (
    <div className="game-state">
      <div className="score">
        <span className="label">BLOCK REWARDS</span>
        <span className="value">{currentScore.toLocaleString()} sats</span>
      </div>

      <div className="timer">
        <div className="time-value">{timeLimit}s</div>
      </div>

      <div className="mining-progress">
        <div className="progress-label">
          <span>BLOCK MINING PROGRESS</span>
        </div>
        <div className="progress-bar-container">
          <animated.div 
            className="progress-bar"
            style={{
              ...progressSpring,
              background: 'linear-gradient(90deg, #F4900C, #FFD700)'
            }}
          />
        </div>
        <animated.button 
          className="power-button"
          onClick={handleButtonClick}
          style={{ 
            ...buttonSpring,
            pointerEvents: isResetting ? 'none' : 'auto'
          }}
        >
          {getButtonText()}
        </animated.button>
      </div>

      {showPowerUpEffect && (
        <div className="power-up-effect-container">
          <div className="power-up-effect-text">
            MINING POWER INCREASED!
            <br />
            <span className="multiplier">5x</span>
          </div>
        </div>
      )}

      <style>{`
        .game-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          font-family: 'Press Start 2P', monospace;
          color: #F4900C;
          text-shadow: 0 0 10px rgba(244, 144, 12, 0.5);
        }

        .timer {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 20px;
        }

        .time-value {
          font-size: 48px;
          color: #0AFBFB;
          text-shadow: 0 0 20px rgba(10, 251, 251, 0.5);
        }

        .score {
          position: absolute;
          left: 20px;
          top: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
          background: rgba(0, 0, 32, 0.8);
          padding: 15px;
          border-radius: 8px;
          border: 2px solid #F4900C;
          box-shadow: 0 0 20px rgba(244, 144, 12, 0.3);
        }

        .label {
          font-size: 12px;
          color: #F4900C;
        }

        .value {
          font-size: 24px;
          color: #FFD700;
          text-shadow: 0 0 15px rgba(244, 144, 12, 0.5);
        }

        .mining-progress {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 300px;
        }

        .progress-label {
          display: flex;
          align-items: center;
          font-size: 12px;
          margin-bottom: 5px;
          white-space: nowrap;
        }

        .progress-bar-container {
          width: 100%;
          height: 20px;
          background: rgba(10, 251, 251, 0.1);
          border: 2px solid #0AFBFB;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          transition: width 0.3s ease;
        }

        .power-button {
          margin-top: 10px;
          background: #0AFBFB;
          border: none;
          padding: 8px 16px;
          color: #000020;
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          cursor: pointer;
          width: 100%;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(10, 251, 251, 0.3);
          transition: all 0.3s ease;
        }

        .power-button:hover {
          box-shadow: 0 0 15px rgba(10, 251, 251, 0.5);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .power-up-effect-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          text-align: center;
          animation: powerUpFade 3s forwards;
          pointer-events: none;
          width: auto;
          right: auto;
          bottom: auto;
        }

        .power-up-effect-text {
          color: #FFD700;
          font-size: 24px;
          text-shadow: 0 0 20px #F4900C;
          line-height: 1.5;
          position: relative;
          width: auto;
        }

        .multiplier {
          font-size: 48px;
          color: #0AFBFB;
          text-shadow: 0 0 30px #0AFBFB;
        }

        @keyframes powerUpFade {
          0% { opacity: 0; transform: translate(-50%, 0); }
          20% { opacity: 1; transform: translate(-50%, -50%); }
          80% { opacity: 1; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -100%); }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .timer {
            top: 20px;
          }

          .time-value {
            font-size: 36px;
          }

          .score {
            left: 50%;
            transform: translateX(-50%);
            top: 80px;
            text-align: center;
            align-items: center;
            width: auto;
            min-width: 200px;
          }

          .mining-progress {
            right: auto;
            top: auto;
            left: 50%;
            transform: translateX(-50%);
            bottom: 20px;
            width: 280px;
          }

          .progress-label {
            font-size: 12px;
            margin-bottom: 8px;
            justify-content: center;
          }

          .power-button {
            font-size: 12px;
            padding: 16px 24px;
          }

          .power-up-effect-text {
            font-size: 24px;
          }

          .multiplier {
            font-size: 48px;
          }

          .power-up-effect-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            bottom: auto;
            right: auto;
          }

          .progress-bar-container {
            height: 40px;
          }

          .power-button {
            padding: 16px 24px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
} 