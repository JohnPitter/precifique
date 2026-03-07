import { getValueTextClass } from "../lib/pricing";

const FIELDS = [
  {
    key: "productCost",
    label: "Custo do produto",
    placeholder: "50.00",
    help: "Valor pago no item ou na producao da unidade.",
  },
  {
    key: "packaging",
    label: "Embalagem",
    placeholder: "3.00",
    help: "Caixa, fita, protecao e itens de expedicao.",
  },
  {
    key: "labor",
    label: "Mao de obra",
    placeholder: "2.00",
    help: "Tempo operacional distribuido por unidade.",
  },
  {
    key: "shipping",
    label: "Frete estimado",
    placeholder: "15.00",
    help: "Custo medio quando o envio precisa ser absorvido.",
  },
  {
    key: "otherCosts",
    label: "Outros custos",
    placeholder: "0.00",
    help: "Marketing, energia, aluguel e outras despesas rateadas.",
  },
];

export default function CostForm({ costs, onChange, marginPct, onMarginChange, taxRate, onTaxChange }) {
  function handleChange(key, value) {
    const num = value === "" ? 0 : parseFloat(value);
    if (!isNaN(num)) onChange({ ...costs, [key]: num });
  }

  const totalCost = Object.values(costs).reduce((s, v) => s + v, 0);
  const taxValue = totalCost * taxRate / 100;
  const totalWithTax = totalCost + taxValue;

  return (
    <section className="animate-rise rounded-[2rem] border border-white/70 bg-surface/85 p-5 shadow-panel backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-accent">
            Painel de custos
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
            Monte o seu cenario
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-ink-soft">
            Lance o custo completo da unidade e diga qual margem minima precisa proteger.
          </p>
        </div>

        <div className="rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Shopee + Mercado Livre
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {FIELDS.map((field) => (
          <InputField
            key={field.key}
            field={field}
            value={costs[field.key]}
            onValueChange={(value) => handleChange(field.key, value)}
          />
        ))}
      </div>

      <div className="mt-8 space-y-5 border-t border-ink/10 pt-6">
        <RangeField
          label="Margem de lucro desejada"
          value={marginPct}
          min={5}
          max={100}
          step={1}
          onChange={onMarginChange}
          presets={[20, 30, 40, 55]}
        />

        <RangeField
          label="Imposto sobre a operacao"
          value={taxRate}
          min={0}
          max={30}
          step={0.5}
          onChange={onTaxChange}
          presets={[0, 6, 12, 18]}
        />
      </div>

      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
        <SummaryBox
          label="Base sem imposto"
          value={totalCost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        />
        <SummaryBox
          label="Imposto estimado"
          value={taxValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        />
        <SummaryBox
          label="Custo final"
          value={totalWithTax.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          highlight
        />
      </div>
    </section>
  );
}

function InputField({ field, value, onValueChange }) {
  return (
    <div className="rounded-[1.4rem] border border-ink/10 bg-white/80 p-4 shadow-[0_10px_30px_rgba(16,35,61,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <label className="text-sm font-semibold text-ink">{field.label}</label>
          <p className="mt-1 text-xs leading-5 text-ink-soft">{field.help}</p>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-accent">
          R$
        </span>
      </div>

      <div className="relative mt-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-soft">
          R$
        </span>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full rounded-[1.1rem] border border-ink/10 bg-bg-input pl-12 pr-4 py-3 text-[clamp(0.95rem,1.3vw,1.05rem)] font-semibold text-ink transition-all focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
        />
      </div>
    </div>
  );
}

function RangeField({ label, value, min, max, step, onChange, presets }) {
  return (
    <div className="rounded-[1.5rem] border border-ink/10 bg-white/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <label className="text-sm font-semibold text-ink">{label}</label>
          <p className="mt-1 text-xs leading-5 text-ink-soft">
            Ajuste fino com slider e atalho rapido.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-bg-input px-3 py-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className="w-14 bg-transparent text-right text-lg font-bold text-ink outline-none"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-sm font-semibold text-ink-soft">%</span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 range-slider w-full"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
              value === preset
                ? "bg-ink text-white"
                : "border border-ink/10 bg-white text-ink-soft hover:border-accent/40 hover:text-accent"
            }`}
          >
            {preset}%
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryBox({ label, value, highlight }) {
  const valueClass = getValueTextClass(value, "summary");

  return (
    <div
      className={`min-w-0 rounded-[1.4rem] border p-4 ${
        highlight
          ? "border-accent/20 bg-accent/10"
          : "border-ink/10 bg-white/75"
      }`}
    >
      <p className={`text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${highlight ? "text-accent" : "text-ink-soft"}`}>
        {label}
      </p>
      <p className={`mt-2 whitespace-nowrap font-display font-bold tracking-tight leading-tight tabular-nums text-ink ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}
