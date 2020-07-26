const ASSERT_FALSE_DEFAULT_MESSAGE = "sHOUld Be fALsE";
const ASSERT_TRUE_DEFAULT_MESSAGE = "SHoULd Be TRuE";
import Matrix from "../matrix";
export function fail(message:string):void {
    throw message;
}

export function assertFalse(bool:boolean,msg:string):void {
    if(bool)
        throw `assertFalse failed: ${msg||ASSERT_FALSE_DEFAULT_MESSAGE}`;
}


export function assertTrue(bool:boolean,msg:string) {
    if (!bool)
        throw `assertTrue failed: ${msg||ASSERT_TRUE_DEFAULT_MESSAGE}`;
}

export function assertMatrixEquals(expected:Matrix, result:Matrix):void {
    if (!expected.equals(result))
        throw `Matrices were not equal -> \n ${expected.print("Expected")}, ${result.print("Result")}`
}

export function assertNumEquals(expected:number,result:number):void{
    if(expected !== result)
        throw `assertNumEquals failed - Numbers were not the same: ${expected} !== ${result}`;
}


export function assertStringEquals(expected:string,result:string):void{
    if(expected !== result){
        throw `assertStringEquals failed - Strings were not the same -> ${expected} !== ${result}`;
    }
}

export function assertArrayEquals(expected:any[],result:any[]):void{
    if(expected.length !== result.length)
        throw `assertArrayEquals failed: arrays were different lengths \n expected.length -> ${expected.length} | result.length-> ${result.length}`;
    for(let i = 0; i < expected.length;i++){
        if(expected[i] !== result[i]){
            if(expected[i] instanceof Array && result[i] instanceof Array)
                assertArrayEquals(expected[i],result[i]);
            else 
                throw `Arrays differed: expected[${i}]->${expected[i]} | result[${i}] -> ${result[i]}`   
        }
    }
}

export function assertNumNotEquals(expected:number,result:number):void{
    if(expected !== result)
    throw `assertNumNotEquals failed - Numbers were the same: ${expected} === ${result}`;

}

export function assertGreaterThan(num:number,min:number):void{
    if(num <= min)
        throw `assertGreaterThan failed: ${num} <= ${min}`;
    
}
export function assertLesserThan(num:number,min:number):void{
    if(num >= min)
        throw `assertLesserThan failed: ${num} >= ${min}`;
    
}
