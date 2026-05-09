'use client'
import { Search, X, Heart, LayoutGrid, List } from 'lucide-react'

export interface CategoryOption {
  key: string
  label: string
  count?: number
}

interface Props {
  categories: CategoryOption[]
  query: string
  onQuery: (q: string) => void
  category: string
  onCategory: (c: string) => void
  count: number
  total: number
  totalLabel?: string
  searchPlaceholder?: string
  wishlistOnly: boolean
  onWishlistOnly: (v: boolean) => void
  wishlistCount: number
  groupByCategory: boolean
  onGroupByCategory: (v: boolean) => void
}

export function FilterBar({
  categories,
  query,
  onQuery,
  category,
  onCategory,
  count,
  total,
  totalLabel = 'animations',
  searchPlaceholder = 'Search animations, tags, categories…',
  wishlistOnly,
  onWishlistOnly,
  wishlistCount,
  groupByCategory,
  onGroupByCategory,
}: Props) {
  const isFiltered = count < total

  return (
    <div className="filter-bar">
      <div className="filter-row-top">
        <div className="search-wrap">
          <Search size={13} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={searchPlaceholder}
            value={query}
            onChange={e => onQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => onQuery('')} aria-label="Clear search">
              <X size={11} />
            </button>
          )}
        </div>

        <div className="filter-meta">
          <button
            className={`filter-group-btn ${groupByCategory ? 'active' : ''}`}
            onClick={() => onGroupByCategory(!groupByCategory)}
            title={groupByCategory ? 'Ungroup' : 'Group by category'}
          >
            {groupByCategory ? <List size={11} /> : <LayoutGrid size={11} />}
            {groupByCategory ? 'Grouped' : 'Group'}
          </button>
          {wishlistCount > 0 && (
            <button
              className={`filter-wish-btn ${wishlistOnly ? 'active' : ''}`}
              onClick={() => onWishlistOnly(!wishlistOnly)}
              title={wishlistOnly ? 'Show all' : 'Show saved only'}
            >
              <Heart size={11} fill={wishlistOnly ? 'currentColor' : 'none'} />
              Saved
              <span className="filter-wish-count">{wishlistCount}</span>
            </button>
          )}
          <span className="filter-count">
            <span className="filter-count-num" style={isFiltered ? { color: 'var(--accent)' } : {}}>
              {count}
            </span>
            <span className="filter-count-sep"> / </span>
            <span>{total}</span>
            <span className="filter-count-unit"> {totalLabel}</span>
          </span>
        </div>
      </div>

      <div className="filter-row-cats">
        <div className="cat-scroll">
          {categories.map(c => (
            <button
              key={c.key}
              className={`cat-pill ${c.key === 'all' ? 'cat-pill-all' : ''} ${category === c.key ? 'active' : ''}`}
              onClick={() => onCategory(c.key)}
            >
              <span className="cat-pill-label">{c.label}</span>
              {c.count !== undefined && (
                <span className="cat-pill-count">{c.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
