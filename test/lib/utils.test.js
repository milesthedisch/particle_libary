/* eslint max-len: 0 */
const utils = require("../../src/lib/utils");
const Vector = require("../../src/lib/vectors");
const Particle = require("../../src/lib/particle");
const testUtils = require("../utils");
const assert = require("chai").assert;

describe("#Util", function() {
  let util;
  let vector;

  beforeEach(function() {
    util = utils;
    vector = new Vector();
  });

  describe("#normalize", function() {
    it("should return 1 when the max value is the same as the value", function() {
      assert.equal(utils.normalize(10, 0, 10), 1);
    });

    it("should return 2 when give double the value of max.", function() {
      assert.equal(utils.normalize(20, 0, 10), 2);
    });

    it("should return 0.5 when given half between the min and max", function() {
      assert.equal(utils.normalize(7.5, 5, 10), 0.5);
    });
  });

  describe("#lerp", function() {
    it("should return 1 when the max value is the same as the value", function() {
      assert.equal(utils.lerp(0.1, 0, 10), 1);
    });

    it("should return 2 when give double the value of max.", function() {
      assert.equal(utils.lerp(2, 0, 10), 20);
    });

    it("should return 0.5 when given half between the min and max", function() {
      assert.equal(utils.lerp(0.5, 5, 10), 7.5);
    });
  });

  describe("#map", function() {
    it("should return the lowest destination value when given the lowest source value as the first param", function() {
      const highestSource = 100;
      const highestDestination = 1000;
      const lowestSource = 0;
      const lowestDestination = 1;

      assert.equal(1, utils.map(0, lowestSource, highestSource, lowestDestination, highestDestination));
    });

    it("should return the highest destination value when given the highest source value as the first param", function() {
      const highestSource = 100;
      const highestDestination = 1000;
      const lowestSource = 0;
      const lowestDestination = 1;

      assert.equal(1000, utils.map(100, lowestSource, highestSource, lowestDestination, highestDestination));
    });

    it("should return a value * 0.5 or half if the first param given is half the value of the highest source value", function() {
      const highestSource = 100;
      const highestDestination = 1000;
      const lowestSource = 0;
      const lowestDestination = 0;

      assert.equal(highestDestination * 0.5, utils.map(highestSource * 0.5, lowestSource, highestSource, lowestDestination, highestDestination));
    });
  });

  describe("#clamp", function() {
    it("should return the value if the value lie in the range", function() {
      assert.equal(utils.clamp(1, 0, 10), 1);
    });

    it("should return the min if the value lies below the range", function() {
      assert.equal(utils.clamp(-10, 0, 10), 0);
    });

    it("should return the max if the value lies above the range", function() {
      assert.equal(utils.clamp(20, 0, 5), 5);
    });
  });

  describe("#percent", function() {
    it("should take a decimal number and multiply it by 100", function() {
      assert.equal(utils.percent(0.5), 50);
    });

    it("should return zero when given zero", function() {
      assert.equal(utils.percent(0), 0);
    });
  });

  describe("#inRange", function() {
    it("should return true if the number is in the range", function() {
      assert.ok(utils.inRange(1, 0, 1));
    });

    it("should return true if the range is negative", function() {
      assert.ok(utils.inRange(0, -10, 10));
    });

    it("should return false if the value is not in the range", function() {
      assert.ok(!utils.inRange(1, 2, 10));
    });
  });

  describe("#rangeIntersect", function() {
    it("should return true if two ranges intersect each other", function() {
      assert.ok(utils.rangeIntersect(0, 6, 5, 10));
    });

    it("should return false if the ranges do not intersect", function() {
      assert.ok(!utils.rangeIntersect(0, 10, 20, 30));
    });

    it("should return correct intersection given negative numbers", function() {
      assert.ok(utils.rangeIntersect(-10, -5, -5, -1));
    });

    it("should return false given no values", function() {
      assert.ok(!utils.rangeIntersect());
    });
  });

  describe("#vectorIntersect", function() {
    it("should return true when the two vectors are intersecting", function() {
      const vec0 = vector.create(1, 10);
      const vec1 = vector.create(3, 6);
      assert.ok(Vector.vectorIntersect(vec0, vec1));
    });

    it("should return false when the two vectors are not intersecting", function() {
      const vec0 = vector.create(1, 10);
      const vec1 = vector.create(-10, 0);
      assert.ok(!Vector.vectorIntersect(vec0, vec1));
    });

    it("should return false when the two vectors are not intersecting", function() {
      const vec0 = vector.create(-1, 10);
      const vec1 = vector.create(-10, 0);
      assert.ok(Vector.vectorIntersect(vec0, vec1));
    });

    it("should return false when given no values", function() {
      try {
        utils.vectorIntersect();
      } catch(e) {
        assert.ok(e);
      }
    });
  });

  describe("#distanceXY", function() {
    it("should return the distance between to particles", function() {
      assert.equal(utils.distanceXY(0, 0, 0, 1), 1);
    });

    it("should return the distance between two diagonal points", function() {
      assert.equal(utils.distanceXY(0, 0, 1, 1), Math.sqrt(2));
    });
  });

  describe("#collisionCirlce", function() {
    it("should return true when the circles radi are greater than the distance", function() {
      const particle1 = new Particle({radius: 10, x: 0, y: 19.9});
      const particle2 = new Particle({radius: 10, x: 0, y: 0});
      assert.ok(utils.collisionCircle(particle1, particle2));
    });

    it("should return false when the circles radi are less than the distance", function() {
      const particle1 = new Particle({radius: 10, x: 0, y: 20});
      const particle2 = new Particle({radius: 10, x: 0, y: 0});
      assert.ok(!utils.collisionCircle(particle1, particle2));
    });

    it("should return true when the circles are in the same spot", function() {
      const particle1 = new Particle({radius: 10, x: 0, y: 0});
      const particle2 = new Particle({radius: 10, x: 0, y: 0});
      assert.ok(utils.collisionCircle(particle1, particle2));
    });
  });

  describe("#collisionCirclePoint", function() {
    it("should return false when the distance is greater than the circles radius", function() {
      const p = new Particle({radius: 5, x: 0, y: 0});
      assert.ok(!utils.collisionCirclePoint(5, 0, p));
    });

    it("should return true when the distance is less than the radius", function() {
      const p = new Particle({radius: 10, x: 0, y: 0});
      assert.ok(utils.collisionCirclePoint(4.9, 0, p));
    });
  });

  describe("#collisionRectPoint", function() {
    it("should return true when given a point inside the rect", function() {
      const rect = new Particle({x: 0, y: 0, width: 10, height: 10});
      assert.ok(utils.collisionRectPoint(5, 5, rect));
    });

    it("should return false when given a point outside the rect", function() {
      const rect = new Particle({x: 0, y: 0, width: 10, height: 10});
      const point = vector.create(-1, -1);
      assert.ok(!utils.collisionRectPoint(point.get("x"), point.get("y"), rect));
    });
  });

  describe("#collisionRectVec", function() {
    it("should return true when given a point inside the rect", function() {
      const rect = new Particle({x: 0, y: 0, width: 10, height: 10});
      const point = vector.create(5, 5);
      assert.ok(utils.collisionRectVec(point, rect));
    });

    it("should return false when given a point outside the rect", function() {
      const rect = new Particle({x: 0, y: 0, width: 10, height: 10});
      const point = vector.create(-1, -1);
      assert.ok(!utils.collisionRectVec(point, rect));
    });
  });

  describe("#collisionRect", function() {
    it("should return true when to rectanges are in range of each other", function() {
      const rect1 = new Particle({x: 0, y: 0, width: 10, height: 10});
      const rect2 = new Particle({x: 10, y: 10, width: 10, height: 10});
      const rect3 = new Particle({x: 5, y: 5, width: 10, height: 10});
      assert.ok(utils.collisionRect(rect1, rect2));
      assert.ok(utils.collisionRect(rect1, rect3));
    });

    it("should return false when given rectangles that arent in the same region. ", function() {
      const rect1 = new Particle({x: 0, y: 0, width: 10, height: 10});
      const rect2 = new Particle({x: 11, y: 11, width: 10, height: 10});
      const rect3 = new Particle({x: -11, y: -11, width: 10, height: 10});
      assert.ok(!utils.collisionRect(rect1, rect2));
      assert.ok(!utils.collisionRect(rect1, rect3));
    });
  });

  describe("#randomRange", function() {
    it("should return a value in between the given range", function() {
      let max = 10000;
      let min = 0;
      for (let i = min; i <= max; i++) {
        let actualVal = utils.randomBetween(min, max);
        assert.ok((min <= actualVal) && (actualVal <= max), `${actualVal} is not in range of ${min} and ${max}`);
      }
    });
    it("should return a value in between the given range when one number is negative", function() {
      let max = 1000;
      let min = -1000;
      for (let i = min; i <= max; i++) {
        let actualVal = utils.randomBetween(min, max);
        assert.ok((min <= actualVal) && (actualVal <= max), `${actualVal} is not in range of ${min} and ${max}`);
      }
    });
  });

  describe("#setLength", function() {
    it("should set the y to 1 if x and y are 0 and length is 1", function() {
      const [x, y] = utils.setLength(1, 0, 0);
      assert.equal(x, 1);
      assert.equal(y, 0);
    });

    it("should should set x and y to zero give a length of zero", function() {
      const [x, y] = utils.setLength(0, 0, 0);
      assert.equal(x, 0);
      assert.equal(y, 0);
    });

    it("should given non number inputs throw an error", function() {
      const fn = utils.setLength.bind(null, "", null, undefined);
      assert.throws(fn, Error, "provide valid");
    });
  });

  describe("#setAngle", function() {
    it("should set the y to 1 if x and y are 0 and length is 1", function() {
      const [x, y] = utils.setAngle(Math.PI, 0, 0);
      assert.equal(x, -0);
      assert.equal(y, 0);
    });

    it("should should set x and y to zero give a length of zero", function() {
      const [x, y] = utils.setAngle(Math.PI * 2, 0, 0);
      assert.equal(x, 0);
      assert.equal(y, 0);
    });

    it("should given non number inputs throw an error", function() {
      const fn = utils.setLength.bind(null, "", null, undefined);
      assert.throws(fn, Error, "provide valid");
    });
  });

  describe("#roundToPlaces", function() {
    it("should round PI to the nearest tenth given an exponent of 1", function() {
      assert.equal(3.1, utils.roundToPlaces(Math.PI, 1));
    });

    it("should round PI to the nearest hunderth given an exponent of 2", function() {
      assert.equal(3.14, utils.roundToPlaces(Math.PI, 2));
    });

    it("should round PI to the nearest integer given an exponent of 0", function() {
      assert.equal(3, utils.roundToPlaces(Math.PI, 0));
    });

    it("should round PI to the nearest hundred given an exponent of -1", function() {
      assert.equal(0, utils.roundToPlaces(Math.PI, -1));
    });

    it("should round PI * 1000 to the nearest hundred given an exponent of -2", function() {
      assert.equal(3100, utils.roundToPlaces(Math.PI * 1000, -2));
    });
  });

  describe("#roundToMultiple", function() {
    it("should round PI to the nearest multiple of 2", function() {
      assert.equal(4, utils.roundToMultiple(Math.PI, 2));
    });

    it("should round PI to the nearest multiple of 3", function() {
      assert.equal(3, utils.roundToMultiple(Math.PI, 3));
    });

    it("should round PI to the nearest multiple of 0", function() {
      const fn = utils.roundToMultiple.bind(null, Math.PI, 0);
      assert.throws(fn, Error, "Nothing can be a multiple");
    });

    it("should round PI to the nearest multiple of -1", function() {
      assert.equal(3, utils.roundToMultiple(Math.PI, -1));
    });

    it("should round PI to the nearest multiple of -2", function() {
      assert.equal(4, utils.roundToMultiple(Math.PI, -2));
    });
  });

  describe("#bezier", function() {
    describe("#quadraticBezier", function() {
      it("should return number that are in range of the the three value given", function() {
        for (let i = 0; i < 1; i += 0.01) {
          assert(utils.quadraticBezier(1, 2, 3, i) >= 1 && utils.quadraticBezier(1, 2, 3, i) <= 3);
        }
      });
    });

    describe("#cubicBezier", function() {
      it("should return number that are in range of the the three value given", function() {
        for (let i = 0; i < 1; i += 0.01) {
          assert(utils.cubicBezier(1, 2, 3, 1, i) >= 2 && utils.cubicBezier(1, 2, 3, 1, i) <= 3.2);
        }
      });
    });

    describe("#quadraticBezierPoint", function() {
      it("Given some points and the last argument as one, the test should return the exact values of the last point", function() {
        const points = [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 1}];
        assert.deepEqual(utils.quadraticBezierPoint(...points, 1), {x: 3, y: 1});
      });

      it("Given some points and the last argument as one, the test should return the exact values of the first point", function() {
        const points = [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 1}];
        assert.deepEqual(utils.quadraticBezierPoint(...points, 0), {x: 1, y: 1});
      });
    });

    describe("#quadraticBezierPoint", function() {
      it("Given some points and the last argument as one, the test should return the exact values of the last point", function() {
        const points = [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 1}];
        assert.deepEqual(utils.quadraticBezierPoint(...points, 1), {x: 3, y: 1});
      });

      it("Given some points and the last argument as one, the test should return the exact values of the first point", function() {
        const points = [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 1}];
        assert.deepEqual(utils.quadraticBezierPoint(...points, 0), {x: 1, y: 1});
      });
    });
  });

  describe("#easeing/tweening", function() {
    describe("#ease", function() {
      it("should return false if the range between the number is below 0.1", function() {
        const a = 1;
        const b = 1;
        assert(utils.ease(0.5, a, b) === false);
      });

      it("should return a value that is half of the range given a ease value of 0.5", function() {
        const a = 0;
        const b = 2;
        assert.equal(utils.ease(0.5, a, b), 1);
      });
    });

    describe("#easeTo", function() {
      it("should return false if the distance between the points is below 0.1", function() {
        const a = {x: 1, y: 1};
        const b = {x: 1, y: 1};
        assert(utils.easeTo(0.5, a, b) === false);
      });

      it("should return a value that is half of the distance given a ease value of 0.5", function() {
        const a = {x: 0, y: 0};
        const b = {x: 1, y: 1};
        const distance = {x: b.x - a.x, y: b.y - a.y};
        const halfOfDistance = {x: distance.x * 0.5, y: distance.y * 0.5};

        assert.deepEqual(utils.easeTo(0.5, a, b), halfOfDistance);
      });
    });

    describe("#isObject", function() {
      it("should return false for all falsy things", function() {
        testUtils.forEachFalsy(function(falsy) {
          assert.isFalse(utils.isObject(falsy));
        });
      });

      it("should return true object like things", function() {
        [{}, Object.create({}), Object.create(null), new Object()].map((obj) => { // eslint-disable-line
          assert.isTrue(utils.isObject(obj));
        });
      });

      it("should return false for no object things", function() {
        [
          new String(),
          new Number(),
          new Function(),
          new Date(),
          [],
          new Error(),
          Object.__proto__,
          NaN.__proto__,
          NaN.prototype,
        ].map((obj) => {
          assert.isFalse(utils.isObject(obj));
        });
      });
    });

    describe("#unique", function() {
      it("should return values that in an array that are not dupliactes", function() {
        const sample = [1, 2, 3, 4, 5, 5, 5, 5, 5, 6, 6, 7, 7, 8, 8, 8, 9, 10, 10];
        assert.equal(utils.unique(sample).length, 10);
        assert.equal(utils.unique(sample).reduce((x, y) => x+y), 55);
      });
    });

    describe("#radToDeg", function () {
      it("should return 180 degs for PI", function () {
        assert.equal(utils.radToDeg(Math.PI), 180);
      });

      it("should return 360 deg for PI * 2 radians", function() {
        assert.equal(utils.radToDeg(Math.PI * 2), 360);
      });

      it("should return 0 deg for 0 radians", function () {
        assert.equal(utils.radToDeg(0), 0);
      });
    });

    describe("#degToRad", function () {
      it("should return PI radians for 180 deg", function () {
        assert.equal(utils.degToRad(180), Math.PI);
      });

      it("should return PI * 2 radians for 360 deg", function() {
        assert.equal(utils.degToRad(360), Math.PI * 2);
      });

      it("should return 0 radians for 0 deg", function () {
        assert.equal(utils.degToRad(0), 0);
      });
    });
  });
});
