var assert = require("chai").assert;
var app = require("../../app/demo/methods");

// Testing to ensure my math calculations make sense when determining the player and enemies' movements
describe("getVector", function() {
  it("Vector values with velocity and no magnitude should equal object magnitudes", function() {
    obj = { magnitudeX: 100, magnitudeY: 0 };
    assert.equal(app.getVector(100, 0).magnitudeX, obj.magnitudeX);
    assert.equal(app.getVector(100, 0).magnitudeY, obj.magnitudeY);
  });

  it("Vector values with velocity and magnitude should equal object magnitudes", function() {
    obj = { magnitudeX: Math.round(3e-15), magnitudeY: 50 };
    assert.equal(Math.round(app.getVector(50, 90).magnitudeX), obj.magnitudeX);
    assert.equal(app.getVector(50, 90).magnitudeY, obj.magnitudeY);
  });
});

describe("getAngleAndDistance", function() {
  it("Distance and angle between two points in same location", function() {
    obj = { distance: 0, angle: 0 };
    assert.equal(
      app.getAngleAndDistance(100, 0, 100, 0).distance,
      obj.distance
    );
    assert.equal(app.getAngleAndDistance(100, 0, 100, 0).angle, obj.angle);
  });
  it("Distance and angle between two points horizontal to each other", function() {
    obj = { distance: 100, angle: 0 };
    assert.equal(
      app.getAngleAndDistance(100, 0, 200, 0).distance,
      obj.distance
    );
    assert.equal(app.getAngleAndDistance(100, 0, 200, 0).angle, obj.angle);
  });

  it("Distance and angle between two points vertical to each other", function() {
    obj = { distance: 100, angle: 0 };
    assert.equal(
      app.getAngleAndDistance(100, 0, 100, 100).distance,
      obj.distance
    );
    assert.equal(app.getAngleAndDistance(100, 0, 100, 0).angle, obj.angle);
  });

  it("Distance and angle between two points diagonal to each other", function() {
    obj = { distance: 71, angle: 135 };
    assert.equal(
      app.getAngleAndDistance(100, 0, 50, 50).distance,
      obj.distance
    );
    assert.equal(app.getAngleAndDistance(100, 0, 50, 50).angle, obj.angle);
  });
});
