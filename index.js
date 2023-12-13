const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options');
const token = '6656621273:AAETePSOQYAOQ7nUoFdgn_LPXcPAE13mVbo'

const bot = new TelegramApi(token, { polling: true });

const chats = {}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Play again', callback_data: '/again' }],
        ]
    })
}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' },],
            [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' },],
            [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' },],
            [{ text: '0', callback_data: '0' }]
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now I am going to guess a number from 0 to 9 and you have to guess it.')
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess', gameOptions)
}

const start = () => {

    bot.setMyCommands([
        { command: '/start', description: 'Start welcome' },
        { command: '/info', description: 'Get user information' },
        { command: '/game', description: 'Game guess number' },
    ])


    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/be1/98c/be198cd5-121f-4f41-9cc0-e246df7c210d/2.webp')
            return bot.sendMessage(chatId, 'Welcome in my Telegram Bot!')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'I do not understand you. Try again');

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Congratulation! You guessed the number ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Unfortunately, you didn't get it, the bot guessed a number ${chats[chatId]}`, againOptions);
        }
    })
}

start();