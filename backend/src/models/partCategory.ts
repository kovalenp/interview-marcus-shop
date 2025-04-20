export interface PartCategory {
  _id: string // Semantic identifier, e.g. "frame_type", "rim_color"
  translations: {
    [locale: string]: {
      label: string
    }
  }
  createdAt: Date
}
