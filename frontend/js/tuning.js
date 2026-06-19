import { fetchSchools } from './api.js';

export function initTuning() {
  const schools = fetchSchools();
  const tabsEl = document.getElementById('school-tabs');
  const panelsEl = document.getElementById('school-panels');

  tabsEl.innerHTML = schools.map((school, i) => `
    <button class="school-tab${i === 0 ? ' active' : ''}" data-school="${school.id}">
      ${school.name}
    </button>`).join('');

  panelsEl.innerHTML = schools.map((school, i) => `
    <div class="school-panel${i === 0 ? ' active' : ''}" id="school-${school.id}">
      <div class="school-blurb">
        <h3>${school.name}</h3>
        <span class="tag">${school.tag}</span>
        <p>${school.description}</p>
      </div>
      <div class="weights-card">
        <h3>Learned Signal Weights</h3>
        ${school.weights.map(w => `
          <div class="weight-row">
            <div class="weight-label">${w.label}</div>
            <div class="weight-bar-bg"><div class="weight-bar-fill" style="width:${w.pct}%;background:${w.color}"></div></div>
            ${w.note
              ? (w.pct === 0
                  ? `<div class="weight-off">${w.note}</div>`
                  : `<div class="weight-value" style="color:${w.color}">${w.value} ${w.note}</div>`)
              : `<div class="weight-value">${w.value}</div>`}
          </div>`).join('')}
      </div>
    </div>`).join('');

  tabsEl.addEventListener('click', e => {
    const btn = e.target.closest('.school-tab');
    if (!btn) return;
    document.querySelectorAll('.school-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.school-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('school-' + btn.dataset.school).classList.add('active');
  });
}
