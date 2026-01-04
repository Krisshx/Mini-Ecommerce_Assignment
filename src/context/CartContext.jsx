import React, { createContext, useEffect, useReducer, useContext, useMemo } from 'react'

export const CartStateContext = createContext()
export const CartDispatchContext = createContext()

function load() {
  try {
    const raw = localStorage.getItem('cart')
    return raw ? JSON.parse(raw) : { items: [] }
  } catch (e) {
    return { items: [] }
  }
}

function save(state) {
  try {
    localStorage.setItem('cart', JSON.stringify(state))
  } catch (e) {}
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, qty } = action
      const exists = state.items.find((i) => i.product.id === product.id)
      if (exists) {
        // ensure not exceed stock
        const newQty = Math.min(exists.qty + qty, product.stock)
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, qty: newQty } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { product, qty: Math.min(qty, product.stock) }] }
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) }
    case 'update': {
      const { productId, qty } = action
      if (qty < 1) return { ...state, items: state.items.filter((i) => i.product.id !== productId) }
      return {
        ...state,
        items: state.items.map((i) => (i.product.id === productId ? { ...i, qty: Math.min(qty, i.product.stock) } : i)),
      }
    }
    case 'set': {
      const { productId, qty } = action
      if (qty < 1) return { ...state, items: state.items.filter((i) => i.product.id !== productId) }
      return {
        ...state,
        items: state.items.map((i) => (i.product.id === productId ? { ...i, qty: Math.min(qty, i.product.stock) } : i)),
      }
    }
    case 'clear':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    save(state)
  }, [state])

  const memoState = useMemo(() => state, [state])

  return (
    <CartStateContext.Provider value={memoState}>
      <CartDispatchContext.Provider value={dispatch}>{children}</CartDispatchContext.Provider>
    </CartStateContext.Provider>
  )
}

export function useCartState() {
  return useContext(CartStateContext)
}

export function useCartDispatch() {
  return useContext(CartDispatchContext)
}
