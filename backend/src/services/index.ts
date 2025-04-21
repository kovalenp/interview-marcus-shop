import { FastifyInstance } from 'fastify'
import { ConstraintResolverService } from './constraintResolver'
import { Product, PartOption } from '@/models'
import { PriceService } from './priceService'

export interface Services {
  constraintResolverFactory: (
    // eslint-disable-next-line no-unused-vars
    args: {
      product: Product
      partOptions: PartOption[]
    }
  ) => ConstraintResolverService

  priceServiceFactory: (
    // eslint-disable-next-line no-unused-vars
    args: {
      product: Product
      partOptions: PartOption[]
    }
  ) => PriceService
}

export async function registerServices(app: FastifyInstance) {
  app.decorate<Services>('services', {
    constraintResolverFactory: ({ product, partOptions }) =>
      new ConstraintResolverService(product, partOptions, app.log),
    priceServiceFactory: ({ product, partOptions }) =>
      new PriceService(product, partOptions, app.log)
  })
}
