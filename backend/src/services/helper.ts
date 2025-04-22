import { FastifyBaseLogger } from 'fastify'

/**
 * Evaluates a DSL expression against a part's attributes.
 * Uses a sandboxed function to interpret expressions like: `attributes.suspension === 'full'`.
 * @param expression The DSL string (e.g., "attributes.type == 'mountain'")
 * @param context The attributes object to evaluate against.
 * @param logger A logger instance to report errors.
 */
export const evaluateDSL = (
  expression: string,
  context: Record<string, any>,
  logger: FastifyBaseLogger // Add logger as a parameter
): boolean => {
  try {
    // Ensure context is not null/undefined before accessing properties
    if (!context) {
      logger.warn({ expression }, 'DSL evaluation skipped: context is null/undefined')
      return false
    }
    const fn = new Function('attributes', `return ${expression}`)
    return !!fn(context)
  } catch (err) {
    // Use the passed logger instance
    logger.warn({ err, expression, context }, 'DSL evaluation failed')
    return false
  }
}
