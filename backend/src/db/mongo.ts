import pino from 'pino'
import { MongoClient, Db } from 'mongodb'
import { PartCategory, PartOption, Product } from '@/models'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const DB_NAME = process.env.MONGO_DB_NAME || 'marcus-shop'

let client: MongoClient
let db: Db

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { translateTime: 'SYS:standard', ignore: 'pid,hostname' }
  }
})

export async function connectToMongo(): Promise<Db> {
  if (!client) {
    client = new MongoClient(MONGO_URL)
    await client.connect()
    db = client.db(DB_NAME)
    logger.info(`✅ Connected to MongoDB: ${DB_NAME}`)
  }
  return db
}

export async function closeMongo(): Promise<void> {
  if (client) {
    await client.close()
    logger.info('🛑 MongoDB connection closed')
  }
}

export function getCollections(db: Db) {
  return {
    products: db.collection<Product>('products'),
    partOptions: db.collection<PartOption>('part_options'),
    partCategories: db.collection<PartCategory>('part_categories')
  }
}
