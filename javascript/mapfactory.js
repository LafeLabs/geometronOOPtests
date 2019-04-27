

function MapBox(w,h,map,div) {
    this._w = w;
    this._h = h;
    this._map = map; 
    this._div = div; 

    this.draw = function(MapBox) {
        MapBox._div.innerHTML = "";
        for(var index = 0;index < MapBox._map._array.length;index++){
            var newdiv = document.createElement("DIV");
            newdiv.style.position = "absolute";

        }
    }

}

function Map(name) {
    this._name = name;
    this._mapArray = [];
}


function MapLink(x,y,w,h,theta,href,url,type) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this._theta = theta;
    this._href = href;
    this._url = url;
    this._type = type;

}


