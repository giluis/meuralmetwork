import {assertMatrixEquals, assertNumEquals} from './assertions.js';
import {sigmoid,SIGMOID_FLATTENER,maxIndex} from "../utilitary.js";




export function runUtilitaryTests(){
    console.log("\n%cAUX TESTS\n","color:#f3c131");
    
    testSigmoid();
    testMaxIndex();
}
function testMaxIndex(){
    console.log("\n\tTest maxIndex");
    let arr = [0.11,0.78,0.1];
    let expected = 1;
    let result = maxIndex(arr);
    assertNumEquals(expected,result);
}

function testSigmoid(){
    console.log("\n\tTest sigmoid");
    let num = 0;
    let expected = 0.5;
    let result = sigmoid(num);
    assertNumEquals(expected,result);
    num = -3;
    expected = 1/(1+Math.exp(SIGMOID_FLATTENER*(-num)));
    result = sigmoid(num)
    assertNumEquals(expected,result);
}

