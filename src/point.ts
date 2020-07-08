export default class Point {
    x: number;
    y: number;
    isAnswerCorrect: boolean;
    radius: number;
    highlight: boolean;
    highlightOffset: number;
    label: number;

    constructor(maxX:number, maxY:number) {
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

    setLabel(x:number, y:number):void {
        this.label = 2 * x > y ? 1 : -1;
    }

    setAnswer(answer:number):void {
        this.isAnswerCorrect = answer === this.label;
    }

    render(p5) {
       
        let strokeColor = this.isAnswerCorrect ? [0, 255, 0] : [255, 0, 0];
        let diameter = this.radius*2;
        diameter = this.highlight?diameter*this.highlightOffset:diameter;
        
        p5.stroke(...strokeColor);
        p5.fill(this.label===1?0:255);
        p5.ellipse(this.x, this.y, diameter,diameter);

        this.highlight = false;

    }

    coordinates():[number,number] {
        return [this.x, this.y];
    }
}


function highlightPoint(point:Point){
	point.highlight = true;
	console.log(`Highlighted point at ${point.x},${point.y}`)
}

function getMatchingPoint(x:number,y:number,points:Point[]){
	let radius = points[0].radius;
	for(let i =0; i < points.length;i++){
		if(Math.abs(x-points[i].x)< radius &&Math.abs(y-points[i].y)<radius){
			return points[i];
		}
	}
}