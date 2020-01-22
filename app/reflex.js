// This is the canvas object
let canvas = document.getElementById("reflex-io");

// Context taken from canvas
let ctx = canvas.getContext("2d");

// Set the size of game window according to size of open window
setCanvasSize();

// Start player in middle of canvas
let player = [canvas.width / 2, canvas.height / 2];

// Player heads in direction of mousePosition, set equal to player initial position
let mousePosition = {
  x: player[0],
  y: player[1]
};

// Default difficulty set to hard as most players want to quickly get back into the challenge
let difficulty = {
  amount: 1,
  speed: 200,
  name: "Hard"
};

// Initialize list where we store our enemies
let enemies = [];

// Need both of these variables to prevent player from changing settings while playing but not losing
let isPlaying, lose;
lose = isPlaying = false;

// Initiliaze counters, timers, and indices
let enemyTime, lastIteration, animation, timer, clickCount, scrollIndex, game;
(enemyTime = lastIteration = animation = timer = clickCount = game = 0),
  (scrollIndex = 2); // 2 is default Hard difficulty index

//Changes canvas size to a fixed amount
function setCanvasSize() {
  canvas.width = 600;
  canvas.height = 600;
}

// Set the difficulty to desired amount
function setDifficulty(name) {
  difficulty.name = name;
  switch (name) {
    case "Easy":
      difficulty.amount = 3;
      difficulty.speed = 100;
      break;
    case "Medium":
      difficulty.amount = 2;
      difficulty.speed = 150;
      break;
    case "Hard":
      difficulty.amount = 1;
      difficulty.speed = 200;
      break;

    default:
      difficulty.name = "Hard";
      difficulty.amount = 1;
      difficulty.speed = 200;
  }
}
// Wait for player to change settings before starting the game
function wait() {
  //Draw player and stats and redraw if difficulty changes
  drawStats();
  renderPlayer();
  window.addEventListener("wheel", function(event) {
    // Make sure to not increment scroll index if it reaches max or lowest difficulty
    if (event.deltaY < 0 && difficulty.name !== "Hard" && !isPlaying && !lose) {
      scrollIndex += 1;
      scrollDifficulty(scrollIndex);
      drawStats();
      renderPlayer();
      //console.log("scrolling up");
    } else if (
      event.deltaY > 0 &&
      difficulty.name !== "Easy" &&
      !isPlaying &&
      !lose
    ) {
      scrollIndex -= 1;
      scrollDifficulty(scrollIndex);
      drawStats();
      renderPlayer();
      //console.log("scrolling down");
    }
  });

  // Wait for player to start game
  document.addEventListener("mousedown", playerStart);
  document.addEventListener("keypress", playerStart);
  // 0 is left click, 1 is middle click, 2 is right click
}

//Get mouse position on right click and set it to the location you want to head towards
canvas.addEventListener(
  "contextmenu",
  function(mouse) {
    if (isPlaying) {
      mousePosition.x = getMousePos(canvas, mouse).x;
      mousePosition.y = getMousePos(canvas, mouse).y;
    }
  },
  false
);

// We try to account for our calculations for time taken to compute next frame using delta time
// Source: https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
function controlFps(fps, callback) {
  let frameRate = 1000 / fps,
    time = null,
    currentFrame = -1;

  function loop(milliseconds) {
    if (time === null) time = milliseconds; // Intial time
    let segment = Math.floor((milliseconds - time) / frameRate); // This is the n-th frame

    // If we moved to next frame then update
    if (segment > currentFrame) {
      currentFrame = segment;
      callback({
        time: milliseconds
      });
    }
    if (isPlaying) {
      animation = window.requestAnimationFrame(loop);
    }
  }

  // Start the game loop
  this.start = function() {
    if (isPlaying) {
      animation = window.requestAnimationFrame(loop);
    }
  };
}

