class RuledSurface {

    constructor(mixType, c1, c2, ccolor, inv){

        switch(mixType){
            case 'Linear':
                this.mixFuncs = RuledSurface.linear;
                break;
            default:
                this.mixFuncs = RuledSurface.linear;
        }

        this.c1 = c1;
        this.c2 = c2;
        this.inv = inv;
        this.color = ccolor ? ccolor : color('#FFFFFF')
    }

    draw(delta){
        noFill();
        for (let v = 0; v <= 1; v += delta) {
            for (let u = 0; u <= 1; u += delta) {  
                //stroke(this.color);
                stroke(u * 300, v * 300, 255);
                strokeWeight(2);
                let p = this.func(u, v);
                point(p.x, p.y, p.z);
            }
        }

    }

    func(u, v){
        return  this.inv ?
                    //Rd 
                    this.c1.func(v).mult(this.mixFuncs['f1'](u))
                    .add(this.c2.func(v).mult(this.mixFuncs['f2'](u)))
                    : 
                    //Rc
                    this.c1.func(u).mult(this.mixFuncs['f1'](v))
                    .add(this.c2.func(u).mult(this.mixFuncs['f2'](v))); 
    }

}

RuledSurface.mixFuncType = ['Linear'];

/**
*
* @param {float} v - must be between 0 and 1;
*
*/
RuledSurface.linear_f1 = function(v){
    return (1-v);
}

/**
*
* @param {float} v - must be between 0 and 1;
*
*/
RuledSurface.linear_f2 = function(v){
    return v;
}

RuledSurface.linear = {
    'f1' : RuledSurface.linear_f1,
    'f2' : RuledSurface.linear_f2
}