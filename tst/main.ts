/// <reference path="../src/amd.ts" />
declare var require: Function;
const assert = require('assert');

global.require(['tst/fizz'], (fizz: any) => assert.strictEqual(fizz.buzz(), 5));