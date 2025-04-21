import { describe, it, expect } from 'vitest'
import { ConstraintResolverService } from './constraintResolver'
import { Product, PartOption } from '@/models'

const mockProduct: Product = {
  _id: 'bike',
  slug: 'bike',
  type: 'bicycle',
  translations: {
    en: { name: 'Bike' }
  },
  image: { main: 'image.jpg' },
  categories: ['frame_type', 'wheels', 'rim_color'],
  availableOptions: {
    frame_type: ['diamond', 'full_suspension'],
    wheels: ['fat_bike_wheels', 'road_wheels'],
    rim_color: ['red', 'black']
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
            message: 'Mountain wheels require full suspension'
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
  priceRules: [],
  createdAt: new Date()
}

const mockPartOptions: PartOption[] = [
  {
    _id: 'diamond',
    categoryId: 'frame_type',
    basePrice: 100,
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
    _id: 'mountain_wheels',
    categoryId: 'wheels',
    basePrice: 90,
    attributes: { type: 'mountain' },
    stock: 5,
    translations: { en: { label: 'Mountain Wheels' } },
    createdAt: new Date()
  },
  {
    _id: 'road_wheels',
    categoryId: 'wheels',
    basePrice: 80,
    attributes: { type: 'road' },
    stock: 5,
    translations: { en: { label: 'Road Wheels' } },
    createdAt: new Date()
  },
  {
    _id: 'fat_bike_wheels',
    categoryId: 'wheels',
    basePrice: 100,
    attributes: { type: 'fat' },
    stock: 5,
    translations: { en: { label: 'Fat Wheels' } },
    createdAt: new Date()
  },
  {
    _id: 'red',
    categoryId: 'rim_color',
    basePrice: 10,
    attributes: { color: 'red' },
    stock: 5,
    translations: { en: { label: 'Red Rim' } },
    createdAt: new Date()
  },
  {
    _id: 'black',
    categoryId: 'rim_color',
    basePrice: 10,
    attributes: { color: 'black' },
    stock: 5,
    translations: { en: { label: 'Black Rim' } },
    createdAt: new Date()
  }
]

describe('ConstraintResolverService', () => {
  it('validates correctly when rule is satisfied', () => {
    const resolver = new ConstraintResolverService(mockProduct, mockPartOptions)

    const result = resolver.resolve({
      wheels: 'mountain_wheels',
      frame_type: 'full_suspension'
    })

    expect(result.valid).toBe(true)
    expect(result.violations.length).toBe(0)
  })

  it('returns violation if frame is not full suspension for mountain wheels', () => {
    const resolver = new ConstraintResolverService(mockProduct, mockPartOptions)

    const result = resolver.resolve({
      wheels: 'mountain_wheels',
      frame_type: 'diamond'
    })

    expect(result.valid).toBe(false)
    expect(result.violations).toHaveLength(1)
    expect(result.violations[0].message).toMatch(/Mountain wheels/)
    expect(result.violations[0].affectedCategory).toBe('frame_type')
  })

  it('ignores rule if if-condition is not met (e.g. road wheels)', () => {
    const resolver = new ConstraintResolverService(mockProduct, mockPartOptions)

    const result = resolver.resolve({
      wheels: 'road_wheels',
      frame_type: 'diamond'
    })

    expect(result.valid).toBe(true)
    expect(result.violations.length).toBe(0)
  })

  it('tracks excludedOptions for fat wheels + red rim', () => {
    const resolver = new ConstraintResolverService(mockProduct, mockPartOptions)
    const result = resolver.resolve({
      wheels: 'fat_bike_wheels'
    })

    expect(result.valid).toBe(false)
    expect(result.violations).toHaveLength(1)
    expect(result.violations[0].excludedOptions).toContain('red')
    expect(result.availableOptions.rim_color).not.toContain('red')
    expect(result.availableOptions.rim_color).toContain('black')
  })
})
