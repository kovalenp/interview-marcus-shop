export interface ProductDetailDto {
  slug: string
  type: string
  image: string
  translations: Record<
    string,
    {
      name: string
      description?: string
      seoTitle?: string
      seoDescription?: string
    }
  >
  categories: string[]
  availableOptions: Record<string, string[]>
  partOptions: PartOptionDto[]
}

export interface PartOptionDto {
  _id: string
  categoryId: string
  basePrice: number
  stock: number
  translations: Record<string, { label: string }>
  image?: {
    main: string
  }
}
