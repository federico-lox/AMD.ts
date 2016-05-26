// TODO: Support reloading/re-defining modules
declare var exports, global;

((context) => {
    type defmodule = (...deps: any[]) => any;
    type depslist = string[];
    type dict<T> = { [key: string]: T };

    const
        inverseDependencyMap: dict<dict<void>> = {},
        modules: dict<any> = {},
        initializers: dict<Function> = {};

    function require(dependencies: depslist, definition: defmodule) {
        if (isVoid(dependencies) || isVoid(definition)) {
            throw new Error(`Missing or null parameters: dependencies ${dependencies} - definition ${definition}`);
        } else {
            processDefinition(`require-${Date.now()}.${Math.random()}`, dependencies, definition);
        }
    }

    function define(name: string, dependencies: depslist, definition: defmodule) {
        if (isVoid(name) || isVoid(dependencies) || isVoid(definition)) {
            throw new Error(`Missing or null parameters: name ${name} - dependencies ${dependencies} - definition ${definition}`);
        } else {
            // TODO: remove from modules if exists to allow reloading/redefining in the future
            processDefinition(name, dependencies, definition);
        }
    }

    context.require = require;
    context.define = define;

    function isVoid(value: any): value is void {
        // true for both undefined and null
        return value == null;
    }

    function processDefinition(name: string, dependencies: depslist, definition: defmodule) {
        if (dependencies.length === 0) {
            modules[name] = definition();
        } else {
            if (!(name in initializers)) {
                initializers[name] = initializer.bind(null, name, dependencies, definition);
            }

            dependencies.forEach((dependency) => {
                if (!(dependency in inverseDependencyMap)) inverseDependencyMap[dependency] = {};
                inverseDependencyMap[dependency][name] = null;
                processDependencies(dependency);
            });
        }
    }

    function initializer(name: string, dependencies: depslist, definition: defmodule) {
        // Counting down from deps.length to 0 using a local counter could be an optimization although less safe
        if (dependencies.filter((dependency) => !(dependency in modules)).length === 0) {
            modules[name] = definition.apply(null, dependencies.map((dependency) => modules[dependency]));
            processDependencies(name);
            initializers[name] = null;
        }
    }

    function processDependencies(name: string) {
        // TODO: consider making this concurrent
        if (name in inverseDependencyMap) {
            Object.keys(inverseDependencyMap[name]).forEach((parent) => {
                if (!isVoid(initializers[parent])) initializers[parent]();
            });
        }
    }
})(typeof exports !== 'undefined' ? exports : typeof window !== 'undefined' ? window : global);