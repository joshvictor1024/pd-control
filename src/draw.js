let selectedData = null;
const referenceRadius = 0.05;

function drawAgent(gAgent, agent) {
  gAgent
    .selectAll('circle')
    .data([agent])
    .join('circle')
    // class
    .classed('agent', true)
    .classed('agent__saturation', agent.hasSaturation)
    // draw
    .attr('cx', (a) => a.position.x)
    .attr('cy', (a) => a.position.y)
    .attr('r', (a) => a.radius);
  gAgent
    .selectAll('.reference')
    .data([agent])
    .join('circle')
    .classed('reference', true)
    .attr('cx', (a) => a.referencePosition.x)
    .attr('cy', (a) => a.referencePosition.y)
    .attr('r', referenceRadius);
  const velocityScale = 0.15;
  const accelerationScale = velocityScale * velocityScale;
  gAgent
    .selectAll('.acceleration')
    .data(option.agent.showState ? [agent] : [])
    .join('line')
    .classed('acceleration', true)
    .attr('x1', (a) => a.position.x)
    .attr('y1', (a) => a.position.y)
    .attr('x2', (a) => a.position.x + a.acceleration.x * accelerationScale)
    .attr('y2', (a) => a.position.y + a.acceleration.y * accelerationScale);
  gAgent
    .selectAll('.velocity')
    .data(option.agent.showState ? [agent] : [])
    .join('line')
    .classed('velocity', true)
    .attr('x1', (a) => a.position.x)
    .attr('y1', (a) => a.position.y)
    .attr('x2', (a) => a.position.x + a.velocity.x * velocityScale)
    .attr('y2', (a) => a.position.y + a.velocity.y * velocityScale);
}

function drawWorld(svgWorld, world) {
  drawAgent(svgWorld.select('#gAgent'), world.agent);
}
