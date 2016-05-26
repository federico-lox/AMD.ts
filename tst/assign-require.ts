declare const require: Function;
import test = require('./assign-export');

function validate(): boolean {
    return test() === true;
}

export {validate as test};