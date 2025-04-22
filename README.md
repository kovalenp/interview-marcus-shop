# interview-marcus-shop

Good day, thank you for considering my application.

## Project Description

This repository consists of two parts: **frontend** and **backend**, structured as a monorepo for reviewer convenience.
Inside you will find detailed instructions on how to run the project locally.

## Important

Install the packages using `pnpm` (not `npm` or `yarn`) to ensure compatibility with the workspace setup.

Run command from the root of the project:
`bash
    pnpm install
    `

## 🛠️ Tech Stack

### Frontend

- ✅ **Next.js** (used even though the task is client-side only — SSG/SSR ready for SEO and performance)
- ✅ **React 19 + TypeScript**
- ✅ **Tailwind CSS** for styling
- ✅ **TanStack Query** for managing server state

### Backend

- ✅ **Fastify** with TypeScript
- ✅ **MongoDB** (prioritizing reads for e-commerce scenarios)
- ✅ **Structured JSON logging** (ready for Cloudwatch, ELK)
- ✅ **Dependency Injection** using Fastify decorators (for testability)
- ✅ **Vitest** for unit testing

## 🧭 Main User Actions

1. Browse product listings
2. View and customize a specific product
3. Select options across categories
4. Get real-time price and validation
5. Add a valid configuration to cart
6. (Future) Checkout and payment flow

---

## 🛍 Product Page Behavior

### 🧾 UI Presentation

- Categories rendered as groups (Frame Type, Wheels, etc.)
- Each part option includes:
  - Label (translated)
  - Image
  - Price
  - Out-of-stock indicator

### ⚙️ Option Availability

1. On load, `GET /products/:slug` returns:

   - All available options per category
   - Option metadata (label, price, image, attributes)
   - Constraint rules

2. On interaction, `POST /products/:slug/resolve` returns:
   - Filtered `availableOptions`
   - Constraint `violations`
   - `resolvedPrice`

### 💵 Price Calculation

1. Sum all `basePrice`s of selected options
2. Apply any matching `PriceOverrideRule`

---

## 🛒 Add to Cart Action (out of scope)

1. User clicks "Add to Cart" with current selection
2. Sends selection to `POST /cart`
3. Backend:
   - Validates against constraint rules
   - Confirms parts exist and are in stock
4. If valid, a cart item is persisted:

```ts
{
  productSlug: "custom-bike",
  selected: {
    frame_type: "diamond",
    wheels: "road_wheels",
    ...
  },
  price: 303,
  createdAt: Date
}
```

5. Linked to mock user or cookie session

---

## 🛠 Administrative Workflows

Marcus can:

- Create new products
- Define customizable categories
- Add part options (variants)
- Configure pricing and overrides
- Add constraint rules
- Adjust inventory

Admin interface may later offer validation tools for DSL syntax. We can use traditional headless CMS systems (e.g. Sanity) for content management.
However, I would try to implement LLM interface (aka ChatGPT) to manage stock as a prompt dialog (e.g. Add new "green" rim color). Trained LLM would be able to parse the request and create a new part option with all necessary attributes.

---

## 🧱 New Product Creation

To create a new product, Marcus needs to define:

- `slug`, `type`
- `translations` (multi-language names/descriptions)
- `categories` (list of customizable part categories)
- `availableOptions` per category
- `constraints` (optional rules for valid combinations)
- `priceRules` (optional dynamic pricing)

**DB Change:** New entry in `products` collection.

---

## 🎨 Adding a New Part Choice (e.g. rim color)

1. Go to Admin UI → Categories → Rim Color
2. Click "Add Option"
3. Fill form:
   - Label (EN, ES, PL)
   - Image URL
   - Base price
   - Attributes (e.g. `{ color: 'green' }`)
   - Stock
4. Save to database:
   - Inserts into `part_options`
   - Updates `availableOptions.rim_color` in the product

---

## 💰 Setting Prices

