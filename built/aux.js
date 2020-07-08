"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncate = exports.plot = exports.pointLabellingActivation = exports.sigmoid = exports.pickRandom = void 0;
var constants_js_1 = require("./constants.js");
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
exports.pickRandom = pickRandom;
function sigmoid(x) {
    return 1 / (1 + Math.exp(constants_js_1.SIGMOID_FLATTENER * (-x)));
}
exports.sigmoid = sigmoid;
function pointLabellingActivation(x) {
    return x > 0 ? 1 : -1;
}
exports.pointLabellingActivation = pointLabellingActivation;
function plot(fn) {
    for (var i = 0; i < 100; i++) {
        console.log("f(" + i + ")=" + fn(i));
    }
}
exports.plot = plot;
function truncate(number, numDecPlaces) {
    if (!numDecPlaces)
        return number;
    if (numDecPlaces < 0)
        throw "Cannot truncate with negative decimal places";
    if (!isNumInteger(numDecPlaces))
        throw "number of decimal places must be a decimal number";
    var numstring = "" + number;
    numstring = numstring.substring(0, numDecPlaces + 2); //add two for the zero and the dot
    return Number(numstring);
}
exports.truncate = truncate;
function isNumInteger(num) {
    return Math.floor(num) === num;
}
//# sourceMappingURL=aux.js.map