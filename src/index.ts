import NeuralNetwork from "./neuralnetwork.js";

let obj = {
    create: function(...layerSizes: number[]){
        return new NeuralNetwork(...layerSizes);
    }
}


export {obj};