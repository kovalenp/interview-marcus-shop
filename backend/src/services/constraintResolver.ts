import { Product, PartOption } from '@/models'

export interface ResolutionResult {
  valid: boolean
  availableOptions: Record<string, string[]>
  violations: {
    message: string
    affectedCategory: string
    excludedOptions?: string[]
    requiredOptions?: string[]
  }[]
}

export class ConstraintResolverService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly product: Product,
    // eslint-disable-next-line no-unused-vars
    private readonly partOptions: PartOption[]
  ) {}

  resolve(selected: Record<string, string>): ResolutionResult {
    const availableOptions: Record<string, Set<string>> = Object.fromEntries(
      Object.entries(this.product.availableOptions).map(([category, ids]) => [
        category,
        new Set(ids)
      ])
    )

    const violations: ResolutionResult['violations'] = []

    for (const rule of this.product.constraints) {
      const ifMatch = this.evaluateIf(rule.if, selected)

      if (!ifMatch) continue

      if (rule.then.require) {
        for (const [category, req] of Object.entries(rule.then.require)) {
          const valid = this.evaluateCategoryExpression(req.expression, selected[category])

          if (!valid) {
            violations.push({
              message: req.message || `Requires a valid ${category}`,
              affectedCategory: category,
              requiredOptions: [...availableOptions[category]]
            })
          }
        }
      }

      if (rule.then.exclude) {
        for (const [category, ex] of Object.entries(rule.then.exclude)) {
          const excluded: string[] = []

          for (const option of availableOptions[category]) {
            const part = this.partOptions.find((p) => p._id === option)
            if (part && this.evaluateDSL(ex.expression, part.attributes)) {
              availableOptions[category].delete(option)
              excluded.push(option)
            }
          }

          if (excluded.length > 0) {
            violations.push({
              message: ex.message || `Some ${category} options excluded`,
              affectedCategory: category,
              excludedOptions: excluded
            })
          }
        }
      }
    }

    return {
      valid: violations.length === 0,
      availableOptions: Object.fromEntries(
        Object.entries(availableOptions).map(([cat, set]) => [cat, Array.from(set)])
      ),
      violations
    }
  }

  private evaluateIf(
    ifClause: Record<string, { expression: string }>,
    selected: Record<string, string>
  ): boolean {
    return Object.entries(ifClause).every(([category, cond]) => {
      const selectedId = selected[category]
      if (!selectedId) return false
      const part = this.partOptions.find((p) => p._id === selectedId)
      if (!part) return false
      return this.evaluateDSL(cond.expression, part.attributes)
    })
  }

  private evaluateCategoryExpression(expression: string, selectedId?: string): boolean {
    if (!selectedId) return false
    const part = this.partOptions.find((p) => p._id === selectedId)
    if (!part) return false
    return this.evaluateDSL(expression, part.attributes)
  }

  private evaluateDSL(expression: string, context: Record<string, any>): boolean {
    try {
      const fn = new Function('attributes', `return ${expression}`)
      return !!fn(context)
    } catch (err) {
      console.warn(`DSL evaluation failed for: ${expression}`, err)
      return false
    }
  }
}
