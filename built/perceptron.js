export default class Perceptron {
    constructor(inputNumber, learningRate, activation) {
        this.numInputs = inputNumber;
        this.weights = [];
        this.activation = activation;
        this.learningRate = learningRate;
    }
    setRandomWeights(min, max) {
        let diff = max - min;
        for (let i = 0; i < this.numInputs; i++) {
            this.weights[i] = (Math.random() * diff + min);
        }
    }
    setWeights(weights) {
        this.weights = weights.map(v => v);
    }
    feedForward(inputs) {
        let sum = this.wheightedSum(inputs);
        return this.activation(sum);
    }
    wheightedSum(inputs) {
        return inputs.reduce((acc, cur, i) => acc + cur * this.weights[i], 0);
    }
    train(inputs, target) {
        let guess = this.feedForward(inputs);
        let error = target - guess;
        let newWeights = this.weights.map((w, i) => w + error * inputs[i] * this.learningRate);
        this.setWeights(newWeights);
        return guess;
    }
}
//# sourceMappingURL=perceptron.js.map