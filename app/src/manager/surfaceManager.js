

class SurfaceManager {
    
    constructor(f, g, curveMgr){
        this.f = f;
        this.g = g;
        this.rc = new RuledSurface(this.f, curveMgr.getc1(), curveMgr.getc2(), false, false);
        this.rd = new RuledSurface(this.g, curveMgr.getd1(), curveMgr.getd2(), false, true);
        this.patch = new Patch(this.rc, this.rc.mixFuncs, this.rd, this.rd.mixFuncs, curveMgr.vertices);
    }

    updateDelta(delta){
        this.delta = delta;
    }

    

    updateMixFunction(f, g){
        if(this.f != f){
            this.f = f;
            this.rc.switchMixFunction(f)
            this.patch.updateF(this.rc.mixFuncs);
            SurfaceManager.checkMixFunction(this.rc.mixFuncs);
        }
            
        if(this.g != g){
            this.g = g;
            this.rd.switchMixFunction(g)
            this.patch.updateG(this.rd.mixFuncs);
            SurfaceManager.checkMixFunction(this.rd.mixFuncs);
        }
    }

    drawRc(){
        this.rc.draw(this.delta);
    }

    drawRd(){
        this.rd.draw(this.delta);
    }

    drawRcd(){
        this.patch.drawRcd(this.delta);
    }

    drawPatch(){
        this.patch.draw(this.delta);
    }

}

SurfaceManager.checkMixFunction = function(fs){
    var f1 = fs[0];
    var f2 = fs[1];
    console.assert(f1(0) == 1, "f1(0) = ".concat(f1(0)));
    console.assert(f1(1) == 0, "f1(1) = ".concat(f1(1)));
    var sum
    for(t = 0; t <= 1; t += 0.01){
        sum = f1(t) + f2(t);
        console.assert( sum  == 1, "f1(x)+f2(x) = ".concat(sum).concat(" @ ".concat(t)));
    } 
}

SurfaceManager.LINEAR = 'Linear';
SurfaceManager.BERSTEIN3 = 'Berstein_3';
SurfaceManager.BERSTEIN15 = 'Berstein_15';

SurfaceManager.mixFuncType = [SurfaceManager.LINEAR, SurfaceManager.BERSTEIN3, SurfaceManager.BERSTEIN15];

SurfaceManager.mixFuncs = {
    'Linear' : [
        function(t){return (1-t);},
        function(t){return t;}
    ],
    'Berstein_3' : [
        function(t){ return BernsteinPolynomial.three1(t);},
        function(t){ return BernsteinPolynomial.three2(t);},
    ],
    'Berstein_15' : [
        function(t){ return BernsteinPolynomial.fiveteen1(t);},
        function(t){ return BernsteinPolynomial.fiveteen2(t);},
    ],
}