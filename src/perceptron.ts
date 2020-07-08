import Matrix from "./matrix.js"
export default class Perceptron {
    numInputs: number;
    learningRate: number;
    activation: (num:number)=>number;
    weights: number[];
    constructor(inputNumber: number, learningRate: number, activation: (n:number)=>number) {
        this.numInputs = inputNumber;
        this.weights = [];
        this.activation = activation;
        this.learningRate = learningRate;
    }

    setRandomWeights(min: number, max:number):void {
        let diff = max - min;
        for (let i = 0; i < this.numInputs; i++) {
            this.weights[i] = (Math.random() * diff + min);
        }
    }

    setWeights(weights:number[]):void {
        this.weights = weights.map(v => v);
    }

    feedForward(inputs:number[]):number {
        let sum = this.wheightedSum(inputs);
        return this.activation(sum);
    }

    wheightedSum(inputs: number[]):number {
        return inputs.reduce((acc, cur, i) => acc + cur * this.weights[i], 0)
    }

    train(inputs: number[], target: number): number {
        let guess = this.feedForward(inputs);
        let error = target - guess;
        let newWeights = this.weights.map((w, i) => w + error * inputs[i] * this.learningRate);
        this.setWeights(newWeights);
        return guess;
    }
    
}
