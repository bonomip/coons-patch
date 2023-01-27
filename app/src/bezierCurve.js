class BezierCurve {
    /*
    * v0, v1 {3D vectors}: vertices of the patch
    * cp1, cp2 {3D vectors}: control points of bezier curve
    */
    constructor(v0, v1, col_uv, rational, quadratic) {
        this.isCubic = !quadratic;
        this.isRational = rational;

        this.cps = this.createDefaultControlPoints(v0, v1)
        this.col_uv = col_uv 
        this.grabbed = [false, false, false, false];

        this.initFunction();
    }

    initFunction(){
        if(!this.isRational){
            if(this.isCubic)
                this.func = function(t){
                    return this.cubic(this.cps[0], this.cps[1], this.cps[2], this.cps[3], t);
                };
            else 
                this.func = function(t){
                    return this.quadratic(this.cps[0], this.cps[1], this.cps[2], t);
                };
        } else {
            this.setWeights(1, 1, 1, 1);

            if(this.isCubic)
                this.func = function(t){
                    return this.berstein(t, 3);
                };
            else
                this.func = function(t){
                    return this.berstein(t, 2);
                };
        }
        
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
        for(var i = 0; i < this.cps.length; i++){
            circle(this.cps[i].x, this.cps[i].y, BezierCurve.cpRadius)
        }
    }

    createDefaultControlPoints(cp0, cp3){
        let bxstep = (cp3.x - cp0.x)/3;
        let bystep = (cp3.y - cp0.y)/3;
        let flex = 30;
        var cps = [];

        cps.push(cp0);

        if(this.isCubic){
            if(bxstep > 0){ //horizontal
                cps.push(createVector(cp0.x+(1*bxstep), cp0.y+(1*bystep)+(-1*flex), 0));
                cps.push(createVector(cp0.x+(2*bxstep), cp0.y+(2*bystep)+(1*flex), 0));
            } else {        //vertical
                cps.push(createVector(cp0.x+(1*bxstep)+(-1*flex), cp0.y+(1*bystep), 0));
                cps.push(createVector(cp0.x+(2*bxstep)+(+1*flex), cp0.y+(2*bystep), 0));
            }
        } else {
            if(bxstep > 0){ //horizontal
                if(cp0.y > 0)
                    cps.push(createVector(cp0.x+(1*bxstep), cp0.y+(1*bystep)+(-1*flex), 0));
                else
                    cps.push(createVector(cp0.x+(1*bxstep), cp0.y+(1*bystep)+flex, 0));
            } else {        //vertical
                if(cp0.x > 0)
                    cps.push(createVector(cp0.x+(1*bxstep)+(-1*flex), cp0.y+(1*bystep), 0));
                else 
                    cps.push(createVector(cp0.x+(1*bxstep)+flex, cp0.y+(1*bystep), 0));
            }
        }   

        cps.push(cp3);

        return cps;
    }

    setWeights(w0, w1, w2, w3){
        this.ws = [w0, w1, w2, w3];
    }

    // INTERPOLATION FUNCTIONS

    lerpThree(s0, s1, s2, t){
        let a1 = lerp(s0, s1, t);
        let a2 = lerp(s1, s2, t);
        let a = lerp(a1, a2, t);
        return a;
    }

    cubic(p0, p1, p2, p3, t) {
        let v1 = this.quadratic(p0, p1, p2, t);
        let v2 = this.quadratic(p1, p2, p3, t);
        let x = lerp(v1.x, v2.x, t);
        let y = lerp(v1.y, v2.y, t);
        let z = lerp(v1.z, v2.z, t)
        return createVector(x, y, z);
      }
      
    quadratic(p0, p1, p2, t) {
        let x = this.lerpThree(p0.x, p1.x, p2.x, t);
        let y = this.lerpThree(p0.y, p1.y, p2.y, t);
        let z = this.lerpThree(p0.z, p1.z, p2.z, t);
        return createVector(x, y, z);
      }

    berstein(t, n){
        var num = createVector();
        var den = 0;
        var br = 0; //berstain 
        var b = ''; //control point
        for(var i = 0; i < this.cps.length; i++){
            b = this.cps[i].copy(); 
            br = BernsteinPolynomial.B(n, i, t)
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
        for(var i = 0; i < this.cps.length; i++){
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

        for(var i = 0; i < this.cps.length; i++)
            if(this.grabbed[i]){
                var p = getRelativeMousePos();
                this.cps[i].x = p[0];
                this.cps[i].y = p[1];
                return true;
            }
    }
}


BezierCurve.cpRadius = 5;