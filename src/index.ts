import NeuralNetwork from "./neuralnetwork";

let obj = {
    create: function(...layerSizes: number[]){
        return new NeuralNetwork(...layerSizes);
    }
}


let nn = obj.create(2,3,4);
console.log(nn);
export {obj};