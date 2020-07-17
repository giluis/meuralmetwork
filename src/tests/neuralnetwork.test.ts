import NeuralNetwork from '../neuralnetwork.js';
import { WaBData } from '../neuralnetwork.js';
import Matrix from "../matrix.js";
import { sigmoid,pickRandom } from "../aux.js";
import { fail, assertMatrixEquals, assertFalse, assertTrue, assertArrayEquals, assertNumEquals } from "./assertions.js";
import * as _ from 'underscore';

export function runNeuralNetworkTests() {
    console.log("\n%cNEURAL NETWORK TESTS\n", "color:#f3c131");
    testConstrutor();
    testValidateWeights();
    testValidateBiases();
    testSetWeights();
    testFeedForward3Layers();
    testFeedForward4Layers();
    testRandomize();
    testSetLayer();
    testFeedForwardSetLayers();
    testTrainWithXor();
    testTrainWithAnd();
    testTrainWithXorMultipleLayers();

}

function testTrainWithXorMultipleLayers(){
    console.log("\n\tTest train with XOR and multiple layers");
    let nn = new NeuralNetwork(2,5,5,4,3,2,1);
    let trainingData = [
        {
            inputs:[0,0],
            expected: [0]
        },
        {
            inputs:[1,1],
            expected: [0]
        },
        {
            inputs:[0,1],
            expected: [1]
        },
        {
            inputs:[1,0],
            expected: [1]
        }
    ]

    for(let i = 0; i < 50000;i++){
        let sample = pickRandom(trainingData);
        nn.train(sample.inputs,sample.expected);
    }

    nn.feedForward([1,0]).print("1 XOR 0");
    nn.feedForward([0,0]).print("0 XOR 0");
    nn.feedForward([0,1]).print("0 XOR 1");
    nn.feedForward([1,1]).print("1 XOR 1");
}


function testTrainWithAnd(){
    console.log("\n\tTest train with and");
    let nn = new NeuralNetwork(2, 1, 1);
    let trainingData = [
        {
            inputs:[0,0],
            expected: [0]
        },
        {
            inputs:[1,1],
            expected: [1]
        },
        {
            inputs:[0,1],
            expected: [0]
        },
        {
            inputs:[1,0],
            expected: [0]
        }
    ]

    for(let i = 0; i < 50000;i++){
        let sample = pickRandom(trainingData);
        nn.train(sample.inputs,sample.expected);
    }

    nn.feedForward([1,0]).print("1 AND 0");
    nn.feedForward([0,0]).print("0 AND 0");
    nn.feedForward([0,1]).print("0 AND 1");
    nn.feedForward([1,1]).print("1 AND 1");
}

function testTrainWithXor() {
    console.log("\n\tTest train with XOR");
    let nn = new NeuralNetwork(2, 2, 1);
    let trainingData = [
        {
            inputs:[0,0],
            expected: [0]
        },
        {
            inputs:[1,1],
            expected: [0]
        },
        {
            inputs:[0,1],
            expected: [1]
        },
        {
            inputs:[1,0],
            expected: [1]
        }
    ]

    for(let i = 0; i < 50000;i++){
        let sample = pickRandom(trainingData);
        nn.train(sample.inputs,sample.expected);
    }

    nn.feedForward([1,0]).print("1 XOR 0");
    nn.feedForward([0,0]).print("0 XOR 0");
    nn.feedForward([0,1]).print("0 XOR 1");
    nn.feedForward([1,1]).print("1 XOR 1");
        
}


function testFeedForwardSetLayers() {
    console.log("\n\tTest feedForwardSetLayers");
    let data: WaBData = {
        weights: [
            Matrix.load([
                [2, 0],
                [1, 3]
            ]),
            Matrix.load([
                [1, 2],
                [2, 1],
            ]),
            Matrix.load([
                [3, 2],
            ])
        ],
        biases: [
            Matrix.fromArray([1, 1]),
            Matrix.fromArray([2, -1]),
            Matrix.fromArray([2])
        ]
    }

    let nn = new NeuralNetwork(2, 2, 2, 1);
    nn.set(data);
    let inputs = [1, 0];
    let outputs = nn.feedForward(inputs);

    let hidden1 = Matrix.map(Matrix.add(Matrix.mult(data.weights[0],Matrix.fromArray(inputs)),data.biases[0]),sigmoid);
    let hidden2 = Matrix.map(Matrix.add(Matrix.mult(data.weights[1],hidden1),data.biases[1]),sigmoid);

    assertMatrixEquals(Matrix.fromArray(inputs), nn.layers[0])
    assertMatrixEquals(hidden1, nn.layers[1]);
    assertMatrixEquals(hidden2, nn.layers[2]);
    assertMatrixEquals(outputs, nn.layers[3]);

    // let layer = Matrix.mult(data.weights[1],Matrix.fromArray([0.5744,0.5498]));
    // layer = Matrix.add(layer,data.biases[1]);
    // layer = Matrix.map(layer,sigmoid);
    // layer.print("Second layer result");

}

