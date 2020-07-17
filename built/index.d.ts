import NeuralNetwork from "./neuralnetwork.js";
declare let obj: {
    create: (...layerSizes: number[]) => NeuralNetwork;
};
export { obj };
