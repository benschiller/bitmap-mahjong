export class TelegramProxy {
  static isInTelegram = Boolean(window.TelegramGameProxy);

  static init() {
    if (!this.isInTelegram) {
      console.log('Game running in standalone mode');
      return;
    }
    console.log('Telegram Game Proxy initialized');
  }

  static setScore(score: number) {
    if (this.isInTelegram && window.TelegramGameProxy?.setScore) {
      window.TelegramGameProxy.setScore(score);
    }
  }
} 