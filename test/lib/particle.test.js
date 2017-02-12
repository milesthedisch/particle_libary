/* eslint max-len: 0*/
const extend = require("extend");
const assert = require("chai").assert;
const util = require("util");
const clone = require("lodash/cloneDeep");

const Particle = require("../../src/lib/particle.js");
const Vector = require("../../src/lib/vectors.js");
const utils = require("../../src/lib/utils.js");

const vector = new Vector();

describe("#Particle", function() {
  let defaultParticleState;
  let createdParticleState;

  beforeEach(function() {
    defaultParticleState = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      gravity: 0,
      magnitude: 0,
      radius: 0,
      mass: 1,
      direction: Math.PI * 2,
      friction: 1,
    };

    createdParticleState = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      gravity: 0,
      magnitude: 0,
      radius: 0,
      mass: 1,
      direction: Math.PI * 2,
      friction: 1,
    };
  });

  it("should create a new particle with given state", function() {
    const p = new Particle({});
    assert.deepEqual(p.state, {});
  });

  it("should create a new particle with default state", function() {
    const p = new Particle();
    assert.deepEqual(p.state, defaultParticleState);
  });

  describe("#create", function() {
    it("should return a default particle state", function() {
      const p = new Particle();
      const p1 = p.create();
      assert.deepEqual(p1.state, createdParticleState);
    });

    it("should return extend particle state that has been passed in", function() { // eslint-disable-line
      const p = new Particle();

      const p1 = p.create({
        x: 1,
        y: 1,
        vx: 1,
        vy: 1,
        gravity: 1,
        radius: 1,
      });

      assert.deepEqual(p1.state, extend(defaultParticleState, {
        x: 1,
        y: 1,
        vx: 1,
        vy: 1,
        gravity: 1,
        radius: 1,
      }));
    });
  });

  describe("#accelerate", function() {
    it("should increase the velocity of a particle", function() {
      const particle = new Particle();
      const p1 = particle.create();
      p1.accelerate(1, 1);
      assert.equal(p1.state.vx, 1);
      assert.equal(p1.state.vy, 1);
    });

    it("should decrease the velocity of a particle", function() {
      const particle = new Particle();
      const p1 = particle.create();
      p1.accelerate(-1, -1);
      assert.equal(p1.state.vx, -1);
      assert.equal(p1.state.vy, -1);
    });
  });

  describe("#update", function() {
    it("should change the velocity with the given gravity", function() {
      const particle = new Particle();
      const p1 = particle.create({
        gravity: 1,
      });

      p1.update();
      assert.equal(p1.state.gravity, 1);
      assert.equal(p1.state.vx, 0);
      assert.equal(p1.state.vy, 1);
      assert.equal(p1.state.x, 0);
      assert.equal(p1.state.y, 1);

      p1.update();
      assert.equal(p1.state.gravity, 1);
      assert.equal(p1.state.vx, 0);
      assert.equal(p1.state.vy, 2);
      assert.equal(p1.state.x, 0);
      assert.equal(p1.state.y, 3);
    });

    it("should not change given no gravity", function() {
      const particle = new Particle();
      const p1 = particle.create();
      p1.update();
      assert.equal(p1.state.gravity, 0);
      assert.equal(p1.state.vx, 0);
      assert.equal(p1.state.vy, 0);
      assert.equal(p1.state.x, 0);
      assert.equal(p1.state.y, 0);
    });

    it("should change given friction and some velocity", function() {
      const particle = new Particle();
      const p1 = particle.create({
        vx: 2,
        vy: 2,
        friction: 0.95,
      });
      p1.update();
      assert.equal(p1.state.vx, 1.9);
      assert.equal(p1.state.vy, 1.9);
      assert.equal(p1.state.x, 1.9);
      assert.equal(p1.state.y, 1.9);
    });
  });

  describe("#angleTo", function() {
    let particle;
    let vector;
    let p1;
    let p2;

    beforeEach(function() {
      particle = new Particle();
      vector = new Vector();
      p1 = particle.create();
      p2 = particle.create();
    });

    afterEach(function() {
      particle = undefined;
      vector = undefined;
      p1 = undefined;
      p2 = undefined;
    });

    it("should return 0 given two coordinates that are in the same position", function() {
      p1.state.x = 0;
      p1.state.y = 0;
      p2.state.x = 0;
      p2.state.y = 0;
      assert.equal(p1.angleTo(p2), 0);
    });

    it("should return 45 degrees in radians when the triangle is a isoleces.", function() {
      p1.state.x = 0;
      p1.state.y = 0;
      p2.state.x = 1;
      p2.state.y = 1;

      // Convert to degrees.
      const degrees = p1.angleTo(p2) * 180 / Math.PI;
      assert.equal(degrees, 45);
    });

    it("should return -90 degrees given a point slightly above it", function() {
      p1.state.x = 0;
      p1.state.y = 0;
      p2.state.x = 0;
      p2.state.y = -1;

      const degrees = p1.angleTo(p2) * 180 / Math.PI;
      assert.equal(degrees, -90);
    });

    it("should return -135 degrees given a point opposite 45 degrees", function() {
      p1.state.x = 0;
      p1.state.y = 0;
      p2.state.x = -1;
      p2.state.y = -1;

      const degrees = p1.angleTo(p2) * 180 / Math.PI;
      assert.equal(degrees, -135);
    });
  });

  describe("#distanceTo", function() {
    it("should give the distance between two particles.", function() {
      const vector = new Vector();
      const particle = new Particle();

      const p1 = particle.create();
      const p2 = particle.create();

      p1.state.x = 2;
      p1.state.y = 2;
      p2.state.x = -1;
      p2.state.y = -1;
      assert.equal(p1.distanceTo(p2), Math.hypot(2, 2));
    });
  });

  describe.only("#gravitateTo", function() {
    it("should gravitate towards the heavier mass", function() {
      const p = new Particle();

      const p1 = p.create({mass: 100, x: 1000, y: 1000});
      const p2 = p.create({mass: 100, x: 1000, y: 100});

      p2.gravitateTo(p1);
      p2.update();

      assert.isAbove(p2.state.y, 100);
    });

    it("should stand still if the mass of the object that its gravitating to is 0", function() {
      const p = new Particle();

      const p1 = p.create({mass: 0, x: 1000, y: 1000});
      const p2 = p.create({mass: 100, x: 1000, y: 100});

      p2.gravitateTo(p1);
      p2.update();

      assert.equal(p2.state.y, 100);
      assert.equal(p2.state.x, 1000);
    });
  });

  describe("#generator", function() {
    it("should generate default particles", function() {
      const p = new Particle();
      const particles = p.generator(1);

      // When we create a particle the velocity gets setLength and setAngle called. And because the
      // particles are a 0, 0 to start with and the magnitude is 1 its the velocity vector gets set
      // to 0, -0
      extend(true, defaultParticleState, {
        velocity: vector.create(0, -0),
      });

      assert.equal(particles.length, 1);
      assert.deepEqual(particles[0].state, defaultParticleState);
    });

    it("should generate multiple particles", function() {
      const p = new Particle();
      const particles = p.generator(2);

      // When we create a particle the velocity gets setLength and setAngle called. And because the
      // particles are a 0, 0 to start with and the magnitude is 1 its the velocity vector gets set
      // to 0, -0
      extend(true, defaultParticleState, {
        velocity: vector.create(0, -0),
      });

      assert.equal(particles.length, 2);
      assert.deepEqual(particles[0].state, defaultParticleState, "particle 1: ");
      assert.deepEqual(particles[1].state, defaultParticleState, "particle 2: ");
    });

    it("should use opts passed in to each particle and extended.", function() {
      const p = new Particle();
      const particles = p.generator(2, {a: 1});

      extend(true, defaultParticleState, {
        a: 1,
        velocity: vector.create(0, -0),
      });

      assert.equal(particles.length, 2);
      assert.deepEqual(particles[0].state, defaultParticleState);
      assert.deepEqual(particles[1].state, defaultParticleState);
    });

    it("should use callback if the third arguments is defined as a fn.", function() {
      const p = new Particle();
      const particles = p.generator(2, {a: 1}, function(_p) {
        _p.set("a", _p.get("a") + 1);
        return _p;
      });

      extend(true, defaultParticleState, {
        a: 2,
        velocity: vector.create(0, -0),
      });

      assert.equal(particles.length, 2);
      assert.deepEqual(particles[0].state, defaultParticleState);
      assert.deepEqual(particles[1].state, defaultParticleState);
    });
  });

  describe("#springs", function() {
    describe("#springFromTo", function() {
      it("it should fail if not given a particle as the first argument", function() {
        const particle = new Particle();
        try {
          particle.springFromTo(undefined);
        } catch (e) {
          assert.equal(e.message, "Cannot read property \'get\' of undefined");
        };
      });

      it("it should move the springed particle closer to its attracting point", function() {
        const particle = new Particle();
        const p1 = particle.create({
          position: vector.create(100, 100),
        });
        const p2 = particle.create({
          position: vector.create(100, 400),
        });
        p1.springFromTo(p2);
        assert.equal(p1.get("velocity").get("y"), -10);
        assert.equal(p2.get("velocity").get("y"), 10);
      });
    });

    describe("#springPoint", function() {
      it("should return an error if not given a point.", function() {
        const particle = new Particle();
        const p1 = particle.create({
          position: vector.create(100, 100),
        });

        try {
          p1.springToPoint(undefined);
        } catch (e) {
          assert.ok(e.message);
        }
      });
      it("should move the springed particle scloser to its attracting point", function() {
        const particle = new Particle();
        const p1 = particle.create({
          position: vector.create(100, 100),
        });
        const point = vector.create(100, 400);

        p1.springToPoint(point, 100, 0.9);
        assert.equal(p1.get("velocity").get("y"), 180);
        p1.springToPoint(point, 100, 0.9);
        assert.equal(p1.get("velocity").get("y"), 360);
      });
    });
  });

  describe("#speed", function() {
    it("should add the vector to the position", function() {
      const particle = new Particle();
      const vector = new Vector();

      const p = particle.create();
      const vec = vector.create(1, 1);
      p.speed(vec);
      assert.deepEqual(p.get("position"), vector.create(1, 1));
    });

    it("should add the internal velocity vector to the position", function() {
      const vec = new Vector();

      const p = new Particle({"velocity": vec.create(1, 1)});
      p.speed();
      assert.deepEqual(p.get("position"), vec.create(1, 1));
    });

    it("should add the internal velocity twice if we call speed twice", function() {
      const vec = new Vector();
      const p = new Particle({"velocity": vec.create(1, 1)});
      p.speed();
      p.speed();
      assert.deepEqual(p.get("position"), vec.create(2, 2));
    });
  });

  describe("#distanceFrom", function() {
    it("should calculate the distance from one particles center to another (diagonal)", function() {
      const particle1 = new Particle({"position": vector.create(10, 10)});
      const particle2 = new Particle({"position": vector.create(0, 0)});
      assert.equal(particle1.distanceFrom(particle2), Math.sqrt(200));
    });

    it("should calculate the distance from one particles center to another", function() {
      const particle1 = new Particle({"position": vector.create(10, 0)});
      const particle2 = new Particle({"position": vector.create(0, 0)});
      assert.equal(particle1.distanceFrom(particle2), 10);
    });
  });
});
