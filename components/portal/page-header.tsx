/**
 * One page header for every portal screen.
 *
 * Existed as ad-hoc markup on each page before, which is how three pages ended
 * up with three different heading sizes and margins. A shared component is not
 * about saving lines — it is about the tool looking like one tool.
 */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="border-b border-portal-line bg-white px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-[86rem] flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink/85">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/** Standard padding for whatever sits under a PageHeader. */
export function PageBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[86rem] px-4 py-8 md:px-8">{children}</div>
  );
}
