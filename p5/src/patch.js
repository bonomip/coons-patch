class Patch{

    constructor(rc, fs, rd, gs, vertices, ccolor){
        //first ruled surface with its mix functions
        this.rc = rc;
        this.f1 = fs['f1'];
        this.f2 = fs['f2'];
        //second ruled surface with its mix functions
        this.rd = rd;
        this.g1 = gs['f1'];
        this.g2 = gs['f2'];
        //matrix of corners of the patch
        this.mat = [ [ vertices[3], vertices[2] ],
                     [ vertices[0], vertices[1]]];

        //style variables
        this.delta = 0.01;
        this.color = ccolor ? ccolor : color('#FFFAAA');
    }


    rcd(u, v){
        var x_hat, y_hat;

        x_hat = this.mat[0][0].copy().mult(this.f1(u))
                            .add(this.mat[0][1].copy().mult(this.f2(u)));
        y_hat = this.mat[1][0].copy().mult( this.f1(u) )
                            .add(this.mat[1][1].copy().mult(this.f2(u)));

        return x_hat.mult(this.g1(v)).add(y_hat.mult(this.g2(v)));
    }

    func(u, v){
       return (this.rd.func(u, v).add(this.rc.func(u, v))).sub(this.rcd(u, v))
    }


    drawRcd(){
        noFill();
        for (let v = 0; v <= 1; v += this.delta) {
            for (let u = 0; u <= 1; u += this.delta) {  
                //stroke(this.color);
                stroke(u * 300, v * 300, 255);
                strokeWeight(2);
                let p = this.rcd(u, v);
                point(p.x, p.y);
            }
        }
    }

    draw(){
        noFill();
        for (let v = 0; v <= 1; v += this.delta) {
            for (let u = 0; u <= 1; u += this.delta) {  
                //stroke(this.color);
                stroke(u * 300, v * 300, 255);
                strokeWeight(2);
                let p = this.func(u, v);
                point(p.x, p.y);
            }
        }
    }

}