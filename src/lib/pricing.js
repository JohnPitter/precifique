/**
 * Core pricing engine.
 *
 * Given product costs + desired margin, calculates the ideal sale price
 * for each marketplace. Also provides reverse calculation: given a sale
 * price, shows how much profit you actually make.
 */

/**
 * Calculate total cost of the product (before marketplace fees).
 */
export function calcProductCost({ productCost, packaging, labor, shipping, otherCosts, taxRate }) {
  const subtotal = productCost + packaging + labor + shipping + otherCosts;
  const tax = subtotal * (taxRate / 100);
  return { subtotal, tax, total: subtotal + tax };
}

/**
 * Forward calculation: given costs + margin, find the ideal sale price.
 *
 * sale_price = total_cost / (1 - margin - marketplace_commission)
 *
 * We need to iterate because the fixed fee and commission tier depend
 * on the final price.
 */
export function calcIdealPrice(costs, marginPct, marketplace) {
  const { total: totalCost } = calcProductCost(costs);
  const margin = marginPct / 100;

  // Iterative approach: start with a guess, refine
  let price = totalCost / (1 - margin - 0.14); // initial guess with ~14%
  for (let i = 0; i < 20; i++) {
    const fees = marketplace.calculate(price);
    const neededPrice = (totalCost + fees.fixedFee) / (1 - margin - fees.commissionPct);
    if (Math.abs(neededPrice - price) < 0.01) break;
    price = neededPrice;
  }

  // Final validation
  const fees = marketplace.calculate(price);
  const netRevenue = price - fees.totalFees;
  const profit = netRevenue - totalCost;
  const actualMargin = price > 0 ? (profit / price) * 100 : 0;

  return {
    salePrice: Math.ceil(price * 100) / 100,
    totalCost,
    fees,
    netRevenue,
    profit,
    actualMargin,
  };
}

/**
 * Reverse calculation: given a sale price, show profit breakdown.
 */
export function calcFromPrice(salePrice, costs, marketplace) {
  const { total: totalCost } = calcProductCost(costs);
  const fees = marketplace.calculate(salePrice);
  const netRevenue = salePrice - fees.totalFees;
  const profit = netRevenue - totalCost;
  const actualMargin = salePrice > 0 ? (profit / salePrice) * 100 : 0;

  return {
    salePrice,
    totalCost,
    fees,
    netRevenue,
    profit,
    actualMargin,
  };
}

/**
 * Format BRL currency.
 */
export function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
