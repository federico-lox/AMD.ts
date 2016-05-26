/// <reference path="../src/amd.ts" />
declare const
    global: any,
    require: any;
    
const assert = require('assert');

// Test variants of modules emitted by tsc
global.require(['tst/fizz'], (fizz: any) => assert.strictEqual(fizz.buzz(), 5));

// Test mixed sequence of inter-dependent modules
global.define('a', [], () => 2)
global.require(['b', 'c', 'a'], (b: any, c: any, a: any) => assert.strictEqual(b + c.a + a, 10));
global.define('b', ['c'], (c: any) => c.a + 2);
global.define('c', ['a'], (a: any) => ({ a: 1 + a }));
global.require(['a', 'd'], (a: any, d: any) => assert.strictEqual(a + d.z, 10));
global.define('d', ['e'], (e: any) => ({ z: 4 + e }));
global.define('e', ['a'], (a: any) => 2 + a);