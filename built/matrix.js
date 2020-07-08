"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Matrix = /** @class */ (function () {
    /**
     * Intantiates the Matrix with num
     * @param {number} numRows
     * @param {number} numCols
     */
    function Matrix(numRows, numCols) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.data = [];
        for (var i = 0; i < numRows; i++) {
            this.data.push([]);
            for (var j = 0; j < numCols; j++) {
                this.data[i].push(0);
            }
        }
    }
    /**
     * fn(v,i,j,data)
     * @param {function} fn
     */
    Matrix.prototype.map = function (fn) {
        for (var i = 0; i < this.numRows; i++) {
            for (var j = 0; j < this.numCols; j++) {
                this.data[i][j] = fn(this.data[i][j], i, j, this.data);
            }
        }
    };
    /**
     * Sets the data
     * @param {number[][]} newData
     */
    Matrix.prototype.setData = function (newData) {
        if (newData.length !== this.numRows || newData[0].length !== this.numCols)
            throw "setData failed: data was not the appropriate size. Data-> [" + newData.length + "][" + newData[0].length + "] this-> [" + this.numRows + "][" + this.numCols + "]";
        this.map(function (v, i, j) {
            return Number(newData[i][j]);
        });
    };
    Matrix.prototype.get = function (i, j) {
        return this.data[i][j];
    };
    /**
     * Return true if empty, false if not
     */
    Matrix.prototype.isEmpty = function () {
        return this.numCols === 0 || this.numRows === 0;
    };
    /**
     * true if matrices are equals (same numRows, numCols and elements)
     * @param {Matrix} other
     */
    Matrix.prototype.equals = function (other) {
        if (!(other instanceof Matrix))
            return false;
        if (other.numRows != this.numRows || other.numCols != this.numCols)
            return false;
        else {
            for (var i = 0; i < this.numRows; i++) {
                for (var j = 0; j < this.numCols; j++) {
                    if (this.data[i][j] !== other.data[i][j])
                        return false;
                }
            }
        }
        return true;
    };
    /**
     * Prints matrix
     * @param {string} header header to print before the matrix
     */
    Matrix.prototype.print = function (header) {
        console.log(header || "");
        console.table(this.data);
    };
    /**
     * Returns copy of the matrix
     */
    Matrix.prototype.clone = function () {
        var newMatrix = new Matrix(this.numRows, this.numCols);
        newMatrix.setData(this.data);
        return newMatrix;
    };
    /**
     * Sums matrixA and matrixB, returns result
     * @param {Matrix} matrixA
     * @param {Matrix} matrixB
     */
    Matrix.add = function (matrixA, matrixB) {
        if (matrixA.numRows != matrixB.numRows || matrixA.numCols != matrixB.numCols)
            throw "Matrix.add: cannot add matrices with different dimensions";
        var newMatrix = matrixA.clone();
        newMatrix.map(function (v, i, j) {
            return v + matrixB.data[i][j];
        });
        return newMatrix;
    };
    Matrix.sub = function (matrixA, matrixB) {
        if (matrixA.numRows != matrixB.numRows || matrixA.numCols != matrixB.numCols)
            throw "Matrix.sub: cannot sub matrices with different dimensions";
        var newMatrix = matrixA.clone();
        newMatrix.map(function (v, i, j) {
            return v - matrixB.data[i][j];
        });
        return newMatrix;
    };
    /**
     * Returns a matrix, built from the array passed as argument
     * @param arr array to transform
     * @returns matrix built from array
     */
    Matrix.fromArray = function (arr) {
        var m = new Matrix(arr.length, 1);
        var data = [];
        arr.forEach(function (v) {
            data.push([v]);
        });
        m.setData(data);
        return m;
    };
    /**
     * Multiplies m1 and m2 (normal matrix multiplication) returns
     * @param {Matrix} m1
     * @param {Matrix} m2
     * @returns result of multiplication
     */
    Matrix.mult = function (m1, m2) {
        debugger;
        if (!m1 || !m2)
            throw 'mult failed: Matrices were not defined';
        if (m1.isEmpty() || m2.isEmpty())
            throw 'mult failed: one of the matrices was emtpy';
        if (m1.numCols !== m2.numRows)
            throw 'mult failed: m1.numCols != m2.numRows';
        var data = [];
        debugger;
        for (var i = 0; i < m1.numRows; i++) {
            data.push([]);
            for (var k = 0; k < m2.numCols; k++) { //for each column in m2
                var sum = 0;
                for (var j = 0; j < m1.numCols; j++) {
                    sum += m1.data[i][j] * m2.data[j][k];
                }
                data[i].push(sum);
            }
        }
        var result = new Matrix(m1.numRows, m2.numCols);
        result.setData(data);
        return result;
    };
    /**
     * Returns a matrix initialized with random values from 0 to 1
     * @param {number} numRows
     * @param {number} numCols
     */
    Matrix.random = function (numRows, numCols) {
        var newMatrix = new Matrix(numRows, numCols);
        newMatrix.map(function (v, i, j) { return Math.random() * 2 - 1; });
        return newMatrix;
    };
    /**
     * Returns an array made from the matrix (numRows === 1 || numCols === 1)
     * @param {Matrix} m
     */
    Matrix.toArray = function (m) {
        if (m.numRows !== 1 && m.numCols !== 1)
            throw "Cannot convert to array, both numRows and numCols are different than one";
        var result = [];
        for (var i = 0; i < m.numRows; i++) {
            for (var j = 0; j < m.numCols; j++) {
                result.push(m.data[i][j]);
            }
        }
        return result;
    };
    /**
     * Returns transposed matrix
     * @param {Matrix} m
     */
    Matrix.transpose = function (m) {
        var transposedM = new Matrix(m.numCols, m.numRows); //switch row number for column number
        transposedM.map(function (v, i, j) {
            return m.data[j][i];
        });
        return transposedM;
    };
    /**
     * Prompts the console for matrix values of a matrix numRows*numCols
     * @param {number} numRows
     * @param {number} numCols
     */
    Matrix.prompt = function (numRows, numCols) {
        var newMatrix = new Matrix(numRows, numCols);
        var data = [];
        console.log(numRows, numCols);
        for (var i = 0; i < numRows; i++) {
            data[i] = [];
            for (var j = 0; j < numCols; j++) {
                data[i][j] = prompt("insert matrix[" + i + "][" + j + "]");
            }
        }
        console.log(data);
        newMatrix.setData(data);
        return newMatrix;
    };
    /**
     * Returns a new matrix, with values mapped according to fn(v,i,j,m)
     * @param {Matrix} m
     * @param fn function that does the mapping
     */
    Matrix.map = function (m, fn) {
        var newMatrix = new Matrix(m.numRows, m.numCols);
        for (var i = 0; i < m.numRows; i++) {
            for (var j = 0; j < m.numCols; j++) {
                newMatrix.data[i][j] = fn(m.data[i][j], i, j, m.data);
            }
        }
        return newMatrix;
    };
    /**
     * Creates matrix from array of arrays
     * Horizontal array if array if matrix is onedimensional
     * @param arr
     */
    Matrix.load = function (arr) {
        var m = new Matrix(arr.length, arr[0].length);
        m.setData(arr);
        return m;
    };
    Matrix.hadamard = function (matrixA, matrixB) {
        if (matrixA === null || matrixB === null)
            throw "Neither matrix can be null";
        if (matrixA.numRows !== matrixB.numRows || matrixA.numCols !== matrixB.numCols)
            throw "matrices cannot have different size";
        var newMatrix = new Matrix(matrixA.numRows, matrixB.numCols); //A and B have the same numCOs and numRows
        newMatrix.map(function (v, i, j) { return matrixA.get(i, j) * matrixB.get(i, j); });
        return newMatrix;
    };
    Matrix.multScalar = function (matrix, scalar) {
        if (scalar == null)
            throw "Argument cannot be null";
        return Matrix.map(matrix, function (v) { return v * scalar; });
    };
    return Matrix;
}());
exports.default = Matrix;
//# sourceMappingURL=matrix.js.map