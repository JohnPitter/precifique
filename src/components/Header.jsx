import { formatBRL } from "../lib/pricing";

function formatPct(value) {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

export default function Header({ bestResult, marginPct, taxRate, totalWithTax }) {
  const bestName = bestResult
    ? `${bestResult.marketplace.name} ${bestResult.marketplace.badge}`
    : "Aguardando cenário";

  const profitShare = bestResult
    ? [
        {
          label: "Custos",
          value: Math.max(0, (bestResult.result.totalCost / bestResult.result.salePrice) * 100),
        },
        {
          label: "Taxas",
          value: Math.max(0, (bestResult.result.fees.totalFees / bestResult.result.salePrice) * 100),
        },
        {
          label: "Lucro",
          value: Math.max(0, (bestResult.result.profit / bestResult.result.salePrice) * 100),
        },
      ]
    : [
        { label: "Custos", value: 42 },
        { label: "Taxas", value: 18 },
        { label: "Lucro", value: 30 },
      ];

  return (
    <header className="px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="animate-rise rounded-[2.25rem] border border-white/70 bg-surface/80 p-4 shadow-panel backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-ink text-white shadow-[0_18px_45px_rgba(16,35,61,0.28)]">
                    <span className="font-display text-2xl font-bold">M</span>
                    <span className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-sun" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
                      Rebranding 2026
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
                      Margem
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  Dados comerciais | Marco 2026
                </div>
              </div>

              <div className="mt-10 max-w-3xl">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-accent">
                  Precificacao com clareza operacional
                </p>
                <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  Pare de chutar preco.
                  <span className="block text-accent">Modele margem com contexto de marketplace.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-ink-soft sm:text-lg">
                  O antigo Precifique ganhou uma identidade mais analitica: um cockpit para projetar preco
                  ideal, validar lucro real e comparar Shopee e Mercado Livre sem depender de planilhas
                  paralelas.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Badge>4 canais monitorados</Badge>
                <Badge>Simulacao reversa em tempo real</Badge>
                <Badge>Impacto de Pix e comissoes</Badge>
              </div>
            </div>

            <div className="w-full max-w-md shrink-0 rounded-[2rem] bg-ink p-6 text-white shadow-[0_28px_70px_rgba(16,35,61,0.34)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">
                    Radar do cenario
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold">Leitura rapida</p>
                </div>
                <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  Ao vivo
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <MetricCard label="Custo final" value={totalWithTax > 0 ? formatBRL(totalWithTax) : "R$ 0,00"} />
                <MetricCard label="Margem alvo" value={`${marginPct}%`} />
                <MetricCard label="Imposto" value={formatPct(taxRate)} />
                <MetricCard
                  label="Melhor sinal"
                  value={bestResult ? formatBRL(bestResult.result.profit) : "Sem leitura"}
                />
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/7 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/55">
                  Melhor encaixe atual
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-bold">{bestName}</p>
                    <p className="mt-1 text-sm text-white/70">
                      {bestResult
                        ? `${bestResult.result.actualMargin.toFixed(1)}% de margem real`
                        : "Preencha os custos para abrir o ranking"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold">
                      {bestResult ? formatBRL(bestResult.result.salePrice) : "R$ 0,00"}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                      preco recomendado
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {profitShare.map((item, index) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/55">
                        <span>{item.label}</span>
                        <span>{item.value.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sun via-accent to-white animate-shimmer"
                          style={{
                            width: `${Math.min(100, Math.max(12, item.value))}%`,
                            animationDelay: `${index * 120}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-sm font-medium text-ink-soft shadow-[0_12px_24px_rgba(16,35,61,0.06)]">
      {children}
    </span>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/7 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
