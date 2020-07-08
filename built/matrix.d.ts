export default class Matrix {
    numRows: number;
    numCols: number;
    data: number[][];
    /**
     * Intantiates the Matrix with num
     * @param {number} numRows
     * @param {number} numCols
     */
    constructor(numRows: number, numCols: number);
    /**
     * fn(v,i,j,data)
     * @param {function} fn
     */
    map(fn: (n: number, i: number, j: number, m: number[][]) => number): void;
    /**
     * Sets the data
     * @param {number[][]} newData
     */
    setData(newData: number[][]): void;
    get(i: number, j: number): number;
    /**
     * Return true if empty, false if not
     */
    isEmpty(): boolean;
    /**
     * true if matrices are equals (same numRows, numCols and elements)
     * @param {Matrix} other
     */
    equals(other: Matrix): boolean;
    /**
     * Prints matrix
     * @param {string} header header to print before the matrix
     */
    print(header: string): void;
    /**
     * Returns copy of the matrix
     */
    clone(): Matrix;
    /**
     * Sums matrixA and matrixB, returns result
     * @param {Matrix} matrixA
     * @param {Matrix} matrixB
     */
    static add(matrixA: Matrix, matrixB: Matrix): Matrix;
    static sub(matrixA: Matrix, matrixB: Matrix): Matrix;
    /**
     * Returns a matrix, built from the array passed as argument
     * @param arr array to transform
     * @returns matrix built from array
     */
    static fromArray(arr: number[]): Matrix;
    /**
     * Multiplies m1 and m2 (normal matrix multiplication) returns
     * @param {Matrix} m1
     * @param {Matrix} m2
     * @returns result of multiplication
     */
    static mult(m1: Matrix, m2: Matrix): Matrix;
    /**
     * Returns a matrix initialized with random values from 0 to 1
     * @param {number} numRows
     * @param {number} numCols
     */
    static random(numRows: number, numCols: number): Matrix;
    /**
     * Returns an array made from the matrix (numRows === 1 || numCols === 1)
     * @param {Matrix} m
     */
    static toArray(m: Matrix): any[];
    /**
     * Returns transposed matrix
     * @param {Matrix} m
     */
    static transpose(m: Matrix): Matrix;
    /**
     * Prompts the console for matrix values of a matrix numRows*numCols
     * @param {number} numRows
     * @param {number} numCols
     */
    static prompt(numRows: number, numCols: number): Matrix;
    /**
     * Returns a new matrix, with values mapped according to fn(v,i,j,m)
     * @param {Matrix} m
     * @param fn function that does the mapping
     */
    static map(m: Matrix, fn: (v: number, i?: number, j?: number, data?: number[][]) => number): Matrix;
    /**
     * Creates matrix from array of arrays
     * Horizontal array if array if matrix is onedimensional
     * @param arr
     */
    static load(arr: number[][]): Matrix;
    static hadamard(matrixA: Matrix, matrixB: Matrix): Matrix;
    static multScalar(matrix: Matrix, scalar: number): Matrix;
}
