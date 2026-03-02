import { describe, it, expect } from "vitest";
import { calcProductCost, calcIdealPrice, calcFromPrice, formatBRL } from "./pricing";
import { MARKETPLACES } from "./marketplaces";

function getMarketplace(id) {
  return MARKETPLACES.find((mp) => mp.id === id);
}

function makeCosts(productCost, taxRate = 0, extras = {}) {
  return { productCost, packaging: 0, labor: 0, shipping: 0, otherCosts: 0, taxRate, ...extras };
}

// ── calcProductCost ─────────────────────────────────────────
describe("calcProductCost", () => {
  it("calculates subtotal without tax", () => {
    const r = calcProductCost(makeCosts(50));
    expect(r.subtotal).toBe(50);
    expect(r.tax).toBe(0);
    expect(r.total).toBe(50);
  });

  it("applies 6% tax rate", () => {
    const r = calcProductCost(makeCosts(100, 6));
    expect(r.subtotal).toBe(100);
    expect(r.tax).toBeCloseTo(6, 2);
    expect(r.total).toBeCloseTo(106, 2);
  });

  it("sums all cost fields", () => {
    const r = calcProductCost({
      productCost: 50, packaging: 3, labor: 2, shipping: 10, otherCosts: 5, taxRate: 0,
    });
    expect(r.subtotal).toBe(70);
    expect(r.total).toBe(70);
  });

  it("applies tax on full subtotal (all fields)", () => {
    const r = calcProductCost({
      productCost: 73.61, packaging: 5, labor: 3, shipping: 15, otherCosts: 2, taxRate: 6,
    });
    const expectedSubtotal = 73.61 + 5 + 3 + 15 + 2;
    expect(r.subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(r.tax).toBeCloseTo(expectedSubtotal * 0.06, 2);
    expect(r.total).toBeCloseTo(expectedSubtotal * 1.06, 2);
  });

  it("returns zero for zero cost", () => {
    const r = calcProductCost(makeCosts(0, 6));
    expect(r.total).toBe(0);
  });

  it("handles high tax rate (30%)", () => {
    const r = calcProductCost(makeCosts(100, 30));
    expect(r.total).toBeCloseTo(130, 2);
  });
});

// ── calcFromPrice (reverse calculation) ─────────────────────
describe("calcFromPrice", () => {
  it("user scenario: R$140 Shopee CNPJ, cost R$73.61, tax 0%", () => {
    const mp = getMarketplace("shopee-cnpj");
    const r = calcFromPrice(140, makeCosts(73.61), mp);

    expect(r.fees.totalFees).toBeCloseTo(39.6, 2);
    expect(r.netRevenue).toBeCloseTo(100.40, 2);
    expect(r.totalCost).toBeCloseTo(73.61, 2);
    expect(r.profit).toBeCloseTo(26.79, 2);
  });

  it("user scenario: R$140 Shopee CNPJ, cost R$73.61, tax 6%", () => {
    const mp = getMarketplace("shopee-cnpj");
    const r = calcFromPrice(140, makeCosts(73.61, 6), mp);

    expect(r.netRevenue).toBeCloseTo(100.40, 2);
    expect(r.totalCost).toBeCloseTo(78.0266, 1);
    expect(r.profit).toBeCloseTo(22.37, 1);
  });

  it("returns negative profit when cost exceeds net revenue", () => {
    const mp = getMarketplace("shopee-cnpj");
    const r = calcFromPrice(50, makeCosts(100), mp);
    // R$50: 20% + R$4 = R$14 fees, net = R$36, profit = 36 - 100 = -64
    expect(r.profit).toBeCloseTo(-64, 2);
    expect(r.actualMargin).toBeLessThan(0);
  });

  it("handles zero sale price gracefully", () => {
    const mp = getMarketplace("shopee-cnpj");
    const r = calcFromPrice(0, makeCosts(50), mp);
    expect(r.actualMargin).toBe(0);
  });

  it("works correctly for all marketplace types", () => {
    for (const mp of MARKETPLACES) {
      const r = calcFromPrice(100, makeCosts(50), mp);
      expect(r.netRevenue).toBeLessThan(100);
      expect(r.fees.totalFees).toBeGreaterThan(0);
      expect(r.profit).toBeLessThan(50);
    }
  });

  it("R$140 Shopee CPF: higher fees due to CPF extra", () => {
    const mp = getMarketplace("shopee-cpf");
    const r = calcFromPrice(140, makeCosts(73.61), mp);

    expect(r.fees.totalFees).toBeCloseTo(42.6, 2); // 39.6 + 3
    expect(r.netRevenue).toBeCloseTo(97.40, 2);
    expect(r.profit).toBeCloseTo(23.79, 2);
  });

  it("R$140 ML Clássico: 13% + no fixed fee", () => {
    const mp = getMarketplace("ml-classico");
    const r = calcFromPrice(140, makeCosts(73.61), mp);

    expect(r.fees.commission).toBeCloseTo(18.2, 2);
    expect(r.fees.fixedFee).toBe(0);
    expect(r.fees.totalFees).toBeCloseTo(18.2, 2);
    expect(r.netRevenue).toBeCloseTo(121.8, 2);
    expect(r.profit).toBeCloseTo(48.19, 2);
  });

  it("R$140 ML Premium: 18% + no fixed fee", () => {
    const mp = getMarketplace("ml-premium");
    const r = calcFromPrice(140, makeCosts(73.61), mp);

    expect(r.fees.commission).toBeCloseTo(25.2, 2);
    expect(r.fees.fixedFee).toBe(0);
    expect(r.netRevenue).toBeCloseTo(114.8, 2);
    expect(r.profit).toBeCloseTo(41.19, 2);
  });
});

// ── calcIdealPrice (forward calculation) ────────────────────
describe("calcIdealPrice", () => {
  it("converges to valid price for 30% margin on Shopee CNPJ", () => {
    const mp = getMarketplace("shopee-cnpj");
    const r = calcIdealPrice(makeCosts(50, 6), 30, mp);

    expect(r.salePrice).toBeGreaterThan(0);
    expect(r.actualMargin).toBeCloseTo(30, 0);
    expect(r.profit).toBeGreaterThan(0);
  });

  it("round-trip with calcFromPrice gives consistent profit", () => {
    const mp = getMarketplace("shopee-cnpj");
    const costs = makeCosts(73.61);
    const ideal = calcIdealPrice(costs, 20, mp);
    const reverse = calcFromPrice(ideal.salePrice, costs, mp);

    expect(Math.abs(reverse.profit - ideal.profit)).toBeLessThan(1);
  });

  it("works across all marketplaces", () => {
    for (const mp of MARKETPLACES) {
      const r = calcIdealPrice(makeCosts(50), 30, mp);
      expect(r.salePrice).toBeGreaterThan(50);
      expect(r.profit).toBeGreaterThan(0);
    }
  });

  it("handles high margin requests", () => {
    const mp = getMarketplace("ml-premium");
    const r = calcIdealPrice(makeCosts(10), 60, mp);
    expect(r.salePrice).toBeGreaterThan(10);
    expect(r.profit).toBeGreaterThan(0);
  });

  it("handles very low cost products", () => {
    const mp = getMarketplace("shopee-cnpj");
    const r = calcIdealPrice(makeCosts(5), 20, mp);
    expect(r.salePrice).toBeGreaterThan(5);
  });

  it("includes tax in total cost", () => {
    const mp = getMarketplace("shopee-cnpj");
    const withTax = calcIdealPrice(makeCosts(100, 10), 30, mp);
    const noTax = calcIdealPrice(makeCosts(100, 0), 30, mp);

    expect(withTax.totalCost).toBeGreaterThan(noTax.totalCost);
    expect(withTax.salePrice).toBeGreaterThan(noTax.salePrice);
  });
});

// ── formatBRL ───────────────────────────────────────────────
describe("formatBRL", () => {
  it("formats positive values", () => {
    const r = formatBRL(26.79);
    expect(r).toContain("26,79");
    expect(r).toContain("R$");
  });

  it("formats negative values", () => {
    const r = formatBRL(-10.5);
    expect(r).toContain("10,50");
  });

  it("formats zero", () => {
    const r = formatBRL(0);
    expect(r).toContain("0,00");
  });

  it("formats large values with thousands separator", () => {
    const r = formatBRL(1234.56);
    expect(r).toContain("1.234,56");
  });
});
