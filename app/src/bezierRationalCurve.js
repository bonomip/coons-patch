class BezierRationalCurve {
    constructor(v0, v1, col_uv) {
        this.cps = this.createDefaultControlPoints(v0, v1)
        this.col_uv = col_uv 
        this.setWeights(1, 1, 1, 1);
        this.grabbed = [false, false, false, false];
    }

    draw(delta){
        noFill();
        for (let t = 0; t <= 1.00001; t += delta) {
          stroke(switchColor(this.col_uv[0], this.col_uv[1]));
          strokeWeight(2);
          let v = this.func(t);
          point(v.x, v.y, v.z);
        }
    }

    drawEdit(){
        noFill();
        stroke(0, 0, 0, 1);
        for(var i = 0; i < 4; i++) 
            circle(this.cps[i].x, this.cps[i].y, BezierCurve.cpRadius)
    }

    createDefaultControlPoints(cp0, cp3){
        let bxstep = (cp3.x - cp0.x)/3;
        let bystep = (cp3.y - cp0.y)/3;

        let flex = 50;

        if(bxstep > 0){ //horizontal
            var cp1 = createVector(cp0.x+(1*bxstep), cp0.y+(1*bystep)+(-1*flex), 0);
            var cp2 = createVector(cp0.x+(2*bxstep), cp0.y+(2*bystep)+(1*flex), 0);
        } else {        //vertical
            var cp1 = createVector(cp0.x+(1*bxstep)+(-1*flex), cp0.y+(1*bystep), 0);
            var cp2 = createVector(cp0.x+(2*bxstep)+(+1*flex), cp0.y+(2*bystep), 0);
        }

        return [cp0, cp1, cp2, cp3];
    }

    setWeights(w0, w1, w2, w3){
        this.ws = [w0, w1, w2, w3];
    }

    //curve function
    func(t){
        return this.cubic(t);
    }

    cubic(t){
        var num = createVector();
        var den = 0;
        var br = 0; //berstain 
        var b = ''; //control point
        for(var i = 0; i < 4; i++){
            b = this.cps[i].copy(); 
            br = BernsteinPolynomial.B(3, i, t)
            num.add(b.mult(br).mult(this.ws[i]));
            den += this.ws[i]*br;
        }
        return num.div(den);
    }


    //MOUSE event listener

    hasClickedOn(cp){
        var p = getRelativeMousePos();
        return dist(p[0], p[1], cp.x, cp.y) < BezierCurve.cpRadius;
    }

    clicked() {
        for(var i = 0; i < 4; i++){
            if(this.hasClickedOn(this.cps[i])){
                this.grabbed[i] = true;
                return;
            }
        }
    }

    released(){
        this.grabbed = [false, false, false, false];
    }

    dragged(){

        for(var i = 0; i < 4; i++)
            if(this.grabbed[i]){
                var p = getRelativeMousePos();
                this.cps[i].x = p[0];
                this.cps[i].y = p[1];
                return true;
            }
    }
}


BezierCurve.cpRadius = 5;