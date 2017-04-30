CodeIt.ajaj = {
  dataType: "water_storage",
  requestData() {
    var req = new lcRequest({
      uri: "ajaj/" + CodeIt.ajaj.dataType + "/" + CodeIt.coords.lat + "/" + CodeIt.coords.long,
      success() {
        var json = jSh.parseJSON(this.responseText);
        
        if (!json.error) {
          // Do stuff here :O
        }
      }
    });
    
    req.send();
  }
};