### Flat Price Edit

- Update `basePrice` in the option document

### Conditional Override

- Add a new entry to `priceRules` in the product:

```ts
{
  appliesTo: {
    frame_type: { expression: "attributes.suspension == 'full'" }
  },
  appliesToPart: "matte",
  overridePrice: 50
}
```

Admin interface should:

- Help define expressions via dropdowns or inputs
- Validate schema before saving

## Out of Scope (but considered)

### User Authentication

In real-world scenarios, I would:

- Assign a session cookie to unauthenticated users
- Store cart contents linked to that cookie
- Allow cart restoration
- Use authentication for checkout

User authentication is omitted for this interview due to time constraints but can be implemented upon request.

### Cart Functionality

"Add to cart" flow:

- On clicking "Add to Cart", selected configuration is revalidated.
- Valid selection is stored in DB, tied to user ID or cookie session.
- The cart ID is returned and used to load cart state on future visits.
  Bonus: saved cart can trigger "Abandoned Cart" emails for promo purposes.

### Stock management and concurrent orders

- For real world e-commerce, I would implement stock management to prevent overselling.
- This would involve checking stock levels before confirming an order and updating stock levels accordingly.

### I18n

- I would implement a translation system for product names, descriptions, and error messages.

## 🔑 Key Features Implemented

### 🧩 Constraint System

To support dynamic business logic, I introduced a **Constraint Rule System** to enforce valid product configurations:

- Example rules Marcus might define:
  - “Mountain wheels require a full suspension frame”
  - “Fat bike wheels do not support red rims”

Rather than hardcoding, I use flexible rules in DSL format stored in the DB.

### Constraint Rule Schema

```ts
export interface ConstraintRule {
  if: Record<string, { expression: string }>;
  then: {
    require?: Record<string, { expression: string; message?: string }>;
    exclude?: Record<string, { expression: string; message?: string }>;
  };
  affectedCategories?: string[];
}
```

### How It Works

#### 1. `if`

Activates the rule if the selected part matches the DSL condition.

```ts
if: {
  wheels: { expression: "attributes.type == 'mountain'" }
}
```

#### 2. `then`

- `require`: blocks progress unless another part matches the requirement
- `exclude`: removes incompatible options from the UI

#### 3. `affectedCategories`

Used by frontend to highlight affected selections visually.

### 🌟 Example Rules

#### Rule 1 — Require full suspension if mountain wheels selected

```ts
{
  if: {
    wheels: { expression: "attributes.type == 'mountain'" }
  },
  then: {
    require: {
      frame_type: {
        expression: "attributes.suspension == 'full'",
        message: "Mountain wheels require full suspension frame"
      }
    }
  },
  affectedCategories: ["frame_type"]
}
```

#### Rule 2 — Exclude red rims if fat wheels selected

```ts
{
  if: {
    wheels: { expression: "attributes.type == 'fat'" }
  },
  then: {
    exclude: {
      rim_color: {
        expression: "attributes.color == 'red'",
        message: "Fat bike wheels do not support red rims"
      }
    }
  },
  affectedCategories: ["rim_color"]
}
```

### ⚖️ require vs exclude

| Type      | Behavior                 | UX Effect                                  |
| --------- | ------------------------ | ------------------------------------------ |
| `require` | Requires a matching part | Shows a blocking validation message        |
| `exclude` | Removes invalid options  | No message unless part is already selected |

### ➕ Adding New Rules

Add a rule to DB with:

- A triggering condition (`if`)
- A requirement or exclusion (`then.require` or `then.exclude`)
- A user-friendly message

Example:

```ts
{
  if: {
    chain: { expression: "attributes.speed == 8" }
  },
  then: {
    exclude: {
      wheels: {
        expression: "attributes.speedCompatibility == 'single'",
        message: "8-speed chain is not compatible with single-speed wheels"
      }
    }
  },
  affectedCategories: ["wheels"]
}
```

