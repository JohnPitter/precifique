/**
 * Marketplace commission data — Shopee (Mar 2026) & Mercado Livre (2026).
 *
 * Each marketplace exports a calculator function:
 *   calculate(salePrice) → { commission, fixedFee, totalFees }
 */

// ── Shopee CNPJ ─────────────────────────────────────────────
const SHOPEE_CNPJ_TIERS = [
  { maxPrice: 79.99, pct: 0.20, fixed: 4 },
  { maxPrice: 99.99, pct: 0.14, fixed: 16 },
  { maxPrice: 199.99, pct: 0.14, fixed: 20 },
  { maxPrice: 499.99, pct: 0.14, fixed: 26 },
  { maxPrice: Infinity, pct: 0.14, fixed: 28 },
];

const SHOPEE_PIX_SUBSIDY = [
  { maxPrice: 79.99, pct: 0 },
  { maxPrice: 99.99, pct: 0.05 },
  { maxPrice: 199.99, pct: 0.05 },
  { maxPrice: 499.99, pct: 0.05 },
  { maxPrice: Infinity, pct: 0.08 },
];

function shopeeGetTier(price, tiers) {
  return tiers.find((t) => price <= t.maxPrice) || tiers[tiers.length - 1];
}

function calcShopeeCNPJ(salePrice) {
  const tier = shopeeGetTier(salePrice, SHOPEE_CNPJ_TIERS);
  const commission = salePrice * tier.pct;
  const fixedFee = tier.fixed;
  const totalFees = commission + fixedFee;
  const pixTier = shopeeGetTier(salePrice, SHOPEE_PIX_SUBSIDY);
  const pixDiscount = salePrice * pixTier.pct;
  return {
    commission,
    fixedFee,
    totalFees,
    pixDiscount,
    totalFeesWithPix: totalFees - pixDiscount,
    commissionPct: tier.pct,
    fixedFeeLabel: `R$${tier.fixed}`,
  };
}

// ── Shopee CPF ──────────────────────────────────────────────
// Taxas idênticas ao CNPJ (confirmado com dados reais Mar/2026)
function calcShopeeCPF(salePrice) {
  return calcShopeeCNPJ(salePrice);
}

// ── Mercado Livre Clássico ──────────────────────────────────
const ML_CLASSICO_TIERS = [
  { maxPrice: 79, pct: 0.14, fixed: 6.5 },
  { maxPrice: 199, pct: 0.13, fixed: 0 },
  { maxPrice: Infinity, pct: 0.10, fixed: 0 },
];

function calcMLClassico(salePrice) {
  const tier = ML_CLASSICO_TIERS.find((t) => salePrice <= t.maxPrice) || ML_CLASSICO_TIERS[ML_CLASSICO_TIERS.length - 1];
  const commission = salePrice * tier.pct;
  const fixedFee = tier.fixed;
  const totalFees = commission + fixedFee;
  return {
    commission,
    fixedFee,
    totalFees,
    pixDiscount: 0,
    totalFeesWithPix: totalFees,
    commissionPct: tier.pct,
    fixedFeeLabel: tier.fixed > 0 ? `R$${tier.fixed.toFixed(2)}` : "—",
  };
}

// ── Mercado Livre Premium ───────────────────────────────────
const ML_PREMIUM_TIERS = [
  { maxPrice: 79, pct: 0.19, fixed: 0 },
  { maxPrice: 199, pct: 0.18, fixed: 0 },
  { maxPrice: Infinity, pct: 0.15, fixed: 0 },
];

function calcMLPremium(salePrice) {
  const tier = ML_PREMIUM_TIERS.find((t) => salePrice <= t.maxPrice) || ML_PREMIUM_TIERS[ML_PREMIUM_TIERS.length - 1];
  const commission = salePrice * tier.pct;
  const totalFees = commission;
  return {
    commission,
    fixedFee: 0,
    totalFees,
    pixDiscount: 0,
    totalFeesWithPix: totalFees,
    commissionPct: tier.pct,
    fixedFeeLabel: "—",
  };
}

// ── Exports ─────────────────────────────────────────────────
export const MARKETPLACES = [
  {
    id: "shopee-cnpj",
    name: "Shopee",
    badge: "CNPJ",
    color: "shopee",
    icon: "🛒",
    calculate: calcShopeeCNPJ,
    hasPix: true,
  },
  {
    id: "shopee-cpf",
    name: "Shopee",
    badge: "CPF",
    color: "shopee",
    icon: "🛒",
    calculate: calcShopeeCPF,
    hasPix: true,
  },
  {
    id: "ml-classico",
    name: "Mercado Livre",
    badge: "Clássico",
    color: "ml",
    icon: "🤝",
    calculate: calcMLClassico,
    hasPix: false,
  },
  {
    id: "ml-premium",
    name: "Mercado Livre",
    badge: "Premium",
    color: "ml",
    icon: "⭐",
    calculate: calcMLPremium,
    hasPix: false,
    note: "Parcelamento até 10x sem juros",
  },
];
