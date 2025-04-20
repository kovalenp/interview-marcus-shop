import { MongoClient } from 'mongodb'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const DB_NAME = process.env.MONGO_DB_NAME || 'marcus-shop'

async function seed() {
  const client = new MongoClient(MONGO_URL)
  await client.connect()
  const db = client.db(DB_NAME)

  // Clear existing data
  await db.collection('part_categories').deleteMany({})
  await db.collection('part_options').deleteMany({})
  await db.collection('products').deleteMany({})

  const now = new Date()

  // 1. Categories
  const categories = [
    {
      _id: 'frame_type',
      translations: {
        en: { label: 'Frame Type' },
        es: { label: 'Tipo de Cuadro' },
        pl: { label: 'Typ ramy' }
      },
      createdAt: now
    },
    {
      _id: 'wheels',
      translations: {
        en: { label: 'Wheels' },
        es: { label: 'Ruedas' },
        pl: { label: 'Koła' }
      },
      createdAt: now
    },
    {
      _id: 'rim_color',
      translations: {
        en: { label: 'Rim Color' },
        es: { label: 'Color de la llanta' },
        pl: { label: 'Kolor obręczy' }
      },
      createdAt: now
    }
  ]
  await db.collection('part_categories').insertMany(categories as any[])

  // 2. Options
  const options = [
    // Frame types
    {
      _id: 'full_suspension',
      categoryId: 'frame_type',
      basePrice: 130,
      stock: 5,
      translations: {
        en: { label: 'Full Suspension' },
        es: { label: 'Suspensión total' },
        pl: { label: 'Pełne zawieszenie' }
      },
      image: {
        main: 'https://cdn.shopify.com/s/files/1/2318/5263/files/2021_YetiCycles_SB150_Frame_Black_01.jpg?v=1613581881'
      },
      createdAt: now
    },
    {
      _id: 'diamond',
      categoryId: 'frame_type',
      basePrice: 110,
      stock: 10,
      translations: {
        en: { label: 'Diamond' },
        es: { label: 'Diamante' },
        pl: { label: 'Diamentowy' }
      },
      image: {
        main: 'https://cdn11.bigcommerce.com/s-6jcqg/images/stencil/1900x1900/products/369/5533/Jones_PLUS_LWB_Diamond_Frame_Jones_Orange_1_of_1__07080.1728591550.jpg?c=2'
      },
      createdAt: now
    },

    // Wheels
    {
      _id: 'road_wheels',
      categoryId: 'wheels',
      basePrice: 80,
      stock: 12,
      translations: {
        en: { label: 'Road Wheels' },
        es: { label: 'Ruedas de carretera' },
        pl: { label: 'Koła szosowe' }
      },
      image: {
        main: 'https://irwincycling.com/wp-content/uploads/2017/08/AON-TLR38_60.jpg'
      },
      createdAt: now
    },
    {
      _id: 'mountain_wheels',
      categoryId: 'wheels',
      basePrice: 95,
      stock: 6,
      translations: {
        en: { label: 'Mountain Wheels' },
        es: { label: 'Ruedas de montaña' },
        pl: { label: 'Koła górskie' }
      },
      image: {
        main: 'https://bikerumor.com/wp-content/uploads/2016/02/Trailcraft-24inch-premium-lightweight-youth-mountain-bike-wheels-01.jpg'
      },
      createdAt: now
    },
    {
      _id: 'fat_bike_wheels',
      categoryId: 'wheels',
      basePrice: 100,
      stock: 3,
      translations: {
        en: { label: 'Fat Bike Wheels' },
        es: { label: 'Ruedas gordas' },
        pl: { label: 'Koła fatbike' }
      },
      image: {
        main: 'https://m.media-amazon.com/images/I/915onybBEfL.jpg'
      },
      createdAt: now
    },

    // Rim colors
    {
      _id: 'black',
      categoryId: 'rim_color',
      basePrice: 10,
      stock: 20,
      translations: {
        en: { label: 'Black' },
        es: { label: 'Negro' },
        pl: { label: 'Czarny' }
      },
      image: {
        main: 'https://cdn.example.com/parts/black-rim.jpg'
      },
      createdAt: now
    },
    {
      _id: 'red',
      categoryId: 'rim_color',
      basePrice: 12,
      stock: 8,
      translations: {
        en: { label: 'Red' },
        es: { label: 'Rojo' },
        pl: { label: 'Czerwony' }
      },
      image: {
        main: 'https://cdn.example.com/parts/red-rim.jpg'
      },
      createdAt: now
    }
  ]
  await db.collection('part_options').insertMany(options as any[])

  // 3. Product
  const product = {
    slug: 'custom-bike',
    type: 'bicycle',
    translations: {
      en: {
        name: 'Custom Bike',
        description: 'Design your dream bike!',
        seoTitle: 'Custom Bikes Online',
        seoDescription: 'Customize your perfect bike with our builder.'
      },
      es: { name: 'Bicicleta personalizada' },
      pl: { name: 'Rower na zamówienie' }
    },
    image: {
      main: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDA2NTB8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlfGVufDB8fHx8MTc0NTE4Mzg2M3ww&ixlib=rb-4.0.3&q=80&w=1080'
    },
    categories: ['frame_type', 'wheels', 'rim_color'],
    availableOptions: {
      frame_type: ['full_suspension', 'diamond'],
      wheels: ['road_wheels', 'mountain_wheels', 'fat_bike_wheels'],
      rim_color: ['black', 'red']
    },
    constraints: [
      {
        if: { wheels: 'mountain_wheels' },
        then: { require: { frame_type: ['full_suspension'] } }
      },
      {
        if: { wheels: 'fat_bike_wheels' },
        then: { exclude: { rim_color: ['red'] } }
      }
    ],
    priceRules: [
      {
        appliesTo: { frame_type: 'full_suspension' },
        appliesToPart: 'rim_color',
        overridePrice: 20
      },
      {
        appliesTo: { frame_type: 'diamond' },
        appliesToPart: 'rim_color',
        overridePrice: 15
      }
    ],
    createdAt: now
  }

  await db.collection('products').insertOne(product)

  console.log('✅ Seed complete!')
  await client.close()
}

seed()
