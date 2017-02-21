var chrono = require('chrono-node');
var _ = require('lodash');

var findType = require('./util').findType;

class Message {
  constructor(msg, contentSplit, options) {
    options = _.defaults(options || {}, {
      chrono: chrono // Allow custom chrono parsers
    });

    this.discordful = options.discordful;

    this.id = msg.id;
    this.author = msg.author;
    this.content = msg.content;
    this.contentSplit = contentSplit;
    this.attachments = msg.attachments;
    this.embeds = msg.embeds;
    this.reactions = msg.reactions;

    this.message = msg;

    this.date = options.chrono.parseDate(this.content); // Get the date from chrono
    this.dates = options.chrono.parse(this.content); // More date stuff but expanded

    this.args = this._parseInterfaces();
  }

  _parseInterfaces() {
    var args = [];
    this.contentSplit.forEach((val) => {
      args.push(findType(val, this.options));
    });
    return args;
  }

  get isWebhook() { return this.author.isWebhook; }
  get isBot() { return this.author.bot; }

  get isPrivate() { return this.message.isPrivate; }
  get isDm() { return this.isPrivate; }

  get displayUsername() { return this.message.displayUsername; }

  reply(content = '', embed = null) {
    return this.message.reply(content, false, embed);
  }
  send(content = '', embed = null) {
    return this.message.channel.sendMessage(content, false, embed);
  }
}



module.exports = Message;
