import { useState, useMemo } from "react";
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-8 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
          {/* Left: Cost form */}
          <div className="space-y-5">
            <CostForm
              costs={costs}
              onChange={setCosts}
              marginPct={marginPct}
              onMarginChange={setMarginPct}
              taxRate={taxRate}
              onTaxChange={setTaxRate}
            />
          </div>

          {/* Right: Results */}
          <div className="space-y-5">
            {results.length > 0 && (
              <>
                <ComparisonBar results={results} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map(({ marketplace, result }) => (
                    <MarketplaceCard key={marketplace.id} marketplace={marketplace} result={result} />
                  ))}
                </div>
              </>
            )}
            <ReverseCalc costs={costsWithTax} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
