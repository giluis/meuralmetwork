import NeuralNetwork, { TrainingInstance } from '../neuralnetwork.ts';
import { WaBData } from '../neuralnetwork.ts';
import { Matrix,matrix, Tocko} from "../deps.ts";
import { sigmoid} from "../utilitary.ts";

const {suite,test,fail,assert,assertEquals,assertArrayEquals} = Tocko;

function assertFalse(condition:boolean,msg:string="Should be false"){
    assert(!condition,msg);
}

suite("Train in batch",() =>{
    test("batch size = 1",()=>{
        const initialWaB: WaBData = {
            weights: [
                Matrix.load([
                    [-0.3, 0.2],
                    [0.5, -1]
                ]),
                Matrix.load([
                    [0.2, 0.3],
                    [-0.5, 0.4],
                ])
            ],
            biases: [
                Matrix.fromArray([0.3, -0.2]),
                Matrix.fromArray([-0.7, 0.6])
            ]
        };

        //create nn
        const nn1 = new NeuralNetwork(2, 2, 2); //training in batch
        const nn2 = new NeuralNetwork(2, 2, 2); //calc deltas and then compare

        //set initial WaB to be the same
        nn1.set(initialWaB);
        nn2.set(initialWaB);

        //at this point nn1 and nn2 should be equals
        assertEquals(nn1, nn2);

        //declare 4 training instances
        const trainingInstances: TrainingInstance[] = [
            {
                input: [0.12, -0.03],
                output: [1, 0],
            },
            {
                input: [0.034, -0.12],
                output: [1, 0],
            },
            {
                input: [0.2434, -0.76],
                output: [0, 1],
            },
            {
                input: [-0.23, -0.65],
                output: [0, 1],
            }
        ]

        // test batchsize = 0, 1, 2, 4
        const batchSize = 0;

        //batchsize 0 --> nothing should happen
        nn1.trainInBatch(trainingInstances, batchSize);
        assertEquals(nn1, nn2);

    })

    test("batchsize = 1",()=>{
        const trainingInstances: TrainingInstance[] = [
            {
                input: [0.12, -0.03],
                output: [1, 0],
            },
            {
                input: [0.034, -0.12],
                output: [1, 0],
            },
            {
                input: [0.2434, -0.76],
                output: [0, 1],
            },
            {
                input: [-0.23, -0.65],
                output: [0, 1],
            }
        ]

        const initialWaB: WaBData = {
            weights: [
                Matrix.load([
                    [-0.3, 0.2],
                    [0.5, -1]
                ]),
                Matrix.load([
                    [0.2, 0.3],
                    [-0.5, 0.4],
                ])
            ],
            biases: [
                Matrix.fromArray([0.3, -0.2]),
                Matrix.fromArray([-0.7, 0.6])
            ]
        };

        //create nn
        const nn1 = new NeuralNetwork(2, 2, 2); //training in batch
        const nn2 = new NeuralNetwork(2, 2, 2); //calc deltas and then compare
        nn1.set(initialWaB);
        nn2.set(initialWaB);
        // test batchsize = 0, 1, 2, 4
        //batchsize 1 --> stochastic gradient descent
        const batchSize = 1;
        //calculate deltas, imediately adjust
        trainingInstances.forEach(ti => {
            let deltas = nn2.calculateDeltas(ti.input, ti.output);
            nn2.adjustWeightsAndBiases(deltas);
        })
        //after train in batch, nn1 and nn2 should be equal
        nn2.trainInBatch(trainingInstances,batchSize);

        assertEquals(nn1, nn2);
    })

    test("batchsize = 2",()=>{

        const trainingInstances: TrainingInstance[] = [
            {
                input: [0.12, -0.03],
                output: [1, 0],
            },
            {
                input: [0.034, -0.12],
                output: [1, 0],
            },
            {
                input: [0.2434, -0.76],
                output: [0, 1],
            },
            {
                input: [-0.23, -0.65],
                output: [0, 1],
            }
        ]

        const initialWaB: WaBData = {
            weights: [
                Matrix.load([
                    [-0.3, 0.2],
                    [0.5, -1]
                ]),
                Matrix.load([
                    [0.2, 0.3],
                    [-0.5, 0.4],
                ])
            ],
            biases: [
                Matrix.fromArray([0.3, -0.2]),
                Matrix.fromArray([-0.7, 0.6])
            ]
        };

        //create nn
        const nn1 = new NeuralNetwork(2, 2, 2); //training in batch
        const nn2 = new NeuralNetwork(2, 2, 2); //calc deltas and then compare
        nn1.set(initialWaB);
        nn2.set(initialWaB);

        //batchsize 2 --> calculate average deltas of first two
        const batchSize = 2;
        //adjust wab. cakc average last two, adjust. compare with train in batch
        let count = 0;
        let avg = nn1.getZeroedWaB();
        trainingInstances.forEach(ti => {
            count++;
            let current = nn1.calculateDeltas(ti.input, ti.output);
            for (let j = 0; j < current.weights.length; j++) {
                avg.weights[j].add(current.weights[j]);
                avg.biases[j].add(current.biases[j]);
            }
            if (count == batchSize) {
                avg.weights = avg.weights.map(( w:Matrix ) =>  w.multScalar(1 / batchSize))
                avg.biases = avg.biases.map(( b:Matrix ) =>  b.multScalar(1 / batchSize))
                nn1.adjustWeightsAndBiases(avg);
                avg = nn1.getZeroedWaB();
            }
        })

        nn2.trainInBatch(trainingInstances, batchSize);
        assertEquals(nn1, nn2);
    })

    test("batchsize = 4",()=>{

        const trainingInstances: TrainingInstance[] = [
                {
                input: [0.12, -0.03],
                output: [1, 0],
            },
            {
                input: [0.034, -0.12],
                output: [1, 0],
            },
            {
                input: [0.2434, -0.76],
                output: [0, 1],
            },
            {
                input: [-0.23, -0.65],
                output: [0, 1],
            }
        ]

        const initialWaB: WaBData = {
            weights: [
                Matrix.load([
                    [-0.3, 0.2],
                    [0.5, -1]
                ]),
                Matrix.load([
                    [0.2, 0.3],
                    [-0.5, 0.4],
                ])
            ],
            biases: [
                Matrix.fromArray([0.3, -0.2]),
                Matrix.fromArray([-0.7, 0.6])
            ]
        };

        //create nn
        const nn1 = new NeuralNetwork(2, 2, 2); //training in batch
        const nn2 = new NeuralNetwork(2, 2, 2); //calc deltas and then compare
        nn1.set(initialWaB);
        nn2.set(initialWaB);
        //batchsize 4 --> average of all the TI. adjust wab compare

        const batchSize = 4;

        const avg = nn1.getZeroedWaB();
        trainingInstances.forEach(ti => {
            let current = nn1.calculateDeltas(ti.input, ti.output);
            for (let j = 0; j < current.weights.length; j++) {
                avg.weights[j].add(current.weights[j]);
                avg.biases[j].add(current.biases[j]);
            }
        })
        avg.weights = avg.weights.map(( w:Matrix ) =>  w.multScalar(1 / batchSize))
        avg.biases = avg.biases.map(( b:Matrix ) =>  b.multScalar(1 / batchSize))
        nn1.adjustWeightsAndBiases(avg);

        nn2.trainInBatch(trainingInstances, 4);

        assertEquals(nn1, nn2);
    })
})


