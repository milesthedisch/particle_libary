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
const Utils = Object.create(null);

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
Utils.normalize = function normalize(val, min, max) {
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
Utils.lerp = function lerp(val, min, max) {
  return (max - min) * val + min;
};

/**
 * map - Given 2 set of values map them to another set.
 * @memberOf Utils
 * @param  {number} value
 * @param  {number} srcMin
 * @param  {number} srcMax
 * @param  {number} destMin
 * @param  {number} destMax
 * @return {number}
 */
Utils.map = function map(value, srcMin, srcMax, destMin, destMax) {
  srcMax = Math.max(srcMax, srcMin);
  srcMin = Math.min(srcMax, srcMin);
  destMin = Math.min(destMin, destMax);
  destMax = Math.max(destMin, destMax);
  return this.lerp(this.normalize(value, srcMin, srcMax), destMin, destMax);
};

/**
 * @description Takes a value and returns a precentage.
 *              you can pass arbitrary large numbers in but thats not
 *              the intended purpose of this function.
 * @param  {Float} val 	A value.
 * @memberOf Utils
 * @return {Percent}    A value.
 */
Utils.percent = function(val) {
  return val * 100;
};

/**
 * @description Given a number and a range return the
 *              value between that range or the max number or min number.
 * @memberOf Utils
 * @param  {Number} value
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
Utils.clamp = function(value, min, max) {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

/**
 * @memberOf  Utils
 * @description Given two numbers return a random number between the two.
 * @param  {Integer} x
 * @param  {Integer} y
 * @return {Integer}
 */
Utils.randomBetween = function(x, y) {
  let min = Math.min(x, y);
  let max = Math.max(x, y);
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * @description Given two coordinates return the distance between the two.
 * @memberOf Utils
 * @param  {Number} x0
 * @param  {Number} y0
 * @param  {Number} x1
 * @param  {Number} y1
 * @return {Number}
 */
Utils.distanceXY = function(x0, y0, x1, y1) {
  const dx = x0 - x1;
  const dy = y0 - y1;
  return Math.hypot(dx, dy);
};

/**
 * @description Given two vectors return the distance between the two.
 * @memberOf Utils
 * @param  {Vector} v1
 * @param  {Vector} v2
 * @return {Number}
 */
Utils.distanceVec = function(v1, v2) {
  const dVec = (v1)["-"](v2);
  return Math.hypot(dVec.get("x"), dVec.get("y"));
};

/**
 * @description given a number
 * @memberOf Utils
 * @param  {Number} val
 * @param  {Number} min
 * @param  {Number} max
 * @return {Boolean}
 */
Utils.inRange = function(val, min, max) {
  return (val <= Math.max(max, min)) && (Math.min(max, min) <= val);
};

/**
 * @description Given a two ranges see if both intersect each other.
 * @memberOf Utils
 * @param  {Number} min0
 * @param  {Number} max0
 * @param  {Number} min1
 * @param  {Number} max1
 * @return {Boolean}
 */
Utils.rangeIntersect = function(min0, max0, min1, max1) {
  return (
    Math.max(max0, min0) >= Math.min(min1, max1) &&
    Math.min(min0, max0) <= Math.max(max1, min1)
  );
};

/**
 * @description Given twos vectors see if they intersect.
 * @memberOf Utils
 * @param  {Vector} vec0
 * @param  {Vector} vec1
 * @return {Boolean}
 */
Utils.vectorIntersect = function(vec0, vec1) {
  const x0 = vec0.get("x");
  const y0 = vec0.get("y");
  const x1 = vec1.get("x");
  const y1 = vec1.get("y");
  return this.rangeIntersect(x0, y0, x1, y1);
};

/**
 * @description Given two rectange see if the intersect.
 * @memberOf Utils
 * @param  {Particle} r0
 * @param  {Particle} r1
 * @return {Boolean}
 */
Utils.collisionRect = function(r0, r1) {
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
 * @description Given to particle with radi return wether they collide are not
 * @memberOf Utils
 * @param  {Particle} c1
 * @param  {Particle} c2
 * @return {Boolean}
 */
Utils.collisionCircle = function(c1, c2) {
  const radi = (c1.state.radius + c2.state.radius);
  const distance = this.distanceXY(c1.state.x, c1.state.y, c2.state.x, c2.state.y);

  if (distance) {
    return radi > distance;
  }
  return true;
};

/**
 * @description Given a point and a circle return a boolean regarding wether they are colliding.
 * @memberOf Utils
 * @param  {Number}   x
 * @param  {Number}   y
 * @param  {Particle} circle
 * @return {Boolean}
 */
Utils.collisionCirclePoint = function(x, y, circle) {
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
 * @description detect a collision between circles a vector.
 * @memberOf Utils
 * @param  {Vector}   vec
 * @param  {Particle} circle
 * @return {Boolean}
 */
Utils.collisionCircleVec = function(vec, circle) {
  return circle.state.radius > this.distanceXY(
    vec.get("x"),
    vec.get("y"),
    circle.state.x,
    circle.state.y
  );
};

/**
 * @description detect collision of a rectangle and a point.
 * @memberOf Utils
 * @param  {Number}   x
 * @param  {Number}   y
 * @param  {Particle} rect
 * @return {Boolean}
 */
Utils.collisionRectPoint = function(x, y, rect) {
  const rectX = rect.state.x;
  const rectY = rect.state.y;
  return (
    this.inRange(x, rectX, rectX + rect.state.width) &&
    this.inRange(y, rectY, rectY + rect.state.height)
  );
};

/**
 * @description Given a vector and a retangle check wether they collided.
 * @memberOf Utils
 * @param  {Vector}   vec
 * @param  {Particle} rect
 * @return {Boolean}
 */
Utils.collisionRectVec = function(vec, rect) {
  return this.collisionRectPoint(vec.get("x"), vec.get("y"), rect);
};

/**
 * @memberOf Utils
 * @description Run a function only if the given time to allow the function execute
 * has passed. If
 * @param  {Function} func A function to call every delta.
 * @param  {Number} wait The minimum time to wait.
 * @param  {Object} options
 * @return {Function}
 * @see underscore
 */
Utils.throttle = function throttle(func, wait, options) {
  let context;
  let args;
  let result;
  let timeout = null;
  let previous = 0;
  if (!options) options = {};
  const later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function(...args) {
    let now = Date.now();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = args;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

/**
 * @memberOf Utils
 * @description - Setting the length of a vector.
 * @param   {number} length
 * @param   {number} x
 * @param   {number} y
 * @return  {number[]} Coordinates
 */
Utils.setLength = function(length, x, y) {
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
 * @memberOf Utils
 * @description - Setting the angle of a vector.
 * @param   {number} angle
 * @param   {number} x
 * @param   {number} y
 * @return  {number[]} coordinates
 */
Utils.setAngle = function(angle, x, y) {
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

/**
 * @memberOf Utils
 * @description Coverts degrees to radians
 * @param  {number} deg Degress
 * @return {number}
 */
Utils.degToRad = function(deg) {
  return deg / 180 * Math.PI;
};

/**
 * @memberOf Utils
 * @description Coverts radians to degress
 * @param  {number} rad
 * @return {number}
 */
Utils.radToDeg = function(rad) {
  return rad * 180 / Math.PI;
};

/**
 * @memberOf Utils
 * @description Round to nearest place given.
 * @param  {number} val
 * @param  {number} places An exponent
 * @return {number}
 */
Utils.roundToPlaces = function(val, places) {
  const mult = Math.pow(10, places);
  return Math.round(val * mult) / mult;
};

/**
 * @memberOf Utils
 * @param  {number} val
 * @param  {number} nearest
 * @return {number}
 */
Utils.roundToMultiple = function(val, nearest) {
  if (!nearest) {
    throw new Error("Nothing can be a multiple of " + String(nearest));
  }
  return Math.round(val / nearest) * nearest;
};

/**
 * @memberOf Utils
 * @param  {number} v0
 * @param  {number} v1
 * @param  {number} v2
 * @param  {number} t
 * @param  {number} pFinal
 * @return {number}
 */
Utils.quadraticBezier = function(v0, v1, v2, t) {
  return Math.pow(1 - t, 2) * v0 + (1 - t) * 2 * t * v1 + t * t * v2;
};

/**
 * @memberOf Utils
 * @param  {number} v0
 * @param  {number} v1
 * @param  {number} v2
 * @param  {number} v3
 * @param  {number} t
 * @param  {number} pFinal
 * @return {number}
 */
Utils.cubicBezier = function(v0, v1, v2, v3, t) {
  return Math.pow(1 - t, 3) * v0 +
         Math.pow(1 - t, 2) * 3 * t * v1 +
         (1 - t) * 3 * t * t * v2 +
         t * t * t + v3;
};

/**
 * @memberOf Utils
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @param  {Object} pFinal
 * @return {number}
 */
Utils.quadraticBezierPoint = function(p0, p1, p2, t) {
  const x = this.quadraticBezier(p0.x, p1.x, p2.x, t);
  const y = this.quadraticBezier(p0.y, p1.y, p2.y, t);
  return {x, y};
};

/**
 * @memberOf Utils
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @param  {Object} pFinal
 * @return {number}
 */
Utils.cubicBezierPoint = function(p0, p1, p2, p3, t) {
  x = this.cubicBezier(p0.x, p1.x, p2.x, t);
  y = this.cubicBezier(p0.y, p1.y, p2.y, t);
  return {x, y};
};

/**
 * @memberOf Utils
 * @description Given points on the plane draw a curved line between
 * all of them.
 * @param  {{number, number}} points
 * @param  {CanvasRenderingContext2D} ctx
 */
Utils.multiCurve = function(points, ctx) {
  let p0;
  let p1;
  let midX;
  let midY;

  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 2; i++) {
    p0 = points[i];
    p1 = points[i + 1];
    midX = (p0.x + p1.x)/2;
    midY = (p0.y + p1.y)/2;
    ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
  }

  p0 = points[points.length - 2];
  p1 = points[points.length - 1];
  ctx.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
};

/**
 * ease
 * @memberOf Utils
 * @param  {Float} ease [description]
 * @param  {Int} a    [description]
 * @param  {Int} b    [description]
 * @return {[type]}      [description]
 */
Utils.ease = function(ease, a, b) {
  // the delta can get extremely small and its not performant to keep
  // on rendering or calculating for animation purposes.
  if (Math.abs(b - a) < 0.1) {
    return false;
  }

  return (b - a) * ease;
};

Utils.easeTo = function(ease, origin, target, threshold=0.1) {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;

  // the delta can get extremely small and its not performant to keep
  // on rendering or calculating for animation purposes.
  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
    return false;
  }

  origin.x += dx * ease;
  origin.y += dy * ease;

  return origin;
};

module.exports = Object.create(Utils);
