// Bu fayl "elanbot-template" layihəsinin backend hissəsi ucun Express server quruluşudur
// Telegram bot, istifadəçi qeydiyyatı və sadə API burada olacaq

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  telegramId: String,
  username: String,
  first_name: String,
  filters: [
    {
      title: String,
      url: String,
      active: Boolean,
    },
  ],
});

const User = mongoose.model('User', userSchema);

// Telegram bot qurulması
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const existingUser = await User.findOne({ telegramId: chatId });

  if (!existingUser) {
    await User.create({
      telegramId: chatId,
      username: msg.from.username,
      first_name: msg.from.first_name,
      filters: [],
    });
  }

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
  
    const existingUser = await User.findOne({ telegramId: chatId });
  
    if (!existingUser) {
      await User.create({
        telegramId: chatId,
        username: msg.from.username,
        first_name: msg.from.first_name,
        filters: [],
      });
    }
  
    bot.sendMessage(chatId, `Salam, ${msg.from.first_name}! Panelə keçmək üçün aşağıdakı düyməni kliklə:`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔍 Paneli Aç",
              web_app: {
                url: "https://elanbot-frontend.vercel.app/dashboard"
              }
            }
          ]
        ]
      }
    });
  });

app.get('/', (req, res) => {
  res.send('ElanBot backend is working.');
});

// Yeni filter əlavə etmək üçün API
app.post('/api/add-filter', async (req, res) => {
  const { telegramId, title, url } = req.body;
  const user = await User.findOne({ telegramId });

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.filters.push({ title, url, active: true });
  await user.save();
  res.json({ message: 'Filter added' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
