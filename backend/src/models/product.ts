export interface ConstraintRule {
  /**
   * `if` defines a selection trigger: e.g., if a user selects `mountain_wheels`
   */
  if: Record<string, string>

  /**
   * `then` defines which options become required or excluded based on the trigger
   * - `require`: must also select one of these options
   * - `exclude`: cannot select any of these options
   *
   * Example:
   * {
   *   if: { wheels: "mountain_wheels" },
   *   then: { require: { frame_type: ["full_suspension"] } }
   * }
   *
   * Means: if "mountain_wheels" is selected, you must select "full_suspension" frame
   */
  then: {
    require?: Record<string, string[]>
    exclude?: Record<string, string[]>
  }
}

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
  appliesTo: Record<string, string>
  appliesToPart: string
  overridePrice: number
}

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
