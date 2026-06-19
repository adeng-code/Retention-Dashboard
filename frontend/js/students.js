import { fetchStudents, fetchMajors } from './api.js';
import { avatarColor, initials, tierLabel, topDriver, scoreColor } from './utils.js';
import { openPanel } from './panel.js';

let sortKey = 'risk_score';
let sortDir = -1;

export function initStudents() {
  const majors = fetchMajors();
  const sel = document.getElementById('filter-major');
  majors.forEach(m => {
    const o = document.createElement('option');
    o.value = m;
    o.textContent = m;
    sel.appendChild(o);
  });
  renderTable();
}

export function renderTable() {
  const search = document.getElementById('search').value;
  const tier   = document.getElementById('filter-tier').value;
  const year   = document.getElementById('filter-year').value;
  const major  = document.getElementById('filter-major').value;

  const data = fetchStudents({ search, tier, year, major });

  data.sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    return av < bv ? sortDir : av > bv ? -sortDir : 0;
  });

  document.getElementById('students-count').textContent = `Showing ${data.length} students`;

  document.getElementById('student-tbody').innerHTML = data.length
    ? data.map(s => `
      <tr data-id="${s.student_id}">
        <td><strong>${s.name}</strong><br><span style="font-size:11px;color:var(--slate)">${s.student_id}</span></td>
        <td>${s.major}</td>
        <td>${s.year}</td>
        <td>${s.gpa.toFixed(2)}</td>
        <td><div class="score-bar"><div class="score-track"><div class="score-fill ${s.risk_tier}" style="width:${s.risk_score * 100}%"></div></div>${s.risk_score.toFixed(2)}</div></td>
        <td><span class="tier-badge ${s.risk_tier}">${tierLabel(s.risk_tier)}</span></td>
        <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px;color:var(--slate)">${topDriver(s.risk_drivers)}</td>
      </tr>`).join('')
    : '<tr><td colspan="7"><div class="empty">No students match your filters.</div></td></tr>';

  document.getElementById('student-cards').innerHTML = data.length
    ? data.map(s => `
      <div class="student-card" data-id="${s.student_id}">
        <div class="student-card-top">
          <div class="student-avatar" style="background:${avatarColor(s.risk_tier)}">${initials(s.name)}</div>
          <div class="student-card-info">
            <div class="student-card-name">${s.name}</div>
            <div class="student-card-sub">${s.student_id} · ${s.major} · ${s.year}</div>
          </div>
          <span class="tier-badge ${s.risk_tier}">${tierLabel(s.risk_tier)}</span>
        </div>
        <div class="student-card-stats">
          <div class="student-card-stat"><div class="student-card-stat-label">GPA</div><div class="student-card-stat-value">${s.gpa.toFixed(2)}</div></div>
          <div class="student-card-stat"><div class="student-card-stat-label">LMS</div><div class="student-card-stat-value">${s.lms_engagement_pct}<span style="font-size:11px;font-weight:400">th</span></div></div>
          <div class="student-card-stat"><div class="student-card-stat-label">Risk</div><div class="student-card-stat-value" style="color:${scoreColor(s.risk_tier)}">${Math.round(s.risk_score * 100)}</div></div>
        </div>
        ${topDriver(s.risk_drivers) !== '—' ? `<div class="student-card-driver">⚠ ${topDriver(s.risk_drivers)}</div>` : ''}
      </div>`).join('')
    : '<div class="empty">No students match your filters.</div>';

  document.getElementById('student-tbody').addEventListener('click', e => {
    const row = e.target.closest('[data-id]');
    if (row) openPanel(row.dataset.id);
  });
  document.getElementById('student-cards').addEventListener('click', e => {
    const card = e.target.closest('[data-id]');
    if (card) openPanel(card.dataset.id);
  });
}

export function sortBy(key) {
  if (sortKey === key) sortDir *= -1;
  else { sortKey = key; sortDir = -1; }
  document.querySelectorAll('thead th').forEach(th => th.classList.remove('sorted'));
  renderTable();
}
