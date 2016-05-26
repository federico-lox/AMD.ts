declare var exports;

((context) => {
    function require() { }
    function define() { }

    context.require = require;
    context.define = define;
})(typeof exports !== 'undefined' ? exports : window);