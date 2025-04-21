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
      _id: 'frame_finish',
      translations: {
        en: { label: 'Frame Finish' },
        es: { label: 'Acabado del cuadro' },
        pl: { label: 'Wykończenie ramy' }
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
    },
    {
      _id: 'chain',
      translations: {
        en: { label: 'Chain' },
        es: { label: 'Cadena' },
        pl: { label: 'Łańcuch' }
      },
      createdAt: now
    }
  ]
  await db.collection('part_categories').insertMany(categories as any[])

  // 2. Options
  const options = [
    // FRAME TYPES
    {
      _id: 'full_suspension',
      categoryId: 'frame_type',
      basePrice: 130,
      attributes: { suspension: 'full' },
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
      attributes: { suspension: 'none' },
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
    {
      _id: 'step_through',
      categoryId: 'frame_type',
      basePrice: 105,
      attributes: { suspension: 'low' },
      stock: 0,
      translations: {
        en: { label: 'Step Through' },
        es: { label: 'Paso bajo' },
        pl: { label: 'Rama z niskim przekrokiem' }
      },
      image: {
        main: 'https://templecycles.com/cdn/shop/products/StepThroughSideSlateBlueSquare.jpg?v=1744817289'
      },
      createdAt: now
    },

    // FRAME FINISH
    {
      _id: 'matte',
      categoryId: 'frame_finish',
      basePrice: 30,
      attributes: { finish: 'matte' },
      stock: 50,
      translations: {
        en: { label: 'Matte' },
        es: { label: 'Mate' },
        pl: { label: 'Matowy' }
      },
      image: {
        main: 'https://3.imimg.com/data3/XA/UO/MY-8662578/brushed-stainless-cmyk-500x500.jpg'
      },
      createdAt: now
    },
    {
      _id: 'shiny',
      categoryId: 'frame_finish',
      basePrice: 45,
      attributes: { finish: 'shiny' },
      stock: 50,
      translations: {
        en: { label: 'Shiny' },
        es: { label: 'Brillante' },
        pl: { label: 'Błyszczący' }
      },
      image: {
        main: 'https://www.tbkmetal.com/wp-content/uploads/2022/05/Brushed-Finish-Stainless-Steel-1024x683.jpeg'
      },
      createdAt: now
    },

    // WHEELS
    {
      _id: 'road_wheels',
      categoryId: 'wheels',
      basePrice: 80,
      attributes: { type: 'road' },
      stock: 12,
      translations: {
        en: { label: 'Road Wheels' },
        es: { label: 'Ruedas de carretera' },
        pl: { label: 'Koła szosowe' }
      },
      image: { main: 'https://irwincycling.com/wp-content/uploads/2017/08/AON-TLR38_60.jpg' },
      createdAt: now
    },
    {
      _id: 'mountain_wheels',
      categoryId: 'wheels',
      basePrice: 95,
      attributes: { type: 'mountain' },
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
      attributes: { type: 'fat' },
      stock: 3,
      translations: {
        en: { label: 'Fat Bike Wheels' },
        es: { label: 'Ruedas de fat bike' },
        pl: { label: 'Koła fatbike' }
      },
      image: { main: 'https://m.media-amazon.com/images/I/915onybBEfL.jpg' },
      createdAt: now
    },

    // RIM COLORS
    {
      _id: 'black',
      categoryId: 'rim_color',
      basePrice: 10,
      attributes: { color: 'black' },
      stock: 20,
      translations: {
        en: { label: 'Black' },
        es: { label: 'Negro' },
        pl: { label: 'Czarny' }
      },
      image: {
        main: 'https://ik.imagekit.io/w4c/santafixiecom/catalog/product/cache/3e8be0b5888e84367ffcc9b491bf197c/h/a/hardcore-negro-2.jpg'
      },
      createdAt: now
    },
    {
      _id: 'red',
      categoryId: 'rim_color',
      basePrice: 12,
      attributes: { color: 'red' },
      stock: 8,
      translations: {
        en: { label: 'Red' },
        es: { label: 'Rojo' },
        pl: { label: 'Czerwony' }
      },
      image: {
        main: 'https://www.fesmes.com/52411-large_default/spray-montana-colors-hardcore-rojo-claro.jpg'
      },
      createdAt: now
    },
    {
      _id: 'blue',
      categoryId: 'rim_color',
      basePrice: 11,
      attributes: { color: 'blue' },
      stock: 6,
      translations: {
        en: { label: 'Blue' },
        es: { label: 'Azul' },
        pl: { label: 'Niebieski' }
      },
      image: {
        main: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlsUaws9AEftsGzDwJ8uM49Px6k1B3LZsiAA&s'
      },
      createdAt: now
    },

    // CHAINS
    {
      _id: 'single_speed',
      categoryId: 'chain',
      basePrice: 43,
      attributes: { speed: 1 },
      stock: 15,
      translations: {
        en: { label: 'Single Speed Chain' },
        es: { label: 'Cadena de una velocidad' },
        pl: { label: 'Łańcuch jednobiegowy' }
      },
      image: {
        main: 'https://files.ekmcdn.com/bikemonger/images/surly-cassette-cog-191-1-p.jpg'
      },
      createdAt: now
    },
    {
      _id: 'eight_speed',
      categoryId: 'chain',
      basePrice: 52,
      attributes: { speed: 8 },
      stock: 12,
      translations: {
        en: { label: '8-Speed Chain' },
        es: { label: 'Cadena de 8 velocidades' },
        pl: { label: 'Łańcuch 8-biegowy' }
      },
      image: {
        main: 'https://boxcomponents.com/cdn/shop/products/DSC06470_85de041b-2d9d-4cf5-8be5-348c4f1da01b-2.jpg?v=1741388038&width=2000'
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
    categories: ['frame_type', 'frame_finish', 'wheels', 'rim_color', 'chain'],
    availableOptions: {
      frame_type: ['full_suspension', 'diamond', 'step_through'],
      frame_finish: ['matte', 'shiny'],
      wheels: ['road_wheels', 'mountain_wheels', 'fat_bike_wheels'],
      rim_color: ['black', 'red', 'blue'],
      chain: ['single_speed', 'eight_speed']
    },
    constraints: [
      {
        if: {
          wheels: { expression: "attributes.type == 'mountain'" }
        },
        then: {
          require: {
            frame_type: {
              expression: "attributes.suspension == 'full'",
              message: 'Mountain wheels require full suspension frame'
            }
          }
        },
        affectedCategories: ['frame_type']
      },
      {
        if: {
          wheels: { expression: "attributes.type == 'fat'" }
        },
        then: {
          exclude: {
            rim_color: {
              expression: "attributes.color == 'red'",
              message: 'Fat bike wheels do not support red rims'
            }
          }
        },
        affectedCategories: ['rim_color']
      }
    ],
    priceRules: [
      {
        appliesTo: {
          frame_type: { expression: "attributes.suspension == 'full'" }
        },
        appliesToPart: 'matte',
        overridePrice: 50
      },
      {
        appliesTo: {
          frame_type: { expression: "attributes.suspension == 'none'" }
        },
        appliesToPart: 'matte',
        overridePrice: 35
      }
    ],
    createdAt: now
  }

  await db.collection('products').insertOne(product)

  console.log('✅ Seed complete!')
  await client.close()
}

seed()
