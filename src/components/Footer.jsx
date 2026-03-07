export default function Footer() {
  return (
    <footer className="px-4 pb-10 pt-6 sm:px-6">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-4 rounded-[2rem] border border-white/70 bg-surface/80 p-5 shadow-panel backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-ink text-white">
            <span className="font-display text-xl font-bold">M</span>
            <span className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-sun" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink">Margem</p>
            <p className="text-sm text-ink-soft">
              Projeto rebatizado a partir do Precifique para focar em leitura de margem e decisao comercial.
            </p>
          </div>
        </div>

        <div className="text-sm leading-6 text-ink-soft sm:max-w-md sm:text-right">
          Dados de comissao referenciados em Marco/2026. Consulte as paginas oficiais da{" "}
          <a
            href="https://seller.shopee.com.br/edu/article/26839"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent transition-colors hover:text-ink"
          >
            Shopee
          </a>
          {" "}e do{" "}
          <a
            href="https://www.mercadolivre.com.br/ajuda/quanto-custa-vender-um-produto_1338"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent transition-colors hover:text-ink"
          >
            Mercado Livre
          </a>
          {" "}para validar alteracoes futuras.
        </div>
      </div>
    </footer>
  );
}
