import { FastifyPluginAsync } from 'fastify'
import { toProductCardDto } from '../mappers/toProductCardDto'
import { toProductDetailDto } from '../mappers/toProductDetailDto'

const productsRoute: FastifyPluginAsync = async (app) => {
  // ✅ GET /products → List product cards
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

    return products.map((p) => toProductCardDto(p, locale))
  })

  // ✅ GET /products/:slug → Full product detail
  app.get<{
    Params: { slug: string }
    Querystring: { locale?: string }
  }>('/:slug', async (req, reply) => {
    const { slug } = req.params
    const locale = req.query.locale || 'en'

    const product = await app.collections.products.findOne({ slug })

    if (!product) {
      return reply.code(404).send({ error: 'Product not found' })
    }

    const allOptionIds = Object.values(product.availableOptions).flat()

    const partOptions = await app.collections.partOptions
      .find({ _id: { $in: allOptionIds as any } })
      .toArray()

    const dto = toProductDetailDto(product, partOptions, locale)

    return dto
  })
}

export default productsRoute
