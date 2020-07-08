"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var matrix_test_js_1 = require("./matrix.test.js");
var perceptron_test_js_1 = require("./perceptron.test.js");
var aux_test_js_1 = require("./aux.test.js");
var neuralnetwork_test_js_1 = require("./neuralnetwork.test.js");
function runAllTests() {
    aux_test_js_1.runAuxTests();
    matrix_test_js_1.runMatrixTests();
    perceptron_test_js_1.runPerceptronTests();
    neuralnetwork_test_js_1.runNeuralNetworkTests();
    console.log("\n\n\n%cFINISHED TESTS\n", "color:#32e402");
}
runAllTests();
//# sourceMappingURL=app.test.js.map