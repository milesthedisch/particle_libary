"use strict";

/**
 * @class Shapes
 * @param {Object} ctx      Canvas context.
 * @param {Object} document The document object.
 */
function Shapes(ctx, document) {
  if (!ctx) {
    throw new Error("Shapes: Please provide a context argument [arg::1]");
  }
  this.ctx = ctx;
  this.document = document || window.document;
};

/**
 * @memberOf Shapes
 * @description draw a circle.
 * @param {Number} x     The x coordinate of the circle.
 * @param {Number} y     The y coordinate of the circle.
 * @param {Number} r     The radius of the circle.
 * @param {String} color The color of the circle.
 */
Shapes.prototype.circle = function drawCircle() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "#000000";

  this.ctx.fillStyle = color;
  this.ctx.beginPath();
  this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
  this.ctx.fill();
};

/**
 * @memberOf Shapes
 * @description Fill a rectangle
 * @param  {Number} x     Starting point X
 * @param  {Number} y     Starting point Y
 * @param  {Number} w     Width of the rectangle
 * @param  {Number} h     Height of the rectangle
 * @param  {String} color A hex string.
 */
Shapes.prototype.rect = function drawRect(x, y) {
  var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "#000000";

  this.ctx.fillStyle = color;
  this.ctx.fillRect(x, y, w, h);
};

/**
 * pCircle
 * @memberOf Shapes
 * @param  {Particle} p
 * @return {Particle}
 */
Shapes.prototype.pCircle = function particleCircle(p) {
  this.circle(p.state.x, p.state.y, p.state.radius, p.state.color);
  return p;
};

/**
 * pRect
 * @memberOf Shapes
 * @param  {Particle} p
 * @return {Particle}
 */
Shapes.prototype.pRect = function particleRect(p) {
  this.rect(p.state.x, p.state.y, p.state.width, p.state.height, p.state.color);
  return p;
};

/**
 * @memberOf Shapes
 * @description Draw a line between these two points.
 * @param  {Number} x0
 * @param  {Number} y0
 * @param  {Number} x1
 * @param  {Number} y1
 * @param  {string} style
 */
Shapes.prototype.drawLineXY = function (x0, y0, x1, y1) {
  var style = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "#000000";

  this.ctx.beginPath();
  this.ctx.strokeStyle = style;
  this.ctx.moveTo(x0, y0);
  this.ctx.lineTo(x1, y1);
  this.ctx.stroke();
};

/**
 * @memberOf Shapes
 * @param  {Vector} vec0
 * @param  {Vector} vec1
 * @return {Void}
 */
Shapes.prototype.drawLineVec = function (vec0, vec1) {
  this.drawLineXY(vec0.get("x"), vec0.get("y"), vec1.get("x"), vec1.get("y"));
  return void 0;
};

Shapes.prototype.drawLinePoints = function () {
  for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
    points[_key] = arguments[_key];
  }

  var firstPoint = points[0];


  if (!firstPoint) {
    throw new Error("Please provide valid inputs");
  }

  if (points.length < 1) {
    throw new Error("Must be given a a number of points greater than 1");
  }

  var sx = firstPoint.x,
      sy = firstPoint.y;

  this.ctx.beginPath();
  this.ctx.moveTo(sx, sy);

  // Some tricky destructing going on here.
  // I need some practice so... just testing it out.
  // The ...points bit is just a shallow copying array
  // but getting rid of the first argument.
  // The second bit is destructing the object that
  // it gets for each iteration and aliasing
  // the values to px and py.

  var xs = points.slice(1);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = xs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;
      var px = _ref.x;
      var py = _ref.y;

      this.ctx.lineTo(px, py);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  this.ctx.stroke();
};

/**
 * @memberOf Shapes
 * @param  {number} width
 * @param  {number} height
 * @param  {Number} gridSize
 * @param  {String} color
 */
Shapes.prototype.grid = function (width, height) {
  var gridSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
  var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "#ccc";

  this.ctx.beginPath();
  this.ctx.strokeStyle = color;

  for (var x = 0; x < width; x += gridSize) {
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, height);
  }

  for (var y = 0; y < height; y += gridSize) {
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(width, y);
  }

  this.ctx.stroke();
};

module.exports = Shapes;