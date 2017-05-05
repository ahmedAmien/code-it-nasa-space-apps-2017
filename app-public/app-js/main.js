
function View(baseElm, mainModel) {
  // Base view constructor
  lces.types.component.call(this);
  
  this.setState("visible", false);
  this.addStateListener("visible", function(visible) {
    if (visible) {
      baseElm.classList.add("active-view");
    } else {
      baseElm.classList.remove("active-view");
    }
    
    // console.log(visible, baseElm);
  });
  
  // Check for defaults
  if (baseElm.classList.contains("active-view")) {
    this.visible = true;
    // console.log(true);
  }
  
  // Done, add to model
  mainModel.addMember(this);
  mainModel.views[baseElm.getAttribute("data-view")] = this;
}

jSh.inherit(View, lces.types.component);

function MainViewModel() {
  lces.types.group.call(this);
  
  this.views = {};
}

jSh.inherit(MainViewModel, lces.types.group);

// Setup views, etc
function main() {
  var mainModel = new MainViewModel();
  var views     = jSh(".view");
  
  views.forEach(viewElm => {
    new View(viewElm, mainModel);
  });
  
  // Fix, found a bug
  mainModel.setState("visible", false);
  mainModel.setExclusiveState("visible", true, 1);
  mainModel.views.main.visible = true;
  
  // Add main input event
  var customGo    = jSh("#go-custom-btn");
  var customField = jSh("#custom-loc");
  var gpsGo       = jSh("#go-gps-btn");
  
  customGo.on("click", function() {
    CodeIt.loadScenario(CodeIt.customLoc);
  });
  
  gpsGo.on("click", function() {
    // TODO: Get GPS coordinates
    var coords = {
      long: 0,
      lat: 0
    };
    
    function success(pos) {
      coords.lat  = pos.coords.latitude;
      coords.long = pos.coords.longitude;
      
      CodeIt.loadScenario(coords);
    }
    
    function error(err) {
      // TODO: Implement error mechanism
      gpsGo.classList.add("ci-disabled");
      throw new Error(err);
    }
    
    var options = {
      enableHighAccuracy: true,
      timeout: Infinity,
      maximumAge: 0
    };
    
    // Get coords
    navigator.geolocation.getCurrentPosition(success, error, options);
  });
  
  // Detect if Geolocation is supported
  if (navigator.geolocation) {
    gpsGo.classList.remove("ci-disabled");
  }
  
  customField.on("input", function() {
    var curVal = this.value.trim();
    CodeIt.customLoc = curVal;
    
    if (curVal && /[a-z\d]/.test(curVal)) {
      customGo.classList.remove("ci-disabled");
      CodeIt.customLocValid = true;
    } else {
      customGo.classList.add("ci-disabled");
      CodeIt.customLocValid = false;
    }
  });
  
  // customField.on("keyup", function(e) {
  //   if (e.keyCode === 13 && CodeIt.customLocValid) {
  //     CodeIt.loadScenario(CodeIt.customLoc);
  //   }
  // });
  
  // Add button events
  jSh("#go-custom-btn").on("click", function() {
    mainModel.views.map.visible = true;
  });
  
  jSh("#map-go-options").on("click", function() {
    mainModel.views.options.visible = true;
  });
  
  jSh("#map-go-back").on("click", function() {
    mainModel.views.main.visible = true;
  });
  
  jSh("#options-go-back").on("click", function() {
    mainModel.views.map.visible = true;
  });
  
  // Add view modes
  var modesMainModel = new ViewModeModel();
  var modes          = jSh(".options-form button");
  
  modes.forEach(modeBtn => {
    var modeName = modeBtn.getAttribute("data-btn-val");
    var modeData = CodeIt.modes[modeName];
    new ViewMode(modeBtn, modeData, modeName, modesMainModel);
    
    modeBtn.on("click", function() {
      modeData.component.enabled = true;
      
      // Go back to the maps
      setTimeout(function() {
        mainModel.views.map.visible = true;
      }, 450);
    });
  });
  
  modesMainModel.setState("enabled", false);
  modesMainModel.setExclusiveState("enabled", true, 1);
  CodeIt.modes.water_storage.component.enabled = true;
  
  // LoadScenario Implementation
  CodeIt.loadScenario = function(source) {
    var coords;
    
    console.log(coords);
    coords = source;
    
    mainModel.views.map.visible = true;
    // ...
    
    // Prepare map
    if (!CodeIt.map) {
      CodeIt.makeMap(coords);
    }
    
    // Request data from server
    CodeIt.coords = coords;
    CodeIt.ajaj.requestData();
  };
  
  CodeIt.makeMap = function(coords) {
    // Add Google Map
    var mainMap = jSh("#code-it-map-object");
    var map;
    var youMarker;
    var waterMarker;
    
    // API-Key: AIzaSyCzZ8TXc90TtE-3qJHAxNfqjRWMZFBsK80
    map = new google.maps.Map(mainMap, {
      center: {
        lat: coords.lat,
        lng: coords.long
      },
      zoom: 8,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      disableDefaultUI: true
    });
    
    youMarker = new google.maps.Marker({
      position: {
        lat: coords.lat,
        lng: coords.long
      },
      map: map,
      title: "You"
    });
    
    CodeIt.map = map;
    CodeIt.markers.youMarker = youMarker;
  };
  
  // Add Autocomplete
  var gautocomplete = new google.maps.places.Autocomplete(customField);
  
  gautocomplete.addListener("place_changed", function() {
    var place = gautocomplete.getPlace();
    
    if (place.geometry) {
      var placeGeo = place.geometry.location;
      var lat = placeGeo.lat();
      var lng = placeGeo.lng();
      
      CodeIt.loadScenario({
        long: lng,
        lat: lat
      });
    }
  });
}

window.addEventListener("load", main);
