// TODO: Support reloading/re-defining modules
declare var exports, global;

((context) => {
    type defmodule = (...deps: any[]) => any;
    type depslist = string[];

    const
        inverseDependencyMap = {},
        modules = {},
        initializers = {};

    function require(dependencies: depslist, definition: defmodule) {
        if (isVoid(dependencies) || isVoid(definition)) {
            throw new Error(`Missing or null parameters: dependencies ${dependencies} - definition ${definition}`);
        } else {
            processModule(`require-${Date.now()}.${Math.random()}`, dependencies, definition);
        }
    }

    function define(name: string, dependencies: depslist, definition: defmodule) {
        if (isVoid(name) || isVoid(dependencies) || isVoid(definition)) {
            throw new Error(`Missing or null parameters: name ${name} - dependencies ${dependencies} - definition ${definition}`);
        } else {
            // TODO: remove from modules if exists to allow reloading/redefining in the future
            processModule(name, dependencies, definition);
        }
    }

    context.require = require;
    context.define = define;

    function isVoid(value: any): value is void {
        // true for both undefined and null
        return value == null;
    }

    function processModule(name: string, dependencies: depslist, definition: defmodule) {
        if (dependencies.length === 0) {
            modules[name] = definition();
        } else {
            if (!(name in initializers)) {
                initializers[name] = initializer.bind(null, name, dependencies, definition);
            }

            dependencies.forEach((dep) => {
                if (!(dep in inverseDependencyMap)) inverseDependencyMap[dep] = {};
                inverseDependencyMap[dep][name] = null;          
                processDependencies(dep);
            });
        }
    }

    function initializer(id: string, dependencies: depslist, definition: defmodule) {
        // Counting down from deps.length to 0 using a local counter could be an optimization although less safe
        const missingCount = dependencies.filter((dep) => !(dep in modules)).length;

        if (missingCount === 0) {
            modules[id] = definition.apply(null, dependencies.map((dep) => modules[dep]));
            processDependencies(id);
            initializers[id] = null;
        }
    }

    function processDependencies(name: string) {
        if (name in inverseDependencyMap) {
            Object.keys(inverseDependencyMap[name]).forEach((parent) => {
                if (!isVoid(initializers[parent])) initializers[parent]();
            });
        }
    }
})(typeof exports !== 'undefined' ? exports : typeof window !== 'undefined' ? window : global);