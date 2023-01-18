//TODO: add shader for rendering curves and surfaces


//GUI VARIABLES
var curve_type = CurveManager.types;
var edit_curve = [' ', 'c1', 'c2', 'd1', 'd2'];
var mix_function = RuledSurface.mixFuncType;
var show_boundary_curves = true;
var scaleFactor = 3;
var scaleFactorMin = 1;
var scaleFactorMax = 5;
var show_rc = false;
var show_rd = false;
var show_patch = true;
var show_rcd = false;
var orbit_control = false;
var show_corners = false;
var visible = true;
var gui

//Curve manager class
var curveMgr;
//ruled surface
var rc, rd;
//patch
var patch;

var deltas = [0.03, 0.0175, 0.012, 0.0095, 0.008];
var r_camera;

function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create Layout GUI
  gui = createGui('Coons patch');
  gui.addGlobals( 'scaleFactor',
                  'curve_type',
                  'show_boundary_curves',
                  'edit_curve',
                  'mix_function',
                  'show_rc',
                  'show_rd',
                  'show_rcd',
                  'show_patch', 
                  'orbit_control',
                  'show_corners'
                  );

  curveMgr = new CurveManager(curve_type);

  //init default ruled surface
  rc = new RuledSurface(mix_function, curveMgr.getc1(), curveMgr.getc2(), false, false);
  rd = new RuledSurface(mix_function, curveMgr.getd1(), curveMgr.getd2(), false, true);

  //init default patch
  patch = new Patch(rc, rc.mixFuncs, rd, rd.mixFuncs, curveMgr.vertices);

  r_camera = camera();
  frameRate(30)

  //noLoop();
}

function draw() {

  curveMgr.setActiveCurve(edit_curve);
  curveMgr.setCurveType(curve_type);

  clear();

  background(125);

  if(orbit_control)
    orbitControl(4, 4, 0);
  else{
    if(edit_curve != ' '){
        camera();
    }
  }
    

  scale(scaleFactor);
  
  if(show_boundary_curves)
    curveMgr.drawCurves(getDelta());

  if(show_corners)
    curveMgr.drawCorners();

  //draw ruled surface
  if(show_rc)
    rc.draw(getDelta());

  if(show_rd)
    rd.draw(getDelta());
  
  if(show_rcd)
    patch.drawRcd(getDelta());

  //show patch
  if(show_patch)
    patch.draw(getDelta());
}

function getDelta(){
  return deltas[scaleFactor-1];
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