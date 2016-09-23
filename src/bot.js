'use strict'

var Botkit = require('botkit');
var commands = require('./commands');
// var redisStorage = require('botkit-storage-redis');

var Breadbot = function(token) {
    this.token = token;
    this.controller = Botkit.slackbot();
    this.bot = this.spawn();
    this.facts = [];
    this.lastBreadFact;
    this.lastJoke;
}

Breadbot.prototype.spawn = function() {
    return this.controller.spawn({
        token: this.token
    });
}

Breadbot.prototype.initialize = function() {
    const hearsDirectKeywords = ['bread fact', ':bread:', 'joke'];
    const hearsAmbientKeywords = ['no fun allowed'];
    var self = this;

    this.bot.startRTM(function(error, bot, payload) {
        if (error) {
            console.log("Couldn't connect to Slack!");
        } else {
            console.log("Connected to Slack!");
            loadBreadText();
        }
    });

    this.controller.hears(hearsDirectKeywords, ['direct_mention'], function(bot, message) {
        handleDirect(bot, message);
    });

    this.controller.hears(hearsAmbientKeywords, ['ambient'], function(bot, message) {
        bot.reply(message, 'http://i1.kym-cdn.com/photos/images/facebook/000/731/143/3e3.jpg');
    });

    this.controller.on('direct_message', function(bot, message) {
        handleDirect(bot, message);
    });

    function handleDirect(bot, message) {
        switch(message.match[0]) {
            case hearsDirectKeywords[0]:
            case hearsDirectKeywords[1]:
                handleBreadPrompt(bot, message);
                break;
            case hearsDirectKeywords[2]:
                handleJokePrompt(bot, message);
                break;
        }
    }

    function handleBreadPrompt(bot, message) {
        console.log("I must tell a bread fact!");
        const breadFactDate = self.lastBreadFact;

        if (breadFactDate == undefined || hoursSince(breadFactDate.getTime()) >= 24) {
            bot.reply(message, getBreadFact());
            self.lastBreadFact = new Date();
        } else {
            bot.reply(message, getNoBreadMessage());
        }
    }

    function handleJokePrompt(bot, message) {
        console.log("I must tell a joke!");
        bot.reply(message, getJoke());
    }

    function hoursSince(time) {
        return Math.abs(time - new Date().getTime()) / (1000 * 3600);
    }

    function getBreadFact() {
        return self.facts[Math.floor(Math.random() * self.facts.length)];
    }

    function getNoBreadMessage() {
        const timeUntil = (24 - hoursSince(self.lastBreadFact.getTime())).toFixed(2);
        return "Sorry, I only tell one bread fact a day! You must wait " +
             timeUntil + " hours to hear another one!";
    }

    function getJoke() {
        return "blah blah blah";
    }

    function loadBreadText() {
        var lineReader = require('readline').createInterface({
          input: require('fs').createReadStream('data/bread.txt')
        });

        lineReader.on('line', function (line) {
            self.facts.push(line);
        });
    }
}

module.exports = {
    Breadbot: Breadbot
};
