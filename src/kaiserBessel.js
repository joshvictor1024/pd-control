// Source: https://www.arc.id.au/FilterDesign.html

/**
 * This function calculates Kaiser windowed
 * FIR filter coefficients for a single passband
 * based on
 * "DIGITAL SIGNAL PROCESSING, II" IEEE Press pp 123-126.
 * @param {*} fs Sampling frequency.
 * @param {*} fa Low frequency ideal cutoff (0=low pass).
 * @param {*} fb High frequency ideal cutoff (fs/2=low pass).
 * @param {*} N Number of points in filter. Must be odd.
 * @param {*} att Minimum stop band attenuation (>21). In dB.
 * @returns
 */
function generateKaiserBessel(fs, fa, fb, N, att) {
  const pi = Math.PI;

  // Calculate the impulse response of the ideal filter
  const Np = (N - 1) / 2;
  const A = [];
  A[0] = (2 * (fb - fa)) / fs;
  for (let j = 1; j <= Np; j++) {
    A[j] = (Math.sin((2 * j * pi * fb) / fs) - Math.sin((2 * j * pi * fa) / fs)) / (j * pi);
  }

  // Calculate the desired shape factor for the Kaiser-Bessel window
  let alpha;
  if (att < 21) {
    alpha = 0;
  } else if (att > 50) {
    alpha = 0.1102 * (att - 8.7);
  } else {
    alpha = 0.5842 * Math.pow(att - 21, 0.4) + 0.07886 * (att - 21);
  }

  // Window the ideal response with the Kaiser-Bessel window
  let inoAlpha;
  let H = [];
  inoAlpha = ino(alpha);
  // Symmetric. Only half generated.
  for (let j = 0; j <= Np; j++) {
    H[Np + j] = (A[j] * ino(alpha * Math.sqrt(1 - (j * j) / (Np * Np)))) / inoAlpha;
  }
  // Mirror the other half.
  for (let j = 0; j < Np; j++) {
    H[j] = H[N - 1 - j];
  }

  let sum = H.reduce((acc, cur) => acc + cur);
  return H.map((v) => v / sum);
}

/**
 * This function calculates the zeroth order Bessel function.
 */
function ino(x) {
  var d = 0,
    ds = 1,
    s = 1;
  do {
    d += 2;
    ds *= (x * x) / (d * d);
    s += ds;
  } while (ds > s * 1e-6);
  return s;
}
