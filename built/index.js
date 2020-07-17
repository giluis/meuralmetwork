"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var neuralnetwork_1 = require("./neuralnetwork");
var obj = {
    create: function () {
        var layerSizes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            layerSizes[_i] = arguments[_i];
        }
        return new (neuralnetwork_1.default.bind.apply(neuralnetwork_1.default, __spreadArrays([void 0], layerSizes)))();
    }
};
exports.default = obj;
//# sourceMappingURL=index.js.map