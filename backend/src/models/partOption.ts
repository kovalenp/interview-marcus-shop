export interface PartOption {
  _id: string // e.g. "diamond", "black", "fat_bike_wheels"
  categoryId: string // e.g. "frame_type", "wheels"
  basePrice: number
  stock: number
  image?: {
    main: string
    gallery?: string[]
  }
  translations: {
    [locale: string]: {
      label: string
    }
  }
  createdAt: Date
}
