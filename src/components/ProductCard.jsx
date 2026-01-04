import React from 'react'
import { useCartDispatch } from '../context/CartContext'

function ProductCard({ product, onView }) {
  const dispatch = useCartDispatch()

  const add = () => {
    dispatch({ type: 'add', product, qty: 1 })
  }

  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect fill="%23f3f3f3" width="100%" height="100%"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="%23666" font-family="Arial" font-size="14">No Image</text></svg>'

  return (
    <div className="card">
      {product.image ? (
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            if (e.target.src !== placeholder) e.target.src = placeholder
          }}
        />
      ) : null}

      <div className="info">
        <h3>{product.title}</h3>
        <p className="category">{product.category}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className={product.stock > 0 ? 'instock' : 'outstock'}>
          {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
        </p>

        <div className="actions">
          <button onClick={add} disabled={product.stock === 0}>
            Add to cart
          </button>

          <button onClick={() => onView && onView(product)} className="secondary">
            View
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ProductCard)
