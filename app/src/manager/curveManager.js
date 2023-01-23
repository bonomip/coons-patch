class CurveManager {
    constructor(type) {
        this.curveType = type;
        this.initVertices();
        this.createCurves();
    }

    createCurves(){

        this.curves = []

        switch(this.curveType){
            case 'Bezier (Cubic)':
                this.createBezierCurves();
                break;
            case 'Bezier Rational (Cubic)':
                this.createBezierRationalCurves();
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
                [1, 0])
            );
        this.curves.push(
            new BezierCurve(
                this.vertices[3], 
                this.vertices[0], 
                [0, 0])
            );
        this.curves.push(
            new BezierCurve(
                this.vertices[0], 
                this.vertices[1], 
                [0, 1])
            );
        this.curves.push(
            new BezierCurve(
                this.vertices[2], 
                this.vertices[1], 
                [1, 1])
            );
    }

    createBezierRationalCurves(){
        this.curves.push(
            new BezierRationalCurve(
                this.vertices[3], 
                this.vertices[2], 
                [1, 0])
            );
        this.curves.push(
            new BezierRationalCurve(
                this.vertices[3], 
                this.vertices[0], 
                [0, 0])
            );
        this.curves.push(
            new BezierRationalCurve(
                this.vertices[0], 
                this.vertices[1], 
                [0, 1])
            );
        this.curves.push(
            new BezierRationalCurve(
                this.vertices[2], 
                this.vertices[1], 
                [1, 1])
            );
    }

    drawCurves(delta, rot){
        this.curves.forEach(element => {
            element.draw(delta);
        });

        if(this.activeCurve && !rot){
            this.activeCurve.drawEdit();
        }
            
        
    }

    drawCorners(){

        var uv = [];
        for(var i = 0; i < 4; i++){
            strokeWeight(20)
            uv = this.curves[(i+2)%4].col_uv;
            stroke(switchColor(uv[0], uv[1]));
            point(this.vertices[i]);
        }
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

    setCurveType(type, surfMgr){
        if(this.curveType!=type){
            this.curveType=type;
            this.initVertices();
            this.createCurves();
            surfMgr.updateCurves(this);
        }
    }

    initVertices(){
        this.vertices = [   createVector(-50,-50, 0), //top left
                            createVector(50,-50, 0),  //top right
                            createVector(50, 50, -50), //bottom right
                            createVector(-50, 50, 0) ] //bottom left
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
        if(boundary_curve_type == CurveManager.RATIONAL && this.activeCurve){
            this.activeCurve.setWeights(weights['w0'], weights['w1'], weights['w2'], weights['w3']);
        };
    }

    mousePressed(rot){
        if(this.activeCurve && !rot){
            this.activeCurve.clicked();
            loop();
        }
            
    }

    mouseDragged(rot){
        if(this.activeCurve && !rot){
            this.activeCurve.dragged();
        }
            
    }

    mouseReleased(rot){
        if(this.activeCurve && !rot){
            this.activeCurve.released();
            noLoop();
        }
    }
}

CurveManager.RATIONAL = 'Bezier Rational (Cubic)';
CurveManager.types = ['Bezier (Cubic)', CurveManager.RATIONAL];