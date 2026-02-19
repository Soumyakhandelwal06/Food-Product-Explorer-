import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function SearchBar() {
  const {
    searchQuery, setSearchQuery,
    barcodeQuery, setBarcodeQuery,
    searchMode, setSearchMode,
    fetchProducts,
  } = useApp()

  const [localName, setLocalName] = useState(searchQuery)
  const [localBarcode, setLocalBarcode] = useState(barcodeQuery)

  const handleNameSearch = (e) => {
    e.preventDefault()
    setSearchQuery(localName)
    fetchProducts({ query: localName, mode: 'name', category: '' })
  }

  const handleBarcodeSearch = (e) => {
    e.preventDefault()
    setBarcodeQuery(localBarcode)
    fetchProducts({ query: localBarcode, mode: 'barcode', category: '' })
  }

  const switchMode = (mode) => {
    setSearchMode(mode)
    // clear the other query
    if (mode === 'name') {
      setBarcodeQuery('')
      setLocalBarcode('')
    } else {
      setSearchQuery('')
      setLocalName('')
    }
  }

  return (
    <div className="search-section">
      <div className="search-mode-tabs" role="tablist">
        <button
          id="tab-name-search"
          role="tab"
          aria-selected={searchMode === 'name'}
          className={`search-tab ${searchMode === 'name' ? 'active' : ''}`}
          onClick={() => switchMode('name')}
        >
          🔍 Search by Name
        </button>
        <button
          id="tab-barcode-search"
          role="tab"
          aria-selected={searchMode === 'barcode'}
          className={`search-tab ${searchMode === 'barcode' ? 'active' : ''}`}
          onClick={() => switchMode('barcode')}
        >
          📦 Search by Barcode
        </button>
      </div>

      {searchMode === 'name' ? (
        <form className="search-input-row" onSubmit={handleNameSearch}>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              id="name-search-input"
              type="text"
              className="search-input"
              placeholder="e.g. chocolate, yogurt, chips…"
              value={localName}
              onChange={e => setLocalName(e.target.value)}
              aria-label="Search by product name"
            />
          </div>
          <button id="name-search-btn" type="submit" className="search-btn">
            Search
          </button>
        </form>
      ) : (
        <form className="search-input-row" onSubmit={handleBarcodeSearch}>
          <div className="search-input-wrapper">
            <span className="search-icon">📦</span>
            <input
              id="barcode-search-input"
              type="text"
              className="search-input"
              placeholder="e.g. 737628064502"
              value={localBarcode}
              onChange={e => setLocalBarcode(e.target.value)}
              aria-label="Search by barcode"
              inputMode="numeric"
            />
          </div>
          <button id="barcode-search-btn" type="submit" className="search-btn">
            Lookup
          </button>
        </form>
      )}
    </div>
  )
}
