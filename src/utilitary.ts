import NeuralNetwork from "./neuralnetwork";

export const SIGMOID_FLATTENER = 1;

export function pickRandom(arr: any[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}
export function sigmoid(x: number): number {
	return 1 / (1 + Math.exp(SIGMOID_FLATTENER * (-x)))
}

export function maxIndex(arr: number[]): number {
	return arr.reduce((maxi, cur, i) => cur > arr[maxi] ? i : maxi, 0);
}
