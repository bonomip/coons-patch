class CurveManager {
    constructor(type) {

        this.curveType = type;
        this.curves = [] // this struct will store 
                         // four function describing the curves
        this.c1_col = color('#e400ff')
        this.c2_col = color('#00FFFF')
        this.d1_col = color('#0000FF')
        this.d2_col = color('#FFFFFF')

        this.vertices = [   createVector(-50,-50, 0), //top left
                            createVector(50,-50, 0),  //top right
                            createVector(50, 50, -50), //bottom right
                            createVector(-50, 50, 0) ] //bottom left

        this.createCurves();
    }

    createCurves(){
        switch(this.curveType){
            case 'Bezier':
                this.createBezierCurves();
                break;
            case 'Polynomial':
                this.createPolynomialCurves();
                break;
        default:
            console.log("Invalid curve type");
            break;
        }
    }

    createBezierCurves(){
        this.curves.push(
            new BezierCurve(
                this.vertices[3], 
                this.vertices[2], 
                this.c1_col)
            );
        this.curves.push(
            new BezierCurve(
                this.vertices[3], 
                this.vertices[0], 
                this.d1_col)
            );
        this.curves.push(
            new BezierCurve(
                this.vertices[0], 
                this.vertices[1], 
                this.c2_col)
            );
        this.curves.push(
            new BezierCurve(
                this.vertices[2], 
                this.vertices[1], 
                this.d2_col)
            );
    }

    createPolynomialCurves(){
        //TODO: 
        console.log("todo!")
    }

    drawCurves(delta){
        this.curves.forEach(element => {
            element.draw(delta);
        });

        if(this.activeCurve && !orbit_control)
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

    getc1(){
        return this.curves[0];
    }

    getc2(){
        return this.curves[2];
    }

    getd1(){
        return this.curves[1];
    }

    getd2(){
        return this.curves[3];
    }

    setCurveType(type){
        if(this.curveType!=type){
            this.curveType=type;
            this.createCurves();
        }
    }

    setActiveCurve(id){
        switch(id){
            case 'c1':
                this.activeCurve = this.getc1();
                break;
            case 'c2':
                this.activeCurve = this.getc2();
                break;
            case 'd1':
                this.activeCurve = this.getd1();
                break;
            case 'd2':
                this.activeCurve = this.getd2();
                break;
            default:
                this.activeCurve = false;
          }
    }

    mousePressed(){
        if(this.activeCurve && !orbit_control)
            this.activeCurve.clicked();
    }

    mouseDragged(){
        if(this.activeCurve && !orbit_control)
            this.activeCurve.dragged();
    }

    mouseReleased(){
        if(this.activeCurve && !orbit_control)
            this.activeCurve.released();
    }
}

CurveManager.types = ['Bezier', 'Polynomial'];