const pixelPerMeter = 100;

/**
 * @typedef {Object} World
 * @property {number} x In meters.
 * @property {number} y In meters.
 * @property {number} width In meters.
 * @property {number} height In meters.
 * @property {Agent} agent
 */
const world = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  agent: null
};

function setupSvgWorld(svgWorld) {
  svgWorld
    .attr('height', '100%')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('viewBox', `0 0 ${1} ${1}`); // Trigger flexbox reflow to calculate `clientWidth` `clientHeight`.

  // Setup svg size.
  const viewportWidth = document.getElementById('world').clientWidth;
  const viewportHeight = document.getElementById('world').clientHeight;
  world.width = viewportWidth / pixelPerMeter;
  world.height = viewportHeight / pixelPerMeter;
  svgWorld.attr('viewBox', `0 0 ${world.width} ${world.height}`);

  // Add background.
  svgWorld
    .append('rect')
    // ID
    .attr('id', 'background')
    // Draw
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', world.width)
    .attr('height', world.height)
    // .attr('fill', '#fafafa')
    .attr('stroke', 'lightgray')
    .attr('stroke-width', 0.01)
    // Event: mousemove
    .on('mousemove', function (e) {
      const pt = d3.pointer(e);
      targetPosition.x = pt[0];
      targetPosition.y = pt[1];
    });

  // Add groups for the entities.
  svgWorld.append('g').attr('id', 'gAgent');
}
