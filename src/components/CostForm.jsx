import { useState } from "react";

const FIELDS = [
  { key: "productCost", label: "Custo do produto", placeholder: "50.00", icon: "📦", help: "Quanto você paga pelo produto" },
  { key: "packaging", label: "Embalagem", placeholder: "3.00", icon: "🎁", help: "Caixa, plástico bolha, fita" },
  { key: "labor", label: "Mão de obra por unidade", placeholder: "2.00", icon: "👷", help: "Custo de funcionário por produto" },
  { key: "shipping", label: "Frete estimado", placeholder: "15.00", icon: "🚚", help: "Custo médio de envio" },
  { key: "otherCosts", label: "Outros custos", placeholder: "0.00", icon: "📋", help: "Marketing, luz, aluguel rateado" },
];

export default function CostForm({ costs, onChange, marginPct, onMarginChange, taxRate, onTaxChange }) {
  const [expanded, setExpanded] = useState(false);

  function handleChange(key, value) {
    const num = value === "" ? 0 : parseFloat(value);
    if (!isNaN(num)) onChange({ ...costs, [key]: num });
  }

  const totalCost = Object.values(costs).reduce((s, v) => s + v, 0);
  const totalWithTax = totalCost * (1 + taxRate / 100);

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
        <span className="text-2xl">💰</span>
        Seus Custos
      </h2>
      <p className="text-sm text-text-dim mb-5">Preencha os custos do seu produto</p>

      <div className="space-y-3">
        {FIELDS.slice(0, 3).map((f) => (
          <InputField key={f.key} field={f} value={costs[f.key]} onValueChange={(v) => handleChange(f.key, v)} />
        ))}

        {expanded && FIELDS.slice(3).map((f) => (
          <InputField key={f.key} field={f} value={costs[f.key]} onValueChange={(v) => handleChange(f.key, v)} />
        ))}

        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full text-sm text-primary font-medium py-2 hover:text-primary-dark transition-colors"
          >
            + Mais custos (frete, outros)
          </button>
        )}
      </div>

      <div className="border-t border-border mt-5 pt-4 space-y-3">
        <div>
          <label className="text-sm font-medium text-text-dim flex items-center gap-1.5 mb-1">
            <span>🎯</span> Margem de lucro desejada
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max="100"
              value={marginPct}
              onChange={(e) => onMarginChange(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <div className="bg-bg-input border border-border rounded-lg px-3 py-1.5 min-w-[72px] text-center">
              <input
                type="number"
                value={marginPct}
                onChange={(e) => onMarginChange(Number(e.target.value) || 0)}
                className="w-10 bg-transparent text-center font-bold text-primary outline-none"
                min="1"
                max="500"
              />
              <span className="text-text-dim font-medium">%</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-text-dim flex items-center gap-1.5 mb-1">
            <span>🏛️</span> Imposto (Simples Nacional)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={taxRate}
              onChange={(e) => onTaxChange(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <div className="bg-bg-input border border-border rounded-lg px-3 py-1.5 min-w-[72px] text-center">
              <input
                type="number"
                value={taxRate}
                onChange={(e) => onTaxChange(Number(e.target.value) || 0)}
                className="w-10 bg-transparent text-center font-bold text-primary outline-none"
                min="0"
                max="50"
                step="0.5"
              />
              <span className="text-text-dim font-medium">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 bg-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-text-dim">Custo total por unidade</span>
          <span className="text-xl font-bold text-primary">
            {totalWithTax.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>
        {taxRate > 0 && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-text-dim">sem imposto: {totalCost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            <span className="text-xs text-text-dim">imposto: {(totalCost * taxRate / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ field, value, onValueChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-text-dim flex items-center gap-1.5 mb-1">
        <span>{field.icon}</span> {field.label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-sm font-medium">R$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full bg-bg-input border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium
                     focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
    </div>
  );
}
