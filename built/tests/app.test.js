import { runMatrixTests } from "./matrix.test.js";
import { runPerceptronTests } from "./perceptron.test.js";
import { runAuxTests } from "./aux.test.js";
import { runNeuralNetworkTests } from "./neuralnetwork.test.js";
function runAllTests() {
    runAuxTests();
    runPerceptronTests();
    runMatrixTests();
    runNeuralNetworkTests();
    console.log("\n\n\n%cFINISHED TESTS\n", "color:#32e402");
}
runAllTests();
//# sourceMappingURL=app.test.js.map