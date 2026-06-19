import { fetchCohortSummary, fetchStudents } from './api.js';
import { avatarColor, initials, tierLabel, topDriver } from './utils.js';
import { openPanel } from './panel.js';

export function initDashboard() {
  const summary = fetchCohortSummary();
  const allStudents = fetchStudents();

  const { total, high, watch, on_track, poor_outcomes, flagged_correctly, missed, recall_pct } = summary;

  document.getElementById('kpi-total').textContent = total;
  document.getElementById('kpi-high').textContent = high;
  document.getElementById('kpi-watch').textContent = watch;
  document.getElementById('kpi-ok').textContent = on_track;
  document.getElementById('kpi-recall').textContent = recall_pct + '%';
  document.getElementById('high-count-badge').textContent = high;
  document.getElementById('hero-sub').innerHTML =
    `${total} students · Last updated June 18, 2025 · <em>All data is synthetic for demo purposes</em>`;

  const circumference = 326.7;
  document.getElementById('recall-arc').setAttribute('stroke-dashoffset', circumference * (1 - recall_pct / 100));
  document.getElementById('recall-pct-label').textContent = recall_pct + '%';
  document.getElementById('recall-desc').innerHTML =
    `The model flagged <strong>${flagged_correctly} of ${poor_outcomes}</strong> students who actually had poor outcomes — before those outcomes occurred.`;
  document.getElementById('stat-poor').textContent = poor_outcomes;
  document.getElementById('stat-flagged').textContent = flagged_correctly;
  document.getElementById('stat-missed').textContent = missed;

  const bar = document.getElementById('risk-bar');
  bar.innerHTML = `
    <div class="risk-seg" style="width:${high / total * 100}%;background:var(--high)" title="High Risk: ${high}">${high}</div>
    <div class="risk-seg" style="width:${watch / total * 100}%;background:var(--watch)" title="Watch: ${watch}">${watch}</div>
    <div class="risk-seg" style="width:${on_track / total * 100}%;background:var(--ok)" title="On Track: ${on_track}">${on_track}</div>`;

  const majorRisk = {};
  allStudents.forEach(s => {
    if (!majorRisk[s.major]) majorRisk[s.major] = { total: 0, flagged: 0 };
    majorRisk[s.major].total++;
    if (s.risk_tier !== 'on_track') majorRisk[s.major].flagged++;
  });
  const sorted = Object.entries(majorRisk).sort((a, b) => b[1].flagged - a[1].flagged).slice(0, 6);
  const maxFlagged = sorted[0][1].flagged;
  document.getElementById('major-breakdown').innerHTML =
    '<div style="font-size:12px;font-weight:600;color:var(--slate);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">At-Risk by Major</div>' +
    sorted.map(([name, d]) => `
      <div class="major-row">
        <div class="major-name">${name}</div>
        <div class="major-bar-bg"><div class="major-bar-fill" style="width:${d.flagged / maxFlagged * 100}%"></div></div>
        <div class="major-count">${d.flagged}</div>
      </div>`).join('');

  const topStudents = [...allStudents].sort((a, b) => b.risk_score - a.risk_score).slice(0, 8);
  document.getElementById('top-students-list').innerHTML = topStudents.map(s => `
    <div class="student-mini" data-id="${s.student_id}">
      <div class="student-avatar" style="background:${avatarColor(s.risk_tier)}">${initials(s.name)}</div>
      <div class="student-info">
        <div class="student-name">${s.name}</div>
        <div class="student-detail">${s.major} · ${s.year} · ${topDriver(s.risk_drivers)}</div>
      </div>
      <span class="tier-badge ${s.risk_tier}">${tierLabel(s.risk_tier)}</span>
    </div>`).join('');

  document.getElementById('top-students-list').addEventListener('click', e => {
    const row = e.target.closest('[data-id]');
    if (row) openPanel(row.dataset.id);
  });
}
