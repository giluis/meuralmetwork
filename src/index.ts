import NeuralNetwork from "./neuralnetwork.js";

function create(...layerSizes: number[]): NeuralNetwork{
    return new NeuralNetwork(...layerSizes);
}

function fromJsonString(str:string):NeuralNetwork{
    return NeuralNetwork.fromJsonString(str);
}

export {https://registry.npmjs.org/meuralmetwork
    fromJsonString,
    create,
};