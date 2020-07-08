"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertLesserThan = exports.assertGreaterThan = exports.assertNumNotEquals = exports.assertArrayEquals = exports.assertNumEquals = exports.assertMatrixEquals = exports.assertTrue = exports.assertFalse = exports.fail = void 0;
var ASSERT_FALSE_DEFAULT_MESSAGE = "sHOUld Be fALsE";
var ASSERT_TRUE_DEFAULT_MESSAGE = "SHoULd Be TRuE";
function fail(message) {
    throw message;
}
exports.fail = fail;
function assertFalse(bool, msg) {
    if (bool)
        throw "assertFalse failed: " + (msg || ASSERT_FALSE_DEFAULT_MESSAGE);
}
exports.assertFalse = assertFalse;
function assertTrue(bool, msg) {
    if (!bool)
        throw "assertTrue failed: " + (msg || ASSERT_TRUE_DEFAULT_MESSAGE);
}
exports.assertTrue = assertTrue;
function assertMatrixEquals(expected, result) {
    if (!expected.equals(result))
        throw "Matrices were not equal -> \n " + expected.print("Expected") + ", " + result.print("Result");
}
exports.assertMatrixEquals = assertMatrixEquals;
function assertNumEquals(expected, result) {
    if (expected !== result)
        throw "assertNumEquals failed - Numbers were not the same: " + expected + " !== " + result;
}
exports.assertNumEquals = assertNumEquals;
function assertArrayEquals(expected, result) {
    if (expected.length !== result.length)
        throw "assertArrayEquals failed: arrays were different lengths \n expected.length -> " + expected.length + " | result.length-> " + result.length;
    for (var i = 0; i < expected.length; i++) {
        if (expected[i] !== result[i]) {
            throw "Arrays differed: expected[" + i + "]->" + expected[i] + " | result[" + i + "] -> " + result[i];
        }
    }
}
exports.assertArrayEquals = assertArrayEquals;
function assertNumNotEquals(expected, result) {
    if (expected !== result)
        throw "assertNumNotEquals failed - Numbers were the same: " + expected + " === " + result;
}
exports.assertNumNotEquals = assertNumNotEquals;
function assertGreaterThan(num, min) {
    if (num <= min)
        throw "assertGreaterThan failed: " + num + " <= " + min;
}
exports.assertGreaterThan = assertGreaterThan;
function assertLesserThan(num, min) {
    if (num >= min)
        throw "assertLesserThan failed: " + num + " >= " + min;
}
exports.assertLesserThan = assertLesserThan;
//# sourceMappingURL=assertions.js.map