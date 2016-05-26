/// <reference path="../src/amd.ts" />
declare const
    global: any,
    require: any;
    
const assert = require('assert');

global.require(['tst/fizz'], (fizz: any) => assert.strictEqual(fizz.buzz(), 5));