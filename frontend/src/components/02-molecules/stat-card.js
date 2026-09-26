import { icon } from '../01-atoms/icons.js';

export function statCard({ title, value, detail, symbol, id, tone = '' }) {
  return `<article class="stat-card panel"><div class="stat-heading"><span>${title}</span>${icon(symbol)}</div><div class="stat-value ${tone}" id="${id}">${value}</div><p>${detail}</p></article>`;
}
