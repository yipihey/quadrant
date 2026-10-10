// state.js - the complete control state of the lab and its URL-hash encoding.
// S uses readable names; the hash uses the short keys of SCHEMA. Only values that differ from the defaults are written,
// so a bare URL is the default experiment and any hash is a permalink, a preset and a regression fixture at once.
// Lists and vectors are joined with '_' (never commas).

export function makeDefaults() {
  return { r: 1.0, k: 1.0, x0: 0.05, tmax: 10, log: false };
}

// [stateKey, hashKey, type, range]
const SCHEMA = [
  ['r', 'r', 'num', [0.01, 10]],
  ['k', 'k', 'num', [0.01, 100]],
  ['x0', 'x0', 'num', [1e-4, 100]],
  ['tmax', 't', 'num', [0.1, 1000]],
  ['log', 'lg', 'bool'],
];

const num = (v) => String(+Number(v).toPrecision(6));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Hash string (without '#') for state S. */
export function encodeHash(S) {
  const D = makeDefaults();
  const p = [];
  for (const [sk, hk, type] of SCHEMA) {
    const v = S[sk];
    if (JSON.stringify(v) === JSON.stringify(D[sk])) continue;
    p.push(`${hk}=${type === 'bool' ? (v ? '1' : '0') : num(v)}`);
  }
  return p.join('&');
}

/** State from a hash string (unknown or invalid entries are ignored). */
export function decodeHash(hash) {
  const S = makeDefaults();
  for (const kv of (hash || '').replace(/^#/, '').split('&')) {
    const [hk, raw] = kv.split('=');
    const ent = SCHEMA.find((e) => e[1] === hk);
    if (!ent || raw === undefined) continue;
    const [sk, , type, range] = ent;
    if (type === 'bool') S[sk] = raw === '1';
    else { const v = parseFloat(raw); if (Number.isFinite(v)) S[sk] = range ? clamp(v, range[0], range[1]) : v; }
  }
  return S;
}
