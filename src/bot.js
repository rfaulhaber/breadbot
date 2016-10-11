'use strict'

var Botkit = require('botkit');
var commands = require('./commands');
// var redisStorage = require('botkit-storage-redis');

var Breadbot = function(token) {
    this.token = token;
    this.controller = Botkit.slackbot();
    this.bot = this.spawn();
    this.facts = [];
    this.jokes = [];
    this.recipes = [];
    this.lastBreadFact;
    this.lastJoke;
}

Breadbot.prototype.spawn = function() {
    return this.controller.spawn({
        token: this.token
    });
}

Breadbot.prototype.initialize = function() {
    const hearsDirectKeywords = ['bread fact', ':bread:', 'joke', 'recipe'];
    const hearsAmbientKeywords = ['no fun allowed'];
    const noFunAllowedLink = 'http://i1.kym-cdn.com/photos/images/facebook/000/731/143/3e3.jpg';
    var self = this;

    this.bot.startRTM(function(error, bot, payload) {
        if (error) {
            console.log("Couldn't connect to Slack!");
        } else {
            console.log("Connected to Slack!");
            loadBreadText();
            loadJokeText();
            loadRecipeText();
        }
    });

    this.controller.hears(hearsDirectKeywords, ['direct_mention'], function(bot, message) {
        handleDirect(bot, message);
    });

    this.controller.hears(hearsAmbientKeywords, ['ambient'], function(bot, message) {
        bot.reply(message, noFunAllowedLink);
    });

    this.controller.on('direct_message', function(bot, message) {
        handleDirect(bot, message);
    });

    function handleDirect(bot, message) {
        // TODO: make all these one function based on keyword
        switch(message.match[0]) {
            case hearsDirectKeywords[0]:
            case hearsDirectKeywords[1]:
                handleBreadPrompt(bot, message);
                break;
            case hearsDirectKeywords[2]:
                handleJokePrompt(bot, message);
                break;
            case hearsDirectKeywords[3]:
                handleRecipePrompt(bot, message);
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

    function handleRecipePrompt(bot, message) {
        console.log("I must provide a recipe!");
        bot.reply(message, getRecipe());
    }

    function hoursSince(time) {
        return Math.abs(time - new Date().getTime()) / (1000 * 3600);
    }

    // TODO: merge these functions into one
    function getBreadFact() {
        return self.facts[Math.floor(Math.random() * self.facts.length)];
    }

    function getNoBreadMessage() {
        const timeUntil = (24 - hoursSince(self.lastBreadFact.getTime())).toFixed(2);
        return "Sorry, I only tell one bread fact a day! You must wait " +
             timeUntil + " hours to hear another one!";
    }

    function getJoke() {
        return self.jokes[Math.floor(Math.random() * self.jokes.length)];
    }

    function getRecipe() {
        return self.recipes[Math.floor(Math.random() * self.recipes.length)];
    }

    function loadBreadText() {
        var lineReader = require('readline').createInterface({
          input: require('fs').createReadStream('data/bread.txt')
        });

        lineReader.on('line', function (line) {
            self.facts.push(line);
        });
    }

    function loadJokeText() {
        var lineReader = require('readline').createInterface({
          input: require('fs').createReadStream('data/jokes.txt')
        });

        lineReader.on('line', function (line) {
            self.jokes.push(line);
        });
    }

    function loadRecipeText() {
        var lineReader = require('readline').createInterface({
          input: require('fs').createReadStream('data/recipes.txt')
        });

        lineReader.on('line', function (line) {
            self.recipes.push(line);
        });
    }
}

module.exports = {
    Breadbot: Breadbot
};
