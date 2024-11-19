declare global {
  interface Window {
    TelegramGameProxy?: {
      initGame?: () => void;
      shareScore?: () => void;
      setScore?: (score: number) => void;
    };
  }
}

export {}; 