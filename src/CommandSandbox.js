class CommandSandbox {
  constructor(command, message) {
    this.command = command;
    this.self = command.self;
    this.client = this.self.discordful;
    this.db = this.self.db;
    this.message = message;
  }

  reply(content, embed) {
    this.message.reply(content, embed);
  }
  send(content, embed) {
    this.message.send(content, embed);
  }

  prompt(question, options, callback) {
    return this.self._prompt(question, options, this.command.dOptions, callback);
  }
}

module.exports = CommandSandbox;
