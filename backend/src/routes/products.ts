import { FastifyPluginAsync } from 'fastify'
import { toProductCardDto } from '../mappers/toProductCardDto'

const productsRoute: FastifyPluginAsync = async (app) => {
  app.get<{
    Querystring: { locale?: string }
  }>('/', async (req) => {
    const locale = req.query.locale || 'en'

    const products = await app.collections.products
      .find(
        {},
        {
          projection: {
            slug: 1,
            type: 1,
            translations: 1,
            image: 1
          }
        }
      )
      .toArray()

    const result = products.map((p) => toProductCardDto(p, locale))

    return result
  })
}

export default productsRoute
