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
    let keywords = ['breadbot', 'bread fact', 'joke'];
    let events = ['message_received'];

    this.controller.hears(keywords, events, function(bot, message) {
        console.log(message);
    });
}

module.exports = {
    Breadbot: Breadbot
};
