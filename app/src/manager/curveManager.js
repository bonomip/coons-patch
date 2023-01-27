class CurveManager {
    constructor(type) {
        this.curveType = type;
        this.initVertices();
        this.createCurves();
    }

    createCurves(){

        this.curves = []
        var quadratic = true;
        var rational = false;

        switch(this.curveType){
            case 'Bezier (Cubic)':
                quadratic = false;
                rational = false;
                break;
            case 'Bezier Rational (Quadratic)':
                quadratic = true;
                rational = true;
                break;
            case 'Bezier Rational (Cubic)':
                quadratic = false;
                rational = true;
                break;
        default:
            break;
        }

        this.curves.push( new BezierCurve( this.vertices[3], this.vertices[2], 
                [1, 0], rational, quadratic) );
        this.curves.push( new BezierCurve( this.vertices[3], this.vertices[0], 
                [0, 0], rational, quadratic) );
        this.curves.push( new BezierCurve( this.vertices[0], this.vertices[1], 
                [0, 1], rational, quadratic) );
        this.curves.push( new BezierCurve( this.vertices[2], this.vertices[1], 
                [1, 1], rational, quadratic) );
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
        
        if(this.activeCurve){
            this.activeCurve.setWeights(weights['w0'], weights['w1'],weights['w2'], weights['w3']);
        }
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

CurveManager.types = ['Bezier (Quadratic)', 'Bezier (Cubic)', 'Bezier Rational (Quadratic)', 'Bezier Rational (Cubic)'];