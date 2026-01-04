import React, { useEffect, useMemo, useState } from 'react'
import ProductList from './components/ProductList'
import Filters from './components/Filters'
import Cart from './components/Cart'
import CartDrawer from './components/CartDrawer'
import ProductModal from './components/ProductModal'
import { CartProvider } from './context/CartContext'
import useDebounce from './hooks/useDebounce'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const url = 'https://dummyjson.com/products?limit=100'

    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!mounted) return
        const items = (data.products || []).map((p) => ({
          id: p.id,
          title: p.title || p.name || 'Untitled',
          description: p.description || '',
          price: Number(p.price) || 0,
          category: p.category || 'uncategorized',
          stock: typeof p.stock === 'number' ? p.stock : (p.rating ? 0 : 0),
          image: p.thumbnail || (p.images && p.images[0]) || '',
        }))
        console.debug('Fetched products:', items.length)
        setProducts(items)
        setError(null)
      } catch (err) {
        console.warn('Failed to fetch products', err)
        setError('Failed to fetch products — check your network or the API')
        setProducts([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchProducts()
    return () => {
      mounted = false
    }
  }, [])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('none')

  // derive categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['all', ...Array.from(set)]
  }, [products])

  const filtered = useMemo(() => {
    let list = products
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q))
    }
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (sort === 'low') list = list.slice().sort((a, b) => a.price - b.price)
    if (sort === 'high') list = list.slice().sort((a, b) => b.price - a.price)
    return list
  }, [products, debouncedSearch, category, sort])

  // pagination
  const [page, setPage] = useState(1)
  const pageSize = 20
  useEffect(() => setPage(1), [debouncedSearch, category, sort])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <CartProvider>
      <div className="app">
        <header className="top">
          <h1>Mini E-Commerce</h1>
          <Cart onOpen={() => setCartOpen(true)} />
        </header>

        <main>
          <Filters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            categories={categories}
            sort={sort}
            setSort={setSort}
          />

          {error && <div className="error">{error}</div>}

          {loading ? (
            <div className="empty">Loading products...</div>
          ) : (
            <>
              <div className="meta">Showing {Math.min((page - 1) * pageSize + 1, total)} - {Math.min(page * pageSize, total)} of {total} products</div>

              <ProductList products={paginated} onView={(p) => setSelectedProduct(p)} />

              <div className="pagination">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  Prev
                </button>
                <div className="pages">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={i + 1 === page ? 'active' : ''}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Next
                </button>
              </div>
            </>
          )}
        </main>

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    </CartProvider>
  )
}
