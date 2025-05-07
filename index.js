require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı uğurludur'))
.catch((err) => console.error('MongoDB bağlantı xətası:', err));

// Telegram botu
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// /start komandası
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const webAppUrl = 'https://elanbot-frontend2.vercel.app';

  bot.sendMessage(chatId, 'Salam! ElanBot-a xoş gəldiniz.', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📋 Panelə keç',
            web_app: {
              url: webAppUrl,
            },
          },
        ],
      ],
    },
  });
});

// Express server
app.get('/', (req, res) => {
  res.send('ElanBot Backend işləyir.');
});

app.listen(port, () => {
  console.log(`Server port ${port}-da işləyir`);
});