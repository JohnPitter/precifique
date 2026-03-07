import { useMemo, useState } from "react";
import { MARKETPLACES } from "./lib/marketplaces";
import { calcIdealPrice } from "./lib/pricing";
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-page text-ink">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(234,106,71,0.22),transparent_58%)]" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-sun/25 blur-3xl animate-drift" />
        <div className="absolute -left-16 top-48 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-drift-delayed" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 px-4 pb-12 sm:px-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
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
  return (
    <section className="animate-rise rounded-[2rem] border border-dashed border-ink/15 bg-surface/75 p-6 shadow-panel backdrop-blur-xl sm:p-8">
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-accent">
        Resultado
      </p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Preencha os custos para ver a precificacao.
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
        Assim que existir um cenario, mostramos o melhor canal, o preco ideal por marketplace e o simulador
        reverso sem etapas extras.
      </p>
    </section>
  );
}
