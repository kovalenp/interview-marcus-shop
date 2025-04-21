import { describe, it, expect, vi } from 'vitest'
import { PriceService } from './priceService'
import type { Product, PartOption } from '@/models'
import type { FastifyBaseLogger } from 'fastify'

const mockLogger: FastifyBaseLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  fatal: vi.fn(),
  trace: vi.fn(),
  child: vi.fn(() => mockLogger)
} as unknown as FastifyBaseLogger

const mockProduct: Product = {
  _id: 'bike',
  slug: 'bike',
  type: 'bicycle',
  translations: { en: { name: 'Bike' } },
  image: { main: 'image.jpg' },
  categories: ['frame_type', 'frame_finish'],
  availableOptions: {
    frame_type: ['diamond', 'full_suspension'],
    frame_finish: ['matte', 'shiny']
  },
  constraints: [],
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
  createdAt: new Date()
}

const mockParts: PartOption[] = [
  {
    _id: 'diamond',
    categoryId: 'frame_type',
    basePrice: 110,
    attributes: { suspension: 'none' },
    stock: 5,
    translations: { en: { label: 'Diamond' } },
    createdAt: new Date()
  },
  {
    _id: 'full_suspension',
    categoryId: 'frame_type',
    basePrice: 130,
    attributes: { suspension: 'full' },
    stock: 5,
    translations: { en: { label: 'Full Suspension' } },
    createdAt: new Date()
  },
  {
    _id: 'matte',
    categoryId: 'frame_finish',
    basePrice: 30,
    attributes: { finish: 'matte' },
    stock: 10,
    translations: { en: { label: 'Matte' } },
    createdAt: new Date()
  },
  {
    _id: 'shiny',
    categoryId: 'frame_finish',
    basePrice: 45,
    attributes: { finish: 'shiny' },
    stock: 10,
    translations: { en: { label: 'Shiny' } },
    createdAt: new Date()
  }
]

describe('PriceService', () => {
  it('applies price rule for full suspension + matte', () => {
    const service = new PriceService(mockProduct, mockParts, mockLogger)

    const result = service.getPriceDetails({
      frame_type: 'full_suspension',
      frame_finish: 'matte'
    })

    expect(result.total).toBe(180) // 130 + 50
    expect(result.effectivePrices.matte).toBe(50)
  })

  it('applies price rule for diamond + matte', () => {
    const service = new PriceService(mockProduct, mockParts, mockLogger)

    const result = service.getPriceDetails({
      frame_type: 'diamond',
      frame_finish: 'matte'
    })

    expect(result.total).toBe(145) // 110 + 35
    expect(result.effectivePrices.matte).toBe(35)
  })

  it('returns basePrice if no rule matches', () => {
    const service = new PriceService(mockProduct, mockParts, mockLogger)

    const result = service.getPriceDetails({
      frame_type: 'diamond',
      frame_finish: 'shiny'
    })

    expect(result.total).toBe(110 + 45)
    expect(result.effectivePrices.shiny).toBe(45)
  })

  it('evaluates all part prices even when not selected', () => {
    const service = new PriceService(mockProduct, mockParts, mockLogger)

    const result = service.getPriceDetails({ frame_type: 'diamond' })

    expect(result.total).toBe(110)
    expect(result.effectivePrices.matte).toBe(35)
  })
})
