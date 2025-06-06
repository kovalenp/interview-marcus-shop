![image](https://github.com/user-attachments/assets/d79e4b4b-ca17-4615-aa44-d77b8abfe568)


## Key Features Implemented

- **Product Listing Page:** (`/`) Displays available products fetched from the backend API using TanStack Query.
- **Product Detail Page:** (`/product/[slug]`) Shows detailed information for a selected product and hosts the customizer.
- **Product Customizer:** (`ProductCustomizer` component) Allows users to select different part options for a product.
- **Option Picker:** (`PartOptionPicker` component) UI for selecting options within a category.
- **Summary Panel:** (`SummaryPanel` component) Displays selected options, calculated price, and constraint violations.
- **API Integration:** Uses `fetch` via a dedicated service (`src/services/api.ts`) to communicate with the backend API for fetching products and resolving configurations.
- **Constraint Handling:** Displays violations and updates available options based on the backend's resolution response.

## Running the Frontend locally

1.  Ensure the backend service is running.
2.  Navigate to the frontend folder.
3.  Set up environment variables (e.g., in a `.env` file in the `frontend` directory): `NEXT_PUBLIC_API_URL=localhost:5050`.
4.  Start the development server:
    ```bash
    pnpm dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.
