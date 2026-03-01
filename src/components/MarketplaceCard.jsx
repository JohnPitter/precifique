import { useState } from "react";
import { formatBRL } from "../lib/pricing";

export default function MarketplaceCard({ marketplace, result }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) return null;

  const { salePrice, totalCost, fees, profit, actualMargin } = result;
  const isProfit = profit > 0;

  const colorMap = {
    shopee: {
      border: "border-shopee/30",
      bg: "bg-shopee-bg",
      badge: "bg-shopee text-white",
      accent: "text-shopee",
    },
    ml: {
      border: "border-ml-text/20",
      bg: "bg-ml-bg",
      badge: "bg-ml text-ml-text",
      accent: "text-ml-text",
    },
  };
  const colors = colorMap[marketplace.color];

  return (
    <div className={`bg-bg-card border ${colors.border} rounded-2xl overflow-hidden transition-all hover:shadow-md`}>
      {/* Header */}
      <div className={`${colors.bg} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{marketplace.icon}</span>
          <span className="font-bold">{marketplace.name}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
            {marketplace.badge}
          </span>
        </div>
        <span className={`text-xs font-medium ${colors.accent}`}>
          {(fees.commissionPct * 100).toFixed(0)}% + {fees.fixedFeeLabel}
        </span>
      </div>

      {/* Main price */}
      <div className="px-5 py-4">
        <div className="text-center mb-3">
          <p className="text-xs text-text-dim mb-0.5">Preço ideal de venda</p>
          <p className="text-3xl font-extrabold tracking-tight">{formatBRL(salePrice)}</p>
        </div>

        {/* Profit indicator */}
        <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl ${isProfit ? "bg-green-bg" : "bg-red-bg"}`}>
          <span className="text-lg">{isProfit ? "✅" : "⚠️"}</span>
          <div className="text-center">
            <p className="text-xs text-text-dim">Lucro por unidade</p>
            <p className={`text-lg font-bold ${isProfit ? "text-green" : "text-red"}`}>
              {formatBRL(profit)}
              <span className="text-sm ml-1">({actualMargin.toFixed(1)}%)</span>
            </p>
          </div>
        </div>

        {/* Pix info */}
        {marketplace.hasPix && fees.pixDiscount > 0 && (
          <div className="mt-3 bg-blue-bg border border-blue/20 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-blue font-medium">
              💠 Com Pix: taxas caem para {formatBRL(fees.totalFeesWithPix)}
              <span className="ml-1 text-text-dim">(economia de {formatBRL(fees.pixDiscount)})</span>
            </p>
          </div>
        )}

        {/* Toggle details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-xs text-text-dim mt-3 py-1 hover:text-primary transition-colors flex items-center justify-center gap-1"
        >
          {showDetails ? "▲ Ocultar detalhes" : "▼ Ver detalhes"}
        </button>

        {showDetails && (
          <div className="mt-2 space-y-1 text-sm">
            <DetailRow label="Custo total do produto" value={formatBRL(totalCost)} />
            <DetailRow label={`Comissão (${(fees.commissionPct * 100).toFixed(0)}%)`} value={formatBRL(fees.commission)} dim />
            <DetailRow label="Taxa fixa" value={fees.fixedFee > 0 ? formatBRL(fees.fixedFee) : "—"} dim />
            <DetailRow label="Total de taxas" value={formatBRL(fees.totalFees)} accent />
            <DetailRow label="Receita líquida" value={formatBRL(salePrice - fees.totalFees)} />
            <DetailRow label="Lucro" value={formatBRL(profit)} highlight={isProfit} />
          </div>
        )}

        {marketplace.note && (
          <p className="text-xs text-text-dim mt-3 text-center italic">{marketplace.note}</p>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, dim, accent, highlight }) {
  return (
    <div className="flex justify-between items-center py-1 px-2 rounded-lg odd:bg-bg-page/50">
      <span className={dim ? "text-text-dim" : ""}>{label}</span>
      <span className={`font-semibold tabular-nums ${accent ? "text-primary" : highlight ? "text-green" : ""}`}>
        {value}
      </span>
    </div>
  );
}
