/**
 * Calculates the monthly loan payment (annuity) during the fixed interest period.
 *
 * @param {number} loan
 * @param {number} interestPercent
 * @param {number} repaymentPercent
 * @returns {number}
 */
function calculateMonthlyRate(loan, interestPercent, repaymentPercent) {
  const interest = interestPercent / 100;
  const repayment = repaymentPercent / 100;

  const annualRate = loan * (interest + repayment);
  return annualRate / 12;
}

/**
 * Calculates the new monthly payment after the fixed interest period.
 *
 * @param {number} remainingDebt
 * @param {number} futureInterestPercent
 * @param {number} repaymentPercent
 * @returns {number}
 */
function calculateFutureMonthlyRate(remainingDebt, futureInterestPercent, repaymentPercent) {
  const interest = futureInterestPercent / 100;
  const repayment = repaymentPercent / 100;

  const yearlyRate = remainingDebt * (interest + repayment);
  return yearlyRate / 12;
}

/**
 * Simulates the loan month by month and returns remaining debt.
 *
 * @param {number} loan
 * @param {number} interestPercent
 * @param {number} years
 * @param {number} monthlyRate
 * @returns {number}
 */
function calculateRemainingDebt(loan, interestPercent, years, monthlyRate) {
  const interest = interestPercent / 100;
  const monthlyInterest = interest / 12;

  const months = years * 12;
  let remainingDebt = loan;

  for (let i = 0; i < months; i++) {
    const interestPart = remainingDebt * monthlyInterest;
    const principalPart = monthlyRate - interestPart;
    remainingDebt -= principalPart;
  }

  return remainingDebt;
}

/**
 * Calculates property metrics independent of financing.
 *
 * @param {object} data
 * @returns {object}
 */
function calculatePropertyMetrics(data) {
  const annualRent = data.rent * 12;

  return {
    grossYield: (annualRent / data.price) * 100,
    monthlyCashflow: data.rent - data.costs,
    yearlyCashflow: (data.rent - data.costs) * 12,
  };
}

/**
 * Calculates loan amount and monthly bank payment.
 *
 * @param {object} data
 * @returns {object}
 */
function calculateFinancing(data) {
  const loan = data.price - data.equity;
  const monthlyRate = calculateMonthlyRate(loan, data.interest, data.repayment);
  return { loan, monthlyRate };
}

/**
 * Simulates loan development and amortization gain.
 *
 * @param {number} loan
 * @param {number} interest
 * @param {number} years
 * @param {number} monthlyRate
 * @returns {object}
 */
function simulateLoan(loan, interest, years, monthlyRate) {
  const remainingDebt = calculateRemainingDebt(loan, interest, years, monthlyRate);
  const repaidAmount = loan - remainingDebt;

  return {
    remainingDebt,
    repaidAmount,
    monthlyPrincipalGain: repaidAmount / (years * 12),
  };
}

/**
 * Calculates the return on equity (ROE).
 *
 * @param {object} data
 * @param {number} realCashflow
 * @param {number} monthlyWealthGain
 * @returns {number}
 */
function calculateInvestmentReturn(data, realCashflow, monthlyWealthGain) {
  const yearlyCashflow = realCashflow * 12;
  const yearlyPrincipal = monthlyWealthGain * 12;

  if (data.equity <= 0) return 0;
  return ((yearlyCashflow + yearlyPrincipal) / data.equity) * 100;
}

/**
 * Central calculation function.
 *
 * @param {object} data
 * @returns {object}
 */
export function calculateDeal(data) {
  const property = calculatePropertyMetrics(data);
  const financing = calculateFinancing(data);

  const loanSim = simulateLoan(financing.loan, data.interest, data.years, financing.monthlyRate);

  const realCashflow = property.monthlyCashflow - financing.monthlyRate;

  const futureMonthlyRate = calculateFutureMonthlyRate(
    loanSim.remainingDebt,
    data.futureInterest,
    data.repayment
  );

  const futureCashflow = property.monthlyCashflow - futureMonthlyRate;

  const returnOnEquity = calculateInvestmentReturn(data, realCashflow, loanSim.monthlyPrincipalGain);

  return {
    ...property,
    monthlyDebtService: financing.monthlyRate,
    realCashflow,
    remainingDebt: loanSim.remainingDebt,
    repaidAmount: loanSim.repaidAmount,
    monthlyWealthGain: loanSim.monthlyPrincipalGain,
    futureMonthlyRate,
    futureCashflow,
    returnOnEquity,
  };
}