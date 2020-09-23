import Matrix from "../matrix.js";
import { fail, assertArrayEquals, assertMatrixEquals, assertFalse, assertTrue } from "./assertions.js";

export function runMatrixTests() {
    console.log("\n%cMATRIX TESTS\n", "color:#f3c131");

    testAdd();
    testSub();
    testEquals();
    testClone();
    testFromArray();
    testMult();
    testRandom();
    testMap();
    testLoad();
    testMultElementWise();
    testMultScalar();
    testTranspose();
    testToArrayOneDimensional();
    testToArrayTwoDimensional();
    testInstanceAdd();
}


function testInstanceAdd(){
    console.log("\n\t Test instance add");

    let squareNormal = Matrix.load([
        [1,1,1],
        [2,2,2],
        [3,3,3],
    ])

    let rectNormal = Matrix.load([
        [0,0],
        [1,1],
        [1,2]
    ])

    let square0 = Matrix.load([
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ])

    let rect0 = Matrix.load([
        [0,0],
        [0,0],
        [0,0]
    ])
    assertMatrixEquals(squareNormal.add(square0),squareNormal);
    assertMatrixEquals(rectNormal.add(rect0),rectNormal);

    try{
        squareNormal.add(rectNormal);
        fail("Adding matrices of different sizes should result in an error");
    }catch(ignored){}

    assertMatrixEquals(rectNormal.add(rectNormal),Matrix.load([
        [0,0],
        [2,2],
        [2,4]
    ]))
    
}


function testMultScalar() {
    console.log("\n\tTest multSclaar");

    let matrixA = Matrix.load([
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
    ])

    let matrixB = Matrix.load([
        [3, 3, 3],
    ])

    let matrixC = Matrix.fromArray([1, 1, 1]);

    let expected;
    let result;


    result = Matrix.multScalar(matrixA, 3);
    expected = Matrix.load([
        [6, 6, 6],
        [6, 6, 6],
        [6, 6, 6],
    ])

    assertMatrixEquals(expected, result);

    result = Matrix.multScalar(matrixB, 3);
    expected = Matrix.load([
        [9, 9, 9]
    ]);

    assertMatrixEquals(expected, result);

    result = Matrix.multScalar(matrixC, 4);
    expected = Matrix.fromArray([4, 4, 4]);

    assertMatrixEquals(expected, result);
}

function testMultElementWise() {
    console.log("\n\tTest multElementWise");

    let matrixA = Matrix.load([
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
    ])

    let matrixB = Matrix.load([
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
    ])

    let result = Matrix.hadamard(matrixA, matrixB);
    let expected = Matrix.load([
        [6, 6, 6],
        [6, 6, 6],
        [6, 6, 6],
    ])

    assertMatrixEquals(expected, result);

    try {
        Matrix.hadamard(matrixA, null);
        fail("Null was passed as argument to multElementWise, yet no exception was thrown");
    } catch (ignore) { };

    try {
        Matrix.hadamard(null, matrixA);
        fail("Null was passed as argument to multElementWise, yet no exception was thrown");
    } catch (ignore) { };

    let matrixC: Matrix;
    try {
        matrixC = Matrix.load([
            [1, 2],
            [1, 2],
            [1, 2],

        ])// different number of columns
        Matrix.hadamard(matrixA, matrixC);
        fail("Matrices with different number of columns were passed as arguments, yet no exception was thrown");
    } catch (ignore) { };

    try {
        matrixC = Matrix.load([
            [1, 2, 3],
            [1, 2, 3],
        ])// different number of rows
        Matrix.hadamard(matrixA, matrixC);
        fail("Matrices with different number of columns were passed as arguments, yet no exception was thrown");
    } catch (ignore) { };

    try {
        matrixC = Matrix.load([
            [1, 2],
            [1, 2],
        ])// different number of rows
        Matrix.hadamard(matrixA, matrixC);
        fail("Matrices with different number of columns were passed as arguments, yet no exception was thrown");
    } catch (ignore) { };

    let vec1: Matrix;
    let vec2: Matrix;

    vec1 = Matrix.fromArray([1, 2, 3]);
    vec2 = Matrix.fromArray([4, 2, 3]);
    result = Matrix.hadamard(vec1, vec2);
    expected = Matrix.fromArray([4, 4, 9]);


    assertMatrixEquals(expected, result);

    try {
        vec1 = Matrix.fromArray([1, 2, 3]);
        vec2 = Matrix.fromArray([4, 3]);
        Matrix.hadamard(vec1, vec2);
        fail("Vectors of different sizes were passed as arguments, yet no exception was thrown");
    } catch (ignored) { };


}

