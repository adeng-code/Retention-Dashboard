import { fetchStudent } from './api.js';

export function openPanel(studentId) {
  const s = fetchStudent(studentId);
  if (!s) return;

  const scoreColor = s.risk_tier === 'high' ? '#ef4444' : s.risk_tier === 'watch' ? '#f59e0b' : '#10b981';
  const tierText = s.risk_tier === 'high' ? '⚠ High Risk' : s.risk_tier === 'watch' ? '● Watch List' : '✓ On Track';
  const drivers = s.risk_drivers === 'None' ? [] : s.risk_drivers.split(';').map(d => d.trim());

  document.getElementById('panel-header').innerHTML = `
    <button class="panel-close" id="panel-close-btn">✕</button>
    <div class="panel-name">${s.name}</div>
    <div class="panel-meta">${s.student_id} · ${s.major} · ${s.year}${s.first_generation ? ' · First-Gen' : ''}</div>
    <div class="panel-score-row">
      <div class="panel-score-circle" style="background:${scoreColor}">${Math.round(s.risk_score * 100)}</div>
      <div class="panel-score-info">
        <div class="panel-score-label">Risk Score (0–100)</div>
        <div class="panel-score-tier" style="color:${scoreColor}">${tierText}</div>
      </div>
    </div>`;

  document.getElementById('panel-body').innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">Academic Snapshot</div>
      <div class="stat-grid">
        <div class="stat-cell"><div class="stat-cell-label">Cumulative GPA</div><div class="stat-cell-value${s.gpa < 2.0 ? ' warning' : ''}">${s.gpa.toFixed(2)}</div></div>
        <div class="stat-cell"><div class="stat-cell-label">Midterm GPA</div><div class="stat-cell-value${s.midterm_gpa < 2.0 ? ' warning' : ''}">${s.midterm_gpa.toFixed(2)}</div></div>
        <div class="stat-cell"><div class="stat-cell-label">LMS Engagement</div><div class="stat-cell-value${s.lms_engagement_pct < 30 ? ' warning' : ''}">${s.lms_engagement_pct}th pct</div></div>
        <div class="stat-cell"><div class="stat-cell-label">Credits This Term</div><div class="stat-cell-value">${s.credits_this_term}</div></div>
        <div class="stat-cell"><div class="stat-cell-label">Course Drops</div><div class="stat-cell-value${s.course_drops >= 2 ? ' warning' : ''}">${s.course_drops}</div></div>
        <div class="stat-cell"><div class="stat-cell-label">Late Submissions</div><div class="stat-cell-value${s.late_submissions >= 4 ? ' warning' : ''}">${s.late_submissions}</div></div>
        <div class="stat-cell"><div class="stat-cell-label">Attendance Flags</div><div class="stat-cell-value${s.attendance_flags >= 2 ? ' warning' : ''}">${s.attendance_flags}</div></div>
        <div class="stat-cell"><div class="stat-cell-label">Credits Behind</div><div class="stat-cell-value${s.credits_behind >= 6 ? ' warning' : ''}">${s.credits_behind}</div></div>
      </div>
      ${s.gateway_course ? `<div style="margin-top:10px;padding:10px 12px;background:${s.failed_gateway ? '#fef2f2' : '#f0fdf4'};border-radius:8px;font-size:13px;color:${s.failed_gateway ? '#b91c1c' : '#166534'}">
        <strong>Gateway course:</strong> ${s.gateway_course} — ${s.failed_gateway ? '✗ Failed' : '✓ Passed / in progress'}
      </div>` : ''}
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Risk Drivers</div>
      <div class="driver-list">
        ${drivers.length
          ? drivers.map(d => `<div class="driver-item"><div class="driver-icon">⚠</div><div class="driver-text">${d}</div></div>`).join('')
          : '<div class="driver-none">No risk signals detected.</div>'}
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Recommended Action</div>
      <div class="intervention-box">
        <div class="intervention-label">Advisor Suggestion</div>
        <div class="intervention-text">${s.suggested_intervention}</div>
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Outcome (Backtesting)</div>
      <span class="outcome-badge ${s.actual_poor_outcome ? 'poor' : 'good'}">
        ${s.actual_poor_outcome ? '✗ Poor outcome recorded' : '✓ Positive outcome recorded'}
      </span>
      <div style="font-size:12px;color:var(--slate);margin-top:8px">Ground-truth label used to measure model accuracy.</div>
    </div>`;

  document.getElementById('panel-close-btn').addEventListener('click', closePanel);
  document.getElementById('overlay').classList.add('open');
  document.getElementById('panel').classList.add('open');
}

export function closePanel() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('panel').classList.remove('open');
}
