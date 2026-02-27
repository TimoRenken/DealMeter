import { euro } from "./utils.js";

export function showResult(text) {
  const result = document.getElementById("result");
  hidePlaceholder();
  result.classList.remove("hidden");
  result.textContent = text;
}

export function hideResult() {
  const result = document.getElementById("result");
  result.classList.add("hidden");
  result.textContent = "";
}

export function showPlaceholder() {
  document.getElementById("analysisPlaceholder").classList.remove("hidden");
}

export function hidePlaceholder() {
  document.getElementById("analysisPlaceholder").classList.add("hidden");
}

export function showLoading() {
  document.getElementById("analysisLoading").classList.remove("hidden");
  hidePlaceholder();
  document.getElementById("rating").classList.add("hidden");
  document.getElementById("dealScore").classList.add("hidden");
  hideResult();
}

export function hideLoading() {
  document.getElementById("analysisLoading").classList.add("hidden");
}

export function resetAnalysisUI() {
  document.getElementById("rating").classList.add("hidden");
  document.getElementById("dealScore").classList.add("hidden");
  document.getElementById("dealScore").innerHTML = "";
  hideResult();
  showPlaceholder();
}

/**
 * Displays all calculated values and the investment rating.
 *
 * @param {object} result
 * @param {object} rating
 * @param {object} dealScore
 * @param {object} data
 */
export function displayResult(result, rating, dealScore, data) {
  const text =
    "Bruttomietrendite: " + result.grossYield.toFixed(2) + " %\n" +
    "Monatlicher Cashflow: " + euro(result.monthlyCashflow) + "\n" +
    "Monatliche Bankrate: " + euro(result.monthlyDebtService) + "\n" +
    "Cashflow nach Finanzierung: " + euro(result.realCashflow) + "\n" +
    "Vermögenszuwachs/Monat: " + euro(result.monthlyWealthGain) + "\n" +
    "Restschuld nach " + data.years + " Jahren: " + euro(result.remainingDebt) + "\n" +
    "\n--- Nach Anschlussfinanzierung ---\n" +
    "Neue Bankrate: " + euro(result.futureMonthlyRate) + "\n" +
    "Neuer Cashflow: " + euro(result.futureCashflow) + "\n" +
    "Eigenkapitalrendite: " + result.returnOnEquity.toFixed(2) + " %";

  showResult(text);

  const ratingEl = document.getElementById("rating");
  ratingEl.innerText = rating.text;
  ratingEl.className = rating.className;
  ratingEl.classList.remove("hidden");

  renderScore(dealScore);
}

/**
 * Renders the deal score as an animated score card.
 * @param {{score:number,label:string,className:string}} dealScore
 */
function renderScore(dealScore) {
  const container = document.getElementById("dealScore");
  if (!container) return;

  container.classList.remove("hidden");

  let tone = "ok";
  if (dealScore.className === "score-good") tone = "good";
  if (dealScore.className === "score-bad") tone = "bad";

  container.innerHTML = `
    <div class="score-top">
      <div class="score-title">Deal Score</div>
      <div id="scoreNumber" class="score-number">0 / 100</div>
    </div>

    <div class="score-bar">
      <div id="scoreFill" class="score-fill ${tone}" style="width:0%"></div>
    </div>

    <div class="score-label ${tone}">${dealScore.label}</div>
  `;

  const fill = document.getElementById("scoreFill");
  const number = document.getElementById("scoreNumber");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.width = dealScore.score + "%";
    });
  });

  animateScoreNumber(number, dealScore.score, 900);
}

/**
 * Animates the numeric score from 0 to target value.
 *
 * @param {HTMLElement} element
 * @param {number} target
 * @param {number} duration
 */
function animateScoreNumber(element, target, duration) {
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;

    const progress = timestamp - start;
    const percent = Math.min(progress / duration, 1);
    const eased = 1 - Math.pow(1 - percent, 3);

    const value = Math.floor(eased * target);
    element.textContent = value + " / 100";

    if (percent < 1) requestAnimationFrame(step);
    else element.textContent = target + " / 100";
  }

  requestAnimationFrame(step);
}