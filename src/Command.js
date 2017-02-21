var sid = require('shortid');
var _ = require('lodash');

var Sandbox = require('./CommandSandbox');

class Command {
  constructor(trigger, options, dOptions, callback = null) {
    var _this = this;
    this.options = _.defaults(options || {}, {
      params: '',
      desc: ''
    });

    this.id = sid();

    this.dOptions = dOptions;
    this.self = dOptions.self;

    this.callStack = [];
    if ( callback ) { _this.callback(callback); }

    this.prompts = {};
  }

  callback(fn, returnId = true) {
    var fnId = sid();
    this.callStack.push({
      fn: fn,
      id: fnId
    });

    return returnId ? fnId : fn;
  }

  removeCallback(id, isFn = false) {
    this.callStack = this.callStack.filter((fn) => {
      if (isFn) return fn.fn !== id;

      return fn.id !== id;
    });
  }

  run(message) {
    var sb = new Sandbox(this, message);
    this.callStack.forEach((cb) => {
      cb.fn.apply(sb, [message].concat(message.args.slice(1)));
    });
  }
}

module.exports = Command;

