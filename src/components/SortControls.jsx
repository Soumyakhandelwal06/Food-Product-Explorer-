import { useApp } from '../context/AppContext.jsx'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default Order' },
  { value: 'name_asc', label: 'Name: A → Z' },
  { value: 'name_desc', label: 'Name: Z → A' },
  { value: 'grade_asc', label: 'Nutrition: Best First' },
  { value: 'grade_desc', label: 'Nutrition: Worst First' },
]

export default function SortControls() {
  const { sortBy, setSortBy, searchMode } = useApp()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="controls-label">Sort</span>
      <select
        id="sort-select"
        className="sort-select"
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
        disabled={searchMode === 'barcode'}
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
