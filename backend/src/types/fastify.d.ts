import 'fastify'
import type { Collection, Db } from 'mongodb'
import type { Product, PartOption, PartCategory /*, Cart */ } from '../models'

declare module 'fastify' {
  interface FastifyInstance {
    collections: {
      products: Collection<Product>
      partOptions: Collection<PartOption>
      partCategories: Collection<PartCategory>
    }
    db: Db
  }
}
