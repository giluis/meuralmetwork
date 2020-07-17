import NeuralNetwork from "./neuralnetwork";
declare let obj: {
    create: (...layerSizes: number[]) => NeuralNetwork;
};
export default obj;
