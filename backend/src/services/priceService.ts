import { PartOption, Product } from '../models' // Corrected path
import { FastifyBaseLogger } from 'fastify'
import { evaluateDSL } from './helper'

/**
 * PriceService
 *
 * This service is responsible for calculating the total and per-part prices for a given product configuration.
 * It evaluates all relevant price override rules (defined in the product model) against the current selection context.
 *
 * The system supports conditional pricing via a flexible DSL format, allowing Marcus to define business rules like:
 * - “If full suspension frame is selected, matte finish costs 50 EUR”
 *
 * Output:
 * - `total`: the sum of all prices for currently selected parts
 * - `effectivePrices`: map of partOptionId => resolved price (with override if applicable)
 */
export class PriceService {
  constructor(
    // Disable both base and TS rule for this line
    // eslint-disable-next-line no-unused-vars
    private readonly product: Product,
    // Disable both base and TS rule for this line
    // eslint-disable-next-line no-unused-vars
    private readonly partOptions: PartOption[],
    // Disable both base and TS rule for this line
    // eslint-disable-next-line no-unused-vars
    private readonly logger: FastifyBaseLogger
  ) {}

  /**
   * Calculates total and per-part prices based on selected part IDs.
   * Also applies override rules if applicable.
   *
   * @param selected - Record of category => selected partOptionId
   * @returns An object with `total` and `effectivePrices` map
   */
  getPriceDetails(selected: Record<string, string>) {
    const context: Record<string, any> = {}

    // Build a context object from selected parts' attributes
    // This is used to evaluate override rule conditions
    for (const selectedId of Object.values(selected)) {
      const part = this.partOptions.find((p) => p._id === selectedId)
      if (part) {
        Object.assign(context, part.attributes)
      }
    }

    const effectivePrices: Record<string, number> = {}
    let total = 0

    // For every part in the product catalog
    for (const part of this.partOptions) {
      const isSelected = Object.values(selected).includes(part._id)

      // Find the first price override rule that matches the current context
      const matchingRule = this.product.priceRules?.find((rule) => {
        if (rule.appliesToPart !== part._id) return false

        const conditions = rule.appliesTo || {}

        // Evaluate all conditions (AND-ed together) using shared context
        return Object.entries(conditions).every(([, cond]) =>
          evaluateDSL(cond.expression, context, this.logger)
        )
      })

      // Use overridePrice if rule matched; otherwise fallback to base price
      const price = matchingRule?.overridePrice ?? part.basePrice
      effectivePrices[part._id] = price

      // Add to total only if part is currently selected
      if (isSelected) {
        total += price
      }
    }

    return { total, effectivePrices }
  }
}
