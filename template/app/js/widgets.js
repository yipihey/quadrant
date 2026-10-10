// widgets.js - chapter widgets: <div class="qd-widget" data-widget="curve"></div> plus this module script on the page.
import { makeDefaults } from './state.js';
import { mountCurve } from './curve.js';

const MOUNT = { curve: (el) => mountCurve(el, makeDefaults()) };
for (const el of document.querySelectorAll('.qd-widget')) {
  const m = MOUNT[el.dataset.widget];
  if (m) m(el).catch((e) => { el.textContent = 'widget failed: ' + e; });
}
