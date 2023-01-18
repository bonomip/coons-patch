//TODO: add shader for rendering curves and surfaces


//GUI VARIABLES
var curve_type = CurveManager.types;
var edit_curve = [' ', 'c1', 'c2', 'd1', 'd2'];
var function_f = SurfaceManager.mixFuncType;
var function_g = SurfaceManager.mixFuncType;
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
var surfMgr;

var deltas = [0.03, 0.0175, 0.012, 0.0095, 0.008];

function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create Layout GUI
  

  gui = p5.prototype.createGui('Coons patch');

  gui.addGlobals( 'scaleFactor',
                  'curve_type',
                  'show_boundary_curves',
                  'edit_curve',
                  'function_f',
                  'function_g',
                  'show_rc',
                  'show_rd',
                  'show_rcd',
                  'show_patch', 
                  'show_corners'
                  );

  gui.prototype.addBoolean('orbit_control', orbit_control, myOrbitCallBack)

  curveMgr = new CurveManager(curve_type);
  surfMgr = new SurfaceManager(function_f, function_g, curveMgr);

  frameRate(30)

  noLoop();
}

function draw() {
  
  clear();
  background(125);

  if(orbit_control){
    orbitControl(4, 4, 0);
  } else {
    if(edit_curve != ' ')
      camera();
  }

  scale(scaleFactor);
  
  //curves
  curveMgr.setActiveCurve(edit_curve);
  curveMgr.setCurveType(curve_type);

  if(show_boundary_curves)
    curveMgr.drawCurves(getDelta());
  if(show_corners)
    curveMgr.drawCorners();

  //surfaces
  surfMgr.updateDelta(getDelta());
  surfMgr.updateMixFunction(function_f, function_g);

  if(show_rc)
    surfMgr.drawRc();
  if(show_rd)
    surfMgr.drawRd();
  if(show_rcd)
    surfMgr.drawRcd();
  if(show_patch)
    surfMgr.drawPatch();
}

function myOrbitCallBack(value) {  

  orbit_control = value;

  if(value)
    loop();
  else
    noLoop();
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
  if(orbit_control)
    gui.prototype.setValue('orbit_control', false)
  
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