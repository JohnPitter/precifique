import { useState } from "react";
import { formatBRL, getValueTextClass } from "../lib/pricing";

const TONE_MAP = {
  shopee: {
    ring: "border-shopee/20",
    mark: "bg-shopee/12 text-shopee",
    surface: "bg-[linear-gradient(135deg,rgba(238,77,45,0.16),rgba(255,255,255,0.06))]",
    pill: "bg-shopee text-white",
    accent: "text-shopee",
  },
  ml: {
    ring: "border-ml-text/15",
    mark: "bg-ml/55 text-ml-text",
    surface: "bg-[linear-gradient(135deg,rgba(255,230,0,0.35),rgba(255,255,255,0.08))]",
    pill: "bg-ml text-ml-text",
    accent: "text-ml-text",
  },
};

export default function MarketplaceCard({ marketplace, result, index = 0 }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) return null;

  const { salePrice, totalCost, fees, profit, actualMargin } = result;
  const isProfit = profit > 0;
  const tone = TONE_MAP[marketplace.color];
  const mark = marketplace.id.startsWith("shopee") ? "SP" : "ML";
  const salePriceLabel = formatBRL(salePrice);
  const profitLabel = formatBRL(profit);
  const salePriceClass = getValueTextClass(salePriceLabel, "display");
  const profitClass = getValueTextClass(profitLabel, "hero");

  return (
    <section
      className={`animate-rise rounded-[1.8rem] border ${tone.ring} bg-white/82 p-5 shadow-[0_18px_45px_rgba(16,35,61,0.06)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-display text-sm font-bold ${tone.mark}`}>
            {mark}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              {marketplace.name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h3 className="break-words font-display text-2xl font-bold tracking-tight text-ink">
                {marketplace.badge}
              </h3>
              <span className={`max-w-full break-words rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] ${tone.pill}`}>
                {(fees.commissionPct * 100).toFixed(0)}% + {fees.fixedFeeLabel}
              </span>
            </div>
          </div>
        </div>

        <span
          className={`self-start rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] ${
            isProfit ? "bg-green/12 text-green" : "bg-danger/12 text-danger"
          }`}
        >
          {isProfit ? "Margem positiva" : "Rever preco"}
        </span>
      </div>

      <div className={`animate-sheen mt-5 rounded-[1.6rem] ${tone.surface} p-5`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
          Preco recomendado
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className={`whitespace-nowrap font-display font-bold tracking-tight leading-tight tabular-nums text-ink ${salePriceClass}`}>
              {salePriceLabel}
            </p>
            <p className="mt-2 break-words text-sm leading-6 text-ink-soft">
              Receita liquida estimada em {formatBRL(salePrice - fees.totalFees)}
            </p>
          </div>
          <div className="min-w-0 text-left sm:text-right">
            <p className={`whitespace-nowrap font-display font-bold leading-tight tabular-nums ${profitClass} ${isProfit ? "text-green" : "text-danger"}`}>
              {profitLabel}
            </p>
            <p className="mt-1 break-words text-xs uppercase tracking-[0.16em] text-ink-soft">
              {actualMargin.toFixed(1)}% de margem real
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MetricCard label="Custo total" value={formatBRL(totalCost)} />
        <MetricCard label="Total de taxas" value={formatBRL(fees.totalFees)} accent={tone.accent} />
        <MetricCard label="Comissao" value={formatBRL(fees.commission)} />
        <MetricCard label="Taxa fixa" value={fees.fixedFee > 0 ? formatBRL(fees.fixedFee) : "Sem taxa fixa"} />
      </div>

      {marketplace.hasPix && fees.pixDiscount > 0 && (
        <div className="mt-4 rounded-[1.4rem] border border-sky/20 bg-sky/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
            Subsidio Pix
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-soft">
              Taxas caem para {formatBRL(fees.totalFeesWithPix)} quando o pagamento entra por Pix.
            </p>
            <p className="text-sm font-semibold text-sky-700">
              Economia de {formatBRL(fees.pixDiscount)}
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="mt-4 inline-flex max-w-full flex-wrap items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-accent"
      >
        <span className="rounded-full border border-ink/10 px-3 py-1">
          {marketplace.badge}
        </span>
        {showDetails ? "Ocultar estrutura" : "Detalhar estrutura"}
      </button>

      {showDetails && (
        <div className="mt-4 space-y-2 rounded-[1.4rem] border border-ink/10 bg-bg-input/70 p-4 text-sm">
          <DetailRow label="Receita liquida" value={formatBRL(salePrice - fees.totalFees)} />
          <DetailRow label={`Comissao (${(fees.commissionPct * 100).toFixed(0)}%)`} value={formatBRL(fees.commission)} dim />
          <DetailRow label="Taxa fixa" value={fees.fixedFee > 0 ? formatBRL(fees.fixedFee) : "Sem taxa fixa"} dim />
          <DetailRow label="Lucro projetado" value={formatBRL(profit)} highlight={isProfit} />
          {marketplace.note && <p className="pt-2 text-xs text-ink-soft">{marketplace.note}</p>}
        </div>
      )}
    </section>
  );
}

function MetricCard({ label, value, accent }) {
  const valueClass = getValueTextClass(value);

  return (
    <div className="min-w-0 rounded-[1.2rem] border border-ink/10 bg-bg-input/75 p-4">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">{label}</p>
      <p className={`mt-2 whitespace-nowrap font-semibold leading-tight tabular-nums text-ink ${valueClass} ${accent ?? ""}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value, dim, accent, highlight }) {
  const valueClass = getValueTextClass(value);

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-white/70 px-3 py-2">
      <span className={`min-w-0 break-words ${dim ? "text-ink-soft" : "text-ink"}`}>{label}</span>
      <span className={`min-w-0 whitespace-nowrap text-right font-semibold tabular-nums ${valueClass} ${accent ? accent : highlight ? "text-green" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}
