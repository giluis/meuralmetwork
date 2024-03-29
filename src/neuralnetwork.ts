import { Matrix,matrix} from "./deps.ts";
import { sigmoid, maxIndex } from "./utilitary.ts";

export default class NeuralNetwork {
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
        this.layers = [] as Matrix[];
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
        let deltas = this.calculateDeltas(inputsArr,expectedArr);
        deltas.weights.forEach((wm,i)=>{
            this.weights[i].add(wm);
        })
        deltas.biases.forEach((bm,i)=>{
            this.biases[i].add(bm);
        })

    }

    calculateDeltas(inputsArr: number[],expectedArr:number[]):WaBData{
        let gradients: Matrix;
        let layerWeightDeltas: Matrix;
        let layerBiasDeltas: Matrix;
        let currentLayerTransposed: Matrix;
        let outputs = Matrix.fromArray(this.feedForward(inputsArr));
        let expected = Matrix.fromArray(expectedArr);
        let error = expected.sub(outputs);
        let weightDeltas = [];
        let biasesDeltas = [];
        for (let layerIndex = this.numLayers - 2; layerIndex >= 0; layerIndex--) {//from the penultimate to the second layer (all layers excluding inputs and outputs)
            gradients = (this.layers[layerIndex + 1]).map(v => v * (1- v));//nextLayer*(1-nextLayer)
            gradients = gradients.hadamard(error);
            gradients = gradients.multScalar(this.learningRate);
            //transpose current layer for calculation
            currentLayerTransposed = this.layers[layerIndex].transpose();
            //calculate weight and bias deltas
            layerWeightDeltas = gradients.mult(currentLayerTransposed);
            layerBiasDeltas = gradients;

            // layerWeightDeltas.print(`layer ${layerIndex} weight deltas`);
            // layerBiasDeltas.print(`layer ${layerIndex} bias deltas`);

            // if(layerIndex === 1)
            //     layerWeightDeltas.print("Inside train weight deltas " + layerIndex);

            //calculate error for next iteration
            error = this.weights[layerIndex].transpose().mult(error);

            //adjust the weights
            weightDeltas[layerIndex] = layerWeightDeltas;
            //adjust the biases (difference is just the bias)
            biasesDeltas[layerIndex] = layerBiasDeltas;

        }

        return {
            weights: weightDeltas,
            biases:biasesDeltas
        }
    }

    trainInBatch(trainingInstances: TrainingInstance[], batchSize: number): void {
        let avgDeltas: WaBData = this.getZeroedWaB();
        let count = 0;
        let current: WaBData;

        if(batchSize === 0)
            return;

        trainingInstances.forEach((ti)=>{
            count++;
            current = this.calculateDeltas(ti.input,ti.output);
            for(let j = 0; j < current.weights.length;j++){
                avgDeltas.weights[j].add(current.weights[j]);
                avgDeltas.biases[j].add(current.biases[j]);
            }

            if(count === batchSize){

                avgDeltas.weights = avgDeltas.weights.map(w=>{
                    return w.multScalar(1/batchSize);
                })
                avgDeltas.biases = avgDeltas.biases.map(w=>{
                    return w.multScalar(1/batchSize);
                })

                this.adjustWeightsAndBiases(avgDeltas);
                avgDeltas = this.getZeroedWaB();
                count = 0;
            }
        })

    }



    adjustWeightsAndBiases(data:WaBData):void{
        for(let i = 0; i < data.weights.length;i++){
            this.weights[i].add(data.weights[i]);
            this.biases[i].add(data.biases[i]);
        }
    }

    /**
     * Returns a WaBData with all the weights set to zero
     */
    getZeroedWaB():WaBData {
        return {
            weights: this.weights.map(w=>w.map(()=>0)),
            biases: this.biases.map(b=>b.map(()=>0)),
        }
    }

    /**
     * Calculates accuracy of neural network (num correct/total)
     * @param examples
     */
    calcAccuracy(examples: TrainingInstance[]): number {
        let numCorrect = examples.reduce((acc: number, cur: TrainingInstance) => {
            let guess = this.feedForward(cur.input);
            if (maxIndex(guess) === maxIndex(cur.output)) {
                return acc + 1;
            }
            return acc;
        }, 0)

        return numCorrect / examples.length;
    }



    /**
     * Implements feed forward algorythm
     * @param inputs inputs to feed to the nn
     */
    feedForward(inputsArr: number[]): number[] {
        let inputs = Matrix.fromArray(inputsArr);
        if (!this.areInputsValid(inputs))
            throw "shit inputs"
        let layer = inputs;

        //this.numLayers -1 = numTransformations
        let i = 0;
        for (; i < this.numLayers - 1; i++) {
            this.setLayer(i, layer);
            layer = this.weights[i].mult(layer);
            layer = layer.add(this.biases[i]);
            layer = layer.map(this.activation);
        }
        this.setLayer(i, layer);
        return (layer.toArray() as number[]);
    }

    setLayer(index: number, values: Matrix): void {
        this.layers[index] = values.clone();
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

    toJsonString(): string {
        let data = {
            weights: this.weights.map(w =>w.toArray()),
            biases: this.biases.map(b =>b.toArray()),
            layerSizes: this.layerSizes.map(s => s)
        }
        return JSON.stringify(data);
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

    static fromJsonString(str: string): NeuralNetwork {
        let json = JSON.parse(str);
        console.log(json);
        let nn = new NeuralNetwork(...json.layerSizes);

        nn.setWeights(json.weights.map((w:number[][]) => matrix(w)));
        nn.setBiases(json.biases.map(( b:number[] ) => matrix(b)));//this is an array;
        return nn;
    }

    /**
     * @returns true if other is NeuralNetowkr with same numLayers, weights and biases, false otherwise
     */
    equals(other: any): boolean {
        if (!(other instanceof NeuralNetwork))
            return false;

        let othernn = <NeuralNetwork>other;
        if (this.numLayers !== othernn.numLayers)
            return false;

        for (let i = 0; i < this.numLayers - 1; i++) {//numWeights == numLayers -1;
            //if any of weight or biases matrices is different, return false
            if (!(this.weights[i].equals(othernn.weights[i]) && this.biases[i].equals(othernn.biases[i])))
                return false;
        }
        return true;

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

export interface TrainingInstance {
    input: number[],
    output: number[]
}

const NN_PRINT_HEADER =  "\n\n\n==== neural net  ===="



export function printNeuralNetwork(nn:NeuralNetwork):void{
    console.log(NN_PRINT_HEADER);
    for (let i = 0; i < nn.numLayers - 1; i++) {
        console.log(`\n\t\n--- Layer ${i} ---`);
        console.log("\t\t\tWeights");
        console.log( nn.weights[i] );
        console.log("\t\t\tBiases");
        console.log( nn.biases[i] );
    }
}
