// curve.js - the one experiment of the template: logistic growth from the WebAssembly core, drawn with the plot kit.
// Used by the standalone lab (app.js) and by the chapter widget (widgets.js).
import init, { curve } from '../pkg/report_core.js';
import { LinePlot } from './viz/plot.js';
import { slider, checkbox } from './viz/ui.js';

let ready = null;
export function loadCore() { if (!ready) ready = init(); return ready; }

/**
 * Mount the experiment into `host`. `S` is the state object (see state.js); `onChange(S)` is called after every edit.
 * Returns { draw(), plot }.
 */
export async function mountCurve(host, S, onChange = () => {}) {
  await loadCore();
  const bar = document.createElement('div'); bar.className = 'qd-controls'; host.appendChild(bar);
  const plotHost = document.createElement('div'); host.appendChild(plotHost);
  const plot = new LinePlot(plotHost, { width: 560, height: 340 });
  const draw = () => {
    const n = 200;
    const x = Float64Array.from({ length: n }, (_, i) => S.tmax * i / (n - 1));
    const y = curve(n, S.tmax, S.r, S.k, S.x0);
    plot.setAxes({ xlabel: 't', ylabel: 'x(t)', ylog: S.log, title: 'Logistic growth' });
    plot.setSeries([
      { x, y, label: `r = ${S.r}, K = ${S.k}` },
      { x, y: Float64Array.from(x, () => S.k), label: 'carrying capacity', dash: '4 3', color: '#999' },
    ]);
    plot.draw();
    onChange(S);
  };
  slider(bar, { label: 'growth rate r', min: 0.1, max: 5, step: 0.01, value: S.r, onInput: (v) => { S.r = v; draw(); } });
  slider(bar, { label: 'capacity K', min: 0.1, max: 5, step: 0.01, value: S.k, onInput: (v) => { S.k = v; draw(); } });
  checkbox(bar, { label: 'log y', value: S.log, onChange: (v) => { S.log = v; draw(); } });
  draw();
  return { draw, plot };
}
