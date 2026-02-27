/**
 * Reads all values from the HTML input fields.
 * Returns raw string values exactly as entered by the user.
 * No parsing or validation happens here.
 */
export function getInputs() {
  return {
    price: document.getElementById("price").value,
    rent: document.getElementById("rent").value,
    costs: document.getElementById("costs").value,
    equity: document.getElementById("equity").value,
    interest: document.getElementById("interest").value,
    repayment: document.getElementById("repayment").value,
    years: document.getElementById("years").value,
    futureInterest: document.getElementById("futureInterest").value,
  };
}

/**
 * Converts raw string inputs from the UI into numeric values.
 * Ensures all calculation functions receive proper number types.
 */
export function createDealData(raw) {
  return {
    price: Number(raw.price),
    rent: Number(raw.rent),
    costs: Number(raw.costs),
    equity: Number(raw.equity),
    interest: Number(raw.interest),
    repayment: Number(raw.repayment),
    years: Number(raw.years),
    futureInterest: Number(raw.futureInterest),
  };
}

export function clearInputs() {
  document.getElementById("price").value = "";
  document.getElementById("equity").value = "";
  document.getElementById("rent").value = "";
  document.getElementById("costs").value = "";
  document.getElementById("interest").value = "";
  document.getElementById("repayment").value = "";
  document.getElementById("years").value = "";
  document.getElementById("futureInterest").value = "";
}