import dotenv from 'dotenv'
dotenv.config()

import Fastify from 'fastify'
import { closeMongo } from './db/mongo'
import mongoPlugin from './db/plugin'
import healthRoute from './routes/health'
import { v4 as uuid4 } from 'uuid'

async function bootstrap() {
  const app = Fastify({
    // Logger configuration
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: { translateTime: 'SYS:standard', ignore: 'pid,hostname' }
      }
    },
    // use unique x-request-id correlation key
    genReqId: function (req) {
      return (req.headers['x-request-id'] as string) || uuid4()
    }
  })

  // Plugins
  await app.register(mongoPlugin)

  // Routes
  await app.register(healthRoute)

  app.addHook('onClose', async () => {
    await closeMongo()
  })

  try {
    await app.listen({ port: 3000 })
    app.log.info('🚀 Server ready on http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

bootstrap()
