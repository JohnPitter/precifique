import { describe, it, expect } from "vitest";
import { MARKETPLACES } from "./marketplaces";

function getCalc(id) {
  return MARKETPLACES.find((mp) => mp.id === id).calculate;
}

describe("Shopee CNPJ", () => {
  const calc = getCalc("shopee-cnpj");

  // ── Tier ≤R$79.99: 20% + R$4, sem subsídio PIX ──────────
  it("tier ≤R$79.99: 20% + R$4 fixed, no PIX subsidy", () => {
    const r = calc(50);
    expect(r.commissionPct).toBe(0.20);
    expect(r.commission).toBeCloseTo(10, 2);
    expect(r.fixedFee).toBe(4);
    expect(r.totalFees).toBeCloseTo(14, 2);
    expect(r.pixDiscount).toBeCloseTo(0, 2);
    expect(r.totalFeesWithPix).toBeCloseTo(14, 2);
  });

  it("boundary R$79.99 stays in first tier", () => {
    const r = calc(79.99);
    expect(r.commissionPct).toBe(0.20);
    expect(r.fixedFee).toBe(4);
    expect(r.pixDiscount).toBeCloseTo(0, 2);
  });

  // ── Tier R$80-99.99: 14% + R$16, 5% PIX ──────────────────
  it("tier R$80-99.99: 14% + R$16 fixed, 5% PIX", () => {
    const r = calc(80);
    expect(r.commissionPct).toBe(0.14);
    expect(r.commission).toBeCloseTo(11.2, 2);
    expect(r.fixedFee).toBe(16);
    expect(r.totalFees).toBeCloseTo(27.2, 2);
    expect(r.pixDiscount).toBeCloseTo(4, 2);
    expect(r.totalFeesWithPix).toBeCloseTo(23.2, 2);
  });

  // ── Tier R$100-199.99: 14% + R$20, 5% PIX ────────────────
  it("tier R$100-199.99: 14% + R$20 fixed, 5% PIX", () => {
    const r = calc(140);
    expect(r.commissionPct).toBe(0.14);
    expect(r.commission).toBeCloseTo(19.6, 2);
    expect(r.fixedFee).toBe(20);
    expect(r.totalFees).toBeCloseTo(39.6, 2);
    expect(r.pixDiscount).toBeCloseTo(7, 2);
    expect(r.totalFeesWithPix).toBeCloseTo(32.6, 2);
  });

  it("user scenario: R$140 sale → net R$100.40", () => {
    const r = calc(140);
    const netRevenue = 140 - r.totalFees;
    expect(netRevenue).toBeCloseTo(100.4, 2);
  });

  // ── Tier R$200-499.99: 14% + R$26, 5% PIX ────────────────
  it("tier R$200-499.99: 14% + R$26 fixed, 5% PIX", () => {
    const r = calc(300);
    expect(r.commissionPct).toBe(0.14);
    expect(r.commission).toBeCloseTo(42, 2);
    expect(r.fixedFee).toBe(26);
    expect(r.totalFees).toBeCloseTo(68, 2);
    expect(r.pixDiscount).toBeCloseTo(15, 2);
    expect(r.totalFeesWithPix).toBeCloseTo(53, 2);
  });

  it("boundary R$499.99 stays in R$200-499.99 tier", () => {
    const r = calc(499.99);
    expect(r.fixedFee).toBe(26);
  });

  // ── Tier >R$500: 14% + R$28, 8% PIX ──────────────────────
  it("tier >R$500: 14% + R$28 fixed, 8% PIX", () => {
    const r = calc(600);
    expect(r.commissionPct).toBe(0.14);
    expect(r.commission).toBeCloseTo(84, 2);
    expect(r.fixedFee).toBe(28);
    expect(r.totalFees).toBeCloseTo(112, 2);
    expect(r.pixDiscount).toBeCloseTo(48, 2);
    expect(r.totalFeesWithPix).toBeCloseTo(64, 2);
  });

  it("boundary R$500 falls to >R$500 tier", () => {
    const r = calc(500);
    expect(r.fixedFee).toBe(28);
    expect(r.pixDiscount).toBeCloseTo(40, 2);
  });
});

