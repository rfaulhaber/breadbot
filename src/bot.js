var Botkit = require('botkit');

var commands = require('./commands');

var Breadbot = function(token) {
    this.token = token;
    this.controller = Botkit.slackbot();
    this.bot = this.spawn();
}

Breadbot.prototype.spawn = function() {
    return this.controller.spawn({
        token: this.token
    });
}

Breadbot.prototype.initialize = function() {
    this.bot.startRTM(function(error, bot, payload) {
        if (error) {
            console.log("Couldn't connect to Slack!");
        } else {
            console.log("Connected to Slack!");
        }
    });

    // TODO: put all this.controller commands here
    this.controller.on('direct_message', function(bot, message) {
        console.log("Someone privately sent me: ", message);
    });

    this.controller.on('direct_mention', function(bot, message) {
        bot.reply(message,{
          text: "A more complex response",
          username: "ReplyBot",
          icon_emoji: ":dash:",
        });
    });
}

module.exports = {
    Breadbot: Breadbot
};