### 📊 Powered by DSL

I use a lightweight embedded DSL:

```ts
attributes.type === 'mountain';
attributes.size > 42;
attributes.finish !== 'matte';
```

Each part's `attributes` object allows for rich logic and easy extension.

## 💰 Dynamic Pricing System

To ensure accurate and flexible price calculations based on part configurations, I’ve implemented a **Pricing Rule Engine** that supports conditional pricing logic.

### 🧠 Why It Matters

Some parts — like frame finishes — depend on context. For example:

> “A matte finish on a full suspension frame should cost **€50**, but only **€35** on a diamond frame.”

Rather than hardcoding these differences, I encode them as **data-driven rules** in the `priceRules` array.

---

### 📦 `PriceService` Class

This service determines the total price for a configuration and returns **per-part prices** including rule-based overrides.

```ts
class PriceService {
  constructor(
    private readonly product: Product,
    private readonly partOptions: PartOption[],
    private readonly logger: FastifyBaseLogger
  ) {}

  getPriceDetails(selected: Record<string, string>): {
    total: number;
    effectivePrices: Record<string, number>;
  };
}
```

#### 🧮 How Pricing Works

1. Build a shared `context` object from all selected part attributes.
2. For each part:
   - Look for a matching pricing rule that applies.
   - If a rule matches, use `overridePrice`.
   - If no rule matches, use `basePrice`.
3. Return both:
   - `total` – sum of prices for selected parts
   - `effectivePrices` – map of part ID → price (used in UI display)

---

### 🧩 `priceRules` Schema

```ts
interface PriceRule {
  appliesTo: Record<string, { expression: string }>;
  appliesToPart: string;
  overridePrice: number;
}
```

### ✨ Example Rules

```ts
priceRules: [
  {
    appliesTo: {
      frame_type: { expression: "attributes.suspension == 'full'" },
    },
    appliesToPart: 'matte',
    overridePrice: 50,
  },
  {
    appliesTo: {
      frame_type: { expression: "attributes.suspension == 'none'" },
    },
    appliesToPart: 'matte',
    overridePrice: 35,
  },
];
```

➡️ If the user selects a full suspension frame and a matte finish, matte costs €50.  
➡️ If they pick a diamond frame, it only costs €35.

---

### 🔐 Expression Engine (DSL)

All conditions are defined as secure DSL expressions using the `attributes` object of parts:

```ts
attributes.suspension === 'full';
attributes.size > 44;
attributes.finish !== 'shiny';
```

Expressions are evaluated with `new Function('attributes', ...)` inside a try/catch for safety.

---

## 🧠 Key Trade-offs

### 📍 Where to validate business rules?

I chose to validate configuration server-side via `POST /products/:slug/resolve`:

- ✅ Keeps backend as the single source of truth
- ✅ Avoids duplicating logic in frontend
- ❌ Requires a network request on each selection change

Alternatively, I could have sent all constraints to the frontend, but this would require a more complex expression engine on the client side.

### 📦 Keeping rules inside the product object

- ✅ Simple to load everything in one query
- ❌ Could become bulky as the number of rules grows

If system scaled up, constraint and price rules could be moved into a separate collection (referenced by product ID) for reusability and maintenance.

### 🧬 Using a DSL for constraints and pricing rules

- ✅ Highly flexible
- ✅ Easily supports future customizations for skis, snowboards, etc.
- ❌ Requires a custom parser/evaluator
- ❌ Error-prone if not validated during admin input

> DSL expressions such as `attributes.suspension == 'full'` allow for expressive rules without hardcoding logic.

### 🧠 Frontend simplicity vs flexibility

- ✅ Frontend stays UI-focused
- ✅ All validation is centralized
- ❌ More API calls vs. local JS rule checks

### 💽 MongoDB and document structure

MongoDB fits well due to:

- Flexible nested fields like `attributes`
- Easy multilingual fields (translations)
