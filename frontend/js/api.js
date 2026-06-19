import { COHORT } from './data/cohort.js';
import { SCHOOLS } from './data/schools.js';

export function fetchCohortSummary() {
  const high = COHORT.filter(s => s.risk_tier === 'high').length;
  const watch = COHORT.filter(s => s.risk_tier === 'watch').length;
  const on_track = COHORT.filter(s => s.risk_tier === 'on_track').length;
  const poor_outcomes = COHORT.filter(s => s.actual_poor_outcome).length;
  const flagged_correctly = COHORT.filter(s => s.actual_poor_outcome && s.risk_tier !== 'on_track').length;
  const missed = poor_outcomes - flagged_correctly;
  return {
    total: COHORT.length,
    high,
    watch,
    on_track,
    poor_outcomes,
    flagged_correctly,
    missed,
    recall_pct: poor_outcomes > 0 ? Math.round(flagged_correctly / poor_outcomes * 100) : 0,
  };
}

export function fetchStudents({ tier, year, major, search } = {}) {
  let data = COHORT;
  if (tier)   data = data.filter(s => s.risk_tier === tier);
  if (year)   data = data.filter(s => s.year === year);
  if (major)  data = data.filter(s => s.major === major);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(s => s.name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q));
  }
  return data;
}

export function fetchStudent(studentId) {
  return COHORT.find(s => s.student_id === studentId) ?? null;
}

export function fetchMajors() {
  return [...new Set(COHORT.map(s => s.major))].sort();
}

export function fetchSchools() {
  return SCHOOLS;
}
