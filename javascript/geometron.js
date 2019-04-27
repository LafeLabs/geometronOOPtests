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
         unused space can be JSON structures, urls of links and images, links to other addresses in the hypercube, physicsl robotic actions

         0600-0677: 3d shapes, bytecode which references 3d actions
         0700-0777: 3d geometric actions, combined with actions on geometric variables of quantum states in higher dimensions

    The symbol cube has a "font" stored in 01040[space] to 01176[tilde], which corresponds to the printable ASCII

    */


function ActionInput(input,drawGVM,spellGVM) {
    this.glyph = drawGVM.glyph + "0207,";

    drawGVM.drawGlyph(this.glyph,drawGVM);
    spellGVM.spellGlyph(this.glyph,spellGVM);
    
    var glyph = this.glyph;
    input.onkeydown = function(e,glyph,drawGVM,spellGVM){

        var charCode = e.keyCode || e.which;
        if(charCode == 010){
            //delete
            var bottomGlyph = glyph.split("0207")[0];   
            var topGlyph = glyph.split("0207")[1]; 
            var glyphSplit = bottomGlyph.split(",");
            glyph = "";
            for(var index = 0;index < glyphSplit.length - 2;index++){
                if(glyphSplit[index].length > 0){
                    glyph += glyphSplit[index] + ",";
                }
            }
            glyph += "0207,";
            glyph += topGlyph;
            glyphSplit = glyph.split(",");
            glyph = "";
            for(var index = 0;index < glyphSplit.length;index++){
                if(glyphSplit[index].length > 0){
                    glyph += glyphSplit[index] + ",";
                }
            }
            
            drawGVM.drawGlyph(glyph,drawGVM);
            spellGVM.spellGlyph(glyph,spellGVM);
        
        }

    }
}
    
