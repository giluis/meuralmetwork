import {assertMatrixEquals, assertNumEquals} from './assertions.js';
import {sigmoid,SIGMOID_FLATTENER,truncate} from "../utilitary.js";




export function runUtilitaryTests(){
    console.log("\n%cAUX TESTS\n","color:#f3c131");
    
    testSigmoid();
    testTruncate();
}

function testTruncate(){
    console.log("\n\tTest truncate");
    let numDecimalPlaces = 2;
    let num = 0.215748372
    let expected = 0.21;
    let result = truncate(num,numDecimalPlaces)
    assertNumEquals(expected,result);

    numDecimalPlaces = 4;
    num = 3.141592;
    expected = 3.1415
    result = truncate(num,numDecimalPlaces);
    assertNumEquals(expected,result);

    numDecimalPlaces = 4;
    num = -1.43234;
    expected = -1.4323;
    result = truncate(num,numDecimalPlaces);
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

