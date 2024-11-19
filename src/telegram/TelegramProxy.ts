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

    // Handle game sharing
    if (window.TelegramGameProxy) {
      window.TelegramGameProxy.shareScore = () => {
        // Called when user wants to share their score
        console.log('Score shared');
      };
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