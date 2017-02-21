class IBase {
  constructor(raw) {
    this.raw = raw;

    this.type = 'none';
  }

  get isUser() { return this.type === 'user'; }
  get isRole() { return this.type === 'role'; }
  get isEmoji() { return this.type === 'emoji'; }

  get isString() { return this.type === 'string'; }
  get isNumber() { return this.type === 'number'; }
  get isBoolean() { return this.type === 'boolean'; }
}

module.exports = IBase;
