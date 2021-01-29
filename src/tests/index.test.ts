import matrixTests from "./matrix.test.js";
import { ITestClass } from "./testinterface.js";
import * as f from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MatrixTests from "./matrix.test.js";
import { builtinModules } from "module";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fs = f.promises;

run();

async function build() {
    const files = await fs.readdir(__dirname);
    let testfiles = files.filter(f=>f.match(".test.js$")&&!f.includes("index"));
    const allImports = await Promise.all(testfiles.map(f=>import(`${__dirname}/${f}`)));
    const testSuites:TestSuite[] = allImports.map(i=>{
        return {
            header : new i.default().header() as string,
            tests:buildTestsForClass(i.default)
        }
    });
    return testSuites;
}

async function run(){
    const testSuites:TestSuite[]= await build();
    const testResults = testSuites.forEach(s=>{
        return s.tests.forEach(t=>{
            let success = true;
            let message = "";
            try{
                t.fn();
            }catch(e){
                success = false;
                message = e.message;
            }
            writeTest(success,message,t.intro);
        });
    });
}

function writeTest(success:boolean, message:string, testName:string){
    if(success){
        console.log(`\t ✔ ${testName}`)
    } else {
        console.log(`\n ❌ ${testName}`)
        console.log(`Exception Thrown: ${message}`);
    }

}



function buildTestsForClass<T  extends new (...args: any[]) => ITestClass>(testClass:T):Test[] {
    const testInstance = new testClass();
    const testMethodNames = getTestMethodNames(testInstance);
    const testMethods = testMethodNames.map(m=>testInstance[m]);
    let result = testMethods.map((c,i)=>{
        return {
            intro: divideCamelCase(testMethodNames[i]),
            fn: c,
        }
    })
    result["header"] = testInstance.header();
    return result;
}

function divideCamelCase(str:string){
    let result = str.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return result.charAt(0).toUpperCase() + result.substring(1);
}

function getTestMethodNames(toCheck) {
    var props = [];
    var obj = toCheck;
    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    let testMethods =  props.sort().filter(function(e, i, arr) { 
       if (e!=arr[i+1] && typeof toCheck[e] == 'function' && e.toLowerCase().includes("test")) return true;
    });
    return testMethods;
}

interface Test{
    intro: string,
    fn: ()=>any,
}

interface TestSuite{
    header: string,
    tests: Test[]
}
