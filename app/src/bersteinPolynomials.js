class BernsteinPolynomial {}

BernsteinPolynomial.round = function(f){
  return parseFloat(f.toFixed(5));
}

BernsteinPolynomial.choose = function(a, b) {
    const n = new Array(a).fill().reduce((v, _, i) => v * (i + 1), 1);
    const k = new Array(b).fill().reduce((v, _, i) => v * (i + 1), 1);
    const nk = new Array(a - b).fill().reduce((v, _, i) => v * (i + 1), 1);
    return n/(k * nk);
  }
  /**
   * Returns product of the `k`th term, the degree of the polynomial `n` and
   * the time `t` (ie. the weight of the term). This is also known as a
   * Bernstein coefficient for term `k` (see http://www.wikiwand.com/en/Bernstein_polynomial)
   **/
BernsteinPolynomial.B = function(n, k, t) {
  // n is the grade of all polynomials
  // k is the k-th berstein polinomial of grade n
  if (n < 1) return 1;
  const t1 = BernsteinPolynomial.choose(n, k);
  const t2 = Math.pow(t, k);
  const t3 = Math.pow(1 - t, n - k);
  return t1 * t2 * t3;
}

BernsteinPolynomial.three = function(t){
  return  BernsteinPolynomial.round ( 
            BernsteinPolynomial.B(3, 0, t) +
            BernsteinPolynomial.B(3, 2, t) 
          );
}

BernsteinPolynomial.seven = function(t){
  return  BernsteinPolynomial.round ( 
            BernsteinPolynomial.B(7, 0, t) +
            BernsteinPolynomial.B(7, 3, t) +
            BernsteinPolynomial.B(7, 4, t) +
            BernsteinPolynomial.B(7, 5, t) 
          );
}

BernsteinPolynomial.fiveteen = function(t){
  return  BernsteinPolynomial.round ( 
            BernsteinPolynomial.B(15, 0, t) +
            BernsteinPolynomial.B(15, 2, t) +
            BernsteinPolynomial.B(15, 6, t) +
            BernsteinPolynomial.B(15, 7, t) +
            BernsteinPolynomial.B(15, 11, t) +
            BernsteinPolynomial.B(15, 12, t) 
          );
}