suite("Calculate deltas",() =>{
    test("valid data",()=>{
        let nn1:NeuralNetwork = new NeuralNetwork(2, 2, 2);
        let initialData: WaBData = {
            weights: [
                Matrix.load([
                    [-0.3, 0.2],
                    [0.5, -1]
                ]),
                Matrix.load([
                    [0.2, 0.3],
                    [-0.5, 0.4],
                ])
            ],
            biases: [
                Matrix.fromArray([0.3, -0.2]),
                Matrix.fromArray([-0.7, 0.6])
            ]
        };
        nn1.set(initialData);

        //instantiate NN1 and NN2. They should have the same weights and biases
        //declare inputs and expected
        let inputs = [1, 0];
        let expectedOutputs = [0, 1];
        let actualOutputs = nn1.feedForward(inputs);
        //calculate layer 1 weight and biases deltas for given inputs and expected
        //calculate error
        let error =  matrix(expectedOutputs).sub(matrix(actualOutputs));
        let gradients = nn1.layers[2].map(v=> v * (1 - v));
        gradients =  gradients.hadamard(error);
        gradients =  gradients.multScalar(nn1.learningRate);
        let weight1Deltas =  gradients.mult( nn1.layers[1].transpose());
        let bias1Deltas = gradients;

        //nn1.weights[1] = Matrix.add(nn1.weights[1],weight1Deltas);
        //nn1.biases[1] = Matrix.add(nn1.biases[1],bias1Deltas);

        //weight1Deltas.print("weight 1 deltas");
        // bias1Deltas.print("bias 1 deltas");
        //add them to nN

        //calculate layer 2 weights and biases deltas for given inputs and expected

        //calculate error
        error =   nn1.weights[1].transpose().mult(error);
        //calculate gradients
        gradients =  nn1.layers[1].map(v=> v * (1 - v));
        gradients =  gradients.hadamard(error);
        gradients =  gradients.multScalar(nn1.learningRate);

        let weight0Deltas =  gradients.mult( nn1.layers[0].transpose());
        let bias0Deltas = gradients;

        let expected: WaBData = {
            weights: [weight0Deltas, weight1Deltas],
            biases: [bias0Deltas, bias1Deltas],
        }

        let result = nn1.calculateDeltas(inputs, expectedOutputs);

        expected.weights.forEach((w:Matrix, i:number) => assertEquals(w, result.weights[i]))
        expected.biases.forEach((b:Matrix, i:number) => assertEquals(b, result.biases[i]))
    })
});

