import NeuralNetwork from "./neuralnetwork.js";

function create(...layerSizes: number[]){
    return new NeuralNetwork(...layerSizes);
}
export {
    create
};