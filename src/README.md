# src

All of this is written in typescript, which is a superset of javascript that allows for type annotations. 

## Source Code

### index.ts
    is the main entry point. bundles functionality for importation
### matrix.ts
    matrix library that powers the neural network
### neuralnetwork.ts 
    models a neural network. Any number of layers, any number of neurons.
    feedForward and backpropagation included
### utilitary.ts
    contains some methods that did not fit in any other files (not a good pratice to have it, but i couldn't help my self)


## Testing


Testing is paramount in these kind of __mathy__ projects. I [tested matrix.ts and neuralnetwork.ts extensively (extensively enough I hope)](./tests/README.md).