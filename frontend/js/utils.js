export function avatarColor(tier) {
  return tier === 'high' ? '#ef4444' : tier === 'watch' ? '#f59e0b' : '#10b981';
}

export function initials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2);
}

export function tierLabel(t) {
  return t === 'high' ? 'High Risk' : t === 'watch' ? 'Watch' : 'On Track';
}

export function topDriver(drivers) {
  if (!drivers || drivers === 'None') return '—';
  return drivers.split(';')[0].trim();
}

export function scoreColor(tier) {
  return tier === 'high' ? 'var(--high)' : tier === 'watch' ? 'var(--watch)' : 'var(--ok)';
}
