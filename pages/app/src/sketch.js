//TODO: add shader for rendering curves and surfaces

//GUI VARIABLES
var boundary_curve_type = CurveManager.types;
var edit_curve = [' ', 'c1', 'c2', 'd1', 'd2'];
var show_edit_menu = false;
let weights = {
  'w0' : 1,
  'w0Min' : 0.1,
  'w0Max' : 5,
  'w0Step' : 0.2,

  'w1' : 1,
  'w1Min' : 0.1,
  'w1Max' : 5,
  'w1Step' : 0.2,

  'w2' : 1,
  'w2Min' : 0.1,
  'w2Max' : 5,
  'w2Step' : 0.2,

  'w3' : 1,
  'w3Min' : 0.1,
  'w3Max' : 5,
  'w3Step' : 0.2
}
var uv_colors = ['Green-ish', 'Blue-ish', 'Colorfull'];
var function_f = SurfaceManager.mixFuncType;
var function_g = SurfaceManager.mixFuncType;
var show_boundary_curves = false;
var scaleFactor = 3;
var scaleFactorMin = 1;
var scaleFactorMax = 5;
var show_rc = false;
var show_rd = false;
var show_patch = true;
var show_rcd = false;
var move_view_point = false;
var show_corners = false;
var visible = true;
var gui;
var edit_gui;

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
                  'uv_colors');
  gui.prototype.addBoolean('move_view_point', move_view_point, myOrbitCallBack);
  gui.prototype.addBoolean('show_edit_menu', show_edit_menu, myShowMenuCallBack);

  createEditMenu();

  curveMgr = new CurveManager(boundary_curve_type);
  surfMgr = new SurfaceManager(function_f, function_g, curveMgr);

  frameRate(30)

  noLoop();
}

function createEditMenu(){
  edit_gui = p5.prototype.createGui('Curve edit menu').setPosition(width - 220, 20);
  edit_gui.addGlobals('edit_curve');
  edit_gui.addObject(weights);
  edit_gui.addGlobals( 'show_boundary_curves',
                  'show_rc',
                  'show_rd',
                  'show_rcd',
                  'show_corners');
                  
  myShowMenuCallBack(show_edit_menu);
}

function draw() {
  
  clear();
  background(125);

  if(move_view_point){
    orbitControl(4, 4, 0);
  } else {
    if(edit_curve != ' '){
      camera();
      edit_gui.prototype.setValue('show_boundary_curves', true);
    } 
  }

  scale(scaleFactor);
  
  //curves
  curveMgr.setCurveType(boundary_curve_type, surfMgr)
  curveMgr.setActiveCurve(edit_curve);
  

  if(show_boundary_curves)
    curveMgr.drawCurves(getDelta(), move_view_point);
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

function myShowMenuCallBack(value) {
    show_edit_menu = value;
    if(show_edit_menu) edit_gui.show(); else edit_gui.hide();
}

function myOrbitCallBack(value) {  
  move_view_point = value;

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
  curveMgr.mousePressed(move_view_point);
}

function mouseDragged(){
  curveMgr.mouseDragged(move_view_point);
}

function mouseReleased(){
  if(move_view_point)
    gui.prototype.setValue('move_view_point', false)
  
  curveMgr.mouseReleased(move_view_point);
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

function switchColor(u, v){
  switch (uv_colors){
    case 'Green-ish':
      return color(u * 300, 255, v * 255);
    case 'Blue-ish':
      return color(u * 300, v * 300, 255);
    default:
      return color(255, u * 300, v * 300);
  }
}