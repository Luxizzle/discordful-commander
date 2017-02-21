var IBase = require('./Base');
var _ = require('lodash');

class IUser extends IBase {
  constructor(id, formatted = false, options) {
    var raw = id;
    if (formatted) {
      id = raw.match(/\d+/)[0];
    }
    super(raw);
    var _this = this;

    this.id = id;
    this.type = 'user';
  }

  mention(nick = false) {
    return '<@' + (nick ? '!' : '') + this.raw + '>';
  }
}

IUser.test = function(value) {
  return /<@!?\d+>/.test(value);
};

module.exports = IUser;
