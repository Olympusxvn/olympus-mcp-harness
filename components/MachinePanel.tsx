"use client";

import { formatUsd, type Product } from "@/lib/demo/products";
import { useDemoState } from "@/components/useDemoState";

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="luxe-glass p-4">
      <h3 className="font-medium text-foreground">{product.name}</h3>
      <p className="mt-1 text-lg text-gold-soft">{formatUsd(product.price)}</p>
      <p className="mt-2 text-sm text-muted">{product.blurb}</p>
      <p className="mt-2 text-xs text-muted">
        {product.attrs.ram} · {product.attrs.gpu}
      </p>
    </article>
  );
}

export function MachinePanel() {
  const { catalog, compared, selected, cart } = useDemoState();

  return (
    <section
      className="luxe-glass luxe-glass-strong stage-machine flex min-h-[280px] flex-col p-5 sm:p-6"
      aria-labelledby="machine-heading"
    >
      <p className="luxe-eyebrow" style={{ color: "var(--machine)" }}>
        Machine
      </p>
      <h2 id="machine-heading" className="luxe-display mt-2 text-xl">
        Execute
      </h2>
      {selected ? (
        <>
          <p className="mt-4 text-sm text-muted">Selected</p>
          <div className="mt-2">
            <ProductCard product={selected} />
          </div>
        </>
      ) : null}
      {compared.length > 0 ? (
        <>
          <p className="mt-4 text-sm text-muted">Compare</p>
          <div className="mt-2 grid gap-2">
            {compared.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : null}
      <p className="mt-4 text-sm text-muted">Catalog</p>
      <div className="mt-3 grid max-h-[18rem] gap-3 overflow-y-auto pr-1">
        {catalog.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <p className="mt-5 text-sm text-muted">Cart</p>
      {cart.lines.length === 0 ? (
        <p className="mt-1 text-sm text-foreground">Empty · $0</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm">
          {cart.lines.map((line) => (
            <li key={line.productId}>
              {line.name} × {line.qty} · {formatUsd(line.unitPrice * line.qty)}
            </li>
          ))}
          <li className="text-gold-soft">Total {formatUsd(cart.total)}</li>
        </ul>
      )}
    </section>
  );
}
