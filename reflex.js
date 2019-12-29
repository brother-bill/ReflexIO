//Initialize mouse location, enemies, player, and difficulty
var mouseHead = {
  x: 0,
  y: 0
};

var lastStep = 0;
var particles = [0, 0];

var difficulty = {
  amount: 50,
  speed: 0.75,
  mov: 300,
  name: "Easy"
};

var enemies = [];
var timer = 0;
var initial = 0;
var clickCount = 0;
var id = 0;
var request = 0;

// This is canvas object
var c = document.getElementById("reflex-io");
// Canvas context
var ctx = c.getContext("2d");

// Set the size of game window according to size of open window
setCanvasSize();

function wait() {
  //Update game difficulty before the game starts
  redrawText();

  //Mov is player move speed, amount is spawn ratio, speed is enemy speed
  document.getElementById("easy").onclick = function() {
    if (initial != 1) {
      difficulty.amount = 50;
      difficulty.speed = 0.75;
      difficulty.mov = 300;
      difficulty.name = "Easy";
      redrawText();
    }
  };
  document.getElementById("medium").onclick = function() {
    if (initial != 1) {
      difficulty.amount = 40;
      difficulty.speed = 1;
      difficulty.mov = 300;
      difficulty.name = "Medium";
      redrawText();
    }
  };
  document.getElementById("hard").onclick = function() {
    if (initial != 1) {
      difficulty.amount = 25;
      difficulty.speed = 1.5;
      difficulty.mov = 300;
      difficulty.name = "Hard";
      redrawText();
    }
  };

  // Wait for player to start game
  document.addEventListener("keyup", function(event) {
    if (event.key == "s" && initial == 0) {
      initial = 1;
      setInterval(setTime, 1000);
      function setTime() {
        ++timer;
      }
      startGame();
    }
  });
}
//Increment click count by 1 for each right click
document.addEventListener("contextmenu", function(event) {
  if (initial == 1) {
    clickCount += 1;
  }
});

// Start game and listen for right clicks
function startGame() {
  //console.log("HI");
  setTimeout(function() {
    //Get mouse position on right click and set it to the location you want to head towards
    c.addEventListener(
      "contextmenu",
      function(e) {
        var m = getMousePos(c, e);
        mouseHead.x = m.x;
        mouseHead.y = m.y;
      },
      false
    );
    // Start player in middle of canvas
    particles[0] = c.width / 2;
    particles[1] = c.height / 2;

    // Set the direction the player is heading to middle of canvas so player doesn't move right away
    mouseHead.x = c.width / 2;
    mouseHead.y = c.height / 2;

    //Begin updating the game
    request = window.requestAnimationFrame(animationFrame);
  }, 1000 / 60);
}

//Redraw the difficulty on canvas without affecting other values
function redrawText() {
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Time: 0", 20, 20);
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Click Count: 0", c.width - 150, 20);
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText(difficulty.name, 120, 20);
}

//Calculate elapsed time to determine velocity
function animationFrame(millisecond) {
  var elapsed = millisecond - lastStep;
  lastStep = millisecond;
  request = window.requestAnimationFrame(animationFrame);
  updateGame(elapsed, lastStep);
}

//Get the mouse position on the canvas
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = evt.clientX - rect.left;
  var mouseY = evt.clientY - rect.top;
  return {
    x: mouseX,
    y: mouseY
  };
}

