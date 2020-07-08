"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Perceptron = /** @class */ (function () {
    function Perceptron(inputNumber, learningRate, activation) {
        this.numInputs = inputNumber;
        this.weights = [];
        this.activation = activation;
        this.learningRate = learningRate;
    }
    Perceptron.prototype.setRandomWeights = function (min, max) {
        var diff = max - min;
        for (var i = 0; i < this.numInputs; i++) {
            this.weights[i] = (Math.random() * diff + min);
        }
    };
    Perceptron.prototype.setWeights = function (weights) {
        this.weights = weights.map(function (v) { return v; });
    };
    Perceptron.prototype.feedForward = function (inputs) {
        var sum = this.wheightedSum(inputs);
        return this.activation(sum);
    };
    Perceptron.prototype.wheightedSum = function (inputs) {
        var _this = this;
        return inputs.reduce(function (acc, cur, i) { return acc + cur * _this.weights[i]; }, 0);
    };
    Perceptron.prototype.train = function (inputs, target) {
        var _this = this;
        var guess = this.feedForward(inputs);
        var error = target - guess;
        var newWeights = this.weights.map(function (w, i) { return w + error * inputs[i] * _this.learningRate; });
        this.setWeights(newWeights);
        return guess;
    };
    return Perceptron;
}());
exports.default = Perceptron;
//# sourceMappingURL=perceptron.js.map