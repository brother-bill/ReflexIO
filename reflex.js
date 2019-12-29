//Initialize mouse location, enemies, player, and difficulty
var mouseHead = {
  x: 0,
  y: 0
};

var player;

// This is canvas object
var c = document.getElementById("reflex-io");
// Canvas context
var ctx = c.getContext("2d");

function startGame() {
  player = new component(30, 30, "red", 10, 120);
  setCanvasSize();
  document.body.insertBefore(c, document.body.childNodes[0]);
  this.interval = setInterval(updateGameArea, 200);
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function() {
    pctx = ctx;
    pctx.fillStyle = color;
    pctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function updateGameArea() {
  clearCanvas();
  player.x += 1;
  player.update();
}

//Changes canvas size to size of current window
function setCanvasSize() {
  c.width = 600;
  c.height = 600;

  /*
  if (window.innerWidth < window.innerHeight) {
    c.width = window.innerWidth - 150;
    c.height = window.innerWidth - 150;
  } else {
    c.width = window.innerHeight - 150;
    c.height = window.innerHeight - 150;
  }
  */
}

function clearCanvas() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, c.width, c.height);
}
