let targetPosition = newVec2(0, 0);

const attenuation = 60;
let lastFilterLength = option.controller.filterN;
let lowPassFrequency = 100 / lastFilterLength;
let filterCoefficients = generateKaiserBessel(
  60,
  0,
  lowPassFrequency,
  lastFilterLength,
  attenuation
);
let pastTargets = Array(lastFilterLength).fill(newVec2(0, 0));
function kaiserBessel() {
  // Reset and resize arrays on option change.
  if (lastFilterLength !== option.controller.filterN) {
    lastFilterLength = option.controller.filterN;
    lowPassFrequency = 100 / lastFilterLength;
    filterCoefficients = generateKaiserBessel(
      60,
      0,
      lowPassFrequency,
      lastFilterLength,
      attenuation
    );
    pastTargets = Array(lastFilterLength).fill(newVec2(targetPosition.x, targetPosition.y));
  }

  pastTargets.unshift(newVec2(targetPosition.x, targetPosition.y));
  pastTargets.pop();
  let r = newVec2(0, 0);
  for (let i = 0; i < lastFilterLength; i++) {
    r = Vec2.add(r, Vec2.mul(pastTargets[i], filterCoefficients[i]));
  }
  return r;
}

let lastE = newVec2(0, 0);
function pdControl(dt, r, p) {
  const e = Vec2.sub(r, p);
  const de = Vec2.mul(Vec2.sub(e, lastE), 1000 / dt);
  lastE = e;
  return Vec2.add(Vec2.mul(e, option.controller.kp), Vec2.mul(de, option.controller.kd));
}

/**
 * In each time step, `velocity` changes by `acceleration * (dt / 1000)`.
 * In general, let `velocity` change by `acceleration * k`.
 * This function calculates the value of k such that
 * the resulting `velocity` has magnitude `option.agent.maxSpeed`.
 * If `(dt / 1000) > k` then `velocity` will exceed `option.agent.maxSpeed`
 * in the next time step, if left unattended.
 * @param {Vec2} velocity
 * @param {Vec2} acceleration
 * @returns {number}
 */
function limitVelocity(velocity, acceleration) {
  // v' = v + ka
  // (vx + kax)^2 + (vy + kay)^2 = maxSpeed
  // (ax^2 + ay^2)k^2 + 2(vxax + vyay)k + vx^2 + vy^2 - maxSpeed^2 = 0
  const a = acceleration.x * acceleration.x + acceleration.y * acceleration.y;
  const b = 2 * (velocity.x * acceleration.x + velocity.y * acceleration.y);
  const c =
    velocity.x * velocity.x +
    velocity.y * velocity.y -
    option.agent.maxSpeed * option.agent.maxSpeed;
  const k1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  const k2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);

  const epsilon = 0.001;
  if (k1 > -epsilon) return k1;
  if (k2 > -epsilon) return k2;
  throw 'no real solution';
}

function controlSaturation(dt, acceleration, agent) {
  acceleration =
    Vec2.len(acceleration) > option.agent.maxAcceleration
      ? Vec2.mul(Vec2.unit(acceleration), option.agent.maxAcceleration)
      : acceleration;
  const k = limitVelocity(agent.velocity, acceleration);
  acceleration = dt / 1000 > k ? Vec2.mul(acceleration, k / (dt / 1000)) : acceleration;
  return acceleration;
}

function additiveNoise() {
  return newVec2(
    (Math.random() - 0.5) * option.agent.positionNoise,
    (Math.random() - 0.5) * option.agent.positionNoise
  );
}

/**
 * @param {number} dt In milliseconds.
 * @param {Agent} agent
 */
function move(dt, agent) {
  // Add dissipation to the system.
  const tau = 3;
  const damp = Math.exp(-(dt / 1000) / tau);
  agent.velocity = Vec2.mul(agent.velocity, damp);

  agent.referencePosition = kaiserBessel();
  const aRaw = pdControl(dt, agent.referencePosition, Vec2.add(agent.position, additiveNoise()));
  const a = controlSaturation(dt, aRaw, agent);
  agent.hasSaturation = a != aRaw;

  agent.acceleration = a;
  agent.velocity = Vec2.add(agent.velocity, Vec2.mul(a, dt / 1000));
  agent.position = Vec2.add(agent.position, Vec2.mul(agent.velocity, dt / 1000));
}

/**
 * @param {number} dt In milliseconds.
 */
function update(dt, world) {
  move(dt, world.agent);
}
