export default function Header() {
  return (
    <header className="px-4 pt-4 pb-4 sm:px-6 sm:pt-5">
      <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/70 bg-surface/82 px-4 py-4 shadow-panel backdrop-blur-xl sm:flex-nowrap sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-[1rem] bg-ink text-white">
            <span className="font-display text-lg font-bold">M</span>
            <span className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-sun" />
          </div>

          <div className="min-w-0">
            <p className="font-display text-xl font-bold tracking-tight text-ink">Margem</p>
            <p className="text-sm leading-tight text-ink-soft">Precificacao direta para marketplace.</p>
          </div>
        </div>

        <span className="hidden shrink-0 rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-soft md:inline-flex">
          Preencha, Compare e Lucre.
        </span>
      </div>
    </header>
  );
}
