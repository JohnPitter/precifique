import { useMemo, useState } from "react";
import { MARKETPLACES } from "./lib/marketplaces";
import { calcIdealPrice, formatBRL } from "./lib/pricing";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CostForm from "./components/CostForm";
import MarketplaceCard from "./components/MarketplaceCard";
import ComparisonBar from "./components/ComparisonBar";
import ReverseCalc from "./components/ReverseCalc";

const DEFAULT_COSTS = {
  productCost: 0,
  packaging: 0,
  labor: 0,
  shipping: 0,
  otherCosts: 0,
};

export default function App() {
  const [costs, setCosts] = useState(DEFAULT_COSTS);
  const [marginPct, setMarginPct] = useState(30);
  const [taxRate, setTaxRate] = useState(6);

  const costsWithTax = useMemo(() => ({ ...costs, taxRate }), [costs, taxRate]);

  const results = useMemo(() => {
    const hasAnyCost = Object.values(costs).some((v) => v > 0);
    if (!hasAnyCost) return [];

    return MARKETPLACES.map((mp) => ({
      marketplace: mp,
      result: calcIdealPrice(costsWithTax, marginPct, mp),
    }));
  }, [costs, costsWithTax, marginPct]);

  const totalBeforeTax = useMemo(
    () => Object.values(costs).reduce((sum, value) => sum + value, 0),
    [costs],
  );

  const totalWithTax = useMemo(
    () => totalBeforeTax * (1 + taxRate / 100),
    [taxRate, totalBeforeTax],
  );

  const bestResult = useMemo(() => {
    if (!results.length) return null;
    return [...results].sort((a, b) => b.result.profit - a.result.profit)[0];
  }, [results]);

  const scenarioCards = [
    {
      label: "Custo unitário",
      value: totalBeforeTax > 0 ? formatBRL(totalWithTax) : "Nenhum cenário",
      detail: totalBeforeTax > 0
        ? `Base ${formatBRL(totalBeforeTax)} + imposto de ${taxRate.toFixed(1).replace(".", ",")}%`
        : "Preencha seus custos para abrir a análise",
    },
    {
      label: "Melhor canal",
      value: bestResult
        ? `${bestResult.marketplace.name} ${bestResult.marketplace.badge}`
        : "Aguardando dados",
      detail: bestResult
        ? `Lucro unitário de ${formatBRL(bestResult.result.profit)}`
        : "O ranking aparece assim que existir um custo base",
    },
    {
      label: "Motor de cálculo",
      value: "Preço ideal + reverso",
      detail: `Margem alvo em ${marginPct}% para Shopee e Mercado Livre`,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-page text-ink">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(234,106,71,0.22),transparent_58%)]" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-sun/25 blur-3xl animate-drift" />
        <div className="absolute -left-16 top-48 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-drift-delayed" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <Header
          bestResult={bestResult}
          marginPct={marginPct}
          taxRate={taxRate}
          totalWithTax={totalWithTax}
        />

        <main className="flex-1 px-4 pb-12 sm:px-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <section className="grid gap-4 md:grid-cols-3">
              {scenarioCards.map((card, index) => (
                <div
                  key={card.label}
                  className="animate-rise rounded-[1.75rem] border border-white/70 bg-surface/80 p-5 shadow-panel backdrop-blur-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-accent">
                    {card.label}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
                    {card.value}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{card.detail}</p>
                </div>
              ))}
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
              <aside className="lg:sticky lg:top-6 lg:self-start">
                <CostForm
                  costs={costs}
                  onChange={setCosts}
                  marginPct={marginPct}
                  onMarginChange={setMarginPct}
                  taxRate={taxRate}
                  onTaxChange={setTaxRate}
                />
              </aside>

              <div className="space-y-6">
                {results.length > 0 ? (
                  <>
                    <ComparisonBar results={results} />
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                      {results.map(({ marketplace, result }, index) => (
                        <MarketplaceCard
                          key={marketplace.id}
                          index={index}
                          marketplace={marketplace}
                          result={result}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyState />
                )}

                <ReverseCalc costs={costsWithTax} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function EmptyState() {
  const steps = [
    {
      step: "01",
      title: "Desenhe o custo real",
      text: "Comece pelo custo do produto e acrescente embalagem, mão de obra, frete e despesas rateadas.",
    },
    {
      step: "02",
      title: "Defina a margem de defesa",
      text: "Escolha a margem mínima que precisa proteger para não aceitar vendas que parecem boas, mas drenam caixa.",
    },
    {
      step: "03",
      title: "Compare canais com contexto",
      text: "O ranking mostra onde sobra mais lucro por unidade e o simulador reverso valida qualquer preço já praticado.",
    },
  ];

  return (
    <section className="animate-rise rounded-[2rem] border border-dashed border-ink/15 bg-surface/75 p-6 shadow-panel backdrop-blur-xl sm:p-8">
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-accent">
        Cockpit pronto para uso
      </p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Monte um cenário para liberar o ranking de marketplaces.
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
        O rebranding transformou o antigo Precifique em um painel mais analítico. Falta apenas um custo base
        para destravar o comparativo, os cards de lucro e o simulador reverso.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((item, index) => (
          <div
            key={item.step}
            className="rounded-[1.6rem] border border-white/70 bg-white/75 p-5"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/12 font-display text-sm font-bold text-accent">
              {item.step}
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
