export interface ConstraintRule {
  /**
   * 'if' defines a dynamic condition using DSL expression(s) to match selected part(s).
   * Example:
   * {
   *   boots: { expression: "attributes.size > 44" }
   * }
   */
  if: Record<string, { expression: string }>

  /**
   * 'then' defines required or excluded part conditions (also via expressions).
   * You can exclude based on any attribute, e.g. rim_color.color === 'red'
   */
  then: {
    require?: Record<string, { expression: string; message?: string }>
    exclude?: Record<string, { expression: string; message?: string }>
  }

  /**
   * Used by frontend to know which categories are affected (for disabling/highlighting).
   */
  affectedCategories?: string[]
}

// Example:

// {
//   if: {
//     wheels: { expression: "attributes.type == 'mountain'" }
//   },
//   then: {
//     require: {
//       frame_type: {
//         expression: "attributes.suspension == 'full'",
//         message: "Mountain wheels require full suspension frame"
//       }
//     }
//   },
//   affectedCategories: ["frame_type"]
// }

export interface PriceOverrideRule {
  /**
   * `appliesTo`: defines a selection pattern that triggers the override
   * `appliesToPart`: which option this override applies to
   * `overridePrice`: the price to use instead of basePrice for that part
   *
   * Example:
   * {
   *   appliesTo: { frame_type: "diamond" },
   *   appliesToPart: "frame_finish",
   *   overridePrice: 35
   * }
   *
   * Means: if "diamond" frame is selected, and you're selecting a finish,
   * then the "frame_finish" price is overridden to 35 EUR.
   */
  appliesTo: Record<string, { expression: string }>
  appliesToPart: string
  overridePrice: number
}

// Example:
// {
//   appliesTo: {
//     frame_type: { expression: "attributes.suspension == 'full'" }
//   },
//   appliesToPart: "frame_finish",
//   overridePrice: 50
// }

export interface Product {
  _id: string
  slug: string // e.g. "custom-bike"
  type: string // e.g. "bicycle", "snowboard"

  translations: {
    [locale: string]: {
      name: string
      description?: string
      seoTitle?: string
      seoDescription?: string
    }
  }

  image: {
    main: string
    gallery?: string[]
  }

  /**
   * Defines which part categories are customizable for this product
   * Example: ["frame_type", "wheels", "rim_color", "frame_finish", "chain"]
   */
  categories: string[]

  /**
   * Defines which options (by ID) are available per category
   * Example:
   * {
   *   frame_type: ["diamond", "full_suspension"],
   *   wheels: ["mountain_wheels", "road_wheels"],
   *   rim_color: ["black", "red"]
   * }
   */
  availableOptions: Record<string, string[]>

  /**
   * Business logic rules that validate/limit which combinations are allowed
   */
  constraints: ConstraintRule[]

  /**
   * Special price overrides depending on selected combinations
   */
  priceRules: PriceOverrideRule[]

  createdAt: Date
}
