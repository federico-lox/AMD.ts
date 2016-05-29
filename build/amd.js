var AMD;
(function (AMD) {
    var ts;
    (function (ts) {
        var inverseDependencyMap = {}, modules = {}, initializers = {};
        function require(dependencies, definition) {
            if (isVoid(dependencies) || isVoid(definition)) {
                throw new Error("require - missing or null parameters: dependencies " + dependencies + " - definition " + definition);
            }
            else {
                processDefinition("require-" + Date.now() + "." + Math.random(), dependencies, definition);
            }
        }
        ts.require = require;
        function define(name, dependencies, definition) {
            if (isVoid(name) || isVoid(dependencies) || isVoid(definition)) {
                throw new Error("define - missing or null parameters: name " + name + " - dependencies " + dependencies + " - definition " + definition);
            }
            else {
                processDefinition(name, dependencies, definition);
            }
        }
        ts.define = define;
        function isVoid(value) {
            return value == null;
        }
        function processDefinition(name, dependencies, definition) {
            var deps = (dependencies.length > 0 && dependencies[0] === "require" && dependencies[1] === "exports") ?
                (dependencies.slice(2)) : dependencies;
            if (deps.length === 0)
                modules[name] = resolve(name, [], definition);
            else {
                if (!(name in initializers)) {
                    initializers[name] = initializer.bind(null, name, deps, definition);
                }
                deps.forEach(function (dependency) {
                    if (!(dependency in inverseDependencyMap))
                        inverseDependencyMap[dependency] = {};
                    inverseDependencyMap[dependency][name] = null;
                    processDependencies(dependency);
                });
            }
        }
        function initializer(name, dependencies, definition) {
            if (dependencies.filter(function (dependency) { return !(dependency in modules); }).length === 0) {
                modules[name] = resolve(name, dependencies.map(function (dependency) { return modules[dependency]; }), definition);
                processDependencies(name);
                initializers[name] = null;
            }
        }
        function resolve(name, dependencies, definition) {
            var exported = {}, returned = definition.apply(null, (definition.length === dependencies.length + 2) ?
                [require, exported].concat(dependencies) : dependencies);
            return Object.keys(exported).length === 0 ? returned : exported;
        }
        function processDependencies(name) {
            if (name in inverseDependencyMap) {
                Object.keys(inverseDependencyMap[name]).forEach(function (parent) {
                    if (!isVoid(initializers[parent]))
                        initializers[parent]();
                });
            }
        }
    })(ts = AMD.ts || (AMD.ts = {}));
})(AMD || (AMD = {}));
var require = AMD.ts.require, define = AMD.ts.define;
