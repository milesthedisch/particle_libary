/* eslint max-len: 0 */

/**
 * This module is composed of small function that
 * should be used when needed. Most functions are pure
 * and only return values. For more info read the docs.
 */

/**
 * @class Utils
 * @return {Utils}
 */
function Utils() {
  return this;
};

/**
 * normalize - Takes a max and min value and returns
 * a floating point number, that when multiplied
 * by one hundred represents a precentage of the range
 * between max and min.
 *
 * @memberOf Utils
 * @param  {Int} val - The value that lies in the range.
 * @param  {Int} min - The maxium value in the range.
 * @param  {Int} max - The minimum value in the range.
 * @return {Int} Int - The value represented in that range.
 */
Utils.prototype.normalize = function normalize(val, min, max) {
  return (val - min) / (max - min);
};

/**
 * lerp - linear interpolation takes a range and a given normalized value
 * and returns a value that represents that normalized value in that range.
 * @memberOf Utils
 * @param  {Interger} val
 * @param  {Interger} min
 * @param  {Interger} max
 * @return {Interger}
 */
Utils.prototype.lerp = function lerp(val, min, max) {
  return (max - min) * val + min;
};

Utils.prototype.map = function map(value, srcMin, srcMax, destMin, destMax) {
  srcMax = Math.max(srcMax, srcMin);
  srcMin = Math.min(srcMax, srcMin);
  destMin = Math.min(destMin, destMax);
  destMax = Math.max(destMin, destMax);
  return this.lerp(this.normalize(value, srcMin, srcMax), destMin, destMax);
};

/**
 * @name  precent
 * @description Takes a value and returns a precentage.
 *              you can pass arbitrary large numbers in but thats not
 *              the intended purpose of this function.
 * @param  {Float} val 	A value.
 * @memberOf Utils
 * @return {Percent}    A value.
 */
Utils.prototype.percent = function(val) {
  return val * 100;
};

/**
 * @name  clamp
 * @description Given a number and a range return the
 *              value between that range or the max number or min number.
 * @memberOf Utils
 * @param  {Number} value
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
Utils.prototype.clamp = function(value, min, max) {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

/**
 * @memberOf  Utils
 * @description Given two numbers return a random number between the two.
 * @name  randomRange
 * @param  {Integer} x
 * @param  {Integer} y
 * @return {Integer}
 */
