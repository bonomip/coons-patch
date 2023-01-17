class CurveManager {
    constructor(type) {

        this.curves = [] // this struct will store 
                         // four function describing the curves
        var c1_col = color('#e400ff')
        var c2_col = color('#00FFFF')
        var d1_col = color('#0000FF')
        var d2_col = color('#FFFFFF')

        this.vertices = [   createVector(-50,-50, 0), //top left
                            createVector(50,-50, 0),  //top right
                            createVector(50, 50, 0), //bottom right
                            createVector(-50, 50, 0) ] //bottom left

        switch(type){
                case 'Bezier':
                    this.curves.push(new BezierCurve(this.vertices[3], this.vertices[2], c1_col));
                    this.curves.push(new BezierCurve(this.vertices[3], this.vertices[0], d1_col));
                    this.curves.push(new BezierCurve(this.vertices[0], this.vertices[1], c2_col));
                    this.curves.push(new BezierCurve(this.vertices[2], this.vertices[1], d2_col));
                break;
            default:
                console.log("Invalid curve type");
                break;
        }
    }

    drawCurves(){
        this.curves.forEach(element => {
            element.draw();
        });

        if(this.activeCurve)
            this.activeCurve.drawEdit();
        
    }

    drawCorners(){
    strokeWeight(20)
    stroke(this.curves[2].color)
    point(this.vertices[0])

    stroke(this.curves[3].color)
    point(this.vertices[1])

    stroke(this.curves[0].color)
    point(this.vertices[2])

    stroke(this.curves[1].color)
    point(this.vertices[3])
    }

    setActiveCurve(id){
        switch(id){
            case 'c1':
                this.activeCurve = this.curves[0];
                break;
            case 'c2':
                this.activeCurve = this.curves[2];
                break;
            case 'd1':
                this.activeCurve = this.curves[1];
                break;
            case 'd2':
                this.activeCurve = this.curves[3];
                break;
            default:
                this.activeCurve = false;
          }
    }

    mousePressed(){
        if(this.activeCurve)
            this.activeCurve.clicked();
    }

    mouseDragged(){
        if(this.activeCurve)
            this.activeCurve.dragged();
    }

    mouseReleased(){
        if(this.activeCurve)
            this.activeCurve.released();
    }
}

CurveManager.types = ['Bezier', 'polynomials1', 'polynomials2'];