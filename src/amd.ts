declare var exports;

((context) => {
    const tracker = {};
    const definitions = {};

    function require() { }

    function define(name: string, dependencies: string[], definition: (...deps: any[]) => any) {
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