suite("Backpropagation",()=>{
    test("Valid valus",()=>{

        let nn1 = new NeuralNetwork(2, 2, 2);
        let nn2 = new NeuralNetwork(2, 2, 2);
        let data: WaBData = {
            weights: [
                Matrix.load([
                    [-0.3, 0.2],
                    [0.5, -1]
                ]),
                Matrix.load([
                    [0.2, 0.3],
                    [-0.5, 0.4],
                ])
            ],
            biases: [
                Matrix.fromArray([0.3, -0.2]),
                Matrix.fromArray([-0.7, 0.6])
            ]
        };
        nn1.set(data);
        nn2.set(data);

        assertEquals(nn1, nn2);
        //instantiate NN1 and NN2. They should have the same weights and biases
        //declare inputs and expected
        let inputs = [1, 0];
        let expected = [0, 1];
        let outputs = nn1.feedForward(inputs);
        //calculate layer 1 weight and biases deltas for given inputs and expected
        //calculate error
        let error =  matrix(expected).sub(matrix(outputs));
        let gradients =  nn1.layers[2].map(v => v * (1 - v));
        gradients =  gradients.hadamard(error);
        gradients =  gradients.multScalar(nn1.learningRate);
        let weight1Deltas =  gradients.mult( nn1.layers[1].transpose());
        let bias1Deltas = gradients;

        //nn1.weights[1] = Matrix.add(nn1.weights[1],weight1Deltas);
        //nn1.biases[1] = Matrix.add(nn1.biases[1],bias1Deltas);

        //weight1Deltas.print("weight 1 deltas");
        // bias1Deltas.print("bias 1 deltas");
        //add them to nN

        //calculate layer 2 weights and biases deltas for given inputs and expected

        //calculate error
        error =   nn1.weights[1].transpose().mult(error);
        //calculate gradients
        gradients =  nn1.layers[1].map(v=> v * (1 - v));
        gradients =  gradients.hadamard(error);
        gradients =  gradients.multScalar(nn1.learningRate);

        let weight0Deltas =  gradients.mult( nn1.layers[0].transpose());
        let bias0Deltas = gradients;

        nn1.weights[1].add(weight1Deltas);
        nn1.biases[1].add(bias1Deltas);
        nn1.weights[0].add(weight0Deltas);
        nn1.biases[0].add(bias0Deltas);
        nn2.train(inputs, expected);

        // nn2.train(inputs,expected);
        assertEquals(nn2.weights[0], nn1.weights[0])
        assertEquals(nn2.weights[1], nn1.weights[1])
        assertEquals(nn2.biases[0], nn1.biases[0])
        assertEquals(nn2.biases[1], nn1.biases[1])
        //weight0Deltas.print("weight 0 deltas");
        //bias0Deltas.print("bias 0 deltas");

        //add delas to weights

        //test if neural networks are the same

        assertEquals(nn1, nn2)
    })
})



suite("testFromJsonString",()=> {
    test("valid inputs",()=> {

        let nn = new NeuralNetwork(2, 2, 1);
        let weights = [
            matrix([
                [1, 1],
                [1, 1]
            ]),
            matrix([[1, 2]])
        ];
        let biases = [

            Matrix.fromArray([1, 1]),
            Matrix.fromArray([2]),

        ]
        nn.setWeights(weights);
        nn.setBiases(biases);
        let jsonString = nn.toJsonString();

        //create a Neuralnetwork from the string. NeuralNetworks should be the same
        let fromJsonNN = NeuralNetwork.fromJsonString(jsonString);
        let expected = weights[0];
        let result = fromJsonNN.weights[0];

        assertEquals(expected, result);


        expected = weights[1];
        result = fromJsonNN.weights[1];

        assertEquals(expected, result);


        expected = biases[0];
        result = fromJsonNN.biases[0];

        assertEquals(expected, result);


        expected = biases[1];
        result = fromJsonNN.biases[1];

        assertEquals(expected, result);

    })
})

