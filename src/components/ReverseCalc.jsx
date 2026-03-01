import { useState } from "react";
import { MARKETPLACES } from "../lib/marketplaces";
import { calcFromPrice, formatBRL } from "../lib/pricing";

export default function ReverseCalc({ costs }) {
  const [salePrice, setSalePrice] = useState("");
  const price = parseFloat(salePrice) || 0;

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
        <span className="text-2xl">🔄</span>
        Cálculo Reverso
      </h2>
      <p className="text-sm text-text-dim mb-4">Já sabe o preço? Veja quanto sobra de lucro</p>

      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-sm font-medium">R$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Digite o preço de venda"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          className="w-full bg-bg-input border border-border rounded-xl pl-10 pr-4 py-3 text-lg font-bold
                     focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {price > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MARKETPLACES.map((mp) => {
            const r = calcFromPrice(price, costs, mp);
            const isProfit = r.profit > 0;
            return (
              <div key={mp.id} className={`border rounded-xl p-3 ${isProfit ? "border-green/30 bg-green-bg/50" : "border-red/30 bg-red-bg/50"}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span>{mp.icon}</span>
                  <span className="text-sm font-bold">{mp.name}</span>
                  <span className="text-xs text-text-dim">{mp.badge}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-dim">Taxas</p>
                    <p className="text-sm font-semibold text-text-dim">{formatBRL(r.fees.totalFees)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-dim">Lucro</p>
                    <p className={`text-lg font-bold ${isProfit ? "text-green" : "text-red"}`}>{formatBRL(r.profit)}</p>
                  </div>
                </div>
                <p className="text-xs text-text-dim mt-1 text-right">Margem: {r.actualMargin.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
