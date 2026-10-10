//! Numerical core of the report.
//!
//! Every public item is documented for the readers of the text: the chapters link here with the
//! `{{< src >}}` shortcode, so doc comments should name the equation they implement.

#[cfg(target_arch = "wasm32")]
pub mod wasm;

/// Logistic growth, the solution of `dx/dt = r x (1 - x/K)` with `x(0) = x0` (Equation 2.1 of the text):
///
/// `x(t) = K / (1 + (K/x0 - 1) e^{-r t})`.
pub fn logistic(t: f64, r: f64, k: f64, x0: f64) -> f64 {
    k / (1.0 + (k / x0 - 1.0) * (-r * t).exp())
}

/// The right-hand side of the growth equation, `r x (1 - x/K)`.
pub fn growth_rate(x: f64, r: f64, k: f64) -> f64 {
    r * x * (1.0 - x / k)
}

/// The solution sampled on `n` equally spaced times in `[0, t_max]`.
pub fn curve(n: usize, t_max: f64, r: f64, k: f64, x0: f64) -> Vec<f64> {
    (0..n).map(|i| logistic(t_max * i as f64 / (n.max(2) - 1) as f64, r, k, x0)).collect()
}
