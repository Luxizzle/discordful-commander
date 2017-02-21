var _ = require('lodash');

var IUser = require('./MessageInterfaces/User');
var INumber = require('./MessageInterfaces/Number');
var IString = require('./MessageInterfaces/String');
var IBoolean = require('./MessageInterfaces/Boolean');

function findType(value, options) {
  var rvalue = value.trim().toLowerCase();

  switch(rvalue) {
    case 'true':
      return new IBoolean(value, true, options);
    case 'false':
      return new IBoolean(value, false, options);
  }

  if ( IUser.test(rvalue) ) return new IUser(value, true, options);

  if ( !isNaN(Number(rvalue)) ) return new INumber(value, options);

  return new IString(value, options);
}

function seperate(content, options) {
  options = _.defaults(options || {}, {
    preParse: function(v) { return v.trim(); },
    postParse: function(args) {
      args.forEach((arg, i) => {
        args[i] = arg.replace(/"/g, ''); // converts "\"hi there\"" to "hi there"
      });
      return args;
    },
    seperator: /(?:[^\s"]+|"[^"]*")+/g,
    split: false // use split instead of match
  });

  var argsPre = options.preParse(content);
  //var argsMid = options.split ? argsPre.trim().split(options.seperator) : argsPre.trim().match(options.seperator);
  var argsMid = argsPre;
  if (options.split) {
    argsMid = argsPre.split(options.seperator);
  } else {
    argsMid = argsPre.match(options.seperator) || []; // string.match can return null
  }
  var argsPost = options.postParse(argsMid); // this whole pre- post parse this is just to satisfy my insanity created with regex

  return argsPost;
}

module.exports = {
  seperate: seperate,
  findType: findType
};