// Render the player on the canvas
function renderPlayer() {
  ctx.save();
  ctx.beginPath();
  ctx.translate(player[0], player[1]);
  ctx.arc(0, 0, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

//Calculate the move speed of player and change their position according to the location clicked on
function movePlayer(time) {
  let points = getAngleAndDistance(
    player[0],
    player[1],
    mousePosition.x,
    mousePosition.y
  );
  let velocity = 300;

  // Millisecond to second conversion
  let elapsedSeconds = time / 1000;

  // Find vector given velocity and angle between player and enemy
  let toMouseVector = getVector(velocity, points.angle);

  // If the player is more than 5 pixels away from where we clicked, then move the player
  if (points.distance > 5) {
    player[0] += toMouseVector.magnitudeX * elapsedSeconds;
    player[1] += toMouseVector.magnitudeY * elapsedSeconds;
  }
}

// We draw each enemy at a random edge and push the enemy to the list
function renderEnemies() {
  let randomStartX = 0;
  let randomStartY = 0;

  // Pick a random edge out of the 4 options
  let rand = Math.floor(Math.random() * 4);

  // Set the coordinate for an enemy based on which edge they spawn in
  switch (rand) {
    case 0:
      randomStartX = Math.floor(Math.random() * canvas.width);
      randomStartY = 0;
      break;
    case 1:
      randomStartX = 0;
      randomStartY = Math.floor(Math.random() * canvas.height);
      break;

    case 2:
      randomStartX = canvas.width;
      randomStartY = Math.floor(Math.random() * canvas.height);
      break;

    case 3:
      randomStartX = Math.floor(Math.random() * canvas.width);
      randomStartY = canvas.height;
      break;
  }

  // Depending on the difficulty, we spawn enemies each time we over a time threshold. Ex: Spawn enemy every second / every 5 seconds
  // Although using modulo is preferred, there were bugs on different computers where the time intervals were not as accurate as they should have been leading to inconsistent enemies between platforms
  if (enemyTime > difficulty.amount) {
    enemyTime = 0;
    enemies.push({
      x: randomStartX,
      y: randomStartY,
      edge: rand,
      tempX: randomStartX,
      tempY: randomStartY
    });
  }

  // To prevent the enemy list from growing too large, we remove from the beginning to free up memory
  if (enemies.length == 60) {
    enemies.splice(0, 20);
  }
}

// Move enemies according to time frame interval and which edge they spawn in
function moveEnemies(time) {
  // For each enemy we will update their location and speed according to each frame interval
  enemies.forEach(function(p) {
    // Millisecond to second conversion
    let elapsed = time / 1000;
    let speedX = difficulty.speed * elapsed;
    let speedY = difficulty.speed * elapsed;

    // 0 is top edge
    // 1 is left edge
    // 2 is right edge
    // 3 is bottom edge
    // Depending on which half of an edge an enemy spawns in, we change its' direction
    if (p.edge == 0) {
      if (p.tempX > canvas.width / 2) {
        p.x -= speedX;
        p.y += speedY;
      } else {
        p.x += speedX;
        p.y += speedY;
      }
    } else if (p.edge == 1) {
      if (p.tempY > canvas.height / 2) {
        p.x += speedX;
        p.y -= speedY;
      } else {
        p.x += speedX;
        p.y += speedY;
      }
    } else if (p.edge == 2) {
      if (p.tempY > canvas.height / 2) {
        p.x -= speedX;
        p.y -= speedY;
      } else {
        p.x -= speedX;
        p.y += speedY;
      }
    } else if (p.edge == 3) {
      if (p.tempX > canvas.width / 2) {
        p.x -= speedX;
        p.y -= speedY;
      } else {
        p.x += speedX;
        p.y -= speedY;
      }
    }

    // For each enemy we begin moving them in the direction they need to go until they are rendered again
    ctx.save();
    ctx.beginPath();
    ctx.translate(p.x, p.y);
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    // Calculate hitbox and end the game if player hits any enemy
    hitbox(p);
  });
}

// Calculate if player hits an enemy
function hitbox(p) {
  let dx = p.x - player[0];
  let dy = p.y - player[1];
  let distance = Math.sqrt(dx * dx + dy * dy);

  //Radius of player and enemies is 10, add them both together for collision
  if (distance < 20 && animation) {
    lose = true;
    isPlaying = false;
    // Stop animating the game
    cancelAnimationFrame(animation);

    // If game is over and we lost, allow the player to restart game with left click or pressing "R" on keyboard
    document.addEventListener("keypress", reload);
    document.addEventListener("mousedown", reload);
  }
}
let test = false;

// Reload page if left click or "R" is pressed
function reload(event) {
  if ((event.button == 0 || event.key == "r") && !isPlaying && lose) {
    window.location.reload();
  }
}

// Lower amount value means more enemies spawn, lower speed means lower enemy speed
function scrollDifficulty(scroll) {
  // Change difficulty if mouse wheel scrolls
  switch (scroll) {
    case 0:
      setDifficulty("Easy");
      break;

    case 1:
      setDifficulty("Medium");
      break;

    case 2:
      setDifficulty("Hard");
      break;
  }
}
// Start game is middle mouse button pressed or S pressed
function playerStart(event) {
  // 0 is left click, 1 is middle click, 2 is right click
  if ((event.button == 1 || event.key == "s") && !isPlaying && !lose) {
    isPlaying = true;
    // Start timers for player and enemies
    setInterval(function() {
      timer++;
    }, 1000);
    setInterval(function() {
      enemyTime++;
    }, 100);

    // Update the game with given fps, default we do 144fps
    game = new controlFps(144, function(e) {
      drawStats();
      // We calculate the time elapsed from each frame to the next to ensure the right player and enemy speed
      var elapsed = e.time - lastIteration;
      lastIteration = e.time;

      // Every loop we will move the player and enemies according to the desired fps with elapsed time during a loop
      movePlayer(elapsed);
      renderPlayer();
      moveEnemies(elapsed);
      renderEnemies();
    });
    //Start the game
    game.start();

    //Increment click count by 1 for each right click
    document.addEventListener("contextmenu", function(event) {
      if (isPlaying) {
        clickCount += 1;
      }
    });
  }
}

// Change difficulty if button is pressed
document.getElementById("easy").onclick = function() {
  scrollIndex = 0;
  setDifficulty("Easy");
  drawStats();
  renderPlayer();
};
document.getElementById("medium").onclick = function() {
  scrollIndex = 1;
  setDifficulty("Medium");
  drawStats();
  renderPlayer();
};
document.getElementById("hard").onclick = function() {
  scrollIndex = 2;
  setDifficulty("Hard");
  drawStats();
  renderPlayer();
};

//Get the mouse position on the canvas
function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  let mouseX = evt.clientX - rect.left;
  let mouseY = evt.clientY - rect.top;
  return {
    x: mouseX,
    y: mouseY
  };
}

// Clears the canvas and redraws player and stats when difficulty changes and game starts
function drawStats() {
  ctx.font = "20px sans-serif";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(
    "Time: " + Math.floor(timer) + "      " + difficulty.name,
    4,
    20
  );
  ctx.fillText("Click Count: " + clickCount, canvas.width - 150, 20);
}

// Calculate vector given velocity and angle
function getVector(velocity, angle) {
  let angleRadians = (angle * Math.PI) / 180;
  return {
    magnitudeX: velocity * Math.cos(angleRadians),
    magnitudeY: velocity * Math.sin(angleRadians)
  };
}

// Get the distance and angle between two points
function getAngleAndDistance(x1, y1, x2, y2) {
  let deltaX = x2 - x1,
    deltaY = y2 - y1;

  //Pythagorean Theorem
  pointDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  radians = Math.atan2(deltaY, deltaX);
  degrees = radians * (180 / Math.PI);

  return {
    distance: Math.round(pointDistance),
    angle: Math.round(degrees)
  };
}
