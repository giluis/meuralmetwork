import {runMatrixTests} from "./matrix.test.js";
import {runUtilitaryTests} from "./utilitary.test.js"
import {runNeuralNetworkTests} from "./neuralnetwork.test.js";
function runAllTests(){
    runUtilitaryTests();
    runMatrixTests();
    runNeuralNetworkTests();
    console.log("\n\n\n%cFINISHED TESTS\n","color:#32e402");
}

runAllTests();
