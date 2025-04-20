import { ProductCardDto } from '@/dto/productCardDto'

export function toProductCardDto(product: any, locale: string = 'en'): ProductCardDto {
  const translation = product.translations?.[locale] || product.translations?.en || {}

  return {
    slug: product.slug,
    type: product.type,
    name: translation.name || '',
    description: translation.description,
    image: product.image?.main || null
  }
}
