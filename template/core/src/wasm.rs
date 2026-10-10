//! WebAssembly exports used by the laboratory (built with `wasm-pack build core --target web`).
use wasm_bindgen::prelude::*;

/// `x(t)` on `n` points of `[0, t_max]` (see [`crate::curve`]).
#[wasm_bindgen]
pub fn curve(n: u32, t_max: f64, r: f64, k: f64, x0: f64) -> Vec<f64> {
    crate::curve(n as usize, t_max, r, k, x0)
}
