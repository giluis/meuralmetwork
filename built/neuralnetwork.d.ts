import Matrix from "./matrix.js";
export default class NeuralNetwork {
    static PRINT_HEADER: string;
    numLayers: number;
    layerSizes: number[];
    activation: (x: number) => number;
    weights: Matrix[];
    biases: Matrix[];
    learningRate: number;
    layers: Matrix[];
    constructor(...layerSizes: number[]);
    /**
     * Runs inputs through network. Adjusts weights and biases
     * according to backprogagation logic
     * @param inputs inputs to train on
     * @param expected expected output
     */
    train(inputsArr: number[], expectedArr: number[]): void;
    /**
     *
     * @param guess Matriz que representa o guess da NN
     * @param expected  Matriz que representa o resultado esperado
     * @param layerIndex Indíce da camada da qual <em>partem</em> as ligações que estão a ser alteradas
     */
    calcWeightDeltas(guess: Matrix, expected: Matrix, layer: Matrix, learningRate: number): Matrix;
    /**
     * Implements feed forward algorythm
     * @param inputs inputs to feed to the nn
     */
    feedForward(inputsArr: number[]): Matrix;
    setLayer(index: number, values: Matrix): void;
    /**
     * Prompts weights and biases
     */
    prompt(): void;
    /**
     * Sets weights at random
     */
    randomize(): void;
    /**
     * Prints the weights and Biases
     */
    print(): void;
    /**
     *
     * @param inputs inputs to validate
     */
    areInputsValid(inputs: Matrix): boolean;
    /**
     * Defines weights in array as weighs in NN :=EJ"#=E)
     * @param weightArr
     */
    setWeights(weightArr: Matrix[]): void;
    /**
     * set biases
     * @param biasArr array of biases to set
     */
    setBiases(biasArr: Matrix[]): void;
    /**
     *
     * @param data WeightsAndBiasesData
     */
    set(data: WaBData): void;
    /**
     * Validates the biases respective to a transformation
     * @param biases to be validated
     * @param transformationIndex index of the transformation
     */
    validateBiases(biases: Matrix, transformationIndex: number): boolean;
    /**
     * Validates weights for layer <layerIndex>
     * @param weights
     * @param layerIndex
     */
    validateWeights(weights: Matrix, layerIndex: number): boolean;
}
/**
 * Data about weights and biases
 */
export interface WaBData {
    weights: Matrix[];
    biases: Matrix[];
}
