
var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

//animation
var playing = -1;
var isPlaying = false;

//eye
var radius = 1.5;
var eyeTheta = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var index = 0;

var torsoId = 0;
var neckId = 1;
var waistId = 2;
var headId  = 3;
var leftShoulderId = 4;
var rightShoulderId = 5;
var leftUpperArmId = 6;
var leftLowerArmId = 7;
var rightUpperArmId = 8;
var rightLowerArmId = 9;
var leftKneeId = 10;
var leftAnckleId= 11;
var rightKneeId= 12;
var rightAnckleId= 13;
var leftUpperLegId = 14;
var leftLowerLegId = 15;
var rightUpperLegId = 16;
var rightLowerLegId = 17;
var leftFeetId = 18;
var rightFeetId = 19;
var torso2Id = 20;
var head2Id = 21;
var leftUpperArm2Id = 22;
var rightUpperArm2Id = 23;
var bodyPositionId = 24;

var idNames = ["torsoId", "neckId", "waistId", "headId",
    "leftShoulderId", "rightShoulderId", "leftUpperArmId", "leftLowerArmId",
    "rightUpperArmId", "rightLowerArmId", "leftKneeId", "leftAnckleId",
    "rightKneeId", "rightAnckleId", "leftUpperLegId", "leftLowerLegId",
    "rightUpperLegId", "rightLowerLegId", "leftFeetId", "rightFeetId",
    "torso2Id", "head2Id", "leftUpperArm2Id", "rightUpperArm2Id", "bodyPositionId"];

var torsoHeight = 4.0;
var torsoWidth = 1.0;
var neckHeight = 0.4;
var neckWidth = 0.25;
var headHeight = 1.5;
var headWidth = 1.0;
var waistHeight = 1.0;
var waistWidth = 1.0;
var shoulderHeight = 0.25;
var shoulderWidth = 0.25;
var upperArmHeight = 2.25;
var lowerArmHeight = 1.5;
var upperArmWidth  = 0.4;
var lowerArmWidth  = 0.35;
var kneeHeight = 0.25;
var kneeWidth = 0.25;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.35;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var anckleHeight = 0.25;
var anckleWidth = 0.25;
var feetHeight = 1.0;
var feetWidth = 0.5;
var bodyPosition = 0.0;

var numTimesToSubdivide = 6;
var numNodes = 25;
//var numAngles = 11;
var angle = 0;
var theta = [0, 0, 180, 0, 0, 0, 135, 0, -135, 0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 90, 0, 0, 0, 0, 0 ];

//var numVertices = 24;

