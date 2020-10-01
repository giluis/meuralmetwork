import NeuralNetwork, { TrainingInstance } from '../neuralnetwork.js';
import { WaBData } from '../neuralnetwork.js';
import Matrix from "../matrix.js";
import { sigmoid, pickRandom } from "../utilitary.js";
import { fail, assertMatrixEquals, assertFalse, assertTrue, assertArrayEquals, assertNumEquals, assertStringEquals, assertNeuralNetworkEquals } from "./assertions.js";

testTrainInBatch();

export function runNeuralNetworkTests() {
    console.log("\n%cNEURAL NETWORK TESTS\n", "color:#f3c131");
    // testConstrutor();
    // testValidateWeights();
    // testValidateBiases();
    // testSetWeights();
    // testFeedForward3Layers();
    // testFeedForward4Layers();
    // testRandomize();
     testSetLayer();
    // testFeedForwardSetLayers();
     testTrainWithXor();
    // testTrainWithAnd();
    // testTrainWithXorMultipleLayers();
    // testToJsonString();
    // testFromJsonString();
    // testEquals();
    // testTrainBatch();
    //testBackPropagation();
    testCalculateDeltas();
    testTrainInBatch()
}

function testTrainInBatch(){
    console.log("\n\t Test trainInBatch");

    let initialWaB: WaBData = {
        weights: [
            Matrix.load([
                [-0.3,0.2],
                [0.5,-1]
            ]),
            Matrix.load([
                [0.2,0.3],
                [-0.5,0.4],
            ])
        ],
        biases: [
            Matrix.fromArray([0.3,-0.2]),
            Matrix.fromArray([-0.7,0.6])
        ]
    };

    //create nn
    let nn1 = new NeuralNetwork(2,2,2); //training in batch
    let nn2 = new NeuralNetwork(2,2,2); //calc deltas and then compare

    //set initial WaB to be the same
    nn1.set(initialWaB);
    nn2.set(initialWaB);

    //at this point nn1 and nn2 should be equals
    assertNeuralNetworkEquals(nn1,nn2);

    //declare 4 training instances
    let trainingInstances: TrainingInstance [] = [
        {
            input: [0.12,-0.03],
            output: [1,0],
        },
        {
            input: [0.034,-0.12],
            output: [1,0],
        },
        {
            input: [0.2434,-0.76],
            output: [0,1],
        },
        {
            input: [-0.23,-0.65],
            output: [0,1],
        }
    ]

    // test batchsize = 0, 1, 2, 4
    let batchSize = 0;

    //batchsize 0 --> nothing should happen
    nn1.trainInBatch(trainingInstances,0);
    assertNeuralNetworkEquals(nn1,nn2);

    //batchsize 1 --> stochastic gradient descent
    batchSize = 1;
        //calculate deltas, imediately adjust
    trainingInstances.forEach(ti=>{
        let deltas = nn2.calculateDeltas(ti.input,ti.output);
        nn2.adjustWeightsAndBiases(deltas);
    })
        //after train in batch, nn1 and nn2 should be equal
    //nn2.trainInBatch(trainingInstances,batchSize);

    assertNeuralNetworkEquals(nn1,nn2);
    
    //batchsize 2 --> calculate average deltas of first two
    batchSize = 2;
        //adjust wab. cakc average last two, adjust. compare with train in batch
    let count = 0;
    let avg = nn1.getZeroedWaB();
    trainingInstances.forEach(ti=>{
        count ++;
        let current = nn1.calculateDeltas(ti.input,ti.output);
        for(let j = 0; j < current.weights.length;j++){
            avg.weights[j].add(current.weights[j]);
            avg.biases[j].add(current.biases[j]);
        }
        if(count == batchSize){
            avg.weights = avg.weights.map(w=> Matrix.multScalar(w,1/batchSize))
            avg.biases = avg.biases.map(b=> Matrix.multScalar(b,1/batchSize))
            nn1.adjustWeightsAndBiases(avg);
            avg = nn1.getZeroedWaB();
        }
    })

    nn2.trainInBatch(trainingInstances,batchSize);
    assertNeuralNetworkEquals(nn1,nn2);
    
    //batchsize 4 --> average of all the TI. adjust wab compare
    batchSize = 4;

    avg = nn1.getZeroedWaB();
    trainingInstances.forEach(ti=>{
        let current = nn1.calculateDeltas(ti.input,ti.output);
        for(let j = 0; j < current.weights.length;j++){
            avg.weights[j].add(current.weights[j]);
            avg.biases[j].add(current.biases[j]);
        }
    })
    avg.weights = avg.weights.map(w=> Matrix.multScalar(w,1/batchSize))
    avg.biases = avg.biases.map(b=> Matrix.multScalar(b,1/batchSize))
    nn1.adjustWeightsAndBiases(avg);

    nn2.trainInBatch(trainingInstances,4);

    assertNeuralNetworkEquals(nn1,nn2);

}

