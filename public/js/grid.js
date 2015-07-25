var Grid = function(length, height, obstacles) {
  this.length  = length;
  this.height  = height;
  this.obstacles = obstacles;
  this.obstacle_image = document.getElementById('obstacle');
  this.canvas  = document.getElementById('grid');
  this.context = this.canvas.getContext('2d');
  
};

Grid.prototype.draw = function() {
  var color = true;

  for (var i=0;i < this.length;i++)
  {
    color = !color;
    for (var j=0;j < this.height;j++)
    {
      
      if (color)
      {
        this.context.fillStyle = "rgb(255, 255, 255)";
        color = false;
      }
      else
      {
        this.context.fillStyle = "rgb(100, 100, 100)";
        color = true;
      }
      this.context.fillRect(i*50, j*50, 50, 50);
    }
  }
};

Grid.prototype.draw_obstacles = function(obstacles) {
  //this.context.fillStyle = "rgb(220, 20, 60)";
  for (var i=0;i < obstacles.length;i++){
    this.context.save();
    this.context.translate((obstacles[i]['x']*50)+5, (obstacles[i]['y']*50)+5);
    this.context.drawImage( this.obstacle_image,0,0,40, 40);
    this.context.restore();
  }
}

Grid.prototype.clear = function(){
  var currentWidth = this.canvas.width;
  this.canvas.width = 0;
  this.canvas.width = currentWidth;
};

Grid.prototype.reset = function(obstacles) {
  this.clear();
  this.draw();
  this.draw_obstacles(obstacles);
};


Grid.prototype.getPosition = function(event,grid, position) {
  actual_x = parseInt(document.getElementById('xpos').textContent);
  actual_y = parseInt(document.getElementById('ypos').textContent);
  var x = new Number();
  var y = new Number();
  if (event.x != undefined && event.y != undefined) {
    x = event.x;
    y = event.y;
  } else {
    x = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
    y = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
  }

  x -= this.canvas.offsetLeft;
  y -= this.canvas.offsetTop;

  x =  Math.trunc(x/50);
  y =  Math.trunc(y/50);

  pos = this.checkPosition({ x: x, y: y});
  if ( pos == null) {
     if( actual_x != x || actual_y != y){
       this.obstacles.push({ x: x, y: y})
     }
  } else {
     this.obstacles.splice(pos,1);
  }
};

Grid.prototype.checkPosition = function (position) {
  for (var i = 0; i < this.obstacles.length; i++) {
    if ( (this.obstacles[i]['x'] == position['x'] && this.obstacles[i]['y'] == position['y'])) {
      return i;
    }
  }
  return null;
}