function testRandomize() {
    console.log("\n\tTest randomize");
    let nn = new NeuralNetwork(2, 3, 4);
    assertNumEquals(nn.weights[0].numRows, nn.layerSizes[1]);
    assertNumEquals(nn.weights[1].numRows, nn.layerSizes[2]);
    assertNumEquals(nn.biases[0].numRows,nn.layerSizes[1]);
    assertNumEquals(nn.biases[1].numRows,nn.layerSizes[2]);
}

function testSetLayer() {
    console.log("\n\tTest setLayer");
    let nn = new NeuralNetwork(2, 2, 1);
    let data: WaBData = {
        weights: [
            Matrix.load([
                [2, 0],
                [1, 3]
            ]),
            Matrix.load([[1, 0]]),
        ],
        biases: [
            Matrix.fromArray([1, 1]),
            Matrix.fromArray([2]),
        ]
    }

    nn.set(data);
    nn.print();

    let expected = Matrix.load([
        [2, 3],
        [3, 3],
    ])
    nn.setLayer(1, expected);

    assertMatrixEquals(expected, nn.layers[1]);
}

function testFeedForward4Layers() {
    console.log("\n\tTest feedForward4Layers");
    let data: WaBData = {
        weights: [
            Matrix.load(
                [
                    [1, 2.3],
                    [0.1, -2],
                    [0.8, 0]
                ]

            ),
            Matrix.load(
                [
                    [3.1, 0.5, -3],
                    [1.5, -0.2, 0.95],
                    [1.7, 2.3, -2.8],
                    [1.3, 1.2, 0.3]
                ]),
            Matrix.load(
                [
                    [2.7, -3.1, 0.2, 0.3],
                    [0.8, 1.7, 3.8, -3]
                ])

        ],
        biases: [
            Matrix.fromArray([-1.3, 0.1, 1.7]),
            Matrix.fromArray([0.38, 1.8, 1, -3]),
            Matrix.fromArray([1.2, -0.5])
        ]


    }

    let nn = new NeuralNetwork(2, 3, 4, 2);
    nn.set(data);
    nn.print();

    let { weights } = data;
    let { biases } = data;

    let inputs = [1, 3];

    let l1 = Matrix.map(Matrix.add(Matrix.mult(weights[0], Matrix.fromArray(inputs)), biases[0]), sigmoid);
    let l2 = Matrix.map(Matrix.add(Matrix.mult(weights[1], l1), biases[1]), sigmoid);
    let o = Matrix.map(Matrix.add(Matrix.mult(weights[2], l2), biases[2]), sigmoid);

    l1.print("Layer1");
    l2.print("Layer2")
    o.print("Ourput")

    nn.feedForward(inputs)
    assertMatrixEquals(o, nn.feedForward(inputs))

}
function testValidateBiases() {
    console.log("\n\tTest validateBiases");
    let nn = new NeuralNetwork(4, 3, 1);

    let biases = [
        Matrix.fromArray([1, 2, 3]),
        Matrix.fromArray([2])
    ]

    assertTrue(nn.validateBiases(biases[0], 0), "Should return true");
    assertTrue(nn.validateBiases(biases[1], 1), "Shoudl be true");

}


