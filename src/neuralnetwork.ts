import Matrix from "./matrix.js";
import { sigmoid } from "./aux.js";
export default class NeuralNetwork {
    static PRINT_HEADER: string = "\n\n\n==== neural net  ===="
    numLayers: number;
    layerSizes: number[];
    activation: (x: number) => number;
    weights: Matrix[];
    biases: Matrix[];
    learningRate: number;
    layers: Matrix[];
    constructor(...layerSizes: number[]) {
        this.numLayers = layerSizes.length;
        this.layerSizes = layerSizes;
        this.layers = [];
        this.activation = sigmoid;//hardcoded for simplicity
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

    train(inputsArr: number[], expectedArr: number[]): void {
        let outputs = this.feedForward(inputsArr);
        let expected = Matrix.fromArray(expectedArr);
        let error = Matrix.sub(expected, outputs);
        let gradients: Matrix;
        let layerWeightDeltas: Matrix;
        let layerBiasDeltas: Matrix;
        let currentLayerTransposed: Matrix;
        for (let layerIndex = this.numLayers - 2; layerIndex >= 0; layerIndex--) {//from the penultimate to the second layer (all layers excluding inputs and outputs)
            gradients = Matrix.map(this.layers[layerIndex + 1], v => v * (1 - v));//nextLayer*(1-nextLayer)
            gradients = Matrix.hadamard(gradients, error);
            gradients = Matrix.multScalar(gradients, this.learningRate);
            //transpose current layer for calculation
            currentLayerTransposed = Matrix.transpose(this.layers[layerIndex]);
            //calculate weight and bias deltas
            layerWeightDeltas = Matrix.mult(gradients, currentLayerTransposed);
            layerBiasDeltas = gradients;

            //adjust the weights
            this.weights[layerIndex] = Matrix.add(this.weights[layerIndex], layerWeightDeltas);
            //adjust the biases (difference is just the bias)
            this.biases[layerIndex] = Matrix.add(this.biases[layerIndex], layerBiasDeltas);

            //calculate error for next iteration
            error = Matrix.mult(Matrix.transpose(this.weights[layerIndex]), error);

        }
    }


    /**
     * 
     * @param guess Matriz que representa o guess da NN
     * @param expected  Matriz que representa o resultado esperado
     * @param layerIndex Indíce da camada da qual <em>partem</em> as ligações que estão a ser alteradas
     */

    calcWeightDeltas(guess: Matrix, expected: Matrix, layer: Matrix, learningRate: number): Matrix {
        debugger;
        let error_output = Matrix.sub(expected, guess);
        let transposed = Matrix.transpose(layer);
        return Matrix.mult(
            Matrix.map(
                Matrix.mult(
                    error_output,
                    Matrix.map(guess, (v) => v * (1 - v))
                ),
                (v) => v * learningRate
            )
            , transposed
        );
    }



    /**
     * Implements feed forward algorythm
     * @param inputs inputs to feed to the nn
     */
    feedForward(inputsArr: number[]): Matrix {
        let inputs = Matrix.fromArray(inputsArr);
        if (!this.areInputsValid(inputs))
            throw "shit inputs"
        let layer = inputs;

        //this.numLayers -1 = numTransformations
        let i = 0;
        for (; i < this.numLayers - 1; i++) {
            this.setLayer(i, layer);
            layer = Matrix.mult(this.weights[i], layer);
            layer = Matrix.add(layer, this.biases[i]);
            layer = Matrix.map(layer, this.activation);
        }
        this.setLayer(i, layer);
        return layer;

    }

    setLayer(index: number, values: Matrix): void {
        this.layers[index] = values.clone();
    }


    /**
     * Prompts weights and biases
     */
    prompt() {
        console.table(this.weights)
        for (let i = 0; i < this.numLayers; i++) {
            this.weights[i] = Matrix.prompt(this.layerSizes[i], this.layerSizes[i + 1]);
            this.biases[i] = Matrix.prompt(this.layerSizes[i], 1);
        }

    }

    /**
     * Sets weights at random
     */
    randomize() {
        for (let i = 0; i < this.numLayers - 1; i++) {
            this.weights[i] = Matrix.random(this.layerSizes[i + 1], this.layerSizes[i]);
            this.biases[i] = Matrix.random(this.layerSizes[i + 1], 1);
        }
    }


    /**
     * Prints the weights and Biases
     */
    print() {
        console.log(NeuralNetwork.PRINT_HEADER);
        for (let i = 0; i < this.numLayers - 1; i++) {
            console.log(`\n\t\n--- Layer ${i} ---`);
            this.weights[i].print("\t\t\tWeights");
            this.biases[i].print("\t\t\tBiases");
        }
    }



    /**
     *
     * @param inputs inputs to validate
     */
    areInputsValid(inputs: Matrix): boolean {
        return (inputs && (inputs.numRows === this.weights[0].numCols));
    }


    /**
     * Defines weights in array as weighs in NN :=EJ"#=E)
     * @param weightArr
     */
    setWeights(weightArr: Matrix[]): void {
        weightArr.forEach((w, i) => {
            if (!this.validateWeights(w, i)) {
                throw "Invalid Weight";
            }
        })
        this.weights = weightArr.map(weights => weights);
    }

    /**
     * set biases
     * @param biasArr array of biases to set
     */
    setBiases(biasArr: Matrix[]): void {
        biasArr.forEach((b, i) => {
            if (!this.validateBiases(b, i)) {
                throw "Invalid Bias";
            }
        })
        this.biases = biasArr.map(biases => biases);
    }

    /**
     *
     * @param data WeightsAndBiasesData
     */
    set(data: WaBData): void {
        this.setWeights(data.weights);
        this.setBiases(data.biases)
    }

    /**
     * Validates the biases respective to a transformation
     * @param biases to be validated
     * @param transformationIndex index of the transformation
     */
    validateBiases(biases: Matrix, transformationIndex: number) {
        if (transformationIndex < 0 || transformationIndex > this.numLayers - 2) {
            return false;

        }
        return biases.numRows === this.layerSizes[transformationIndex + 1];
    }

    /**
     * Validates weights for layer <layerIndex>
     * @param weights
     * @param layerIndex
     */
    validateWeights(weights: Matrix, layerIndex: number): boolean {
        if (layerIndex < 0 || layerIndex >= this.numLayers) {
            return false;
        }

        if (weights.numRows != this.layerSizes[layerIndex + 1]) {
            return false;
        };
        return weights.numCols == this.layerSizes[layerIndex];
    }
}

/**
 * Data about weights and biases
 */
export interface WaBData {
    weights: Matrix[],
    biases: Matrix[],
}