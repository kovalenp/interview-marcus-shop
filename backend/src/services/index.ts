import { FastifyInstance } from 'fastify'
import { ConstraintResolverService } from './constraintResolver'
import { Product, PartOption } from '@/models'

export interface Services {
  constraintResolverFactory: (
    // eslint-disable-next-line no-unused-vars
    args: {
      product: Product
      partOptions: PartOption[]
    }
  ) => ConstraintResolverService
}

export async function registerServices(app: FastifyInstance) {
  app.decorate<Services>('services', {
    constraintResolverFactory: ({ product, partOptions }) =>
      new ConstraintResolverService(product, partOptions)
  })
}
