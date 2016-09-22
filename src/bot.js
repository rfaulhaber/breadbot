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
    const hearsKeywords = ['bread fact', ':bread:', 'joke'];
    var self = this;

    this.bot.startRTM(function(error, bot, payload) {
        if (error) {
            console.log("Couldn't connect to Slack!");
        } else {
            console.log("Connected to Slack!");
            loadBreadText();
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
            console.log(line);
            console.log(self.facts.length);
        });
    }
}

module.exports = {
    Breadbot: Breadbot
};
