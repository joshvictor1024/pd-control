const option = {
  agent: {
    positionNoise: 0,
    maxSpeed: 9, // In meters per second.
    maxAcceleration: 32, // In meters per second squared.
    showState: true
  },
  controller: {
    kp: 5,
    kd: 2,
    // tau: 0, // In seconds.
    filterN: 3 // Number of samples.
  },
  simulation: {
    paused: false
  }
};

const optionUI = {
  agent: {
    title: 'Agent Dynamics',
    items: {
      positionNoise: {
        type: 'slider',
        title: 'Sensor Noise',
        min: 0,
        max: 0.3,
        step: 0.01,
        get: () => option.agent.positionNoise,
        set: (v) => (option.agent.positionNoise = Number(v))
      },
      maxSpeed: {
        type: 'slider',
        title: 'Maximum Speed',
        min: 6,
        max: 16,
        step: 0.5,
        get: () => option.agent.maxSpeed,
        set: (v) => (option.agent.maxSpeed = Number(v))
      },
      maxAcceleration: {
        type: 'slider',
        title: 'Maximum Acceleration',
        min: 16,
        max: 64,
        step: 0.5,
        get: () => option.agent.maxAcceleration,
        set: (v) => (option.agent.maxAcceleration = Number(v))
      },
      showState: {
        type: 'toggle',
        title: 'Show State',
        get: () => option.agent.showState,
        set: (v) => (option.agent.showState = v)
      }
    }
  },
  controller: {
    title: 'Controller',
    items: {
      kp: {
        type: 'slider',
        title: 'Proportional Control',
        min: 1,
        max: 20,
        step: 0.5,
        get: () => option.controller.kp,
        set: (v) => (option.controller.kp = Number(v))
      },
      kd: {
        type: 'slider',
        title: 'Differential Control',
        min: 1,
        max: 6,
        step: 0.25,
        get: () => option.controller.kd,
        set: (v) => (option.controller.kd = Number(v))
      },
      filterN: {
        type: 'slider',
        title: 'Feedforward Smoothing',
        min: 3,
        max: 103,
        step: 4,
        get: () => option.controller.filterN,
        set: (v) => (option.controller.filterN = Number(v))
      }
    }
  },
  simulation: {
    title: 'Simulation',
    items: {
      paused: {
        type: 'toggle',
        title: 'Paused',
        get: () => option.simulation.paused,
        set: (v) => (option.simulation.paused = v)
      }
    }
  }
};

function setupDivOption() {
  const divOption = d3.select('#panelOption');
  // For `h3` ordering.
  function getAlphabet(i) {
    return 'ABCDEFG'[i];
  }

  // Option
  Object.keys(optionUI).forEach((s, index) => {
    // Option section
    const section = divOption.append('section').attr('id', s).classed('option__section', true);
    section.append('h3').text(`${getAlphabet(index)}. ${optionUI[s].title}`);

    Object.keys(optionUI[s].items).forEach((i) => {
      // Option item
      const item = section.append('div').attr('id', i).classed('option__item', true);
      const label = item.append('label').text(optionUI[s].items[i].title);
      switch (optionUI[s].items[i].type) {
        case 'toggle':
          item.classed('option__item--toggle', true);
          label
            .append('input')
            .attr('type', 'checkbox')
            .property('checked', optionUI[s].items[i].get())
            .on('change', function () {
              optionUI[s].items[i].set(d3.select(this).property('checked'));
            });
          break;
        case 'slider':
          item.classed('option__item--slider', true);
          label.style('display', 'flex').style('flex-direction', 'column');
          label
            .append('input')
            .attr('type', 'range')
            .attr('min', optionUI[s].items[i].min)
            .attr('max', optionUI[s].items[i].max)
            .attr('step', optionUI[s].items[i].step)
            .attr('value', optionUI[s].items[i].get())
            .on('change', function () {
              optionUI[s].items[i].set(d3.select(this).property('value'));
            });
          break;
      }
    });
  });
}
