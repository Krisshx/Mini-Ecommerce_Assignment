import React from 'react'
import ProductCard from './ProductCard'

const ProductList = React.memo(function ProductList({ products, onView }) {
  if (!products.length) return <div className="empty">No products found.</div>

  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onView={onView} />
      ))}
    </div>
  )
})

export default ProductList
