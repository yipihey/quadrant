//! Validation suite. Every quantitative claim of the text names one of these tests with `{{< test >}}`.
use report_core::{growth_rate, logistic};

/// The closed form satisfies the differential equation: a centred finite difference of x(t) equals r x (1 - x/K).
#[test]
fn logistic_solves_the_ode() {
    let (r, k, x0) = (1.3, 2.0, 0.1);
    let h = 1e-5;
    for i in 0..200 {
        let t = 0.05 * i as f64;
        let dx = (logistic(t + h, r, k, x0) - logistic(t - h, r, k, x0)) / (2.0 * h);
        let rhs = growth_rate(logistic(t, r, k, x0), r, k);
        assert!((dx - rhs).abs() < 1e-7, "t={t}: {dx} vs {rhs}");
    }
}

/// Initial value and carrying capacity.
#[test]
fn logistic_limits() {
    assert!((logistic(0.0, 0.7, 3.0, 0.2) - 0.2).abs() < 1e-15);
    assert!((logistic(200.0, 0.7, 3.0, 0.2) - 3.0).abs() < 1e-12);
}
