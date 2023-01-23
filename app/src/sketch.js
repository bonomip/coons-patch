//TODO: add shader for rendering curves and surfaces


//GUI VARIABLES
var boundary_curve_type = CurveManager.types;
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
var rotation = false;
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

  gui.addGlobals( 'boundary_curve_type',
                  'function_f',
                  'function_g',
                  'show_patch', 
                  'scaleFactor',
                  'edit_curve',
                  'show_boundary_curves',
                  'show_rc',
                  'show_rd',
                  'show_rcd',
                  'show_corners'
                  );

  gui.prototype.addBoolean('rotation', rotation, myOrbitCallBack)

  curveMgr = new CurveManager(boundary_curve_type);
  surfMgr = new SurfaceManager(function_f, function_g, curveMgr);

  frameRate(30)

  noLoop();
}

function draw() {
  
  clear();
  background(125);

  if(rotation){
    orbitControl(4, 4, 0);
  } else {
    if(edit_curve != ' ')
      camera();
  }

  scale(scaleFactor);
  
  //curves
  curveMgr.setActiveCurve(edit_curve);
  curveMgr.setCurveType(boundary_curve_type);

  if(show_boundary_curves)
    curveMgr.drawCurves(getDelta(), rotation);
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
  rotation = value;

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
  curveMgr.mousePressed(rotation);
}

function mouseDragged(){
  curveMgr.mouseDragged(rotation);
}

function mouseReleased(){
  if(rotation)
    gui.prototype.setValue('rotation', false)
  
  curveMgr.mouseReleased(rotation);
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