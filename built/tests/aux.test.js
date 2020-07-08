"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAuxTests = void 0;
var assertions_js_1 = require("./assertions.js");
var aux_js_1 = require("../aux.js");
var constants_js_1 = require("../constants.js");
function runAuxTests() {
    console.log("\n%cAUX TESTS\n", "color:#f3c131");
    testSigmoid();
    testPointLabellingActivation();
    testTruncate();
}
exports.runAuxTests = runAuxTests;
function testTruncate() {
    console.log("\n\tTest truncate");
    var numDecimalPlaces = 2;
    var num = 0.215748372;
    var expected = 0.21;
    var result = aux_js_1.truncate(num, numDecimalPlaces);
    assertions_js_1.assertNumEquals(expected, result);
    numDecimalPlaces = 4;
    num = 3.141592;
    expected = 3.1415;
    result = aux_js_1.truncate(num, numDecimalPlaces);
    assertions_js_1.assertNumEquals(expected, result);
}
function testSigmoid() {
    console.log("\n\tTest sigmoid");
    var num = 0;
    var expected = 0.5;
    var result = aux_js_1.sigmoid(num);
    assertions_js_1.assertNumEquals(expected, result);
    num = -3;
    expected = 1 / (1 + Math.exp(constants_js_1.SIGMOID_FLATTENER * (-num)));
    result = aux_js_1.sigmoid(num);
    assertions_js_1.assertNumEquals(expected, result);
}
function testPointLabellingActivation() {
    console.log("\n\tTest pointLabellingActivation");
    // let expected = -1;
    // let num = -123;
    // let result = p.activation(num);
    // assertNumEquals(expected,result);
    // expected = 1;
    // num = 123,
    // result = p.activation(num);
    // assertNumEquals(expected,result);
    var num = -3;
    var expected = -1;
    var result = aux_js_1.pointLabellingActivation(num);
    assertions_js_1.assertNumEquals(expected, result);
}
//# sourceMappingURL=aux.test.js.map