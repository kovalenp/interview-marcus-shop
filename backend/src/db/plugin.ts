import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyInstance } from 'fastify'
import { connectToMongo, getCollections } from './mongo'

const mongoPlugin: FastifyPluginAsync = fp(async (app: FastifyInstance) => {
  const db = await connectToMongo()
  const collections = getCollections(db)
  app.decorate('collections', collections)
  app.decorate('db', db)
})

export default mongoPlugin
