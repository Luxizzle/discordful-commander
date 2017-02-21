var low = require('lowdb');
var _ = require('lodash');

var debug = require('debug')('df-cmder');

var Message = require('./Message');
var Command = require('./Command');
var CommandPrompt = require('./CommandPrompt');
var util = require('./util');

/*
 * The Commander class
 * @class
 * @param {Discordful} discordful - The Discordful object
 * @param {Object} options - The options object
 * @param {String} options.db - A path to a json file as database
 * @param {String, RegExp} options.prefix - The prefix for your commands
 * @param {String, Regexp} options.seperator - The seperator to seperate stuff
 * @param {Boolean} options.selfbot - IF true, bot only reacts to you
*/

class Commander {
  constructor(discordful, options) {
    this.options = _.defaults(options || {}, { // I could use Object.assign but i wanna be cool
      db: 'db.json',
      prefix: '/',
      selfbot: false,
      promptMention: false
    });

    this.discordful = discordful || null;
    options.discordful = this.discordful;
    options.self = this;

    this.commands = [];
    this.prompts = [];

    this.db = low(options.db);
    this.db
      .defaults({
        users: []
      })
      .write();

    debug('Created Commander object');
  }

  registerUser(user) {
    var _this = this;
    var id = user.id;

    var inDb = this.db
      .get('users')
      .find({ id: id })
      .isUndefined()
      .value();

    if (inDb) {
      _this.db.get('users')
        .push({
          id: id,
          username: user.username,
          discriminator: user.discriminator
        })
        .write();

      debug('Registered user: %s#%s', user.username, user.discriminator);
    }
  }

  parseRaw(e) {
    return this.parse()(e.message);
  }

  // rewrite this because of the Command.options.ignorePrefix and -customPrefix things
  parse() {
    var _this = this;
    return function(e, cb) {
      var message = e.message || e;
      if (message.author.id === _this.discordful.User.id && _this.options.selfbot === false) {
        return cb(null, false, message);
      } else if (message.author.id !== _this.discordful.User.id && _this.options.selfbot === true) {
        return cb(null, false, message);
      }

      _this.registerUser(message.author); // Register the user in the database

      if (_this.checkPrompt(message)) return cb(null, true, message);

      var prefix = _this.options.prefix;
      var content = message.content; // just get these for the ease of reading
      var contentSplit = util.seperate(content, _this.options);
      if (contentSplit.length === 0) return cb(null, false, message); // Shouldnt really happen, but just a check

      // First check for the prefix, its a waste of recources to already parse the message

      var isPrefix = false;
      if (typeof prefix === 'string') {
        isPrefix = contentSplit[0].startsWith(prefix);
      } else if (prefix instanceof RegExp) {
        isPrefix = prefix.test(contentSplit[0]);
      }
      if (!isPrefix) return cb(null, false, message);

      // Create the modified content to not include the prefix
      contentSplit[0] = contentSplit[0].replace(prefix, ''); // Replace the prefix with an empty string
      if (contentSplit[0].trim() === '') contentSplit.shift();

      var msg = new Message(message, contentSplit, _this.options); // Generate our message object

      var cmds = _this.commands.filter((c) => c.trigger === contentSplit[0]);
      if (cmds.length === 0) return cb(null, false, message);

      cmds.forEach((c) => {
        c.cmd.run(msg);
      });

      return cb(null, true, message); // Return the original message for any plugins after this
    };
  }

  checkPrompt(message) { // Might have to rethink activation based on time and server/channel
    var user = message.author;
    var promptId = this.db
      .get('users')
      .find({ id: user.id })
      .get('prompt')
      .value();

    if ( !promptId ) return false;

    var content = message.content; // just get these for the ease of reading
    var contentSplit = util.seperate(content, this.options);
    if (contentSplit.length === 0) return message; // Shouldnt really happen, but just a check
    var msg = new Message(message, contentSplit, this.options);

    var prompts = this.prompts.filter((p) => p.id == promptId);
    if (!prompts[0]) { throw new Error(`Tried to active prompt with id ${promptId}, but it doesnt exist.`); }
    prompts[0].run(msg);

    return true;
  }

  command(trigger, options, callback) {
    var cmd = new Command(trigger, options, this.options, callback);
    this.commands.push({
      cmd: cmd,
      id: cmd.id,
      trigger: trigger
    });

    debug('Registered command: %s', trigger);

    return cmd;
  }

  _prompt(question, options, callback) {
    var pmt = new CommandPrompt(question, options, callback);
    this.prompts.push({
      prompt: pmt,
      id: pmt.id
    });

    return pmt;
  }
}

module.exports = Commander;