function testFeedForward3Layers() {
    console.log("\n\tTest feedForward3Layers");

    let nn = new NeuralNetwork(4, 3, 1);


    let l0 = Matrix.load([
        [-1.6, 7.3, -4, 0.8],
    ]);

    let weights = [
        Matrix.load([
            [1.3, -0.44, 0.81, 7],
            [7.1, 2, 1, -3.1],
            [-0.18, 0.3, 2, 6]
        ]),
        Matrix.load([
            [-1, 1, 2],
        ]),
    ]

    let biases = [
        Matrix.fromArray([-1, 0.32, 1.4]),
        Matrix.fromArray([0.3])
    ]

    // let weights = [
    //     Matrix.load(
    //         [
    //             [1.3, -0.44, 0.81, 7],
    //             [7.1, 2, 1, -3.1],
    //             [-0.18, 0.3, 2, 6]
    //         ]
    //     ),
    //     Matrix.load(
    //         [
    //             [-1, 1,2],
    //         ]
    //     )
    // ]



    let inputs = [1, 2, 3, 4];

    console.log("Some error1");

    let l1 = Matrix.map(Matrix.add(Matrix.mult(weights[0], Matrix.fromArray(inputs)), biases[0]), sigmoid)

    console.log("Some error2");


    let expected = Matrix.map(Matrix.add(Matrix.mult(weights[1], l1), biases[1]), sigmoid)

    console.log("Some error3");


    nn.setWeights(weights)
    nn.setBiases(biases)

    console.log("Last freakiierigneoigrn line ");
    nn.print();
    let result = nn.feedForward(inputs);
    console.log("Rwefwecs");

    assertMatrixEquals(expected, result)
}

function testSetWeights() {
    console.log("\n\tTest setWeights");

    let nn = new NeuralNetwork(4, 3, 5);

    let weights = [
        Matrix.load([
            [3, 2, 4, 5],
            [4, 3, 5, 5],
            [0.4, -1.5, 4, 3],
        ]),
        Matrix.load([
            [1, 2, 3],
            [4, 5, 3],
            [5, 4, 3],
            [-2, -3, -4],
            [3, 5, 4],
        ])
    ]

    console.log("SOmething");

    try {
        console.log("Another");

        nn.setWeights(weights);
        console.log("Anotherrr");

    } catch (e) {
        fail("Valid weights were passed as parameter, yet an exception was thrown")
    }


    weights = [
        Matrix.load([
            [3, 2, 4, 5],
            [4, 3, 5, 5],
            [0.4, -1.5, 4, 3],
        ]),
        Matrix.load([
            [1, 2, 3],
            [4, 5, 3],
            [5, 4, 3],
            [-2, -3, -4],

            //there is on row missing, therefore wheights are invalid
        ])
    ]


    try {
        nn.setWeights(weights);
        fail("Invalid weights were passed as parameter, yet no exception was thrown");
    } catch (e) {
        return;
    }



}

function testValidateWeights() {
    console.log("\n\tTest validateWeights");
    let nn = new NeuralNetwork(3, 2, 1);
    let weights = [
        Matrix.load([
            [1, 2],
            [4, 5]
        ]),
        Matrix.load([
            [1, 2, 3],
            [4, 3, 5],
        ]),
        Matrix.load([
            [1, 2]
        ])
    ]

    assertFalse(nn.validateWeights(weights[0], 0), "Should return false because matrix doesn't have enough columns");
    assertFalse(nn.validateWeights(weights[2], 0), "Not enough rows and columns");
    assertFalse(nn.validateWeights(weights[1], 1), "Too many columns and rows");
    assertFalse(nn.validateWeights(weights[0], 324567), "Should return false, invalid Index")


    assertTrue(nn.validateWeights(weights[1], 0), "Should return true, because correct number of columns and rows");
    assertTrue(nn.validateWeights(weights[2], 1), "Should return true");


    weights = [
        Matrix.load([
            [3, 2, 4, 5],
            [4, 3, 5, 5],
            [0.4, -1.5, 4, 3],
        ]),
        Matrix.load([
            [1, 2, 3],
            [4, 5, 3],
            [5, 4, 3],
            [-2, -3, -4],
            [3, 5, 4],
        ])
    ]

    nn = new NeuralNetwork(4, 3, 5);

    console.log("Strange");

    assertTrue(nn.validateWeights(weights[0], 0), "Shoudl be true, as wheights are valid");
    assertTrue(nn.validateWeights(weights[1], 1), "Shoudl be true, as wheights are valid1");

}

function testConstrutor() {
    console.log("\n\tTest constructor");
    let nn = new NeuralNetwork(3, 2, 1);

    let expectedLayerSizes = [3, 2, 1];
    let expectedNumLayers = 3;
    assertArrayEquals(expectedLayerSizes, nn.layerSizes);
    assertNumEquals(expectedNumLayers, nn.numLayers);
}