function testLoad() {
    console.log("\n\tTest load");
    let expected = new Matrix(2, 3);
    expected.setData([
        [1, 2, 3],
        [2, 3, 4],
    ])

    let result = Matrix.load([
        [1, 2, 3],
        [2, 3, 4],
    ])

    assertMatrixEquals(expected, result);

}

function testMap() {
    console.log("\n\tTest map (static)");

    let fn = (v: number, i: number, j: number) => i === j ? 1 : 0;

    let m = Matrix.random(3, 3)
    let expected = new Matrix(3, 3);
    expected.setData([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ])

    let result = Matrix.map(m, fn);

    assertMatrixEquals(expected, result);
    
    let dsigmoid = (v:number,i:number,j:number)=>v*(1-v);
    
}

function testMult() {
    console.log("\n\tTest mult");

    let m1 = new Matrix(2, 3);
    m1.setData([
        [1, 2, 3],
        [1, 1, 1],
    ])

    let m2 = new Matrix(3, 3);
    m2.setData([
        [1, 1, 1],
        [1, 0, 1],
        [3, 1, 1],
    ])

    let result = Matrix.mult(m1, m2);

    let expected = new Matrix(2, 3);
    expected.setData([
        [12, 4, 6],
        [5, 2, 3]
    ]);


    assertMatrixEquals(expected, result);

    m1 = new Matrix(2, 4);
    m1.setData([
        [-2, 3, 1, 7],
        [1, 4, 0, -1]
    ])

    m2 = new Matrix(4, 3);
    m2.setData([
        [-1, 1, 2],
        [2, 3, -2],
        [1, -1, 1],
        [3, 1, 0]
    ])

    expected = new Matrix(2, 3);
    expected.setData([
        [30, 13, -9],
        [4, 12, -6]
    ]);

    result = Matrix.mult(m1, m2);

    assertMatrixEquals(expected, result);


    m1 = new Matrix(3, 3);
    m1.setData([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);

    m2 = new Matrix(3, 1);
    m2.setData([
        [3],
        [2],
        [1],
    ])

    expected = new Matrix(3, 1);
    expected.setData([
        [10],
        [28],
        [46]
    ])

    result = Matrix.mult(m1, m2);
    assertMatrixEquals(expected, result);
}

function testRandom() {
    console.log("\n\tTest random");

    let newMatrix = Matrix.random(2, 3);
    newMatrix.print("Should be random");
}

function testToArrayTwoDimensional(){
    console.log("\n\tTest toArray Two dimensional");
    //Test wether or not the data is maintained
    let expected = Matrix.load([
        [1,2,3],
        [4,5,6],
    ])

    let result = Matrix.load(Matrix.toArray(expected));

    assertMatrixEquals(expected,result)
}
function testToArrayOneDimensional() {
    console.log("\n\tTest toArray one dimensional");



    let m = Matrix.load([
        [1,2,3,4]
    ])

    let expected = [[1, 2, 3, 4]];

    let result = Matrix.toArray(m);

    assertArrayEquals(expected, result);

    m = new Matrix(1, 1);
    m.setData([
        [2]
    ]);

    expected = [[2]];
    result = Matrix.toArray(m);
    assertArrayEquals(expected, result);

   
}

function testTranspose() {
    console.log("\n\tTest transpose");

    let rows = 3;
    let cols = 2;
    let m = new Matrix(rows, cols);
    m.setData([
        [1, 2],
        [2, 3],
        [3, 1],
    ])

    let expected = new Matrix(cols, rows);//switch rows for cols
    expected.setData([
        [1, 2, 3],
        [2, 3, 1]
    ])
    let result = Matrix.transpose(m);
    assertMatrixEquals(expected, result);

    //test transpose for array

    rows = 4;
    cols = 1;
    m = Matrix.fromArray([1, 2, 3, 4]);
    expected = new Matrix(cols, rows);
    expected.setData([
        [1, 2, 3, 4]
    ])
    result = Matrix.transpose(m);
    assertMatrixEquals(expected, result);
}

function testFromArray() {

    console.log("\n\tTest fromArray");

    let expected = new Matrix(4, 1);
    expected.setData([
        [1], [2], [3], [4]
    ]);
    console.table(expected.data);

    let result = Matrix.fromArray([1, 2, 3, 4]);
    console.log("RESULT", result.numRows, result.numCols)
    console.table(result.data);
    assertMatrixEquals(expected, result);
}

function testClone() {
    console.log("\n\tTest clone");


    let rows = 2;
    let cols = 4;
    let m1 = new Matrix(rows, cols);
    m1.setData([
        [1, 0, 3, 1],
        [1, 0, 1, 9],
    ]);

    let result = m1.clone();

    assertMatrixEquals(result, m1);

}

function testSub() {
    console.log("\n\tTest sub");

    let m1 = Matrix.load([
        [1, 0, 0],
        [1, 0, 1],
    ]);

    let m2 = Matrix.load([
        [1, 1, 1],
        [0, 0, 0],
    ]);
    let expected = Matrix.load([
        [0, -1, -1],
        [1, 0, 1]
    ]);
    let result = Matrix.sub(m1, m2);

    assertMatrixEquals(expected, result);

    let invalidMatrix = Matrix.load([
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5]
    ]);//m1 and m2 don't have the same number of columns

    try {
        Matrix.sub(invalidMatrix, m1);
    } catch (err) {
        return;
    }

    fail("Different sized matrices were subbed, yet no exception was thrown")



}
function testAdd() {
    console.log("\n\tTest add");

    let rows = 2;
    let cols = 3;
    let m1 = new Matrix(rows, cols);
    m1.setData([
        [1, 0, 0],
        [1, 0, 1],
    ]);

    let m2 = new Matrix(rows, cols);
    m2.setData([
        [1, 1, 1],
        [0, 0, 0],
    ]);

    let expected = new Matrix(rows, cols);
    expected.setData([
        [2, 1, 1],
        [1, 0, 1]
    ]);
    let result = Matrix.add(m1, m2);

    assertMatrixEquals(expected, result);

    let invalidMatrix = new Matrix(2, cols + 1);

    try {
        Matrix.add(invalidMatrix, m1);
    } catch (err) {
        return;
    }

    fail("Different sized matrices were added, yet no exception was thrown")


}

function testEquals() {
    console.log("\n\tTest equals");

    let m = new Matrix(2, 3);
    m.setData([
        [1, 0, 0],
        [1, 0, 1],
    ]);

    let equal = new Matrix(2, 3)
    equal.setData([
        [1, 0, 0],
        [1, 0, 1],
    ]);

    let differentRows = new Matrix(3, 3);
    let differentCols = new Matrix(2, 4);

    let differentMatrix = new Matrix(2, 3)
    differentMatrix.setData([
        [1, 1, 1],
        [1, 0, 1]
    ])

    assertFalse(m.equals(differentCols), "Matrices with different numcols cannot be equal")
    assertFalse(m.equals(differentRows), "Matrices with different numrows cannot be equal");
    assertFalse(m.equals(differentMatrix), "Matrices with same numcols and numrow, but with different values cannot be equal");

    assertTrue(m.equals(equal), "Equal matrices should be equal");

}
