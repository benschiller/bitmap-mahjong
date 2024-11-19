import { useState, useEffect } from 'react'
import { BitMapTile } from './BitMapTile'
import { Grid } from './Grid'
import { ScorePopup } from './ScorePopup'
import { MatchParticles } from './MatchParticles'
import { GameState } from './GameState'
import { VictoryScreen } from './VictoryScreen'
import { VictoryParticles } from './VictoryParticles'
import { GameOverScreen } from './GameOverScreen'
import { soundService } from '../services/SoundService';
import { BlockMinedEffect } from './BlockMinedEffect'

interface TileData {
  id: number
  size: number
  position: [number, number, number]
  level: number
  isSubdivided?: boolean
}

interface ScorePopupData {
  id: number
  position: [number, number, number]
  score: number
}

interface GameScore {
  basePoints: number
  timeBonus: number
  total: number
}

interface GameBoardProps {
  onGameStateUpdate: (state: any) => void
  powerUpActive: boolean
  onPowerUpActivation: (active: boolean) => void
}

const TILE_SIZE = 1
const GAP_SIZE = 0.2
const GRID_UNIT = TILE_SIZE + GAP_SIZE

// Helper to create subdivided tiles (0.5x0.5 each)
const createSubdividedTiles = (baseId: number, gridX: number, gridZ: number): TileData[] => {
  const subSize = TILE_SIZE / 2 // 0.5 size for each subdivided tile
  const smallGap = GAP_SIZE / 2 // 0.1 gap between subdivided tiles
  
  return [
    // Top-left
    {
      id: baseId * 100,
      size: subSize,
      position: [gridX - subSize/2 - smallGap/2, 0, gridZ - subSize/2 - smallGap/2],
      level: 1,
      isSubdivided: true
    },
    // Top-right
    {
      id: baseId * 100 + 1,
      size: subSize,
      position: [gridX + subSize/2 + smallGap/2, 0, gridZ - subSize/2 - smallGap/2],
      level: 1,
      isSubdivided: true
    },
    // Bottom-left
    {
      id: baseId * 100 + 2,
      size: subSize,
      position: [gridX - subSize/2 - smallGap/2, 0, gridZ + subSize/2 + smallGap/2],
      level: 1,
      isSubdivided: true
    },
    // Bottom-right
    {
      id: baseId * 100 + 3,
      size: subSize,
      position: [gridX + subSize/2 + smallGap/2, 0, gridZ + subSize/2 + smallGap/2],
      level: 1,
      isSubdivided: true
    }
  ]
}

// Create a 4x4 grid with combined and subdivided tiles
const LEVELS: TileData[][] = [
  [
    // Upper left 2x2 block (replaces positions 1, 2, 5, 6)
    { 
      id: 1, 
      size: (TILE_SIZE * 2) + GAP_SIZE,
      position: [-1.2, 0, -1.2],
      level: 1 
    },

    // Rest of Row 1 (positions 3, 4)
    { id: 3, size: TILE_SIZE, position: [0.6, 0, -1.8], level: 1 },
    { id: 4, size: TILE_SIZE, position: [1.8, 0, -1.8], level: 1 },

    // Middle-right 2x2 block (replaces positions 7, 8, 11, 12)
    { 
      id: 2,
      size: (TILE_SIZE * 2) + GAP_SIZE,
      position: [1.2, 0, 0],
      level: 1 
    },

    // Row 3 (remaining positions 9, 10)
    { id: 9, size: TILE_SIZE, position: [-1.8, 0, 0.6], level: 1 },
    { id: 10, size: TILE_SIZE, position: [-0.6, 0, 0.6], level: 1 },

    // Row 4 (subdivided tiles at 13 and 16, regular tiles at 14-15)
    ...createSubdividedTiles(13, -1.8, 1.8), // Four 0.5x0.5 tiles at position 13
    { id: 14, size: TILE_SIZE, position: [-0.6, 0, 1.8], level: 1 },
    { id: 15, size: TILE_SIZE, position: [0.6, 0, 1.8], level: 1 },
    ...createSubdividedTiles(16, 1.8, 1.8), // Matching set of four 0.5x0.5 tiles at position 16
  ],
  
  // Level 2 - Symmetrical layout with 2x2s and subdivided tiles
  [
    // Two 2x2 blocks in top corners
    { 
      id: 1, 
      size: (TILE_SIZE * 2) + GAP_SIZE,
      position: [-1.2, 0, -1.2],
      level: 2 
    },
    { 
      id: 2, 
      size: (TILE_SIZE * 2) + GAP_SIZE,
      position: [1.2, 0, -1.2],
      level: 2 
    },

    // Regular 1x1 tiles in middle row
    { id: 3, size: TILE_SIZE, position: [-1.8, 0, 0.6], level: 2 },
    { id: 4, size: TILE_SIZE, position: [-0.6, 0, 0.6], level: 2 },
    { id: 5, size: TILE_SIZE, position: [0.6, 0, 0.6], level: 2 },
    { id: 6, size: TILE_SIZE, position: [1.8, 0, 0.6], level: 2 },

    // Subdivided tiles in bottom row
    ...createSubdividedTiles(7, -1.2, 1.8),
    ...createSubdividedTiles(8, 1.2, 1.8),
  ],

  // Level 3 - With consistent gap sizes
  [
    // Upper left 2x2 block (positions 1,2,5,6)
    { 
      id: 1, 
      size: (TILE_SIZE * 2) + GAP_SIZE,
      position: [-1.2, 0, -1.8],  // Moved up to create gap with lower 2x2
      level: 3 
    },

    // Lower left 2x2 block (positions 9,10,13,14)
    { 
      id: 2, 
      size: (TILE_SIZE * 2) + GAP_SIZE,
      position: [-1.2, 0, 0.6],   // Position maintained
      level: 3 
    },

    // Single tiles (positions 3,4,7,8)
    { id: 3, size: TILE_SIZE, position: [0.6, 0, -2.4], level: 3 },   // Aligned with upper 2x2
    { id: 4, size: TILE_SIZE, position: [1.8, 0, -2.4], level: 3 },   // Maintained gap with tile 3
    { id: 5, size: TILE_SIZE, position: [0.6, 0, -1.2], level: 3 },   // Consistent gap below 3
    { id: 6, size: TILE_SIZE, position: [1.8, 0, -1.2], level: 3 },   // Maintained gap with tile 5

    // Subdivided tiles (position 11)
    ...createSubdividedTiles(8, 0.6, 0),   // Aligned with gap spacing from 2x2

    // Positions 12,15,16 remain empty
  ]
]

