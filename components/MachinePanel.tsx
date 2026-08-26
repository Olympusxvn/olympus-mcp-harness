import { formatUsd, PRODUCTS, type Product } from "@/lib/demo/products";

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
      <p className="mt-4 text-sm text-muted">Catalog</p>
      <div className="mt-3 grid max-h-[22rem] gap-3 overflow-y-auto pr-1 sm:grid-cols-1">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <p className="mt-5 text-sm text-muted">Cart</p>
      <p className="mt-1 text-sm text-foreground">Empty · $0</p>
    </section>
  );
}
