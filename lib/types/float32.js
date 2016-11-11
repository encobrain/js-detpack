/**
 * Created by encobrain on 11.11.16.
 */

var BaseType = require('../base').Type,
    UintType = require('./uint').Type,

    uint = new UintType()
    ;

function Float32Type () {
    BaseType.call(this);
}

function encode (number, buffer) {
    if (!buffer) buffer = this.getBuffer(number);

    buffer.offset = buffer.writeFloatLE(+number, buffer.offset, true);

    return buffer;
}

function encodeList (numbers, buffer) {
    if (!buffer) buffer = this.getBuffer(numbers);

    var k = 0, length = numbers.length;

    uint.encode(length, buffer);

    var i = buffer.offset;

    while (k < length) i = buffer.writeFloatLE(+numbers[k++], i, true);

    buffer.offset = i;

    return buffer;
}

function checkDefault (number, propDesc) {

}

function checkDefaultList (numbers, propDesc) {
    var length = numbers.length;

    if (length < this.listMin)
        throw new Error('Incorrect default. Required minimum ' + this.listMin + ' Float16 numbers in ' + propDesc);

    if (length > this.listMax)
        throw new Error('Incorrect default. Allow maximum ' + this.listMax + ' Float16 numbers in ' + propDesc);
}

function decode (buffer, inited) {
    if (!inited) this.initBuffer(buffer);

    var number = buffer.readFloatLE(buffer.offset, true);
    buffer.offset += 4;

    return number;
}

function decodeList (buffer, inited) {
    if (!inited) this.initBuffer(buffer);

    var length = uint.decode(buffer, 1),
        k = 0, numbers = new Array(length),
        i = buffer.index;

    while (k < length) {
        numbers[k++] = buffer.readFloatLE(i, true);
        i += 4;
    }

    buffer.offset = i;

    return numbers;
}

function encodedLength (number) {
    return 32;
}

function encodedLengthList (numbers) {
    return uint.encodedLength(numbers.length) + (numbers.length << 5);
}

function setOpts (opts) {
    throw new Error('Float16 type cant have options');
}

function setListOpts (opts, propDesc) {
    if (opts.length === 1) opts.unshift(0);

    var min = this.listMin = +opts[0];

    if (min != min || min < 0)
        throw new Error('Incorrect 1st list option in ' + propDesc);

    var max = opts[1];

    if (max != null) {
        if (max != max || max < min)
            throw new Error('Incorrect 2nd list option in ' + propDesc);
    }

    this.listMax = max || Number.MAX_VALUE;

    this.encode = encodeList;
    this.decode = decodeList;
    this.encodedLength = encodedLengthList;
    this.checkDefault = checkDefaultList;
}


Float32Type.prototype = new BaseType();
Float32Type.prototype.constructor = Float32Type;

Float32Type.prototype.listMin = null;
Float32Type.prototype.listMax = null;

Float32Type.prototype.encode = encode;
Float32Type.prototype.decode = decode;
Float32Type.prototype.encodedLength = encodedLength;

Float32Type.prototype.setOpts = setOpts;
Float32Type.prototype.setListOpts = setListOpts;
Float32Type.prototype.checkDefault = checkDefault;

module.exports = {
    Type: Float32Type
};