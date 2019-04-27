

function MapBox(w,h,map,div) {
    this.w = w;//width of div element map will be drawn in
    this.h = h;//height of div element
    this.map = map;//Map object, which has a name and an array of MapLinks
    this.div = div; //div element in document

    this.div.style.width = this.w + "px"; //set width of div
    this.div.style.height = this.h + "px";//set height of div


    this.draw = function(MapBox) {
        MapBox.div.innerHTML = "";
        for(var index = 0;index < MapBox.map.array.length;index++){
            var newa = document.createElement("A");
            newa.style.position = "absolute";
            MapBox.div.appendChild(newa);
            newa.style.left = (MapBox.map.array[index].x*MapBox.w).toString() + "px";
            newa.style.top  = (MapBox.map.array[index].y*MapBox.w).toString() + "px";
            newa.style.width  = (MapBox.map.array[index].w*MapBox.w).toString() + "px";
            newa.style.transform  = "rotate(" + (MapBox.map.array[index].angle).toString() + "deg)";
            if(MapBox.map.array[index].type == "image") {
                var newimg = document.createElement("IMG");
                newimg.style.position = "absolute";
                newimg.style.left = "0px";
                newimg.style.top = "0px";
                newimg.style.width = "100%";
                
                if(MapBox.map.array[index].href.length > 0){
                    newa.href = MapBox.map.array[index].href;
                }
                newa.appendChild(newimg);
                
                newimg.src = MapBox.map.array[index].url;
                newimg.onload = function(){
                    this.parentElement.style.height = this.height + "px";
                }
            }
            if(MapBox.map.array[index].type == "text"){
                newa.innerHTML = MapBox.map.array[index].text;
            }
        }
    }

}

function Map(name) {
    this.name = name;
    this.array = [];
}


function MapLink(x,y,w,h,angle,text,href,url,type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = angle;
    this.text = text;
    this.href = href;
    this.url = url;
    this.type = type;

}