function testCalculateDeltas(){
    let nn1 = new NeuralNetwork(2,2,2);
    let initialData: WaBData = {
        weights: [
            Matrix.load([
                [-0.3,0.2],
                [0.5,-1]
            ]),
            Matrix.load([
                [0.2,0.3],
                [-0.5,0.4],
            ])
        ],
        biases: [
            Matrix.fromArray([0.3,-0.2]),
            Matrix.fromArray([-0.7,0.6])
        ]
    };
    nn1.set(initialData);

    //instantiate NN1 and NN2. They should have the same weights and biases
    //declare inputs and expected
    let inputs = [1,0];
    let expectedOutputs = [0,1];
    let actualOutputs = nn1.feedForward(inputs);
    //calculate layer 1 weight and biases deltas for given inputs and expected
        //calculate error
        let error = Matrix.sub(Matrix.fromArray(expectedOutputs),Matrix.fromArray(actualOutputs));
        let gradients = Matrix.map(nn1.layers[2],(v)=>v*(1-v));
        gradients = Matrix.hadamard(gradients,error);
        gradients = Matrix.multScalar(gradients,nn1.learningRate);
        let weight1Deltas = Matrix.mult(gradients,Matrix.transpose(nn1.layers[1]));
        let bias1Deltas = gradients;

        //nn1.weights[1] = Matrix.add(nn1.weights[1],weight1Deltas);
        //nn1.biases[1] = Matrix.add(nn1.biases[1],bias1Deltas);

        //weight1Deltas.print("weight 1 deltas");
        // bias1Deltas.print("bias 1 deltas");
        //add them to nN
        
        //calculate layer 2 weights and biases deltas for given inputs and expected
        
        //calculate error
        error = Matrix.mult(Matrix.transpose(nn1.weights[1]), error);
        //calculate gradients
        gradients = Matrix.map(nn1.layers[1],v=>v*(1-v));
        gradients = Matrix.hadamard(gradients,error);
        gradients = Matrix.multScalar(gradients,nn1.learningRate);
        
        let weight0Deltas = Matrix.mult(gradients,Matrix.transpose(nn1.layers[0]));
        weight0Deltas.print("weights0 deltas outside");
        let bias0Deltas = gradients;

        let expected: WaBData = {
            weights: [weight0Deltas,weight1Deltas],
            biases: [bias0Deltas,bias1Deltas],
        }

        let result = nn1.calculateDeltas(inputs,expectedOutputs);

        expected.weights.forEach((w,i)=>assertMatrixEquals(w,result.weights[i]))
        expected.biases.forEach((b,i)=>assertMatrixEquals(b,result.biases[i]))
}

function testBackPropagation(){
    console.log("\n\t Test backpropagation");
    let nn1 = new NeuralNetwork(2,2,2);
    let nn2 = new NeuralNetwork(2,2,2);
    let data: WaBData = {
        weights: [
            Matrix.load([
                [-0.3,0.2],
                [0.5,-1]
            ]),
            Matrix.load([
                [0.2,0.3],
                [-0.5,0.4],
            ])
        ],
        biases: [
            Matrix.fromArray([0.3,-0.2]),
            Matrix.fromArray([-0.7,0.6])
        ]
    };
    nn1.set(data);
    nn2.set(data);

    assertNeuralNetworkEquals(nn1,nn2);
    //instantiate NN1 and NN2. They should have the same weights and biases
    //declare inputs and expected
    let inputs = [1,0];
    let expected = [0,1];
    let outputs = nn1.feedForward(inputs);
    //calculate layer 1 weight and biases deltas for given inputs and expected
        //calculate error
        let error = Matrix.sub(Matrix.fromArray(expected),Matrix.fromArray(outputs));
        let gradients = Matrix.map(nn1.layers[2],(v)=>v*(1-v));
        gradients = Matrix.hadamard(gradients,error);
        gradients = Matrix.multScalar(gradients,nn1.learningRate);
        let weight1Deltas = Matrix.mult(gradients,Matrix.transpose(nn1.layers[1]));
        let bias1Deltas = gradients;

        //nn1.weights[1] = Matrix.add(nn1.weights[1],weight1Deltas);
        //nn1.biases[1] = Matrix.add(nn1.biases[1],bias1Deltas);

        //weight1Deltas.print("weight 1 deltas");
        // bias1Deltas.print("bias 1 deltas");
        //add them to nN
        
        //calculate layer 2 weights and biases deltas for given inputs and expected
        
        //calculate error
        error = Matrix.mult(Matrix.transpose(nn1.weights[1]), error);
        //calculate gradients
        gradients = Matrix.map(nn1.layers[1],v=>v*(1-v));
        gradients = Matrix.hadamard(gradients,error);
        gradients = Matrix.multScalar(gradients,nn1.learningRate);
        
        let weight0Deltas = Matrix.mult(gradients,Matrix.transpose(nn1.layers[0]));
        weight0Deltas.print("weights0 deltas outside");
        let bias0Deltas = gradients;
        
        nn1.weights[1].add(weight1Deltas);
        nn1.biases[1].add(bias1Deltas);
        nn1.weights[0].add(weight0Deltas);
        nn1.biases[0].add(bias0Deltas);
        nn2.train(inputs,expected);

        // nn2.train(inputs,expected);
         assertMatrixEquals(nn2.weights[0],nn1.weights[0])
         assertMatrixEquals(nn2.weights[1],nn1.weights[1])
         assertMatrixEquals(nn2.biases[0],nn1.biases[0])
         assertMatrixEquals(nn2.biases[1],nn1.biases[1])
        //weight0Deltas.print("weight 0 deltas");
        //bias0Deltas.print("bias 0 deltas");
        
    //add delas to weights

    //test if neural networks are the same

    assertNeuralNetworkEquals(nn1,nn2)
}   




