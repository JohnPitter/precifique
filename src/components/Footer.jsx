export default function Footer() {
  return (
    <footer className="px-4 py-6 sm:px-6 text-center">
      <p className="text-xs text-text-dim">
        Precifique &copy; {new Date().getFullYear()} &middot; Dados de comissão atualizados em Março/2026
      </p>
      <p className="text-xs text-text-dim mt-1">
        Valores podem variar. Consulte os sites oficiais da{" "}
        <a href="https://seller.shopee.com.br/edu/article/26839" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Shopee</a>
        {" "}e{" "}
        <a href="https://www.mercadolivre.com.br/ajuda/quanto-custa-vender-um-produto_1338" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mercado Livre</a>.
      </p>
    </footer>
  );
}
