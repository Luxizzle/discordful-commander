var IBase = require('./Base');

class IBoolean extends IBase {
  constructor(str, value) {
    super(str);

    this.value = value;

    this.type = 'boolean';
  }
}

module.exports = IBoolean;
