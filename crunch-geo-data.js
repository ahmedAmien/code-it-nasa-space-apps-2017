// Author: Mike32
// Responsible for: Design over data mapping and overall solution

var fs = require("fs");

function indexData(sourceFile, valueMappings) {
  var txt = fs.readFileSync(sourceFile, {
    encoding: "utf8"
  });

  var minX = 0;
  var maxX = 0;
  var minY = 0;
  var maxY = 0;

  var matches = txt.match(/($|\n)\-?\d+\.\d+\s+-?\d+\.\d+/g);
  var whiteSpace = /\s+/;

  console.time("get-min-max-bounds");
  for (var i=0,l=matches.length; i<l; i++) {
    var xy = matches[i].trim().split(whiteSpace);
    
    var matchX = parseFloat(xy[0]);
    var matchY = parseFloat(xy[1]);
    
    minX = Math.min(minX, matchX);
    maxX = Math.max(maxX, matchX);
    
    minY = Math.min(minY, matchY);
    maxY = Math.max(maxY, matchY);
  }
  console.timeEnd("get-min-max-bounds");

  console.log({
    minX,
    maxX,
    minY,
    maxY,
    i
  });

  var resolutions = [
    4,
    16,
    256,
    // 65536
  ];

  var resMaps = {};
  var oldRes;

  for (var res=0; res<resolutions.length; res++) {
    var curRes = resolutions[res];
    var curArr = resMaps[curRes] = [];
    var parArr = resMaps[oldRes];
    
    if (curRes === 4) {
      for (var i=0; i<curRes; i++) {
        var curRow = [];
        
        for (var j=0; j<curRes; j++) {
          curRow.push({
            factor: 0,
            child: []
          });
        }
        
        curArr.push(curRow);
      }
    } else {
      for (var i=0; i<curRes; i++) {
        var curRow = [];
        
        for (var j=0; j<curRes; j++) {
          var cell = {
            factor: 0,
            child: []
          };
          
          var parCellX = Math.floor(j / oldRes);
          var parCellY = Math.floor(i / oldRes);
          var parCell  = parArr[parCellY][parCellX].child;
          
          var localX = j - (parCellX * oldRes);
          var localY = i - (parCellY * oldRes);
          
          if (!parCell[localY]) {
            parCell.push([]);
          }
          
          if (!parCell[localY][localX]) {
            parCell[localY].push([]);
          }
          parCell[localY][localX].push(cell);
          curRow.push(cell);
        }
        
        curArr.push(curRow);
      }
    }
    
    oldRes = curRes;
  }

  // Reindex matches
  var matches  = txt.match(/($|\n)\-?\d+\.\d+\s+-?\d+\.\d+\s+[A-Z]+/g);
  var resCount = resolutions.length;

  var rangeX = maxX - minX;
  var rangeY = maxY - minY;

  for (var i=0,l=matches.length; i<l; i++) {
    var values = matches[i].trim().split(whiteSpace);
    
    var val1 = parseFloat(values[0]);
    var val2 = parseFloat(values[1]);
    var val3 = valueMappings[values[2]];
    
    for (var j=resCount-1; j>-1; j--) {
      var res     = resolutions[j];
      var resData = resMaps[res];
      
      var x = Math.min(Math.floor((1 - ((val1 - minX) / rangeX)) * res), res - 1);
      var y = Math.min(Math.floor((1 - ((val2 - minY) / rangeY)) * res), res - 1);
      
      var cell = resData[y][x];
      cell.factor += val3;
    }
  }

  // Update 4res factors
  var res4 = resMaps[4];
   
  for (var i=0; i<res4.length; i++) {
    var row       = res4[i];
    var rowFactor = 0;
    
    for (var j=0; j<row.length; j++) {
      rowFactor += row[j].factor;
    }
    
    row.factor = rowFactor;
  }
  
  // Done
  return {
    resolutions: resolutions,
    map: resMaps,
    
    bounds: {
      minX,
      minY,
      
      maxX,
      maxY
    }
  };
}

module.exports = indexData;
