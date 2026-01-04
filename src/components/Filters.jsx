import React from 'react'

export default function Filters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort,
}) {
  return (
    <div className="filters">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products"
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="none">Sort</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
      </select>

      <button
        onClick={() => {
          setSearch('')
          setCategory('all')
          setSort('none')
        }}
      >
        Clear all
      </button>
    </div>
  )
}
