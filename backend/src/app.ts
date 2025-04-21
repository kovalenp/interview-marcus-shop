import dotenv from 'dotenv'
dotenv.config()

import Fastify from 'fastify'
import { closeMongo } from './db/mongo'
import mongoPlugin from './db/plugin'
import healthRoute from './routes/health'
import { v4 as uuid4 } from 'uuid'
import productsRoute from './routes/products'
import { registerServices } from './services'
import cors from '@fastify/cors'

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

  await app.register(cors, {
    origin: 'http://localhost:3000',
    credentials: true
  })

  // Plugins
  await app.register(mongoPlugin)
  // Services
  await registerServices(app)
  // Routes
  await app.register(healthRoute)
  await app.register(productsRoute, { prefix: '/products' })

  app.addHook('onClose', async () => {
    await closeMongo()
  })

  try {
    await app.listen({ port: 5050 })
    app.log.info('🚀 Server ready on http://localhost:5050')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

bootstrap()
