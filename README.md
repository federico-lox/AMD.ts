AMD.ts
========
AMD.ts is a compact, specialized implementation of [AMD](https://github.com/amdjs/amdjs-api) meant to support modules emitted by the [TypeScript](https://typescriptlang.org) compiler.

Rationale
---------
The TypeScript compiler can emit Javascript code targeting different module formats from the same source, at the moment of writing it supports *AMD*, *SystemJS*, *CommonJS* and *ES6* modules.

This is very handy when working on cross-platform (or as they say nowadays, *isomorphic*) Javascript code bases as it allows the same code to be packaged for all the various environments where it should run.

Usually to support browser environments, though, additional tooling and tedious wiring is required (e.g. [Webpack](https://webpack.github.io)) to "bundle", load and process modules; depending on the size and performance budget of a project, this might translate into unnecessary overhead and headaches.

While the TypeScript compiler is able to "bundle" some module formats (at the time of writing this is possible by using the `--outFile` option when using *AMD* or *SystemJS* as the target module system) functioning as a low-overhead asset manager, it offers no mechanism to load and process its output in a browser enviornment.

AMD.ts is meant to address that with a small footprint and minimal overhead.

Usage
-----
TBD.

License
-------
AMD.ts is open source software and is free for any use under the [MIT License](LICENSE)