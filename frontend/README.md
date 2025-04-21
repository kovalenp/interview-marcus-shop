# Marcus Shop Frontend

A Next.js application serving as the user-facing storefront and product customizer for the Marcus Shop project.

✅ Next.js App Router
✅ React 19 + TypeScript
✅ Tailwind CSS for styling
✅ TanStack Query for server state management
✅ Modular components and API service

## 🧰 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Library:** React
- **Styling:** Tailwind CSS
- **State Management:** React state + TanStack Query (for server state)
- **Linting/Formatting:** ESLint + Prettier

## Key Features Implemented

- **Product Listing Page:** (`/`) Displays available products fetched from the backend API using TanStack Query.
- **Product Detail Page:** (`/product/[slug]`) Shows detailed information for a selected product and hosts the customizer.
- **Product Customizer:** (`ProductCustomizer` component) Allows users to select different part options for a product.
- **Option Picker:** (`PartOptionPicker` component) UI for selecting options within a category.
- **Summary Panel:** (`SummaryPanel` component) Displays selected options, calculated price, and constraint violations.
- **API Integration:** Uses `fetch` via a dedicated service (`src/services/api.ts`) to communicate with the backend API for fetching products and resolving configurations.
- **Constraint Handling:** Displays violations and updates available options based on the backend's resolution response.

## Running the Frontend

1.  Ensure the backend service is running (see `backend/README.md`).
2.  Navigate to the workspace root directory (`/Users/pavelkovalenko/Work/interview-marcus-shop`).
3.  Start the development server:
    ```bash
    pnpm --filter frontend dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.
