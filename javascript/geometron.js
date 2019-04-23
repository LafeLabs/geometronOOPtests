/*

A Geometron is a geometric virtual machine which has two 8x8x8 cubes of operations. Thus each cube has
512 elements, for a total of 1024 addresses
  Operations are divided into:
       - transformations of global geometric variables, e.g. x += side. 
       - creation of geometric elements such as circle in a canvas or sphere in a 3d canvas, 
       where the location, orientation, and size, e.g. createSphere(x,y,z,side) 
       - carry out a sequence of operations, which can be any of these three types
       
  operations are organized by the geometry of the two cubes:  
      One cube is the "symbol" cube which consists entirely of sequences of operations. 
      the other cube, the "action cube", is divided up into different types of action based on "layers", which are 
          8x8 arrays, which stack on top of each other(with exceptions).  The symbol which describes an action is in the same location in the symbol cube
          as the corresponding action in the action cube.  
          
      Each address in each cube is a base 8 number, indicated by a leading 0.  Therefore these addresses are *coordinates* in space, where 
      the action cube is all 3 digit addresses and the symbol cube is all 4 digit addresses starting with 1. 

    
      The Action Cube is divided into layers as follows:
         00-05: held in reserve for creation operations for making new instances of Geometron
         06-037: Root Actions, which manipulate things outside of the basic construct of geometron
         040-0176: keyboard actions, each of which maps to some other action/operation 
         0177: do nothing
         0200-0277: shape table, which is all programs/sequences/glyphs
         0207: cursor, which has special properties which affect editign of glyphs
         0300-0377: 2d geometric actions
         0400-0477: unused
         0500-0577: unused
         0600-0677: unused
         0700-0777: 3d geometric actions, combined with actions on geometric variables of quantum states in higher dimensions

    The symbol cube has a "font" stored in 01040[space] to 01176[tilde], which corresponds to the printable ASCII



    */


    

