# Food Product Explorer

A feature-rich web application for discovering and exploring food products using the [OpenFoodFacts](https://world.openfoodfacts.org/) open database.

## Features

- **Search by Name** — Find products by keyword (e.g., "chocolate", "yogurt")
- **Search by Barcode** — Instantly look up a product via its barcode number
- **Category Filter** — Filter products by category (beverages, dairy, snacks, etc.)
- **Sort** — Sort results by product name (A–Z / Z–A) or nutrition grade (best/worst first)
- **Product Detail Page** — Click any card to view full ingredients, nutritional info (per 100g), labels, and categories
- **Load More** — Paginated loading with a "Load More" button for seamless browsing
- **Cart** — Add products to a slide-in cart drawer with quantity management (bonus feature)
- **Responsive Design** — Fully works on desktop, tablet, and mobile

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| State Management | React Context API (`AppContext`, `CartContext`) |
| Styling | Vanilla CSS (dark glassmorphism design system) |
| API | [OpenFoodFacts API](https://world.openfoodfacts.org/) |

## Project Structure

```
src/
├── api/
│   └── openFoodFacts.js      # All API calls (search, barcode, category, detail)
├── context/
│   ├── AppContext.jsx         # Global state: search, filters, sort, pagination
│   └── CartContext.jsx        # Cart state management
├── components/
│   ├── Navbar.jsx
│   ├── SearchBar.jsx          # Tabbed: name search + barcode search
│   ├── CategoryFilter.jsx     # Dropdown with API-loaded categories
│   ├── SortControls.jsx       # Sort by name / nutrition grade
│   ├── ProductCard.jsx        # Product preview card
│   ├── CartDrawer.jsx         # Slide-in cart sidebar
│   └── LoadingSpinner.jsx
├── pages/
│   ├── HomePage.jsx
│   └── ProductDetailPage.jsx
├── App.jsx
├── main.jsx
└── index.css                  # Full design system
```

## Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Method Used to Solve the Problem

1. **Architecture & State**: Used React 18 with Vite for a fast development experience. Global state (search queries, filters, products, and pagination) is managed using the native React Context API (`AppContext.jsx` and `CartContext.jsx`) to avoid prop-drilling and the overhead of Redux for this scale.
2. **Data Fetching**: Used Axios to interact with the OpenFoodFacts API. All API calls are abstracted into a dedicated service file (`api/openFoodFacts.js`) to decouple the UI from data-fetching logic and to allow easy substitution or mocking.
3. **Routing**: Implemented client-side routing with React Router v6 to handle navigation between the main listing page and the product detailed view seamlessly.
4. **Styling & UI**: Implemented a modern dark glassmorphism design system using Vanilla CSS. CSS variables (`index.css`) were used extensively for consistent theming and responsive design using Flexbox and CSS Grid without external heavy UI libraries.
5. **Bonus / Interactivity**: Designed a Cart Drawer that slides in and out, managed globally, to satisfy the add-to-cart bonus feature requirement. The app is fully responsive across mobile, tablet, and desktop viewports.

## API Endpoints Used

| Feature | Endpoint |
|---------|----------|
| Name search | `/cgi/search.pl?search_terms=...&json=1` |
| Barcode lookup | `/api/v0/product/{barcode}.json` |
| Category products | `/category/{category}.json` |
| Categories list | `/categories.json` |
| Default listing | `/cgi/search.pl?sort_by=popularity&json=1` |

## Time Taken

Approximately **6–7 hours** total (design, API integration, component architecture, responsive layout, cart bonus feature).

## Notes

- The OpenFoodFacts API is run by a French non-profit. If requests are slow, wait a moment and retry.
- Not all products have complete data — missing images/ingredients are handled gracefully.
- The cart is in-memory only (no backend/payment integration).