export function GameBoard({ onGameStateUpdate, powerUpActive, onPowerUpActivation }: GameBoardProps) {
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null)
  const [matchedTiles, setMatchedTiles] = useState<number[]>([])
  const [currentLevel, setCurrentLevel] = useState(0)
  const [scorePopups, setScorePopups] = useState<ScorePopupData[]>([])
  const [matchEffects, setMatchEffects] = useState<{position: [number, number, number]}[]>([])
  const [score, setScore] = useState<GameScore>({
    basePoints: 0,
    timeBonus: 0,
    total: 0
  })
  const [timeLeft, setTimeLeft] = useState(60)
  const [blockProgress, setBlockProgress] = useState(0)
  const baseScore = 1000 // Base score for matches
  const [hasWon, setHasWon] = useState(false)
  const [isTimeExpired, setIsTimeExpired] = useState(false)
  const [showBlockMinedEffect, setShowBlockMinedEffect] = useState(false)

  // Add mobile detection
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Adjust tile spacing for mobile
  const tileSpacing = isMobile ? 1.8 : 1.5;  // Increase spacing on mobile
  
  const getTilePosition = (index: number): [number, number, number] => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return [
      (col - 1) * tileSpacing,  // Use adjusted spacing
      0,
      (row - 1) * tileSpacing   // Use adjusted spacing
    ];
  };

  const calculateScore = (timeRemaining: number) => {
    const basePoints = powerUpActive ? 1000 * 5 : 1000 // Multiply base points by 5 when powered up
    const timeBonus = Math.floor(timeRemaining * 10) // Keep time bonus the same
    return {
      basePoints,
      timeBonus,
      total: basePoints + timeBonus
    }
  }

  const handleMatch = (tile1: TileData, tile2: TileData) => {
    const matchScore = powerUpActive ? baseScore * 5 : baseScore

    setScorePopups(prev => [...prev, {
      id: Date.now(),
      position: [
        (tile1.position[0] + tile2.position[0]) / 2,
        tile1.position[1] + 1,
        (tile1.position[2] + tile2.position[2]) / 2
      ],
      score: matchScore
    }])

    setMatchEffects(prev => [
      ...prev,
      { position: tile1.position },
      { position: tile2.position }
    ])

    setMatchedTiles(prev => [...prev, tile1.id, tile2.id])

    // Calculate and update match score
    const newScore = calculateScore(timeLeft)
    setScore(prev => ({
      basePoints: prev.basePoints + newScore.basePoints,
      timeBonus: prev.timeBonus + newScore.timeBonus,
      total: prev.total + newScore.total
    }))

    // Update progress during gameplay
    const totalPairs = LEVELS[currentLevel].length / 2
    const matchedPairs = (matchedTiles.length + 2) / 2
    const progress = (matchedPairs / totalPairs) * 100
    setBlockProgress(progress)

    setTimeout(() => {
      setMatchEffects(prev => prev.filter(effect => 
        effect.position !== tile1.position && effect.position !== tile2.position
      ))
    }, 1000)
  }

  const handleTileClick = (tile: TileData) => {
    if (matchedTiles.includes(tile.id)) return;

    if (!selectedTile) {
      soundService.playSelect();
      setSelectedTile(tile);
      return;
    }

    if (tile.id === selectedTile.id) {
      setSelectedTile(null);
      return;
    }

    if (tile.size === selectedTile.size && 
        tile.isSubdivided === selectedTile.isSubdivided) {
      soundService.playMatch();
      handleMatch(selectedTile, tile);
    }
    
    setSelectedTile(null);
  }

  // Modify timer effect to stop when game is won
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clear interval if game is won or time expired
    if (hasWon || isTimeExpired) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [hasWon, isTimeExpired]);

  // Update parent state when local state changes
  useEffect(() => {
    onGameStateUpdate({
      timeLimit: timeLeft, // Pass the current time to parent
      currentScore: score.total,
      blockProgress,
      matchesFound: matchedTiles.length / 2,
    });
  }, [timeLeft, score.total, blockProgress, matchedTiles.length]);

  // Consolidate level completion logic in useEffect
  useEffect(() => {
    if (matchedTiles.length === 0) return;

    const currentLevelTiles = LEVELS[currentLevel];
    const allTilesMatched = currentLevelTiles.every(tile => 
      matchedTiles.includes(tile.id)
    );

    if (allTilesMatched) {
      // Add block completion bonus
      setScore(prev => ({
        ...prev,
        total: prev.total + 50000
      }))

      if (currentLevel === LEVELS.length - 1) {
        // Final level - go straight to victory
        soundService.playVictory();
        setHasWon(true);
      } else {
        // Non-final level - show block mined effect
        setBlockProgress(100)
        setShowBlockMinedEffect(true)
        soundService.playBlockMined()
        soundService.playLevelComplete();
        
        setTimeout(() => {
          setCurrentLevel(prev => {
            const nextLevel = prev + 1;
            setMatchedTiles([]);
            setBlockProgress(0);
            setShowBlockMinedEffect(false);
            return nextLevel;
          });
        }, 2000);
      }
    }
  }, [currentLevel, matchedTiles]);

  // Add game over sound
  useEffect(() => {
    if (isTimeExpired) {
      soundService.playGameOver();
    }
  }, [isTimeExpired]);

  const handleRestart = () => {
    setCurrentLevel(0)
    setMatchedTiles([])
    setScore({
      basePoints: 0,
      timeBonus: 0,
      total: 0
    })
    setTimeLeft(60)
    setBlockProgress(0)
    setHasWon(false)
    setIsTimeExpired(false)
    setSelectedTile(null)
    setScorePopups([])
    setMatchEffects([])
    onPowerUpActivation(false) // Reset power-up state
  }

  // Add effect to play power-up sound
  useEffect(() => {
    if (powerUpActive) {
      soundService.playPowerUp();
    }
  }, [powerUpActive]);

  return (
    <>
      <Grid />
      {!hasWon && !isTimeExpired && (
        <group>
          {LEVELS[currentLevel]
            .filter(tile => !matchedTiles.includes(tile.id))
            .map((tile) => (
              <BitMapTile 
                key={tile.id}
                size={tile.size}
                position={tile.position}
                onClick={() => handleTileClick(tile)}
                isSelected={selectedTile?.id === tile.id}
                isMatched={matchedTiles.includes(tile.id)}
              />
            ))}
        </group>
      )}
      {hasWon && (
        <>
          <VictoryParticles />
          <VictoryScreen 
            finalScore={score.total} 
            onRestart={handleRestart}
          />
        </>
      )}
      {isTimeExpired && (
        <>
          <GameOverScreen 
            finalScore={score.total}
            onRestart={handleRestart}
          />
        </>
      )}
      {matchEffects.map((effect, index) => (
        <MatchParticles key={index} position={effect.position} />
      ))}
      {scorePopups.map(popup => (
        <ScorePopup
          key={popup.id}
          position={popup.position}
          score={popup.score}
          onComplete={() => {
            setScorePopups(prev => prev.filter(p => p.id !== popup.id))
          }}
        />
      ))}
      {showBlockMinedEffect && (
        <BlockMinedEffect 
          onComplete={() => setShowBlockMinedEffect(false)} 
        />
      )}
    </>
  );
} 