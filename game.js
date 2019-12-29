var player;

var c;
var ctx;
var wrapper;

var mouseHead = {
  x: 0,
  y: 0
};

var lastStep = 0;
var particles = [
  {
    x: 0,
    y: 0
  }
];

var difficulty = {
  amount: 50,
  speed: 0.75,
  mov: 300
};

function easy() {
  difficulty.amount = 50;
  difficulty.speed = 0.75;
  difficulty.mov = 300;
}

function medium() {
  difficulty.amount = 40;
  difficulty.speed = 1;
  difficulty.mov = 350;
}

function hard() {
  difficulty.amount = 25;
  difficulty.speed = 1.5;
  difficulty.mov = 400;
}
var enemies = [];

wrapper = document.getElementById("wrapper");

c = document.getElementById("reflex-io");

ctx = c.getContext("2d");

var timer = 0;

var initial = 0;

var clickCount = 0;

setCanvasSize();

function wait() {
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Time: 0", 20, 20);

  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Click count: 0", 550, 20);

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

function resetGame() {
  enemies = [];
  timer = 0;
  clickCount = 0;
  request = 0;
  startGame();
}

//oncontextmenu="return false;"
//16.6666667

var id = 0;
var request;

document.addEventListener("contextmenu", function(event) {
  clickCount += 1;
  console.log(clickCount);
});
function startGame() {
  setTimeout(function() {
    c.addEventListener(
      "contextmenu",
      function(e) {
        var m = getMousePos(c, e);
        mouseHead.x = m.x;
        mouseHead.y = m.y;
      },
      false
    );

    particles.forEach(function(p) {
      p.x = c.width / 2;
      p.y = c.height / 2;
    });

    mouseHead.x = c.width / 2;
    mouseHead.y = c.height / 2;

    request = window.requestAnimationFrame(animationFrame);
  }, 0.1);
}

function hitbox(p) {
  //if (Math.abs(p.x - particles[0].x) < 1 && Math.abs(p.y - particles[0].y) < 1 )

  var dx = p.x - particles[0].x;
  var dy = p.y - particles[0].y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  //20 is both radius added together
  if (distance < 20) {
    initial = 1;
    stop1();
  }
}
// c.addEventListener see the difference
document.addEventListener("keyup", function(event) {
  if (event.key == "r" && id == 1) {
    id = 0;
    resetGame();
  }
});

function stop1() {
  if (request) {
    id = 1;
    console.log("REQUEST " + request);
    cancelAnimationFrame(request);
  }
}

function animationFrame(millisecond) {
  var elapsed = millisecond - lastStep;
  lastStep = millisecond;
  request = window.requestAnimationFrame(animationFrame);
  //console.log(Math.round(elapsed));

  updateGame(elapsed, lastStep);
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = evt.clientX - rect.left;
  var mouseY = evt.clientY - rect.top;

  //console.log(mouseX);
  //console.log(mouseY);
  return {
    x: mouseX,
    y: mouseY
  };
}

function updateGame(elapsed, lastStep) {
  clearCanvas();
  moveParticles(elapsed);
  renderParticles(lastStep);
  renderEnemies(lastStep);
}

function setCanvasSize() {
  c.width = window.innerWidth - 100;
  c.height = window.innerHeight - 100;

  /*
  if (window.innerWidth < window.innerHeight) {
    c.style.width = window.innerWidth - 1500;
    c.style.height = window.innerWidth - 150;
  } else {
    c.style.width = window.innerHeight - 150;
    c.style.height = window.innerHeight - 150;
  }
  */
}

/*
function setCanvasSize() {
  c.width = 700;
  c.height = 700;
}
*/
function moveParticles(milliseconds) {
  particles.forEach(function(p) {
    var data = distanceAndAngleBetweenTwoPoints(
      p.x,
      p.y,
      mouseHead.x,
      mouseHead.y
    );
    var velocity = data.distance / 0.3;
    //Use velocity if you want to slow down, new Vector(velocity, data.angle)
    var toMouseVector = new Vector(difficulty.mov, data.angle);
    var elapsedSeconds = milliseconds / 1000;

    if (
      Math.abs(p.x - mouseHead.x) > 1.5 ||
      Math.abs(p.y - mouseHead.y) > 1.5
    ) {
      p.x += toMouseVector.magnitudeX * elapsedSeconds;
      p.y += toMouseVector.magnitudeY * elapsedSeconds;
    }
  });
}

function renderParticles() {
  particles.forEach(function(p) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(p.x, p.y);
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
    ctx.fillText("Click count: " + clickCount, 550, 20);

    /*
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.fillText(difficulty.amount, 120, 20);
    */
  });
}

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
  if (Math.round(time) % difficulty.amount === 0) {
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

}

function moveEnemies(edge) {
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
