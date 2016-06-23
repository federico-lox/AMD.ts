AMD.ts [![Build Status](https://travis-ci.org/federico-lox/AMD.ts.svg?branch=master)](https://travis-ci.org/federico-lox/AMD.ts) [![npm version](https://badge.fury.io/js/amd.ts.svg)](https://badge.fury.io/js/amd.ts)
========
AMD.ts is a compact, specialized implementation of [AMD](https://github.com/amdjs/amdjs-api) meant to support modules emitted by the [TypeScript](https://typescriptlang.org) compiler.

Rationale
---------
The TypeScript compiler can emit Javascript code targeting different module formats from the same source, at the moment of writing it supports *AMD*, *SystemJS*, *CommonJS* and *ES6* modules.

This is very handy when working on cross-platform (or as they say nowadays, *isomorphic*) Javascript code bases as it allows the same code to be packaged for all the various environments where it should run.

Usually to support browser environments, though, additional tooling and tedious wiring is required (e.g. [Webpack](https://webpack.github.io)) to "bundle", load and process modules; depending on the size and performance budget of a project, this might translate into unnecessary overhead and headaches.

While the TypeScript compiler is able to "bundle" some module formats (at the time of writing this is possible by using the `--outFile` option when using *AMD* or *SystemJS* as the target module system) functioning as a low-overhead asset manager, it offers no mechanism to load and process its output in a browser environment.

AMD.ts is meant to address that with a small footprint (**1K minified, 0.5K gzipped**) and minimal overhead.

Usage
-----
There are two ways to use AMD.ts, as a TypeScript source file to be inlined in your `tsc` output or as an external JavaScript resource.

### Inlined ###
**1**. Download [`amd.ts`](src/amd.ts) from this repository and place it somewhere in your TypeScript project's path. Alternatively you can install AMD.ts using [`npm`](http://npmjs.com/package/amd.ts), the file can then be found in `node_modules/amd.ts/src/amd.ts`.

**2**. Have a "main" file where to call require to initialize your logic, this is where you would also add a `ref` comment to ensure the `require` function is available:
```typescript
// main.ts
/// <reference path="<PATH_TO>/amd.ts" />
require(['module1', 'module2'], (mod1: any, mod2: any) => /* logic using required modules */);
```

**3**. Change your `tsconfig.json` file to produce a bundle with all your modules and `amd.ts`:
```json
{
    ...
    "module": "amd",
    "outFile": "<OUTPUT_PATH>.js"
    ...
}
```
Alternatively pass those options to `tsc` through the command line.

**4**. Invoke `tsc`, the compiler will produce a bundle with all your modules and AMD.ts inlined ready to be used in your web pages.

### External Javascript Resouce ###
AMD.ts is available in compiled form [in this repository](build/amd.js) ([minified version](build/amd.min.js)), via [`npm`](http://npmjs.com/package/amd.ts) and at [`npmcdn`](https://npmcdn.com/amd.ts) ([minified version](https://npmcdn.com/amd.ts/build/amd.min.js)).

It can be added to a HTML page using a script tag, then you can either compile your modules as separate files and add them to the page using multiple script tags, or you can create a bundle with the modules as point #3 above shows. In this case make sure AMD.ts is loaded before any module definition or call to `require`.

License
-------
AMD.ts is open source software and is free for any use under the [MIT License](LICENSE)

Changelog
---------
Information about the changes across versions in available in the [changelog](CHANGELOG)
