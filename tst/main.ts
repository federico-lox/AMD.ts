/// <reference path="../src/amd.ts" />
interface Error {
        stack: string;
}

namespace test {
    function assert(value: boolean) {
        if (value !== true) {
            const [, , location] = (new Error).stack.split('\n');
            throw new Error(`Failed assertion ${location.trim()}`);
        }
    }

    // Test variants of modules emitted by tsc...

    // ... as a single dependency
    require(['tst/single-export'], (s: any) => assert(s.plusOne(4) === 5));

    // ... as multiple dependencies, one already defined
    require(['tst/multiple-exports', 'tst/single-export'], (m: any, s: any) => {
        assert(m.compare(new m.NumericValue(s.plusOne(4)), m.five) === true);
    });

    // ... as multiple depdencies not yet defined
    require(['tst/assign-require', 'tst/import-as'], (r: any, i: any) => {
        assert(r.test() === true);
        assert(i.default === true)
    });

    // Test mixed sequence of inter-dependent modules
    define('a', [], () => 2)
    require(['b', 'c', 'a'], (b: any, c: any, a: any) => assert(b + c.a + a === 10));
    define('b', ['c'], (c: any) => c.a + 2);
    define('c', ['a'], (a: any) => ({ a: 1 + a }));
    require(['a', 'd'], (a: any, d: any) => assert(a + d.z === 10));
    define('d', ['e'], (e: any) => ({ z: 4 + e }));
    define('e', ['a'], (a: any) => 2 + a);
}