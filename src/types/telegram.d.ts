declare global {
  interface Window {
    TelegramGameProxy?: {
      initGame?: () => void;
      shareScore?: () => void;
      setScore?: (score: number) => void;
    };
  }
}

interface InlineQueryResultGame {
  type: 'game'
  id: string 
  game_short_name: string
  reply_markup?: InlineKeyboardMarkup
}

interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][]
}

interface InlineKeyboardButton {
  text: string
  callback_game?: CallbackGame // Must be used for first button
  url?: string // For additional buttons
}

// Empty interface as per docs
interface CallbackGame {}

export {}; 