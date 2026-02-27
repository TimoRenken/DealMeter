import { euro } from "./utils.js";
import { state } from "./state.js";
import { calculateDeal } from "./dealMath.js";
import { rateDeal, calculateDealScore } from "./dealRating.js";

/**
 * Renders a saved deal inside the "saved deals" list.
 */
function addDealToList(data, result, rating, id, dealScore, rank, isTop) {
  const container = document.getElementById("savedDeals");

  const entry = document.createElement("div");
  entry.classList.add("dealEntry");

  const scoreValue = dealScore?.score ?? 0;
  const scoreLabel = dealScore?.label ?? "";
  const scoreClass = dealScore?.className ?? "score-ok";

  entry.innerHTML = `
    <hr>
    <div class="dealHead">
      <div class="dealRank">
        <b>#${rank}</b>
        ${isTop ? `<span class="topBadge">Top Deal</span>` : ""}
      </div>
      <div class="scoreBadge ${scoreClass}">${scoreValue}/100</div>
    </div>
    <div class="dealSub">${scoreLabel}</div>
    <b>Kaufpreis:</b> ${euro(data.price)}<br>
    <b>Miete/Monat:</b> ${euro(data.rent)}<br>
    <b>Bruttorendite:</b> ${result.grossYield.toFixed(2)} %<br>
    <b>Cashflow nach Finanzierung:</b> ${euro(result.realCashflow)}<br>
    <b>Eigenkapitalrendite:</b> ${result.returnOnEquity.toFixed(2)} %<br>
    <b>Bewertung:</b> ${rating.text}<br><br>

    <button class="editBtn savedDealBtn" data-id="${id}">Bearbeiten</button>
    <button class="deleteBtn savedDealBtn" data-id="${id}">Löschen</button>
  `;

  container.appendChild(entry);
}

function sortDeals(deals, mode) {
  const copy = [...deals];
  const desc = (a, b, getter) => (getter(b) ?? -Infinity) - (getter(a) ?? -Infinity);

  if (mode === "scoreDesc") return copy.sort((a, b) => desc(a, b, d => d.dealScore?.score));
  if (mode === "cashflowDesc") return copy.sort((a, b) => desc(a, b, d => d.result?.realCashflow));
  if (mode === "roeDesc") return copy.sort((a, b) => desc(a, b, d => d.result?.returnOnEquity));
  if (mode === "yieldDesc") return copy.sort((a, b) => desc(a, b, d => d.result?.grossYield));

  return copy;
}

export function loadDeals() {
  let deals = JSON.parse(localStorage.getItem("deals")) || [];

  for (const deal of deals) {
    if (!deal.result) deal.result = calculateDeal(deal.data);
    if (!deal.rating) deal.rating = rateDeal(deal.result);
    if (!deal.dealScore) deal.dealScore = calculateDealScore(deal.result);
  }

  const select = document.getElementById("sortDeals");
  const mode = select ? select.value : "scoreDesc";

  deals = sortDeals(deals, mode);

  const container = document.getElementById("savedDeals");
  container.innerHTML = "";

  const topId = (mode === "scoreDesc" && deals.length > 0) ? deals[0].id : null;

  deals.forEach((deal, index) => {
    addDealToList(deal.data, deal.result, deal.rating, deal.id, deal.dealScore, index + 1, deal.id === topId);
  });

  localStorage.setItem("deals", JSON.stringify(deals));
}

function deleteDeal(id) {
  let deals = JSON.parse(localStorage.getItem("deals")) || [];
  deals = deals.filter(deal => deal.id !== id);
  localStorage.setItem("deals", JSON.stringify(deals));
  loadDeals();
}

export function editDeal(id) {
  const deals = JSON.parse(localStorage.getItem("deals")) || [];
  const deal = deals.find(d => d.id === id);
  if (!deal) return;

  document.getElementById("price").value = deal.data.price;
  document.getElementById("equity").value = deal.data.equity;
  document.getElementById("rent").value = deal.data.rent;
  document.getElementById("costs").value = deal.data.costs;
  document.getElementById("interest").value = deal.data.interest;
  document.getElementById("repayment").value = deal.data.repayment;
  document.getElementById("years").value = deal.data.years;
  document.getElementById("futureInterest").value = deal.data.futureInterest;

  state.currentEditId = id;
  document.getElementById("saveDealBtn").innerText = "Änderungen speichern";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function initStorageUi() {
  loadDeals();

  const container = document.getElementById("savedDeals");
  container.addEventListener("click", (event) => {
    const id = Number(event.target.dataset.id);

    if (event.target.classList.contains("deleteBtn")) deleteDeal(id);
    if (event.target.classList.contains("editBtn")) editDeal(id);
  });

  const sortSelect = document.getElementById("sortDeals");
  if (sortSelect) sortSelect.addEventListener("change", loadDeals);
}