window.addEventListener('load', async () => {
  // Setup DOM.
  const svgWorld = d3.select('#world');
  setupDivTabs();
  setupDivOption();
  setupSvgWorld(svgWorld);

  // Setup agent.
  world.agent = newAgent(
    newVec2(
      world.x + 1 + Math.random() * (world.width - 2),
      world.y + 1 + Math.random() * (world.height - 2)
    )
  );

  // Main function.
  let lastRAFTimestamp = null;
  function animation(rAFTimestamp) {
    if (lastRAFTimestamp === null) {
      lastRAFTimestamp = rAFTimestamp;
    } else {
      if (option.simulation.paused === false && document.hidden === false) {
        const dt = rAFTimestamp - lastRAFTimestamp;
        if (dt < 200) {
          update(dt, world);
          drawWorld(svgWorld, world);
        }
      }
      lastRAFTimestamp = rAFTimestamp;
    }
    // Self recurrsion.
    window.requestAnimationFrame(animation);
  }
  // Start the recurrsion.
  window.requestAnimationFrame(animation);
});
