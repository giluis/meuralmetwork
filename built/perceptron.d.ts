export default class Perceptron {
    numInputs: number;
    learningRate: number;
    activation: (num: number) => number;
    weights: number[];
    constructor(inputNumber: number, learningRate: number, activation: (n: number) => number);
    setRandomWeights(min: number, max: number): void;
    setWeights(weights: number[]): void;
    feedForward(inputs: number[]): number;
    wheightedSum(inputs: number[]): number;
    train(inputs: number[], target: number): number;
}
