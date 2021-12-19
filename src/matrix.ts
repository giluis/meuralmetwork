export function matrix(data:number[][]|number[]):Matrix{
	return Matrix.load(data);
}

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
    map(fn: (n: number, i: number, j: number, m: number[][]) => number): Matrix {
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                this.data[i][j] = fn(this.data[i][j], i, j, this.data)
            }
        }
        return this;
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


    /* Adds two matrices together. Chainable*/
    add(other:Matrix):Matrix{
        //validate matrix size
        if(other.numCols !== this.numCols || other.numRows !== this.numRows)
            throw 'Invalid matrix size';
        return this.map((v,i,j)=>v+other.get(i,j));
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
     * Returns copy of the matrix
     */
    clone(): Matrix {
        let newMatrix = new Matrix(this.numRows, this.numCols);
        newMatrix.setData(this.data);
        return newMatrix;
    }


    /**
     * Subs matrix and this, returns this
     * @param {Matrix} matrix
     */
    sub(m: Matrix): Matrix {
        if (this.numRows != m.numRows || this.numCols != m.numCols)
            throw "Matrix.sub: cannot sub matrices with different dimensions";
		for (let i = 0 ; i < this.numRows; i ++){
			for (let j = 0 ; j < this.numCols; j ++){
				this.data[i][j] -= m.get(i,j);
			}
		}
		return this;
    }

    /**
     * Multiplies by matrix. Chainable
     * @param {Matrix} m
     * @returns result of multiplication
     */
    mult(m: Matrix): Matrix {
        if (!m)
            throw 'mult failed: matrix passed as argument was not defined';
        if (this.isEmpty() || m.isEmpty())
            return Matrix.empty();
        if (this.numCols !== m.numRows)
            throw 'mult failed: m1.numCols != m2.numRows'
        let data:number[][] = [];
        for (let i = 0; i < this.numRows; i++) {
            data.push([]);
            for (let k = 0; k < m.numCols; k++) {//for each column in m2
                let sum = 0;
                for (let j = 0; j < this.numCols; j++) {
                    sum += this.data[i][j] * m.data[j][k];
                }
                data[i].push(sum);
            }
        }
        let result = new Matrix(this.numRows, m.numCols);
        result.setData(data);
        return result;
    }


    /**
     * Returns transposed matrix. Chainable
     * @param {Matrix} m
     */
    transpose(): Matrix{
        //switch row number for column number
        return new Matrix(this.numCols, this.numRows).map((v, i, j) =>  this.data[j][i])
    }


    /**
    * Hadamard product. Chainable.
    * @param {Matrix} m
    */
    hadamard(m:Matrix):Matrix{
        if(this.numRows!== m.numRows || this.numCols!== m.numCols)
            throw "Matrices cannot have different size"
        return this.map((v,i,j)=>v*m.get(i,j));
    }

    /**
    * Mults by scalar. Chainable.
    * */
    multScalar(scalar:number):Matrix{
        return this.map((v:number)=>v*scalar);
    }


	toArray():number[][] | number []{
		if(this.numCols === 1){
			return this.data.map((v:number[])=>v[0])
		} else {
			return this.data.map((v:number[])=>v)
		}
	}

    /**
     * Returns a matrix, built from the array passed as argument
     * @param arr array to transform
     * @returns matrix built from array
     */
    static fromArray(arr: number[]): Matrix {
        let m = new Matrix(arr.length, 1);
        let data:number[][] = [];
        arr.forEach(v => {
            data.push([v])
        })
        m.setData(data);
        return m;
    }

    /**
     * Creates matrix from array of arrays
     * Horizontal array if array if matrix is onedimensional
     * @param arr
     */
    static load(arr: number[][]|number[]): Matrix {
		if(!(arr[0] instanceof Array))
			return Matrix.fromArray(arr as number[]);
		let m = new Matrix(arr.length, arr[0].length);
		m.setData(arr as number[][]);
		return m;
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


    /* Returns new 0x0 Matrix*/
    static empty(){
        return new Matrix(0,0);
    }
}
