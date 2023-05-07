const defaultActiveTab = 'tabIntroduction'; // 'tabIntroduction', 'tabOption'
let activeTab = defaultActiveTab;
const panels = {
  tabIntroduction: 'panelIntroduction',
  tabOption: 'panelOption'
};

function setupDivTabs() {
  function setTabActive(id) {
    activeTab = id;
    d3.selectAll('.tab').classed('tab--inactive', true);
    d3.select(`#${activeTab}`).classed('tab--inactive', false);
    d3.selectAll('.panel').style('display', 'none');
    d3.select(`#${panels[activeTab]}`).style('display', '');
  }
  d3.selectAll('.tab').on('click', function () {
    setTabActive(this.id);
  });
}
