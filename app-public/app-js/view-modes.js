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
  
  farmers: {
    dom: null,
    
    enable() {
      
    },
    
    cleanUp() {
      
    }
  }
});
