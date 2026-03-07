import { useState } from "react";
import { MARKETPLACES } from "../lib/marketplaces";
import { calcFromPrice, formatBRL } from "../lib/pricing";

export default function ReverseCalc({ costs }) {
  const [salePrice, setSalePrice] = useState("");
  const price = parseFloat(salePrice) || 0;

  const hasCosts = Object.entries(costs)
    .filter(([k]) => k !== "taxRate")
    .some(([, v]) => v > 0);

  return (
    <section className="animate-rise rounded-[2rem] border border-white/70 bg-surface/85 p-5 shadow-panel backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-accent">
            Simulador reverso
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
            Ja tem o preco? Confira quanto realmente sobra.
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            Digite um preco de vitrine para medir taxas, repasse liquido e lucro final por canal.
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-ink/10 bg-white/75 px-4 py-3 text-sm leading-6 text-ink-soft">
          {hasCosts
            ? "Com custos informados, o simulador mostra lucro e margem real."
            : "Sem custos, o simulador mostra taxas e repasse liquido."}
        </div>
      </div>

      <div className="relative mt-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-soft">R$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Digite um preco de venda"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          className="w-full rounded-[1.5rem] border border-ink/10 bg-white/80 py-4 pl-14 pr-5 text-xl font-semibold text-ink transition-all focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
        />
      </div>

      {price > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {MARKETPLACES.map((mp, index) => {
            const r = calcFromPrice(price, costs, mp);
            const isProfit = r.profit > 0;
            const netWithPix = mp.hasPix && r.fees.pixDiscount > 0
              ? price - r.fees.totalFeesWithPix
              : null;
            const profitWithPix = netWithPix !== null ? netWithPix - r.totalCost : null;
            const tone = mp.color === "shopee"
              ? "border-shopee/20 bg-[linear-gradient(135deg,rgba(238,77,45,0.12),rgba(255,255,255,0.82))]"
              : "border-ml-text/15 bg-[linear-gradient(135deg,rgba(255,230,0,0.28),rgba(255,255,255,0.82))]";
            const mark = mp.id.startsWith("shopee") ? "SP" : "ML";

            return (
              <div
                key={mp.id}
                className={`rounded-[1.6rem] border p-4 shadow-[0_14px_34px_rgba(16,35,61,0.05)] ${tone}`}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl font-display text-sm font-bold ${mp.color === "shopee" ? "bg-shopee/12 text-shopee" : "bg-ml/55 text-ml-text"}`}>
                      {mark}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-xl font-bold text-ink">{mp.name}</span>
                        <span className="max-w-full break-words rounded-full bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                          {mp.badge}
                        </span>
                      </div>
                      <p className="mt-1 break-words text-sm leading-6 text-ink-soft">
                        Taxas totais de {formatBRL(r.fees.totalFees)}
                      </p>
                    </div>
                  </div>

                  {hasCosts && (
                    <div className={`self-start rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] ${isProfit ? "bg-green/12 text-green" : "bg-danger/12 text-danger"}`}>
                      {isProfit ? "Lucro positivo" : "Lucro negativo"}
                    </div>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Stat label="Voce recebe" value={formatBRL(r.netRevenue)} />
                  <Stat label="Comissao" value={`${(r.fees.commissionPct * 100).toFixed(0)}%`} />
                  {hasCosts ? (
                    <>
                      <Stat label="Custo total" value={formatBRL(r.totalCost)} />
                      <Stat
                        label="Lucro projetado"
                        value={formatBRL(r.profit)}
                        highlight={isProfit ? "text-green" : "text-danger"}
                      />
                    </>
                  ) : (
                    <>
                      <Stat label="Taxa fixa" value={r.fees.fixedFee > 0 ? formatBRL(r.fees.fixedFee) : "Sem taxa"} />
                      <Stat label="Leitura" value="Informe custos para ver lucro" />
                    </>
                  )}
                </div>

                {hasCosts && (
                  <p className="mt-4 break-words text-right text-xs uppercase tracking-[0.16em] text-ink-soft">
                    Margem real {r.actualMargin.toFixed(1)}%
                  </p>
                )}

                {netWithPix !== null && (
                  <div className="mt-4 rounded-[1.3rem] border border-sky/20 bg-sky/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                      Leitura com Pix
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <Stat label="Taxas" value={formatBRL(r.fees.totalFeesWithPix)} />
                      <Stat label="Repasse" value={formatBRL(netWithPix)} />
                      {hasCosts && profitWithPix !== null && (
                        <Stat
                          label="Lucro"
                          value={formatBRL(profitWithPix)}
                          highlight={profitWithPix > 0 ? "text-green" : "text-danger"}
                        />
                      )}
                      <Stat label="Economia" value={formatBRL(r.fees.pixDiscount)} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-[1.6rem] border border-dashed border-ink/15 bg-white/72 p-6 text-sm leading-7 text-ink-soft">
          Digite um preco para comparar o repasse liquido de cada marketplace e validar se a tabela atual
          ainda protege sua margem.
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className="min-w-0 rounded-[1.15rem] border border-ink/10 bg-white/70 p-3">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">{label}</p>
      <p className={`mt-2 break-words text-[clamp(1rem,2.8vw,1.125rem)] font-semibold leading-tight text-ink ${highlight ?? ""}`}>{value}</p>
    </div>
  );
}
