declare var exports;

((context) => {
    type defmodule = (...deps: any[]) => any;
    type deplist = string[];

    const tracker = {};
    const definitions = {};

    function require(dependencies: deplist, definition: defmodule) { }

    function define(name: string, dependencies: deplist, definition: defmodule) {
        if (isVoid(name) || isVoid(dependencies) || isVoid(define)) {
            throw new Error(`Missing or null parameters: name ${name} - dependencies ${dependencies} - definition ${definition}`);
        }

        dependencies.forEach((dep) => dep in tracker ? tracker[dep].push(name) : tracker[dep] = [name]);
        definitions[name] = { dependencies, definition };
    }

    context.require = require;
    context.define = define;

    function isVoid(value: any): value is void {
        // true for both undefined and null
        return value == null;
    }
})(typeof exports !== 'undefined' ? exports : window);