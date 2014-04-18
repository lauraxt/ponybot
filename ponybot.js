/* 
  Gives webdevs a pony when they ask.
  Because they keep asking.

  Thanks to David Walsh for most of the code, courtesy of his excellent
  tutorial: http://davidwalsh.name/nodejs-irc
 
*/

// Basic config
  config = {
	channels: ["#ponies"],     // for testing
	server: "irc.mozilla.org",
	botName: "ponybot"
};

// some random ponies, from the internet
  ponies = [ 
	"http://herogamesworld.com/images/my%20little%20pony%20games.jpg",
        "http://wildgoddesslife.com/wp-content/uploads/2012/04/pony.jpg",
        "http://www.allcreaturesgreatandsmall.org.uk/media/25575/Shetland_Pony_on_Belstone_Common,_Dartmoor.jpg",
        "http://upload.wikimedia.org/wikipedia/commons/2/2e/Wild_Pony_at_Assateague.jpg",
        "http://upload.wikimedia.org/wikipedia/commons/a/a4/Shetland_pony_dalmatian2.jpg",
        "http://fc00.deviantart.net/fs71/f/2013/098/6/6/supersonic_pony__by_britishstarr-d60wtou.png",
        "http://upload.wikimedia.org/wikipedia/commons/f/f2/Dartmoor_pony_2.jpg",
  ] 


// handy little irc lib 
var irc = require("irc");

// create ponybot 
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

// listen for important messages 
bot.on("message", function(from, to, message) {
    if (to.indexOf('#') != 0) return;
    if (from == config.botName) return;
    message = message.toLowerCase();
    if (/i want a pony\s*$/i.test(message)) {
        pony = ponies[Math.floor(Math.random() * ponies.length)];
        bot.say(config.channels[0], "Here's a pony: " + pony);
    }
    if (message.indexOf(config.botName) == 0 && /botsnack\s*$/i.test(message)) {
       bot.say(config.channels[0], 'munch munch munch');
    } else if (message.indexOf(config.botName) == 0) {
       bot.say(config.channels[0], 'Neigh!');
    }
});
