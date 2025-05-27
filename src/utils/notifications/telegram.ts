import TelegramBot from "node-telegram-bot-api";

// Ваш токен от BotFather
const botToken = `${process.env.TELEGRAM_BOT_TOKEN}`;
const chatId = `${process.env.TELEGRAM_CHAT_ID}`; // Замените на ID вашего чата

// Инициализация бота
const bot = new TelegramBot(botToken, { polling: false });

export async function sendNotification(message: string) {
  try {
    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.error("Failed to send notification", error);
  }
}
