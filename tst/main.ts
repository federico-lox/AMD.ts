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

    require(['tst/single-export'], (s: any) => {
        console.log('Test single dependency...');
        assert(s.plusOne(4) === 5)
        console.log("PASSED!\n");
    });

    require(['tst/multiple-exports', 'tst/single-export'], (m: any, s: any) => {
        console.log('Test multiple dependencies, one already defined...');
        assert(m.compare(new m.NumericValue(s.plusOne(4)), m.five) === true);
        console.log("PASSED!\n");
    });

    require(['tst/assign-require', 'tst/import-as'], (r: any, i: any) => {
        console.log('Test multiple dependencies, all not defined yet...');
        assert(r.test() === true);
        assert(i.default === true)
        console.log("PASSED!\n");
    });

    // Test mixed sequence of inter-dependent modules
    define('c', ['a'], (a: any) => ({ a: 1 + a }));
    require(['b', 'c', 'a'], (b: any, c: any, a: any) => {
        console.log('Test interdependent definitions 1/2...');
        assert(b + c.a + a === 10)
        console.log("PASSED!\n");
    });
    define('b', ['c'], (c: any) => c.a + 2);
    define('a', [], () => 2)

    require(['a', 'd'], (a: any, d: any) => {
        console.log('Test interdependent definitions 2/2...');
        assert(a + d.z === 10);
        console.log("PASSED!\n");
    });
    define('d', ['e'], (e: any) => ({ z: 4 + e }));
    define('e', ['a'], (a: any) => 2 + a);
}