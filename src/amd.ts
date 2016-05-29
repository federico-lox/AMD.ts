namespace AMD.ts {
    // TODO: Support reloading/re-defining modules

    declare var exports: any, global: any;
    export type defmodule = (...deps: any[]) => any;
    export type depslist = string[];
    type dict<T> = { [key: string]: T };

    const
        inverseDependencyMap: dict<dict<void>> = {},
        modules: dict<any> = {},
        initializers: dict<Function> = {};

    export function require(dependencies: depslist, definition: defmodule): void {
        if (isVoid(dependencies) || isVoid(definition)) {
            throw new Error(`require - missing or null parameters: dependencies ${dependencies} - definition ${definition}`);
        } else {
            processDefinition(`require-${Date.now()}.${Math.random()}`, dependencies, definition);
        }
    }

    export function define(name: string, dependencies: depslist, definition: defmodule): void {
        if (isVoid(name) || isVoid(dependencies) || isVoid(definition)) {
            throw new Error(`define - missing or null parameters: name ${name} - dependencies ${dependencies} - definition ${definition}`);
        } else {
            // TODO: remove from modules if exists to allow reloading/redefining in the future
            processDefinition(name, dependencies, definition);
        }
    }

    function isVoid(value: any): value is void {
        // true for both undefined and null
        return value == null;
    }

    function processDefinition(name: string, dependencies: depslist, definition: defmodule): void {
        const deps = (dependencies.length > 0 && dependencies[0] === "require" && dependencies[1] === "exports") ?
            (dependencies.slice(2)) : dependencies;

        if (deps.length === 0) modules[name] = resolve(name, [], definition);
        else {
            if (!(name in initializers)) {
                initializers[name] = initializer.bind(null, name, deps, definition);
            }

            deps.forEach((dependency) => {
                if (!(dependency in inverseDependencyMap)) inverseDependencyMap[dependency] = {};
                inverseDependencyMap[dependency][name] = null;
                processDependencies(dependency);
            });
        }
    }

    function initializer(name: string, dependencies: depslist, definition: defmodule): void {
        // Counting down from deps.length to 0 using a local counter could be an optimization although less safe
        if (dependencies.filter((dependency) => !(dependency in modules)).length === 0) {
            modules[name] = resolve(name, dependencies.map((dependency) => modules[dependency]), definition)
            processDependencies(name);
            initializers[name] = null;
        }
    }

    function resolve(name: string, dependencies: any[], definition: defmodule): any {
        const
            exported = {},
            returned = definition.apply(null, (definition.length === dependencies.length + 2) ?
                [require, exported].concat(dependencies) : dependencies);

        return Object.keys(exported).length === 0 ? returned : exported;
    }

    function processDependencies(name: string): void {
        // TODO: consider making this concurrent
        if (name in inverseDependencyMap) {
            Object.keys(inverseDependencyMap[name]).forEach((parent) => {
                if (!isVoid(initializers[parent])) initializers[parent]();
            });
        }
    }
}

const
    require = AMD.ts.require,
    define = AMD.ts.define;