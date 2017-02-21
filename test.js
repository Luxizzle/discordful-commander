import test from 'ava';

var util = require('./src/util');

var sep = util.seperate;
var ft = util.findType;

function json(value) {
  return JSON.stringify(value);
}

test('util:seperate', t => {
  t.deepEqual(sep(`blab`), ["blab"]);
  t.deepEqual(sep(`blab bloob`), ["blab", "bloob"]);
  t.deepEqual(sep(`blab "bloob"`), ["blab", "\"bloob\""]);
  t.deepEqual(sep(`"blab bloob"`), ["\"blab bloob\""]);
});

test('util:findType', t => {
  t.deepEqual(ft('true'), {type: 'boolean', value: true});
  t.deepEqual(ft('bla'), {type: 'string', value: 'bla'});
  t.deepEqual(ft('5'), {type: 'number', value: 5});

  t.deepEqual(json(ft('<@123>')), json({type: 'user', value: {
    raw: "<@123>",
    options: {},
    id: "123"
  }}));
  t.deepEqual(json(ft('<@!123>')), json({type: 'user', value: {
    raw: "<@!123>",
    options: {},
    id: "123"
  }}));
});

