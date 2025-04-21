# Marcus Shop Backend

An interview project with full backend architecture for a customizable e-commerce store.

✅ Domain-Driven Design
✅ MongoDB
✅ JSON-structured logging (Cloudwatch/ELK ready)
✅ Modular services, models, routes
✅ Fastify + TypeScript + Vitest

## 🧠 Domain

- `Product`: Includes categories, available options, constraints, and pricing rules.
- `PartOption`, `PartCategory`: Supports multilingual labels and dynamic pricing.
- _(Potentially `Cart` and `Order` aggregates in a full implementation)_

## 🧰 Tech Stack

- **Framework:** Fastify
- **Language:** TypeScript
- **Database:** MongoDB (using `mongodb` driver)
- **Logging:** Pino (for structured JSON logging)
- **Testing:** Vitest
- **Dependency Injection:** Manual injection via Fastify decorators (`app.decorate`)
- **Validation/Serialization:** Implicitly handled by Fastify's schema system (though not explicitly shown in provided files)

## Key Features Implemented

- **Product Listing:** (`GET /products`) Retrieves basic product information for cards.
- **Product Detail:** (`GET /products/:slug`) Fetches full product details including available options.
- **Constraint & Price Resolution:** (`POST /products/:slug/resolve`) Takes selected options, validates them against product constraints, calculates the total price based on base prices and price rules, and returns the resolution result (validity, available options, violations, total price, effective prices).
- **Database Seeding:** (`init/seed-db.ts`) Script to populate the database with initial categories, options, and a sample product.
- **Health Check:** (`GET /health`) Endpoint to verify API and database connectivity.
- **Modular Structure:** Code organized into `routes`, `services`, `models`, `mappers`, `dto`, `db`.

## Running the Backend

1.  Ensure MongoDB is running.
2.  Set up environment variables (e.g., in a `.env` file in the `backend` directory): `MONGO_URL`, `MONGO_DB_NAME`.
3.  Seed the database (run from the workspace root):
    ```bash
    pnpm --filter backend db:init
    ```
4.  Start the development server (run from the workspace root):
    ```bash
    pnpm --filter backend dev
    ```
5.  Run tests (run from the workspace root):
    ```bash
    pnpm --filter backend test
    ```
