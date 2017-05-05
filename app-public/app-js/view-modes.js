function ViewMode(baseElm, baseData, baseName, mainModel) {
  lces.types.component.call(this);
  
  this.setState("enabled", false);
  this.addStateListener("enabled", function(enabled) {
    if (enabled) {
      baseElm.classList.add("button-toggle-active");
      baseData.enable();
      
      // Set the gradient
      if (CodeIt.heatMap) {
        CodeIt.heatMap.set('gradient', baseData.grad);
        
        if (baseData.densityMap) {
          CodeIt.heatMap.setData(baseData.densityMap);
        } else {
          CodeIt.ajaj.dataType = baseName;
          CodeIt.ajaj.requestData(function(json) {
            var heatPoints = CodeIt.draw.pointsToLatLng(json.data);
            
            baseData.densityMap = heatPoints;
            CodeIt.heatMap.setData(heatPoints);
          });
        }
      }
    } else {
      baseElm.classList.remove("button-toggle-active");
      baseData.cleanUp();
    }
  });
  
  if (baseElm.classList.contains("button-toggle-active")) {
    this.enabled = true;
  }
  
  baseData.dom = baseElm;
  baseData.component = this;
  mainModel.addMember(this);
}

jSh.inherit(ViewMode, lces.types.component);

function ViewModeModel() {
  lces.types.group.call(this);
}

jSh.inherit(ViewModeModel, lces.types.group);

jSh.extendObj(CodeIt.modes, {
  water_storage: {
    dom: null,
    densityMap: null,
    machineName: null,
    grad: [
      "rgba(239, 0, 3, 0)",
      "rgba(239, 0, 3, 0)",
      "rgba(239, 0, 3, 1)",
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
    ],
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  },
  
  water_depth: {
    dom: null,
    densityMap: null,
    machineName: null,
    grad: [
      "rgba(16, 255, 0, 0)",
      "rgba(16, 255, 0, 0)",
      "rgba(16, 255, 0, 1)",
      "rgba(39, 229, 21, 1)",
      "rgba(63, 204, 43, 1)",
      "rgba(87, 178, 64, 1)",
      "rgba(111, 153, 86, 1)",
      "rgba(135, 127, 107, 1)",
      "rgba(159, 102, 129, 1)",
      "rgba(183, 76, 150, 1)",
      "rgba(207, 50, 172, 1)",
      "rgba(231, 25, 193, 1)",
      "rgba(255, 0, 215, 1)"
    ],
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  },
  
  water_productivity: {
    dom: null,
    densityMap: null,
    machineName: null,
    grad: [
      "rgba(255, 110, 0, 0)",
      "rgba(255, 110, 0, 0)",
      "rgba(255, 110, 0, 1)",
      "rgba(229, 124, 19, 1)",
      "rgba(204, 139, 38, 1)",
      "rgba(178, 153, 57, 1)",
      "rgba(153, 168, 76, 1)",
      "rgba(127, 182, 95, 1)",
      "rgba(102, 197, 114, 1)",
      "rgba(76, 211, 133, 1)",
      "rgba(50, 226, 152, 1)",
      "rgba(25, 240, 171, 1)",
      "rgba(0, 255, 190, 1)"
    ],
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  },
  
  water_thickness: {
    dom: null,
    densityMap: null,
    machineName: null,
    grad: [
      "rgba(0, 252, 35, 0)",
      "rgba(0, 252, 35, 0)",
      "rgba(0, 252, 35, 1)",
      "rgba(25, 226, 50, 1)",
      "rgba(50, 201, 66, 1)",
      "rgba(75, 176, 81, 1)",
      "rgba(100, 151, 97, 1)",
      "rgba(126, 126, 113, 1)",
      "rgba(151, 100, 128, 1)",
      "rgba(176, 75, 144, 1)",
      "rgba(201, 50, 159, 1)",
      "rgba(226, 25, 175, 1)",
      "rgba(252, 0, 191, 1)"
    ],
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  },
  
  climate_change: {
    dom: null,
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  },
  
  wetness_drought: {
    dom: null,
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  },
  
  waterlevel_overtime: {
    dom: null,
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  }
});

function NotifyModel(notifyElm) {
  lces.types.component.call(this);
  
  this.setState("visible", false);
  this.addStateListener("visible", function vcb(visible) {
    if (visible) {
      notifyElm.classList.add("ci-visible");
    } else {
      notifyElm.classList.removes("ci-visible");
    }
  });
  
}

CodeIt.notifyModel =

CodeIt.notify = function(error, msg) {
  
};
