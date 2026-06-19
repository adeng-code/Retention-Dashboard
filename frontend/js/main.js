import { initDashboard } from './dashboard.js';
import { initStudents, renderTable, sortBy } from './students.js';
import { initTuning } from './tuning.js';
import { closePanel } from './panel.js';

let studentsLoaded = false;
let tuningLoaded = false;

export function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  const tab = document.querySelector(`.nav-tab[data-view="${id}"]`);
  if (tab) tab.classList.add('active');

  if (id === 'students' && !studentsLoaded) {
    studentsLoaded = true;
    initStudents();
  } else if (id === 'students') {
    renderTable();
  }
  if (id === 'tuning' && !tuningLoaded) {
    tuningLoaded = true;
    initTuning();
  }
}

window.showView = showView;
window.sortBy = sortBy;
window.renderTable = renderTable;

document.getElementById('overlay').addEventListener('click', closePanel);

initDashboard();