suite("testToJsonString",()=> {
    test("Valid inputs",()=> {

        let nn = new NeuralNetwork(2, 2, 3);

        let w1 = matrix([
            [1, 2],
            [4, 5]
        ])
        let w2 = matrix([
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
                [1, 2],
                [3, 3, 3]
            ],
            layerSizes: [2, 2, 3]
        })
        assertEquals(expected, result);
    })
})






suite("testFeedForwardSetLayers",()=> {
    test("valid inputs",()=> {
        let data: WaBData = {
            weights: [
                matrix([
                    [2, 0],
                    [1, 3]
                ]),
                matrix([
                    [1, 2],
                    [2, 1],
                ]),
                matrix([
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

        let hidden1 =    data.weights[0].mult(matrix(inputs)).add(data.biases[0]).map(sigmoid);
        let hidden2 =    data.weights[1].mult(hidden1).add(data.biases[1]).map(sigmoid);
        let outputs = matrix(nn.feedForward(inputs));

        assertEquals(matrix(inputs), nn.layers[0])
        assertEquals(hidden1, nn.layers[1]);
        assertEquals(hidden2, nn.layers[2]);
        assertEquals(outputs, nn.layers[3]);

    })
    test("feed forward 4 layers",()=> {
        let data: WaBData = {
            weights: [
                matrix(
                    [
                        [1, 2.3],
                        [0.1, -2],
                        [0.8, 0]
                    ]

                ),
                matrix(
                    [
                        [3.1, 0.5, -3],
                        [1.5, -0.2, 0.95],
                        [1.7, 2.3, -2.8],
                        [1.3, 1.2, 0.3]
                    ]),
                matrix(
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

        let { weights } = data;
        let { biases } = data;

        let inputs = [1, 3];

        let l1 =    weights[0].mult(matrix(inputs)).add(biases[0]).map(sigmoid);
        let l2 =    weights[1].mult(l1).add(biases[1]).map(sigmoid);
        let o =    weights[2].mult(l2).add(biases[2]).map(sigmoid);


        nn.feedForward(inputs)
        assertEquals(o, Matrix.fromArray(nn.feedForward(inputs)))

    })
    test("feed forward 3 layers",()=> {

        let nn = new NeuralNetwork(4, 3, 1);


        let l0 = matrix([
            [-1.6, 7.3, -4, 0.8],
        ]);

        let weights = [
            matrix([
                [1.3, -0.44, 0.81, 7],
                [7.1, 2, 1, -3.1],
                [-0.18, 0.3, 2, 6]
            ]),
            matrix([
                [-1, 1, 2],
            ]),
        ]

        let biases = [
            Matrix.fromArray([-1, 0.32, 1.4]),
            Matrix.fromArray([0.3])
        ]

        // let weights = [
        //     matrix(
        //         [
        //             [1.3, -0.44, 0.81, 7],
        //             [7.1, 2, 1, -3.1],
        //             [-0.18, 0.3, 2, 6]
        //         ]
        //     ),
        //     matrix(
        //         [
        //             [-1, 1,2],
        //         ]
        //     )
        // ]



        let inputs = [1, 2, 3, 4];


        let l1 =    weights[0].mult(matrix(inputs)).add(biases[0]).map(sigmoid)
        //let l1 = Matrix.map(Matrix.add(Matrix.mult(weights[0], Matrix.fromArray(inputs)), biases[0]), sigmoid)

        let expected =    weights[1].mult(l1).add(biases[1]).map(sigmoid)
        //let expected = Matrix.map(Matrix.add(Matrix.mult(weights[1], l1), biases[1]), sigmoid)



        nn.setWeights(weights)
        nn.setBiases(biases)

        let result = nn.feedForward(inputs);

        assertEquals(expected, Matrix.fromArray(result))
    })
})

suite("testRandomize",()=> {
    test("Valid inputs",()=>{
        let nn = new NeuralNetwork(2, 3, 4);
        assertEquals(nn.weights[0].numRows, nn.layerSizes[1]);
        assertEquals(nn.weights[1].numRows, nn.layerSizes[2]);
        assertEquals(nn.biases[0].numRows, nn.layerSizes[1]);
        assertEquals(nn.biases[1].numRows, nn.layerSizes[2]);
    })
})

suite("testSetLayer",()=> {
    test("Valid inputsl",()=>{

        let nn = new NeuralNetwork(2, 2, 1);
        let data: WaBData = {
            weights: [
                matrix([
                    [2, 0],
                    [1, 3]
                ]),
                matrix([[1, 0]]),
            ],
            biases: [
                Matrix.fromArray([1, 1]),
                Matrix.fromArray([2]),
            ]
        }

        nn.set(data);


        let expected = matrix([
            [2, 3],
            [3, 3],
        ])
        nn.setLayer(1, expected);

        assertEquals(expected, nn.layers[1]);
    })
})

suite("testValidateBiases",()=> {
    test("valid biases",()=>{

        let nn = new NeuralNetwork(4, 3, 1);

        let biases = [
            Matrix.fromArray([1, 2, 3]),
            Matrix.fromArray([2])
        ]

        assert(nn.validateBiases(biases[0], 0), "Should return true");
        assert(nn.validateBiases(biases[1], 1), "Shoudl be true");
    })

})



suite("set weights",()=> {

    test("valid weights",()=>{
        let nn = new NeuralNetwork(4, 3, 5);

        let weights = [
            matrix([
                [3, 2, 4, 5],
                [4, 3, 5, 5],
                [0.4, -1.5, 4, 3],
            ]),
            matrix([
                [1, 2, 3],
                [4, 5, 3],
                [5, 4, 3],
                [-2, -3, -4],
                [3, 5, 4],
            ])
        ]


        try {
            nn.setWeights(weights);
            return;
        } catch (e) {
            fail("Valid weights were passed as parameter, yet an exception was thrown")
        }
    });
    test("Invalid weights",()=> {

        let nn = new NeuralNetwork(4, 3, 5);
        const weights = [
            matrix([
                [3, 2, 4, 5],
                [4, 3, 5, 5],
                [0.4, -1.5, 4, 3],
            ]),
            matrix([
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

    })
})

suite("validate weights",()=> {
    test("Invalid weights",()=>{
        let nn = new NeuralNetwork(3, 2, 1);
        let weights = [
            matrix([
                [1, 2],
                [4, 5]
            ]),
            matrix([
                [1, 2, 3],
                [4, 3, 5],
            ]),
            matrix([
                [1, 2]
            ])
        ]

        assertFalse(nn.validateWeights(weights[0], 0), "Should return false because matrix doesn't have enough columns");
        assertFalse(nn.validateWeights(weights[2], 0), "Not enough rows and columns");
        assertFalse(nn.validateWeights(weights[1], 1), "Too many columns and rows");
        assertFalse(nn.validateWeights(weights[0], 324567), "Should return false, invalid Index")
    })

    test("valid weights 1",()=>{

        const nn = new NeuralNetwork(3, 2, 1);
        const weights = [
            matrix([
                [1, 2],
                [4, 5]
            ]),
            matrix([
                [1, 2, 3],
                [4, 3, 5],
            ]),
            matrix([
                [1, 2]
            ])
        ]



        assert(nn.validateWeights(weights[1], 0), "Should return true, because correct number of columns and rows");
        assert(nn.validateWeights(weights[2], 1), "Should return true");


    })
    test("valid weights 2",()=>{

        const nn = new NeuralNetwork(4, 3, 5);

        const weights = [
            matrix([
                [3, 2, 4, 5],
                [4, 3, 5, 5],
                [0.4, -1.5, 4, 3],
            ]),
            matrix([
                [1, 2, 3],
                [4, 5, 3],
                [5, 4, 3],
                [-2, -3, -4],
                [3, 5, 4],
            ])
        ]


        assert(nn.validateWeights(weights[0], 0), "Shoudl be true, as wheights are valid");
        assert(nn.validateWeights(weights[1], 1), "Shoudl be true, as wheights are valid1");

    })
})

suite("testConstrutor",()=> {
    test("Valid input",()=>{
        let nn = new NeuralNetwork(3, 2, 1);
        let expectedLayerSizes = [3, 2, 1];
        let expectedNumLayers = 3;
        assertArrayEquals(expectedLayerSizes, nn.layerSizes);
        assertEquals(expectedNumLayers, nn.numLayers);
    })
})
