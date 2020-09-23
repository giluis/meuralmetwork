

export default class Matrix{
    numRows: number;
    numCols: number;
    data: number[][];
    /**
     * Intantiates the Matrix with num
     * @param {number} numRows 
     * @param {number} numCols 
     */
    constructor(numRows: number, numCols: number) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.data = [];
        for (let i = 0; i < numRows; i++) {
            this.data.push([]);
            for (let j = 0; j < numCols; j++) {
                this.data[i].push(0);
            }
        }
    }

    

    /**
     * fn(v,i,j,data)
     * @param {function} fn 
     */
    map(fn: (n: number, i: number, j: number, m: number[][]) => number): void {
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                this.data[i][j] = fn(this.data[i][j], i, j, this.data)
            }
        }
    }


    /**
     * Sets the data
     * @param {number[][]} newData 
     */
    setData(newData: number[][]): void {
        if (newData.length !== this.numRows || newData[0].length !== this.numCols)
            throw `setData failed: data was not the appropriate size. Data-> [${newData.length}][${newData[0].length}] this-> [${this.numRows}][${this.numCols}]`
        this.map((v, i, j) => {
            return Number(newData[i][j]);
        })
    }

    get(i:number, j:number):number{
        return this.data[i][j];
    }

    /**
     * Return true if empty, false if not
     */
    isEmpty(): boolean {
        return this.numCols === 0 || this.numRows === 0
    }

    add(other:Matrix):Matrix{
        //validate matrix size
        if(other.numCols !== this.numCols || other.numRows !== this.numRows)
            throw 'Invalid matrix size';
        this.map((v,i,j)=>v+other.get(i,j));
        return this; //for chaining operations
    }


    /**
     * true if matrices are equals (same numRows, numCols and elements)
     * @param {Matrix} other 
     */
    equals(other: Matrix): boolean {
        if (!(other instanceof Matrix))
            return false;
        if (other.numRows != this.numRows || other.numCols != this.numCols)
            return false;

        else {
            for (let i = 0; i < this.numRows; i++) {
                for (let j = 0; j < this.numCols; j++) {
                    if (this.data[i][j] !== other.data[i][j])
                        return false;
                }
            }
        }

        return true;
    }

    /**
     * Prints matrix
     * @param {string} header header to print before the matrix
     */
    print(header: string): void {
        console.log(header || "");
        console.table(this.data);
    }

    /**
     * Returns copy of the matrix
     */
    clone(): Matrix {
        let newMatrix = new Matrix(this.numRows, this.numCols);
        newMatrix.setData(this.data);
        return newMatrix;
    }


    /**
     * Sums matrixA and matrixB, returns result
     * @param {Matrix} matrixA 
     * @param {Matrix} matrixB 
     */
    static add(matrixA: Matrix, matrixB: Matrix): Matrix {
        if (matrixA.numRows != matrixB.numRows || matrixA.numCols != matrixB.numCols)
            throw "Matrix.add: cannot add matrices with different dimensions";
        let newMatrix = matrixA.clone();
        newMatrix.map((v, i, j) => {
            return v + matrixB.data[i][j];
        })
        return newMatrix;
    }

    static sub(matrixA: Matrix, matrixB: Matrix): Matrix {
        if (matrixA.numRows != matrixB.numRows || matrixA.numCols != matrixB.numCols)
            throw "Matrix.sub: cannot sub matrices with different dimensions";

        let newMatrix = matrixA.clone();
        newMatrix.map((v, i, j) => {
            return v - matrixB.data[i][j];
        })
        return newMatrix;
    }



    /**
     * Returns a matrix, built from the array passed as argument
     * @param arr array to transform 
     * @returns matrix built from array
     */
    static fromArray(arr: number[]): Matrix {
        let m = new Matrix(arr.length, 1);
        let data = [];
        arr.forEach(v => {
            data.push([v])
        })
        m.setData(data);

        return m;
    }

    /**
     * Multiplies m1 and m2 (normal matrix multiplication) returns
     * @param {Matrix} m1 
     * @param {Matrix} m2 
     * @returns result of multiplication
     */
    static mult(m1: Matrix, m2: Matrix): Matrix {
        if (!m1 || !m2)
            throw 'mult failed: Matrices were not defined';

        if (m1.isEmpty() || m2.isEmpty())
            throw 'mult failed: one of the matrices was emtpy';

        if (m1.numCols !== m2.numRows)
            throw 'mult failed: m1.numCols != m2.numRows'
        let data = [];
        for (let i = 0; i < m1.numRows; i++) {
            data.push([]);
            for (let k = 0; k < m2.numCols; k++) {//for each column in m2
                let sum = 0;
                for (let j = 0; j < m1.numCols; j++) {
                    sum += m1.data[i][j] * m2.data[j][k];
                }
                data[i].push(sum);
            }

        }
        let result = new Matrix(m1.numRows, m2.numCols);
        result.setData(data);
        return result;
    }

    /**
     * Returns a matrix initialized with random values from 0 to 1
     * @param {number} numRows 
     * @param {number} numCols 
     */
    static random(numRows: number, numCols: number) {
        let newMatrix = new Matrix(numRows, numCols);
        newMatrix.map((v, i, j) => Math.random()*2-1);
        return newMatrix;
    }

    /**
     * Returns an array made from the matrix (numRows === 1 || numCols === 1)
     * @param {Matrix} m 
     */
    static toArray(m: Matrix) {
        if (!m)
            throw `arg cannot be null`;
        let result = [];
        if(m.numCols === 1 && m.numRows !== 1){//only convert vertical vectors to arrays. Horizontal ones are converted to [[]]
            for (let i = 0; i < m.numRows; i++) {
                for (let j = 0; j < m.numCols; j++) {
                    result.push(m.get(i,j))
                }
            }
        } else {
            for (let i = 0; i < m.numRows; i++) {
                result[i] = [];
                for (let j = 0; j < m.numCols; j++) {
                    result[i][j] = m.get(i,j);
                }
            }
        }
        

        return result;
    }

    /**
     * Returns transposed matrix
     * @param {Matrix} m 
     */
    static transpose(m: Matrix) {
        let transposedM = new Matrix(m.numCols, m.numRows)//switch row number for column number
        transposedM.map((v, i, j) => {
            return m.data[j][i];
        })

        return transposedM;
    }



    /**
     * Prompts the console for matrix values of a matrix numRows*numCols
     * @param {number} numRows 
     * @param {number} numCols 
     */
    static prompt(numRows: number, numCols: number) {
        let newMatrix = new Matrix(numRows, numCols);
        let data = [];
        console.log(numRows, numCols);

        for (let i = 0; i < numRows; i++) {
            data[i] = [];
            for (let j = 0; j < numCols; j++) {
                data[i][j] = prompt(`insert matrix[${i}][${j}]`);
            }
        }
        console.log(data);
        newMatrix.setData(data);
        return newMatrix;
    }

    /**
     * Returns a new matrix, with values mapped according to fn(v,i,j,m)
     * @param {Matrix} m 
     * @param fn function that does the mapping
     */
    static map(m: Matrix, fn: (v: number, i?: number, j?: number, data?: number[][]) => number): Matrix {
        let newMatrix = new Matrix(m.numRows, m.numCols);
        for (let i = 0; i < m.numRows; i++) {
            for (let j = 0; j < m.numCols; j++) {
                newMatrix.data[i][j] = fn(m.data[i][j], i, j, m.data);
            }
        }
        return newMatrix;
    }

    /**
     * Creates matrix from array of arrays
     * Horizontal array if array if matrix is onedimensional
     * @param arr 
     */
    static load(arr: number[][]): Matrix {
        let m = new Matrix(arr.length, arr[0].length);
        m.setData(arr);
        return m;
    }

    static hadamard(matrixA:Matrix,matrixB:Matrix):Matrix{
        if(matrixA === null || matrixB === null)
            throw "Neither matrix can be null"

        if(matrixA.numRows!== matrixB.numRows || matrixA.numCols!== matrixB.numCols)
            throw "matrices cannot have different size"
        
        let newMatrix = new Matrix(matrixA.numRows,matrixB.numCols);//A and B have the same numCOs and numRows
        newMatrix.map((v,i,j)=>matrixA.get(i,j)*matrixB.get(i,j));
        return newMatrix;
    }

    static multScalar(matrix:Matrix, scalar:number):Matrix{
        if(scalar == null)
            throw "Argument cannot be null";
        
        return Matrix.map(matrix,(v)=>v*scalar);    
    }



}
