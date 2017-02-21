var IBase = require('./Base');

class INumber extends IBase {
  constructor(value) {
    super(value);

    this.value = Number(value);

    this.type = 'number';
  }
}

module.exports = INumber;
