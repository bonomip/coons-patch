class RuledSurface {

    constructor(mixType, c1, c2, inv){
        this.switchMixFunction(mixType);
        this.c1 = c1;
        this.c2 = c2;
        this.inv = inv;
    }

    switchMixFunction(type){

        if( Object.keys(SurfaceManager.mixFuncs).includes(type) )
            this.mixFuncs = SurfaceManager.mixFuncs[type];
        else
            alert("invalid mix function type: ".concat(type));
    }

    draw(delta){
        noFill();
        for (let v = 0; v <= 1; v += delta) {
            for (let u = 0; u <= 1; u += delta) {  
                stroke(switchColor(u, v));
                strokeWeight(2);
                let p = this.func(u, v);
                point(p.x, p.y, p.z);
            }
        }

    }

    func(u, v){
        return  this.inv ?
                    //Rd 
                    this.c1.func(v).mult(this.mixFuncs[0](u))
                    .add(this.c2.func(v).mult(this.mixFuncs[1](u)))
                    : 
                    //Rc
                    this.c1.func(u).mult(this.mixFuncs[0](v))
                    .add(this.c2.func(u).mult(this.mixFuncs[1](v))); 
    }

}