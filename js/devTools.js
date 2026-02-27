import { createDealData, getInputs } from "./dealInput.js";
import { calculateDeal } from "./dealMath.js";
import { rateDeal, calculateDealScore } from "./dealRating.js";

/**
 * Fills the form with demo data.
 * Useful for quick testing and debugging.
 */
function test() {
    document.getElementById("price").value = 200000;
    document.getElementById("equity").value = 20000;
    document.getElementById("rent").value = 1500;
    document.getElementById("costs").value = 300;
    document.getElementById("interest").value = 3;
    document.getElementById("repayment").value = 2;
    document.getElementById("years").value = 10;
    document.getElementById("futureInterest").value = 6;
}

/**
 * Runs a full calculation directly from console.
 */
function quickCalc() {
    const data = createDealData(getInputs());
    const result = calculateDeal(data);
    const rating = rateDeal(result);
    const score = calculateDealScore(result);

    console.log("RESULT:", result);
    console.log("RATING:", rating);
    console.log("SCORE:", score);
}

/* ---- expose to browser console ---- */
window.test = test;
window.quickCalc = quickCalc;