//this needs to get passed a context for a canvas.  It should know the size and shape of that canvas,
//and will create a string with the SVG code for the same vector graphics of the same size and shape as it goes 
//function GVM2d(x0,y0,unit,theta0,ctx) {
function GVM2d(x0,y0,unit,theta0,canvas2d,width,height) {
    this._width = width;
    this._height = height;
    canvas2d.width = width;
    canvas2d.height = height;
//    this._ctx = ctx;//context2d of a canvas
    this._ctx = canvas2d.getContext("2d");
 
    this._x0 = x0;
    this._x = x0;
    this._y0 = y0;
    this._y = y0;
    this._unit = unit;
    this._side = unit;
    this._theta0 = theta0;
    this._theta = theta0;
    this._scaleFactor = 2;
    this._thetaStep = Math.PI/2;

    this._style = {
        color0: "black",
        fill0: "black",
        line0: 1,
        color1: "black",
        fill1: "black",
        line1: 3,
        color2: "red",
        fill2: "red",
        line2: 1,
        color3: "#FF7900",
        fill3: "#FF7900",
        line3: 1,
        color4: "yellow",
        fill4: "yellow",
        line4: 1,
        color5: "green",
        fill5: "green",
        line5: 1,
        color6: "blue",
        fill6: "blue",
        line6: 1,
        color7: "purple",
        fill7: "purple",
        line7: 1
    };
    this._strokeStyle = this._style.color0;
    this._fillStyle = this._style.fill0;
    this._lineWidth = this._style.line0;

    this.svgString = "";


    this._hypercube = [];
    for(var index = 0;index < 1024;index++){
        this._hypercube.push("0341,");
    }
    

    this.actionSequence = function(glyph,GVM2d) {
        var glyphArray = glyph.split(",");
        var actionSequence = [];
        for(var index = 0;index < glyphArray.length;index++){
            if(glyphArray[index].length > 1){
                actionSequence.push(parseInt(glyphArray[index],8));
            }
        }
        for(var index = 0;index < actionSequence.length;index++){
            GVM2d.action(actionSequence[index],GVM2d);
        }

    }

    this.drawGlyph = function(glyph,GVM2d) {

        GVM2d._ctx.clearRect(0,0,GVM2d._width,GVM2d._height);
        GVM2d._ctx.strokeStyle = GVM2d._style.color0;
        GVM2d._ctx.fillStyle = GVM2d._style.fill0;
        GVM2d._ctx.lineWidth = GVM2d._style.line0;

        GVM2d.actionSequence(glyph,GVM2d);
    }

    this.action = function(address,GVM2d) {
        //02xx
        if(address >= 0200 && address <= 0277){
            GVM2d.actionSequence(GVM2d._hypercube[address],GVM2d);
        }
        //03xx
        if(address == 0300) {
            GVM2d._x = GVM2d._x0;
            GVM2d._y = GVM2d._y0;
            GVM2d._side = GVM2d._unit;
            GVM2d._thetaStep = Math.PI/2;
            GVM2d._theta = GVM2d._theta0;
            GVM2d._scaleFactor = 2;       
        }
        if(address == 0304) {
            GVM2d._thetaStep = Math.PI/2;
        }
        if(address == 0305) {
            GVM2d._thetaStep = 2*Math.PI/5;
        }
        if(address == 0306) {
            GVM2d._thetaStep = Math.PI/3;
        }

        if(address == 0310) {
            GVM2d._scaleFactor = Math.sqrt(2);
        }
        if(address == 0311) {
            GVM2d._scaleFactor = (Math.sqrt(5) + 1)/2;
        }
        if(address == 0312) {
            GVM2d._scaleFactor = Math.sqrt(3);
        }
        if(address == 0313) {
            GVM2d._scaleFactor = 2;
        }
        if(address == 0314) {
            GVM2d._scaleFactor = 3;
        }
        if(address == 0316) {
            GVM2d._scaleFactor = 5;
        }
        if(address == 0320) {
            GVM2d._ctx.strokeStyle = GVM2d._style.color0;
            GVM2d._ctx.fillStyle = GVM2d._style.fill0;
            GVM2d._ctx.lineWidth = GVM2d._style.line0;    
        }
        if(address == 0321) {
            GVM2d._ctx.strokeStyle = GVM2d._style.color1;
            GVM2d._ctx.fillStyle = GVM2d._style.fill1;
            GVM2d._ctx.lineWidth = GVM2d._style.line1;    
        }
        if(address == 0322) {
            GVM2d._ctx.strokeStyle = GVM2d._style.color2;
            GVM2d._ctx.fillStyle = GVM2d._style.fill2;
            GVM2d._ctx.lineWidth = GVM2d._style.line2;    
        }
        if(address == 0323) {
            GVM2d._ctx.strokeStyle = GVM2d._style.color3;
            GVM2d._ctx.fillStyle = GVM2d._style.fill3;
            GVM2d._ctx.lineWidth = GVM2d._style.line3;    
        }
        if(address == 0324) {
            GVM2d._ctx.strokeStyle = GVM2d._style.color4;
            GVM2d._ctx.fillStyle = GVM2d._style.fill4;
            GVM2d._ctx.lineWidth = GVM2d._style.line4;    
        }
        if(address == 0325) {
            GVM2d._ctx.strokeStyle = GVM2d._style.color5;
            GVM2d._ctx.fillStyle = GVM2d._style.fill5;
            GVM2d._ctx.lineWidth = GVM2d._style.line5;    
        }
        if(address == 0326) {
            GVM2d._ctx.strokeStyle = GVM2d._style.color6;
            GVM2d._ctx.fillStyle = GVM2d._style.fill6;
            GVM2d._ctx.lineWidth = GVM2d._style.line6;    
        }
        if(address == 0327) {
            GVM2d._ctx.strokeStyle = GVM2d._style.color7;
            GVM2d._ctx.fillStyle = GVM2d._style.fill7;
            GVM2d._ctx.lineWidth = GVM2d._style.line7;    
        }

        if(address == 0330) {
            GVM2d._x += GVM2d._side*Math.cos(GVM2d._theta);
            GVM2d._y += GVM2d._side*Math.sin(GVM2d._theta);    
        }
        if(address == 0331){
            GVM2d._x -= GVM2d._side*Math.cos(GVM2d._theta);
            GVM2d._y -= GVM2d._side*Math.sin(GVM2d._theta);    
        }
        if(address == 0332) {
            GVM2d._x += GVM2d._side*Math.cos(GVM2d._theta - GVM2d._thetaStep);
            GVM2d._y += GVM2d._side*Math.sin(GVM2d._theta - GVM2d._thetaStep);    
        }
        if(address == 0333) {
            GVM2d._x += GVM2d._side*Math.cos(GVM2d._theta + GVM2d._thetaStep);
            GVM2d._y += GVM2d._side*Math.sin(GVM2d._theta + GVM2d._thetaStep);    
        }
        if(address == 0334) {
            GVM2d._theta -= GVM2d._thetaStep; // CCW
        }
        if(address == 0335) {
            GVM2d._theta += GVM2d._thetaStep; // CW
        }
        if(address == 0336) {
            GVM2d._side /= GVM2d._scaleFactor; // -
        }
        if(address == 0337) {
            GVM2d._side *= GVM2d._scaleFactor; // +
        }
    
        if(address == 0340) {
            GVM2d._ctx.beginPath();
            GVM2d._ctx.arc(GVM2d._x, GVM2d._y, GVM2d._ctx.lineWidth, 0, 2 * Math.PI);
            GVM2d._ctx.fill();	
            GVM2d._ctx.closePath();
        }
        if(address == 0341) {
            GVM2d._ctx.beginPath();
            GVM2d._ctx.arc(GVM2d._x, GVM2d._y, GVM2d._side, 0, 2 * Math.PI);
            GVM2d._ctx.closePath();
            GVM2d._ctx.stroke();   
        }
        if(address == 0342) {
            GVM2d._ctx.beginPath();
            GVM2d._ctx.moveTo(GVM2d._x,GVM2d._y);
            GVM2d._ctx.lineTo(GVM2d._x + GVM2d._side*Math.cos(GVM2d._theta),GVM2d._y + GVM2d._side*Math.sin(GVM2d._theta));
            GVM2d._ctx.stroke();		
            GVM2d._ctx.closePath();    
        }
        if(address == 0343) {
            //arc
            GVM2d._ctx.beginPath();
            GVM2d._ctx.arc(GVM2d._x, GVM2d._y, GVM2d._side, GVM2d._theta - GVM2d._thetaStep,GVM2d._theta + GVM2d._thetaStep);
            GVM2d._ctx.stroke();
            GVM2d._ctx.closePath();
        }
        if(address == 0344) {
            //line segment as part of path
            GVM2d._ctx.lineTo(GVM2d._x + GVM2d._side*Math.cos(GVM2d._theta),GVM2d._y + GVM2d._side*Math.sin(GVM2d._theta));
            GVM2d._ctx.stroke();		
        }
        if(address == 0345) {
            //arc as part of path, to the right (CW)
            GVM2d._ctx.arc(GVM2d._x, GVM2d._y, GVM2d._side, GVM2d._theta - GVM2d._thetaStep,GVM2d._theta + GVM2d._thetaStep);
            GVM2d._ctx.stroke();
        }
        if(address == 0346) {
            //arc, reverse direction (CCW)
            GVM2d._ctx.arc(GVM2d._x, GVM2d._y, GVM2d._side, GVM2d._theta + GVM2d._thetaStep,GVM2d._theta - GVM2d._thetaStep,true);
            GVM2d._ctx.stroke();   
        }
        if(address == 0347) {
            //filled circle
            GVM2d._ctx.beginPath();
            GVM2d._ctx.arc(GVM2d._x, GVM2d._y, GVM2d._side, 0, 2 * Math.PI);
            GVM2d._ctx.closePath();
            GVM2d._ctx.stroke();
            GVM2d._ctx.fill();
        }
        if(address == 0350) {
            GVM2d._thetaStep /= 2;  //angle/2
        }
        if(address == 0351) {
            GVM2d._thetaStep *= 2;  //angle/2
        }
        if(address == 0352) {
            GVM2d._thetaStep /= 3;  //angle/2
        }
        if(address == 0353) {
            GVM2d._thetaStep *= 3;  //angle/2
        }
        if(address == 0354) {
            //end a closed but not filled path
            GVM2d._ctx.closePath();
            GVM2d._ctx.stroke();		
        }
        if(address == 0360) {
            //first part of bezier in middle of a path
            GVM2d._ctx.moveTo(Math.round(GVM2d._x),Math.round(GVM2d._y));
        }
        if(address == 0361) { 
            
        }
    }
}


function Canvas3d(canvas3d){

}
function Canvas2dspell(canvas2d){

}
function Canvas2ddraw(canvas2d){

}
