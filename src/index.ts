import NeuralNetwork from "./neuralnetwork";

let obj = {
    create: function(...layerSizes: number[]){
        return new NeuralNetwork(...layerSizes);
    }
}

export default obj;