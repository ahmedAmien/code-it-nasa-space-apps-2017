function MapDatum(data, lat, long) {
  var resultCell;
  var resolutions = data.resolutions;
  var maxCellScan = 16;
  var outCoords = {};
  
  var baseLatX = 0;
  var baseLatY = 0;
  
  var rangeX = data.rangeX;
  var rangeY = data.rangeY;
  
  lat = data.bounds.minX + ((1 - ((lat - data.bounds.minX) / rangeX)) * rangeX);
  long = data.bounds.minY + ((1 - ((lat - data.bounds.minY) / rangeY)) * rangeY);
  
  for (var i=0; i<resolutions.length; i++) {
    var res    = resolutions[i];
    var resMap = data.map[res];
    
    if (i === resolutions.length - 1) {
      // We're at the last resolution
      
    } else {
      // Interim resolution
      var halfX = baseLatX + (rangeX / (res / 2));
      var halfY = baseLatY + (rangeY / (res / 2));
      
      baseLatX += lat > halfX ? (rangeX / (res / 2)) : 0;
      baseLatY += long > halfY ? (rangeY / (res / 2)) : 0;
    }
  }
  
  // return outCoords;
  return JSON.stringify({
    lat,
    long,
    baseLatX,
    baseLatY,
    minX: data.bounds.minX,
    minY: data.bounds.minY
  });
}

module.exports = MapDatum;
