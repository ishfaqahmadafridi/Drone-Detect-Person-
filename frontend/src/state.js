// Tracking IDs belong to one source. They are never treated as cross-camera identities.
export const state = {
  route: 'overview',
  paused: false,
  reference: null,
  prepared: null,
  events: [],
  modelHealth: null,
  sources: { ground: { mode: 'demo', name: 'Campus walkway' }, aerial: { mode: 'demo', name: 'Courtyard overview' } },
};

const listeners = new Set();
export function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
export function emit() { listeners.forEach(listener => listener(state)); }
export function logEvent(title, detail, kind = 'info') {
  state.events.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), title, detail, kind });
  state.events = state.events.slice(0, 100);
  emit();
}
