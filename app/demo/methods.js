// Calculate vector given velocity and angle
function getVector(velocity, angle) {
  var angleRadians = (angle * Math.PI) / 180;
  return {
    magnitudeX: velocity * Math.cos(angleRadians),
    magnitudeY: velocity * Math.sin(angleRadians)
  };
}

// Get the distance and angle between two points
function getAngleAndDistance(x1, y1, x2, y2) {
  var deltaX = x2 - x1,
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

module.exports = {
  getVector,
  getAngleAndDistance
};
