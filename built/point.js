"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = /** @class */ (function () {
    function Point(maxX, maxY) {
        this.x = Math.random() * maxX;
        this.y = Math.random() * maxY;
        this.isAnswerCorrect = false;
        this.radius = 5;
        this.highlight = false;
        this.highlightOffset = 1.5;
        if (this.x > this.y)
            this.label = 1;
        else
            this.label = -1;
    }
    Point.prototype.setLabel = function (x, y) {
        this.label = 2 * x > y ? 1 : -1;
    };
    Point.prototype.setAnswer = function (answer) {
        this.isAnswerCorrect = answer === this.label;
    };
    Point.prototype.render = function (p5) {
        var strokeColor = this.isAnswerCorrect ? [0, 255, 0] : [255, 0, 0];
        var diameter = this.radius * 2;
        diameter = this.highlight ? diameter * this.highlightOffset : diameter;
        p5.stroke.apply(p5, strokeColor);
        p5.fill(this.label === 1 ? 0 : 255);
        p5.ellipse(this.x, this.y, diameter, diameter);
        this.highlight = false;
    };
    Point.prototype.coordinates = function () {
        return [this.x, this.y];
    };
    return Point;
}());
exports.default = Point;
function highlightPoint(point) {
    point.highlight = true;
    console.log("Highlighted point at " + point.x + "," + point.y);
}
function getMatchingPoint(x, y, points) {
    var radius = points[0].radius;
    for (var i = 0; i < points.length; i++) {
        if (Math.abs(x - points[i].x) < radius && Math.abs(y - points[i].y) < radius) {
            return points[i];
        }
    }
}
//# sourceMappingURL=point.js.map