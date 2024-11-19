declare global {
  interface Window {
    TelegramGameProxy?: {
      shareScore?: () => void;
      setScore?: (score: number) => void;
    };
  }
}

export {}; 