const agentRadius = 0.15;

/**
 * @typedef {Object} Agent
 * @property {number} radius In meters.
 * @property {Vec2} position In meters.
 * @property {Vec2} velocity In meters per second.
 * @property {Vec2} acceleration In meters per second.
 * @property {Vec2} referencePosition In meters.
 * @property {boolean} isSelected
 * @property {boolean} hasSaturation
 */
function newAgent(position) {
  return {
    // Status
    radius: agentRadius,
    position: position,
    velocity: newVec2(0, 0),
    acceleration: newVec2(0, 0),
    referencePosition: position,
    isSelected: false,
    // Debug
    hasSaturation: false
  };
}
