/**
 * Evaluates the investment quality based on total monthly return.
 *
 * @param {object} result
 * @returns {{text:string,className:string}}
 */
export function rateDeal(result) {
  const totalMonthlyReturn = result.realCashflow + result.monthlyWealthGain;

  if (totalMonthlyReturn > 400) return { text: "Sehr guter Vermögensaufbau", className: "good" };
  if (totalMonthlyReturn >= 150) return { text: "Solides Investment", className: "ok" };
  return { text: "Schwaches Investment", className: "bad" };
}

/**
 * Calculates a decision score (0-100) for the deal.
 *
 * @param {object} result
 * @returns {{score:number,label:string,className:string}}
 */
export function calculateDealScore(result) {
  let score = 50;

  // CASHFLOW
  if (result.realCashflow > 200) score += 20;
  else if (result.realCashflow > 0) score += 10;
  else if (result.realCashflow < -150) score -= 25;
  else score -= 10;

  // RETURN ON EQUITY
  if (result.returnOnEquity > 18) score += 20;
  else if (result.returnOnEquity > 12) score += 10;
  else if (result.returnOnEquity < 6) score -= 15;

  // GROSS YIELD
  if (result.grossYield > 7) score += 10;
  else if (result.grossYield < 4) score -= 10;

  // INTEREST RISK
  if (result.futureCashflow < 0) score -= 20;
  else if (result.futureCashflow > 150) score += 5;

  score = Math.max(0, Math.min(100, score));

  let label, className;
  if (score >= 75) {
    label = "Sehr guter Deal";
    className = "score-good";
  } else if (score >= 55) {
    label = "Prüfenswert";
    className = "score-ok";
  } else {
    label = "Eher Abstand nehmen";
    className = "score-bad";
  }

  return { score, label, className };
}