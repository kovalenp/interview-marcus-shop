import { PartOption, Product } from '../models' // Corrected path
import { FastifyBaseLogger } from 'fastify'

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

  getPriceDetails(selected: Record<string, string>) {
    const context: Record<string, any> = {}

    for (const selectedId of Object.values(selected)) {
      const part = this.partOptions.find((p) => p._id === selectedId)
      if (part) {
        Object.assign(context, part.attributes)
      }
    }

    const effectivePrices: Record<string, number> = {}
    let total = 0

    for (const part of this.partOptions) {
      const isSelected = Object.values(selected).includes(part._id)

      // Find matching rule that applies to this part (even if not selected)
      const matchingRule = this.product.priceRules?.find((rule) => {
        if (rule.appliesToPart !== part._id) return false

        const conditions = rule.appliesTo || {}
        // Prefix unused key with underscore to satisfy no-unused-vars rule
        return Object.entries(conditions).every(([, cond]) =>
          this.evaluateDSL(cond.expression, context)
        )
      })

      const price = matchingRule?.overridePrice ?? part.basePrice
      effectivePrices[part._id] = price

      if (isSelected) {
        total += price
      }
    }

    return { total, effectivePrices }
  }

  private evaluateDSL(expression: string, context: Record<string, any>): boolean {
    try {
      const fn = new Function('attributes', `return ${expression}`)
      return !!fn(context)
    } catch (err) {
      this.logger.warn({ err, expression }, '❌ Price rule evaluation failed')
      return false
    }
  }
}
