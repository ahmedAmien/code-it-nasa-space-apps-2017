function ViewMode(baseElm, baseData, mainModel) {
  lces.types.component.call(this);
  
  this.setState("enabled", false);
  this.addStateListener("enabled", function(enabled) {
    if (enabled) {
      baseElm.classList.add("button-toggle-active");
      baseData.enable();
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
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  },
  
  water_depth: {
    dom: null,
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  },
  
  water_productivity: {
    dom: null,
    
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