function testTrainBatch(){
    console.log("\n\tTest train batch");

    let trainingData = [
        {
            input: [0, 0],
            output: [0]
        },
        {
            input: [1, 1],
            output: [0]
        },
        {
            input: [0, 1],
            output: [1]
        },
        {
            input: [1, 0],
            output: [1]
        }
    ]
    let trainingInstances = [];
    for(let i = 0; i < 5000;i++){
        trainingInstances.push(pickRandom(trainingData));
    }

    let nn = new NeuralNetwork(2,3,4,1);

    nn.trainInBatch(trainingInstances,0);

    
    Matrix.fromArray(nn.feedForward([1, 0])).print("1 XOR 0");
    Matrix.fromArray(nn.feedForward([0, 0])).print("0 XOR 0");
    Matrix.fromArray(nn.feedForward([0, 1])).print("0 XOR 1");
    Matrix.fromArray(nn.feedForward([1, 1])).print("1 XOR 1");
}

function testEquals(){
    console.log("\n\tTest equals");
    //in all test cases, equals is tested both ways, to ensure it works both ways
    const nn1 = new NeuralNetwork(2,2,1);

    const nn2 = new NeuralNetwork(2,2,1);

    nn2.setWeights(nn1.weights);
    nn2.setBiases(nn1.biases);

    assertTrue(nn1.equals(nn2),"neural networks with same numLayers, weights and biases should be equal");
    assertTrue(nn2.equals(nn1),"neural networks with same numLayers, weights and biases should be equal");

    //since weights are random, nn3 and nn1 will not be equal
    const nn3 = new NeuralNetwork(2,2,1);


    assertFalse(nn1.equals(nn3),"neural networks with same numLayers, but diferent weights and biases should be differnt");
    assertFalse(nn3.equals(nn1),"neural networks with same numLayers, but diferent weights and biases should be differnt");

    
    //since layer size is different, nn4 and nn1 will not be equal
    const nn4 = new NeuralNetwork(2,2,3);

    assertFalse(nn1.equals(nn4),"neural networks with different layerSizes should not be equal")
    assertFalse(nn4.equals(nn1),"neural networks with different layerSizes should not be equal")


    //since numLayers is different, nn5 and nn1 will not be equal
    const nn5 = new NeuralNetwork(2,2,1,4);
    assertFalse(nn1.equals(nn5),"neural networks with different numLayers should not be equal")
    assertFalse(nn5.equals(nn1),"neural networks with different numLayers should not be equal")
    

    const somethingElse = "34534";

    assertFalse(nn1.equals(somethingElse),"A neuralnetwork should only possibly be equal to other instances of NeuralNetwork")
}

function testFromJsonString(){
    console.log("\n\tTest fromJsonString");
    let nn = new NeuralNetwork(2,2,1);
    let weights = [
        Matrix.load([
            [1,1],
            [1,1]
        ]),
        Matrix.load([[1,2]])
    ];
    let biases = [
        
            Matrix.fromArray([1,1]),
            Matrix.fromArray([2]),
        
    ]
    nn.setWeights(weights);
    nn.setBiases(biases);
    console.log("Here")
    let jsonString = nn.toJsonString();

    //create a Neuralnetwork from the string. NeuralNetworks should be the same
    let fromJsonNN = NeuralNetwork.fromJsonString(jsonString);
    console.log("Here2")
    let expected = weights[0];
    let result = fromJsonNN.weights[0];

    assertMatrixEquals(expected,result);

    
    expected = weights[1];
    result = fromJsonNN.weights[1];

    assertMatrixEquals(expected,result);

    
    expected = biases[0];
    result = fromJsonNN.biases[0];

    assertMatrixEquals(expected,result);

    
    expected = biases[1];
    result = fromJsonNN.biases[1];

    assertMatrixEquals(expected,result);



}

