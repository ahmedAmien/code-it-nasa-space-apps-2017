CodeIt.ajaj = {
  dataType: "water_storage",
  requestData(cb) {
    var req = new lcRequest({
      uri: "ajaj/" + CodeIt.ajaj.dataType + "/" + CodeIt.coords.lat + "/" + CodeIt.coords.long,
      success() {
        var json = jSh.parseJSON(this.responseText);
        
        if (!json.error) {
          if (!cb) {
            CodeIt.draw.newData(json);
          } else {
            cb(json);
          }
        }
      }
    });
    
    req.send();
  }
};
