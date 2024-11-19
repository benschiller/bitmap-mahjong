export class SoundService {
  static context: AudioContext | null = null;

  static init() {
    // Initialize immediately but in suspended state
    if (!SoundService.context) {
      SoundService.context = new AudioContext();
    }

    // Resume on first interaction
    const handleInteraction = () => {
      if (SoundService.context?.state === 'suspended') {
        SoundService.context.resume();
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine'): OscillatorNode {
    const oscillator = SoundService.context!.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, SoundService.context!.currentTime);
    return oscillator;
  }

  private async playTone(
    frequency: number, 
    duration: number, 
    type: OscillatorType = 'sine',
    volume = 0.1
  ) {
    const oscillator = this.createOscillator(frequency, type);
    const gainNode = SoundService.context!.createGain();
    
    gainNode.gain.setValueAtTime(volume, SoundService.context!.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01, 
      SoundService.context!.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(SoundService.context!.destination);
    
    oscillator.start();
    oscillator.stop(SoundService.context!.currentTime + duration);
  }

  playSelect() {
    this.playTone(440, 0.1, 'sine', 0.05); // A4 note, short duration
  }

  playMatch() {
    // Play two tones in sequence
    this.playTone(440, 0.1, 'square', 0.05);
    setTimeout(() => this.playTone(880, 0.1, 'square', 0.05), 100);
  }

  playLevelComplete() {
    // Ascending arpeggio
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'triangle', 0.05), i * 100);
    });
  }

  playVictory() {
    // Victory fanfare
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'triangle', 0.05), i * 150);
    });
    // Final chord
    setTimeout(() => {
      [440, 554, 659].forEach(freq => this.playTone(freq, 0.4, 'triangle', 0.03));
    }, notes.length * 150);
  }

  playGameOver() {
    // Descending tones
    [880, 784, 659, 587].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sawtooth', 0.05), i * 150);
    });
  }

  playPowerUp() {
    // Dramatic power-up sequence
    // Rising pitch with increasing volume
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        this.playTone(220 + (i * 50), 0.1, 'square', 0.02 + (i * 0.01));
      }, i * 50);
    }
    
    // Final power surge
    setTimeout(() => {
      // Play multiple frequencies simultaneously for a rich effect
      this.playTone(880, 0.3, 'square', 0.1);
      this.playTone(1108, 0.3, 'square', 0.08);
      this.playTone(1318, 0.3, 'sawtooth', 0.05);
    }, 500);
  }

  playPowerUpStage1() {
    // First button click - subtle anticipation
    [220, 330].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'sine', 0.03);
      }, i * 100);
    });
  }

  playPowerUpStage2() {
    // Second button click - building tension
    [330, 440, 554].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'square', 0.04);
      }, i * 100);
    });
  }

  playBlockMined() {
    // Dramatic ascending sequence
    [440, 554, 659, 880, 1108].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'square', 0.05);
      }, i * 50);
    });
    
    // Final celebratory chord
    setTimeout(() => {
      [440, 659, 880].forEach(freq => 
        this.playTone(freq, 0.4, 'square', 0.03)
      );
    }, 300);
  }
}

export const soundService = new SoundService(); 