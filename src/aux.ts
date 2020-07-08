import {SIGMOID_FLATTENER} from "./constants.js";

export function pickRandom(arr:any[]){
	return arr[Math.floor(Math.random()*arr.length)];
}
export function sigmoid(x:number):number{
    return 1/(1+Math.exp(SIGMOID_FLATTENER*(-x)))
}

export function pointLabellingActivation(x:number):number{
    return x>0?1:-1;
}

export function plot(fn:(x:number)=>number): void{
	for(let i = 0; i<100; i++){
		console.log(`f(${i})=${fn(i)}`)
	}
}

export function truncate(number: number,numDecPlaces:number):number{
	if(!numDecPlaces)
		return number;
	if(numDecPlaces < 0)
		throw "Cannot truncate with negative decimal places";
	if(!isNumInteger(numDecPlaces))
		throw "number of decimal places must be a decimal number"
	let numstring = "" + number;
	numstring = numstring.substring(0,numDecPlaces+2)//add two for the zero and the dot
	return Number(numstring);
}

function isNumInteger(num:number):boolean{
	return Math.floor(num) === num;
}