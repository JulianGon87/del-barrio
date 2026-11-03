import ProductCard from './ProductCard'

export default function ProductGrid({ products, onDelete, emptyMessage = 'No hay productos para mostrar.' }) {
  if (products.length === 0) {
    return <p className="text-muted">{emptyMessage}</p>
  }

  return (
    <div className="row g-3">
      {products.map((product) => (
        <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
          <ProductCard product={product} onDelete={onDelete} />
        </div>
      ))}
    </div>
  )
}
