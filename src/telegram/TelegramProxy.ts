export class TelegramProxy {
  static isInTelegram = Boolean(window.TelegramGameProxy);

  static init() {
    if (!this.isInTelegram) {
      console.log('Game running in standalone mode');
      return;
    }

    // Initialize Telegram game
    if (window.TelegramGameProxy?.initGame) {
      try {
        window.TelegramGameProxy.initGame();
      } catch (e) {
        console.error('Failed to initialize Telegram game:', e);
      }
    }
  }

  static setScore(score: number) {
    if (this.isInTelegram && window.TelegramGameProxy?.setScore) {
      try {
        window.TelegramGameProxy.setScore(score);
      } catch (e) {
        console.error('Failed to set score:', e);
      }
    }
  }
} 