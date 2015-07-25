var TO_RADIANS = Math.PI/180;
var move_controller;

__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

var Rover = function(grid, id, x, y, facing){
  this.id      = id;
  this.grid    = grid;
  this.canvas  = this.grid.canvas;
  this.context = this.grid.context;
  this.lastPositions = [];
  this.delay = 1000;
  this.image   = document.getElementById('robot');
  this.setPosition({ x: x, y: y, facing: facing })
  this.eventHandler = __bind(this.eventHandler, this);
};

Rover.prototype.setPosition = function(params) {
  if (this.x != params['x'] || this.y != params['y']) {
    if (this.lastPositions.length > 9 ) { this.lastPositions.shift(); }
    this.lastPositions.push({x: this.x, y: this.y, angle: this.last_angle});
  }
  if (this.angle != params['facing']){ this.last_angle = this.angle; }
  
  this.x       = params['x'];
  this.y       = params['y'];
  this.angle   = params['facing'];
};

Rover.prototype.draw = function () {
  this.grid.reset(this.grid.obstacles);
  this.context.save();
  this.context.translate((this.x*50) + 25, (this.y*50) + 25);
  this.context.rotate(this.angle * TO_RADIANS);
  this.context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
  this.context.restore();
};

Rover.prototype.move = function(movement) {
  that = this;
  that.change_delay = false;
  if (that.delay == 0){ that.delay = 1000; that.change_delay = true; }
  if ( that.grid.checkPosition({ x: that.x, y: that.processCoord(that.y, '-')}) == null && that.processCoord(that.y, '-') != that.last_y
        && that.checkLastPositions({x:that.x, y:that.processCoord(that.y, '-'), angle: 0}) === null) {
    if (that.angle != 0) {
      that.setPosition({ x: that.x, y: that.y, facing: 0 });
      that.draw();
    }
    setTimeout(function(){
      that.setPosition({ x: that.x, y: that.processCoord(that.y, '-'), facing: that.angle });
      that.draw();
    }, 500);
  } else if ( that.grid.checkPosition({ x: that.processCoord(that.x, '-'), y: that.y}) == null
               && that.processCoord(that.x, '-') != that.lastPositions[that.lastPositions.length-1]['x'] && that.checkLastPositions({x:that.processCoord(that.x, '-'), y:that.y, angle: 270}) == null
               && that.last_angle != 90 ) {
      that.setPosition({ x: that.x, y: that.y, facing: 270 });
      that.draw();
      setTimeout(function(){
        that.setPosition({ x: that.processCoord(that.x, '-'), y: that.y, facing: 270 });
        that.draw();
      }, 500);
  } else if ( that.grid.checkPosition({ x: that.processCoord(that.x, '+'), y: that.y}) == null
              && that.x+1 != that.lastPositions[that.lastPositions.length-1]['x'] && that.checkLastPositions({x:that.processCoord(that.x, '+'), y:that.y, angle: 90}) === null ) {
      that.setPosition({ x: that.x, y: that.y, facing: 90 });
      that.draw();
      setTimeout(function(){
        that.setPosition({ x: that.processCoord(that.x, '+'), y: that.y, facing: 90 });
        that.draw();
      }, 500);
  } else if ( that.grid.checkPosition({ x: that.x, y:  that.processCoord(that.y, '+')}) == null
              &&  that.processCoord(that.y, '+') != that.lastPositions[that.lastPositions.length-1]['y'] && that.checkLastPositions({x:that.x, y: that.processCoord(that.y, '+'), angle: 180}) === null) {
      that.setPosition({ x: that.x, y: that.y, facing: 180 });
      that.draw();
      setTimeout(function(){
        that.setPosition({ x: that.x, y:  that.processCoord(that.y, '+'), facing: 180 });
        that.draw();
      }, 500);
  } else if (that.last_angle != 90) {
      switch (that.angle) {
        case 0:
          that.setPosition({ x: that.x, y: that.y, facing: 180 });
          that.draw();
          setTimeout(function(){
            that.setPosition({ x: that.x, y:  that.processCoord(that.y, '+'), facing: 180 });
            that.draw();
          }, 500);
          break;
        case 90:
          that.setPosition({ x: that.x, y: that.y, facing: 270 });
          that.draw();
          setTimeout(function(){
            that.setPosition({ x: that.processCoord(that.x, '-'), y: that.y, facing: 270 });
            that.draw();
          }, 500);
          break;
        case 270:
          that.setPosition({ x: that.x, y: that.y, facing: 90 });
          that.draw();
          setTimeout(function(){
            that.setPosition({ x: that.processCoord(that.x, '+'), y: that.y, facing: 90 });
             that.draw();
          }, 500);
          break;
      }
  }
  else {
      that.last_angle = 0;
      that.delay = 0;
      that.change_delay = true;
  }
};

Rover.prototype.init = function() { 
  grid = this.grid
  rover = this
  this.grid.canvas.addEventListener("mousedown", function(){
    grid.getPosition(event, grid);
    rover.draw();
  }, false);

  (function keepMoving() {
    rover.move();
    setTimeout(keepMoving, rover.delay);
  })();
};

Rover.prototype.checkLastPositions = function (position) {
  for (var i = 0; i < this.lastPositions.length; i++) {
    if ( this.lastPositions[i]['x'] == position['x']
          &&  this.lastPositions[i]['y'] == position['y']
          &&  this.lastPositions[i]['angle'] == position['angle'] ) {
      return i;
    }
  }
  return null;
}

Rover.prototype.processCoord = function(coord, sign) {
  if (sign == "+") {
    return coord === 9 ? 0 : coord + 1;
  } else {
    return coord === 0 ? 9 : coord - 1;
  }
}
