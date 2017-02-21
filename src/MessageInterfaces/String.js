var IBase = require('./Base');

class IString extends IBase {
  constructor(value) {
    super(value);

    this.value = value;

    this.type = 'string';
  }
}

module.exports = IString;
