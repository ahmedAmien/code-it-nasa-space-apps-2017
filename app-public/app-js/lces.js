function lces(id) {
  return LCES.components[id];
}

lces.rc = [];

// jShorts 2 Code
//
// Supposed to shorten my writing of vanilla JS, some quick shortcuts.

function getGlobal() {
  return this;
}

if (!getGlobal().lces)
  lces = {rc: [], onlyjSh: true, global: getGlobal()};
else
  lces.global = getGlobal();

lces.rc[0] = function() {
  lces.global = !lces.global ? window : lces.global;
  lces.global.undf = undefined;
  
  // Quick console prone errors mitigation
  if (!lces.global.console)
    Object.defineProperty(lces.global, "console", {
      value: {
        log: function() {},
        error: function() {},
        table: {}
      },
      writable: false,
      configurable: false,
      enumerable: true
    });

  // Main DOM Manipulation function
  lces.global.jSh = function jSh(src, first, test) {
    var parent, doc, result;
    
    if (typeof src === "string") {
      // "Locate" mode
      
      if (this === jShGlobal) {
        doc = true;
        parent = document;
      } else
        parent = this instanceof Node || jSh.MockupElement && this instanceof jSh.MockupElement || this instanceof HTMLDocument ? this : (lces.global.lcWidget && this instanceof lcWidget ? this.element : document);
      
      // Determine selector and return elements
      if (isID.test(src)) {
        if (doc) {
          result = document.getElementById(src.substr(1));
        } else {
          doc = jSh.MockupElement && parent instanceof jSh.MockupElement ? parent : (parent ? (parent.ownerDocument || parent) : document);
          result = doc.getElementById(src.substr(1));
        }
      } else if (isClass.test(src)) {
        result = jSh.toArr(parent.getElementsByClassName(src.substr(1)));
      } else if (isPH.test(src)) {
        src = src.substr(1).toLowerCase();
        
        result = jSh.oneOrArr(jSh.toArr(parent.getElementsByTagName("lces-placeholder")).filter(function(i) {return i.phName && i.phName.toLowerCase() === src;}));
      } else if (isTag.test(src)) {
        result = jSh.toArr(parent.getElementsByTagName(src));
      } else { // Must be rocket science queries, back to queryselectAll...
        if (first) {
          result = parent.querySelector(src);
        } else {
          result = jSh.toArr(parent.querySelectorAll(src));
        }
      }
      
      // Shorten them
      if (result) {
        var shortenedResult;
        
        if (result instanceof Array)
          shortenedResult = result;
        else
          shortenedResult = [result];
        
        for (var i=shortenedResult.length-1; i>=0; i--) {
          var elm = shortenedResult[i];
          
          if (!elm.jSh) {
            elm.getParent = getParent;
            elm.getChild  = getChild;
            elm.css       = setCSS;
            elm.on        = onEvent;
            elm.jSh       = jSh;
            
            // Improve append and removechild methods
            elm.__apch = elm.appendChild;
            elm.__rmch = elm.removeChild;
            
            elm.appendChild = jSh.elementExt.appendChild;
            elm.removeChild = jSh.elementExt.removeChild;
          }
        }
      }
      
      return result;
    } else if (typeof src === "number") {
      result = getChild.call(this, src);
      
      if (result && !result.jSh) {
        result.getParent = getParent;
        result.getChild  = getChild;
        result.css       = setCSS;
        result.on        = onEvent;
        result.jSh       = jSh;
    
        // Improve append and removechild methods
        result.__apch = result.appendChild;
        result.__rmch = result.removeChild;
    
        result.appendChild = elementExt.appendChild;
        result.removeChild = elementExt.removeChild;
      }
      
      return result;
    } else {
      // "Shorten" mode
      // In this mode «first» is referring to whether to enclose it in an lcWidget
      
      var e = jSh.determineType(src, true);
      
      if (!e)
        return src;
      
      if (first)
        new lcWidget(e);
      
      if (!e.jSh)
        jSh.shorten(e);
      
      return e;
    }
  }
  
  // Global
  var jShGlobal = jSh.global = lces.global;
  
  // JS functions
  
  // Check something's type when typeof isn't reliable
  jSh.type = function(obj) {
    return Object.prototype.toString.call(obj).match(/\[object\s([\w\d]+)\]/)[1].toLowerCase();
  }
  
  jSh.pushItems = function(array) {
    var items = jSh.toArr(arguments).slice(1);
    
    for (var i=0,l=items.length; i<l; i++) {
      array.push(items[i]);
    }
  }
  
  // Remove multiple items from an array
  jSh.spliceItem = function(array) {
    var items = jSh.toArr(arguments).slice(1);
    
    for (var i=0,l=items.length; i<l; i++) {
      var index = array.indexOf(items[i]);
      
      if (index !== -1)
        array.splice(index, 1);
    }
  }

  // Convert array-like object to an array
  jSh.toArr = function(arr) {
    return Array.prototype.slice.call(arr);
  }

  // Returns first item if array length is 1, otherwise the whole array
  jSh.oneOrArr = function(arr) {
    return arr.length === 1 ? arr[0] : arr;
  }

  // Check for multiple arguments or an array as the first argument for functions of single arity
  jSh.hasMultipleArgs = function(args, that) {
    var iterate = false;
    that = that || this;
    
    if (args.length > 1)
      iterate = jSh.toArr(args);
    if (jSh.type(args[0]) === "array")
      iterate = args[0];
    
    return iterate ? (iterate.forEach(function(i) {
      args.callee.call(that, i);
    }) ? true : true) : false;
  }

  // Extend the first object with the own properties of another, exclude is an array that contains properties to be excluded
  jSh.extendObj = function(obj, extension, exclude) {
    var objNames = Object.getOwnPropertyNames(extension);
    
    for (var i=objNames.length-1; i>-1; i--) {
      var name = objNames[i];
      
      if (!exclude || exclude.indexOf(name) === -1)
        obj[name] = extension[name];
    }
    
    return obj;
  }
  
  // Similar to extendObj, but will go into deeper objects if they exist and merging the differences
  jSh.mergeObj = function(obj, extension, dontReplaceObjects, dontReplaceValues, dontReplaceArrays) {
    function merge(curObj, curExt) {
      Object.getOwnPropertyNames(curExt).forEach(function(i) {
        var curProp    = curObj[i];
        var curExtProp = curExt[i];
        
        if (jSh.type(curProp) === "object" && jSh.type(curExtProp) === "object")
          merge(curProp, curExtProp);
        else if (dontReplaceArrays && jSh.type(curProp) === "array" && jSh.type(curExtProp) === "array")
          curProp.push.apply(curExtProp);
        else if (dontReplaceValues && curProp === undefined)
          curObj[i] = curExtProp;
        else if (!dontReplaceObjects || jSh.type(curProp) !== "object" && (!dontReplaceValues || curProp === undefined))
          curObj[i] = curExtProp;
      });
    }
    
    merge(obj, extension);
    return obj;
  }
  
  jSh.constProp = function(obj, propName, propValue) {
    Object.defineProperty(obj, propName, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: propValue
    });
  }
  
  // Make a function inherit another in the prototype chain
  jSh.inherit = function(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
  }

  // Return string s multiplied 'n' integer times
  jSh.nChars = function(s, n) {
    s = s + "";
    n = isNaN(n) ? 1 : parseInt(n);
    
    var str = "";
    
    for (var i=0; i<n; i++) {
      str += s;
    }
    
    return str;
  }
  
  jSh.strCapitalize = function(str) {
    str = str + "";
    
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }
  
  // Options determining utils
  jSh.boolOp = function(src, def) {
    return src !== undefined ? !!src : def;
  }

  jSh.numOp = function(src, def) {
    return !isNaN(src) && typeof src === "number" && src > -Infinity && src < Infinity ? parseFloat(src) : def;
  }

  jSh.strOp = function(src, def) {
    return typeof src === "string" && src ? src : def;
  }
  
  // To silently mitigate any JSON parse error exceptions to prevent the whole from self destructing
  jSh.parseJSON = function(jsonstr) {
    var result;
    
    try {
      result = JSON.parse(jsonstr);
    } catch (e) {
      console.warn(e);
      
      result = {error: "JSON parse failed", data: null};
    }
    
    return result;
  }
  
  jSh.filterHTML = function(s) {
    s = s.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    return s;
  }
  
  // DOM Creation Functions

  // Create HTML DOM Div elements with a flexible nesting system
  jSh.d = function node(className, text, child, attributes, properties, events) { // For creating an element
    var nsElm, elmClassName, isMockup, dynClass; // For things like SVG... Ugggh. :|
    
    if (!this.lcesElement) {
      // Check if we need to make an element with a custom namespace URI
      if (this.lcesType) {
        var nsCheck = /^ns:[\w\d_]+:[^]+$/i.test(this.lcesType);
        
        if (!nsCheck)
          var n = jSh.e(this.lcesType);       // Create main element, if this isn't window, set to specified element.
        else {
          // var nsURI = this.lcesType.replace(/^ns:[\w\d_]+:([^]+)$/i, "$1"); TODO: Check this
          var nsElm = this.lcesType.replace(/^ns:([\w\d_]+):[^]+$/i, "$1");
          
          var n = jSh.e(this.lcesType);
        }
      } else {
        var n = jSh.e("div");
      }
    } else {
      // Element is already provided
      var n = this.lcesElement;
      
      if (n.isjShMockup)
        isMockup = true;
    }
    
    // Check if the args provided are all enclosed in an object
    if (className instanceof Object) {
      var args = className;

      elmClassName = args.className || args.class || args.sel;
      text         = args.text;
      child        = args.child || args.children;
      attributes   = args.attributes || args.attr;
      properties   = args.properties || args.prop || args.props;
      events       = args.events;
      
      if (isMockup)
        dynClass = args.dynClass;
    } else {
      elmClassName = className;
      
      if (isMockup && attributes)
        dynClass = attributes.dynClass;
    }
    
    // Check for an arguments availability and apply it if detected
    
    // Check for special assignments in classname argument
    var id       = "";
    var newClass = "";
    
    if (elmClassName) {
      var validFormat = /^(?:#[a-zA-Z\d\-_]+)?(?:\.[a-zA-Z\d\-_]+)+$|^#[a-zA-Z\d\-_]+(?:\.[a-zA-Z\d\-_]+)*$/;
      var hasClass    = /\.[a-zA-Z\d\-_]+/g;
      var hasId       = /#([a-zA-Z\d\-_]+)/;
      
      if (validFormat.test(elmClassName)) {
        newClass = jSh.toArr(elmClassName.match(hasClass) || []);
        id       = elmClassName.match(hasId);
        
        if (newClass.length > 0) {
          for (var i=newClass.length-1; i>-1; i--) {
            newClass[i] = newClass[i].substr(1);
          }
          
          // Workaround for things like SVG that don't have a simple .className property
          if (!nsElm)
            n.className = newClass.join(" ");
          else
            attributes["class"] = newClass.join(" ");
        }
      } else {
        if (!nsElm)
          n.className = elmClassName;
        else
          attributes["class"] = elmClassName;
      }
    }
    
    if (id)
      n.id = id[1];
    
    if (text) {
      n[text.t ? "innerHTML" : "textContent"] = (text.s ? text.s : text);
      n[text.t ? "_innerHTML" : "_textContent"] = (text.s ? text.s : text);
    }
    
    if (child) {
      if (child instanceof Array) {
        var frag = this.lcesElement || jSh.docFrag();
        
        for (var i=0,l=child.length; i<l; i++) {
          frag.appendChild(child[i]);
        }
        
        // Append if not LCES template element
        if (!this.lcesElement)
          n.appendChild(frag);
      } else
        n.appendChild(child);
    }
    
    var checkNSAttr = /^ns:[^:]+:[^]*$/i;
    
    if (attributes) {
      var attrs = Object.getOwnPropertyNames(attributes);
      
      for (var i=attrs.length-1; i>-1; i--) {
        var attr = attrs[i];
        
        if (!checkNSAttr.test(attr) || jSh.MockupElement && n instanceof jSh.MockupElement)
          n.setAttribute(attr, attributes[attr]);
        else {
          var nsURI = attr.replace(/^ns:[^:]+:([^]*)$/i, "$1");
          var nsAttr = attr.replace(/^ns:([^:]+):[^]*$/i, "$1");
          
          n.setAttributeNS(nsURI ? nsURI : null, nsAttr, attributes[attr]);
        }
      }
    }

    if (properties) {
      var props = Object.getOwnPropertyNames(properties);
      
      for (var i=props.length-1; i>-1; i--) {
        var prop = props[i];
        n[prop] = properties[prop];
      }
    }
    
    if (events) {
      var evts = Object.getOwnPropertyNames(events);
      
      for (var i=evts.length-1; i>-1; i--) {
        var evName = evts[i];
        var evObj  = events[evName];
        
        if (evObj instanceof Array) {
          for (var j=evObj.length-1; j>-1; j--) {
            n.addEventListener(evName, evObj[j]);
          }
        } else {
          n.addEventListener(evName, evObj);
        }
      }
    }
    
    if (isMockup && dynClass instanceof Object)
      n.dynClass = dynClass;
    
    return jSh.shorten(n);
  };

  // Create a 'type' DOM element with flexible nesting system
  jSh.c = function nodeC(type, className, text, child, attributes, properties) { // Custom node
    return jSh.d.call({lcesType: type}, className, text, child, attributes, properties);
  }

  // Create raw DOM element with no special features
  jSh.e = function(tag) {
    var nsCheck = tag.match(/^ns:([\w\d_]+):([^]+)$/i);
    if (!nsCheck) {
      return document.createElement(tag);
    } else {
      var nsElm = nsCheck[1];
      var nsURI = nsCheck[2];
      
      var n = document.createElementNS(nsURI, nsElm);
      n.nsElm = true;
      
      return n;
    }
  }

  // Create an HTML DOM text node
  jSh.t = function(t) {
    return document.createTextNode(t);
  }

  // Create SVG with path nesting feature
  jSh.svg = function(classname, width, height, paths) {
    return jSh.c("ns:svg:http://www.w3.org/2000/svg", classname, undefined, paths, { // Attributes
      "version": "1.1",
      "width": width,
      "height": height
    });
  }

  // Create SVG path
  jSh.path = function(classname, points, style) {
    return jSh.c("ns:path:http://www.w3.org/2000/svg", classname, undefined, undefined, {
      "ns:d:": points,
      "ns:style:": style || ""
    });
  }
  
  // Check if in browser environment
  if (lces.global.document)
    jSh.docFrag = document.createDocumentFragment.bind(document);
  
  // DOM Manipulation Functions

  var getChild = jSh.getChild = function(off, length) {
    var parent = length instanceof Object ? length : this;
    var children = jSh.toArr(parent.childNodes);
    var check = [];
    var ELM_NODE = Node.ELEMENT_NODE;
    
    for (var i=children.length-1; i>-1; i--) {
      var child = children[i];
      
      if (child.nodeType === ELM_NODE) {
        check.push(child);
        
        if (!child.jSh)
          jSh.shorten(child);
      }
    }
    
    check = check.reverse();
    if (off < 0)
      off = check.length + off;
    
    if (!check[off])
      return null;
    
    if (typeof length === "number" && length > 1)
      return check.slice(off, off + length);
    else
      return check[off];
  }
  
  var getParent = jSh.getParent = function(jump) {
    if (jSh.type(jump) !== "number" || jump < 0)
      return null;
    
    var par = this;
    while (jump > 0 && par !== document.body) {
      par = par.parentNode;
      
      jump--;
    }
    
    return par;
  }
  
  // Assert whether node 'e' is a child of node 'p'
  jSh.isDescendant = function(e, p) {
    var parent = e.parentNode;
    var assert = false;
    
    while (parent != document.body) {
      if (parent == p) {
        assert = true;
        break;
      }
      
      parent = parent.parentNode;
    }
    
    return assert;
  }

  var onEvent = jSh.onEvent = function(e, func, bubble) {
    this.addEventListener(e, func, bubble);
  }

  // Selector functions

  jSh.shorten = function(e) {
    var hasMultipleArgs = jSh.hasMultipleArgs(arguments);
    if (hasMultipleArgs)
      return arguments.length === 1 ? e : jSh.toArr(arguments);
    
    // Check if should shorten
    if (e && !e.getChild) {
      e.getParent = jSh.getParent;
      e.getChild  = jSh.getChild;
      e.on        = jSh.onEvent;
      e.css       = jSh.setCSS;
      e.jSh       = jSh;
      
      // Improve append and removechild methods
      e.__apch = e.appendChild;
      e.__rmch = e.removeChild;
      
      e.appendChild = jSh.elementExt.appendChild;
      e.removeChild = jSh.elementExt.removeChild;
    }
    
    return e;
  }
  
  var setCSS = jSh.setCSS = function(css) {
    if (!css || jSh.type(css) !== "object")
      return this;
    
    var props = Object.getOwnPropertyNames(css);
    var style = this.style;
    
    for (var i=props.length-1; i>-1; i--) {
      var propName = props[i];
      style[propName] = css[propName];
    }
    
    return this;
  }
  
  var elementExt = jSh.elementExt = {
    appendChild: function() {
      var children = jSh.toArr(arguments);
      
      if (children[0] instanceof Array)
        children = children[0];
      
      for (var i=0,l=children.length; i<l; i++) {
        this.__apch(children[i]);
      }
    },
    
    removeChild: function() {
      var children = jSh.toArr(arguments);
      
      if (children[0] instanceof Array)
        children = children[0];
      
      if (typeof this.__rmch !== "function")
        console.log({x: this}, this.__rmch, this.__apch);
      
      for (var i=children.length-1; i>-1; i--) {
        this.__rmch(children[i]);
      }
      
      if (children.length === 1)
        return children[0];
      else
        return children;
    }
  }
  
  // Determine selector in the string
  jSh.isID    = /^#[\w\-]+$/;
  jSh.isClass = /^\.[a-zA-Z\d\-_]+$/;
  jSh.isTag   = /^[a-zA-Z\d\-]+$/;
  jSh.isPH    = /^~[a-zA-Z\d\-_]+$/; // LCES Templating, placeholder element
  
  var isID    = jSh.isID;
  var isClass = jSh.isClass;
  var isTag   = jSh.isTag;
  var isPH    = jSh.isPH;

  // For distinguishing between lcWidget and a Node instance
  jSh.determineType = function(obj, jShDetermine) {
    if (!obj)
      return false;
    
    if (obj instanceof Node || obj instanceof HTMLDocument && jShDetermine)
      return obj;
    
    // MockupElement
    if (jSh.MockupElement && obj instanceof jSh.MockupElement)
      return obj;
    
    if (lces.global.lcWidget && obj instanceof lcWidget && obj.element instanceof Node)
      return obj.element;
    
    return null
  }


  // A quick typo-fill :D
  var jSH = jSh;
};

