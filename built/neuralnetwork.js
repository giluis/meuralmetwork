"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var matrix_js_1 = require("./matrix.js");
var aux_js_1 = require("./aux.js");
var NeuralNetwork = /** @class */ (function () {
    function NeuralNetwork() {
        var layerSizes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            layerSizes[_i] = arguments[_i];
        }
        this.numLayers = layerSizes.length;
        this.layerSizes = layerSizes;
        this.layers = [];
        this.activation = aux_js_1.sigmoid; //hardcoded for simplicity
        this.weights = [];
        this.biases = [];
        this.randomize();
        this.learningRate = 0.1;
    }
    /**
     * Runs inputs through network. Adjusts weights and biases
     * according to backprogagation logic
     * @param inputs inputs to train on
     * @param expected expected output
     */
    // train(inputs: Matrix, expected: Matrix):void{
    //     let output = this.feedForward(inputs);
    //     let error = Matrix.sub(expected,output);
    //     for(let i = this.numLayers-1-1; i >=0;i++){
    //         let layer_t = Matrix.transpose(this.layers[i]);
    //         this.weights[i] = Matrix.add(this.weights[i],deltaWeights);
    //         this.weights[i] = Matrix.add(this.weights[i],gradient);
    //     }
    // }
    NeuralNetwork.prototype.train = function (inputsArr, expectedArr) {
        var outputs = this.feedForward(inputsArr);
        var expected = matrix_js_1.default.fromArray(expectedArr);
        var error = matrix_js_1.default.sub(expected, outputs);
        var gradients;
        var layerWeightDeltas;
        var layerBiasDeltas;
        var currentLayerTransposed;
        for (var layerIndex = this.numLayers - 2; layerIndex >= 0; layerIndex--) { //from the penultimate to the second layer (all layers excluding inputs and outputs)
            gradients = matrix_js_1.default.map(this.layers[layerIndex + 1], function (v) { return v * (1 - v); }); //nextLayer*(1-nextLayer)
            gradients = matrix_js_1.default.hadamard(gradients, error);
            gradients = matrix_js_1.default.multScalar(gradients, this.learningRate);
            //transpose current layer for calculation
            currentLayerTransposed = matrix_js_1.default.transpose(this.layers[layerIndex]);
            //calculate weight and bias deltas
            layerWeightDeltas = matrix_js_1.default.mult(gradients, currentLayerTransposed);
            layerBiasDeltas = gradients;
            //adjust the weights
            this.weights[layerIndex] = matrix_js_1.default.add(this.weights[layerIndex], layerWeightDeltas);
            //adjust the biases (difference is just the bias)
            this.biases[layerIndex] = matrix_js_1.default.add(this.biases[layerIndex], layerBiasDeltas);
            //calculate error for next iteration
            error = matrix_js_1.default.mult(matrix_js_1.default.transpose(this.weights[layerIndex]), error);
        }
    };
    /**
     *
     * @param guess Matriz que representa o guess da NN
     * @param expected  Matriz que representa o resultado esperado
     * @param layerIndex Indíce da camada da qual <em>partem</em> as ligações que estão a ser alteradas
     */
    NeuralNetwork.prototype.calcWeightDeltas = function (guess, expected, layer, learningRate) {
        debugger;
        var error_output = matrix_js_1.default.sub(expected, guess);
        var transposed = matrix_js_1.default.transpose(layer);
        return matrix_js_1.default.mult(matrix_js_1.default.map(matrix_js_1.default.mult(error_output, matrix_js_1.default.map(guess, function (v) { return v * (1 - v); })), function (v) { return v * learningRate; }), transposed);
    };
    /**
     * Implements feed forward algorythm
     * @param inputs inputs to feed to the nn
     */
    NeuralNetwork.prototype.feedForward = function (inputsArr) {
        var inputs = matrix_js_1.default.fromArray(inputsArr);
        if (!this.areInputsValid(inputs))
            throw "shit inputs";
        var layer = inputs;
        //this.numLayers -1 = numTransformations
        var i = 0;
        for (; i < this.numLayers - 1; i++) {
            this.setLayer(i, layer);
            layer = matrix_js_1.default.mult(this.weights[i], layer);
            layer = matrix_js_1.default.add(layer, this.biases[i]);
            layer = matrix_js_1.default.map(layer, this.activation);
        }
        this.setLayer(i, layer);
        return layer;
    };
    NeuralNetwork.prototype.setLayer = function (index, values) {
        this.layers[index] = values.clone();
    };
    /**
     * Prompts weights and biases
     */
    NeuralNetwork.prototype.prompt = function () {
        console.table(this.weights);
        for (var i = 0; i < this.numLayers; i++) {
            this.weights[i] = matrix_js_1.default.prompt(this.layerSizes[i], this.layerSizes[i + 1]);
            this.biases[i] = matrix_js_1.default.prompt(this.layerSizes[i], 1);
        }
    };
    /**
     * Sets weights at random
     */
    NeuralNetwork.prototype.randomize = function () {
        for (var i = 0; i < this.numLayers - 1; i++) {
            this.weights[i] = matrix_js_1.default.random(this.layerSizes[i + 1], this.layerSizes[i]);
            this.biases[i] = matrix_js_1.default.random(this.layerSizes[i + 1], 1);
        }
    };
    /**
     * Prints the weights and Biases
     */
    NeuralNetwork.prototype.print = function () {
        console.log(NeuralNetwork.PRINT_HEADER);
        for (var i = 0; i < this.numLayers - 1; i++) {
            console.log("\n\t\n--- Layer " + i + " ---");
            this.weights[i].print("\t\t\tWeights");
            this.biases[i].print("\t\t\tBiases");
        }
    };
    /**
     *
     * @param inputs inputs to validate
     */
    NeuralNetwork.prototype.areInputsValid = function (inputs) {
        return (inputs && (inputs.numRows === this.weights[0].numCols));
    };
    /**
     * Defines weights in array as weighs in NN :=EJ"#=E)
     * @param weightArr
     */
    NeuralNetwork.prototype.setWeights = function (weightArr) {
        var _this = this;
        weightArr.forEach(function (w, i) {
            if (!_this.validateWeights(w, i)) {
                throw "Invalid Weight";
            }
        });
        this.weights = weightArr.map(function (weights) { return weights; });
    };
    /**
     * set biases
     * @param biasArr array of biases to set
     */
    NeuralNetwork.prototype.setBiases = function (biasArr) {
        var _this = this;
        biasArr.forEach(function (b, i) {
            if (!_this.validateBiases(b, i)) {
                throw "Invalid Bias";
            }
        });
        this.biases = biasArr.map(function (biases) { return biases; });
    };
    /**
     *
     * @param data WeightsAndBiasesData
     */
    NeuralNetwork.prototype.set = function (data) {
        this.setWeights(data.weights);
        this.setBiases(data.biases);
    };
    /**
     * Validates the biases respective to a transformation
     * @param biases to be validated
     * @param transformationIndex index of the transformation
     */
    NeuralNetwork.prototype.validateBiases = function (biases, transformationIndex) {
        if (transformationIndex < 0 || transformationIndex > this.numLayers - 2) {
            return false;
        }
        return biases.numRows === this.layerSizes[transformationIndex + 1];
    };
    /**
     * Validates weights for layer <layerIndex>
     * @param weights
     * @param layerIndex
     */
    NeuralNetwork.prototype.validateWeights = function (weights, layerIndex) {
        if (layerIndex < 0 || layerIndex >= this.numLayers) {
            return false;
        }
        if (weights.numRows != this.layerSizes[layerIndex + 1]) {
            return false;
        }
        ;
        return weights.numCols == this.layerSizes[layerIndex];
    };
    NeuralNetwork.PRINT_HEADER = "\n\n\n==== neural net  ====";
    return NeuralNetwork;
}());
exports.default = NeuralNetwork;
//# sourceMappingURL=neuralnetwork.js.map