function testToJsonString() {
    console.log("\n\tTest toJsonString");
    let nn = new NeuralNetwork(2, 2, 3);

    let w1 = Matrix.load([
        [1, 2],
        [4, 5]
    ])
    let w2 = Matrix.load([
        [1, 2],
        [2, 3],
        [1, 2],
    ])

    let b1 = Matrix.fromArray([1, 2]);
    let b2 = Matrix.fromArray([3, 3, 3]);

    let data: WaBData = {
        weights: [
            w1,
            w2
        ],
        biases: [
            b1,
            b2
        ]
    }
    nn.set(data);
    let result = nn.toJsonString();
    let expected = JSON.stringify({
        weights: [
            [

                [1, 2],
                [4, 5]
            ],
            [
                [1, 2],
                [2, 3],
                [1, 2],
            ]
        ],
        biases: [
            [1,2],
            [3,3,3]
        ],
        layerSizes: [2,2,3]
    })

    console.log(expected);
    assertStringEquals(expected,result);

}

function testTrainWithXorMultipleLayers() {
    console.log("\n\tTest train with XOR and multiple layers");
    let nn = new NeuralNetwork(2, 5, 5, 4, 3, 2, 1);
    let trainingData = [
        {
            inputs: [0, 0],
            expected: [0]
        },
        {
            inputs: [1, 1],
            expected: [0]
        },
        {
            inputs: [0, 1],
            expected: [1]
        },
        {
            inputs: [1, 0],
            expected: [1]
        }
    ]

    for (let i = 0; i < 500; i++) {
        let sample = pickRandom(trainingData);
        nn.train(sample.inputs, sample.expected);
    }

    Matrix.fromArray(nn.feedForward([1, 0])).print("1 XOR 0");
    Matrix.fromArray(nn.feedForward([0, 0])).print("0 XOR 0");
    Matrix.fromArray(nn.feedForward([0, 1])).print("0 XOR 1");
    Matrix.fromArray(nn.feedForward([1, 1])).print("1 XOR 1");
}


function testTrainWithAnd() {
    console.log("\n\tTest train with and");
    let nn = new NeuralNetwork(2, 1, 1);
    let trainingData = [
        {
            inputs: [0, 0],
            expected: [0]
        },
        {
            inputs: [1, 1],
            expected: [1]
        },
        {
            inputs: [0, 1],
            expected: [0]
        },
        {
            inputs: [1, 0],
            expected: [0]
        }
    ]

    for (let i = 0; i < 50000; i++) {
        let sample = pickRandom(trainingData);
        nn.train(sample.inputs, sample.expected);
    }

    Matrix.fromArray(nn.feedForward([1, 0])).print("1 AND 0");
    Matrix.fromArray(nn.feedForward([0, 0])).print("0 AND 0");
    Matrix.fromArray(nn.feedForward([0, 1])).print("0 AND 1");
    Matrix.fromArray(nn.feedForward([1, 1])).print("1 AND 1");
}

function testTrainWithXor() {
    console.log("\n\tTest train with XOR");
    let nn = new NeuralNetwork(2, 2, 1);
    let trainingData = [
        {
            inputs: [0, 0],
            expected: [0]
        },
        {
            inputs: [1, 1],
            expected: [0]
        },
        {
            inputs: [0, 1],
            expected: [1]
        },
        {
            inputs: [1, 0],
            expected: [1]
        }
    ]

    for (let i = 0; i < 50000; i++) {
        let sample = pickRandom(trainingData);
        nn.train(sample.inputs, sample.expected);
    }

    Matrix.fromArray(nn.feedForward([1, 0])).print("1 XOR 0");
    Matrix.fromArray(nn.feedForward([0, 0])).print("0 XOR 0");
    Matrix.fromArray(nn.feedForward([0, 1])).print("0 XOR 1");
    Matrix.fromArray(nn.feedForward([1, 1])).print("1 XOR 1");

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
    
    let hidden1 = Matrix.map(Matrix.add(Matrix.mult(data.weights[0], Matrix.fromArray(inputs)), data.biases[0]), sigmoid);
    let hidden2 = Matrix.map(Matrix.add(Matrix.mult(data.weights[1], hidden1), data.biases[1]), sigmoid);
    let outputs = Matrix.fromArray(nn.feedForward(inputs));

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
    assertNumEquals(nn.biases[0].numRows, nn.layerSizes[1]);
    assertNumEquals(nn.biases[1].numRows, nn.layerSizes[2]);
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
    assertMatrixEquals(o, Matrix.fromArray(nn.feedForward(inputs)))

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

    assertMatrixEquals(expected, Matrix.fromArray(result))
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