function updateGame(elapsed, lastStep) {
  clearCanvas();
  moveParticles(elapsed);
  renderParticles();
  //moveEnemies();
  //renderEnemies(lastStep);
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

//Calculate the move speed of player and change their position according to the location clicked on
function moveParticles(milliseconds) {
  var data = distanceAndAngleBetweenTwoPoints(
    particles[0],
    particles[1],
    mouseHead.x,
    mouseHead.y
  );
  var velocity = data.distance / 0.3;
  //Use velocity if you want to slow down, new Vector(velocity, data.angle)
  var toMouseVector = new Vector(difficulty.mov, data.angle);
  var elapsedSeconds = milliseconds / 1000;

  //Some rounding errors to account for over 3 pixels
  if (
    Math.abs(particles[0] - mouseHead.x) > 3 ||
    Math.abs(particles[1] - mouseHead.y) > 3
  ) {
    console.log(elapsedSeconds);
    particles[0] += toMouseVector.magnitudeX * elapsedSeconds;
    particles[1] += toMouseVector.magnitudeY * elapsedSeconds;
  }
}

//Calculate the move speed of player and change their position according to the location clicked on
function movePlayer(time) {
  var data = distanceAndAngleBetweenTwoPoints(
    particles[0],
    particles[1],
    mouseHead.x,
    mouseHead.y
  );
  var velocity = 300;
  var elapsedSeconds = time / 1000;
  //Use velocity if you want to slow down, new Vector(velocity, data.angle)
  var toMouseVector = new Vector(velocity, data.angle);

  //console.log(data.distance);

  if (data.distance > 5) {
    particles[0] += toMouseVector.magnitudeX * elapsedSeconds;
    particles[1] += toMouseVector.magnitudeY * elapsedSeconds;
  }
}

function renderParticles() {
  ctx.save();
  ctx.beginPath();
  ctx.translate(particles[0], particles[1]);
  ctx.arc(0, 0, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Time: " + Math.floor(timer), 20, 20);

  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Click Count: " + clickCount, c.width - 150, 20);

  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText(difficulty.name, 120, 20);
}

counter1 = 0;
function renderEnemies(time) {
  var randomStartX = 0;
  var randomStartY = 0;

  var rand = Math.floor(Math.random() * 4);

  switch (rand) {
    case 0:
      randomStartX = Math.floor(Math.random() * c.width);
      randomStartY = 0;
      break;
    case 1:
      randomStartX = 0;
      randomStartY = Math.floor(Math.random() * c.height);
      break;

    case 2:
      randomStartX = c.width;
      randomStartY = Math.floor(Math.random() * c.height);
      break;

    case 3:
      randomStartX = Math.floor(Math.random() * c.width);
      randomStartY = c.height;
      break;
  }
  ////////////////////////////////////////////////////////////////////////////////////
  //console.log(counter1);
  counter1 += 50;

  //250, 1250, 2000
  if (counter1 % 1000 == 0) {
    //console.log("WIDTH HEIGHT " + c.height);
    //console.log("RAND IS "+ rand);
    //console.log("X is " + randomStartX);
    //console.log("Y is " + randomStartY);
    //console.log("CANVAS" + c.width);

    enemies.push({
      x: randomStartX,
      y: randomStartY,
      edge: rand,
      tempX: randomStartX,
      tempY: randomStartY
    });
    //console.log(enemies.length);
  }

  //To prevent the enemy list from growing too large, we remove from the beginning to free up memory
  if (enemies.length == 100) {
    enemies.splice(0, 25);
  }

  enemies.forEach(function(p) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(p.x, p.y);
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    hitbox(p);
  });
  //console.log(enemies.length);
  /////////////////////////////////
}

// Calculate if we hit an enemy
function hitbox(p) {
  var dx = p.x - particles[0];
  var dy = p.y - particles[1];
  var distance = Math.sqrt(dx * dx + dy * dy);

  //Radius of player and enemies is 10, add them both together for collision
  if (distance < 20) {
    initial = 1;
    lose();
  }
}

function lose() {
  if (request) {
    id = 1;
    cancelAnimationFrame(request);
  }
}

document.addEventListener("keyup", function(event) {
  if (event.key == "r" && id == 1) {
    id = 0;
    //MAYBE FIX WITHOUT RELOADING
    //resetGame();
    window.location.reload();
  }
});

//Reset the game
function resetGame() {
  enemies = [];
  timer = 0;
  clickCount = 0;
  request = 0;
  //wait();
  startGame();
}
function moveEnemies() {
  //0 is top
  //1  is left
  //2 is right
  //3 is bot

  enemies.forEach(function(p) {
    var minSpeedX = 1;
    var speedRatioX = 0.8;

    var minSpeedY = 1;
    var speedRatioY = 0.8;
    //////////////////////////////////////////////////////////////////////////////////
    //var speedX = Math.random() * speedRatioX + minSpeedX;
    //var speedY = Math.random() * speedRatioY + minSpeedY;

    var speedX = difficulty.speed;
    var speedY = difficulty.speed;

    //console.log(difficulty.speed);
    if (p.edge == 0) {
      if (p.tempX > c.width / 2) {
        p.x -= speedX;
        p.y += speedY;
      } else {
        p.x += speedX;
        p.y += speedY;
      }
    } else if (p.edge == 1) {
      if (p.tempY > c.height / 2) {
        p.x += speedX;
        p.y -= speedY;
      } else {
        p.x += speedX;
        p.y += speedY;
      }
    } else if (p.edge == 2) {
      if (p.tempY > c.height / 2) {
        p.x -= speedX;
        p.y -= speedY;
      } else {
        p.x -= speedX;
        p.y += speedY;
      }
    } else if (p.edge == 3) {
      if (p.tempX > c.width / 2) {
        p.x -= speedX;
        p.y -= speedY;
      } else {
        p.x += speedX;
        p.y -= speedY;
      }
    }

    //p.x += .5;
    //p.y += .5;
  });
}

function distanceAndAngleBetweenTwoPoints(x1, y1, x2, y2) {
  var x = x2 - x1,
    y = y2 - y1;

  return {
    // x^2 + y^2 = r^2
    distance: Math.round(Math.sqrt(x * x + y * y)),

    // convert from radians to degrees
    angle: Math.round((Math.atan2(y, x) * 180) / Math.PI)
  };
}

function Vector(magnitude, angle) {
  var angleRadians = (angle * Math.PI) / 180;
  this.magnitudeX = magnitude * Math.cos(angleRadians);
  this.magnitudeY = magnitude * Math.sin(angleRadians);
}

function clearCanvas() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, c.width, c.height);
}