Utils.prototype.randomBetween = function(x, y) {
  let min = Math.min(x, y);
  let max = Math.max(x, y);
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * @name  distanceXY
 * @description Given two coordinates return the distance between the two.
 * @memberOf Utils
 * @param  {Number} x0
 * @param  {Number} y0
 * @param  {Number} x1
 * @param  {Number} y1
 * @return {Number}
 */
Utils.prototype.distanceXY = function(x0, y0, x1, y1) {
  const dx = x0 - x1;
  const dy = y0 - y1;
  return Math.hypot(dx, dy);
};

/**
 * @name  distanceVec
 * @description Given two vectors return the distance between the two.
 * @memberOf Utils
 * @param  {Vector} v1
 * @param  {Vector} v2
 * @return {Number}
 */
Utils.prototype.distanceVec = function(v1, v2) {
  const dVec = (v1)["-"](v2);
  return Math.hypot(dVec.get("x"), dVec.get("y"));
};

/**
 * @name  inRange
 * @description given a number
 * @memberOf Utils
 * @param  {Number} val
 * @param  {Number} min
 * @param  {Number} max
 * @return {Boolean}
 */
Utils.prototype.inRange = function(val, min, max) {
  return (val <= Math.max(max, min)) && (Math.min(max, min) <= val);
};

/**
 * @name  rangeIntersect
 * @description Given a two ranges see if both intersect each other.
 * @memberOf Utils
 * @param  {Number} min0
 * @param  {Number} max0
 * @param  {Number} min1
 * @param  {Number} max1
 * @return {Boolean}
 */
Utils.prototype.rangeIntersect = function(min0, max0, min1, max1) {
  return (
    Math.max(max0, min0) >= Math.min(min1, max1) &&
    Math.min(min0, max0) <= Math.max(max1, min1)
  );
};

/**
 * @name  vectorIntersect
 * @description Given twos vectors see if they intersect.
 * @memberOf Utils
 * @param  {Vector} vec0
 * @param  {Vector} vec1
 * @return {Boolean}
 */
Utils.prototype.vectorIntersect = function(vec0, vec1) {
  const x0 = vec0.get("x");
  const y0 = vec0.get("y");
  const x1 = vec1.get("x");
  const y1 = vec1.get("y");
  return this.rangeIntersect(x0, y0, x1, y1);
};

/**
 * @name  collisionRect
 * @description Given two rectange see if the intersect.
 * @memberOf Utils
 * @param  {Particle} r0
 * @param  {Particle} r1
 * @return {Boolean}
 */
Utils.prototype.collisionRect = function(r0, r1) {
  const r0x = r0.state.x;
  const r0y = r0.state.y;
  const r1x = r1.state.x;
  const r1y = r1.state.y;

  const r0w = r0x + r0.state.width;
  const r0h = r0y + r0.state.height;
  const r1w = r1x + r1.state.width;
  const r1h = r1y + r1.state.height;

  return (
    this.rangeIntersect(r0x, r0w, r1x, r1w) &&
    this.rangeIntersect(r0y, r0h, r1y, r1h)
  );
};

/**
 * @name  collisionCircle
 * @description Given to particle with radi return wether they collide are not
 * @memberOf Utils
 * @param  {Particle} c1
 * @param  {Particle} c2
 * @return {Boolean}
 */
Utils.prototype.collisionCircle = function(c1, c2) {
  const radi = (c1.state.radius + c2.state.radius);
  const distance = this.distanceXY(c1.state.x, c1.state.y, c2.state.x, c2.state.y);

  if (distance) {
    return radi > distance;
  }
  return true;
};

/**
 * @name  circlePointCollision
 * @description Given a point and a circle return a boolean regarding wether they are colliding.
 * @memberOf Utils
 * @param  {Number}   x
 * @param  {Number}   y
 * @param  {Particle} circle
 * @return {Boolean}
 */
Utils.prototype.collisionCirclePoint = function(x, y, circle) {
  // TODO Write tests.
  const dist = this.distanceXY(
    x,
    y,
    circle.state.x,
    circle.state.y
  );
  return circle.state.radius > dist;
};

/**
 * @name  collisionCircleVec
 * @description detect a collision between circles a vector.
 * @memberOf Utils
 * @param  {Vector}   vec
 * @param  {Particle} circle
 * @return {Boolean}
 */
Utils.prototype.collisionCircleVec = function(vec, circle) {
  return circle.state.radius > this.distanceXY(
    vec.get("x"),
    vec.get("y"),
    circle.state.x,
    circle.state.y
  );
};

/**
 * @name  collisionRectPoint
 * @description detect collision of a rectangle and a point.
 * @memberOf Utils
 * @param  {Number}   x
 * @param  {Number}   y
 * @param  {Particle} rect
 * @return {Boolean}
 */
Utils.prototype.collisionRectPoint = function(x, y, rect) {
  const rectX = rect.state.x;
  const rectY = rect.state.y;
  return (
    this.inRange(x, rectX, rectX + rect.state.width) &&
    this.inRange(y, rectY, rectY + rect.state.height)
  );
};

/**
 * @name collisionRectVec
 * @description Given a vector and a retangle check wether they collided.
 * @memberOf Utils
 * @param  {Vector}   vec
 * @param  {Particle} rect
 * @return {Boolean}
 */
Utils.prototype.collisionRectVec = function(vec, rect) {
  return this.collisionRectPoint(vec.get("x"), vec.get("y"), rect);
};

/**
 * @name setLength
 * @description - Setting the length of a vector.
 * @param   {number} length
 * @param   {number} x
 * @param   {number} y
 * @return  {number[]} Coordinates
 */
Utils.prototype.setLength = function(length, x, y) {
  if (typeof x !== "number" ||
      typeof y !== "number" ||
      typeof length !== "number") {
    throw new Error("Please provide valid x and y values");
  }

  const angle = Math.atan2(y, x);
  x = Math.cos(angle) * length;
  y = Math.sin(angle) * length;

  return [x, y];
};

/**
 * @name setAngle
 * @description - Setting the angle of a vector.
 * @param   {number} angle
 * @param   {number} x
 * @param   {number} y
 * @return  {number[]} coordinates
 */
Utils.prototype.setAngle = function(angle, x, y) {
  if (typeof x !== "number" ||
      typeof y !== "number" ||
      typeof angle !== "number") {
    throw new Error("Please provide valid x and y values");
  }

  const length = Math.hypot(x, y);
  x = Math.cos(angle) * length;
  y = Math.sin(angle) * length;

  return [x, y];
};

module.exports = new Utils();
