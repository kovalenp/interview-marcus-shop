import { ProductDetailDto, PartOptionDto } from '@/dto/productDetailDto'

export function toProductDetailDto(
  product: any,
  partOptions: any[],
  locale: string = 'en'
): ProductDetailDto {
  return {
    slug: product.slug,
    type: product.type,
    image: product.image?.main || '',
    translations: product.translations || {},
    categories: product.categories || [],
    availableOptions: product.availableOptions || {},
    partOptions: partOptions.map((opt) => mapPartOption(opt, locale))
  }
}

function mapPartOption(opt: any, locale: string): PartOptionDto {
  return {
    _id: opt._id,
    categoryId: opt.categoryId,
    basePrice: opt.basePrice,
    stock: opt.stock ?? 0,
    translations: {
      [locale]: opt.translations?.[locale] || opt.translations?.en || { label: '' }
    },
    image: opt.image?.main ? { main: opt.image.main } : undefined
  }
}
