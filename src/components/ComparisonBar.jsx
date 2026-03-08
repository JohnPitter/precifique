import { formatBRL, getValueTextClass } from "../lib/pricing";

export default function ComparisonBar({ results }) {
  if (!results.length) return null;

  const sorted = [...results].sort((a, b) => a.result.profit - b.result.profit).reverse();
  const best = sorted[0];
  const second = sorted[1];
  const maxProfit = Math.max(...results.map((r) => r.result.profit));
  const allNegative = maxProfit <= 0;
  const gap = second ? best.result.profit - second.result.profit : 0;

  return (
    <section className="animate-rise rounded-[2rem] border border-white/70 bg-surface/85 p-6 shadow-panel backdrop-blur-xl">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="xl:max-w-xs">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-accent">
            Ranking de margem
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
            Onde o seu cenario respira melhor
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            O placar abaixo ordena os canais pelo lucro por unidade e evidencia quando vale defender preco,
            trocar canal ou rever custo.
          </p>

          <div className="animate-pulse-soft animate-sheen mt-6 rounded-[1.6rem] bg-[linear-gradient(135deg,#f7a35c,#ea6a47)] p-5 text-white shadow-[0_20px_50px_rgba(234,106,71,0.28)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              Veredito do cenario
            </p>
            <h3 className="mt-3 break-words font-display text-2xl font-bold leading-tight">
              {allNegative
                ? "Nenhum canal sustenta a operacao"
                : `${best.marketplace.name} ${best.marketplace.badge}`}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/88">
              {allNegative
                ? "Todos os canais estao negativos. Voce precisa subir preco ou reduzir a estrutura de custo."
                : `Hoje ele entrega ${formatBRL(gap)} a mais por unidade em relacao ao segundo colocado.`}
            </p>
            <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
              <MiniStat label="Lucro unitario" value={formatBRL(best.result.profit)} />
              <MiniStat label="Preco ideal" value={formatBRL(best.result.salePrice)} />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {sorted.map(({ marketplace, result }) => {
            const barWidth = allNegative
              ? Math.min(100, Math.max(18, (Math.abs(best.result.profit) / Math.max(Math.abs(result.profit), 0.01)) * 100))
              : Math.min(100, Math.max(14, (Math.max(0, result.profit) / Math.max(maxProfit, 0.01)) * 100));
            const isProfit = result.profit > 0;
            const isBest = marketplace.id === best.marketplace.id;
            const profitValue = formatBRL(result.profit);
            const profitValueClass = getValueTextClass(profitValue, "hero");
            const tone = marketplace.color === "shopee"
              ? "from-shopee via-accent to-sun"
              : "from-ml-text via-ink to-accent";
            const mark = marketplace.id.startsWith("shopee") ? "SP" : "ML";

            return (
              <div
                key={marketplace.id}
                className="rounded-[1.6rem] border border-ink/10 bg-white/80 p-4 shadow-[0_14px_34px_rgba(16,35,61,0.05)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${marketplace.color === "shopee" ? "bg-shopee/12 text-shopee" : "bg-ml/55 text-ml-text"} font-display text-sm font-bold`}>
                      {mark}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-xl font-bold text-ink">
                          {marketplace.name}
                        </span>
                        <span className="rounded-full bg-bg-input px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                          {marketplace.badge}
                        </span>
                        {isBest && (
                          <span className="animate-pulse-soft rounded-full bg-green/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-green">
                            Melhor encaixe
                          </span>
                        )}
                      </div>
                      <p className="mt-1 break-words text-sm leading-6 text-ink-soft">
                        Preco ideal {formatBRL(result.salePrice)} com margem real de {result.actualMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 text-left md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      Lucro por unidade
                    </p>
                    <p className={`mt-1 whitespace-nowrap font-display font-bold leading-tight tabular-nums ${profitValueClass} ${isProfit ? "text-green" : "text-danger"}`}>
                      {profitValue}
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/8">
                  <div
                    className={`animate-bar-glow h-full rounded-full bg-gradient-to-r ${tone} transition-all duration-700`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Metric label="Taxas" value={formatBRL(result.fees.totalFees)} />
                  <Metric label="Liquido" value={formatBRL(result.netRevenue)} />
                  <Metric label="Comissao" value={`${(result.fees.commissionPct * 100).toFixed(0)}%`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }) {
  const valueClass = getValueTextClass(value, "hero");

  return (
    <div className="min-w-0 rounded-[1.15rem] border border-white/18 bg-white/14 p-3">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/75">{label}</p>
      <p className={`mt-2 whitespace-nowrap font-display font-bold leading-tight tabular-nums ${valueClass}`}>{value}</p>
    </div>
  );
}

function Metric({ label, value }) {
  const valueClass = getValueTextClass(value);

  return (
    <div className="min-w-0 rounded-[1.15rem] border border-ink/10 bg-bg-input/70 p-3">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">{label}</p>
      <p className={`mt-2 whitespace-nowrap font-semibold leading-tight tabular-nums text-ink ${valueClass}`}>{value}</p>
    </div>
  );
}
