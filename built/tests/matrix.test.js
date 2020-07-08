"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMatrixTests = void 0;
var matrix_js_1 = require("../matrix.js");
var assertions_js_1 = require("./assertions.js");
function runMatrixTests() {
    console.log("\n%cMATRIX TESTS\n", "color:#f3c131");
    testAdd();
    testSub();
    testEquals();
    testClone();
    testFromArray();
    testTranspose();
    testToArray();
    testMult();
    testRandom();
    testMap();
    testLoad();
    testMultElementWise();
    testMultScalar();
}
exports.runMatrixTests = runMatrixTests;
function testMultScalar() {
    console.log("\n\tTest multSclaar");
    var matrixA = matrix_js_1.default.load([
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
    ]);
    var matrixB = matrix_js_1.default.load([
        [3, 3, 3],
    ]);
    var matrixC = matrix_js_1.default.fromArray([1, 1, 1]);
    var expected;
    var result;
    result = matrix_js_1.default.multScalar(matrixA, 3);
    expected = matrix_js_1.default.load([
        [6, 6, 6],
        [6, 6, 6],
        [6, 6, 6],
    ]);
    assertions_js_1.assertMatrixEquals(expected, result);
    result = matrix_js_1.default.multScalar(matrixB, 3);
    expected = matrix_js_1.default.load([
        [9, 9, 9]
    ]);
    assertions_js_1.assertMatrixEquals(expected, result);
    result = matrix_js_1.default.multScalar(matrixC, 4);
    expected = matrix_js_1.default.fromArray([4, 4, 4]);
    assertions_js_1.assertMatrixEquals(expected, result);
}
function testMultElementWise() {
    console.log("\n\tTest multElementWise");
    var matrixA = matrix_js_1.default.load([
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
    ]);
    var matrixB = matrix_js_1.default.load([
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
    ]);
    var result = matrix_js_1.default.hadamard(matrixA, matrixB);
    var expected = matrix_js_1.default.load([
        [6, 6, 6],
        [6, 6, 6],
        [6, 6, 6],
    ]);
    assertions_js_1.assertMatrixEquals(expected, result);
    try {
        matrix_js_1.default.hadamard(matrixA, null);
        assertions_js_1.fail("Null was passed as argument to multElementWise, yet no exception was thrown");
    }
    catch (ignore) { }
    ;
    try {
        matrix_js_1.default.hadamard(null, matrixA);
        assertions_js_1.fail("Null was passed as argument to multElementWise, yet no exception was thrown");
    }
    catch (ignore) { }
    ;
    var matrixC;
    try {
        matrixC = matrix_js_1.default.load([
            [1, 2],
            [1, 2],
            [1, 2],
        ]); // different number of columns
        matrix_js_1.default.hadamard(matrixA, matrixC);
        assertions_js_1.fail("Matrices with different number of columns were passed as arguments, yet no exception was thrown");
    }
    catch (ignore) { }
    ;
    try {
        matrixC = matrix_js_1.default.load([
            [1, 2, 3],
            [1, 2, 3],
        ]); // different number of rows
        matrix_js_1.default.hadamard(matrixA, matrixC);
        assertions_js_1.fail("Matrices with different number of columns were passed as arguments, yet no exception was thrown");
    }
    catch (ignore) { }
    ;
    try {
        matrixC = matrix_js_1.default.load([
            [1, 2],
            [1, 2],
        ]); // different number of rows
        matrix_js_1.default.hadamard(matrixA, matrixC);
        assertions_js_1.fail("Matrices with different number of columns were passed as arguments, yet no exception was thrown");
    }
    catch (ignore) { }
    ;
    var vec1;
    var vec2;
    vec1 = matrix_js_1.default.fromArray([1, 2, 3]);
    vec2 = matrix_js_1.default.fromArray([4, 2, 3]);
    result = matrix_js_1.default.hadamard(vec1, vec2);
    expected = matrix_js_1.default.fromArray([4, 4, 9]);
    assertions_js_1.assertMatrixEquals(expected, result);
    try {
        vec1 = matrix_js_1.default.fromArray([1, 2, 3]);
        vec2 = matrix_js_1.default.fromArray([4, 3]);
        matrix_js_1.default.hadamard(vec1, vec2);
        assertions_js_1.fail("Vectors of different sizes were passed as arguments, yet no exception was thrown");
    }
    catch (ignored) { }
    ;
}
function testLoad() {
    console.log("\n\tTest load");
    var expected = new matrix_js_1.default(2, 3);
    expected.setData([
        [1, 2, 3],
        [2, 3, 4],
    ]);
    var result = matrix_js_1.default.load([
        [1, 2, 3],
        [2, 3, 4],
    ]);
    assertions_js_1.assertMatrixEquals(expected, result);
}
function testMap() {
    console.log("\n\tTest map (static)");
    var fn = function (v, i, j) { return i === j ? 1 : 0; };
    var m = matrix_js_1.default.random(3, 3);
    var expected = new matrix_js_1.default(3, 3);
    expected.setData([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]);
    var result = matrix_js_1.default.map(m, fn);
    assertions_js_1.assertMatrixEquals(expected, result);
    var dsigmoid = function (v, i, j) { return v * (1 - v); };
}
function testMult() {
    console.log("\n\tTest mult");
    var m1 = new matrix_js_1.default(2, 3);
    m1.setData([
        [1, 2, 3],
        [1, 1, 1],
    ]);
    var m2 = new matrix_js_1.default(3, 3);
    m2.setData([
        [1, 1, 1],
        [1, 0, 1],
        [3, 1, 1],
    ]);
    var result = matrix_js_1.default.mult(m1, m2);
    var expected = new matrix_js_1.default(2, 3);
    expected.setData([
        [12, 4, 6],
        [5, 2, 3]
    ]);
    assertions_js_1.assertMatrixEquals(expected, result);
    m1 = new matrix_js_1.default(2, 4);
    m1.setData([
        [-2, 3, 1, 7],
        [1, 4, 0, -1]
    ]);
    m2 = new matrix_js_1.default(4, 3);
    m2.setData([
        [-1, 1, 2],
        [2, 3, -2],
        [1, -1, 1],
        [3, 1, 0]
    ]);
    expected = new matrix_js_1.default(2, 3);
    expected.setData([
        [30, 13, -9],
        [4, 12, -6]
    ]);
    result = matrix_js_1.default.mult(m1, m2);
    assertions_js_1.assertMatrixEquals(expected, result);
    m1 = new matrix_js_1.default(3, 3);
    m1.setData([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);
    m2 = new matrix_js_1.default(3, 1);
    m2.setData([
        [3],
        [2],
        [1],
    ]);
    expected = new matrix_js_1.default(3, 1);
    expected.setData([
        [10],
        [28],
        [46]
    ]);
    result = matrix_js_1.default.mult(m1, m2);
    assertions_js_1.assertMatrixEquals(expected, result);
}
function testRandom() {
    console.log("\n\tTest random");
    var newMatrix = matrix_js_1.default.random(2, 3);
    newMatrix.print("Should be random");
}
function testToArray() {
    console.log("\n\tTest toArray");
    var m = new matrix_js_1.default(4, 1);
    m.setData([
        [1],
        [2],
        [3],
        [4],
    ]);
    var expected = [1, 2, 3, 4];
    var result = matrix_js_1.default.toArray(m);
    assertions_js_1.assertArrayEquals(expected, result);
    m = new matrix_js_1.default(1, 4);
    m.setData([
        [1, 2, 3, 4]
    ]);
    result = matrix_js_1.default.toArray(m);
    assertions_js_1.assertArrayEquals(expected, result);
    m = new matrix_js_1.default(1, 1);
    m.setData([
        [2]
    ]);
    expected = [2];
    result = matrix_js_1.default.toArray(m);
    assertions_js_1.assertArrayEquals(expected, result);
}
function testTranspose() {
    console.log("\n\tTest transpose");
    var rows = 3;
    var cols = 2;
    var m = new matrix_js_1.default(rows, cols);
    m.setData([
        [1, 2],
        [2, 3],
        [3, 1],
    ]);
    var expected = new matrix_js_1.default(cols, rows); //switch rows for cols
    expected.setData([
        [1, 2, 3],
        [2, 3, 1]
    ]);
    var result = matrix_js_1.default.transpose(m);
    assertions_js_1.assertMatrixEquals(expected, result);
    //test transpose for array
    rows = 4;
    cols = 1;
    m = matrix_js_1.default.fromArray([1, 2, 3, 4]);
    expected = new matrix_js_1.default(cols, rows);
    expected.setData([
        [1, 2, 3, 4]
    ]);
    result = matrix_js_1.default.transpose(m);
    assertions_js_1.assertMatrixEquals(expected, result);
}
function testFromArray() {
    console.log("\n\tTest fromArray");
    var expected = new matrix_js_1.default(4, 1);
    expected.setData([
        [1], [2], [3], [4]
    ]);
    console.table(expected.data);
    var result = matrix_js_1.default.fromArray([1, 2, 3, 4]);
    console.log("RESULT", result.numRows, result.numCols);
    console.table(result.data);
    assertions_js_1.assertMatrixEquals(expected, result);
}
function testClone() {
    console.log("\n\tTest clone");
    var rows = 2;
    var cols = 4;
    var m1 = new matrix_js_1.default(rows, cols);
    m1.setData([
        [1, 0, 3, 1],
        [1, 0, 1, 9],
    ]);
    var result = m1.clone();
    assertions_js_1.assertMatrixEquals(result, m1);
}
function testSub() {
    console.log("\n\tTest sub");
    var m1 = matrix_js_1.default.load([
        [1, 0, 0],
        [1, 0, 1],
    ]);
    var m2 = matrix_js_1.default.load([
        [1, 1, 1],
        [0, 0, 0],
    ]);
    var expected = matrix_js_1.default.load([
        [0, -1, -1],
        [1, 0, 1]
    ]);
    var result = matrix_js_1.default.sub(m1, m2);
    assertions_js_1.assertMatrixEquals(expected, result);
    var invalidMatrix = matrix_js_1.default.load([
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5]
    ]); //m1 and m2 don't have the same number of columns
    try {
        matrix_js_1.default.sub(invalidMatrix, m1);
    }
    catch (err) {
        return;
    }
    assertions_js_1.fail("Different sized matrices were subbed, yet no exception was thrown");
}
function testAdd() {
    console.log("\n\tTest add");
    var rows = 2;
    var cols = 3;
    var m1 = new matrix_js_1.default(rows, cols);
    m1.setData([
        [1, 0, 0],
        [1, 0, 1],
    ]);
    var m2 = new matrix_js_1.default(rows, cols);
    m2.setData([
        [1, 1, 1],
        [0, 0, 0],
    ]);
    var expected = new matrix_js_1.default(rows, cols);
    expected.setData([
        [2, 1, 1],
        [1, 0, 1]
    ]);
    var result = matrix_js_1.default.add(m1, m2);
    assertions_js_1.assertMatrixEquals(expected, result);
    var invalidMatrix = new matrix_js_1.default(2, cols + 1);
    try {
        matrix_js_1.default.add(invalidMatrix, m1);
    }
    catch (err) {
        return;
    }
    assertions_js_1.fail("Different sized matrices were added, yet no exception was thrown");
}
function testEquals() {
    console.log("\n\tTest equals");
    var m = new matrix_js_1.default(2, 3);
    m.setData([
        [1, 0, 0],
        [1, 0, 1],
    ]);
    var equal = new matrix_js_1.default(2, 3);
    equal.setData([
        [1, 0, 0],
        [1, 0, 1],
    ]);
    var differentRows = new matrix_js_1.default(3, 3);
    var differentCols = new matrix_js_1.default(2, 4);
    var differentMatrix = new matrix_js_1.default(2, 3);
    differentMatrix.setData([
        [1, 1, 1],
        [1, 0, 1]
    ]);
    assertions_js_1.assertFalse(m.equals(differentCols), "Matrices with different numcols cannot be equal");
    assertions_js_1.assertFalse(m.equals(differentRows), "Matrices with different numrows cannot be equal");
    assertions_js_1.assertFalse(m.equals(differentMatrix), "Matrices with same numcols and numrow, but with different values cannot be equal");
    assertions_js_1.assertTrue(m.equals(equal), "Equal matrices should be equal");
}
//# sourceMappingURL=matrix.test.js.map