var bot = require('./bot');

var token = process.env.BOT_API_KEY;

var breadbot = new bot.Breadbot(token);

breadbot.initialize();