function GVM2d(x0,y0,unit,theta0,canvas2d,width,height,bytecode) {
    this.address = 0277;
    this.glyph = "";
    this.width = width;
    this.height = height;
    canvas2d.width = width;
    canvas2d.height = height;
    this.canvas2d = canvas2d;
    this.ctx = canvas2d.getContext("2d"); 
    this.x0 = x0;
    this.x = x0;
    this.y0 = y0;
    this.y = y0;
    this.unit = unit;
    this.side = unit;
    this.theta0 = theta0;
    this.theta = theta0;
    this.scaleFactor = 2;
    this.thetaStep = Math.PI/2;
    this.word = "";
    this.font = "Arial";

    this.cpy1 = y0;
    this.cpx2 = x0;
    this.cpy2 = y0;
    this.x1 = x0;
    this.y1 = y0;
    this.x2 = x0;
    this.y2 = y0;
    this.xOne = x0;
    this.yOne = y0;
    this.thetaOne = this.theta;
    this.sideOne = this.side;
    this.thetaStepOne = this.thetaStep;
    this.scaleFactorOne = this.scaleFactor;
 
    this.style = {
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
    this.strokeStyle = this.style.color0;
    this.fillStyle = this.style.fill0;
    this.lineWidth = this.style.line0;

    this.viewStep = 50;
    this.svgString = "<svg width=\"" + this.width.toString() + "\" height=\"" + this.height.toString() + "\" viewbox = \"0 0 " + this.width.toString() + " " + this.height.toString() + "\"  xmlns=\"http://www.w3.org/2000/svg\">\n";

    //    this.svgString += "\n<!--\n<json>\n" + JSON.stringify(currentJSON,null,"    ") + "\n</json>\n-->\n";

    this.hypercube = [];
    for(var index = 0;index < 1024;index++){
        this.hypercube.push("0341,");
    }

    for(var index = 0;index < bytecode.length;index++) {
        if(hypercube[index].length > 1){
            var localaddress = parseInt(hypercube[index].split(":")[0],8);
            var localglyph = hypercube[index].split(":")[1];
            this.hypercube[localaddress] = localglyph;
        }
    }

    this.bytecode = function(start,stop,GVM2d) {
        var jsonarray = [];
        for(var index = start;index < stop;index++) {
            if(GVM2d.hypercube[index].length > 1) {
                var bytecodestring = "0" + index.toString(8) + ":" + GVM2d.hypercube[index];
                jsonarray.push(bytecodestring); 
            }
        }
        return JSON.stringify(jsonarray,null,"    ");
    }

    this.importbytecode = function(bytecode,GVM2d){
        for(var index =0;index < bytecode.length;index++){
            var localaddress = parseInt(bytecode[index].split(":")[0],8);
            var localglyph = bytecode[index].split(":")[1];
            GVM2d.hypercube[localaddress] = localglyph;
        }
    }
    
    this.pngcode = function(GVM2d) {
        return GVM2d.canvas2d.toDataURL("image/png");
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
        GVM2d.glyph = glyph;
        GVM2d.ctx.clearRect(0,0,GVM2d.width,GVM2d.height);
        GVM2d.ctx.strokeStyle = GVM2d.style.color0;
        GVM2d.ctx.fillStyle = GVM2d.style.fill0;
        GVM2d.ctx.lineWidth = GVM2d.style.line0;
        GVM2d.svgString = "<svg width=\"" + this.width.toString() + "\" height=\"" + this.height.toString() + "\" viewbox = \"0 0 " + this.width.toString() + " " + this.height.toString() + "\"  xmlns=\"http://www.w3.org/2000/svg\">\n";
        GVM2d.action(0300,GVM2d);
        GVM2d.actionSequence(glyph,GVM2d);
        GVM2d.svgString += "</svg>";
    }

    this.saveGlyph = function(GVM2d){
        var glyphArray = GVM2d.glyph.split(",");
        var cleanGlyph = "";
        for(var index = 0;index < glyphArray.length;index++) {
            if(glyphArray[index] != "0207" && glyphArray[index].length> 1){
                cleanGlyph += glyphArray[index] + ",";
            }
        }
        GVM2d.hypercube[GVM2d.address] = cleanGlyph;        
    }
    
    

    this.spellGlyph = function(glyph,GVM2d) {
        GVM2d.glyph = glyph;
        var localGlyph = "";
        var glyphArray = glyph.split(",");
        for(var index = 0; index < glyphArray.length; index++){
            if(glyphArray[index].length > 1){
                var localAddress = parseInt(glyphArray[index],8);
                if(localAddress < 01000){
                    localAddress += 01000;
                }
                localGlyph += "0" + localAddress.toString(8) + ",";
            }
        }
        glyph = localGlyph;
        GVM2d.glyph = glyph;
        GVM2d.canvas2d.height = GVM2d.unit + 2;
        GVM2d.canvas2d.width = GVM2d.unit*(glyphArray.length) + 4;
        GVM2d.height = GVM2d.unit + 2;
        GVM2d.x0 = 1;
        GVM2d.y0 = GVM2d.unit +1;
        GVM2d.side = GVM2d.unit;
        GVM2d.ctx.clearRect(0,0,GVM2d.width,GVM2d.height);
        GVM2d.ctx.strokeStyle = GVM2d.style.color0;
        GVM2d.ctx.fillStyle = GVM2d.style.fill0;
        GVM2d.ctx.lineWidth = GVM2d.style.line0;
        GVM2d.action(0300,GVM2d);
        GVM2d.actionSequence(glyph,GVM2d);
        
    }

    this.cursorAction = function(action,GVM2d) {           
        //2d cursor is at address 0207, glyph cursor is therefore at 01207
        var currentGlyph = GVM2d.glyph;
        if(action < 040) {
            GVM2d.action(action,GVM2d);
        }
        if(action > 037 && action <= 01777 && action != GVM2d.address) {
            var glyphSplit = currentGlyph.split(",");
            currentGlyph = "";
            for(var index = 0;index < glyphSplit.length;index++){
                if(glyphSplit[index].length > 0 && glyphSplit[index] != "0207"){
                    currentGlyph += glyphSplit[index] + ",";
                }
                if(glyphSplit[index] == "0207"){
                    currentGlyph += "0" + action.toString(8) + ",0207,";
                }
            }
            var glyphSplit = currentGlyph.split(",");
            currentGlyph = "";
            for(var index = 0;index < glyphSplit.length;index++){
                if(glyphSplit[index].length > 0  && parseInt(glyphSplit[index]) >= 040){
                    currentGlyph += glyphSplit[index] + ",";
                }
            }
            GVM2d.glyph = currentGlyph; 
        }
        GVM2d.drawGlyph(GVM2d.glyph,GVM2d);

    }

    this.action = function(address,GVM2d) {
        if(address == 010) {
            //delete
            var bottomGlyph = GVM2d.glyph.split("0207")[0];   
            var topGlyph = GVM2d.glyph.split("0207")[1]; 
            var glyphSplit = bottomGlyph.split(",");
            GVM2d.glyph = "";
            for(var index = 0;index < glyphSplit.length - 2;index++){
                if(glyphSplit[index].length > 0){
                    GVM2d.glyph += glyphSplit[index] + ",";
                }
            }
            GVM2d.glyph += "0207,";
            GVM2d.glyph += topGlyph;
            glyphSplit = GVM2d.glyph.split(",");
            GVM2d.glyph = "";
            for(var index = 0;index < glyphSplit.length;index++){
                if(glyphSplit[index].length > 0){
                    GVM2d.glyph += glyphSplit[index] + ",";
                }
            }
        }        
        if(address == 020) {
            //cursor back
            var currentGlyph = GVM2d.glyph;
            var bottomGlyph = currentGlyph.split("0207")[0];   
            var topGlyph = currentGlyph.split("0207")[1]; 
            glyphSplit = bottomGlyph.split(",");
            if(bottomGlyph.length == 0){
                currentGlyph = topGlyph + "0207,";
            }
            else{
                currentGlyph = "";
                for(var index = 0;index < glyphSplit.length - 2;index++){
                    if(glyphSplit[index].length > 0){
                        currentGlyph += glyphSplit[index] + ",";
                    }
                }
                currentGlyph += "0207,";
                currentGlyph += glyphSplit[glyphSplit.length - 2];
                currentGlyph += topGlyph;
            }
            glyphSplit = currentGlyph.split(",");
            currentGlyph = "";
            for(var index = 0;index < glyphSplit.length;index++){
                if(glyphSplit[index].length > 0){
                    currentGlyph += glyphSplit[index] + ",";
                }
            }
            GVM2d.glyph = currentGlyph;
        }        
        if(address == 021) {
            //cursor fwd
            var currentGlyph = GVM2d.glyph;
            var bottomGlyph = currentGlyph.split("0207")[0];   
            var topGlyph = currentGlyph.split("0207")[1]; 
            if(topGlyph == ","){
                currentGlyph = "0207," + bottomGlyph;
            }
            else{
                glyphSplit = topGlyph.split(",");
                currentGlyph = bottomGlyph + ",";
                currentGlyph += glyphSplit[1] + ",";
                currentGlyph += "0207,";
                for(var index = 2;index < glyphSplit.length - 1;index++){
                    if(glyphSplit[index].length > 0){
                        currentGlyph += glyphSplit[index] + ",";
                    }
                }
            }
            glyphSplit = currentGlyph.split(",");
            currentGlyph = "";
            for(var index = 0;index < glyphSplit.length;index++){
                if(glyphSplit[index].length > 0){
                    currentGlyph += glyphSplit[index] + ",";
                }
            }
            GVM2d.glyph = currentGlyph;

        }        
        if(address == 022) {
            //next glyph in table
        }        
        if(address == 023) {
            //previous glyph in table
        }        
        if(address == 024) {
            //spell to draw, draw to spell
        }        
        if(address == 030) {
            GVM2d.y0 -= GVM2d.viewStep;
        }        
        if(address == 031) {
            GVM2d.y0 += GVM2d.viewStep;
        }        
        if(address == 032) {
            GVM2d.x0 -= GVM2d.viewStep;
        }        
        if(address == 033) {
            GVM2d.x0 += GVM2d.viewStep;
        }        
        if(address == 034) {
            GVM2d.theta0 -= Math.PI/10;
        }        
        if(address == 035) {
            GVM2d.theta0 += Math.PI/10;
        }        
        if(address == 036) {
            
            GVM2d.unit /= 1.1; 
            GVM2d.x0 = 0.5*GVM2d.width + (GVM2d.x0 - 0.5*GVM2d.width)/1.1;
            GVM2d.y0 = 0.5*GVM2d.height + (GVM2d.y0 - 0.5*GVM2d.height)/1.1;
    
        }        
        if(address == 037) {
            GVM2d.unit *= 1.1; 
            GVM2d.x0 = 0.5*GVM2d.width + (GVM2d.x0 - 0.5*GVM2d.width)*1.1;
            GVM2d.y0 = 0.5*GVM2d.height + (GVM2d.y0 - 0.5*GVM2d.height)*1.1;

        }        

        //040-0176: put ASCII on the word stack, to be dumped out to screen via 0365 command
        if( address >= 040 && address <= 0176){
            GVM2d.word += String.fromCharCode(address);
        }

        //02xx
        if( (address >= 0200 && address <= 0277) || (address >= 01000 && address <= 01777) ){
            GVM2d.actionSequence(GVM2d.hypercube[address],GVM2d);

        }
        //03xx
        if(address == 0300) {
            GVM2d.x = GVM2d.x0;
            GVM2d.y = GVM2d.y0;
            GVM2d.side = GVM2d.unit;
            GVM2d.thetaStep = Math.PI/2;
            GVM2d.theta = GVM2d.theta0;
            GVM2d.scaleFactor = 2;      
            GVM2d.word = "";
        }
        if(address == 0304) {
            GVM2d.thetaStep = Math.PI/2;
        }
        if(address == 0305) {
            GVM2d.thetaStep = 2*Math.PI/5;
        }
        if(address == 0306) {
            GVM2d.thetaStep = Math.PI/3;
        }

        if(address == 0310) {
            GVM2d.scaleFactor = Math.sqrt(2);
        }
        if(address == 0311) {
            GVM2d.scaleFactor = (Math.sqrt(5) + 1)/2;
        }
        if(address == 0312) {
            GVM2d.scaleFactor = Math.sqrt(3);
        }
        if(address == 0313) {
            GVM2d.scaleFactor = 2;
        }
        if(address == 0314) {
            GVM2d.scaleFactor = 3;
        }
        if(address == 0316) {
            GVM2d.scaleFactor = 5;
        }
        if(address == 0320) {
            GVM2d.ctx.strokeStyle = GVM2d.style.color0;
            GVM2d.ctx.fillStyle = GVM2d.style.fill0;
            GVM2d.ctx.lineWidth = GVM2d.style.line0;    
        }
        if(address == 0321) {
            GVM2d.ctx.strokeStyle = GVM2d.style.color1;
            GVM2d.ctx.fillStyle = GVM2d.style.fill1;
            GVM2d.ctx.lineWidth = GVM2d.style.line1;    
        }
        if(address == 0322) {
            GVM2d.ctx.strokeStyle = GVM2d.style.color2;
            GVM2d.ctx.fillStyle = GVM2d.style.fill2;
            GVM2d.ctx.lineWidth = GVM2d.style.line2;    
        }
        if(address == 0323) {
            GVM2d.ctx.strokeStyle = GVM2d.style.color3;
            GVM2d.ctx.fillStyle = GVM2d.style.fill3;
            GVM2d.ctx.lineWidth = GVM2d.style.line3;    
        }
        if(address == 0324) {
            GVM2d.ctx.strokeStyle = GVM2d.style.color4;
            GVM2d.ctx.fillStyle = GVM2d.style.fill4;
            GVM2d.ctx.lineWidth = GVM2d.style.line4;    
        }
        if(address == 0325) {
            GVM2d.ctx.strokeStyle = GVM2d.style.color5;
            GVM2d.ctx.fillStyle = GVM2d.style.fill5;
            GVM2d.ctx.lineWidth = GVM2d.style.line5;    
        }
        if(address == 0326) {
            GVM2d.ctx.strokeStyle = GVM2d.style.color6;
            GVM2d.ctx.fillStyle = GVM2d.style.fill6;
            GVM2d.ctx.lineWidth = GVM2d.style.line6;    
        }
        if(address == 0327) {
            GVM2d.ctx.strokeStyle = GVM2d.style.color7;
            GVM2d.ctx.fillStyle = GVM2d.style.fill7;
            GVM2d.ctx.lineWidth = GVM2d.style.line7;    
        }

        if(address == 0330) {
            GVM2d.x += GVM2d.side*Math.cos(GVM2d.theta);
            GVM2d.y += GVM2d.side*Math.sin(GVM2d.theta);    
        }
        if(address == 0331){
            GVM2d.x -= GVM2d.side*Math.cos(GVM2d.theta);
            GVM2d.y -= GVM2d.side*Math.sin(GVM2d.theta);    
        }
        if(address == 0332) {
            GVM2d.x += GVM2d.side*Math.cos(GVM2d.theta - GVM2d.thetaStep);
            GVM2d.y += GVM2d.side*Math.sin(GVM2d.theta - GVM2d.thetaStep);    
        }
        if(address == 0333) {
            GVM2d.x += GVM2d.side*Math.cos(GVM2d.theta + GVM2d.thetaStep);
            GVM2d.y += GVM2d.side*Math.sin(GVM2d.theta + GVM2d.thetaStep);    
        }
        if(address == 0334) {
            GVM2d.theta -= GVM2d.thetaStep; // CCW
        }
        if(address == 0335) {
            GVM2d.theta += GVM2d.thetaStep; // CW
        }
        if(address == 0336) {
            GVM2d.side /= GVM2d.scaleFactor; // -
        }
        if(address == 0337) {
            GVM2d.side *= GVM2d.scaleFactor; // +
        }
    
        if(address == 0340) {
            GVM2d.ctx.beginPath();
            GVM2d.ctx.arc(GVM2d.x, GVM2d.y, GVM2d.ctx.lineWidth, 0, 2 * Math.PI);
            GVM2d.ctx.fill();	
            GVM2d.ctx.closePath();
            GVM2d.svgString += "<circle cx=\"";
            GVM2d.svgString += Math.round(GVM2d.x).toString();
            GVM2d.svgString += "\" cy = \"";
            GVM2d.svgString += Math.round(GVM2d.y).toString();
            GVM2d.svgString += "\" r = \"" + GVM2d.ctx.lineWidth.toString() + "\" stroke = \"" + GVM2d.ctx.strokeStyle + "\" stroke-width = \"" + (GVM2d.ctx.lineWidth).toString() + "\" ";
            GVM2d.svgString += "fill = \"" + GVM2d.ctx.strokeStyle + "\" />\n";	
        }
        if(address == 0341) {
            GVM2d.ctx.beginPath();
            GVM2d.ctx.arc(GVM2d.x, GVM2d.y, GVM2d.side, 0, 2 * Math.PI);
            GVM2d.ctx.closePath();
            GVM2d.ctx.stroke();   
            GVM2d.svgString += "<circle cx=\"";
            GVM2d.svgString += Math.round(GVM2d.x).toString();
            GVM2d.svgString += "\" cy = \"";
            GVM2d.svgString += Math.round(GVM2d.y).toString();
            GVM2d.svgString += "\" r = \"" + GVM2d.side.toString() + "\" stroke = \"" + GVM2d.ctx.strokeStyle + "\" stroke-width = \"" + (GVM2d.ctx.lineWidth).toString() + "\" ";
            GVM2d.svgString += "fill = \"" + GVM2d.ctx.strokeStyle + "\" />\n";			
        }
        if(address == 0342) {
            GVM2d.ctx.beginPath();
            GVM2d.ctx.moveTo(GVM2d.x,GVM2d.y);
            GVM2d.ctx.lineTo(GVM2d.x + GVM2d.side*Math.cos(GVM2d.theta),GVM2d.y + GVM2d.side*Math.sin(GVM2d.theta));
            GVM2d.ctx.stroke();		
            GVM2d.ctx.closePath();    
            var x2 = Math.round(GVM2d.x + GVM2d.side*Math.cos(GVM2d.theta));
            var y2 = Math.round(GVM2d.y + GVM2d.side*Math.sin(GVM2d.theta));
            GVM2d.svgString += "    <line x1=\""+Math.round(GVM2d.x).toString()+"\" y1=\""+Math.round(GVM2d.y).toString()+"\" x2=\"" + x2.toString()+"\" y2=\"" + y2.toString()+"\" style=\"stroke:" + GVM2d.ctx.strokeStyle + ";stroke-width:" + (GVM2d.ctx.lineWidth).toString() + "\" />\n"
    
        }
        if(address == 0343) {
            //arc
            GVM2d.ctx.beginPath();
            GVM2d.ctx.arc(GVM2d.x, GVM2d.y, GVM2d.side, GVM2d.theta - GVM2d.thetaStep,GVM2d.theta + GVM2d.thetaStep);
            GVM2d.ctx.stroke();
            GVM2d.ctx.closePath();
        }
        if(address == 0344) {
            //line segment as part of path
            GVM2d.ctx.lineTo(GVM2d.x + GVM2d.side*Math.cos(GVM2d.theta),GVM2d.y + GVM2d.side*Math.sin(GVM2d.theta));
            GVM2d.ctx.stroke();		
        }
        if(address == 0345) {
            //arc as part of path, to the right (CW)
            GVM2d.ctx.arc(GVM2d.x, GVM2d.y, GVM2d.side, GVM2d.theta - GVM2d.thetaStep,GVM2d.theta + GVM2d.thetaStep);
            GVM2d.ctx.stroke();
        }
        if(address == 0346) {
            //arc, reverse direction (CCW)
            GVM2d.ctx.arc(GVM2d.x, GVM2d.y, GVM2d.side, GVM2d.theta + GVM2d.thetaStep,GVM2d.theta - GVM2d.thetaStep,true);
            GVM2d.ctx.stroke();   
        }
        if(address == 0347) {
            //filled circle
            GVM2d.ctx.beginPath();
            GVM2d.ctx.arc(GVM2d.x, GVM2d.y, GVM2d.side, 0, 2 * Math.PI);
            GVM2d.ctx.closePath();
            GVM2d.ctx.stroke();
            GVM2d.ctx.fill();
        }
        if(address == 0350) {
            GVM2d.thetaStep /= 2;  //angle/2
        }
        if(address == 0351) {
            GVM2d.thetaStep *= 2;  //angle/2
        }
        if(address == 0352) {
            GVM2d.thetaStep /= 3;  //angle/2
        }
        if(address == 0353) {
            GVM2d.thetaStep *= 3;  //angle/2
        }
        if(address == 0354) {
            //end a closed but not filled path
            GVM2d.ctx.closePath();
            GVM2d.ctx.stroke();		
        }
        if(address == 0360) {
            //first part of bezier in middle of a path
            GVM2d.ctx.moveTo(Math.round(GVM2d.x),Math.round(GVM2d.y));
            GVM2d.cpx1 = Math.round(GVM2d.x + GVM2d.side*Math.cos(GVM2d.theta));
            GVM2d.cpy1 = Math.round(GVM2d.y + GVM2d.side*Math.sin(GVM2d.theta));
    
        }
        if(address == 0361) { 
            //second part of bezier in middle of a path
            GVM2d.x2 = Math.round(GVM2d.x);
            GVM2d.y2 = Math.round(GVM2d.y);
            GVM2d.cpx2 = Math.round(GVM2d.x + GVM2d.side*Math.cos(GVM2d.theta));
            GVM2d.cpy2 = Math.round(GVM2d.y + GVM2d.side*Math.sin(GVM2d.theta));
            GVM2d.ctx.bezierCurveTo(GVM2d.cpx1,GVM2d.cpy1,GVM2d.cpx2,GVM2d.cpy2,GVM2d.x2,GVM2d.y2);
            GVM2d.ctx.stroke();
        }
        if(address == 0362) {
            //start a path
            GVM2d.ctx.beginPath();
            GVM2d.ctx.moveTo(GVM2d.x,GVM2d.y);
        }
        if(address == 0363) {
            //terminate a closed path with fill
            GVM2d.ctx.closePath();
            GVM2d.ctx.stroke();		
            GVM2d.ctx.fill();		            
        }
        if(address == 0364) {
            GVM2d.ctx.closePath();
        }
        if(address == 0365) {
            GVM2d.ctx.translate(GVM2d.x, GVM2d.y);
            GVM2d.ctx.rotate(-GVM2d.theta0 + GVM2d.theta);
            GVM2d.ctx.translate(-GVM2d.x, -GVM2d.y);
            GVM2d.ctx.font = GVM2d.side.toString(8) + "px " + GVM2d.font;
            GVM2d.ctx.fillText(GVM2d.word,GVM2d.x,GVM2d.y);    
            GVM2d.ctx.translate(GVM2d.x, GVM2d.y);
            GVM2d.ctx.rotate(+GVM2d.theta0 - GVM2d.theta);
            GVM2d.ctx.translate(-GVM2d.x, -GVM2d.y);
            GVM2d.word = "";
            GVM2d.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        if(address == 0366) {
            // start a self-contained cubic Bezier path        
            GVM2d.ctx.beginPath();
            GVM2d.ctx.moveTo(Math.round(GVM2d.x),Math.round(GVM2d.y));
            GVM2d.cpx1 = Math.round(GVM2d.x + GVM2d.side*Math.cos(GVM2d.theta));
            GVM2d.cpy1 = Math.round(GVM2d.y + GVM2d.side*Math.sin(GVM2d.theta)); 
        }
        if(address == 0367) {
            // finish a self-contained cubic Bezier path
            GVM2d.x2 = Math.round(GVM2d.x);
            GVM2d.y2 = Math.round(GVM2d.y);
            GVM2d.cpx2 = Math.round(GVM2d.x + GVM2d.side*Math.cos(GVM2d.theta));
            GVM2d.cpy2 = Math.round(GVM2d.y + GVM2d.side*Math.sin(GVM2d.theta));
            GVM2d.ctx.bezierCurveTo(GVM2d.cpx1,GVM2d.cpy1,GVM2d.cpx2,GVM2d.cpy2,GVM2d.x2,GVM2d.y2);
            GVM2d.ctx.stroke();
        }
        if(address == 0370) {
            GVM2d.xOne = GVM2d.x;
            GVM2d.yOne = GVM2d.y;
            GVM2d.thetaOne = GVM2d.theta;
            GVM2d.sideOne = GVM2d.side;
            GVM2d.thetaStepOne = GVM2d.thetaStep;
            GVM2d.scaleFactorOne = GVM2d.scaleFactor;
        }
        if(address == 0371) {
            GVM2d.x = GVM2d.xOne;
            GVM2d.y = GVM2d.yOne;
            GVM2d.theta = GVM2d.thetaOne;
            GVM2d.side = GVM2d.sideOne;
            GVM2d.thetaStep = GVM2d.thetaStepOne;
            GVM2d.scaleFactor = GVM2d.scaleFactorOne;    
        }
    }
}

hypercube = [
    "040:035,",
    "041:0321,",
    "042:023,",
    "043:0323,",
    "044:0324,",
    "045:0325,",
    "046:0327,",
    "047:021,",
    "050:034,",
    "051:035,",
    "052:0300,",
    "053:0211,",
    "054:032,",
    "055:0314,",
    "056:033,",
    "057:020,",
    "060:0313,",
    "061:0305,",
    "062:0306,",
    "063:0350,",
    "064:0351,",
    "065:0352,",
    "066:0353,",
    "067:0310,",
    "070:0311,",
    "071:0312,",
    "072:0371",
    "073:037,",
    "074:0247,",
    "075:0316,",
    "076:0177,",
    "077:022,",
    "0100:0322,",
    "0101:0230",
    "0102:0244,",
    "0103:0242,",
    "0104:0232,",
    "0105:0222,",
    "0106:0233,",
    "0107:0234,",
    "0110:0235,",
    "0111:0227,",
    "0112:0236,",
    "0113:0237,",
    "0114:0370",
    "0115:0246,",
    "0116:0245,",
    "0117:0213,",
    "0120:0214,",
    "0121:0220",
    "0122:0223,",
    "0123:0231,",
    "0124:0224,",
    "0125:0226,",
    "0126:0243,",
    "0127:0221",
    "0130:0241,",
    "0131:0225,",
    "0132:0240,",
    "0133:0365,",
    "0134:0201,",
    "0135:0204,",
    "0136:0326,",
    "0137:0210,",
    "0140:0304,",
    "0141:0330",
    "0142:0200,",
    "0143:0342,",
    "0144:0332,",
    "0145:0363,",
    "0146:0333,",
    "0147:0334,",
    "0150:0335,",
    "0151:0345,",
    "0152:0336,",
    "0153:0337,",
    "0154:036,",
    "0155:031,",
    "0156:030,",
    "0157:0346,",
    "0160:0347,",
    "0161:0362,",
    "0162:0360,",
    "0163:0331,",
    "0164:0366,",
    "0165:0361,",
    "0166:0343,",
    "0167:0203,",
    "0170:0341,",
    "0171:0367,",
    "0172:0340,",
    "0173:024,",
    "0174:0364,",
    "0175:0354,",
    "0176:0320,",
    "0200:0362,0203,0334,0203,0334,0203,0334,0203,0334,0354,",
    "0201:0342,0330,",
    "0202:0304,0313,0350,0335,0336,0336,0342,0333,0342,0333,0342,0333,0342,0333,0334,0304,0337,0337,",
    "0203:0344,0330,",
    "0204:0362,0203,0334,0203,0334,0203,0334,0203,0334,0363,",
    "0205:0362,0203,0335,0203,0203,0335,0203,0335,0203,0203,0335,0363,0336,0330,0333,0336,0331,0332,0337,0365,0336,0332,0331,0337,0337,",
    "0206:0336,0332,0337,0362,0203,0334,0336,0203,0335,0350,0335,0337,0310,0337,0203,0335,0335,0203,0335,0304,0335,0336,0313,0336,0203,0334,0337,0203,0363,0335,0335,0336,0332,0337,",
    "0207:0342,0334,0342,0335,0335,0342,0334,0336,0330,0340,0331,0337,0337,0330,0340,0331,0336,",
    "0210:0310,0337,0311,0336,0313,",
    "0211:0311,0337,0310,0336,0313,",
    "0212:0336,0336,0333,0331,0333,0331,0332,0330,0336,0332,0334,0337,0362,0203,0335,0203,0334,0336,0203,0335,0350,0335,0310,0337,0203,0203,0335,0335,0203,0203,0335,0335,0335,0336,0203,0334,0334,0337,0337,0203,0304,0335,0313,0354,0335,0330,0336,0332,0337,0337,0337,",
    "0213:0313,0336,0336,0336,0336,0336,0336,0336,0316,0337,0337,0337,0313,",
    "0214:0316,0336,0336,0336,0313,0337,0337,0337,0337,0337,0337,0337,",
    "0220:0336,0336,0336,0330,0337,0337,0337,0306,0334,0362,0203,0335,0335,0203,0335,0203,0335,0335,0203,0363,0335,0335,0336,0336,0336,0331,0337,0337,0337,",
    "0221:0326,0220,0322,0335,0335,0220,0335,0335,0325,0220,0335,0335,",
    "0222:0226,0333,0226,0330,",
    "0223:0336,0336,0330,0330,0221,0333,0337,0337,0222,0331,0332,0336,0330,0332,0332,0336,0332,0337,0336,0333,0336,0332,0337,0337,0337,",
    "0224:0223,0336,0336,0332,0336,0333,0337,0337,0337,0321,0362,0203,0336,0203,0335,0203,0203,0203,0203,0203,0203,0203,0335,0203,0203,0203,0203,0335,0203,0203,0203,0203,0203,0203,0203,0335,0203,0354,",
    "0225:0336,0336,0336,0330,0335,0335,0366,0331,0332,0332,0332,0332,0330,0367,0335,0335,0331,0337,0337,0337,",
    "0226:0336,0336,0336,0362,0203,0335,0203,0203,0203,0203,0203,0334,0203,0335,0350,0310,0335,0337,0203,0203,0335,0335,0203,0203,0335,0335,0335,0336,0203,0304,0313,0334,0203,0203,0203,0203,0203,0335,0203,0363,0335,0337,0337,0337,0334,",
    "0227:0225,0225,0225,0225,0225,0330,0335,0335,0321,0362,0203,0203,0203,0335,0203,0203,0336,0203,0337,0335,0203,0203,0203,0364,0330,0332,0332,0335,0336,0333,0337,0362,0203,0203,0203,0335,0203,0203,0364,0335,0335,0333,0336,0332,0337,0362,0203,0203,0335,0203,0203,0203,0364,0334,0330,0332,0332,0332,0332,0332,0332,0332,0221,0331,0331,0331,0331,0332,0336,0333,0331,0336,0332,0337,0337,0331,0333,0337,0337,0337,0200,",
    "0230:0325,0337,0204,0321,0200,0336,0336,0330,0332,0336,0336,0333,0341,0330,0330,0330,0341,0330,0330,0330,0341,0330,0330,0330,0341,0337,0337,0337,0332,0331,0320,044,0365,0333,0336,0333,0331,0336,0332,0336,0333,0331,0337,0337,0337,0331,0332,0336,0330,0332,0332,0336,0160,0143,0142,0167,0141,0171,056,0143,0157,0155,0365,",
    "0231:0321,0362,0203,0336,0333,0350,0334,0345,0333,0364,0335,0304,0336,0330,0335,0366,0333,0333,0367,0335,0335,0366,0333,0333,0367,0335,0335,0337,0337,0342,0336,0333,0337,0342,0330,0336,0336,0366,0332,0332,0367,0333,0330,0337,0362,0334,0331,0350,0335,0345,0333,0335,0335,0335,0203,0203,0364,0304,0335,0335,0332,0332,0332,0337,044,0365,0336,0331,0332,0336,0320,0144,0151,0147,0151,0153,0145,0171,056,0143,0157,0155,0365,",
    "0232:0326,0333,0331,0337,0204,0321,0200,0336,0330,0332,0350,0335,0366,0335,0335,0367,0335,0335,0366,0335,0335,0367,0335,0304,0336,0336,0332,0336,0336,0332,0337,0342,0335,0342,0335,0342,0335,0342,0335,0333,0333,0333,0333,0333,0335,0342,0335,0335,0342,0335,0331,0331,0331,0331,0331,0330,0330,0330,0337,0330,0330,0332,0332,0332,0330,0332,0101,0162,0144,0165,0151,0156,0157,0365,0331,0331,0331,0331,0331,0125,0116,0117,0365,0331,0331,0320,0141,0155,0141,0172,0157,0156,056,0143,0157,0155,0365,",
    "0233:0333,0331,0337,0326,0200,0320,0330,0332,0336,0331,0336,0330,0333,0336,0332,0166,0157,0151,0144,040,0154,0157,0157,0160,050,051,0173,0365,0331,0331,0331,0175,0365,0331,0331,0331,0331,0141,0162,0144,0165,0151,0156,0157,056,0143,0143,0365,",
    "0234:0321,0201,0320,0334,0336,0336,0336,0306,0362,0203,0335,0335,0203,0203,0335,0335,0203,0203,0335,0335,0203,0363,0304,0335,0337,0337,0337,0331,",
    "0235:0321,0200,0330,0334,0306,0350,0335,0336,0362,0336,0203,0337,0334,0203,0203,0334,0334,0334,0203,0203,0334,0334,0336,0203,0337,0364,0335,0335,0331,0331,0335,0335,0335,0335,0336,0342,0337,0335,0335,0331,0304,0320,0336,0336,0221,",
    "0236:0321,0335,0362,0203,0203,0306,0335,0203,0335,0335,0203,0203,0335,0203,0354,0350,0335,0362,0203,0304,0335,0203,0203,0335,0203,0364,0335,0335,0332,0336,0332,0332,0336,0330,0221,0331,0331,0336,0341,0332,0332,0332,0341,0332,0332,0332,0341,0332,0332,0332,0341,0331,0331,0331,0333,0333,0341,0333,0333,0333,0341,0333,0333,0333,0341,0333,0333,0333,0341,",
    "0237:0321,0306,0350,0335,0306,0362,0203,0335,0335,0203,0335,0203,0335,0335,0203,0354,0331,0334,0350,0335,0312,0336,0362,0203,0335,0335,0203,0364,0334,0337,0331,0335,0335,0335,0336,0362,0203,0334,0334,0203,0364,0335,0337,0331,0330,0313,0334,0304,0336,0336,0320,0330,0332,0332,0336,0332,0332,0337,0101,0162,0164,0365,0102,0157,0170,0331,0331,0365,",
    "0240:0335,0321,0362,0203,0336,0203,0360,0335,0335,0332,0332,0333,0333,0333,0333,0331,0361,0335,0335,0336,0203,0364,0335,0335,0337,0335,0335,0220,0334,0336,0333,0337,0337,0320,0331,",
    "0241:0336,0330,0333,0221,0336,0333,0331,0337,0236,0336,0330,0332,0337,0333,0331,0337,0320,",
    "0242:0336,0321,0335,0336,0362,0203,0334,0203,0335,0203,0335,0203,0334,0203,0334,0203,0335,0203,0335,0203,0334,0203,0334,0203,0335,0203,0335,0203,0334,0364,0334,0337,0337,0320,",
    "0243:0335,0306,0350,0321,0334,0362,0203,0335,0335,0335,0335,0336,0203,0334,0334,0334,0334,0337,0203,0335,0335,0335,0335,0336,0203,0334,0334,0334,0334,0337,0203,0335,0335,0335,0335,0336,0203,0334,0334,0334,0334,0337,0203,0335,0335,0335,0335,0336,0203,0334,0334,0334,0364,0334,0334,0334,0337,0304,",
    "0244:0243,0243,0243,0243,",
    "0245:0321,0337,0201,0320,0336,0334,0336,0336,0306,0336,0362,0203,0335,0335,0337,0203,0335,0335,0203,0335,0335,0336,0203,0363,0304,0335,0337,0337,0337,0337,0331,0336,",
    "0246:0320,0335,0306,0350,0334,0330,0321,0337,0366,0336,0331,0335,0335,0330,0337,0336,0336,0336,0336,0336,0330,0337,0337,0337,0337,0337,0367,0336,0336,0336,0336,0336,0331,0335,0337,0320,0337,0362,0203,0334,0334,0334,0334,0203,0334,0334,0334,0334,0203,0363,0335,0337,0337,0330,0335,0335,0304,",
    "0247:0341,0333,0336,0332,0341,",
    "0250:0326,0220,0322,0335,0335,0220,0335,0335,0325,0220,0335,0335,",
    "01010:0333,0200,0350,0334,0310,0337,0342,0336,0332,0335,0335,0337,0342,0336,0333,0334,0351,0313,",
    "01020:0304,0333,0200,0336,0330,0332,0336,0336,0332,0337,0200,0333,0333,0200,0332,0332,0336,0330,0335,0337,0342,0330,0350,0335,0335,0351,0333,0350,0336,0334,0342,0334,0334,0342,0337,0335,0351,0333,0336,0333,0331,0337,0337,0331,0337,0304,0336,0330,0330,0336,0330,0334,0331,0337,0337,",
    "01021:0304,0333,0200,0336,0330,0332,0336,0336,0332,0337,0200,0333,0333,0200,0332,0332,0336,0330,0335,0337,0342,0330,0350,0335,0335,0335,0336,0342,0335,0335,0342,0337,0335,0351,0333,0336,0333,0331,0337,0337,0331,0337,0304,",
    "01022:0333,0200,0336,0336,0330,0330,0332,0332,0332,0336,0336,0333,0337,0337,0336,0330,0336,0333,0337,0337,0200,0333,0200,0333,0200,0331,0331,0332,0332,0200,0333,0200,0333,0200,0336,0333,0331,0337,0337,0332,0330,0336,0336,0331,0337,0342,0330,0335,0350,0335,0336,0342,0335,0335,0342,0337,0335,0335,0335,0351,0331,0331,0331,0333,0333,0336,0330,0337,0337,0337,",
    "01023:0333,0200,0336,0336,0330,0330,0332,0332,0332,0336,0336,0333,0337,0337,0336,0330,0336,0333,0337,0337,0200,0333,0200,0333,0200,0331,0331,0332,0332,0200,0333,0200,0333,0200,0336,0333,0331,0337,0337,0332,0330,0336,0336,0331,0337,0335,0335,0331,0342,0330,0335,0350,0335,0336,0342,0335,0335,0342,0337,0335,0335,0335,0351,0331,0331,0331,0333,0333,0336,0330,0337,0337,0337,0335,0335,0331,0333,",
    "01024:0333,0200,0336,0336,0330,0332,0337,0200,0336,0336,0330,0332,0337,0200,0336,0336,0330,0332,0337,0200,0333,0333,0333,0331,0331,0331,0336,0331,0333,0337,0337,0337,0337,",
    "01025:0333,0200,0336,0330,0332,0336,0330,0332,0331,0336,0337,0123,0126,0107,0365,0335,0321,0330,0335,0336,0330,0337,0201,0335,0335,0350,0334,0336,0330,0335,0335,0335,0335,0362,0203,0334,0334,0203,0364,0331,0334,0304,0337,0337,0333,0336,0336,0331,0337,0337,0337,0320,",
    "01026:0333,0200,0336,0330,0332,0336,0336,0333,0331,0337,0200,0306,0335,0342,0332,0342,0330,0335,0335,0342,0335,0335,0335,0335,0331,0334,0304,0332,0306,0335,0342,0330,0350,0335,0342,0334,0331,0335,0304,0334,0331,0332,0335,0336,0332,0337,0342,0330,0350,0335,0335,0335,0336,0342,0335,0335,0342,0335,0304,0331,0331,0331,0331,0333,0333,0333,0333,0333,0337,0337,0337,",
    "01027:0333,0200,0336,0330,0332,0336,0336,0333,0331,0337,0332,0200,0306,0335,0342,0332,0342,0330,0335,0335,0342,0335,0335,0335,0335,0331,0334,0304,0332,0306,0335,0342,0330,0350,0335,0342,0334,0331,0335,0304,0334,0331,0333,0333,0330,0335,0342,0330,0350,0335,0335,0335,0336,0342,0335,0335,0342,0335,0304,0331,0331,0331,0331,0331,0333,0337,0337,0337,",
    "01030:0333,0200,0336,0330,0332,0336,0334,0362,0203,0335,0350,0335,0310,0337,0203,0335,0335,0203,0335,0335,0335,0336,0203,0364,0304,0335,0313,0337,0333,0331,0337,",
    "01031:0333,0200,0336,0330,0332,0336,0334,0335,0335,0362,0203,0335,0350,0335,0310,0337,0203,0335,0335,0203,0335,0335,0335,0336,0203,0364,0304,0335,0335,0335,0313,0337,0333,0331,0337,",
    "01032:0333,0200,0336,0330,0332,0334,0336,0334,0362,0203,0335,0350,0335,0310,0337,0203,0335,0335,0203,0335,0335,0335,0336,0203,0364,0304,0335,0335,0313,0337,0333,0331,0337,",
    "01033:0333,0200,0336,0330,0332,0335,0336,0334,0362,0203,0335,0350,0335,0310,0337,0203,0335,0335,0203,0335,0335,0335,0336,0203,0364,0304,0313,0337,0333,0331,0337,",
    "01034:0333,",
    "01035:0333,",
    "01036:0333,0200,0336,0332,0330,0336,0332,0362,0203,0335,0350,0335,0310,0337,0203,0335,0335,0203,0335,0335,0335,0336,0203,0364,0335,0335,0330,0334,0337,0362,0203,0335,0335,0335,0336,0203,0203,0335,0335,0335,0337,0203,0364,0331,0335,0336,0304,0313,0333,0331,0337,0337,",
    "01037:0333,0200,0336,0332,0330,0336,0332,0362,0335,0335,0203,0335,0350,0335,0310,0337,0203,0335,0335,0203,0335,0335,0335,0336,0203,0364,0335,0335,0330,0334,0335,0331,0331,0331,0331,0334,0337,0362,0203,0335,0335,0335,0336,0203,0203,0335,0335,0335,0337,0203,0364,0331,0335,0336,0304,0313,0333,0331,0337,0332,0335,0335,0337,0331,",
    "01040:0333,",
    "01041:0333,0336,0336,0332,0332,0332,0330,0336,0331,0336,0341,0330,0330,0330,0337,0337,0337,0342,0336,0336,0336,0331,0331,0331,0331,0331,0337,0337,0333,0337,0337,",
    "01042:0333,0330,0336,0332,0336,0332,0331,0342,0333,0342,0333,0330,0337,0337,0331,",
    "01043:0333,0336,0336,0332,0332,0332,0333,0336,0332,0337,0337,0337,0342,0336,0336,0333,0337,0337,0342,0336,0336,0332,0332,0336,0332,0330,0330,0330,0335,0337,0337,0337,0342,0336,0336,0336,0332,0332,0337,0337,0337,0342,0336,0336,0336,0332,0332,0332,0337,0337,0337,0330,0334,0331,",
    "01044:0333,0336,0330,0332,0336,0330,0350,0335,0335,0334,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0330,0330,0343,0335,0335,0343,0335,0335,0334,0334,0334,0334,0334,0334,0343,0334,0334,0343,0334,0334,0343,0334,0334,0343,0335,0335,0335,0335,0335,0335,0335,0335,0351,0351,0330,0335,0335,0333,0333,0337,0337,0336,0332,0337,0342,0336,0333,0337,",
    "01045:0336,0333,0330,0336,0332,0330,0335,0335,0366,0335,0332,0332,0331,0367,0335,0335,0366,0335,0335,0334,0332,0331,0331,0334,0336,0331,0337,0367,0336,0335,0335,0366,0332,0332,0334,0333,0337,0336,0334,0334,0367,0337,0335,0335,0201,0336,0342,0335,0335,0331,0331,0333,0333,0333,0333,0337,0337,0337,",
    "01046:0333,0336,0332,0330,0336,0330,0341,0331,0334,0350,0334,0342,0334,0330,0343,0335,0335,0343,0334,0334,0334,0334,0334,0334,0351,0333,0350,0334,0342,0335,0335,0335,0335,0342,0334,0334,0336,0342,0334,0351,0331,0331,0333,0333,0337,0337,0337,",
    "01047:0333,0336,0330,0332,0336,0330,0342,0333,0333,0331,0331,0331,0337,0337,",
    "01050:0333,0336,0330,0334,0331,0331,0337,0337,0350,0350,0350,0343,0350,0334,0334,0343,0335,0335,0335,0335,0335,0343,0334,0334,0334,0351,0351,0351,0351,0336,0330,0335,0336,0332,0331,0337,",
    "01051:0333,0336,0330,0335,0337,0331,0331,0337,0350,0350,0350,0343,0350,0334,0334,0343,0335,0335,0335,0335,0343,0334,0334,0351,0351,0351,0351,0330,0335,0335,0335,0336,0336,0331,0336,0333,0337,0337,",
    "01052:0333,0336,0332,0330,0352,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0342,0335,0335,0353,0331,0333,0337,",
    "01053:0333,0336,0330,0332,0336,0342,0335,0342,0335,0342,0335,0342,0335,0331,0331,0333,0333,0337,0337,",
    "01054:0333,0336,0332,0336,0334,0350,0334,0342,0335,0351,0335,0333,0337,0337,",
    "01055:0333,0336,0330,0332,0335,0336,0342,0331,0342,0333,0333,0330,0330,0330,0334,0337,0337,",
    "01056:0333,0336,0332,0336,0336,0341,0333,0333,0333,0337,0337,0337,",
    "01057:0333,0332,0350,0335,0310,0337,0342,0336,0313,0334,0351,0333,",
    "01060:0313,0304,0336,0336,0330,0333,0330,0330,0343,0331,0331,0334,0334,0343,0332,0334,0334,0337,0342,0332,0342,0336,0331,0337,0337,0350,0350,0335,0350,0350,0335,0350,0334,0311,0337,0310,0336,0342,0337,0311,0336,0335,0351,0334,0351,0351,0334,0304,0333,0336,0336,0332,0337,0337,0313,",
    "01061:0304,0313,0335,0336,0342,0336,0330,0334,0337,0337,0342,0330,0334,0350,0334,0336,0336,0310,0337,0342,0336,0313,0335,0351,0335,0337,0331,0331,0333,0336,0336,0332,0337,0337,0337,",
    "01062:0304,0336,0335,0342,0350,0334,0366,0333,0334,0330,0304,0335,0335,0336,0336,0331,0337,0367,0335,0335,0310,0337,0366,0336,0332,0332,0337,0367,0336,0333,0333,0331,0331,0313,0337,0337,0336,0336,0336,0331,0337,0337,0337,0336,0336,0336,0333,0337,0337,0337,",
    "01063:0313,0304,0336,0336,0330,0333,0335,0343,0332,0332,0343,0334,0350,0343,0331,0331,0335,0335,0335,0335,0343,0330,0334,0334,0334,0334,0304,0333,0336,0333,0337,0337,0337,",
    "01064:0333,0336,0332,0337,0342,0336,0330,0334,0342,0330,0335,0350,0335,0342,0334,0351,0331,0337,0336,0333,0336,0333,0337,0337,",
    "01065:0313,0304,0336,0336,0330,0333,0335,0343,0335,0335,0350,0334,0350,0334,0343,0334,0351,0351,0331,0331,0331,0334,0342,0335,0335,0342,0330,0334,0342,0330,0342,0330,0334,0342,0330,0333,0333,0334,0333,0336,0333,0337,0337,0337,",
    "01066:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0330,0341,0332,0350,0350,0335,0337,0337,0342,0336,0336,0334,0351,0351,0333,0333,0333,0331,0336,0332,0337,0337,0337,",
    "01067:0336,0332,0336,0336,0333,0337,0337,0337,0333,0336,0332,0350,0350,0335,0337,0342,0330,0334,0334,0334,0334,0334,0336,0342,0351,0351,0335,0350,0350,0335,0337,0331,0334,0351,0351,0336,0333,0337,",
    "01070:0304,0313,0336,0336,0336,0332,0332,0337,0337,0337,0333,0336,0332,0336,0330,0341,0330,0330,0341,0333,0333,0331,0331,0331,0336,0332,0337,0337,0337,",
    "01071:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0337,0337,0342,0336,0330,0336,0330,0332,0341,0333,0333,0330,0337,0337,0331,",
    "01072:0333,0336,0332,0330,0336,0336,0336,0341,0331,0331,0331,0331,0331,0331,0331,0341,0333,0333,0333,0333,0331,0337,0337,0337,0337,",
    "01073:0333,0336,0332,0330,0336,0336,0336,0341,0331,0331,0331,0331,0334,0334,0337,0337,0350,0335,0342,0335,0351,0335,0331,0333,0337,0337,",
    "01074:0333,0336,0330,0332,0350,0335,0342,0335,0335,0342,0335,0351,0330,0335,0335,0333,0337,",
    "01075:0333,0336,0336,0332,0330,0334,0337,0342,0336,0333,0337,0342,0336,0332,0332,0335,0333,0337,0337,",
    "01076:0333,0336,0330,0332,0350,0334,0342,0334,0334,0342,0335,0335,0335,0351,0331,0333,0337,",
    "01077:0333,0336,0336,0332,0332,0330,0336,0331,0341,0330,0330,0342,0330,0330,0330,0343,0335,0335,0350,0334,0343,0335,0351,0330,0342,0335,0335,0337,0331,0331,0331,0336,0330,0333,0333,0333,0337,0337,0337,",
    "01100:0333,0336,0332,0330,0336,0336,0341,0337,0343,0334,0343,0334,0334,0336,0330,0342,0331,0337,0350,0335,0335,0343,0351,0330,0330,0335,0335,0333,0333,0337,0337,",
    "01101:0304,0313,0311,0305,0350,0350,0335,0342,0351,0335,0336,0333,0334,0334,0337,0342,0336,0336,0330,0334,0334,0342,0335,0335,0331,0350,0335,0337,0337,0304,0313,0336,0336,0336,0333,0337,0337,0337,",
    "01102:0304,0313,0336,0336,0336,0333,0337,0337,0337,0342,0330,0335,0336,0336,0342,0333,0333,0342,0332,0330,0343,0333,0333,0343,0333,0331,0342,0334,0337,0333,0336,0336,0333,0337,0337,0337,0304,0313,",
    "01103:0333,0336,0330,0332,0334,0343,0335,0335,0350,0334,0334,0343,0335,0335,0335,0335,0343,0351,0330,0335,0335,0333,0337,0304,0313,",
    "01104:0333,0332,0342,0336,0330,0350,0335,0343,0335,0335,0343,0335,0351,0330,0335,0335,0336,0333,0337,0333,0337,0304,0313,",
    "01105:0304,0313,0333,0336,0332,0336,0332,0332,0337,0337,0342,0335,0336,0342,0332,0336,0342,0337,0332,0342,0336,0331,0334,0337,0337,0333,0331,0304,0313,",
    "01106:0304,0313,0333,0336,0332,0336,0332,0332,0337,0337,0342,0335,0336,0332,0336,0342,0337,0332,0342,0336,0331,0334,0337,0337,0333,0331,0304,0313,",
    "01107:0304,0313,0333,0336,0330,0332,0334,0343,0335,0335,0350,0334,0334,0343,0335,0335,0335,0335,0343,0351,0330,0335,0335,0333,0337,0336,0336,0332,0336,0333,0337,0342,0330,0334,0342,0335,0331,0333,0337,0337,0304,0313,",
    "01110:0304,0313,0333,0336,0336,0332,0332,0337,0337,0342,0336,0332,0337,0342,0336,0330,0335,0342,0330,0334,0331,0336,0333,0337,0337,0304,0313,",
    "01111:0304,0313,0333,0336,0336,0332,0332,0334,0337,0342,0336,0330,0335,0337,0337,0342,0330,0336,0336,0334,0342,0335,0335,0342,0330,0330,0334,0337,0337,0331,",
    "01112:0304,0313,0333,0336,0330,0332,0342,0330,0335,0336,0342,0334,0334,0342,0334,0330,0330,0342,0330,0333,0343,0335,0335,0333,0331,0333,0336,0333,0337,0337,0337,",
    "01113:0304,0313,0333,0336,0332,0332,0337,0342,0336,0330,0350,0335,0310,0337,0342,0336,0313,0335,0335,0310,0337,0342,0336,0313,0335,0351,0330,0335,0335,0333,0337,0304,0313,0336,0336,0336,0333,0337,0337,0337,",
    "01114:0333,0336,0332,0336,0332,0337,0337,0342,0336,0335,0342,0330,0336,0330,0334,0337,0337,",
    "01115:0304,0310,0342,0330,0335,0306,0335,0311,0336,0342,0330,0334,0334,0342,0330,0334,0334,0334,0334,0350,0335,0337,0342,0330,0304,0335,0335,0313,0336,0336,0336,0333,0337,0337,0337,",
    "01116:0342,0330,0335,0306,0335,0313,0337,0312,0336,0342,0330,0334,0334,0350,0334,0337,0313,0336,0304,0342,0336,0336,0336,0333,0337,0337,0337,",
    "01117:0333,0336,0330,0332,0341,0331,0333,0337,",
    "01120:0333,0332,0336,0336,0333,0337,0337,0342,0336,0330,0336,0330,0333,0341,0333,0333,0330,0337,0337,0331,",
    "01121:0333,0336,0330,0332,0341,0335,0335,0336,0330,0332,0350,0334,0337,0342,0334,0351,0334,0333,0331,0336,0330,0337,0337,",
    "01122:0304,0313,0336,0336,0336,0333,0337,0337,0337,0342,0330,0335,0336,0336,0342,0333,0333,0342,0332,0330,0343,0333,0335,0337,0306,0350,0334,0337,0312,0336,0342,0337,0313,0336,0335,0330,0304,0334,0334,0333,0336,0336,0336,0332,0337,0337,0337,0337,",
    "01123:0313,0304,0336,0336,0332,0337,0337,0336,0330,0333,0336,0330,0343,0334,0350,0334,0343,0332,0332,0334,0334,0334,0334,0343,0335,0335,0335,0351,0343,0335,0335,0333,0331,0333,0337,0337,",
    "01124:0333,0336,0332,0337,0342,0330,0336,0335,0342,0331,0342,0330,0330,0334,0337,0331,",
    "01125:0333,0336,0336,0330,0332,0337,0342,0330,0336,0342,0331,0331,0332,0332,0342,0330,0342,0330,0342,0331,0331,0333,0335,0335,0343,0330,0335,0335,0337,0333,0337,",
    "01126:0333,0336,0332,0350,0350,0335,0337,0342,0334,0334,0342,0335,0335,0334,0351,0351,0336,0333,0337,",
    "01127:0336,0336,0336,0333,0333,0337,0337,0337,0304,0313,0350,0350,0350,0334,0342,0335,0335,0336,0342,0330,0304,0335,0350,0350,0335,0335,0335,0342,0330,0304,0334,0350,0334,0350,0334,0337,0342,0334,0350,0335,0304,0336,0336,0333,0336,0333,0337,0337,0337,",
    "01130:0313,0306,0350,0337,0312,0336,0335,0342,0334,0304,0337,0313,0336,0330,0335,0306,0335,0337,0312,0336,0342,0330,0334,0304,0334,0337,0313,0336,0336,0336,0336,0333,0337,0337,0337,",
    "01131:0304,0313,0336,0336,0336,0332,0337,0337,0337,0336,0333,0342,0330,0306,0350,0334,0337,0312,0336,0342,0335,0335,0342,0337,0313,0336,0334,0304,0331,0333,0337,0336,0336,0336,0332,0337,0337,0337,",
    "01132:0304,0335,0312,0336,0342,0337,0332,0336,0342,0337,0333,0306,0336,0334,0313,0337,0342,0335,0304,0336,0330,0334,0312,0337,0313,0336,0336,0336,0333,0337,0337,0337,",
    "01133:0333,0336,0336,0332,0332,0337,0337,0342,0330,0335,0336,0336,0342,0337,0337,0333,0336,0336,0342,0330,0330,0334,0337,0337,",
    "01134:0333,0336,0336,0332,0337,0337,0350,0350,0334,0342,0335,0351,0351,0336,0336,0333,0337,0337,",
    "01135:0333,0336,0336,0332,0337,0337,0342,0336,0336,0334,0342,0333,0333,0333,0333,0342,0335,0333,0337,0337,0331,",
    "01136:0333,0330,0336,0332,0334,0334,0350,0335,0342,0334,0334,0342,0334,0351,0334,0333,0337,0331,",
    "01137:0333,0334,0336,0336,0330,0337,0342,0336,0331,0335,0337,0337,",
    "01140:0333,0336,0332,0330,0336,0330,0350,0334,0342,0335,0351,0330,0333,0333,0337,0337,0331,",
    "01141:0304,0313,0336,0336,0336,0332,0332,0337,0337,0337,0333,0336,0332,0336,0330,0341,0333,0342,0331,0342,0330,0330,0332,0333,0333,0331,0331,0337,0337,0336,0336,0336,0332,0337,0337,0337,0313,0304,",
    "01142:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0332,0337,0337,0342,0336,0336,0330,0333,0341,0333,0333,0331,0337,0337,0336,0336,0336,0332,0337,0337,0337,0304,0313,",
    "01143:0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0336,0330,0350,0343,0334,0334,0343,0334,0334,0343,0334,0334,0330,0330,0334,0334,0351,0331,0336,0332,0337,0337,0337,",
    "01144:0333,0336,0336,0332,0332,0337,0337,0342,0336,0336,0330,0332,0341,0333,0333,0331,0337,0337,",
    "01145:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0330,0332,0343,0334,0334,0350,0335,0343,0334,0343,0335,0335,0342,0351,0335,0335,0342,0333,0330,0330,0334,0336,0332,0337,0337,0337,",
    "01146:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0337,0342,0330,0336,0336,0342,0330,0333,0343,0332,0331,0331,0335,0337,0336,0342,0334,0334,0342,0335,0331,0331,0331,0333,0333,0333,0333,0337,0337,0337,0304,0313,0336,0336,0336,0332,0337,0337,0337,",
    "01147:0304,0313,0336,0336,0336,0332,0332,0337,0337,0337,0333,0336,0332,0336,0330,0341,0333,0342,0331,0342,0331,0342,0331,0342,0332,0335,0335,0343,0331,0331,0332,0332,0334,0334,0337,0337,0336,0336,0336,0332,0337,0337,0337,",
    "01150:0304,0313,0342,0336,0330,0333,0336,0331,0332,0343,0333,0334,0334,0342,0330,0334,0334,0336,0333,0337,0337,0337,",
    "01151:0333,0336,0336,0332,0332,0332,0342,0330,0336,0342,0330,0330,0330,0336,0341,0331,0331,0331,0331,0331,0331,0331,0331,0331,0331,0337,0333,0333,0337,0337,0337,",
    "01152:0333,0336,0336,0332,0332,0332,0342,0331,0342,0332,0335,0335,0343,0332,0331,0331,0331,0336,0336,0341,0330,0330,0330,0330,0330,0330,0330,0330,0335,0335,0337,0333,0333,0337,0337,0337,",
    "01153:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0332,0337,0342,0330,0336,0342,0331,0350,0335,0342,0335,0335,0310,0337,0342,0336,0313,0334,0351,0334,0331,0333,0336,0333,0337,0337,0337,0304,0313,",
    "01154:0304,0313,0336,0336,0336,0332,0337,0337,0337,0333,0336,0336,0332,0332,0332,0336,0336,0350,0335,0342,0334,0337,0337,0337,0342,0330,0336,0342,0330,0334,0334,0334,0336,0342,0335,0351,0335,0337,0331,0331,0331,0333,0337,0337,",
    "01155:0304,0313,0333,0336,0332,0336,0332,0336,0332,0332,0337,0337,0342,0336,0333,0330,0336,0332,0343,0333,0333,0343,0332,0331,0342,0331,0342,0337,0333,0342,0333,0337,0337,",
    "01156:0304,0313,0333,0336,0332,0336,0332,0336,0332,0332,0337,0337,0342,0336,0333,0330,0336,0332,0343,0333,0331,0331,0337,0342,0333,0337,0337,",
    "01157:0304,0313,0333,0336,0332,0336,0332,0330,0341,0333,0333,0331,0337,0337,",
    "01160:0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0336,0332,0342,0335,0335,0337,0342,0336,0331,0332,0341,0333,0334,0334,0342,0331,0333,0333,0333,0337,0337,",
    "01161:0304,0313,0333,0336,0332,0336,0330,0332,0341,0333,0342,0331,0331,0337,0342,0336,0333,0334,0334,0336,0333,0343,0335,0335,0330,0330,0333,0337,0337,0337,",
    "01162:0333,0336,0332,0336,0332,0337,0342,0330,0336,0336,0342,0350,0335,0350,0337,0337,0335,0342,0335,0351,0351,0330,0334,0331,0336,0336,0333,0337,0337,0337,",
    "01163:0304,0313,0336,0336,0332,0337,0337,0333,0336,0336,0332,0332,0330,0336,0330,0350,0343,0334,0334,0343,0334,0350,0334,0343,0334,0351,0330,0330,0343,0334,0334,0343,0334,0334,0335,0343,0334,0351,0331,0333,0333,0337,0337,0337,",
    "01164:0304,0313,0333,0336,0332,0342,0330,0336,0342,0334,0342,0335,0335,0342,0333,0333,0336,0330,0335,0343,0335,0335,0333,0333,0333,0337,0337,0337,",
    "01165:0304,0313,0336,0336,0330,0342,0333,0334,0334,0343,0332,0334,0334,0342,0334,0334,0342,0330,0335,0335,0336,0333,0337,0337,0337,",
    "01166:0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0350,0350,0334,0342,0335,0335,0342,0334,0351,0351,0333,0337,0336,0336,0336,0332,0337,0337,0337,",
    "01167:0336,0336,0336,0333,0337,0337,0337,0313,0304,0336,0336,0336,0333,0337,0350,0350,0334,0337,0342,0335,0335,0336,0342,0330,0335,0335,0335,0335,0335,0335,0342,0330,0334,0334,0334,0334,0334,0334,0337,0342,0334,0304,0336,0333,0336,0333,0337,0337,0337,",
    "01170:0304,0313,0336,0306,0350,0335,0342,0351,0336,0333,0334,0337,0342,0350,0335,0304,0336,0336,0333,0337,0337,0337,",
    "01171:0304,0313,0336,0336,0332,0337,0337,0333,0336,0332,0336,0350,0335,0337,0350,0334,0342,0334,0334,0342,0334,0334,0334,0334,0334,0334,0342,0334,0351,0351,0335,0335,0333,0337,0336,0336,0336,0332,0337,0337,0337,",
    "01172:0304,0313,0336,0350,0335,0310,0337,0342,0330,0334,0334,0334,0336,0342,0334,0337,0330,0334,0334,0334,0336,0342,0330,0334,0334,0304,0313,0337,0336,0336,0336,0333,0337,0337,0337,",
    "01173:0333,0336,0330,0332,0336,0336,0330,0334,0350,0334,0342,0335,0335,0335,0342,0330,0335,0342,0334,0331,0331,0331,0334,0342,0335,0331,0342,0335,0335,0335,0342,0335,0351,0335,0335,0331,0331,0333,0333,0337,0337,0337,",
    "01174:0333,0336,0332,0337,0342,0330,0336,0336,0342,0337,0337,0331,0336,0336,0331,0342,0330,0333,0337,0337,",
    "01175:0333,0336,0336,0332,0332,0330,0330,0336,0330,0342,0330,0350,0334,0342,0335,0331,0335,0335,0335,0342,0335,0330,0330,0334,0334,0334,0342,0335,0335,0335,0342,0330,0335,0342,0334,0351,0330,0330,0335,0335,0333,0333,0333,0337,0337,0337,",
    "01176:0330,0336,0336,0336,0331,0331,0333,0333,0341,0331,0331,0331,0331,0331,0331,0333,0333,0333,0333,0337,0337,0337,",
    "01200:0333,0200,0336,0336,0330,0332,0337,0200,0336,0331,0333,0337,0337,",
    "01201:0304,0313,0333,0200,0336,0336,0330,0330,0332,0332,0332,0335,0336,0337,0337,0342,0330,0335,0350,0335,0336,0336,0342,0335,0335,0342,0335,0304,0337,0331,0331,0333,0337,0337,",
    "01202:0202,0200,",
    "01203:0304,0313,0202,0332,0333,0200,0336,0336,0330,0330,0332,0332,0332,0335,0336,0337,0337,0342,0330,0335,0350,0335,0336,0336,0342,0335,0335,0342,0335,0304,0337,0331,0331,0333,0337,0337,",
    "01204:0202,0200,0336,0336,0330,0332,0337,0200,0336,0331,0333,0337,0337,",
    "01205:0202,0200,0336,0336,0330,0332,0332,0332,0330,0205,0331,0331,0332,0337,0337,0333,",
    "01206:0202,0200,0336,0332,0206,0333,0337,",
    "01207:0333,0336,0330,0332,0336,0336,0341,0337,0333,0333,0331,0331,0337,0337,",
    "01210:0333,0200,0336,0336,0330,0332,0337,0200,0311,0337,0310,0336,0200,0337,0311,0336,0313,0336,0330,0332,0336,0335,0331,0337,0342,0334,0333,0333,0336,0333,0337,0331,0331,0337,0337,",
    "01211:0333,0200,0336,0336,0330,0332,0337,0200,0311,0337,0310,0336,0200,0337,0311,0336,0313,0336,0330,0332,0336,0335,0331,0337,0342,0334,0336,0333,0342,0335,0335,0342,0335,0335,0333,0337,0333,0336,0333,0337,0331,0331,0337,0337,",
    "01212:0336,0330,0333,0337,0212,0336,0336,0333,0331,0337,0200,0336,0333,0331,0337,0337,0200,",
    "01213:0333,0200,0336,0330,0332,0336,0331,0332,0336,0330,0332,0332,0337,055,062,045,0211,0211,0211,0365,0210,0210,0210,0336,0337,0331,0336,0331,0337,0337,0337,0333,",
    "01214:0333,0200,0336,0330,0332,0336,0331,0332,0336,0330,0332,0332,0337,053,062,045,0211,0211,0211,0365,0210,0210,0210,0336,0337,0331,0336,0331,0337,0337,0337,0333,",
    "01220:0333,0200,0336,0332,0332,0330,0220,0336,0332,0337,0331,0337,0320,",
    "01221:0333,0200,0336,0330,0332,0336,0332,0332,0336,0221,0336,0333,0337,0337,0337,0331,0337,0335,0335,0331,0333,0335,0335,0331,0333,0320,",
    "01222:0333,0200,0336,0332,0330,0332,0333,0222,0333,0331,0337,",
    "01223:0333,0200,0336,0330,0332,0336,0333,0332,0223,0336,0333,0331,0333,0333,0331,0331,0333,0320,0331,0337,0337,0337,",
    "01224:0333,0200,0336,0332,0330,0224,0333,0331,0337,",
    "01225:0333,0200,0336,0330,0332,0336,0332,0336,0333,0337,0225,0333,0337,0331,0336,0333,0336,0333,0337,0337,0337,",
    "01226:0333,0200,0336,0330,0332,0226,0333,0331,0337,",
    "01227:0333,0200,0336,0330,0332,0210,0227,0211,0331,0333,0337,",
    "01230:0333,0200,0336,0330,0332,0230,0331,0304,0333,0337,",
    "01231:0333,0200,0332,0336,0330,0333,0336,0231,0331,0336,0333,0331,0333,0336,0330,0333,0320,0337,0337,0337,0337,0210,0210,0210,",
    "01232:0333,0200,0336,0330,0332,0331,0232,0331,0331,0331,0333,0337,",
    "01233:0333,0200,0336,0332,0337,0336,0330,0332,0336,0331,0333,0337,0332,0233,0331,0336,0330,0337,0337,",
    "01234:0333,0200,0336,0330,0332,0332,0332,0336,0333,0337,0234,0333,0333,0333,0331,0336,0333,0331,0337,0337,0337,0210,0210,0337,0336,",
    "01235:0333,0200,0235,",
    "01236:0333,0200,0236,",
    "01237:0333,0200,0336,0330,0332,0332,0237,0331,0336,0332,0337,0337,",
    "01240:0333,0200,0332,0336,0240,0336,0332,0337,0337,",
    "01241:0333,0200,0336,0332,0241,0333,0337,",
    "01242:0333,0200,0336,0332,0332,0336,0330,0330,0242,0336,0331,0331,0331,0331,0332,0337,0337,0337,",
    "01243:0333,0200,0336,0332,0332,0243,0337,",
    "01244:0333,0200,0332,0336,0330,0336,0336,0243,0243,0243,0243,0331,0331,0331,0331,0337,0337,0337,",
    "01245:0333,0200,0336,0332,0336,0331,0337,0245,0333,0336,0330,0337,0337,",
    "01246:0333,0200,0330,0332,0336,0331,0336,0332,0337,0246,0333,0333,0336,0333,0331,0331,0337,0337,",
    "01247:0333,0200,0336,0330,0332,0337,0247,0336,0333,0331,0337,",
    "01300:0333,0200,0336,0330,0332,0340,0350,0335,0336,0330,0342,0331,0331,0331,0342,0330,0330,0335,0335,0331,0331,0342,0330,0330,0330,0342,0331,0334,0334,0334,0351,0331,0331,0333,0333,0337,0337",
    "01301:0336,0333,0337,0307,0350,0335,0351,0201,0304,0335,0335,0301,0335,0317,0336,0201,0304,0335,0335,0337,0301,0335,0201,0334,0304,0313,0334,0336,0333,0337,0200,",
    "01302:0333,",
    "01303:0333,",
    "01304:0333,0200,0336,0330,0332,0341,0342,0335,0342,0335,0342,0335,0342,0350,0335,0351,0336,0336,0330,0330,0341,0331,0331,0335,0330,0330,0341,0331,0331,0335,0330,0330,0341,0331,0331,0335,0330,0330,0341,0331,0331,0350,0334,0351,0337,0337,0330,0335,0335,0333,0337",
    "01305:0333,0200,0336,0330,0332,0305,0342,0335,0342,0335,0342,0335,0342,0335,0342,0335,0341,0350,0335,0351,0336,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0350,0335,0304,0337,0331,0333,0337",
    "01306:0333,0200,0336,0330,0332,0306,0342,0335,0342,0335,0342,0335,0342,0335,0342,0335,0341,0350,0335,0351,0336,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0335,0330,0336,0336,0341,0337,0337,0331,0350,0335,0335,0335,0337,0342,0334,0336,0330,0336,0336,0341,0337,0337,0331,0304,0335,0337,0331,0333,0337",
    "01307:0333,0336,0330,0332,0307,0342,0335,0342,0335,0342,0335,0342,0335,0342,0335,0342,0335,0342,0335,0341,0304,0331,0333,0337,0200,",
    "01310:0333,0200,0336,0332,0350,0335,0310,0337,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0342,0330,0334,0334,0334,0351,0336,0313,0333,0337",
    "01311:0333,0200,0334,0305,0335,0311,0337,0362,0203,0334,0334,0203,0334,0350,0336,0334,0203,0354,0334,0334,0334,0334,0201,0335,0335,0335,0336,0201,0334,0334,0334,0336,0201,0331,0335,0335,0335,0337,0331,0334,0334,0334,0337,0331,0334,0304,0335,0313,",
    "01312:0304,0313,0333,0200,0334,0306,0335,0362,0203,0334,0334,0203,0364,0335,0335,0335,0350,0335,0312,0336,0330,0334,0334,0342,0335,0335,0335,0335,0342,0335,0335,0335,0335,0342,0335,0335,0331,0335,0335,0337,0304,0313,",
    "01313:0333,0200,0336,0336,0330,0332,0362,0203,0334,0203,0203,0334,0203,0334,0203,0203,0354,0334,0332,0342,0333,0333,0331,0337,0337,",
    "01314:0333,0200,0314,0336,0332,0332,0330,0200,0333,0200,0333,0200,0331,0337,0313",
    "01315:0333,",
    "01316:0333,0200,0336,0336,0330,0332,0332,0332,0336,0341,0330,0330,0330,0330,0341,0333,0333,0331,0331,0341,0333,0333,0330,0330,0341,0331,0331,0331,0331,0341,0333,0333,0331,0331,0337,0337,0337,",
    "01317:0336,0333,0337,0307,0350,0335,0351,0201,0304,0335,0335,0301,0335,0317,0336,0201,0304,0335,0335,0337,0301,0335,0201,0334,0304,0313,0334,0336,0333,0337,0200,0336,0332,0342,0317,0336,0330,0340,0331,0337,0337,0330,0340,0331,0336,0313,0333,0337,",
    "01320:0333,0200,0336,0336,0330,0332,0337,0320,0204,0336,0333,0331,0337,0337,",
    "01321:0333,0200,0336,0336,0330,0332,0337,0321,0204,0336,0333,0320,0331,0337,0337,",
    "01322:0333,0200,0336,0336,0330,0332,0337,0322,0204,0320,0336,0333,0331,0337,0337,",
    "01323:0333,0200,0336,0336,0330,0332,0337,0323,0204,0320,0336,0333,0331,0337,0337,",
    "01324:0333,0200,0336,0336,0330,0332,0337,0324,0204,0320,0336,0333,0331,0337,0337,",
    "01325:0333,0200,0336,0336,0330,0332,0337,0325,0204,0320,0336,0333,0331,0337,0337,",
    "01326:0333,0200,0336,0336,0330,0332,0337,0326,0204,0336,0320,0333,0331,0337,0337,",
    "01327:0333,0200,0336,0336,0330,0332,0337,0327,0204,0336,0320,0333,0331,0337,0337,",
    "01330:0333,0200,0336,0332,0330,0337,0212,0336,0331,0333,0337,",
    "01331:0333,0200,0336,0332,0330,0337,0335,0335,0212,0335,0335,0336,0331,0333,0337,",
    "01332:0333,0200,0336,0332,0330,0337,0335,0335,0335,0212,0335,0336,0331,0333,0337,",
    "01333:0333,0200,0336,0332,0330,0337,0335,0212,0335,0335,0335,0336,0331,0333,0337,",
    "01334:0333,0200,0336,0330,0332,0336,0350,0343,0334,0334,0343,0334,0334,0343,0334,0330,0350,0335,0351,0335,0330,0335,0335,0335,0335,0362,0203,0334,0334,0203,0364,0331,0350,0335,0330,0335,0335,0304,0337,0333,0331,0337,",
    "01335:0333,0200,0336,0330,0332,0336,0335,0350,0335,0335,0343,0335,0335,0343,0335,0335,0343,0335,0330,0350,0335,0304,0350,0331,0362,0203,0334,0334,0203,0364,0331,0335,0335,0331,0334,0335,0330,0350,0334,0331,0334,0334,0304,0337,0333,0331,0337,",
    "01336:0333,0200,0336,0330,0334,0336,0330,0337,0342,0336,0331,0335,0337,0331,0337,",
    "01337:0333,0200,0336,0330,0332,0336,0342,0334,0342,0334,0342,0334,0342,0330,0330,0334,0337,0331,0337",
    "01340:0333,0200,0336,0330,0332,0340,0333,0331,0337",
    "01341:0333,0200,0336,0330,0332,0341,0340,0333,0331,0337",
    "01342:0333,0200,0336,0330,0332,0334,0336,0342,0330,0340,0331,0335,0335,0342,0330,0340,0333,0333,0330,0334,0337,0337",
    "01343:0333,0200,0336,0330,0332,0350,0343,0335,0342,0334,0334,0342,0335,0340,0351,0331,0333,0337",
    "01344:0333,0200,0336,0330,0332,0336,0332,0340,0335,0337,0342,0330,0340,0334,0332,0336,0331,0332,0331,0337,0337,0202,",
    "01345:0202,0200,0350,0334,0343,0335,0304,",
    "01346:0202,0200,0350,0334,0332,0335,0335,0343,0333,0335,0304,0334,",
    "01347:0304,0313,0333,0200,0336,0332,0336,0330,0330,0347,0331,0331,0337,0333,0337,",
    "01350:0333,0200,0336,0330,0332,0350,0335,0330,0335,0335,0335,0335,0362,0203,0334,0334,0203,0364,0331,0334,0336,0336,0201,0330,0201,0331,0331,0331,0334,0334,0304,0337,0337,0333,0331,0337,",
    "01351:0333,0200,0336,0330,0332,0335,0350,0335,0330,0335,0335,0335,0335,0362,0203,0335,0335,0336,0336,0203,0364,0330,0201,0330,0201,0331,0331,0331,0331,0331,0335,0337,0337,0342,0336,0336,0334,0334,0304,0337,0337,0333,0331,0337,",
    "01352:0333,0200,0336,0330,0332,0335,0350,0352,0334,0334,0334,0342,0335,0335,0336,0336,0342,0330,0330,0342,0331,0331,0335,0335,0342,0330,0330,0342,0331,0331,0335,0335,0337,0337,0342,0335,0335,0335,0351,0353,0330,0334,0334,0333,0337",
    "01353:0333,0200,0336,0330,0332,0335,0350,0352,0334,0342,0335,0335,0342,0335,0335,0336,0336,0342,0330,0330,0342,0331,0331,0334,0334,0334,0334,0334,0334,0342,0330,0330,0342,0331,0331,0335,0335,0335,0351,0353,0337,0337,0333,0330,0334,0337",
    "01354:0333,0200,0330,0332,0336,0336,0333,0331,0335,0337,0362,0203,0335,0203,0364,0340,0335,0335,0350,0336,0336,0335,0342,0334,0334,0342,0337,0337,0310,0337,0342,0335,0304,0336,0313,0336,0333,0331,0337,0337,",
    "01360:0333,0200,0336,0336,0332,0332,0332,0330,0335,0337,0342,0340,0366,0330,0332,0335,0335,0367,0335,0336,0333,0330,0337,0337,0331,0332,0202,",
    "01361:0333,0200,0336,0336,0332,0332,0332,0330,0335,0337,0366,0330,0332,0335,0335,0367,0335,0336,0340,0334,0337,0342,0336,0333,0330,0337,0337,0331,0335,0331,0336,0332,0337,0332,0202,",
    "01362:0333,0200,0336,0330,0332,0336,0331,0332,0340,0337,0362,0203,0335,0203,0364,0334,0334,0336,0350,0335,0330,0304,0335,0335,0362,0203,0335,0203,0364,0331,0350,0335,0304,0335,0333,0330,0337,0337,0331,",
    "01363:0202,0200,0330,0332,0336,0336,0333,0331,0337,0335,0362,0203,0335,0203,0364,0335,0335,0336,0350,0334,0330,0335,0335,0335,0335,0362,0203,0334,0334,0203,0364,0331,0340,0334,0304,0333,0331,0337,0337,",
    "01364:0333,0200,0330,0332,0336,0336,0333,0331,0337,0335,0362,0203,0335,0203,0364,0335,0335,0336,0350,0334,0330,0335,0335,0335,0335,0362,0203,0334,0334,0203,0364,0331,0340,0334,0304,0333,0331,0337,0337,",
    "01365:0333,0200,0336,0330,0332,0336,0330,0336,0331,0337,0335,0335,0306,0210,0210,0350,0335,0337,0330,0335,0335,0335,0335,0330,0335,0335,0335,0335,0335,0335,0362,0203,0334,0334,0334,0334,0203,0335,0335,0335,0335,0203,0334,0334,0334,0334,0203,0364,0331,0334,0334,0330,0335,0211,0211,0304,0333,0331,0331,0336,0336,0330,0337,0330,0337,0337,",
    "01366:0333,0200,0336,0336,0332,0332,0332,0330,0335,0337,0342,0340,0366,0330,0332,0335,0335,0367,0335,0336,0333,0330,0337,0337,0331,",
    "01367:0333,0200,0336,0336,0332,0332,0332,0330,0335,0337,0366,0330,0332,0335,0335,0367,0335,0336,0340,0334,0337,0342,0336,0333,0330,0337,0337,0331,0335,0331,0336,0332,0337,",
    "01370:0333,0200,0336,0336,0336,0330,0332,0337,0337,0321,0362,0203,0336,0203,0364,0334,0337,0335,0320,0331,0200,0336,0330,0332,0336,0336,0347,0337,0337,0331,0335,0335,0336,0330,0337,0336,0336,0331,0335,0362,0203,0334,0203,0203,0335,0203,0334,0350,0334,0310,0337,0203,0203,0334,0334,0203,0203,0334,0334,0334,0336,0203,0335,0335,0203,0203,0334,0334,0203,0363,0304,0335,0313,0304,0330,0337,0337,0333,0331,0336,0333,0331,0337,0337,0337,",
    "01371:0333,0200,0336,0336,0336,0330,0332,0337,0337,0321,0362,0203,0336,0203,0364,0334,0337,0335,0320,0331,0200,0336,0330,0332,0336,0336,0347,0337,0337,0331,0335,0335,0336,0330,0337,0336,0336,0331,0335,0335,0332,0332,0332,0332,0332,0332,0335,0335,0331,0331,0331,0331,0331,0332,0333,0333,0333,0333,0362,0203,0334,0203,0203,0335,0203,0334,0350,0334,0310,0337,0203,0203,0334,0334,0203,0203,0334,0334,0334,0336,0203,0335,0335,0203,0203,0334,0334,0203,0363,0304,0330,0313,0335,0335,0332,0337,0337,0330,0336,0330,0336,0330,0337,0337,0337,0337,0333,0331,",
    "01372:0333,0200,0336,0336,0336,0330,0332,0337,0337,0321,0362,0203,0336,0203,0364,0334,0337,0335,0320,0331,0200,0336,0330,0332,0336,0336,0332,0337,0341,0333,0341,0332,0337,0331,0335,0335,0336,0330,0337,0336,0336,0331,0335,0362,0203,0334,0203,0203,0335,0203,0334,0350,0334,0310,0337,0203,0203,0334,0334,0203,0203,0334,0334,0334,0336,0203,0335,0335,0203,0203,0334,0334,0203,0363,0304,0330,0313,0335,0335,0332,0337,0337,0330,0336,0330,0336,0330,0337,0337,0337,0337,0333,0331,0334,0333,0330,0336,0336,0331,0336,0331,0336,0333,0337,0337,0337,0337,",
    "01373:0333,0200,0336,0336,0336,0330,0332,0337,0337,0321,0362,0203,0336,0203,0364,0334,0337,0335,0320,0331,0200,0336,0330,0332,0336,0336,0332,0337,0341,0333,0341,0332,0337,0331,0335,0335,0336,0330,0337,0336,0336,0331,0335,0335,0333,0332,0332,0332,0332,0332,0332,0335,0335,0331,0331,0331,0331,0331,0332,0333,0333,0333,0333,0362,0203,0334,0203,0203,0335,0203,0334,0350,0334,0310,0337,0203,0203,0334,0334,0203,0203,0334,0334,0334,0336,0203,0335,0335,0203,0203,0334,0334,0203,0363,0304,0330,0313,0335,0335,0332,0337,0337,0330,0336,0330,0336,0330,0337,0337,0337,0337,0333,0331,",
    "01374:0333,0200,0336,0336,0336,0330,0332,0337,0337,0321,0362,0203,0336,0203,0364,0334,0337,0335,0320,0331,0200,0336,0330,0332,0336,0336,0332,0337,0331,0332,0335,0336,0332,0336,0333,0330,0337,0337,0337,0362,0306,0203,0334,0334,0203,0334,0334,0203,0354,0335,0304,0335,0336,0332,0337,0331,0335,0335,0336,0330,0337,0336,0336,0331,0331,0332,0332,0332,0332,0331,0335,0362,0203,0334,0203,0203,0335,0203,0334,0350,0334,0310,0337,0203,0203,0334,0334,0203,0203,0334,0334,0334,0336,0203,0335,0335,0203,0203,0334,0334,0203,0363,0304,0330,0313,0335,0335,0332,0337,0337,0330,0336,0330,0336,0330,0337,0337,0337,0337,0333,0331,0334,0333,0330,0336,0336,0331,0336,0331,0336,0336,0333,0331,0337,0337,0337,0337,0337,",
    "01375:0333,0200,0336,0336,0336,0330,0332,0337,0337,0321,0362,0203,0336,0203,0364,0334,0337,0335,0320,0331,0200,0336,0330,0332,0336,0336,0332,0337,0331,0332,0335,0336,0332,0336,0333,0330,0337,0337,0337,0362,0306,0203,0334,0334,0203,0334,0334,0203,0354,0335,0304,0335,0336,0332,0337,0331,0335,0335,0336,0330,0337,0336,0336,0331,0331,0332,0332,0332,0332,0331,0335,0335,0335,0335,0331,0331,0331,0331,0332,0333,0333,0333,0333,0333,0333,0333,0333,0333,0362,0203,0334,0203,0203,0335,0203,0334,0350,0334,0310,0337,0203,0203,0334,0334,0203,0203,0334,0334,0334,0336,0203,0335,0335,0203,0203,0334,0334,0203,0363,0304,0330,0313,0335,0335,0332,0337,0337,0330,0336,0330,0336,0330,0337,0337,0337,0337,0333,0331,0334,0333,0330,0336,0336,0331,0336,0331,0336,0336,0333,0331,0337,0337,0337,0337,0337,0335,0336,0333,0331,0331,0336,0336,0336,0333,0337,0337,0337,0337,",
    "01376:0333,0200,0336,0336,0336,0330,0332,0337,0337,0321,0362,0203,0336,0203,0364,0334,0337,0335,0320,0331,0200,0336,0330,0332,0336,0336,0332,0337,0331,0332,0335,0336,0332,0336,0333,0330,0337,0337,0337,0362,0203,0334,0203,0334,0203,0334,0203,0354,0335,0304,0335,0336,0332,0337,0331,0335,0335,0336,0330,0337,0336,0336,0331,0331,0332,0332,0332,0332,0331,0335,0362,0203,0334,0203,0203,0335,0203,0334,0350,0334,0310,0337,0203,0203,0334,0334,0203,0203,0334,0334,0334,0336,0203,0335,0335,0203,0203,0334,0334,0203,0363,0304,0330,0313,0335,0335,0332,0337,0337,0330,0336,0330,0336,0330,0337,0337,0337,0337,0333,0331,0334,0333,0330,0336,0336,0331,0336,0331,0336,0336,0333,0331,0337,0337,0337,0337,0337,",
    "01377:0333,0200,0336,0336,0336,0330,0332,0337,0337,0321,0362,0203,0336,0203,0364,0334,0337,0335,0320,0331,0200,0336,0330,0332,0336,0336,0332,0337,0331,0332,0335,0336,0332,0336,0333,0330,0337,0337,0337,0362,0203,0334,0203,0334,0203,0334,0203,0354,0335,0304,0335,0336,0332,0337,0331,0335,0335,0336,0330,0337,0336,0336,0331,0331,0331,0331,0331,0333,0333,0333,0333,0331,0331,0362,0203,0334,0203,0203,0335,0203,0334,0350,0334,0310,0337,0203,0203,0334,0334,0203,0203,0334,0334,0334,0336,0203,0335,0335,0203,0203,0334,0334,0203,0363,0304,0330,0313,0335,0335,0332,0337,0337,0330,0336,0330,0336,0330,0337,0337,0337,0337,0333,0331,0334,0333,0330,0336,0336,0331,0336,0331,0336,0336,0333,0331,0337,0337,0337,0337,0337,0335,0336,0333,0336,0336,0336,0333,0337,0337,0337,0337,0331,"
]