describe("Shopee CPF", () => {
  const calc = getCalc("shopee-cpf");

  it("adds R$3 CPF extra to tier R$100-199.99", () => {
    const r = calc(140);
    expect(r.cpfExtra).toBe(3);
    expect(r.fixedFee).toBe(23); // 20 + 3
    expect(r.totalFees).toBeCloseTo(42.6, 2); // 19.6 + 20 + 3
    expect(r.totalFeesWithPix).toBeCloseTo(35.6, 2); // 42.6 - 7
  });

  it("adds R$3 CPF extra to tier ≤R$79.99", () => {
    const r = calc(50);
    expect(r.fixedFee).toBe(7); // 4 + 3
    expect(r.totalFees).toBeCloseTo(17, 2); // 10 + 4 + 3
  });

  it("adds R$3 CPF extra to tier >R$500", () => {
    const r = calc(600);
    expect(r.fixedFee).toBe(31); // 28 + 3
    expect(r.totalFees).toBeCloseTo(115, 2); // 84 + 28 + 3
  });

  it("label includes CPF extra info", () => {
    const r = calc(140);
    expect(r.fixedFeeLabel).toContain("CPF");
  });
});

describe("Mercado Livre Clássico", () => {
  const calc = getCalc("ml-classico");

  it("tier ≤R$79: 14% + R$6.50 fixed", () => {
    const r = calc(50);
    expect(r.commissionPct).toBe(0.14);
    expect(r.commission).toBeCloseTo(7, 2);
    expect(r.fixedFee).toBe(6.5);
    expect(r.totalFees).toBeCloseTo(13.5, 2);
  });

  it("tier ≤R$79: fixedFeeLabel shows value", () => {
    const r = calc(50);
    expect(r.fixedFeeLabel).toBe("R$6.50");
  });

  it("tier R$80-199: 13% + NO fixed fee", () => {
    const r = calc(150);
    expect(r.commissionPct).toBe(0.13);
    expect(r.commission).toBeCloseTo(19.5, 2);
    expect(r.fixedFee).toBe(0);
    expect(r.totalFees).toBeCloseTo(19.5, 2);
  });

  it("tier R$80-199: fixedFeeLabel shows dash", () => {
    const r = calc(150);
    expect(r.fixedFeeLabel).toBe("—");
  });

  it("tier >R$199: 10% + NO fixed fee", () => {
    const r = calc(300);
    expect(r.commissionPct).toBe(0.10);
    expect(r.commission).toBeCloseTo(30, 2);
    expect(r.fixedFee).toBe(0);
    expect(r.totalFees).toBeCloseTo(30, 2);
  });

  it("has no PIX discount in any tier", () => {
    for (const price of [50, 150, 300]) {
      const r = calc(price);
      expect(r.pixDiscount).toBe(0);
      expect(r.totalFeesWithPix).toBe(r.totalFees);
    }
  });
});

describe("Mercado Livre Premium", () => {
  const calc = getCalc("ml-premium");

  it("tier ≤R$79: 19% commission, no fixed fee", () => {
    const r = calc(50);
    expect(r.commissionPct).toBe(0.19);
    expect(r.commission).toBeCloseTo(9.5, 2);
    expect(r.fixedFee).toBe(0);
    expect(r.totalFees).toBeCloseTo(9.5, 2);
  });

  it("tier R$80-199: 18% commission", () => {
    const r = calc(150);
    expect(r.commissionPct).toBe(0.18);
    expect(r.totalFees).toBeCloseTo(27, 2);
  });

  it("tier >R$199: 15% commission", () => {
    const r = calc(300);
    expect(r.commissionPct).toBe(0.15);
    expect(r.totalFees).toBeCloseTo(45, 2);
  });

  it("has no PIX discount", () => {
    const r = calc(200);
    expect(r.pixDiscount).toBe(0);
  });

  it("fixedFeeLabel is dash", () => {
    const r = calc(100);
    expect(r.fixedFeeLabel).toBe("—");
  });
});

describe("MARKETPLACES array", () => {
  it("has 4 marketplace entries", () => {
    expect(MARKETPLACES).toHaveLength(4);
  });

  it("each entry has required fields", () => {
    for (const mp of MARKETPLACES) {
      expect(mp).toHaveProperty("id");
      expect(mp).toHaveProperty("name");
      expect(mp).toHaveProperty("badge");
      expect(mp).toHaveProperty("calculate");
      expect(typeof mp.calculate).toBe("function");
    }
  });

  it("Shopee entries have hasPix=true", () => {
    const shopee = MARKETPLACES.filter((mp) => mp.id.startsWith("shopee"));
    for (const mp of shopee) {
      expect(mp.hasPix).toBe(true);
    }
  });

  it("ML entries have hasPix=false", () => {
    const ml = MARKETPLACES.filter((mp) => mp.id.startsWith("ml"));
    for (const mp of ml) {
      expect(mp.hasPix).toBe(false);
    }
  });
});
