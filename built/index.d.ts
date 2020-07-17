import NeuralNetwork from "./neuralnetwork.js";
declare function create(...layerSizes: number[]): NeuralNetwork;
declare function fromJsonString(str: string): NeuralNetwork;
export { fromJsonString, create };
