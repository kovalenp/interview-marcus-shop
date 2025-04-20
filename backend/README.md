# Marcus Shop Backend

An interview project with full backend architecture for a customizable e-commerce store.

✅ Domain-Driven Design  
✅ MongoDB with transactions  
✅ JSON-structured logging (Cloudwatch/ELK ready)  
✅ Modular services, models, routes, and repositories  
✅ Fastify + TypeScript + Vitest

## 🧠 Domain

- `Product`: includes categories, available options, constraints, and pricing rules.
- `Cart` (Aggregate): owns CartItems (value objects).
- `PartOption`, `PartCategory`: supports multilingual labels and dynamic pricing.

## 🧰 Tech Stack

- Fastify + TypeScript
- MongoDB with transactional order placement
- Lightweight DI (manual injection)
- Pino JSON logging
- Vitest for logic coverage

## 🧪 Tests
