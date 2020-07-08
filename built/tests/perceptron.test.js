"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPerceptronTests = void 0;
var assertions_js_1 = require("./assertions.js");
var perceptron_js_1 = require("../perceptron.js");
var aux_js_1 = require("../aux.js");
var LEARNING_RATE = 0.3;
function runPerceptronTests() {
    console.log("\n%cPERCEPTRON TESTS\n", "color:#f3c131");
    testWeightedSum();
    testSetRandomWeights();
    testFeedForward();
    testTrain();
}
exports.runPerceptronTests = runPerceptronTests;
function testTrain() {
}
function testWeightedSum() {
    console.log("\n\tTest weightedSum");
    var inputs = [1, 4, 2, 1];
    var weights = [0.3, 0.6, 0.8, 1.3];
    var p = new perceptron_js_1.default(inputs.length, LEARNING_RATE, aux_js_1.sigmoid);
    p.setWeights(weights);
    var result = p.wheightedSum(inputs);
    var expected = 1 * 0.3 + 4 * 0.6 + 2 * 0.8 + 1 * 1.3;
    assertions_js_1.assertNumEquals(expected, result);
    inputs = [0.3, 0.1, 70];
    weights = [1, 3, 2];
    p.setWeights(weights);
    result = p.wheightedSum(inputs); //obtained result
    expected = inputs.reduce(function (acc, cur, i) { return acc + cur * weights[i]; }, 0); //expected result
    assertions_js_1.assertNumEquals(expected, result);
}
function testFeedForward() {
    console.log("\n\tTest feedForward");
    var inputs = [100, 200];
    var weights = [-3, 1.8];
    var p = new perceptron_js_1.default(inputs.length, LEARNING_RATE, aux_js_1.pointLabellingActivation);
    p.setWeights(weights);
    var expected = 1;
    var result = p.feedForward(inputs);
    assertions_js_1.assertNumEquals(expected, result);
    inputs = [10, -500];
    weights = [0.8, 0.3];
    p.setWeights(weights);
    expected = -1;
    result = p.feedForward(inputs);
    assertions_js_1.assertNumEquals(expected, result);
    inputs = [0, -3];
    weights = [120, 0.2];
    expected = -1;
    p.setWeights(weights),
        result = p.feedForward(inputs);
    assertions_js_1.assertNumEquals(expected, result);
}
function testSetRandomWeights() {
    var lowLim = -3;
    var hiLim = 2;
    var perceptron = new perceptron_js_1.default(2, LEARNING_RATE, aux_js_1.sigmoid);
    for (var i = 0; i < 1000; i++) {
        perceptron.setRandomWeights(lowLim, hiLim);
        assertions_js_1.assertGreaterThan(perceptron.weights[0], lowLim);
        assertions_js_1.assertLesserThan(perceptron.weights[0], hiLim);
        assertions_js_1.assertGreaterThan(perceptron.weights[1], lowLim);
        assertions_js_1.assertLesserThan(perceptron.weights[1], hiLim);
    }
}
//# sourceMappingURL=perceptron.test.js.map