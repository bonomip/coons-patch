class BezierCurve {
    /*
    * v0, v1 {3D vectors}: vertices of the patch
    * cp1, cp2 {3D vectors}: control points of bezier curve
    */

    constructor(v0, v1, col) {
        this.cps = this.createDefaultControlPoints(v0, v1)
        this.color = col ? col : color('#FF99CC')
        this.grabbed = [false, false];
    }

    draw(delta){
        noFill();
        for (let t = 0; t <= 1.00001; t += delta) {
          stroke(this.color);
          strokeWeight(2);
          let v = this.func(t);
          point(v.x, v.y, v.z);
        }
    }

    drawEdit(){
        noFill();
        
        stroke(0, 0, 0, 1);
        circle(this.cps[1].x, this.cps[1].y, BezierCurve.cpRadius)
        circle(this.cps[2].x, this.cps[2].y, BezierCurve.cpRadius)
    }

    createDefaultControlPoints(cp0, cp3){
        let bxstep = (cp3.x - cp0.x)/3;
        let bystep = (cp3.y - cp0.y)/3;

        let flex = 50;

        if(bxstep > 0){ //horizontal
            var cp1 = createVector(cp0.x+(1*bxstep), cp0.y+(1*bystep)+(-1*flex), 0);
            var cp2 = createVector(cp0.x+(2*bxstep), cp0.y+(2*bystep)+(1*flex), 0);
        } else { //vertical
            var cp1 = createVector(cp0.x+(1*bxstep)+(-1*flex), cp0.y+(1*bystep), 0);
            var cp2 = createVector(cp0.x+(2*bxstep)+(+1*flex), cp0.y+(2*bystep), 0);
        }

        return [cp0, cp1, cp2, cp3];
    }

    //curve function
    func(t){
        return this.cubic(this.cps[0], this.cps[1], this.cps[2], this.cps[3], t);
    }

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


    //MOUSE event listener

    clicked() {
        var p = getRelativeMousePos();
        var d = dist(p[0], p[1], this.cps[1].x, this.cps[1].y)

        if(d < BezierCurve.cpRadius){
            this.grabbed[0] = true;
        } else {
            
            d = dist(p[0], p[1], this.cps[2].x, this.cps[2].y)
            
            if(d < BezierCurve.cpRadius){
                this.grabbed[1] = true;
            }
        }
    }

    released(){
        this.grabbed = [false, false];
    }

    dragged(){
        if(this.grabbed[0]){
            var p = getRelativeMousePos();
            this.cps[1].x = p[0];
            this.cps[1].y = p[1];
            return true;
        } else if (this.grabbed[1]) {
            var p = getRelativeMousePos();
            this.cps[2].x = p[0];
            this.cps[2].y = p[1];
            return true;
        }
    }


}


BezierCurve.cpRadius = 5;