import { FastifyPluginAsync } from 'fastify'

const healthRoute: FastifyPluginAsync = async (app) => {
  app.get('/health', async (request, reply) => {
    request.log.info('Health check requested')
    try {
      await app.db.command({ ping: 1 })
      request.log.info('Health check successful: Database connected')
      return { status: 'ok', db: 'connected' }
    } catch (error) {
      request.log.error({ err: error }, 'Health check failed: Database connection error')
      reply.code(503)
      return { status: 'error', db: 'disconnected' }
    }
  })
}

export default healthRoute
