import {assertNumEquals,assertLesserThan,assertGreaterThan} from "./assertions.js";
import Perceptron from "../perceptron.js";
import {pointLabellingActivation, sigmoid} from "../aux.js";
const LEARNING_RATE = 0.3;
export function runPerceptronTests(){
    console.log("\n%cPERCEPTRON TESTS\n","color:#f3c131");
    testWeightedSum();
    testSetRandomWeights();
    testFeedForward();
    testTrain();
}

function testTrain(){
    
}

function testWeightedSum(){
    console.log("\n\tTest weightedSum");
    let inputs = [1,4,2,1];
    let weights = [0.3,0.6,0.8,1.3];
    let p = new Perceptron(inputs.length,LEARNING_RATE,sigmoid);
    p.setWeights(weights);
    let result = p.wheightedSum(inputs);
    let expected = 1*0.3+4*0.6+2*0.8+1*1.3;
    assertNumEquals(expected,result);

    inputs = [0.3,0.1,70];
    weights = [1,3,2];
    p.setWeights(weights);
    result = p.wheightedSum(inputs);//obtained result
    expected = inputs.reduce((acc,cur,i)=> acc+cur*weights[i],0);//expected result
    assertNumEquals(expected,result);
    

}

function testFeedForward(){
    console.log("\n\tTest feedForward");
    let inputs = [100,200];
    let weights = [-3,1.8];
    let p = new Perceptron(inputs.length,LEARNING_RATE,pointLabellingActivation);
    
    p.setWeights(weights);
    let expected = 1;
    let result = p.feedForward(inputs);
    assertNumEquals(expected,result);

    inputs = [10,-500];
    weights = [0.8,0.3];
    p.setWeights(weights);
    expected = -1;
    result=p.feedForward(inputs);
    assertNumEquals(expected,result);

    inputs = [0,-3];
    weights = [120,0.2];
    expected = -1;
    p.setWeights(weights),
    result = p.feedForward(inputs);
    assertNumEquals(expected,result);

}





function testSetRandomWeights(){
    let lowLim = -3;
    let hiLim = 2;
    let perceptron = new Perceptron(2,LEARNING_RATE,sigmoid);
    for(let i =0; i < 1000;i++){
        perceptron.setRandomWeights(lowLim, hiLim)
        assertGreaterThan(perceptron.weights[0],lowLim);
        assertLesserThan(perceptron.weights[0],hiLim);
        
        assertGreaterThan(perceptron.weights[1],lowLim);
        assertLesserThan(perceptron.weights[1],hiLim);
        
    }
}


