import { formatBRL } from "../lib/pricing";

export default function ComparisonBar({ results }) {
  if (!results.length) return null;

  const sorted = [...results].sort((a, b) => a.result.profit - b.result.profit).reverse();
  const best = sorted[0];
  const maxProfit = Math.max(...results.map((r) => r.result.profit));
  const allNegative = maxProfit <= 0;

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Comparativo Rápido
      </h2>
      <p className="text-sm text-text-dim mb-4">
        {allNegative
          ? "Aumente o preço ou reduza custos — todos os canais dão prejuízo"
          : `Melhor opção: ${best.marketplace.name} ${best.marketplace.badge}`}
      </p>

      <div className="space-y-3">
        {sorted.map(({ marketplace, result }) => {
          const barWidth = maxProfit > 0
            ? Math.max(5, (Math.max(0, result.profit) / maxProfit) * 100)
            : 5;
          const isProfit = result.profit > 0;
          const isBest = marketplace.id === best.marketplace.id && isProfit;

          return (
            <div key={marketplace.id}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-1.5">
                  <span>{marketplace.icon}</span>
                  <span className="font-medium">{marketplace.name}</span>
                  <span className="text-xs text-text-dim">{marketplace.badge}</span>
                  {isBest && <span className="text-xs bg-green/10 text-green font-bold px-1.5 py-0.5 rounded-full">Melhor</span>}
                </div>
                <span className={`font-bold tabular-nums ${isProfit ? "text-green" : "text-red"}`}>
                  {formatBRL(result.profit)}
                </span>
              </div>
              <div className="w-full bg-bg-page rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isProfit ? (isBest ? "bg-green" : "bg-green/60") : "bg-red/40"}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-text-dim mt-0.5">
                <span>Venda: {formatBRL(result.salePrice)}</span>
                <span>Margem: {result.actualMargin.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
