// Valida content/cards.json. Sai com código 1 e lista os problemas se algo estiver fora do formato.
import { readFileSync } from 'node:fs';

const SYL = JSON.parse(readFileSync('content/syllabus.json', 'utf8'));
const data = JSON.parse(readFileSync('content/cards.json', 'utf8'));
const errs = [];
const str = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;

if (!/^\d{4}-\d{2}-\d{2}$/.test(data.updated || '')) errs.push('updated precisa ser AAAA-MM-DD');
if (!Array.isArray(data.cards)) errs.push('cards precisa ser um array');
const cards = Array.isArray(data.cards) ? data.cards : [];
if (cards.length > 1500) errs.push(`máximo de 1500 cards (tem ${cards.length})`);

function checkChart(ch, where) {
  if (!['bar', 'line', 'scatter'].includes(ch.type)) return errs.push(`${where}: chart.type inválido`);
  if (ch.type === 'scatter') {
    const ok = Array.isArray(ch.points) && ch.points.length >= 4 && ch.points.every((p) => Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]));
    if (!ok) errs.push(`${where}: scatter precisa de points [[x,y],...] com 4+ pontos numéricos`);
    return;
  }
  const n = Array.isArray(ch.labels) ? ch.labels.length : 0;
  if (n < 2 || n > 14) errs.push(`${where}: labels precisa ter 2 a 14 itens`);
  const ser = Array.isArray(ch.series) ? ch.series : [];
  if (!ser.length || ser.length > 3) errs.push(`${where}: series precisa ter 1 a 3 séries`);
  ser.forEach((s, i) => { if (!Array.isArray(s.values) || s.values.length !== n || !s.values.every(Number.isFinite)) errs.push(`${where}: series[${i}].values precisa ter ${n} números`); });
}

const ids = new Set(), qs = new Set();
cards.forEach((c, i) => {
  const where = `cards[${i}] (${c && c.id})`;
  if (!c || typeof c !== 'object') return errs.push(`${where}: não é objeto`);
  if (typeof c.id !== 'string' || !/^[\w-]{3,64}$/.test(c.id)) errs.push(`${where}: id inválido`);
  if (ids.has(c.id)) errs.push(`${where}: id repetido`); ids.add(c.id);
  if (!SYL[c.track]) errs.push(`${where}: track deve ser ana, ds, ml ou ia`);
  else if (!SYL[c.track].includes(c.topic)) errs.push(`${where}: topic fora da ementa de ${c.track}`);
  const qk = String(c.q || '').trim().toLowerCase();
  if (qs.has(qk)) errs.push(`${where}: pergunta repetida`); qs.add(qk);
  if (c.kind === 'quiz') {
    if (!str(c.q, 420)) errs.push(`${where}: q vazio ou maior que 420`);
    if (!str(c.why, 900)) errs.push(`${where}: why vazio ou maior que 900`);
    const o = Array.isArray(c.opts) ? c.opts : [];
    if (o.length < 3 || o.length > 4 || !o.every((x) => str(x, 240)) || new Set(o).size !== o.length) errs.push(`${where}: opts precisa de 3 a 4 alternativas distintas (a correta em opts[0])`);
    if (c.code !== undefined && !str(c.code, 900)) errs.push(`${where}: code maior que 900`);
    if (c.chart !== undefined) checkChart(c.chart, where);
  } else if (c.kind === 'flip') {
    if (!str(c.q, 260)) errs.push(`${where}: q vazio ou maior que 260`);
    if (!str(c.ans, 900)) errs.push(`${where}: ans vazio ou maior que 900`);
  } else errs.push(`${where}: kind deve ser quiz ou flip`);
});

if (errs.length) { console.error(`${errs.length} problema(s):\n- ` + errs.slice(0, 60).join('\n- ')); process.exit(1); }
const by = {}; cards.forEach((c) => { by[c.track] = (by[c.track] || 0) + 1; });
console.log(`OK: ${cards.length} cards`, by);
