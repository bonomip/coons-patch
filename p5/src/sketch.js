
//GUI VARIABLES
var curve_type = CurveManager.types;
var edit_curve = [' ', 'c1', 'c2', 'd1', 'd2'];
var mix_function = RuledSurface.mixFuncType;
var show_boundary_curves = true;
var show_rc = false;
var show_rd = false;
var show_patch = false;
var show_rcd = false;
//var orbit_control = false;
var show_corners = true;
var visible = true;
var gui

var vertices = [];

//Curve variables
var curveMgr;
var c1, c2, d1, d2;
var active_curve;
var c1_col, c2_col, d1_col, d2_col

//ruled surface
var rc, rd;

//patch
var patch;

//scale factor
let scaleFactor = 3;


function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create Layout GUI
  gui = createGui('Coons patch');
  gui.addGlobals( 'curve_type',
                  'show_boundary_curves',
                  'edit_curve',
                  'mix_function',
                  'show_rc',
                  'show_rd',
                  'show_rcd',
                  'show_patch', 
                  //'orbit_control',
                  'show_corners'
                  );

  curveMgr = new CurveManager(curve_type);
  let curves = curveMgr.curves;
  vertices = curveMgr.vertices;

  // c1 = curves[0];
  // d1 = curves[1];
  // c2 = curves[2];
  // d2 = curves[3];

  //init default ruled surface
  rc = new RuledSurface(mix_function, curves[0], curves[2], false, false);
  rd = new RuledSurface(mix_function, curves[1], curves[3], false, true);

  //init cefault patch
  patch = new Patch(rc, rc.mixFuncs, rd, rd.mixFuncs, vertices);

  frameRate(30)

  //noLoop();
}

function draw() {

  curveMgr.setActiveCurve(edit_curve);

  clear();

  background(125);

  // if(orbit_control)
  //   orbitControl();

  scale(scaleFactor);
  
  if(show_boundary_curves)
    curveMgr.drawCurves();

  if(show_corners){
    curveMgr.drawCorners();
  }

  //draw ruled surface
  if(show_rc)
    rc.draw();

  if(show_rd)
    rd.draw();
  
  if(show_rcd)
    patch.drawRcd();

  //show patch
  if(show_patch)
    patch.draw();
  
    //edit curve
  if(active_curve)
    active_curve.drawCp();
}

function getRelativeMousePos(){
  return [(mouseX-width/2)/scaleFactor, (mouseY-height/2)/scaleFactor];
}

function mousePressed() {
  curveMgr.mousePressed();
}

function mouseDragged(){
  curveMgr.mouseDragged();
}

function mouseReleased(){
  curveMgr.mouseReleased();
}

// check for keyboard events
function keyPressed() {
  switch(key) {
    // type [F1] to hide / show the GUI
    case 'p':
      visible = !visible;
      if(visible) gui.show(); else gui.hide();
      break;
  }
}