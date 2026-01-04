import React, { useMemo } from 'react'
import { useCartState } from '../context/CartContext'

export default function Cart({ onOpen }) {
  const state = useCartState()

  const totalItems = useMemo(
    () => state.items.reduce((s, it) => s + it.qty, 0),
    [state.items]
  )
  const totalPrice = useMemo(
    () => state.items.reduce((s, it) => s + it.qty * it.product.price, 0),
    [state.items]
  )

  return (
    <button className="cart-button" onClick={onOpen}>
      Cart ({totalItems}) • ${totalPrice.toFixed(2)}
    </button>
  )
}
