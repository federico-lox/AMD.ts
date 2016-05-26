/// <reference path="../src/amd.ts" />
namespace test {
    declare const
        global: any,
        require: any;
        
    const assert = require('assert');

    // Test variants of modules emitted by tsc...
    
    // ... as a single dependency
    global.require(['tst/single-export'], (s: any) => assert.strictEqual(s.plusOne(4), 5));
    
    // ... as multiple dependencies, one already defined
    global.require(['tst/multiple-exports', 'tst/single-export'], (m: any, s: any) => {
        assert.strictEqual(m.compare(new m.NumericValue(s.plusOne(4)), m.five), true);
    });
    
    // ... as multiple depdencies not yet defined
    global.require(['tst/assign-require', 'tst/import-as'], (r: any, i: any) => {
        assert.strictEqual(r.test(), true);
        assert.strictEqual(i.default, true)
    });

    // Test mixed sequence of inter-dependent modules
    global.define('a', [], () => 2)
    global.require(['b', 'c', 'a'], (b: any, c: any, a: any) => assert.strictEqual(b + c.a + a, 10));
    global.define('b', ['c'], (c: any) => c.a + 2);
    global.define('c', ['a'], (a: any) => ({ a: 1 + a }));
    global.require(['a', 'd'], (a: any, d: any) => assert.strictEqual(a + d.z, 10));
    global.define('d', ['e'], (e: any) => ({ z: 4 + e }));
    global.define('e', ['a'], (a: any) => 2 + a);
}