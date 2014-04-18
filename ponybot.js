/* 
  Gives webdevs a pony when they ask.
  Because they keep asking.

  Thanks to David Walsh for most of the code, courtesy of his excellent
  tutorial: http://davidwalsh.name/nodejs-irc
  and also to James Socol for jig for some other ideas I have cribbed:
  https://github.com/jsocol/jig
 
*/

var irc = require('irc'),
          options = require('nomnom').opts({
              config: {
                  string: "-c CONFIG, --config=CONFIG",
                  default: "config.ini",
                  help: "What config file to use. (Default: config.ini)"
              }
          }).parseArgs(),
          IniReader = require('inireader').IniReader;

inireader = new IniReader();
inireader.load(options.config);
var CONFIG = inireader.getBlock();

function interpolate(fmt, obj, named) {
    if (named) {
        return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
    } else {
        return fmt.replace(/%s/g, function(match){return String(obj.shift())});
    }
}

var CHANNELS = CONFIG.irc.channels.split(','),
    IRCHOST = CONFIG.irc.server,
    IRCNICK = CONFIG.irc.nick;

CHANNELS.forEach(function(c, i) {
    CHANNELS[i] = c.trim();
});

// create a ponybot
var bot = new irc.Client(IRCHOST, IRCNICK, {
    channels: CHANNELS
}).on('error', function(err) {
    if (err.rawCommand != '421') {
        console.log(err);
        if (err.hasOwnProperty('stack')) {
            console.log(err.stack);
        }
    }
});

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

// listen for important messages 
bot.on("message", function(from, to, message) {
    if (to.indexOf('#') != 0) return;
    if (from == IRCNICK) return;
    message = message.toLowerCase();
    if (/i want a pony/i.test(message)) {
        pony = ponies[Math.floor(Math.random() * ponies.length)];
        bot.say(to, "Here's a pony: " + pony);
    } else if (message.indexOf(IRCNICK) == 0 && /botsnack\s*$/i.test(message)) {
       bot.say(to, 'munch munch munch');
    } else if (/pony/i.test(message)) {
       bot.say(to, 'Did someone call for a pony?');
    } else if (message.indexOf(IRCNICK) == 0) {
       bot.say(to, 'Neigh!');
    }
});
