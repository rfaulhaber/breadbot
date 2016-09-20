var Botkit = require('botkit');

var commands = require('./commands');
// var db = require('./db');

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
            // throw new Error("Couldn't connect to Slack!");
            console.log("Couldn't connect to Slack!");
        } else {
            console.log("Connected to Slack!");
        }
    });

    // TODO: put all this.controller commands here
}



module.exports = {
    Breadbot: Breadbot
};
