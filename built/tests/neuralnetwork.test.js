"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runNeuralNetworkTests = void 0;
var neuralnetwork_1 = require("../neuralnetwork");
var matrix_js_1 = require("../matrix.js");
var aux_js_1 = require("../aux.js");
var assertions_js_1 = require("./assertions.js");
function runNeuralNetworkTests() {
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
exports.runNeuralNetworkTests = runNeuralNetworkTests;
function testTrainWithXorMultipleLayers() {
    console.log("\n\tTest train with XOR and multiple layers");
    var nn = new neuralnetwork_1.default(2, 5, 5, 4, 3, 2, 1);
    var trainingData = [
        {
            inputs: matrix_js_1.default.fromArray([0, 0]),
            expected: matrix_js_1.default.fromArray([0])
        },
        {
            inputs: matrix_js_1.default.fromArray([1, 1]),
            expected: matrix_js_1.default.fromArray([0])
        },
        {
            inputs: matrix_js_1.default.fromArray([0, 1]),
            expected: matrix_js_1.default.fromArray([1])
        },
        {
            inputs: matrix_js_1.default.fromArray([1, 0]),
            expected: matrix_js_1.default.fromArray([1])
        }
    ];
    for (var i = 0; i < 50000; i++) {
        var sample = aux_js_1.pickRandom(trainingData);
        nn.train(sample.inputs, sample.expected);
    }
    nn.feedForward(matrix_js_1.default.fromArray([1, 0])).print("1 XOR 0");
    nn.feedForward(matrix_js_1.default.fromArray([0, 0])).print("0 XOR 0");
    nn.feedForward(matrix_js_1.default.fromArray([0, 1])).print("0 XOR 1");
    nn.feedForward(matrix_js_1.default.fromArray([1, 1])).print("1 XOR 1");
}
function testTrainWithAnd() {
    console.log("\n\tTest train with and");
    var nn = new neuralnetwork_1.default(2, 1, 1);
    var trainingData = [
        {
            inputs: matrix_js_1.default.fromArray([0, 0]),
            expected: matrix_js_1.default.fromArray([0])
        },
        {
            inputs: matrix_js_1.default.fromArray([1, 1]),
            expected: matrix_js_1.default.fromArray([1])
        },
        {
            inputs: matrix_js_1.default.fromArray([0, 1]),
            expected: matrix_js_1.default.fromArray([0])
        },
        {
            inputs: matrix_js_1.default.fromArray([1, 0]),
            expected: matrix_js_1.default.fromArray([0])
        }
    ];
    for (var i = 0; i < 50000; i++) {
        var sample = aux_js_1.pickRandom(trainingData);
        nn.train(sample.inputs, sample.expected);
    }
    nn.feedForward(matrix_js_1.default.fromArray([1, 0])).print("1 AND 0");
    nn.feedForward(matrix_js_1.default.fromArray([0, 0])).print("0 AND 0");
    nn.feedForward(matrix_js_1.default.fromArray([0, 1])).print("0 AND 1");
    nn.feedForward(matrix_js_1.default.fromArray([1, 1])).print("1 AND 1");
}
function testTrainWithXor() {
    console.log("\n\tTest train with XOR");
    var nn = new neuralnetwork_1.default(2, 2, 1);
    var trainingData = [
        {
            inputs: matrix_js_1.default.fromArray([0, 0]),
            expected: matrix_js_1.default.fromArray([0])
        },
        {
            inputs: matrix_js_1.default.fromArray([1, 1]),
            expected: matrix_js_1.default.fromArray([0])
        },
        {
            inputs: matrix_js_1.default.fromArray([0, 1]),
            expected: matrix_js_1.default.fromArray([1])
        },
        {
            inputs: matrix_js_1.default.fromArray([1, 0]),
            expected: matrix_js_1.default.fromArray([1])
        }
    ];
    for (var i = 0; i < 50000; i++) {
        var sample = aux_js_1.pickRandom(trainingData);
        nn.train(sample.inputs, sample.expected);
    }
    nn.feedForward(matrix_js_1.default.fromArray([1, 0])).print("1 XOR 0");
    nn.feedForward(matrix_js_1.default.fromArray([0, 0])).print("0 XOR 0");
    nn.feedForward(matrix_js_1.default.fromArray([0, 1])).print("0 XOR 1");
    nn.feedForward(matrix_js_1.default.fromArray([1, 1])).print("1 XOR 1");
}
function testFeedForwardSetLayers() {
    console.log("\n\tTest feedForwardSetLayers");
    var data = {
        weights: [
            matrix_js_1.default.load([
                [2, 0],
                [1, 3]
            ]),
            matrix_js_1.default.load([
                [1, 2],
                [2, 1],
            ]),
            matrix_js_1.default.load([
                [3, 2],
            ])
        ],
        biases: [
            matrix_js_1.default.fromArray([1, 1]),
            matrix_js_1.default.fromArray([2, -1]),
            matrix_js_1.default.fromArray([2])
        ]
    };
    var nn = new neuralnetwork_1.default(2, 2, 2, 1);
    nn.set(data);
    var inputs = matrix_js_1.default.fromArray([1, 0]);
    var outputs = nn.feedForward(inputs);
    var hidden1 = matrix_js_1.default.map(matrix_js_1.default.add(matrix_js_1.default.mult(data.weights[0], inputs), data.biases[0]), aux_js_1.sigmoid);
    var hidden2 = matrix_js_1.default.map(matrix_js_1.default.add(matrix_js_1.default.mult(data.weights[1], hidden1), data.biases[1]), aux_js_1.sigmoid);
    assertions_js_1.assertMatrixEquals(inputs, nn.layers[0]);
    assertions_js_1.assertMatrixEquals(hidden1, nn.layers[1]);
    assertions_js_1.assertMatrixEquals(hidden2, nn.layers[2]);
    assertions_js_1.assertMatrixEquals(outputs, nn.layers[3]);
    // let layer = Matrix.mult(data.weights[1],Matrix.fromArray([0.5744,0.5498]));
    // layer = Matrix.add(layer,data.biases[1]);
    // layer = Matrix.map(layer,sigmoid);
    // layer.print("Second layer result");
}
function testRandomize() {
    console.log("\n\tTest randomize");
    var nn = new neuralnetwork_1.default(2, 3, 4);
    assertions_js_1.assertNumEquals(nn.weights[0].numRows, nn.layerSizes[1]);
    assertions_js_1.assertNumEquals(nn.weights[1].numRows, nn.layerSizes[2]);
    assertions_js_1.assertNumEquals(nn.biases[0].numRows, nn.layerSizes[1]);
    assertions_js_1.assertNumEquals(nn.biases[1].numRows, nn.layerSizes[2]);
}
function testSetLayer() {
    console.log("\n\tTest setLayer");
    var nn = new neuralnetwork_1.default(2, 2, 1);
    var data = {
        weights: [
            matrix_js_1.default.load([
                [2, 0],
                [1, 3]
            ]),
            matrix_js_1.default.load([[1, 0]]),
        ],
        biases: [
            matrix_js_1.default.fromArray([1, 1]),
            matrix_js_1.default.fromArray([2]),
        ]
    };
    nn.set(data);
    nn.print();
    var expected = matrix_js_1.default.load([
        [2, 3],
        [3, 3],
    ]);
    nn.setLayer(1, expected);
    assertions_js_1.assertMatrixEquals(expected, nn.layers[1]);
}
function testFeedForward4Layers() {
    console.log("\n\tTest feedForward4Layers");
    var data = {
        weights: [
            matrix_js_1.default.load([
                [1, 2.3],
                [0.1, -2],
                [0.8, 0]
            ]),
            matrix_js_1.default.load([
                [3.1, 0.5, -3],
                [1.5, -0.2, 0.95],
                [1.7, 2.3, -2.8],
                [1.3, 1.2, 0.3]
            ]),
            matrix_js_1.default.load([
                [2.7, -3.1, 0.2, 0.3],
                [0.8, 1.7, 3.8, -3]
            ])
        ],
        biases: [
            matrix_js_1.default.fromArray([-1.3, 0.1, 1.7]),
            matrix_js_1.default.fromArray([0.38, 1.8, 1, -3]),
            matrix_js_1.default.fromArray([1.2, -0.5])
        ]
    };
    var nn = new neuralnetwork_1.default(2, 3, 4, 2);
    nn.set(data);
    nn.print();
    var weights = data.weights;
    var biases = data.biases;
    var inputs = matrix_js_1.default.fromArray([1, 3]);
    var l1 = matrix_js_1.default.map(matrix_js_1.default.add(matrix_js_1.default.mult(weights[0], inputs), biases[0]), aux_js_1.sigmoid);
    var l2 = matrix_js_1.default.map(matrix_js_1.default.add(matrix_js_1.default.mult(weights[1], l1), biases[1]), aux_js_1.sigmoid);
    var o = matrix_js_1.default.map(matrix_js_1.default.add(matrix_js_1.default.mult(weights[2], l2), biases[2]), aux_js_1.sigmoid);
    l1.print("Layer1");
    l2.print("Layer2");
    o.print("Ourput");
    nn.feedForward(inputs);
    assertions_js_1.assertMatrixEquals(o, nn.feedForward(inputs));
}
function testValidateBiases() {
    console.log("\n\tTest validateBiases");
    var nn = new neuralnetwork_1.default(4, 3, 1);
    var biases = [
        matrix_js_1.default.fromArray([1, 2, 3]),
        matrix_js_1.default.fromArray([2])
    ];
    assertions_js_1.assertTrue(nn.validateBiases(biases[0], 0), "Should return true");
    assertions_js_1.assertTrue(nn.validateBiases(biases[1], 1), "Shoudl be true");
}
function testFeedForward3Layers() {
    console.log("\n\tTest feedForward3Layers");
    var nn = new neuralnetwork_1.default(4, 3, 1);
    var l0 = matrix_js_1.default.load([
        [-1.6, 7.3, -4, 0.8],
    ]);
    var weights = [
        matrix_js_1.default.load([
            [1.3, -0.44, 0.81, 7],
            [7.1, 2, 1, -3.1],
            [-0.18, 0.3, 2, 6]
        ]),
        matrix_js_1.default.load([
            [-1, 1, 2],
        ]),
    ];
    var biases = [
        matrix_js_1.default.fromArray([-1, 0.32, 1.4]),
        matrix_js_1.default.fromArray([0.3])
    ];
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
    var inputs = matrix_js_1.default.fromArray([1, 2, 3, 4]);
    console.log("Some error1");
    var l1 = matrix_js_1.default.map(matrix_js_1.default.add(matrix_js_1.default.mult(weights[0], inputs), biases[0]), aux_js_1.sigmoid);
    console.log("Some error2");
    var expected = matrix_js_1.default.map(matrix_js_1.default.add(matrix_js_1.default.mult(weights[1], l1), biases[1]), aux_js_1.sigmoid);
    console.log("Some error3");
    nn.setWeights(weights);
    nn.setBiases(biases);
    console.log("Last freakiierigneoigrn line ");
    nn.print();
    var result = nn.feedForward(inputs);
    console.log("Rwefwecs");
    assertions_js_1.assertMatrixEquals(expected, result);
}
function testSetWeights() {
    console.log("\n\tTest setWeights");
    var nn = new neuralnetwork_1.default(4, 3, 5);
    var weights = [
        matrix_js_1.default.load([
            [3, 2, 4, 5],
            [4, 3, 5, 5],
            [0.4, -1.5, 4, 3],
        ]),
        matrix_js_1.default.load([
            [1, 2, 3],
            [4, 5, 3],
            [5, 4, 3],
            [-2, -3, -4],
            [3, 5, 4],
        ])
    ];
    console.log("SOmething");
    try {
        console.log("Another");
        nn.setWeights(weights);
        console.log("Anotherrr");
    }
    catch (e) {
        assertions_js_1.fail("Valid weights were passed as parameter, yet an exception was thrown");
    }
    weights = [
        matrix_js_1.default.load([
            [3, 2, 4, 5],
            [4, 3, 5, 5],
            [0.4, -1.5, 4, 3],
        ]),
        matrix_js_1.default.load([
            [1, 2, 3],
            [4, 5, 3],
            [5, 4, 3],
            [-2, -3, -4],
        ])
    ];
    try {
        nn.setWeights(weights);
        assertions_js_1.fail("Invalid weights were passed as parameter, yet no exception was thrown");
    }
    catch (e) {
        return;
    }
}
function testValidateWeights() {
    console.log("\n\tTest validateWeights");
    var nn = new neuralnetwork_1.default(3, 2, 1);
    var weights = [
        matrix_js_1.default.load([
            [1, 2],
            [4, 5]
        ]),
        matrix_js_1.default.load([
            [1, 2, 3],
            [4, 3, 5],
        ]),
        matrix_js_1.default.load([
            [1, 2]
        ])
    ];
    assertions_js_1.assertFalse(nn.validateWeights(weights[0], 0), "Should return false because matrix doesn't have enough columns");
    assertions_js_1.assertFalse(nn.validateWeights(weights[2], 0), "Not enough rows and columns");
    assertions_js_1.assertFalse(nn.validateWeights(weights[1], 1), "Too many columns and rows");
    assertions_js_1.assertFalse(nn.validateWeights(weights[0], 324567), "Should return false, invalid Index");
    assertions_js_1.assertTrue(nn.validateWeights(weights[1], 0), "Should return true, because correct number of columns and rows");
    assertions_js_1.assertTrue(nn.validateWeights(weights[2], 1), "Should return true");
    weights = [
        matrix_js_1.default.load([
            [3, 2, 4, 5],
            [4, 3, 5, 5],
            [0.4, -1.5, 4, 3],
        ]),
        matrix_js_1.default.load([
            [1, 2, 3],
            [4, 5, 3],
            [5, 4, 3],
            [-2, -3, -4],
            [3, 5, 4],
        ])
    ];
    nn = new neuralnetwork_1.default(4, 3, 5);
    console.log("Strange");
    assertions_js_1.assertTrue(nn.validateWeights(weights[0], 0), "Shoudl be true, as wheights are valid");
    assertions_js_1.assertTrue(nn.validateWeights(weights[1], 1), "Shoudl be true, as wheights are valid1");
}
function testConstrutor() {
    console.log("\n\tTest constructor");
    var nn = new neuralnetwork_1.default(3, 2, 1);
    var expectedLayerSizes = [3, 2, 1];
    var expectedNumLayers = 3;
    assertions_js_1.assertArrayEquals(expectedLayerSizes, nn.layerSizes);
    assertions_js_1.assertNumEquals(expectedNumLayers, nn.numLayers);
}
//# sourceMappingURL=neuralnetwork.test.js.map