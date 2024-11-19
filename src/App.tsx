import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GameBoard } from './components/GameBoard'
import { GameState } from './components/GameState'
import { Suspense, useState, useEffect } from 'react'
import { TelegramProxy } from './telegram/TelegramProxy'
import { SoundService } from './services/SoundService'
import * as THREE from 'three'

function App() {
  // Add viewport height state
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Handle viewport height changes
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateHeight);
    // Mobile browsers viewport height fix
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  // Initialize both Telegram and Sound
  useEffect(() => {
    TelegramProxy.init();
    SoundService.init();
  }, []);

  const [gameState, setGameState] = useState({
    timeLimit: 60,
    currentScore: 0,
    blockProgress: 0,
    matchesNeeded: 8,
    matchesFound: 0,
    powerUpActive: false,
    hasWon: false
  })

  const handleGameStateUpdate = (newState: Partial<typeof gameState>) => {
    setGameState(prev => {
      const updated = { ...prev, ...newState };
      // Report score to Telegram when it changes
      if (updated.currentScore !== prev.currentScore) {
        TelegramProxy.setScore(updated.currentScore);
      }
      return updated;
    });
  }

  const handlePowerUpActivation = (active: boolean) => {
    setGameState(prev => ({ ...prev, powerUpActive: active }))
  }

  // Add device detection
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  const cameraPosition = isMobile 
    ? [0, 10, 14] as [number, number, number]  // Type assertion to fix error
    : [0, 8, 12] as [number, number, number];  // Type assertion to fix error

  // Add mobile fog settings
  const fogNear = isMobile ? 20 : 15;
  const fogFar = isMobile ? 30 : 25;

  return (
    <div style={{ 
      width: '100vw', 
      height: viewportHeight,
      backgroundColor: '#000020',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Game UI Layer */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%',
        height: '100%',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <GameState 
          timeLimit={gameState.timeLimit}
          currentScore={gameState.currentScore}
          blockProgress={gameState.blockProgress}
          matchesNeeded={gameState.matchesNeeded}
          matchesFound={gameState.matchesFound}
          powerUpActive={gameState.powerUpActive}
          onPowerUpActivation={handlePowerUpActivation}
        />
      </div>

      {/* 3D Game Layer */}
      <Canvas 
        camera={{ 
          position: cameraPosition,
          fov: isMobile ? 60 : 50
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          <directionalLight position={[0, 5, 0]} intensity={2} />
          <fog attach="fog" args={['#000020', fogNear, fogFar]} />
          <GameBoard 
            onGameStateUpdate={handleGameStateUpdate}
            onPowerUpActivation={handlePowerUpActivation}
            powerUpActive={gameState.powerUpActive}
          />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            dampingFactor={0.2}
            enableDamping={true}
            rotateSpeed={isMobile ? 0.6 : 1}
            touches={{
              ONE: THREE.TOUCH.ROTATE
            }}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App 