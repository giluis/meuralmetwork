import {assertMatrixEquals, assertNumEquals} from './assertions.js';
import {sigmoid,truncate,pointLabellingActivation} from "../aux.js";
import { SIGMOID_FLATTENER } from '../constants.js';




export function runAuxTests(){
    console.log("\n%cAUX TESTS\n","color:#f3c131");
    
    testSigmoid();
    testPointLabellingActivation();
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

function testPointLabellingActivation(){
    console.log("\n\tTest pointLabellingActivation");
    
    // let expected = -1;
    // let num = -123;
    // let result = p.activation(num);
    // assertNumEquals(expected,result);
    
    // expected = 1;
    // num = 123,
    // result = p.activation(num);
    // assertNumEquals(expected,result);
    let num = -3;
    let expected = -1;
    let result = pointLabellingActivation(num);
    assertNumEquals(expected,result);
}

