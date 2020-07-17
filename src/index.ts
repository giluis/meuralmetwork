import NeuralNetwork from "./neuralnetwork.js";
import Matrix from "./matrix.js";
function create(...layerSizes: number[]): NeuralNetwork{
    return new NeuralNetwork(...layerSizes);
}

function fromJsonString(str:string):NeuralNetwork{
    let json = JSON.parse(str);
    
    let nn = new NeuralNetwork(...json.layerSizes);
    nn.setWeights(json.weights.map(w => Matrix.load(w)));
    nn.setBiases(json.setBiases.map(b => Matrix.fromArray(b)));
    return nn;
}
export {
    fromJsonString,
    create
};