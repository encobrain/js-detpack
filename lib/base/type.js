/**
 * Created by Encobrain on 01.11.16.
 */

function BaseType () {
    this.propNames = [];
}

function isCorrectDefaultValue (value) {
    throw new Error('.isCorrectDefaultValue() is not defined');
}

function isCorrectOpts (opts) {
    throw new Error('.isCorrectOpts() is not defined');
}

BaseType.prototype.propNames = null;

BaseType.prototype.isCorrectDefaultValue = isCorrectDefaultValue;
BaseType.prototype.isCorrectOpts = isCorrectOpts;

BaseType.prototype.encode = encode;
BaseType.prototype.decode = decode;

module.exports = {
    Type: BaseType
};