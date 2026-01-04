import React from 'react'
import { useCartState, useCartDispatch } from '../context/CartContext'

export default function CartDrawer({ open, onClose }) {
  const state = useCartState()
  const dispatch = useCartDispatch()

  const total = state.items.reduce((s, it) => s + it.qty * it.product.price, 0)

  return (
    <div className={`drawer ${open ? 'open' : ''}`} role="dialog" aria-hidden={!open}>
      <div className="drawer-inner">
        <div className="drawer-header">
          <h3>Your Cart</h3>
          <button onClick={onClose}>Close</button>
        </div>

        {state.items.length === 0 ? (
          <div className="empty">Your cart is empty.</div>
        ) : (
          <>
            <ul className="drawer-list">
              {state.items.map((it) => (
                <li key={it.product.id} className="drawer-item">
                  <div className="drawer-item-main">
                    <div>
                      <b>{it.product.title}</b>
                      <div className="muted">${it.product.price.toFixed(2)}</div>
                    </div>
                    <div className="qty">
                      <button onClick={() => dispatch({ type: 'update', productId: it.product.id, qty: it.qty - 1 })}>-</button>
                      <input
                        type="number"
                        value={it.qty}
                        onChange={(e) => dispatch({ type: 'set', productId: it.product.id, qty: Number(e.target.value || 0) })}
                        min={1}
                        max={it.product.stock}
                      />
                      <button onClick={() => dispatch({ type: 'update', productId: it.product.id, qty: it.qty + 1 })}>+</button>
                    </div>
                  </div>

                  <div className="drawer-item-actions">
                    <div>${(it.product.price * it.qty).toFixed(2)}</div>
                    <button onClick={() => dispatch({ type: 'remove', productId: it.product.id })}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer-footer">
              <div className="drawer-total">
                <div className="muted">Subtotal</div>
                <div className="bold">${total.toFixed(2)}</div>
              </div>

              <div className="drawer-actions">
                <button onClick={() => dispatch({ type: 'clear' })} className="secondary">Clear</button>
                <button disabled className="primary">Checkout</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
