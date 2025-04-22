import { Product, PartOption } from '@/models'
import { FastifyBaseLogger } from 'fastify'
import { evaluateDSL } from './helper'

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
/**
 * ConstraintResolverService
 *
 * This service applies constraint rules defined in a Product object to a given part configuration.
 * It validates if a selected set of partOption IDs complies with all constraint rules and dynamically
 * updates the list of available options based on exclusions.
 *
 * Rules are defined in a domain-specific language (DSL), allowing flexible, data-driven validation.
 *
 * It returns:
 * - Whether the configuration is valid
 * - Which options remain available per category (after applying exclusions)
 * - Which rules were violated (with messages and affected categories)
 */
export class ConstraintResolverService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly product: Product,
    // eslint-disable-next-line no-unused-vars
    private readonly partOptions: PartOption[],
    // eslint-disable-next-line no-unused-vars
    private readonly logger: FastifyBaseLogger
  ) {}

  /**
   * Resolves all constraint rules against the given selection.
   *
   * @param selected - Record of categoryId => partOptionId selected by the user
   * @returns ResolutionResult object including updated options and any violations
   */
  resolve(selected: Record<string, string>): ResolutionResult {
    // Start with a mutable version of the available options, one Set per category
    const availableOptions: Record<string, Set<string>> = Object.fromEntries(
      Object.entries(this.product.availableOptions).map(([category, ids]) => [
        category,
        new Set(ids)
      ])
    )

    const violations: ResolutionResult['violations'] = []

    // Evaluate each constraint rule
    for (const rule of this.product.constraints) {
      // Check if the rule's 'if' clause applies to current selection
      const ifMatch = this.evaluateIf(rule.if, selected)
      if (!ifMatch) continue

      // Apply 'require' conditions if any
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

      // Apply 'exclude' conditions and remove matching options
      if (rule.then.exclude) {
        for (const [category, ex] of Object.entries(rule.then.exclude)) {
          const excluded: string[] = []

          for (const option of availableOptions[category]) {
            const part = this.partOptions.find((p) => p._id === option)
            if (part && evaluateDSL(ex.expression, part.attributes, this.logger)) {
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

    // Format result: convert Set to array and return structured result
    return {
      valid: violations.length === 0,
      availableOptions: Object.fromEntries(
        Object.entries(availableOptions).map(([cat, set]) => [cat, Array.from(set)])
      ),
      violations
    }
  }

  /**
   * Evaluates the 'if' clause of a rule — all conditions must match for the rule to apply.
   */
  private evaluateIf(
    ifClause: Record<string, { expression: string }>,
    selected: Record<string, string>
  ): boolean {
    return Object.entries(ifClause).every(([category, cond]) => {
      const selectedId = selected[category]
      if (!selectedId) return false
      const part = this.partOptions.find((p) => p._id === selectedId)
      if (!part) return false
      return evaluateDSL(cond.expression, part.attributes, this.logger)
    })
  }

  /**
   * Evaluates a 'require' condition on a single selected part.
   */
  private evaluateCategoryExpression(expression: string, selectedId?: string): boolean {
    if (!selectedId) return false
    const part = this.partOptions.find((p) => p._id === selectedId)
    if (!part) return false
    return evaluateDSL(expression, part.attributes, this.logger)
  }
}
