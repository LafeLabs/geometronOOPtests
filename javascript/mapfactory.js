

function MapBox(w,h,map,div) {
    this._w = w;
    this._h = h;
    this._map = map; 
    this._div = div; 

    this._div.style.width = this._w + "px";
    this._div.style.height = this._h + "px";


    this.draw = function(MapBox) {
        MapBox._div.innerHTML = "";
        for(var index = 0;index < MapBox._map._array.length;index++){
            var newdiv = document.createElement("DIV");
            newdiv.style.position = "absolute";
            MapBox._div.appendChild(newdiv);
            newdiv.style.left = (MapBox._map._array[index]._x*MapBox._w).toString() + "px";
            newdiv.style.top  = (MapBox._map._array[index]._y*MapBox._w).toString() + "px";
            newdiv.style.width  = (MapBox._map._array[index]._w*MapBox._w).toString() + "px";
            newdiv.style.transform  = "rotate(" + (MapBox._map._array[index]._angle).toString() + "deg)";
            if(MapBox._map._array[index]._type == "image") {
                var newimg = document.createElement("IMG");
                newimg.style.position = "absolute";
                newimg.style.left = "0px";
                newimg.style.top = "0px";
                newimg.style.width = "100%";
                newdiv.appendChild(newimg);
                newimg.src = MapBox._map._array[index]._url;
                newimg.onload = function(){
                    this.parentElement.style.height = this.height + "px";
                }
            }
            if(MapBox._map._array[index]._type == "text"){
                newdiv.innerHTML = MapBox._map._array[index]._text;
            }
        }
    }

}

function Map(name) {
    this._name = name;
    this._array = [];
}


function MapLink(x,y,w,h,angle,text,href,url,type) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this._angle = angle;
    this._text = text;
    this._href = href;
    this._url = url;
    this._type = type;

}