var stack = [];
var figure = [];
for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var keyFrames = new Array(); //Load/Save

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}
//--------------------------------------------

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}
function initNodes(Id) {
    var m = mat4();

    switch(Id) {
        case bodyPositionId:
        case torsoId:
        case torso2Id:
              m = translate(0.0, theta[bodyPositionId], 0.0 );
              m = mult(m,rotate(theta[torsoId], 0, 1, 0 ));
              m = mult(m,rotate(theta[torso2Id], 1, 0, 0 ));
              figure[torsoId] = createNode( m, torso, null, neckId );
              break;
        case neckId:
            m = translate(0.0, 1.4*torsoHeight+0.5*neckHeight, 0.0);
            figure[neckId] = createNode( m, neck, waistId, headId );
            break;
        case waistId:
            m = translate(0.0, -0.5*torsoHeight+0.5*waistHeight, 0.0);
            m = mult(m, rotate(theta[waistId], 1, 0, 0))
            figure[waistId] = createNode( m, waist, leftShoulderId, leftUpperLegId );
            break;
        case leftShoulderId:
            m = translate(-0.5*(torsoWidth+shoulderWidth), 1.4*torsoHeight, 0.0);
            figure[leftShoulderId] = createNode( m, leftShoulder, rightShoulderId, leftUpperArmId );
            break;
        case rightShoulderId:
            m = translate(0.4*(torsoWidth+shoulderWidth), 1.4*torsoHeight, 0.0);
            figure[rightShoulderId] = createNode( m, rightShoulder, null, rightUpperArmId );
            break;
        case headId:
            m = translate(0.0,1.2*neckHeight+headHeight, 0.0);
            m = mult(m, rotate(theta[headId], 1, 0, 0))
            //m = mult(m, rotate(theta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
            figure[headId] = createNode( m, head, null, null);
            break;
        case leftUpperArmId:
            m = translate(-1.3*(upperArmWidth+shoulderWidth), -3.5*shoulderHeight, 0.0);
        	m = mult(m, rotate(theta[leftUpperArmId], 0, 0, 1));
            figure[leftUpperArmId] = createNode( m, leftUpperArm, null, leftLowerArmId );
            break;
        case rightUpperArmId:
            m = translate(1.3*(upperArmWidth+shoulderWidth), -3.5*shoulderHeight, 0.0);
        	m = mult(m, rotate(theta[rightUpperArmId], 0, 0, 1));
            figure[rightUpperArmId] = createNode( m, rightUpperArm, null, rightLowerArmId );
            break;
        case leftUpperLegId:
            m = translate(-0.6*(waistWidth+upperLegWidth), 0.4*(upperLegHeight + waistHeight), 0.0);
        	m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
            figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftKneeId );
            break;
        case rightUpperLegId:
            m = translate(0.6*(waistWidth+upperLegWidth), 0.4*(upperLegHeight + waistHeight), 0.0);
        	m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
            figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightKneeId );
            break;
        case leftKneeId:
            m = translate(-0.15*(kneeWidth+upperLegWidth), 1.4*(upperLegHeight+kneeHeight), 0.0);
            figure[leftKneeId] = createNode( m, leftKnee, null, leftLowerLegId );
            break;
        case rightKneeId:
            m = translate(-0.15*(kneeWidth+upperLegWidth), 1.4*(upperLegHeight+kneeHeight), 0.0);
            figure[rightKneeId] = createNode( m, rightKnee, null, rightLowerLegId );
            break;
        case leftLowerArmId:
            m = translate(0.0, 1.5*upperArmHeight, 0.0);
            m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
            figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
            break;
        case rightLowerArmId:
            m = translate(0.0, 1.5*upperArmHeight, 0.0);
            m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
            figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
            break;
        case leftLowerLegId:
            m = translate(0.5*kneeWidth, 0.3*(upperLegHeight+kneeHeight), 0.0);
            m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
            figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, leftAnckleId );
            break;
        case rightLowerLegId:
            m = translate(0.5*kneeWidth, 0.3*(upperLegHeight+kneeHeight), 0.0);
            m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
            figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, rightAnckleId );
            break;
        case leftAnckleId:
            m = translate(-0.2*(anckleWidth+lowerLegWidth), 1.3*(lowerLegHeight+anckleHeight), 0.0);
            figure[leftAnckleId] = createNode( m, leftAnckle, null, leftFeetId );
            break;
        case rightAnckleId:
            m = translate(-0.2*(anckleWidth+lowerLegWidth), 1.3*(lowerLegHeight+anckleHeight), 0.0);
            figure[rightAnckleId] = createNode( m, rightAnckle, null, rightFeetId );
            break;
        case leftFeetId:
            m = translate(0.2*(anckleWidth+feetWidth), 0.5*(feetHeight+anckleHeight), 0.0);
            m = mult(m, rotate(theta[leftFeetId], 1, 0, 0));
            figure[leftFeetId] = createNode( m, leftFeet, null, null );
            break;
        case rightFeetId:
            m = translate(0.2*(anckleWidth+feetWidth), 0.5*(feetHeight+anckleHeight), 0.0);
            m = mult(m, rotate(theta[rightFeetId], 1, 0, 0));
            figure[rightFeetId] = createNode( m, rightFeet, null, null );
            break;
    }
}
function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}
function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function neck() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * neckHeight, 0.0 ));
    instanceMatrix = mult(instanceMatrix, scale4(neckWidth, neckHeight, neckWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function waist(){
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * waistHeight, 0.0 ));
  instanceMatrix = mult(instanceMatrix, scale4(waistWidth, waistHeight, waistWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function leftShoulder(){
  instanceMatrix = mult(modelViewMatrix, translate(0.5*shoulderHeight, 0.0, 0.0 ));
  instanceMatrix = mult(instanceMatrix, scale4(shoulderWidth, shoulderHeight, shoulderWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function rightShoulder(){
  instanceMatrix = mult(modelViewMatrix, translate(0.5*shoulderHeight, 0.0, 0.0 ));
  instanceMatrix = mult(instanceMatrix, scale4(shoulderWidth, shoulderHeight, shoulderWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function leftKnee(){
  instanceMatrix = mult(modelViewMatrix, translate(0.5*kneeHeight, 0.0, 0.0 ));
  instanceMatrix = mult(instanceMatrix, scale4(kneeWidth, kneeHeight, kneeWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function rightKnee(){
  instanceMatrix = mult(modelViewMatrix, translate(0.5*kneeHeight, 0.0, 0.0 ));
  instanceMatrix = mult(instanceMatrix, scale4(kneeWidth, kneeHeight, kneeWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function leftAnckle(){
  instanceMatrix = mult(modelViewMatrix, translate(0.5*anckleHeight, 0.0, 0.0 ));
  instanceMatrix = mult(instanceMatrix, scale4(anckleWidth, anckleHeight, anckleWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function rightAnckle(){
  instanceMatrix = mult(modelViewMatrix, translate(0.5*anckleHeight, 0.0, 0.0 ));
  instanceMatrix = mult(instanceMatrix, scale4(anckleWidth, anckleHeight, anckleWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function rightLowerLeg() {

    //document.getElementById("debug").innerHTML = 50;
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function rightFeet(){
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * feetHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(feetWidth, feetHeight, feetWidth) )
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}
function leftFeet(){
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * feetHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(feetWidth, feetHeight, feetWidth) )
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for(var i =0; i<index; i+=3) gl.drawArrays(gl.TRIANGLES, i, 3);
}

function triangle(a, b, c) {
     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     index += 3;
}
function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}
function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}
function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}
function cube(){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}
/*
function cylinder(a, b, c, n){

  var y = b;

  for (i =0;i<=n;i++){
    var x =  Math.cos(theta*i);
    var z =  Math.sin(theta*i);

   cylinderBotVertices.push(x, y, z); //Bottomvertices

   cylinderSideVertices.push(x, y, z); //Sidevertices along the bottom
   cylinderSideVertices.push(x, y+2, z); //Sidevertices along the top with y = 2

   cylinderTopVertices.push(x, y+2, z); //Topvertices with y = 2
}
} */

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-14.0,14.0,-14.0, 14.0,-14.0,14.0);
    modelViewMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    for(i=0; i<numNodes; i++) initNodes(i);

    document.getElementById("stop").onclick = function(){
        reset();
    };
    document.getElementById("run").onclick = function(){
      if(!isPlaying){
        document.getElementById("run").innerHTML = "Pause";
        reset();
        playing = 0;
        isPlaying = true;
        run();
      } else {
        document.getElementById("run").innerHTML = "Run";
        isPlaying = false;
        reset();
      }
    };
    document.getElementById("jump").onclick = function(){
      if(!isPlaying){
        document.getElementById("jump").innerHTML = "Pause";
        reset();
        playing = 0;
        isPlaying = true;
        jump();
      } else {
        document.getElementById("jump").innerHTML = "Jump";
        isPlaying = false;
        reset();
      }
    };
    document.getElementById("backflip").onclick = function(){
      if(!isPlaying){
        document.getElementById("backflip").innerHTML = "Pause";
        reset();
        playing = 0;
        isPlaying = true;
        backflip();
      } else {
        document.getElementById("backflip").innerHTML = "Backflip";
        isPlaying = false;
        reset();
      }
    };

    document.getElementById("SaveKF").onclick = function(){
      getKeyframe();
    };
    document.getElementById("Save").onclick = function(){
      saveAnimation(document.getElementById("saveName").value);
    };
    document.getElementById("Load").onclick = function(){
      loadAnimation(document.getElementById("loadName").value);
    };
    document.getElementById("Play").onclick = function(){
        if(!isPlaying){
            if ( keyFrames.length < numNodes*2) {
                document.getElementById("debug").innerHTML = "Not Enough Keyframes!";
                return;
            }
            document.getElementById("Play").innerHTML = "Pause";
            reset();
            playing = 0;
            isPlaying = true;
            playAnimation();
        } else {
            document.getElementById("Play").innerHTML = "Play";
            isPlaying = false;
            reset();
        }
    };
    document.getElementById("Reset").onclick = function(){
        reset();
        keyFrames = new Array();
    };

    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:
                phi -= dr;
                break;
            case 38:
                eyeTheta += dr;
                break;
            case 39:
                phi += dr;
                break;
            case 40:
                eyeTheta -= dr;
                break;
        }
    };
    document.getElementById("slider11").oninput = function() {
        document.getElementById("slider11Val").value = event.srcElement.value;
        theta[bodyPositionId ] = event.srcElement.value;
        initNodes(bodyPositionId);
    };
    document.getElementById("testSlide").oninput = function() {
        document.getElementById("testSlideVal").value = event.srcElement.value;
        theta[waistId ] = event.srcElement.value;
        initNodes(waistId);
    };
    document.getElementById("slider0").onchange = function() {
        debugger;
        var angle;
        if (typeof event.detail == "undefined")   angle = event.target.value;
        else {
            angle = event.detail.angle;
        }
        document.getElementById("slider0Val").value = angle;
        theta[torsoId ] = angle;
        initNodes(torsoId);
    };
    document.getElementById("slider10").oninput = function() {
        document.getElementById("slider10Val").value = event.srcElement.value;
        theta[torso2Id ] = event.srcElement.value;
        initNodes(torso2Id);
    };
    document.getElementById("slider1").oninput = function() {
        document.getElementById("slider1Val").value = event.srcElement.value;
        theta[headId] = event.srcElement.value;
        initNodes(headId);
    };
    document.getElementById("slider2").oninput = function() {
        document.getElementById("slider2Val").value = event.srcElement.value;
         theta[leftUpperArmId] = event.srcElement.value;
         initNodes(leftUpperArmId);
    };
    document.getElementById("slider3").oninput = function() {
        document.getElementById("slider3Val").value = event.srcElement.value;
         theta[leftLowerArmId] =  event.srcElement.value;
         initNodes(leftLowerArmId);
    };
    document.getElementById("slider4").oninput = function() {
        document.getElementById("slider4Val").value = event.srcElement.value;
        theta[rightUpperArmId] = event.srcElement.value;
        initNodes(rightUpperArmId);
    };
    document.getElementById("slider5").oninput = function() {
        document.getElementById("slider5Val").value = event.srcElement.value;
         theta[rightLowerArmId] =  event.srcElement.value;
         initNodes(rightLowerArmId);
    };
    document.getElementById("slider6").oninput = function() {
        document.getElementById("slider6Val").value = event.srcElement.value;
        theta[leftUpperLegId] = event.srcElement.value;
        initNodes(leftUpperLegId);
    };
    document.getElementById("slider7").oninput = function() {
        document.getElementById("slider7Val").value = event.srcElement.value;
         theta[leftLowerLegId] = event.srcElement.value;
         initNodes(leftLowerLegId);
    };
    document.getElementById("slider8").onchange = function() {
        var angle;
        if (typeof event.detail == "undefined")   angle = event.target.value;
        else {
            angle = event.detail.angle;
        }
        console.log('the angle is:' + angle);
        document.getElementById("slider8Val").value = angle;
         theta[rightUpperLegId] =  angle;
         initNodes(rightUpperLegId);
    };
    
    document.getElementById("slider9").onchange = function() {
        var angle;
        if (typeof event.detail == "undefined")   angle = event.target.value;
        else {
            angle = event.detail.angle;
        }
        console.log('the angle is:' + angle);
        document.getElementById("slider9Val").value = angle;
        theta[rightLowerLegId] = angle;
        initNodes(rightLowerLegId);
    };

    render();
}

//Preset animations
function run(){
    switch(playing){
        case 0:
            theta[torsoId] = 0;
            theta[torso2Id] = 0;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = 0;
            theta[rightLowerArmId] = 0;
            theta[leftUpperLegId] = 0;
            theta[rightUpperLegId] = 0;
            theta[leftLowerLegId] = 0;
            theta[rightLowerLegId] = 0;
            theta[leftFeetId] = 90;
            theta[rightFeetId] = 90;
            for(i=0; i<numNodes; i++) initNodes(i);
            break;

        case 1:
                theta[torsoId] = 10;
                theta[torso2Id] = -5;
                theta[waistId] = 180;
                theta[leftUpperArmId] = 155;
                theta[rightUpperArmId] = -155;
                theta[leftLowerArmId] = 0;
                theta[rightLowerArmId] = -44;
                theta[leftUpperLegId] = 37;
                theta[rightUpperLegId] = 0;
                theta[leftLowerLegId] = -44;
                theta[rightLowerLegId] = 0;
                theta[leftFeetId] = 90;
                theta[rightFeetId] = 90;
                for(i=0; i<numNodes; i++) initNodes(i);
        break;

        case 2:
            theta[torsoId] = 10;
            theta[torso2Id] = -5;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = 0;
            theta[rightLowerArmId] = -88;
            theta[leftUpperLegId] = 74;
            theta[rightUpperLegId] = 0;
            theta[leftLowerLegId] = -88;
            theta[rightLowerLegId] = 0;
            theta[leftFeetId] = 90;
            theta[rightFeetId] = 90;
            break;
            for(i=0; i<numNodes; i++) initNodes(i);

        case 3:
            theta[torsoId] = 10;
            theta[torso2Id] = -5;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = 0;
            theta[rightLowerArmId] = -132;
            theta[leftUpperLegId] = 111;
            theta[rightUpperLegId] = 0;
            theta[leftLowerLegId] = -132;
            theta[rightLowerLegId] = 0;
            theta[leftFeetId] = 90;
            theta[rightFeetId] = 90;
            for(i=0; i<numNodes; i++) initNodes(i);
            break;
        case 4:
            theta[torsoId] = 10;
            theta[torso2Id] = -5;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = 0;
            theta[rightLowerArmId] = -88;
            theta[leftUpperLegId] = 74;
            theta[rightUpperLegId] = 0;
            theta[leftLowerLegId] = -88;
            theta[rightLowerLegId] = 0;
            theta[leftFeetId] = 90;
            theta[rightFeetId] = 90;
            for(i=0; i<numNodes; i++) initNodes(i);
            break;
        case 5:
            theta[torsoId] = 10;
            theta[torso2Id] = -5;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = 0;
            theta[rightLowerArmId] = -44;
            theta[leftUpperLegId] = 37;
            theta[rightUpperLegId] = 0;
            theta[leftLowerLegId] = -44;
            theta[rightLowerLegId] = 0;
            theta[leftFeetId] = 90;
            theta[rightFeetId] = 90;
            for(i=0; i<numNodes; i++) initNodes(i);
            break;
        case 6:
            theta[torsoId] = 0;
            theta[torso2Id] = 0;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = 0;
            theta[rightLowerArmId] = 0;
            theta[leftUpperLegId] = 0;
            theta[rightUpperLegId] = 0;
            theta[leftLowerLegId] = 0;
            theta[rightLowerLegId] = 0;
            theta[leftFeetId] = 90;
            theta[rightFeetId] = 90;
            for(i=0; i<numNodes; i++) initNodes(i);
            break;

            case 7:
                theta[torsoId] = -10;
                theta[torso2Id] = -5;
                theta[waistId] = 180;
                theta[leftUpperArmId] = 155;
                theta[rightUpperArmId] = -155;
                theta[leftLowerArmId] = -44;
                theta[rightLowerArmId] = 0;
                theta[leftUpperLegId] = 0;
                theta[rightUpperLegId] = 37;
                theta[leftLowerLegId] = 0;
                theta[rightLowerLegId] = -44;
                theta[leftFeetId] = 90;
                theta[rightFeetId] = 90;
                for(i=0; i<numNodes; i++) initNodes(i);
            break;

            case 8:
                theta[torsoId] = -10;
                theta[torso2Id] = -5;
                theta[waistId] = 180;
                theta[leftUpperArmId] = 155;
                theta[rightUpperArmId] = -155;
                theta[leftLowerArmId] = -88;
                theta[rightLowerArmId] = 0;
                theta[leftUpperLegId] = 0;
                theta[rightUpperLegId] = 74;
                theta[leftLowerLegId] = 0;
                theta[rightLowerLegId] = -88;
                theta[leftFeetId] = 90;
                theta[rightFeetId] = 90;
                for(i=0; i<numNodes; i++) initNodes(i);
                break;

        case 9:
            theta[torsoId] = -10;
            theta[torso2Id] = -5;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = -132;
            theta[rightLowerArmId] = 0;
            theta[leftUpperLegId] = 0;
            theta[rightUpperLegId] = 111;
            theta[leftLowerLegId] = 0;
            theta[rightLowerLegId] = -132;
            theta[leftFeetId] = 90;
            theta[rightFeetId] = 90;
            for(i=0; i<numNodes; i++) initNodes(i);
            break;

            case 10:
                theta[torsoId] = -10;
                theta[torso2Id] = -5;
                theta[waistId] = 180;
                theta[leftUpperArmId] = 155;
                theta[rightUpperArmId] = -155;
                theta[leftLowerArmId] = -88;
                theta[rightLowerArmId] = 0;
                theta[leftUpperLegId] = 0;
                theta[rightUpperLegId] = 74;
                theta[leftLowerLegId] = 0;
                theta[rightLowerLegId] = -88;
                theta[leftFeetId] = 90;
                theta[rightFeetId] = 90;
                for(i=0; i<numNodes; i++) initNodes(i);
                break;

                case 11:
                    theta[torsoId] = -10;
                    theta[torso2Id] = -5;
                    theta[waistId] = 180;
                    theta[leftUpperArmId] = 155;
                    theta[rightUpperArmId] = -155;
                    theta[leftLowerArmId] = -44;
                    theta[rightLowerArmId] = 0;
                    theta[leftUpperLegId] = 0;
                    theta[rightUpperLegId] = 37;
                    theta[leftLowerLegId] = 0;
                    theta[rightLowerLegId] = -44;
                    theta[leftFeetId] = 90;
                    theta[rightFeetId] = 90;
                    for(i=0; i<numNodes; i++) initNodes(i);
                break;
  }
  if(isPlaying){
      setTimeout(function() {
          playing = (playing + 1)%12;
          run();
      }, 1);
  } else {
      reset();
  }
}
function jump(){
    switch(playing){
        case 0:
            bodyPosition = 0.0;
            theta[torsoId] = 0;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = 0;
            theta[rightLowerArmId] = 0;
            theta[leftUpperLegId] = 0;
            theta[rightUpperLegId] = 0;
            theta[leftLowerLegId] = 0;
            theta[rightLowerLegId] = 0;
            theta[leftFeetId] = 90;
            theta[rightFeetId] = 90;
            for(i=0; i<numNodes; i++) initNodes(i);
            break;

        case 1:
            bodyPosition = -5.0;
            theta[torsoId] = -10;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = 0;
            theta[rightLowerArmId] = 0;
            theta[leftUpperLegId] = 75;
            theta[rightUpperLegId] = 75;
            theta[leftLowerLegId] = -130;
            theta[rightLowerLegId] = -130;
            theta[leftFeetId] = 130;
            theta[rightFeetId] = 130;
            for(i=0; i<numNodes; i++) initNodes(i);
            break;

        case 2:
            bodyPosition = -3.0;
            theta[torsoId] = -10;
            theta[waistId] = 180;
            theta[leftUpperArmId] = 155;
            theta[rightUpperArmId] = -155;
            theta[leftLowerArmId] = 0;
            theta[rightLowerArmId] = 0;
            theta[leftUpperLegId] = 55;
            theta[rightUpperLegId] = 55;
            theta[leftLowerLegId] = -100;
            theta[rightLowerLegId] = -100;
            theta[leftFeetId] = 110;
            theta[rightFeetId] = 110;
            for(i=0; i<numNodes; i++) initNodes(i);
          break;

      case 3:
          bodyPosition = 1.0;
          theta[torsoId] = -10;
          theta[waistId] = 180;
          theta[leftUpperArmId] = 155;
          theta[rightUpperArmId] = -155;
          theta[leftLowerArmId] = 0;
          theta[rightLowerArmId] = 0;
          theta[leftUpperLegId] = 15;
          theta[rightUpperLegId] = 15;
          theta[leftLowerLegId] = -50;
          theta[rightLowerLegId] = -50;
          theta[leftFeetId] = 180;
          theta[rightFeetId] = 180;
          for(i=0; i<numNodes; i++) initNodes(i);
        break;
    }
    if(isPlaying){
      setTimeout(function() {
          playing = (playing + 1)%4;
          jump();
      }, 100);
    }
}
function backflip(){
    var idNames = ["torsoId", "neckId", "waistId", "headId",
        "leftShoulderId", "rightShoulderId", "leftUpperArmId", "leftLowerArmId",
        "rightUpperArmId", "rightLowerArmId", "leftKneeId", "leftAnckleId",
        "rightKneeId", "rightAnckleId", "leftUpperLegId", "leftLowerLegId",
        "rightUpperLegId", "rightLowerLegId", "leftFeetId", "rightFeetId",
        "torso2Id", "head2Id", "leftUpperArm2Id", "rightUpperArm2Id", "bodyPositionId"];

    document.getElementById("debug").innerHTML = playing;
    switch(playing){
        // case -1: return;
        case 0:
            theta = [0, 0, 180, 0, 0, 0, 135, 0, -135,      0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 90, 0, 0, 0, 0, 0 ]; break;
        case 1:
            theta = [20, 0, 210, 0, 0, 0, 125, -20, -125,   -20, 0, 0, 0, 0, -5, -35, -5, -35, 90, 90, -30, 0, 0, 0, -1 ]; break;
        case 2:
            theta = [40, 0, 250, 0, 0, 0, 115, -35, -115,   -35, 0, 0, 0, 0, -10, -70, -10, -70, 90, 90, -40, 0, 0, 0, -2 ]; break;
        case 3:
            theta = [60, 0, 270, 0, 0, 0, 105, -50, -120,   -60, 0, 0, 0, 0, -15, -90, -15, -90, 90, 90, -50, 0, 0, 0, -3 ]; break;
        case 4:
            theta = [80, 0, 280, 0, 0, 0, 90, -70, -115,   -70, 0, 0, 0, 0, -15, -100, -15, -100, 90, 90, -60, 0, 0, 0, -4 ]; break;
        case 5:
            theta = [100, 0, 260, 0, 0, 0, 105, -60, -120,  -60, 0, 0, 0, 0, -5, -90, -5, -90, 90, 90, -35, 0, 0, 0, -3 ]; break;
        case 6:
            theta = [120, 0, 220, 0, 0, 0, 115, -30, -130,  -40, 0, 0, 0, 0, 0, -60, 0, -60, 90, 90, -10, 0, 0, 0, -1 ]; break;
        case 7:
            theta = [140, 0, 180, 0, 0, 0, 130, 10, -135,   -20, 0, 0, 0, 0, 10, -20, -10, -20, 90, 90, 10, 0, 0, 0, 0 ]; break;
        case 8:
            theta = [160, 0, 230, 0, 0, 0, 135, 0, -130,    -10, 0, 0, 0, 0, 20, -20, -20, -20, -90, 90, 30, 0, 0, 0, 1 ]; break;
        case 9:
            theta = [180, 0, 250, 0, 0, 0, 125, -10, -115,    -30, 0, 0, 0, 0, 0, 40, -50, 40, -50, 90, 80, 0, 0, 0, 3 ]; break;
        case 10:
            theta = [200, 0, 270, 0, 0, 0, 110, -40, -100,    -60, 0, 0, 0, 0, 80, -70, 80, -70, 90, 90, 130, 0, 0, 0, 5 ]; break;
        case 11:
            theta = [220, 0, 280, 0, 0, 0, 90, -55, -85,    -80, 0, 0, 0, 0, 85, -100, 85, -100, 90, 90, 200, 0, 0, 0, 6 ]; break;
        case 12:
            theta = [240, 0, 255, 0, 0, 0, 85, -60, -80,    -80, 0, 0, 0, 0, 95, -120, 95, -120, 90, 90, 260, 0, 0, 0, 3 ]; break;
        case 13:
            theta = [260, 0, 240, 0, 0, 0, 85, -55, -75,    -80, 0, 0, 0, 0, 80, -110, 80, -110, 90, 90, 295, 0, 0, 0, -1 ]; break;
        case 14:
            theta = [280, 0, 210, 0, 0, 0, 100, -35, -90,    -50, 0, 0, 0, 0, 60, -80, 60, -80, 90, 90, 310, 0, 0, 0, -3 ]; break;
        case 15:
            theta = [300, 0, 200, 0, 0, 0, 115, -20, -100,    -30, 0, 0, 0, 0, 20, -60, 20, -60, 90, 90, 325, 0, 0, 0, -2 ]; break;
        case 16:
            theta = [320, 0, 180, 0, 0, 0, 130, 10, -125,    -10, 0, 0, 0, 0, 5, -20, 5, -20, 90, 90, 340, 0, 0, 0, -1 ]; break;
        case 17:
            theta = [340, 0, 180, 0, 0, 0, 135, 15, -135,    0, 0, 0, 0, 0, 5, -10, 5, -10, 90, 90, 360, 0, 0, 0, -0 ]; break;
    }

    for(i=0; (i<numNodes); i++) { initNodes(i); }

    if(isPlaying){
      setTimeout(function() {
          playing = (playing + 1)%18;
          backflip();
      }, 100);
    }
}

//Save/Load functionality
function getKeyframe() {
    for(i=0; i<numNodes; i++) { keyFrames.push(theta[i]); }
    document.getElementById("debug").innerHTML = keyFrames.length;
}
function saveAnimation(saveName) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(saveName, JSON.stringify(keyFrames));
        // document.getElementById("debug").innerHTML = localStorage.getItem(saveName);
    } else {
        document.getElementById("debug").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}
function loadAnimation(loadName) {
    playing = -1;
    keyFrames = JSON.parse(localStorage.getItem(loadName));
    document.getElementById("debug").innerHTML = keyFrames.length;
}
function playAnimation() {
    document.getElementById("debug").innerHTML = playing;
    if (playing == -1) return;
    for(i=0; (i<numNodes); i++) {
        theta[i] = parseInt(keyFrames[((numNodes) * (playing)) + i]);
        initNodes(i);
    }
    if(isPlaying){
      setTimeout(function() {
          playing = (playing + 1)%(keyFrames.length/numNodes);
          playAnimation();
      }, 100);
    }
}

// function wait(ms){
//    var start = new Date().getTime();
//    var end = start;
//    while(end < start + ms) {
//      end = new Date().getTime();
//   }
// }
function reset(){
    playing = -1;
    isPlaying = false;

    theta = [0, 0, 180, 0, 0, 0, 135, 0, -135, 0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 90, 0, 0, 0, 0, 0 ];
    for(i=0; i<numNodes; i++) initNodes(i);
}
var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    eye = vec3(radius*Math.sin(eyeTheta)*Math.cos(phi),
        radius*Math.sin(eyeTheta)*Math.sin(phi), radius*Math.cos(eyeTheta));
    modelViewMatrix = lookAt(eye, at , up);
    traverse(torsoId);
    requestAnimFrame(render);
}
