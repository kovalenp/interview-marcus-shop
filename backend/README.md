## Key Features Implemented

- **Product Listing:** (`GET /products`) Retrieves basic product information for cards.
- **Product Detail:** (`GET /products/:slug`) Fetches full product details including available options.
- **Constraint & Price Resolution:** (`POST /products/:slug/resolve`) Takes selected options, validates them against product constraints, calculates the total price based on base prices and price rules, and returns the resolution result (validity, available options, violations, total price, effective prices).
- **Database Seeding:** (`init/seed-db.ts`) Script to populate the database with initial categories, options, and a sample product.
- **Health Check:** (`GET /health`) Endpoint to verify API and database connectivity.
- **Modular Structure:** Code organized into `routes`, `services`, `models`, `mappers`, `dto`, `db`.

## Running the Backend

1.  Ensure MongoDB by running docker compose.
    ```bash
    docker compose up -d
    ```
    Alternatively, you can use a local MongoDB instance if you have it installed.
2.  Set up environment variables (e.g., in a `.env` file in the `backend` directory): `MONGO_URL`, `MONGO_DB_NAME`.
3.  Seed the database (run from the backend folder):
    ```bash
    pnpm db:init
    ```
4.  Start the development server (run from the workspace root):
    ```bash
    pnpm dev
    ```
