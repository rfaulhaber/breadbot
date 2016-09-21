'use strict'

var Botkit = require('botkit');
var commands = require('./commands');

var Breadbot = function(token) {
    this.token = token;
    this.controller = Botkit.slackbot();
    this.bot = this.spawn();
    this.lastBreadFact;
    this.lastJoke;
}

Breadbot.prototype.spawn = function() {
    return this.controller.spawn({
        token: this.token
    });
}

Breadbot.prototype.initialize = function() {
    let hearsKeywords = ['bread fact', ':bread:', 'joke'];

    this.bot.startRTM(function(error, bot, payload) {
        if (error) {
            console.log("Couldn't connect to Slack!");
        } else {
            console.log("Connected to Slack!");
        }
    });


    this.controller.hears(hearsKeywords, ['direct_mention'], function(bot, message) {
        handleDirect(bot, message);
    });

    this.controller.on('direct_message', function(bot, message) {
        handleDirect(bot, message);
    });

    function handleDirect(bot, message) {
        switch(message.match[0]) {
            case hearsKeywords[0]:
            case hearsKeywords[1]:
                handleBreadPrompt(bot, message);
                break;
            case hearsKeywords[2]:
                handleJokePrompt(bot, message);
                break;
        }
    }

    function handleBreadPrompt(bot, message) {
        console.log("I must tell a bread fact!");
        let breadFactDate = Breadbot.lastBreadFact;

        if (breadFactDate == undefined || hoursSince(breadFactDate.getTime()) >= 24) {
            bot.reply(message, getBreadFact());
            Breadbot.lastBreadFact = new Date();
        } else {
            bot.reply(message, getNoBreadMessage());
        }
    }

    function handleJokePrompt(bot, message) {
        console.log("I must tell a joke!");
        bot.reply(message, getJoke());
    }

    function hoursSince(time) {
        var t = Math.abs(time - new Date().getTime()) / (1000 * 3600);
        return t;
    }

    function getBreadFact() {
        return "Bread is a food!"; // TODO: change placeholder text
    }

    function getNoBreadMessage() {
        var timeUntil = (24 - hoursSince(Breadbot.lastBreadFact.getTime())).toFixed(2);
        return "Sorry, I only tell one bread fact a day! You must wait " +
             timeUntil + " hours to hear another one!";
    }
}

module.exports = {
    Breadbot: Breadbot
};
