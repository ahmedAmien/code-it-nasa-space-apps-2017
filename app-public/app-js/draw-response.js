CodeIt.draw = {
  newData(res) {
    var data = res.meta;
    var map  = CodeIt.map;
    
    var waterMarker = new google.maps.Marker({
      position: {
        lat: data.lat,
        lng: data.long
      },
      map: map,
      title: "Water Source"
    });
    
    var waterPathCoords = [
      {
        lat: data.oldLat,
        lng: data.oldLong
      },
      {
        lat: data.lat,
        lng: data.long
      }
    ];
    
    var waterPath = new google.maps.Polyline({
      path: waterPathCoords,
      geodesic: true,
      strokeColor: '#4382BF',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });
    
    function makeInfo(you, factor, marker) {
      var info = `
        <b>${ factor }</b>mm aggregate of water
      `.replace(/\n\s+(?!$)/g, " ").trim();
      
      if (you) {
        info = `
          <b>You're Here</b><br><br>
        `.trim() + info;
      } else {
        info = `
          <b>Go Here</b><br><br>
        `.trim() + info;
      }
      
      var infoWindow = new google.maps.InfoWindow({
        content: info,
        maxWidth: 150
      });
      
      infoWindow.open(map, marker);
      return infoWindow;
    }
    
    // Add info
    var userInfo = makeInfo(true, data.userFactor, CodeIt.markers.youMarker);
    var newInfo  = makeInfo(false, data.factor, waterMarker);
    
    // Draw on map
    waterPath.setMap(map);
    
    // Draw heatmap
    var heatPoints = CodeIt.draw.pointsToLatLng(res.data);
    
    // Add heatPoints to modes
    CodeIt.modes.water_storage.densityMap = heatPoints;
    
    var heatGrad = [
      "rgba(239, 0, 3, 0)",
      "rgba(239, 0, 3, 0)",
      "rgba(215, 8, 28, 1)",
      "rgba(191, 17, 53, 1)",
      "rgba(167, 26, 78, 1)",
      "rgba(143, 35, 103, 1)",
      "rgba(119, 44, 129, 1)",
      "rgba(95, 53, 154, 1)",
      "rgba(71, 62, 179, 1)",
      "rgba(47, 71, 204, 1)",
      "rgba(23, 80, 229, 1)",
      "rgba(0, 89, 255, 1)"
    ];
    
    console.log(heatPoints);
    var waterHeatMap = new google.maps.visualization.HeatmapLayer({
      data: heatPoints,
      map: map
    });
    
    waterHeatMap.setMap(map);
    waterHeatMap.set('gradient', heatGrad);
    waterHeatMap.set('radius', 5);
    waterHeatMap.set('opacity', 10);
    
    CodeIt.heatMap = waterHeatMap;
  },
  
  pointsToLatLng(points) {
    return points.map(p => {
      return new google.maps.LatLng(p[0], p[1])
    });
  }
};
