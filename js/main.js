import "./devTools.js";
import { state } from "./state.js";
import { getInputs, createDealData, clearInputs } from "./dealInput.js";
import { calculateDeal } from "./dealMath.js";
import { rateDeal, calculateDealScore } from "./dealRating.js";
import { displayResult, hideLoading, showLoading, resetAnalysisUI, showResult } from "./analysisUi.js";
import { generateId } from "./utils.js";
import { initStorageUi, loadDeals } from "./storage.js";

/**
 * Main entry point of the calculation.
 */
function calculate() {
  const rawInputs = getInputs();
  const data = createDealData(rawInputs);

  if (data.price <= 0 || data.rent <= 0 || data.costs < 0 || isNaN(data.price) || isNaN(data.rent)) {
    hideLoading();
    showResult("Bitte gültige Werte eingeben.");
    return;
  }

  showLoading();

  setTimeout(() => {
    const result = calculateDeal(data);
    const rating = rateDeal(result);
    const dealScore = calculateDealScore(result);

    hideLoading();
    displayResult(result, rating, dealScore, data);
  }, 650);
}

/**
 * Saves or updates the currently entered deal.
 */
function saveDeal() {
  const rawInputs = getInputs();
  const data = createDealData(rawInputs);

  if (data.price <= 0 || data.rent <= 0 || data.costs < 0 || isNaN(data.price) || isNaN(data.rent)) {
    alert("Erst korrekt berechnen!");
    return;
  }

  const result = calculateDeal(data);
  const rating = rateDeal(result);
  const dealScore = calculateDealScore(result);

  const deals = JSON.parse(localStorage.getItem("deals")) || [];

  if (state.currentEditId !== null) {
    const index = deals.findIndex(d => d.id === state.currentEditId);
    if (index !== -1) deals[index] = { id: state.currentEditId, data, result, rating, dealScore };

    state.currentEditId = null;
    document.getElementById("saveDealBtn").innerText = "Berechnung speichern";
  } else {
    const id = generateId();
    deals.push({ id, data, result, rating, dealScore });
  }

  localStorage.setItem("deals", JSON.stringify(deals));

  loadDeals();
  clearInputs();
  resetAnalysisUI();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("saveDealBtn").addEventListener("click", saveDeal);
  document.getElementById("calculateBtn").addEventListener("click", calculate);

  initStorageUi();
});