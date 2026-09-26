// Procedural preview scenes. Boxes are scripted demo coordinates, not model predictions.
const W = 960;
const H = 600;
const shirts = ['#d8c8a0', '#748e99', '#b66c52', '#708173'];
function polygon(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath(); ctx.fill();
}
function tree(ctx, x, y, size, aerial = false) {
  ctx.fillStyle = '#172d2b55';
  ctx.beginPath(); ctx.ellipse(x + size * .6, y + size * .45, size * 1.1, size * .5, .35, 0, Math.PI * 2); ctx.fill();
  if (!aerial) { ctx.fillStyle = '#4f584a'; ctx.fillRect(x - 4, y - size, 8, size); }
  const circles = [[0, -.45, 1], [-.6, -.25, .65], [.55, -.55, .7], [0, -.95, .65]];
  circles.forEach(([dx, dy, r], i) => {
    ctx.fillStyle = ['#39544a', '#476153', '#526c58', '#5b765f'][i];
    ctx.beginPath(); ctx.arc(x + dx * size, y + (aerial ? dy * .4 : dy) * size, size * r, 0, Math.PI * 2); ctx.fill();
  });
}
function background(view) {
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d');
  if (view === 'ground') {
    const sky = c.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#91a7ad'); sky.addColorStop(1, '#b4bcb6');
    c.fillStyle = sky; c.fillRect(0, 0, W, H);
    // Distant campus facade and a shaded colonnade.
    c.fillStyle = '#a3aaa4'; c.fillRect(0, 97, 960, 167);
    c.fillStyle = '#8c9791'; c.fillRect(0, 108, 960, 13);
    for (let x = 35; x < 960; x += 62) {
      c.fillStyle = '#4f6264'; c.fillRect(x, 139, 35, 44);
      c.fillStyle = '#bac0b6'; c.fillRect(x + 17, 139, 2, 44);
      c.fillStyle = '#5c706e'; c.fillRect(x, 215, 35, 44);
    }
    polygon(c, [[0, 47], [220, 107], [220, 290], [0, 404]], '#c2c1ad');
    polygon(c, [[0, 47], [220, 107], [233, 91], [0, 24]], '#d4d0bc');
    for (let x = 20; x < 220; x += 47) polygon(c, [[x, 96 + x * .26], [x + 24, 102 + x * .26], [x + 24, 236 + x * .1], [x, 249 + x * .1]], '#53666a');
    polygon(c, [[730, 88], [960, 30], [960, 392], [730, 283]], '#9da69c');
    for (let x = 748; x < 960; x += 49) c.fillStyle = '#465a5a', c.fillRect(x, 135, 23, 112);
    polygon(c, [[0, 363], [236, 261], [723, 261], [960, 380], [960, 600], [0, 600]], '#959c93');
    polygon(c, [[0, 375], [263, 266], [356, 266], [215, 600], [0, 600]], '#62775d');
    polygon(c, [[646, 265], [724, 264], [960, 379], [960, 600], [831, 600]], '#697c60');
    c.strokeStyle = '#c4c6b351'; c.lineWidth = 2;
    for (let x = -550; x <= 1500; x += 165) { c.beginPath(); c.moveTo(470 + (x - 470) * .12, 264); c.lineTo(x, H); c.stroke(); }
    for (const y of [288, 324, 376, 450, 550]) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    tree(c, 116, 327, 67); tree(c, 810, 292, 49); tree(c, 900, 375, 77); tree(c, 256, 283, 35);
    // Lamp posts and benches.
    for (const [x, y, s] of [[303, 333, 1], [724, 407, 1.25]]) {
      c.fillStyle = '#4d5b56'; c.fillRect(x, y - 95 * s, 4, 95 * s); c.fillRect(x - 9, y - 99 * s, 23, 5);
    }
    polygon(c, [[93, 454], [182, 420], [187, 436], [96, 471]], '#796d58');
    c.fillStyle = '#44514c'; c.fillRect(105, 465, 4, 22); c.fillRect(174, 438, 4, 22);
  } else {
    c.fillStyle = '#61735e'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#92998b'; c.fillRect(0, 207, W, 220); c.fillRect(365, 0, 248, H);
    c.strokeStyle = '#c5c7b253'; c.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { c.beginPath(); c.moveTo(x, 207); c.lineTo(x, 427); c.stroke(); }
    for (let y = 0; y < H; y += 40) { c.beginPath(); c.moveTo(365, y); c.lineTo(613, y); c.stroke(); }
    for (let y = 227; y < 427; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    c.fillStyle = '#4c605057'; c.fillRect(53, 34, 278, 145); c.fillRect(680, 469, 295, 135);
    c.fillStyle = '#bbbbae'; c.fillRect(25, 5, 273, 133); c.fillRect(661, 448, 295, 152);
    c.strokeStyle = '#dad9c6'; c.lineWidth = 5; c.strokeRect(36, 17, 251, 110); c.strokeRect(674, 461, 269, 138);
    c.fillStyle = '#7e8a80';
    for (const x of [57, 124, 191]) { c.fillRect(x, 43, 44, 35); c.fillStyle = '#596d68'; c.fillRect(x + 3, 47, 38, 22); c.fillStyle = '#7e8a80'; }
    c.fillStyle = '#a5ad9a'; c.fillRect(718, 482, 83, 44); c.fillRect(850, 482, 54, 44);
    c.fillStyle = '#758865'; c.fillRect(54, 458, 254, 115); c.fillRect(669, 43, 223, 114);
    for (const [x, y, r] of [[60, 178, 32], [160, 176, 35], [268, 176, 31], [689, 186, 29], [811, 189, 37], [927, 177, 31], [331, 498, 28], [626, 522, 26], [74, 523, 35], [259, 532, 37], [730, 72, 37], [846, 87, 38]]) tree(c, x, y, r, true);
    // Planters, roof details, and an unobtrusive campus reference grid.
    c.fillStyle = '#647d70'; c.fillRect(457, 284, 63, 63); c.strokeStyle = '#aeb7a2'; c.lineWidth = 6; c.strokeRect(457, 284, 63, 63);
    tree(c, 490, 318, 25, true);
    c.fillStyle = '#695f4d'; c.fillRect(182, 442, 63, 8); c.fillRect(701, 163, 63, 8);
  }
  // Deterministic film grain: no network assets or fabricated camera footage.
  let seed = 37;
  for (let i = 0; i < 11000; i++) {
    seed = (seed * 16807) % 2147483647; const x = seed % W;
    seed = (seed * 16807) % 2147483647; const y = seed % H;
    c.fillStyle = i % 2 ? '#ffffff09' : '#101c1c0d'; c.fillRect(x, y, 2, 2);
  }
  return canvas;
}

function drawPerson(c, x, y, height, color, phase, aerial) {
  c.save(); c.translate(x, y);
  c.fillStyle = '#1d292f48'; c.beginPath(); c.ellipse(height * .28, 0, height * .42, height * .12, -.25, 0, Math.PI * 2); c.fill();
  if (aerial) {
    c.rotate(.12 + Math.sin(phase * .2) * .2);
    c.fillStyle = '#34464b'; c.fillRect(-height * .17, -height * .19, height * .14, height * .42); c.fillRect(height * .06, -height * .2, height * .14, height * .4);
    c.fillStyle = color; c.beginPath(); c.ellipse(0, -height * .35, height * .3, height * .22, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#403b33'; c.beginPath(); c.arc(0, -height * .44, height * .14, 0, Math.PI * 2); c.fill();
  } else {
    const swing = Math.sin(phase) * height * .09;
    c.strokeStyle = '#293b42'; c.lineWidth = height * .115; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-height * .07, -height * .42); c.lineTo(-height * .09 + swing, -height * .04); c.moveTo(height * .07, -height * .42); c.lineTo(height * .1 - swing, -height * .04); c.stroke();
    c.strokeStyle = color; c.lineWidth = height * .095;
    c.beginPath(); c.moveTo(-height * .13, -height * .72); c.lineTo(-height * .18 - swing * .4, -height * .43); c.moveTo(height * .13, -height * .72); c.lineTo(height * .18 + swing * .4, -height * .45); c.stroke();
    polygon(c, [[-height * .15, -height * .76], [height * .15, -height * .76], [height * .13, -height * .4], [-height * .13, -height * .4]], color);
    c.fillStyle = '#b99a7e'; c.beginPath(); c.ellipse(0, -height * .87, height * .09, height * .115, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#3b3931'; c.beginPath(); c.ellipse(0, -height * .94, height * .095, height * .06, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#394c4b'; c.fillRect(height * .045, -height * .72, height * .1, height * .25);
  }
  c.restore();
}

export class DemoScene {
  constructor(view) { this.view = view; this.background = background(view); }
  draw(canvas, time) {
    const c = canvas.getContext('2d'); c.drawImage(this.background, 0, 0);
    const ground = this.view === 'ground';
    const positions = ground ? [[.43, .65, 92], [.66, .79, 121], [.54, .88, 139], [.59, .52, 65]] : [[.29, .57, 35], [.68, .51, 33], [.46, .82, 37]];
    const detections = positions.map(([x, y, h], i) => {
      const px = x * W + Math.sin(time * .12 + i * 1.7) * (ground ? 32 : 48);
      const py = y * H + Math.sin(time * .16 + i * 2.2) * (ground ? 10 : 18);
      drawPerson(c, px, py, h, shirts[i], time * 2.4 + i, !ground);
      const bw = h * (ground ? .52 : .85), bh = h * (ground ? 1.12 : 1.1);
      return { id: `${ground ? 'G' : 'A'}-${String(i + 1).padStart(2, '0')}`, bbox: [px - bw / 2, py - bh * (ground ? .94 : .74), bw, bh], demo: true };
    });
    // Subtle camera vignette.
    const vignette = c.createRadialGradient(480, 300, 180, 480, 300, 590); vignette.addColorStop(0, '#07171b00'); vignette.addColorStop(1, '#07171b65');
    c.fillStyle = vignette; c.fillRect(0, 0, W, H);
    return detections;
  }
}

export const DEMO_SIZE = { width: W, height: H };
