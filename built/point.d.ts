export default class Point {
    x: number;
    y: number;
    isAnswerCorrect: boolean;
    radius: number;
    highlight: boolean;
    highlightOffset: number;
    label: number;
    constructor(maxX: number, maxY: number);
    setLabel(x: number, y: number): void;
    setAnswer(answer: number): void;
    render(p5: any): void;
    coordinates(): [number, number];
}
