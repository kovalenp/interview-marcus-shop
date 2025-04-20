import 'fastify'
import type { Collection, Db } from 'mongodb'

declare module 'fastify' {
  interface FastifyInstance {
    collections: {
      products: Collection
      partOptions: Collection
      partCategories: Collection
      carts: Collection
    }
    db: Db
  }
}
