// The require and define functions are defined directly as self-contained
// top-level functions to ensure hoisting makes them available at any point in
// the "bundle" produced by the TypeScript compiler, this is done in order to 
// avoid developers using AMD.ts to force inclusion/ execution order and work 
// against the compiler itself.

// NOTE: The code below purposely uses loose equality checks (==) against null
// to detect both null and undefined.
// TODO: Support reloading/re-defining modules

function require(dependencies: string[], definition: (...deps: any[]) => any): void {
    // A definition of a require call is nothing more than a nameless AMD
    // module, treat it as such.
    // TODO: make this concurrent
    define(`require.${Date.now()}.${Math.random()}`, dependencies, definition);
}

function define(name: string, dependencies: string[], definition: (...deps: any[]) => any): void {
    type depslist = string[];
    type defmodule = (...deps: any[]) => any;

    function processDefinition(name: string, dependencies: depslist, definition: defmodule, state: define.state): void {
        // Exclude require and exports as dependencies, both will be injected
        // in resolve
        const deps = (dependencies.length > 0 && dependencies[0] === "require" && dependencies[1] === "exports") ?
            (dependencies.slice(2)) : dependencies;

        if (deps.length === 0) {
            state.modules[name] = resolve(name, [], definition);
            processUpstreamDependencies(name, state);
        } else {
            // Register an initializer which will manage executing a module's
            // definition when all of it's dependencies are eventually available
            if (!(name in state.trackers)) {
                state.trackers[name] = track.bind(null, name, deps, definition, state);
            }

            // Build an inverse dependency map, this allows initializers to
            // track when all the module's definition become available
            deps.forEach((dependency) => {
                if (!(dependency in state.inverseDependencyMap)) state.inverseDependencyMap[dependency] = {};
                state.inverseDependencyMap[dependency][name] = null; // the value for a given key is irrelevant
                processUpstreamDependencies(dependency, state);
            });
        }
    }

    // Tracks the status of the definition of a module's dependencies    
    function track(name: string, dependencies: depslist, definition: defmodule, state: define.state): void {
        // When all depdendencies are defined, then execute the module's
        // definition and notify all the upstream dependencies
        if (dependencies.filter((dependency) => !(dependency in state.modules)).length === 0) {
            state.modules[name] = resolve(name, dependencies.map((dependency) => state.modules[dependency]), definition);
            processUpstreamDependencies(name, state);
            state.trackers[name] = null;
        }
    }

    function processUpstreamDependencies(name: string, state: define.state): void {
        if (name in state.inverseDependencyMap) {
            Object.keys(state.inverseDependencyMap[name]).forEach((parent) => {
                if (state.trackers[parent] != null) state.trackers[parent]();
            });
        }
    }

    function resolve(name: string, dependencies: any[], definition: defmodule): any {
        const
            exported = {},
            returned = definition.apply(null, (definition.length === dependencies.length + 2) ?
                [require, exported].concat(dependencies) : dependencies);

        return Object.keys(exported).length === 0 ? returned : exported;
    }

    if (name == null || dependencies == null || definition == null) {
        throw new Error(`Missing or wrong parameters for module definition: name ${name} - dependencies ${dependencies} - definition ${definition}`);
    }

    processDefinition(name, dependencies, definition, define.__state__);
}

namespace define {
    type dict<T> = { [key: string]: T };

    export type state = {
        inverseDependencyMap: dict<dict<void>>,
        modules: dict<any>,
        trackers: dict<Function>
    };

    // The state is kept as a property of the top-level define function to
    // ensure it's available at the same time the function is and to avoid
    // polluting the global scope.    
    export let __state__: define.state = { inverseDependencyMap: {}, modules: {}, trackers: {} };
}