if (lces.onlyjSh)
  lces.rc[0]();

// Check if NPM module
if (lces.global.global && !lces.global.window)
  module.exports = jSh;


// LCES Core code, depends on jShorts2.js

lces.rc[2] = function() {
  // LCES JS code (Acronym Galore! :D)
  // On another note, these *LV* things might be useless...
  
  // lces stats
  lces.LCES = {
    objectCount: 0
  };
  
  lces.global.LCESVar = function(n) {
    this.LCESVAR = true; // Might be needed in the future.
    this.id = n;
  }
  lces.global.LV = function(n) {
    return new LCESVar(n);
  }
  lces.global.isLV = function(v) {
    return v instanceof LCESVar;
  }

  lces.global.LCES = {
    // Core things go here
    EXTENDED_COMPONENT: LV(5), // I'll start from 5 because 0 or 1 can mean anything...
    BASE_COMPONENT: LV(6),

    components: [],

    // Now the functions
    isExtended: function(args) {
      return isLV(args[args.length - 1]) && args[args.length - 1] === LCES.EXTENDED_COMPONENT;
    }

  }

  // ESSENTIAL COMPONENT METHODS
  
  // For faster reference
  var Object = lces.global.Object || window.Object;
  
  // AUCP LCES Constructors
  lces.global.lcComponent = lcComponent;
  
  function lcComponent() {
    // This should be the fundamental building block
    // of the AUCP component linked event system. I can't
    // come up with something better to call it so just
    // AUCP Linked Component Event System I guess.
    // I like thinking up weird names, LCES is pronounced "Elsis" btw...

    if (this.__LCESCOMPONENT__)
      return true;

    // Use this to distinguish between instanced LCES components
    this.LCESID = ++lces.LCES.objectCount;
    var that = this;
    
    // If noReference is on then it just appends null
    if (!lces.noReference)
      LCES.components.push(this);
      
    this.states = {};
    this.extensionData = []; // Data for extensions
    this._noAutoState = {}; // To prevent auto state converting LCES utility from converting normal properties to states
    
    // Check if needs to add methods manually
    if (!(this instanceof lcComponent)) {
      jSh.extendObj(this, lcComponent.prototype);
      console.log("LCES ISN'T INSTACED WTF", this);
    }

    // Add our LCESName for easy access via global lces() function
    this.setState("LCESName", "");
    this.addStateListener("LCESName", function(LCESName) {
      if (LCESName)
        LCES.components[LCESName] = that;
    });
    this.addStateCondition("LCESName", function(LCESName) {
      var curValue = this.get();
      
      if (curValue) {
        if (curValue === LCESName)
          return false;
        
        LCES.components[curValue] = undefined;
      }

      return true;
    });

    // Now setup some important things beforehand...

    this.setState("statechange", "statechange");
    this.setState("newstate", "newstate");
    
    // Statechange state specifics
    this.states["statechange"].states = {};

    this._setState = this.setState;
    this.setState  = lcComponentSetState;
    
    this.groups = [];
    
    // Add the event array
    this.events = [];
    
    jSh.constProp(this, "__LCESCOMPONENT__", 1);
    return false; // Not being extended or anything, a new component.
  }
  
  jSh.extendObj(lcComponent.prototype, {
    __lcComponent__: 1,
    type: "LCES Component",
    isLCESComponent: true
  });
  
  lcComponent.prototype.constructor = lcComponent;
  
  // lcComponent custom setState method
  function lcComponentSetState(state, stateStatus, recurring) {
    var states    = this.states;
    var _setState = this._setState.bind(this);
    var stateObj  = states[state];
    
    var statechange = states.statechange;
    
    if (!recurring && stateObj && stateObj.stateStatus === stateStatus) {
      _setState(state, stateStatus, recurring, true);
      return false;
    }
      
    var newstate = false;
    if (!stateObj)
      newstate = true;

    if (!stateObj || !stateObj.flippedStateCall) {
      _setState(state, stateStatus, recurring);
      
      stateObj = states[state];
      
      if (stateObj.oldStateStatus !== stateObj.stateStatus) {
        if (!statechange.states[state])
          statechange.states[state] = {};
        
        statechange.states[state].recurring = recurring;
        
        _setState("statechange", state, true);
      }
    } else {
      if (stateObj.oldStateStatus !== stateObj.stateStatus) {
        if (!statechange.states[state])
          statechange.states[state] = {};
        
        statechange.states[state].recurring = recurring;
        
        _setState("statechange", state, true);
      }
      
      _setState(state, stateStatus, recurring);
    }

    if (newstate)
      _setState("newstate", state, true);
  }
  
  jSh.extendObj(lcComponent.prototype, {
    setState: function(state, stateStatus, recurring, recurred) {
      var stateObject = this.states[state];
      
      if (!stateObject) {
        // Since we don't have it, we'll make it.
        
        stateObject = {
          component: this,
          name: state,
          set: function(stateStatus) {this.component.setState(state, stateStatus);},
          get: function() {return this.stateStatus;},
          stateStatus: stateStatus,
          oldStateStatus: {nullStuff: null}, // Just to ensure that it doesn't match.
          functions: [],
          conditions: [],
          getter: null,
          data: {},
          private: false, // If true then data links (lcGroup) can't change it.
          flippedStateCall: false,
          profile: null,
          linkedStates: {} // {state: "state", func: func}
        };
        
        this.states[state] = stateObject;
        var that = this;

        Object.defineProperty(this, state, {configurable: true, set: function(stateStatus) { that.setState(state, stateStatus); }, get: function() { return that.getState(state); }});
      }
      
      // Check for profiling flag
      var canProfile = stateObject.profile;
      if (canProfile) {
        console.time(canProfile);
      }
      
      var stateCond   = stateObject.conditions;
      var canContinue = true;
      
      // Propose value during condition check
      stateObject.proposedValue = stateStatus;
      
      for (var i=0,l=stateCond.length; i<l; i++) {
        var condFunc = stateCond[i];
        
        if (condFunc)
          canContinue = condFunc.call(stateObject, stateStatus, recurred);
        
        if (!canContinue)
          return false;
      }
      
      // Set from proposedValue
      stateStatus = stateObject.proposedValue;
      
      if (stateObject.stateStatus === stateStatus && !recurring) {
        if (canProfile) {
          console.timeEnd(canProfile);
        }
        
        return false;
      }
      
      // If we're here then everything seems to be okay and we can move on.
      // Set the state.
      stateObject.oldStateStatus = stateObject.stateStatus;
      stateObject.stateStatus = stateStatus;
      
      var stateObjectFuncs = stateObject.functions;
      
      // Now call listeners...
      for (var j=0,l2=stateObjectFuncs.length; j<l2; j++) {
        var func = stateObjectFuncs[j];
        
        if (func)
          func.call(stateObject, stateStatus, recurring);
      }
      
      // Check for profiling flag
      if (canProfile) {
        console.timeEnd(canProfile);
      }
      
      return true;
    },

    getState: function(state) {
      if (!this.states[state])
        return false;

      return typeof this.states[state].get === "function" ? this.states[state].get.call(this.states[state]) : this.states[state].stateStatus;
    },

    hasState: function(state, throwError) {
      if (!this.states[state] && throwError)
        throw ReferenceError("No such state");

      return !!this.states[state];
    },

    addStateListener: function(state, stateFunc) {
      var stateObject = this.states[state];
      
      if (!stateObject) {
        this.setState(state, undefined);
        // console.warn(state + " doesn't exist"); // NOTICE: Removed for redundancy
        
        stateObject = this.states[state];
      }
      
      stateObject.functions.push(stateFunc);
    },

    addStateCondition: function(state, conditionFunc) {
      if (this.states[state]) {
        this.states[state].conditions.push(conditionFunc);
      } else
        throw ReferenceError("No such state");
    },

    addGroupLink: function(group) {
      group.addMember(this);
    },

    removeGroupLink: function(group) {
      if (group)
        group.removeMember(this);
    },
    
    removeAllGroupLinks: function() {
      var groups = this.groups;
      
      for (var i=0,l=groups.length; i<l; i++) {
        var group = groups[i];
        
        if (group)
          group.removeMember(this);
      }
    },

    removeStateListener: function(state, listener) {
      if (!this.states[state])
        throw ReferenceError("No such state");

      var stateObject = this.states[state];
      var index = stateObject.functions.indexOf(listener);
      
      if (index !== -1) {
        stateObject.functions.splice(index, 1);
        
        return true;
      }

      return false; // We failed it seems :/
    },

    removeAllStateListeners: function(state) {
      if (!this.states[state])
        throw ReferenceError("No such state");
      
      var functions = this.states[state].functions;
      var listenersLength = functions.length;
      
      for (var i=0; i<listenersLength; i++) {
        functions.splice(i, 1);
      }
      
      return true;
    },

    removeAllStateConditions: function(state) {
      if (!this.states[state])
        throw ReferenceError("No such state");

      this.states[state].conditions = [];
      return true;
    },

    removeState: function(state) {
      if (jSh.hasMultipleArgs(arguments, this))
        return;
      
      var stateObj = this.states[state];
      
      if (!stateObj)
        throw ReferenceError("No such state");
      
      var linkedStates = Object.getOwnPropertyNames(stateObj.linkedStates);
      var unlinkStates = this.unlinkStates.bind(this);
      
      for (var i=0,l=linkedStates.length; i<l; i++) {
        if (this.states[linkedStates[i]])
          unlinkStates(state, linkedStates[i]);
      }
      
      stateObj.component = undefined;
      
      this.states[state] = undefined; // NOTICE: Used delete keyword FIX
      delete this[state];        // TODO: FIX THIS
    },
    
    removeAllStates: function() {
      var states = Object.getOwnPropertyNames(this.states);
      
      for (var i=0,l=states.length; i<l; i++) {
        this.removeState(states[i]);
      }
      
      return true;
    },
    
    linkStates: function(state1, state2, callback) {
      var that = this;
      if (!this.states[state1])
        this.setState(state1, "");
      
      if (!this.states[state2])
        this.setState(state2, "");
      
      // First check if they're already linked.
      if (this.states[state1].linkedStates[state2] || this.states[state2].linkedStates[state1])
        this.unlinkStates(state1, state2);
      
      function listener(state) {
        var callback = listener.callback;
        var state1   = listener.state1;
        var state2   = listener.state2;
        
        var state1Value = that.getState(state1);
        var state2Value = that.getState(state2);
        
        if (!callback && state1Value === state2Value)
          return true;
        
        // Now to set the state in question
        if (state === state2)
          that.setState(state1, callback ? callback(state2Value) : state2Value);
        else if (state === state1 && !callback)
          that.setState(state2, state1Value);
      };
      
      listener.callback = callback;
      listener.state1   = state1;
      listener.state2   = state2;

      this.states[state1].linkedStates[state2] = listener;
      this.states[state2].linkedStates[state1] = listener;

      this.setState(state2, this.getState(state1));
      this.addStateListener("statechange", listener);
    },

    unlinkStates: function(state1, state2) {
      var stateObj1 = this.states[state1];
      var stateObj2 = this.states[state2];
      
      if (!stateObj1 || !stateObj2)
        throw ReferenceError("No such state");

      if (!stateObj1.linkedStates[state2])
        throw TypeError("[" + state1 + "] isn't linked to [" + state2 + "]");


      this.removeStateListener("statechange", stateObj1.linkedStates[state2]);
      
      stateObj1.linkedStates[state2] = undefined;
      stateObj2.linkedStates[state1] = undefined;

      return true;
    },

    hardLinkStates: function(state1, state2) { // State1 will be considered nonexistant.. And if it exists it'll be deleted.
      if (!this.states[state2])
        throw ReferenceError("No such state");
      
      if (this.states[state1])
        removeState(state1);
      
      var that = this;
      
      this.states[state1] = this.states[state2];
      Object.defineProperty(this, state1, {configurable: true, set: function(stateStatus) { that.setState(state1, stateStatus); }, get: function() { return that.getState(state1); } });
    },
    
    copyState: function(state1, state2) {
      if (!this.states[state1])
        throw ReferenceError("No such state");
      if (this.states[state2])
        this.removeState(state2);
      
      this.setState(state2, null);
      
      // NOTICE: Object.create(o) isn't supported in IE8!!! But ofc, Idc.
      
      var newStateObj = Object.create(this.states[state1]);
      this.states[state2] = newStateObj;
    },
    
    extend: function(component) { // TODO: Check this, it might be useless
      var args = [];
      for (var i=1,l=arguments.length; i<l; i++) {
        args.push(arguments[i]);
      }
      
      var data = {
        component: this
      };
      this.extensionData.push(data);
      
      component.apply(this, args.concat([data, LCES.EXTENDED_COMPONENT]));
    },
    
    dataSetState: function(state, stateStatus, recurring) {
      this._setState(state, stateStatus, recurring);
    },
    
    profileState: function(state, profileName) {
      var stateObj = this.states[state];
      
      if (!stateObj) {
        throw new ReferenceError("LCESComponent.protoype.profileState: state `" + state + "` doesn't exist");
      }
      
      if (typeof profileName !== "string" || !profileName) {
        throw new TypeError("LCESComponent.protoype.profileState: profileName needs to be a populated string");
      }
      
      stateObj.profile = profileName;
    },
    
    // Event system
    addEvent: function(event) {
      if (!event || jSh.type(event) !== "string" || this.events[event])
        return false; // TODO: Fix this, it repeats too much... DRY!!!!!!!!!
      
      this.events[event] = {
        name: event,
        listeners: []
      };
    },
    
    removeEvent: function(event) {
      if (!event || jSh.type(event) !== "string" || !this.events[event])
        return false;
      
      this.events[event] = undefined;
    },
    
    removeAllEvents: function() {
      var events = this.events;
      
      for (var i=0,l=events.length; i<l; i++) {
        events[i] = undefined;
      }
    },
    
    triggerEvent: function(event, evtObj) {
      if (!event || jSh.type(event) !== "string" || !this.events[event])
        return false;
      
      if (!evtObj || jSh.type(evtObj) !== "object")
        throw Error(event + " cannot be triggered without an EventObject");
      
      this.events[event].listeners.forEach(function(func) {
        try {
          func(evtObj);
        } catch (e) {
          console.error(e);
        }
      });
    },
    
    on: function(event, listener) {
      // Check the listener
      if (typeof listener !== "function")
        return false;
      
      // Check for the event
      if (!this.events[event])
        this.addEvent(event);
      
      var evtObj = this.events[event];
      
      evtObj.listeners.push(listener);
    },
    
    removeListener: function(event, listener) {
      var evtObj = this.events[event];
      
      if (!event || jSh.type(event) !== "string" || !evtObj)
        return false;
      
      var index = evtObj.listeners.indexOf(listener);
      
      if (index !== -1)
        evtObj.listeners.splice(index, 1);
    }
  });
  
  function lcGroup() {
    var extended = lcComponent.call(this);
    if (!extended)
      this.type = "LCES Group";
    
    var that = this;
    var members  = [];
    this.members = members;
    this.lastTrigger = {}; // lastTrigger[state] = LastTriggeringMember
    
    var thatStates = that.states;
    
    // Check if not instaced
    if (!(this instanceof lcGroup)) {
      jSh.extendObj(this, lcGroup.prototype);
      console.log("LCES LCGROUP PHONY BASTARD - ", this);
    }
    // Update members after a trigger
    var updatingGroupState = false;
    
    function updateMembers(state, value, recurring) {
      var that = updateMembers.that;
      var members = updateMembers.members;
      
      for (var i=0,l=members.length; i<l; i++) {
        var member = members[i];
        
        if (member.states[state] && !member.states[state].private && member.states[state].stateStatus !== value || recurring) {
          if (!that.exclusiveMembers[state]) {
            member._setState(state, value, recurring);
            member._setState("statechange", state, true);
          } else if (that.exclusiveMembers[state]) {
            member._setState(state, that.isExclusiveMember(state, member) ? !that.getState(state) : that.getState(state));
            member._setState("statechange", state, true);
          }
        }
      }
    }
    
    updateMembers.that    = that;
    updateMembers.members = members;
    
    this.recurring = true;
    this.recurringMemberTrigger = true;
    this.memberMethod = function mmethod(state) {
      var that = mmethod.that;
      var component = this.component;
      
      if (that.states[state] && state !== "LCESName" && !that.states[state].private) {
        // Now to tell everyone else the news...

        that.lastTrigger[state] = component;
        
        if (that.states[state].isExclusive) {
          that.setState(state, that.getState(state), that.recurringMemberTrigger);
        } else {
          updateMembers(state, component.states[state].stateStatus);
          
          updatingGroupState = true;
          that.setState(state, component.states[state].stateStatus);
          updatingGroupState = false;
        }
      }
    }
    
    this.memberMethod.that = that;
    
    this.setState("newmember", null);

    this.addStateListener("statechange", function(state) {
      if (updatingGroupState) {
        updatingGroupState = false;
        
        return;
      }
      
      if (state !== "LCESName")
        updateMembers(state, that.states[state].stateStatus, this.states[state].recurring);
    });
    
    this.addStateListener("newstate", function(state) {
      that.states[state].isExclusive = false;
      that.states[state].exclusiveFunctions = [];
    });

    this.onExclusiveStateChange = function() {
      var that2 = this;
      
      var exclusiveMembers = that.exclusiveMembers[this.name];
      
      if (exclusiveMembers.indexOf(that.lastTrigger[this.name]) === -1) {
        if (exclusiveMembers.length === exclusiveMembers.memberLimit) {
          exclusiveMembers[exclusiveMembers.length - 1]._setState(this.name, this.get());
          exclusiveMembers.splice(exclusiveMembers.length - 1, 1);
        }

        exclusiveMembers.splice(0, 0, that.lastTrigger[this.name]);
      }
      
      // Call the functions if any.
      this.exclusiveFunctions.forEach(function(i) {
        i.call(that2, that.lastTrigger[that2.name]);
      });
    }

    this.setExclusiveState = function(state, exclusiveState, memberLimit) {
      this.states[state].isExclusive = true;

      this.exclusiveMembers[state] = [];
      this.exclusiveMembers[state].memberLimit = memberLimit;

      this.setState(state, !exclusiveState);
      this.addStateListener(state, this.onExclusiveStateChange);
    }

    this.exclusiveMembers = {};

    this.isExclusiveMember = function(state, member) {
      if (!this.hasState(state, true) || !this.exclusiveMembers[state])
        return false;

      return this.exclusiveMembers[state].indexOf(member) !== -1;
    }
  }
  
  jSh.inherit(lcGroup, lcComponent);
  
  jSh.extendObj(lcGroup.prototype, {
    addMember: function(component) {
      var that = this;
      var args = arguments;
      
      if (jSh.type(component) == "array")
        return component.forEach(function(i) {args.callee.call(that, i);});

      if (jSh.toArr(arguments).length > 1)
        return jSh.toArr(arguments).forEach(function(i) {args.callee.call(that, i);});


      this.members.push(component);
      component.groups.push(this);
      component.addStateListener("statechange", this.memberMethod);
      
      this.setState("newmember", component, true); // I might not need that dangerous recurring, we'll see.
    },

    removeMember: function(component) {
      component.groups.splice(component.groups.indexOf(this), 1);
      this.members.splice(this.members.indexOf(component), 1);
      
      component.removeStateListener("statechange", this.memberMethod);
    },
    
    
    addExclusiveListener: function(state, listener) {
      if (!this.states[state])
        throw ReferenceError("No such state");
      if (jSh.type(listener) !== "function")
        throw TypeError("Listener " + listener + " is not of type 'function'");
      
      this.states[state].exclusiveFunctions.push(listener);
    },
    
    removeExclusiveListener: function(state, listener) {
      if (!this.states[state])
        throw ReferenceError("No such state");
      
      if (this.states[state].exclusiveFunctions.indexOf(listener) !== -1)
        this.states[state].splice(this.states[state].exclusiveFunctions.indexOf(listener), 1);
    }
  });
  
  lces.global.lcGroup = lcGroup;
  
  // LCES Server Related Components
  
  lces.global.lcData = function() { // This should be for stuff that is shared with the server's DB
    var extended = lcComponent.call(this);
    if (!extended)
      this.type = "LCES Data Link";

    var that = this;


    this.onchange = function(state) {
      var query = {};
      query[state] = this.get();

      var req = new lcRequest({
        method: "post",
        uri: "/action",
        query: query,
        form: true
      });
      req.send();
    }

    this.addStateListener("newstate", function(state) {
      that.addStateListener(state, function() {
        that.onchange.call(this, state);
      });
    });
  }

  lces.global.lcRequest = function(args) { // args: {method, uri | url, callback, query, formData, async}
    // Check for args
    args = jSh.type(args) === "object" ? args : null;
    if (args === null)
      return null;
    
    var extended = lcComponent.call(this);
    if (!extended)
      this.type = "LCES Request";
    
    var that   = this;
    this.xhr   = typeof args.__XMLHttpRequest === "function" ? new args.__XMLHttpRequest() : new XMLHttpRequest();
    var  xhr   = this.xhr;
    this.abort = xhr.abort.bind(xhr);
    
    if (typeof (args.callback || args.success || args.fail) === "function") {
      xhr.onreadystatechange = function() {
        if (typeof args.callback === "function")
          args.callback.call(this);
        
        if (this.readyState === 4) {
          if (this.status === 200) {
            if (typeof args.success === "function")
              args.success.call(this);
          } else {
            if (typeof args.fail === "function")
              args.fail.call(this);
          }
        }
      }
    }

    if (args.setup && typeof args.setup === "function")
      args.setup.call(xhr);

    var queryString = "";
    
    if (args.query) {
      function recursion(obj) {
        if (jSh.type(obj) === "array")
          return encodeURIComponent(obj.join(","));
        if (jSh.type(obj) !== "object")
          return encodeURIComponent(obj.toString());

        var qs = "";

        for (prop in obj) {
          if (obj.hasOwnProperty(prop)) {

            switch (jSh.type(obj[prop])) {
              case "string":
                qs += "&" + prop + "=" + encodeURIComponent(obj[prop]);
              break;
              case "number":
                qs += "&" + prop + "=" + obj[prop];
              break;
              case "array":
                qs += "&" + prop + "=" + encodeURIComponent(obj[prop].join(";"));
              break;
              case "object":
                qs += "";
              break;
              case "null":
                qs += "&" + prop + "=null";
              break;
              case "undefined":
                qs += "";
              break;
              default:
                qs += "";

            }
          }
        }

        return qs;
      }

      queryString = recursion(args.query).substr(1);
    } else {
      queryString = args.formData || "";
    }

    var method = !args.method || args.method.toLowerCase().indexOf("get") != -1 ? "GET" : "POST";

    xhr.open(method, (args.uri || args.url) + (method == "GET" ? (queryString ? "?" + queryString : "") : ""), args.async !== undefined ? args.async : true);

    if (args.form)
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    this.send = function() {
      var oldCookies = document.cookie.split(/\s*;\s*/).map(function(c) {return [c.split("=")[0], c.split("=")[1]]});
      
      if (args.cookies === false) { // Remove all cookies
        var time = (new Date());
        time.setTime(0);
        
        oldCookies.forEach(function(c) {document.cookie = c[0] + "=; expires=" + time + "; path=/"});
      }
      
      xhr.send(method == "POST" ? queryString : undefined);
      
      if (args.cookies === false) { // Readd the cookies
        setTimeout(function(){ oldCookies.forEach(function(c) {document.cookie = c[0] + "=" + c[1] + "; expires=; path=/"}) }, 50);
      }
    }
  }

  jSh.inherit(lcRequest, lcComponent);


  // LCES Main functions

  if (!window.lces) // TODO: Likely redundant code, FIXME
    window.lces = function(lcesname) {
      return LCES.components[lcesname];
    }

  // Global container of all lces.types
  lces.types = {
    "component": lcComponent,
    "group": lcGroup
  }
  
  // lces.noReference = Bool
  //
  // If true LCES won't save any reference to any components created
  // it's set. But if set back to false LCES will store a refernce for every component.
  lces.noReference = false;
  
  // lces.new(type, [, arg1[, arg2[, ...]]])
  //
  // type: String. LCES Constructor type as registered in lces.types
  //
  // Returns a new instance of an LCES constructor of
  lces.new = function(type) {
    var args = jSh.toArr(arguments).slice(1);
    var func = lces.types[type || "component"];
    
    return typeof func === "function" ? new (Function.prototype.bind.apply(func, [null].concat(args))) : null;
  }
  
  lces.type = function(type) {
    return lces.types[type || "component"];
  }
  
  // lces.deleteComponent
  //
  lces.deleteComponent = function(component) {
    if (!component || !(component instanceof lcComponent)) {
      console.error("LCES ERROR: Deleting component failed, invalid LCES component");
      
      return false;
    }
    
    var LCESComponents = LCES.components;
    
    var LCESName = component.LCESName;
    
    LCESComponents[component.LCESID] = undefined;
    component.removeAllGroupLinks();
    component.removeAllStates();
    component.removeAllEvents();
    
    if (LCESName && LCESComponents[LCESName] === component)
      LCESComponents[LCESName] = undefined;
  }
  
  // Initiation functions system
  lces.initSystem = function() {
    var that = this;
    
    // Arrays that contain all the init functions. DO NOT MUTATE THESE ARRAYS DIRECTLY, use the LCES methods provided instead
    //
    // PRIORITY SYSTEM:
    //  0: Pre-initiation:  Functions that have things to do before Initiation starts.
    //  1: Initiation:      Functions that get everything into a running state.
    //  2: Post-initiation: Functions that tidy up everything after Initiation is complete.
    this.preInitFunctions = [];
    this.initFunctions = [];
    this.postInitFunctions = [];
    
    // Priority array mapping
    this.initPriority = {
      "0": this.preInitFunctions,
      "1": this.initFunctions,
      "2": this.postInitFunctions
    };
    
    // Add initSystem methods
    jSh.extendObj(this, lces.initSystem.methods);
    
    // After initiation completes will be set to true
    this.initiated = null;
    
    // Main LCES init function
    this.init = function() {
      if (this.initiated)
        return false;
      
      // Prevent any conflicts from a possible secondary call to lces.init()
      this.initiated = true;
      
      var priorityArrays = Object.getOwnPropertyNames(this.initPriority);
      
      // Loop all priority arrays and their functions cautiously
      for (var i=0,l=priorityArrays.length; i<l; i++) {
        var pArray = that.initPriority[priorityArrays[i]];
        
        for (var j=0,l2=pArray.length; j<l2; j++) {
          try {
            pArray[j](); // Covers ears and hopes nothing blows up
          } catch (e) {
            // Ehhh, so, what happened????
            console.error(e);
          }
        }
      }
    };
  }

  // Contain all the
  lces.initSystem.methods = {
    // LCES Initiation sequence manipulation methods internal mechanism for validating/determining the priority
    getInitPriority: function(priority) {
      return !isNaN(priority) && this.initPriority[priority] ?
                this.initPriority[priority] :
                this.initPriority[1];
    },
    
    // The init priority system manipulation functions
    
    // lces.addInit(initFunc, priority)
    //
    // func: Function. Function to be added to the initiation sequence
    // priority: Integer. Possible value: 0-2 Default: 1 It determines which priority stack the function gets allocated to
    //
    // Description: Adds func to the LCES initiation sequence of priority <priority>. The function will be called
    //              when it's priority is running after lces.init() is invoked.
    addInit: function(func, priority) {
      priority = this.getInitPriority(priority);
      
      if (typeof func !== "function")
        throw TypeError("LCES Init: Init Function isn't a function");
      
        priority.push(func);
    },
    
    removeInit: function(func, priority) {
      priority = this.getInitPriority(priority);
      
      var index = priority.indexOf(func);
      
      if (index >= 0)
        priority.splice(index, 1);
    },
    
    insertInit: function(newFunc, oldFunc, priority) {
      priority = this.getInitPriority(priority);
      
      if (typeof newFunc !== "function")
        throw TypeError("LCES Init: Init function provided isn't a function");
      
      var index = priority.indexOf(oldFunc);
      
      if (index >= 0)
        priority.splice(index, 0, newFunc);
    },
    
    replaceInit: function(newFunc, oldFunc, priority) {
      priority = this.getInitPriority(priority);
      
      if (typeof newFunc !== "function")
        throw TypeError("LCES Init: Init function provided isn't a function");
      
      var index = priority.indexOf(func);
      
      if (index >= 0)
        priority.splice(index, 1, newFunc);
    }
  };

  // Add initSystem to lces
  lces.initSystem.call(lces);
}

// If only jSh run LCES
if (lces.onlyjSh)
  lces.rc[2]();
lces.rc.forEach(f => f()); 