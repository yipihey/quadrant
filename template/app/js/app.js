// app.js - the standalone laboratory page: state in the URL hash, a copy-link button, the experiment.
import { makeDefaults, encodeHash, decodeHash } from './state.js';
import { mountCurve } from './curve.js';
import { copyText, flash } from './viz/download.js';

const S = decodeHash(location.hash);
const host = document.getElementById('lab');
const bar = document.getElementById('lab-bar');
const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'qd-btn'; btn.textContent = 'copy link';
btn.title = 'Copy the address of this exact experiment (the part after # encodes every control)';
btn.addEventListener('click', async () => { await copyText(location.href); flash(btn, 'copied'); });
bar.appendChild(btn);
window.addEventListener('hashchange', () => { if (location.hash.replace(/^#/, '') !== encodeHash(S)) location.reload(); });
mountCurve(host, S, (S) => { history.replaceState(null, '', '#' + encodeHash(S)); });
