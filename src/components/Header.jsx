export default function Header() {
  return (
    <header className="px-4 py-5 sm:px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xl font-bold">$</span>
          </div>
          <h1 className="text-2xl font-extrabold">Precifique</h1>
        </div>
        <p className="text-sm text-text-dim max-w-md mx-auto">
          Descubra o preço ideal para vender nos maiores marketplaces do Brasil.
          Shopee e Mercado Livre com comissões atualizadas (Mar 2026).
        </p>
      </div>
    </header>
  );
}
