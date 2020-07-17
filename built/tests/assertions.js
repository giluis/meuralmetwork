const ASSERT_FALSE_DEFAULT_MESSAGE = "sHOUld Be fALsE";
const ASSERT_TRUE_DEFAULT_MESSAGE = "SHoULd Be TRuE";
export function fail(message) {
    throw message;
}
export function assertFalse(bool, msg) {
    if (bool)
        throw `assertFalse failed: ${msg || ASSERT_FALSE_DEFAULT_MESSAGE}`;
}
export function assertTrue(bool, msg) {
    if (!bool)
        throw `assertTrue failed: ${msg || ASSERT_TRUE_DEFAULT_MESSAGE}`;
}
export function assertMatrixEquals(expected, result) {
    if (!expected.equals(result))
        throw `Matrices were not equal -> \n ${expected.print("Expected")}, ${result.print("Result")}`;
}
export function assertNumEquals(expected, result) {
    if (expected !== result)
        throw `assertNumEquals failed - Numbers were not the same: ${expected} !== ${result}`;
}
export function assertStringEquals(expected, result) {
    if (expected !== result) {
        throw `assertStringEquals failed - Strings were not the same -> ${expected} !== ${result}`;
    }
}
export function assertArrayEquals(expected, result) {
    if (expected.length !== result.length)
        throw `assertArrayEquals failed: arrays were different lengths \n expected.length -> ${expected.length} | result.length-> ${result.length}`;
    for (let i = 0; i < expected.length; i++) {
        if (expected[i] !== result[i]) {
            throw `Arrays differed: expected[${i}]->${expected[i]} | result[${i}] -> ${result[i]}`;
        }
    }
}
export function assertNumNotEquals(expected, result) {
    if (expected !== result)
        throw `assertNumNotEquals failed - Numbers were the same: ${expected} === ${result}`;
}
export function assertGreaterThan(num, min) {
    if (num <= min)
        throw `assertGreaterThan failed: ${num} <= ${min}`;
}
export function assertLesserThan(num, min) {
    if (num >= min)
        throw `assertLesserThan failed: ${num} >= ${min}`;
}
//# sourceMappingURL=assertions.js.map