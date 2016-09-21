'use strict'

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

    let keywords = ['bread fact', ':bread:', 'joke'];
    let events = ['direct_mention'];

    this.controller.hears(keywords, events, function(bot, message) {
        switch(message.match[0]) {
            case keywords[0]:
            case keywords[1]:
                console.log("I must tell a bread fact!");
                break;
            case keywords[2]:
                console.log("I must tell a joke!");
                break;
        }
    });
}

module.exports = {
    Breadbot: Breadbot
};
