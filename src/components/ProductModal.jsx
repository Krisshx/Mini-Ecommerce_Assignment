import React, { useState } from 'react'
import { useCartDispatch } from '../context/CartContext'

export default function ProductModal({ product, onClose }) {
  const dispatch = useCartDispatch()
  const [qty, setQty] = useState(1)
  if (!product) return null

  const add = () => {
    dispatch({ type: 'add', product, qty })
    onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{product.title}</h3>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {product.image ? <img src={product.image} alt={product.title} /> : null}
          <p className="muted">Category: {product.category}</p>

          {product.description ? <p className="description">{product.description}</p> : null}

          <p className="price">${product.price.toFixed(2)}</p>
          <p className={product.stock > 0 ? 'instock' : 'outstock'}>
            {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
          </p>

          <div className="modal-actions">
            <input type="number" value={qty} min={1} max={product.stock} onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} />
            <button onClick={add} disabled={product.stock === 0}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}
