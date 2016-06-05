function require(dependencies, definition) {
    define("require." + Date.now() + "." + Math.random(), dependencies, definition);
}
function define(name, dependencies, definition) {
    function processDefinition(name, dependencies, definition, state) {
        var deps = (dependencies.length > 0 && dependencies[0] === "require" && dependencies[1] === "exports") ?
            (dependencies.slice(2)) : dependencies;
        if (deps.length === 0) {
            state.modules[name] = resolve(name, [], definition);
            processUpstreamDependencies(name, state);
        }
        else {
            if (!(name in state.trackers)) {
                state.trackers[name] = track.bind(null, name, deps, definition, state);
            }
            deps.forEach(function (dependency) {
                if (!(dependency in state.inverseDependencyMap))
                    state.inverseDependencyMap[dependency] = {};
                state.inverseDependencyMap[dependency][name] = null;
                processUpstreamDependencies(dependency, state);
            });
        }
    }
    function track(name, dependencies, definition, state) {
        if (dependencies.filter(function (dependency) { return !(dependency in state.modules); }).length === 0) {
            state.modules[name] = resolve(name, dependencies.map(function (dependency) { return state.modules[dependency]; }), definition);
            processUpstreamDependencies(name, state);
            state.trackers[name] = null;
        }
    }
    function processUpstreamDependencies(name, state) {
        if (name in state.inverseDependencyMap) {
            Object.keys(state.inverseDependencyMap[name]).forEach(function (parent) {
                if (state.trackers[parent] != null)
                    state.trackers[parent]();
            });
        }
    }
    function resolve(name, dependencies, definition) {
        var exported = {}, returned = definition.apply(null, (definition.length === dependencies.length + 2) ?
            [require, exported].concat(dependencies) : dependencies);
        return Object.keys(exported).length === 0 ? returned : exported;
    }
    if (name == null || dependencies == null || definition == null) {
        throw new Error("Missing or wrong parameters for module definition: name " + name + " - dependencies " + dependencies + " - definition " + definition);
    }
    var def = define;
    if (def.__state__ == null)
        def.__state__ = { inverseDependencyMap: {}, modules: {}, trackers: {} };
    processDefinition(name, dependencies, definition, def.__state__);
}
