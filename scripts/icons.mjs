// Desenha o ícone (um neurônio disparando) e grava PNGs sem dependências.
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const BG = hex('#071012'), TEAL = hex('#4fd1c5'), SPARK = hex('#ff7a45');
const nodes = [...Array(6)].map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 3 + 0.25; return [0.5 + Math.cos(a) * 0.29, 0.5 + Math.sin(a) * 0.29]; });

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
function sample(x, y) {
  let c = BG;
  const mix = (col, a) => { c = c.map((v, i) => v + (col[i] - v) * a); };
  for (const [nx, ny] of nodes) if (segDist(x, y, 0.5, 0.5, nx, ny) < 0.013) mix(TEAL, 0.75);
  for (let i = 0; i < 6; i++) { const [ax, ay] = nodes[i], [bx, by] = nodes[(i + 1) % 6]; if (segDist(x, y, ax, ay, bx, by) < 0.006) mix(TEAL, 0.3); }
  for (const [nx, ny] of nodes) if (Math.hypot(x - nx, y - ny) < 0.05) mix(TEAL, 1);
  const d = Math.hypot(x - 0.5, y - 0.5);
  if (d < 0.2) mix(SPARK, Math.max(0, (0.2 - d) / 0.2) * 0.35);
  if (d < 0.11) mix(SPARK, 1);
  return c;
}
function png(size) {
  const ss = 4, raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const acc = [0, 0, 0];
      for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
        const c = sample((x + (sx + 0.5) / ss) / size, (y + (sy + 0.5) / ss) / size);
        acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2];
      }
      const o = y * (size * 3 + 1) + 1 + x * 3;
      for (let k = 0; k < 3; k++) raw[o + k] = Math.round(acc[k] / (ss * ss));
    }
  }
  const crcT = [...Array(256)].map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b) => { let c = 0xffffffff; for (const v of b) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const cr = Buffer.alloc(4); cr.writeUInt32BE(crc(td)); return Buffer.concat([len, td, cr]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) writeFileSync(name, png(size));
console.log('ícones gerados');
